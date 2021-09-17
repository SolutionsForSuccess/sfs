<template>
    <div class="screen">
    <ion-backdrop v-if="isBackdrop"></ion-backdrop>
    <!-- <router-link to="/controlPanel"><ion-button expand="full" color="tertiary"><ion-icon name="hammer"></ion-icon>{{$t('backoffice.list.buttons.goToControlPanel')}}</ion-button></router-link>
    <router-link to="/tax"><ion-button expand="full" color="tertiary"><ion-icon name="arrow-round-back"></ion-icon>{{$t('backoffice.form.buttons.backToTaxesList')}}</ion-button></router-link> -->

    <ion-header v-if="!externalProp">
          <ion-toolbar>
            <ion-buttons slot="start">
              <ion-back-button default-href="/controlPanel" @click="$router.push({ name: 'Tax'})"></ion-back-button>
            </ion-buttons>
            <ion-label style="padding: 20px 100px;">
              <h1>{{title}}</h1>            
            </ion-label>
          </ion-toolbar>
    </ion-header>
    <br/>

    <ion-loading
        v-if="spinner"
        cssClass="my-custom-class"
        :message="$t('frontend.tooltips.loadRestaurant')"
      ></ion-loading>
    <div>
      <!-- <ion-card> -->
        <ion-item>
          <ion-label position="floating"><span style="color: red">*</span>{{$t('backoffice.form.fields.name')}}</ion-label>
          <ion-input type="text" name="name"
          @input="name = $event.target.value" 
          v-bind:value="name">
          </ion-input>
        </ion-item>
        <ion-item>
          <ion-label position="floating"><span style="color: red">*</span>{{$t('backoffice.form.fields.percent')}}</ion-label>
          <ion-input type="number" name="percent"
          @input="percent = $event.target.value" 
          v-bind:value="percent">
          </ion-input>
        </ion-item>       
        <ion-item>
           <ion-label>{{$t('backoffice.form.fields.available')}}</ion-label>
           <ion-checkbox slot="end" name="available"
                @ionChange="available = $event.target.checked"
                :checked="available">    
          </ion-checkbox>
        </ion-item>
      
      <br/>
      <ion-button expand="full" color="primary" :disabled="!isValidForm()" @click="saveTax()">{{ $t('backoffice.form.buttons.save') }}</ion-button>
    </div>
    </div>
</template>

<script>

import { Api } from '../api/api.js';

export default {

  name: 'taxForm',
   
  data () {
    return {
      modelName: 'Tax',
      /****** Form Data ******/
      id: null,
      name: '',
      percent: 0,
      // priority: 0,
      available: false,
      epos: null,

      isBackdrop: false,

      spinner: false,
    }
  },
  created: function(){
      this.init();
  },
   props: {
      externalProp: {type: Boolean, default: false},
  },
  computed: {
        title() {
            return this.id ? this.$t('backoffice.form.titles.taxEditTitle') :  this.$t('backoffice.form.titles.taxNewTitle');
        }
  },
  methods: {

        init(){
            this.id = this.$route.params.taxId;            
            if (this.id){
              const data = this.$store.state.backConfig.tax.find( t => t._id === this.id);
              if(data){
                  this.name = data.Name;
                  this.percent = data.Percentage;
                  this.available = data.Available;
                  this.epos = data.EposId;
              }
            }             
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
                          name: 'Tax',
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
            if (isNaN(this.percent)) return false
            if (this.percent == 0) return false

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
    saveTax: function(){

        if (this.isValidForm()){

            this.isBackdrop = true;
            let item = {
              "Name": this.name,
              "Percentage": this.percent,
              "Available": this.available,
            }

            //If I am editing
            if (this.id){
              item['_id'] = this.id;
              if (this.epos)
                  item["EposId"] = this.epos;
              this.spinner = true;
              Api.putIn(this.modelName, item)
                  .then(response => {
                        const index = this.$store.state.backConfig.tax.findIndex( t => t._id === this.id)
                        if(index !== -1) this.$store.state.backConfig.tax[index] = item;
                        this.showToastMessage(this.$t('backoffice.list.messages.messageEditSuccessTax'), "success");
                        this.name = '';
                        this.percent = 0;
                        this.available = false;
                        this.id = null;
                        this.spinner = false;
                        this.$router.push({
                          name: 'Tax', 
                        });
                        return response;
                  })
                  .catch(e => {
                        this.isBackdrop = false;
                        e;
                        this.spinner = false;
                        this.ifErrorOccured(this.saveTax);
                  })
            }
            else{
              //Else, I am created a new category
              this.spinner = true;
              Api.postIn(this.modelName, item)
                  .then(response => {
                      this.$store.state.backConfig.tax.push(response.data);
                      if(this.externalProp) return this.$emit("reloadTax", response.data._id);
                      this.showToastMessage(this.$t('backoffice.list.messages.messageCreateSuccessTax'), "success");
                      this.name = '';
                      this.percent = 0;
                      this.available = null;
                      this.spinner = false;
                      this.$router.push({
                        name: 'Tax', 
                      });
                      return response;
                  })
                  .catch(e => {
                      this.isBackdrop = false;
                      e;
                      this.spinner = false;
                      this.ifErrorOccured(this.saveTax);
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