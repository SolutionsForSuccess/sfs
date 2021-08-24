<template>
    <div>
        
        <ion-toolbar>
            <ion-title>{{ parent.$t('backoffice.form.titles.creditSetting') }}</ion-title>
        </ion-toolbar>

         <ion-loading
        v-if="spinner"
        cssClass="my-custom-class"
        :message="$t('frontend.tooltips.loadRestaurant')"
    ></ion-loading>

        <div>

            <ion-list>
                <ion-item>
                    <!-- <ion-label>{{parent.$t('frontend.menu.restaurant')}}</ion-label> -->
                    <ion-select interface="popover" :ok-text="parent.$t('backoffice.form.messages.buttons.ok')" :cancel-text="parent.$t('backoffice.form.messages.buttons.dismiss')" style="padding: 0"
                    @ionChange="feeType = $event.target.value" v-bind:value="feeType">
                        <ion-select-option key="Percent" value="Percent">{{parent.$t('backoffice.form.fields.percent')}}</ion-select-option>
                        <ion-select-option key="Fixed" value="Fixed">{{parent.$t('backoffice.form.fields.fixed')}}</ion-select-option>
                    </ion-select>
                </ion-item>
            </ion-list>

            <ion-list>
                <ion-item>
                    <!-- <ion-label>{{parent.$t('frontend.menu.restaurant')}}</ion-label> -->
                    <ion-select interface="popover" :ok-text="parent.$t('backoffice.form.messages.buttons.ok')" :cancel-text="parent.$t('backoffice.form.messages.buttons.dismiss')" style="padding: 0"
                    @ionChange="feeFrecuency = $event.target.value" v-bind:value="feeFrecuency">
                        <ion-select-option key="Monthy" value="Monthy">{{parent.$t('backoffice.form.fields.monthy')}}</ion-select-option>
                        <ion-select-option key="Anual" value="Anual">{{parent.$t('backoffice.form.fields.anual')}}</ion-select-option>
                    </ion-select>
                </ion-item>
            </ion-list>

            <ion-item>
                <ion-label position="floating">{{parent.$t('backoffice.form.fields.amount')}}</ion-label>
                <ion-input type="number" name="minTimeToCook"
                @input="feeAmount = $event.target.value" 
                v-bind:value="feeAmount">
                </ion-input>
            </ion-item>

            <ion-button expand="full" color="primary" :disabled="!isValidForm()" @click="saveSetting()">{{ parent.$t('backoffice.form.buttons.save') }}</ion-button>

        </div>
        
    </div>
</template>

<script>
import { Api } from '../api/api'

export default {

    data(){

        return {

            feeType: "Percent",
            feeFrecuency: "Monthy",
            feeAmount: 0,

            setting: null,

            spinner: false,
        }

    },
    created(){
        this.setting = this.$store.state.backConfig.setting;
        this.feeType = this.setting.creditFeeType
        this.feeFrecuency = this.setting.creditFeeFrecuency
        this.feeAmount = this.setting.creditFeeAmount
    },
    props: {
        parent: { type: Object, default: null },
    },
    methods:{

        isValidForm(){
            if (this.feeType == "")
                return false
            if (this.feeFrecuency == "")
                return false
            if (this.feeAmount == 0)
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

        async saveSetting(){

            if (this.isValidForm){
                this.spinner = true
                this.setting.creditFeeType = this.feeType
                this.setting.creditFeeFrecuency = this.feeFrecuency
                this.setting.creditFeeAmount = this.feeAmount

                await Api.putIn('Setting', this.setting)
                .then(() => {
                    this.$store.state.backConfig.setting = this.setting;
                    this.showToastMessage('The credit setting was saved successfully.', 'success')
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
