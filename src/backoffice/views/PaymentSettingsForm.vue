<template>
<div id="ProductForm">
 

     <ion-loading
        v-if="spinner"
        cssClass="my-custom-class"
        :message="$t('frontend.tooltips.loadRestaurant')"
      ></ion-loading>
    <div >
        <!-- SHIF4 -->
        <ion-card>
            <div style="display: flex; justify-content: space-between;">
                <ion-item>
                <h5> Shift4</h5>
                <ion-toggle color="primary"
                    :checked="payMethod==='SHIFT4'? true: false"
                ></ion-toggle>
                </ion-item>
                    <ion-button
                        fill="clear"
                        shape="round"                             
                        class="list-gourp-btn"
                        side="end"   
                            @click="payShow=='SHIFT4'?payShow='' :payShow='SHIFT4'"                      
                        >
                        <ion-icon v-if="payShow==='SHIFT4'" slot="icon-only"  icon="md-arrow-drop-down"  class="more-grid" ></ion-icon>
                        <ion-icon v-else slot="icon-only"  icon="md-arrow-drop-right"  class="more-grid" ></ion-icon>
                    </ion-button>
            </div>
            <div v-if="payShow==='SHIFT4'">
                <ion-item>
                    <ion-label position="floating"><span style="color: red">*</span>EndPoint URL Shift4 </ion-label>
                    <ion-input type="text" name="EndPointURLShift4"
                        @input="EndPointURLShift4 = $event.target.value" 
                        v-bind:value="EndPointURLShift4">
                    </ion-input>
                </ion-item>
                <ion-item>
                     <ion-label position="floating">
                        <span style="color: red" >*</span>{{$t('backoffice.form.fields.authenticationToken')}} ECom
                    </ion-label>
                    <ion-input type="text" name="tokenShift4"
                        @input="tokenShift4 = $event.target.value" 
                        v-bind:value="tokenShift4">
                    </ion-input>
                </ion-item>
                <ion-item>
                     <ion-label position="floating">
                        {{$t('backoffice.form.fields.authenticationTokenMoto')}}
                    </ion-label>
                    <ion-input type="text" name="tokenMotoShift4"
                        @input="tokenMotoShift4 = $event.target.value" 
                        v-bind:value="tokenMotoShift4">
                    </ion-input>
                </ion-item>
                <ion-item>
                      <ion-label position="floating">
                    {{$t('backoffice.form.fields.authenticationTokenFB')}}
                    </ion-label>
                    <ion-input type="text" name="tokenFBShift4"
                        @input="tokenFBShift4 = $event.target.value" 
                        v-bind:value="tokenFBShift4">
                    </ion-input>
                </ion-item>
                <ion-button  
                  color="primary"
                  :disabled="EndPointURLShift4==''? true : false" 
                  @click="activateSHIFT4()">
                {{$t('backoffice.form.fields.active')}} </ion-button>
            </div>
            
        </ion-card>

        <!-- PayFabric -->
        <ion-card>
            <div style="display: flex; justify-content: space-between;">
                <ion-item>
                <h5> PayFabric</h5>
                <ion-toggle color="primary"
                :checked="payMethod==='PAYFABRIC'? true: false"></ion-toggle>
            </ion-item>
                <ion-button
                        fill="clear"
                        shape="round"                             
                        class="list-gourp-btn"
                        side="end"   
                            @click="payShow=='PayFabric'?payShow='' :payShow='PayFabric'"                    
                        >
                        <ion-icon v-if="payShow==='PayFabric'" slot="icon-only"  icon="md-arrow-drop-down"  class="more-grid" ></ion-icon>
                        <ion-icon v-else slot="icon-only"  icon="md-arrow-drop-right"  class="more-grid" ></ion-icon>
                    </ion-button>
            </div>
            <div v-if="payShow==='PayFabric'">
                
              <ion-item>
                    <ion-label position="floating">
                    DeviceId:
                    </ion-label>
                    <ion-input type="text" name="DeviceIdPayFabric"
                        @input="DeviceIdPayFabric = $event.target.value" 
                        v-bind:value="DeviceIdPayFabric">
                    </ion-input>
              </ion-item>
            
               <ion-item>
                    <ion-label position="floating">
                    SetupId:
                    </ion-label>
                    <ion-input type="text" name="SetupIdIdPayFabric"
                        @input="SetupIdIdPayFabric = $event.target.value" 
                        v-bind:value="SetupIdIdPayFabric">
                    </ion-input>
               </ion-item>
            
               <ion-item>
                    <ion-label position="floating">
                    EndPointUrl:
                    </ion-label>
                    <ion-input type="text" name="EndPointUrlPayFabric"
                        @input="EndPointUrlPayFabric = $event.target.value" 
                        v-bind:value="EndPointUrlPayFabric">
                    </ion-input>
               </ion-item>

                    <ion-button 
                    color="primary"                    
                    :disabled="DeviceIdPayFabric =='' || SetupIdIdPayFabric =='' || EndPointUrlPayFabric == ''? true : false"
                    @click="activatePayFabric()">
                    {{$t('backoffice.form.fields.active')}}</ion-button>
            </div>
        </ion-card>

        <!-- NAB -->
        <ion-card>
            <div  style="display: flex; justify-content: space-between;">
            <ion-item> 
                <h5> NAB</h5>
                <ion-toggle color="primary"
                  :checked="payMethod==='NAB'? true: false"></ion-toggle>
            </ion-item>
                <ion-button
                        fill="clear"
                        shape="round"                             
                        class="list-gourp-btn"
                        side="end"   
                        @click="payShow=='NAB'?payShow='' :payShow='NAB'"                      
                        >
                        <ion-icon v-if="payShow==='NAB'" slot="icon-only"  icon="md-arrow-drop-down"  class="more-grid" ></ion-icon>
                        <ion-icon v-else slot="icon-only"  icon="md-arrow-drop-right"  class="more-grid" ></ion-icon>
                    </ion-button>
            </div>
            <div v-if="payShow==='NAB'">
                <ion-item>
                     <ion-label position="floating">
                        EndPointUrl:
                    </ion-label>
                    <ion-input type="text" name="EndPointUrlNAB"
                        @input="EndPointUrlNAB = $event.target.value" 
                        v-bind:value="EndPointUrlNAB">
                    </ion-input>
                </ion-item>

                <ion-item>
                     <ion-label position="floating">
                        EpiId:
                    </ion-label>
                    <ion-input type="text" name="EpiIdNAB"
                        @input="EpiIdNAB = $event.target.value" 
                        v-bind:value="EpiIdNAB">
                    </ion-input>
                </ion-item>

                <ion-item>
                     <ion-label position="floating">
                    EpiKey:
                    </ion-label>
                    <ion-input type="text" name="EpiKeyNAB"
                        @input="EpiKeyNAB = $event.target.value" 
                        v-bind:value="EpiKeyNAB">
                    </ion-input>
                </ion-item>
               
                <ion-button 
                color="primary" 
                :disabled="EndPointUrlNAB =='' || EpiIdNAB == '' || EpiKeyNAB == ''? true : false"
                @click="activateNAB()">{{$t('backoffice.form.fields.active')}} </ion-button>
            </div>
        </ion-card>

        <!-- Tsys -->
        <ion-card>
            <div  style="display: flex; justify-content: space-between;">
                <ion-item>
                    <h5> Tsys</h5>
                    <ion-toggle color="primary"
                     :checked="payMethod==='TSYS'? true: false"></ion-toggle>
                </ion-item>
                <ion-button
                            fill="clear"
                            shape="round"                             
                            class="list-gourp-btn"
                            side="end"   
                            @click="payShow=='TSYS'?payShow='' :payShow='TSYS'"                      
                            >
                            <ion-icon v-if="payShow==='TSYS'" slot="icon-only"  icon="md-arrow-drop-down"  class="more-grid" ></ion-icon>
                            <ion-icon v-else slot="icon-only"  icon="md-arrow-drop-right"  class="more-grid" ></ion-icon>
                </ion-button>
            </div>
            <div v-if="payShow==='TSYS'">
                
               <ion-item>
                    <ion-label position="floating">
                        DeviceID:
                    </ion-label>
                    <ion-input type="text" name="DeviceIDtSYS"
                        @input="DeviceIDtSYS = $event.target.value" 
                        v-bind:value="DeviceIDtSYS">
                    </ion-input>
               </ion-item>
            
                <ion-item>
                     <ion-label position="floating">
                        TransactionKey:
                    </ion-label>
                    <ion-input type="text" name="TransactionKeytSYS"
                        @input="TransactionKeytSYS = $event.target.value" 
                        v-bind:value="TransactionKeytSYS">
                    </ion-input>
                </ion-item>
               
               <ion-item>
                    <ion-label position="floating">
                        DeveloperID:
                    </ion-label>
                    <ion-input type="text" name="DeveloperIDtSYS"
                        @input="DeveloperIDtSYS = $event.target.value" 
                        v-bind:value="DeveloperIDtSYS">
                    </ion-input>
               </ion-item>
                
                 <ion-button   color="primary" @click="activateTsys()">{{$t('backoffice.form.fields.active')}}</ion-button>
            </div>
        </ion-card>

        <!-- Authorize.net -->
        <ion-card v-if="0">
            <div  style="display: flex; justify-content: space-between;">
                <ion-item>
                    <h5> Authorize.Net</h5>
                    <ion-toggle color="primary"
                     :checked="payMethod==='AUTH'? true: false"></ion-toggle>
                </ion-item>
                <ion-button
                    fill="clear"
                    shape="round"                             
                    class="list-gourp-btn"
                    side="end"   
                    @click="payShow=='AUTH'?payShow='' :payShow='AUTH'"                      
                    >
                    <ion-icon v-if="payShow==='AUTH'" slot="icon-only"  icon="md-arrow-drop-down"  class="more-grid" ></ion-icon>
                    <ion-icon v-else slot="icon-only"  icon="md-arrow-drop-right"  class="more-grid" ></ion-icon>
                </ion-button>
            </div>
            <ion-item  v-if="payShow==='AUTH'" >
            <!-- <ion-item> -->
                <ion-button   expand="full"  color="primary" @click="activeAuthNet()">{{$t('backoffice.form.fields.active')}}</ion-button>
            </ion-item>
        </ion-card>

    </div>
