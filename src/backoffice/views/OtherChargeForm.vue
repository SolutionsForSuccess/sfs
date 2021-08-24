<template>
    <div class="screen">
    <ion-backdrop v-if="isBackdrop"></ion-backdrop>
    <!-- <router-link to="/controlPanel"><ion-button expand="full" color="tertiary"><ion-icon name="hammer"></ion-icon>{{$t('backoffice.list.buttons.goToControlPanel')}}</ion-button></router-link>
    <router-link to="/otherCharge"><ion-button expand="full" color="tertiary"><ion-icon name="arrow-round-back"></ion-icon>{{$t('backoffice.form.buttons.backToOtherChargesList')}}</ion-button></router-link> -->

    <ion-header>
          <ion-toolbar>
            <ion-buttons slot="start">
              <ion-back-button default-href="/controlPanel" @click="$router.push({ name: 'OtherCharge'})"></ion-back-button>
            </ion-buttons>
            <ion-label style="padding: 20px 100px;">
              <h1>{{title}}</h1>            
            </ion-label>
          </ion-toolbar>
    </ion-header>
    <br/>

    <!-- <ion-card> -->
     <div v-if="spinner">
        <ion-progress-bar type="indeterminate"></ion-progress-bar>
    </div>
    <div >
            <ion-item>
            <ion-label position="floating"><span style="color: red">*</span>{{$t('backoffice.form.fields.name')}}</ion-label>
            <ion-input type="text" name="name"
            @input="name = $event.target.value" 
            v-bind:value="name">
            </ion-input>
            </ion-item>

            <ion-item>
            <ion-label position="floating"><span style="color: red">*</span>{{$t('backoffice.form.fields.productMin')}}</ion-label>
            <ion-input type="number" name="productMin"
            @input="productMin = $event.target.value" 
            v-bind:value="productMin">
            </ion-input>
            </ion-item>

            <ion-item>
            <ion-label position="floating"><span style="color: red">*</span>{{$t('backoffice.form.fields.productMax')}}</ion-label>
            <ion-input type="number" name="productMax"
            @input="productMax = $event.target.value" 
            v-bind:value="productMax">
            </ion-input>
            </ion-item>

            <ion-item>
            <ion-label position="floating"><span style="color: red">*</span>{{$t('backoffice.form.fields.extraCharge')}}</ion-label>
            <ion-input type="number" name="price"
            @input="price = $event.target.value" 
            v-bind:value="price">
            </ion-input>
            </ion-item>

            <ion-list>
                <ion-list-header>
                <ion-label>
                    <span style="color: red">*</span><router-link to="/product">{{$t('backoffice.form.fields.product')}}</router-link>
                </ion-label>
                </ion-list-header>

                <ion-item>
                <ion-label>{{$t('backoffice.form.titles.selectAProduct')}}</ion-label>
                <ion-select  :ok-text="$t('backoffice.form.messages.buttons.ok')" :cancel-text="$t('backoffice.form.messages.buttons.dismiss')"
                @ionChange="productId = $event.target.value" v-bind:value="productId">
                    <ion-select-option v-for="product in products" v-bind:key="product.Id" v-bind:value="product._id" >{{product.Name}}</ion-select-option>
                </ion-select>
                </ion-item>

            </ion-list>

            <ion-item>
            <ion-label>{{$t('backoffice.form.fields.available')}}</ion-label>
            <ion-checkbox slot="end" name="available" 
                @ionChange="available = $event.target.checked"
                :checked="available"  >    
            </ion-checkbox>
            </ion-item>

        <!-- </ion-card>  -->

          <br/>fdg
          <ion-button expand="full" color="primary" :disabled="!isValidForm() || spinner" @click="saveOtherCharge()">{{ $t('backoffice.form.buttons.save') }}</ion-button>
    </div>
    </div>
</template>

<script>

import { Api } from '../api/api.js';

export default {

  name: 'otherChargeForm',
   
  data () {
    return {
      modelName: 'OtherCharges',
       /****** Form Data ******/
      id: null,
      name: '',
      productMin: 0,
      productMax: 0,
      price: 0,
      productId: null,
      products: [],
      available: false,

      isBackdrop: false,

      spinner: false,

    }
  },
  created: function(){
    this.init();
    
  },
  computed: {
        title() {
            return this.id ? this.$t('backoffice.form.titles.otherChargeEditTitle') :  this.$t('backoffice.form.titles.otherChargeNewTitle');
        }
  },
  methods: {
    init(){       
    
        this.id = this.$route.params.otherChargeId;
        this.products = this.$store.state.backConfig.product 
        const data = this.$store.state.backConfig.othercharges.find(o => o._id === this.id)
        if(data){
          this.name = data.Name;
          this.productMax = data.ProductMax;
          this.productMin = data.ProductMin;
          this.price = data.Price
          this.productId = data.ProductId;
          this.available = data.Available;
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
                      name: 'OtherChargeForm',
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
        if (this.name == "")  return false
        if (isNaN(this.productMin))  return false
        if (isNaN(this.productMax))  return false
        if (this.productMin == 0)  return false
        if (this.productMax < 2) return false
        if (isNaN(this.price))  return false
        if (this.price == 0)  return false
        if (this.productId == null)  return false
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

   
    //Create or edit a new product
    saveOtherCharge: function(){

      if (this.isValidForm()){

            this.isBackdrop = true;
            let item = {
            "Name": this.name,
            "ProductMin": this.productMin,
            "ProductMax": this.productMax,
            "Price": this.price,
            "ProductId": this.productId,
            "Available": this.available,
            }
            //If I am editing
            if (this.id){
              item['_id'] = this.id;
              this.spinner = true;
              Api.putIn(this.modelName, item)
                  .then(response => {
                        this.name = '';
                        this.productMax = 0;
                        this.productMin = 0;
                        this.price = 0;
                        this.productId = null;
                        this.available = false;
                        this.spinner = false;
                        this.$router.push({
                          name: 'OtherCharge', 
                        });
                        const index = this.$store.state.backConfig.othercharges.findIndex(o => o._id === this.id);
                        if(index !== -1) this.$store.state.backConfig.othercharges[index] = item;
                        this.showToastMessage(this.$t('backoffice.list.messages.messageEditSuccessOtherCharges'), "success");
                        return response;
                  })
                  .catch(e => {
                        this.isBackdrop = false;
                        console.log(e);
                        this.spinner = false;
                        this.ifErrorOccured(this.saveOtherCharge);
                  })
            }
            else{
              //Else, I am created a new category
              this.spinner = true;
              Api.postIn(this.modelName, item)
                  .then(response => {
                     
                      this.showToastMessage(this.$t('backoffice.list.messages.messageCreateSuccessOtherCharges'), "success");
                      this.name = '';
                      this.productMax = 0;
                      this.productMin = 0;
                      this.price = 0;
                      this.productId = null;
                      this.available = false;
                      this.spinner = false;
                      this.$router.push({
                        name: 'OtherCharge', 
                      });
                      this.$store.state.backConfig.othercharges.push(response.data)
                      return response;
                  })
                  .catch(e => {
                      this.isBackdrop = false;
                      console.log(e);
                      this.spinner = false;
                      this.ifErrorOccured(this.saveOtherCharge);
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