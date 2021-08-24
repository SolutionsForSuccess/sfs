<template>
    
    <div>
        <!-- <ion-backdrop v-if="isBackdrop"></ion-backdrop> -->
        <!-- <ion-header>
            <ion-toolbar>
                <ion-buttons slot="start">
                <ion-back-button default-href="/controlPanel" @click="$router.push({ name: 'ControlPanel'})"></ion-back-button>
                </ion-buttons>
                <ion-label style="padding: 20px 100px;">
                <h1>{{title}}</h1>            
                </ion-label>
            </ion-toolbar>
        </ion-header>
        <br/> -->

     <ion-loading
        v-if="spinner"
        cssClass="my-custom-class"
        :message="$t('frontend.tooltips.loadRestaurant')"
    ></ion-loading>
    <div >
        <ion-item>
            <ion-label>{{$t('backoffice.form.titles.eposConfiguration')}}</ion-label>    
        </ion-item> 
        <ion-item>
              <ion-label>{{$t('backoffice.form.fields.epos')}}</ion-label>
              <ion-checkbox slot="end" name="eposIntegrate" 
                @ionChange="eposIntegrate = $event.target.checked"
                :checked="eposIntegrate"  >    
              </ion-checkbox>
        </ion-item>
        <div v-if="eposIntegrate">
            <ion-item>
                <ion-label position="floating"><span style="color: red">*</span>{{$t('backoffice.form.fields.endPointUrl')}}</ion-label>
                <ion-input type="text" name="ePosEndPointUrl"
                @input="ePosEndPointUrl = $event.target.value" 
                v-bind:value="ePosEndPointUrl">
                </ion-input>
            </ion-item>
            <ion-item>
                <ion-label position="floating"><span style="color: red">*</span>{{$t('backoffice.form.fields.eposToken')}}</ion-label>
                <ion-input :type="showePosToken" name="eposToken"
                @input="eposToken = $event.target.value" 
                v-bind:value="eposToken">
                </ion-input>
                <ion-chip slot="end" color="primary" outline="true" @click="changeePosToken()"><ion-icon name="eye"></ion-icon></ion-chip>
            </ion-item>
        </div>
        <br/>
        <ion-button expand="full" color="primary" :disabled="!isValidForm()" @click="saveSetting()">{{ $t('backoffice.form.buttons.save') }}</ion-button>

    </div>
    </div>
</template>

<script>
    import { Api } from '../api/api.js';

    export default {
        
        name: 'keySettingForm',
        data () {
            return {
                modelName: 'Restaurant',
                id: null,
                endPointUrl : '',
                apiLoginId: '',
                transactionKey:'',
                // smtpHost: '',
                // port: 0,
                // secure: false,
                // email: '',
                // password: '',
                // twFromNumber: '',
                // twAccountSid: '',
                // twToken: '',
                eposIntegrate: false,
                ePosEndPointUrl: '',
                eposToken: '',


                showApiLoginId: "password",
                showTransactionKey: "password",
                // showTwAccountSid: "password",
                // showTwToken: "password",
                showePosToken: "password",

                isBackdrop: false,

                spinner: false,
            }
        },
        created: function(){
            
            this.id = this.$store.state.user.RestaurantId
            const data = this.$store.state.backConfig.restaurant
            this.endPointUrl = data.EndPointUrl || '';
            this.apiLoginId = data.ApiLoginId || '';
            this.transactionKey = data.TransactionKey || '';                           
            if (data.EposIntegrate) {
                if (data.EposIntegrate == true) {
                    this.eposIntegrate = true;
                    this.ePosEndPointUrl = data.EPosEndPointUrl;
                    this.eposToken = data.EposToken;
                }
            }
        },
        computed: {
            title() {
                return this.id ? this.$t('backoffice.form.titles.keySettingEditTitle') :  this.$t('backoffice.form.titles.keySettingNewTitle');
            }
        },
        methods: {

            ifErrorOccured(action){
                return this.$ionic.alertController.create({
                    title: this.$t('backoffice.list.messages.connectionError'),
                    message: this.$t('backoffice.list.messages.connectionErrorMessage'),
                    buttons: [
                        {
                        text: this.$t('backoffice.list.messages.buttons.goToAdministration'),
                        handler: () => {
                            this.$router.push({
                                name: 'ControlPanel',
                            });
                        }
                        },
                        {
                        text: this.$t('backoffice.list.messages.buttons.retry'),
                        handler: () => {
                            action();
                        }
                        }
                    ]
                    })
                    .then(a => a.present());
            },

            isValidForm(){
                // let errors = [];
                if (this.endPointUrl == "") return false
                if (this.apiLoginId == "") return false
                if (this.transactionKey == "") return false
               

                if (this.eposIntegrate)
                    if (this.ePosEndPointUrl == '' || this.eposToken == '')
                        return false

                return true

               
            },

            ShowMessage(type, message, topic='') {
                return this.$ionic.alertController
                .create({
                    cssClass: 'my-custom-class',
                    header: type,
                    subHeader: topic,
                    message: message,
                    buttons: [this.$t('backoffice.form.messages.buttons.ok')],
                })
                .then(a => a.present())
            },

            showToastMessage(message, tColor){
                return this.$ionic.toastController.create({
                    color: tColor,
                    position: 'top',
                    duration: 3000,
                    message: message,
                    showCloseButton: false
                }).then(a => a.present())
            },
            
            changeePosToken(){
                if (this.showePosToken == "password")
                    this.showePosToken = "text"
                else
                    this.showePosToken = "password"
            },

            saveSetting: async function(){

                if (this.isValidForm()){
                    this.isBackdrop = true;
                    let item = {
                        "EndPointUrl": this.endPointUrl,
                        "ApiLoginId": this.apiLoginId,
                        "TransactionKey": this.transactionKey,                       
                        "EposIntegrate": this.eposIntegrate
                    }
                    if (this.eposIntegrate)
                    {
                        item["EPosEndPointUrl"] = this.ePosEndPointUrl
                        item["EposToken"] = this.eposToken
                    }
                    //If I am editing
                    if (this.id){
                        item['_id'] = this.id;
                        this.spinner = true;
                        Api.putIn(this.modelName, item)
                        .then(response => {
                                this.$store.state.backConfig.restaurant = item;
                                this.showToastMessage(this.$t('backoffice.list.messages.messageEditSuccessSetting'), "success");
                                this.spinner = false;
                                // this.$router.push({
                                //     name: 'ControlPanel', 
                                // });
                                return response;
                        })
                        .catch(e => {
                            this.isBackdrop = false;
                            console.log(e);
                            this.spinner = false;
                            this.ifErrorOccured(this.saveSetting);
                        })
                    }
                   
                }
            },
        }
    }
</script>

<style>

@media only screen and (min-width : 1024px){

    .screen{
        padding-left: 10%;
        padding-right: 10%;
        border: #edf1ee solid 1px;
        margin-right: 10%;
        margin-left: 10%;
        /* border-radius: 25px; */
    }

}

</style>