</div>
</template>

<script>
import { Api } from '../api/api';
import { payAuthorizeNet } from '../api/payments';

export default {
    name: 'paymentSettingForm',
    
    data () {
        return {
            modelName: 'Restaurant',
            id: null,
            screenWidth: 0,
            isBackdrop: false,
            spinner: false,

            //Shift4
            payShift4: false,
            tokenShift4: '',
            tokenMotoShift4: '',
            tokenFBShift4: '',
            EndPointURLShift4: '',

            //Authorize.net
            payAuth: false,

            payMethod: '',
            paymentMethods: [],

            //PayFabric
            payPayFabric: false,
            DeviceIdPayFabric: '',
            SetupIdIdPayFabric: '',
            EndPointUrlPayFabric: '',

            //NAB
            payNAB: false,
            EndPointUrlNAB: '',
            EpiIdNAB: '',
            EpiKeyNAB: '',

            //Tsys
            payTsys: false,
            DeviceIDtSYS: '',   
            TransactionKeytSYS: '',
            DeveloperIDtSYS: '',

            payShow: '',
        }
    },
    created(){
        this.screenWidth = screen.width;
        this.id = this.$store.state.user.RestaurantId
        this.getMethodPayData()
        this.getPaymentData()
    },
    computed: {
        title() {
            return this.$t('backoffice.form.titles.changePaymentSetting');
        }
    },
    methods: {

        async getMethodPayData(){
            const payMethodTable = this.$store.state.backConfig.methodspay;

            if (payMethodTable.length > 0){
                this.DeviceIdPayFabric = payMethodTable[0].DeviceIdPayFabric
                this.SetupIdIdPayFabric = payMethodTable[0].SetupIdIdPayFabric
                this.EndPointUrlPayFabric = payMethodTable[0].EndPointUrlPayFabric

                this.DeviceIDtSYS = payMethodTable[0].DeviceIDtSYS;
                this.TransactionKeytSYS = payMethodTable[0].TransactionKeytSYS;
                this.DeveloperIDtSYS = payMethodTable[0].DeveloperIDtSYS;

                this.EndPointUrlNAB = payMethodTable[0].EndPointUrlNAB
                this.EpiIdNAB = payMethodTable[0].EpiIdNAB
                this.EpiKeyNAB = payMethodTable[0].EpiKeyNAB

                this.EndPointURLShift4 = payMethodTable[0].EndPointURLShift4
            }
          
        },

        getPaymentData(){
              const data = this.$store.state.backConfig.restaurant;
             
            if (data.PayMethod){
                this.payMethod = data.PayMethod
                this.paymentMethods = data.PaymentMethods 
              }
            else{
                this.showToastMessage("Aún no se han configurado los datos del restaurante. " + 
                        "Por favor, configure primero los datos del restaurante", "danger")
            } 
        },

        isValidToken(method){
            if (method === 'SHIFT4')
            {
                if (this.EndPointURLShift4 != '')
                    return true
            }
            return false
        },

        async activateSHIFT4(){
              try {

                if (this.tokenShift4 !== '' && this.tokenMotoShift4 !== '' && this.tokenFBShift4 !== ''){
                     this.spinner = true;
                    let items = {
                        "payMethod": "SHIFT4",
                        "EndPointURLShift4": this.EndPointURLShift4 ,
                        "authToken": this.tokenShift4,
                        "authTokenMoto": this.tokenMotoShift4,
                        "authTokenFB": this.tokenFBShift4
                    } 
                    const res = await payAuthorizeNet.activatePaymentMethod(items)
                    if (res.status == 200 && res.statusText === 'OK')  {
                        if (res.data.msg != "error"){
                            this.tokenShift4 = '';
                            this.tokenMotoShift4 = '';
                            this.tokenFBShift4 = '';
                            this.updateRestaurant('SHIFT4', null);
                        }
                        else
                            this.showToastMessage(this.$t('backoffice.form.messages.incorrectToken'), 'danger')
                    }
                    else
                        this.showToastMessage(this.$t('backoffice.form.messages.activationMethodError'), 'danger')
                }
                if(this.EndPointURLShift4 && this.payMethod==='SHIFT4'){
                    const pItem = {
                        "EndPointURLShift4": this.EndPointURLShift4                   
                    }
                    this.updateRestaurant('SHIFT4', pItem);
                }

                this.spinner = false;
                               
              } catch (error) {
                error;
                this.spinner = false;
                this.showToastMessage(this.$t('backoffice.form.messages.activationMethodError'), 'danger')
              }
        },

         async activatePayFabric(){
            if (this.DeviceIdPayFabric !== '' && this.SetupIdIdPayFabric !== '' && this.EndPointUrlPayFabric !== ''){
              try {
                this.spinner = true;
                const pItem = {
                   "DeviceIdPayFabric": this.DeviceIdPayFabric,
                    "SetupIdIdPayFabric":this.SetupIdIdPayFabric,
                    "EndPointUrlPayFabric":this.EndPointUrlPayFabric
                }
                this.updateRestaurant('PAYFABRIC', pItem);                
              } catch (error) {
                  error;
                  this.spinner = false;
              }
            }
        },

        async activateNAB(){
            if (this.EndPointUrlNAB !== '' && this.EpiIdNAB !== '' && this.EpiKeyNAB !== ''){
              try {
                this.spinner = true;
                const pItem = {
                    "EndPointUrlNAB": this.EndPointUrlNAB,
                    "EpiIdNAB":this.EpiIdNAB,
                    "EpiKeyNAB":this.EpiKeyNAB
                }
                this.updateRestaurant('NAB', pItem);                
              } catch (error) {
                  error;
                  this.spinner = false;
              }
            }
        },

         async activateTsys(){
            if (this.DeviceIDtSYS !== '' && this.TransactionKeytSYS !== '' && this.DeveloperIDtSYS !== ''){
              try {
                this.spinner = true;
                const pItem = {
                      "DeviceIDtSYS": this.DeviceIDtSYS,
                        "TransactionKeytSYS":this.TransactionKeytSYS,
                        "DeveloperIDtSYS":this.DeveloperIDtSYS
                }              
                this.updateRestaurant('TSYS', pItem);                     
                  
              } catch (error) {
                  error;
                  this.spinner = false;
              }
            }
        },

         async activeAuthNet(){
              try {
                this.spinner = true;
                           
                this.updateRestaurant('AUTH', null);                     
                  
              } catch (error) {
                  error;
                  this.spinner = false;
              }
        },


        async updateRestaurant(payMethod, pItem){
           try {
               if(pItem !== null){
                const payMethodTable = await Api.fetchAll('methodpay');
                if (payMethodTable.data.length > 0){
                        pItem._id = payMethodTable.data[0]._id
                        await Api.putIn('methodpay', pItem)
                        const index = this.$store.state.backConfig.methodspay.find( p => p._id === pItem._id);
                        if(index !== -1) this.$store.state.backConfig.methodspay[index] = pItem;
                    }
                else
                    await Api.postIn('methodpay', pItem)

               }
                this.paymentMethods.push(payMethod);
                const resta = this.$store.state.backConfig.restaurant;
                resta.PaymentMethods = this.paymentMethods;
                resta.HasPaymentCardConfig = true;
                resta.PayMethod = payMethod;
                await Api.putIn(this.modelName, resta);
                this.$store.state.backConfig.restaurant = resta;
                this.getPaymentData();
                this.payShow = '';
                this.spinner = false
               
           } catch (error) {
               error;
               this.spinner = false
               
           } 
               

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