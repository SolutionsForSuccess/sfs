<template>
    <div :class="!externalProp ? 'screen' : ''">
    <ion-backdrop v-if="isBackdrop"></ion-backdrop>

    <ion-header v-if="!externalProp">
          <ion-toolbar>
            <ion-buttons slot="start">
              <ion-back-button default-href="/controlPanel" @click="$router.push({ name: 'Occupation'})"></ion-back-button>
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
          <ion-label position="floating">{{$t('backoffice.form.fields.description')}}</ion-label>
          <ion-textarea name="description" 
          @input="description = $event.target.value" 
          v-bind:value="description">
          </ion-textarea>
        </ion-item>
      <!-- </ion-card>  -->

      <br/>
      <ion-button expand="full" color="primary" :disabled="!isValidForm()" @click="saveOccupation()">{{ $t('backoffice.form.buttons.save') }}</ion-button>
    </div>
    </div>
</template>

<script>

import { Api } from '../api/api.js';

export default {

  name: 'occupationForm',
   
  data () {
    return {
      modelName: 'Occupation',
      id: null,
      name: '',
      description: '',

      isBackdrop: false,

      spinner: false,
    }
  },
  created: function(){
    
    this.id = this.$route.params.occupationId;
    const data = this.$store.state.backConfig.occupation.find( o => o._id === this.id);
    if(data){
       this.name = data.Name;
      this.description = data.Description;
    }   
  },
  props: {
      externalProp: {type: Boolean, default: false}
  },
  computed: {
        title() {
            return this.id ? this.$t('backoffice.form.titles.occupationEditTitle') :  this.$t('backoffice.form.titles.occupationNewTitle');
        }
  },
  methods: {

    ifErrorOccured(action){
      return this.$ionic.alertController.create({
          title: this.$t('backoffice.list.messages.connectionError'),
          message: this.$t('backoffice.list.messages.connectionErrorMessage'),
          buttons: [
            {
              text: this.$t('backoffice.list.messages.buttons.goToList'),
              handler: () => {
                  this.$router.push({
                      name: 'Occupation',
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

    saveOccupation: async function(){

        if (this.isValidForm()){
            this.isBackdrop = true;
            let item = {
              "Name": this.name,
              "Description": this.description,
            }
            //If I am editing
            if (this.id){
              item['_id'] = this.id;
              this.spinner = true;
              await Api.putIn(this.modelName, item)
                  .then(response => {
                        const index = this.$store.state.backConfig.occupation.findIndex( o => o._id === this.id)
                        if(index !== -1) this.$store.state.backConfig.occupation[index] = item;
                        this.showToastMessage(this.$t('backoffice.list.messages.messageEditSuccessOccupation'), "success");
                        this.spinner = false;
                        this.$router.push({
                          name: 'Occupation', 
                        });
                        return response;
                  })
                  .catch(e => {
                        this.isBackdrop = false;
                        console.log(e);
                        this.spinner = false;
                        this.ShowMessage(this.$t('backoffice.list.messages.errorTitle'),
                               this.$t('backoffice.list.messages.errorMessage'),
                                   this.$t('backoffice.list.messages.titleEditOccupation'));
                  })
            }
            else{
              //Else, I am created a new category
              this.spinner = true;
              await Api.postIn(this.modelName, item)
                  .then(response => {
                      this.$store.state.backConfig.occupation.push(response.data);
                      this.showToastMessage(this.$t('backoffice.list.messages.messageCreateSuccessOccupation'), "success");
                      this.spinner = false;

                      if (!this.externalProp){

                          this.$router.push({
                            name: 'Occupation', 
                          });
                      }
                      return response;
                  })
                  .catch(e => {
                      this.isBackdrop = false;
                      console.log(e);
                      this.spinner = false;
                      this.ShowMessage(this.$t('backoffice.list.messages.errorTitle'),
                          this.$t('backoffice.list.messages.errorMessage'),
                              this.$t('backoffice.list.messages.titleCreateOccupation'));
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