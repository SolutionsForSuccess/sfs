<template>
    <div class="screen">
    <ion-backdrop v-if="isBackdrop"></ion-backdrop>

    <ion-header>
          <ion-toolbar>
            <ion-buttons slot="start">
              <ion-back-button default-href="/controlPanel" @click="$router.push({ name: 'Customer'})"></ion-back-button>
            </ion-buttons>
            <ion-label style="padding: 20px 100px;">
              <h1>{{title}}</h1>            
            </ion-label>
          </ion-toolbar>
    </ion-header>
    <br/>

      <!-- <ion-card> -->
   <ion-loading
        v-if="spinner"
        cssClass="my-custom-class"
        :message="$t('frontend.tooltips.loadRestaurant')"
  ></ion-loading>

    <div>
        <ion-item>
          <ion-label position="floating"><span style="color: red">*</span>{{$t('backoffice.form.fields.name')}}</ion-label>
          <ion-input type="text" name="name"
          @input="name = $event.target.value" 
          v-bind:value="name">
          </ion-input>
        </ion-item>
        <ion-item>
          <ion-label position="floating"><span style="color: red">*</span>{{$t('backoffice.form.fields.phone')}}</ion-label>
          <ion-input type="tel" name="name"
          @input="phone = $event.target.value" 
          v-bind:value="phone">
          </ion-input>
        </ion-item>
        <ion-item>
          <ion-label position="floating"><span style="color: red">*</span>{{$t('backoffice.form.fields.email')}}</ion-label>
          <ion-input type="email" name="emailAddress"
          @input="emailAddress = $event.target.value" 
          v-bind:value="emailAddress">
          </ion-input>
        </ion-item>
        <ion-item>
            <ion-label>{{$t('backoffice.form.fields.marketingConsent')}}</ion-label>
        </ion-item>
        <ion-item>
           <ion-label>{{$t('backoffice.form.fields.email')}}</ion-label>
           <ion-checkbox slot="end" name="mcemail" 
                @ionChange="mcemail = $event.target.checked"
                :checked="mcemail"  >
          </ion-checkbox>
        </ion-item>
        <ion-item>
           <ion-label>{{$t('backoffice.form.fields.phone')}}</ion-label>
           <ion-checkbox slot="end" name="mcphone" 
                @ionChange="mcphone = $event.target.checked" 
                v-bind:checked="mcphone">
          </ion-checkbox>
        </ion-item>
    
      <!-- </ion-card>  -->
      <br/>
      <ion-button expand="full" color="primary" :disabled="!isValidForm()" @click="saveCustomer()">{{ $t('backoffice.form.buttons.save') }}</ion-button>

    </div>
    </div>
</template>

<script>

import { Api } from '../api/api.js';

export default {

  name: 'customerForm',
   
  data () {
    return {
      modelName: 'Customer',
      /****** Form Data ******/
      id: null,
      name: '',
      emailAddress: '',
      phone: '',
      mcemail: false,
      mcphone: false,

      isBackdrop: false,

      spinner: false,
    }
  },
  created: function(){
      this.init();
  },
  computed: {
      title() {
          return this.id ? this.$t('backoffice.form.titles.customerEditTitle') :  this.$t('backoffice.form.titles.customerNewTitle');
      }
  },
  methods: {
    init(){
        this.id = this.$route.params.customerId;
        const data = this.$store.state.backConfig.allCustomer.find( c => c._id ===this.id)
        if(data){
          this.name = data.Name;
          this.phone = data.Phone;
          this.emailAddress = data.EmailAddress;

          if (data.MarketingConsent){
                this.mcemail = data.MarketingConsent.Email;
                this.mcphone = data.MarketingConsent.Phone;
          }
        }
       
        if(this.$route.params.customerName)
          this.name = this.$route.params.customerName;
        if(this.$route.params.Phone)
          this.phone = this.$route.params.Phone;
        if(this.$route.params.EmailAddress)
          this.emailAddress = this.$route.params.EmailAddress;

        //console.log(this.$route.params);
    },

    ifErrorOccured(action){
      return this.$ionic.alertController.create({
          title: this.$t('backoffice.list.messages.connectionError'),
          message: this.$t('backoffice.list.messages.connectionErrorMessage'),
          buttons: [
            {
              text: this.$t('backoffice.list.messages.buttons.goToList'),
              handler: () => {
                  this.$router.push({
                      name: 'Customer',
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
        if (this.name == "") return false
        if (this.emailAddress == "") return false
        if (this.phone == "") return false  
        if (this.emailAddress != ""){
            let emailRegex = /^[-\w.%+]{1,64}@(?:[A-Z0-9-]{1,63}\.){1,125}[A-Z]{2,63}$/i;
            if (emailRegex.test(this.emailAddress) == false)            
                return false
        }
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
    //Create or edit a new category

    saveCustomer: async function(){
      
        if (this.isValidForm())
        {
            this.isBackdrop = true;
            let item = {
              "Name": this.name,
              "Phone": this.phone,
              "EmailAddress": this.emailAddress,
            };
          
            if (this.mcemail  || this.mcphone)
            {
                let MarketingConsent = {
                        "Email": this.mcemail,
                        "Phone": this.mcphone
                    }
                item["MarketingConsent"] = MarketingConsent;
            }

            //If I am editing
            if (this.id){
              item['_id'] = this.id;
              this.spinner = true;
              Api.putIn(this.modelName, item)
                  .then(response => {
                        const index = this.$store.state.backConfig.allCustomer.findIndex( c => c._id === this.id);
                        if(index !== -1) this.$store.state.backConfig.allCustomer[index] = item;                        
                        this.showToastMessage(this.$t('backoffice.list.messages.messageEditSuccessCustomer'), "success");
                        this.name = '';
                        this.phone = '';
                        this.emailAddress = '';
                        this.mcemail = false;
                        this.mcphone = false;
                        this.spinner = false;
                        this.$router.push({
                          name: 'Customer', 
                        });
                        return response;
                  })
                  .catch(e => {
                        this.isBackdrop = false
                        console.log(e);
                        this.spinner = false;
                        this.ifErrorOccured(this.saveCustomer)
                  })
            }
            else{
              //Else, I am created a new category
              this.spinner = true
              await Api.postIn(this.modelName, item)
                  .then(response => {
                      this.showToastMessage(this.$t('backoffice.list.messages.messageCreateSuccessCustomer'), "success");
                      this.name = '';
                      this.phone = '';
                      this.emailAddress = '';
                      this.mcemail = false;
                      this.mcphone = false;
                      this.spinner = false;
                      this.$router.push({
                        name: 'Customer', 
                      });
                      return response;
                  })
                  .catch(e => {
                      this.isBackdrop = false
                      console.log(e);
                      this.spinner = false;
                      this.ifErrorOccured(this.saveCustomer)
                  })
            }
      }

    },
  },

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