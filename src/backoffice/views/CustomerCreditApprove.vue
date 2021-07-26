<template>
    <div>

      <!-- <ion-card> -->
    <div v-if="spinner">
        <ion-spinner name="lines" class="spinner"></ion-spinner>
    </div>
    <div v-else>

        <ion-item>
            <span style="color: red">*</span><ion-label>{{parent.$t('backoffice.form.fields.DateFrom')}} (MM-dd-yyyy)</ion-label>
            <ion-datetime name="dateFrom" @ionChange="dateFrom = $event.target.value" 
                            v-bind:value="dateFrom"
                            :placeholder="parent.$t('backoffice.form.titles.dateFromSelect')" display-format="YYYY-MM-DD">
            </ion-datetime>
        </ion-item>

        <ion-item>
            <span style="color: red">*</span><ion-label>{{parent.$t('backoffice.form.fields.DateTo')}} (MM-dd-yyyy)</ion-label>
            <ion-datetime name="dateFrom" @ionChange="dateTo = $event.target.value" 
                            v-bind:value="dateTo"
                            :placeholder="parent.$t('backoffice.form.titles.dateToSelect')" display-format="YYYY-MM-DD">
            </ion-datetime>
        </ion-item>

        <ion-item>
            <span style="color: red">*</span><ion-label>{{parent.$t('backoffice.form.fields.DateLimit')}} (MM-dd-yyyy)</ion-label>
            <ion-datetime name="dateFrom" @ionChange="dateLimit = $event.target.value" 
                            v-bind:value="dateLimit"
                            :placeholder="parent.$t('backoffice.form.titles.dateToSelect')" display-format="YYYY-MM-DD">
            </ion-datetime>
        </ion-item>

      <br/>

      <div>
          <!-- <ion-button expand="full" color="primary" :disabled="!isValidForm()" @click="approve()">{{ parent.$t('backoffice.form.buttons.save') }}</ion-button> -->
          <ion-button expand="full" color="primary" :disabled="!isValidForm()" @click="approve()">Approve</ion-button>
      </div>

    </div>
    </div>
</template>

<script>

import { Api } from '../api/api.js';
export default {
    
    name: 'creditForm',

    data () {
    return {
        modelName: 'customercredit',
      
        dateFrom: '',
        dateTo: '',
        dateLimit: '',

        spinner: false,
        }
    },
    created(){
        this.init()
    },
    props: {
        parent: { type: Object, default: null },
        cId: { type: String},
    },
    methods:{
        init(){
            this.$ionic.loadingController
            .create({
                cssClass: 'my-custom-class',
                message: this.parent.$t('backoffice.titles.loading'),
                backdropDismiss: true
            })
            .then(loading => {
                loading.present()
                setTimeout(() => {  // Some AJAX call occurs
                    Api.fetchById('customercredit', this.cId)
                        .then(response => {
                        this.dateFrom = response.data.DateFrom;
                        this.dateTo = response.data.DateTo;
                        this.dateLimit = response.data.PayLimitDate;

                        loading.dismiss();
                        return response;
                        })
                        .catch(e => {
                            console.log(e);
                            loading.dismiss();
                        })
                })
            })  
        },
        isValidForm(){
            if (this.dateFrom == "")
                return false
            if (this.dateTo == "")
                return false
            if (this.dateLimit == "")
                return false
            return true
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
        saveSetting(){

            if (this.isValidForm){

                const item = {
                    "_id": this.cId,
                    "DateFrom": this.dateFrom,
                    "DateTo": this.dateTo,
                    "PayLimitDate": this.dateLimit,
                    "State": 1
                }

                Api.putIn('Setting', item)
                .then(() => {
                    this.showToastMessage('The credit setting was accepted successfully.', 'success')
                    this.spinner = false
                    this.$ionic.modalController.dismiss(null);
                })
                .catch(e => {
                    console.log(e)
                    this.showToastMessage(e, 'danger')
                    this.spinner = false
                    this.$ionic.modalController.dismiss(null);
                })
            }
            
        }
    }

}
</script>