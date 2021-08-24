<template>
    <div class="screen">
    <ion-backdrop v-if="isBackdrop"></ion-backdrop>

    <ion-header>
          <ion-toolbar>
            <ion-buttons slot="start">
              <ion-back-button default-href="/controlPanel" @click="manageFunSettings()"></ion-back-button>
            </ion-buttons>
            <ion-label style="padding: 20px 100px;">
              <h1>{{ titleT }}</h1>            
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
    <div >
        <ion-item>
          <ion-label position="floating"><span style="color: red">*</span>{{$t('backoffice.form.fields.title')}}</ion-label>
          <ion-input type="text" name="title"
          @input="title = $event.target.value" 
          v-bind:value="title">
          </ion-input>
        </ion-item>
        <ion-item>
          <ion-label position="floating"><span style="color: red">*</span>{{$t('backoffice.form.fields.subtitle')}}</ion-label>
          <ion-input type="text" name="subtitle"
          @input="subtitle = $event.target.value" 
          v-bind:value="subtitle">
          </ion-input>
        </ion-item>
        <ion-item>
          <ion-label position="floating">{{$t('backoffice.form.fields.description')}}</ion-label>
          <ion-textarea name="description" 
          @input="description = $event.target.value" 
          v-bind:value="description">
          </ion-textarea>
        </ion-item>
        <ion-item>
          <ion-card v-if="checkImage()" >
              <ion-img :src="file"></ion-img>
          </ion-card>
        </ion-item>
        <ion-item>
            <div>
                <ion-label><span style="color: red">*</span>{{$t('backoffice.form.fields.image')}}</ion-label>
            </div>
          <input type="file" accept="image/png, image/jpeg" @change="handleImage" />
        </ion-item>
      <!-- </ion-card>  -->

      <br/>
      <ion-button expand="full" color="primary" :disabled="!isValidForm()" @click="saveAbout()">{{ $t('backoffice.form.buttons.save') }}</ion-button>
    </div>
    </div>
</template>

<script>

import { Api } from '../api/api.js';

export default {

  name: 'aboutForm',
   
  data () {
    return {
      modelName: 'About',
      /****** Form Data ******/
      id: null,
      title: '',
      subtitle: '',
      description: '',
      file: null,
      fileName: '',
      
      isBackdrop: false,

      spinner: false,
    }
  },
  created: function(){
    
    this.id = this.$route.params.aboutId;
    if (this.id){
      const data = this.$store.state.backConfig.about.find(a => a._id === this.id);
      if(data){
        this.title = data.Title;
        this.subtitle = data.Subtitle;
        this.description = data.Description;
        this.file = data.ImageUrl;
      }
    }
  },

  computed: {
        titleT() {
            return this.id ? this.$t('backoffice.titles.editAboutForm') :  this.$t('backoffice.titles.newAboutForm');
        }
  },

  methods: {

    manageFunSettings(){
        this.$router.push({
          name: 'FunSettingForm',
          params: {
              "settingId": this.$store.state.backConfig.setting._id,
              "tab": "about"
          }
        });
    },

    isValidForm(){
        if (this.title == "")return false
        if (this.subtitle == "")  return false
        if (this.description == "") return false
        if (this.file == null)return false

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

    /****** Load image use base64 encode esto debería ir en un componente******/
    checkImage: function(){
      return this.file != null;
    },

    handleImage: function(event)
    {
        const selectedImage = event.target.files[0];
        this.fileName = selectedImage.name;
        this.createBase64Img(selectedImage);
    },

    createBase64Img: function(fileObject){
        const reader = new FileReader();

        reader.onload = (e) => {
            this.file = e.target.result;
            //console.log(this.file);
        };
        reader.readAsDataURL(fileObject);
    },
    /*******                              Fin                              *******/
    //Create or edit a new category
    saveAbout: async function(){

        if (this.isValidForm()){

            this.isBackdrop = true;
            let item = {
              "Title": this.title,
              "Subtitle": this.subtitle,
              "Description": this.description,
              "ImageUrl": "",
            }
            if (this.file != null)
            {
              item["ImageUrl"] = this.file;
              item["ImageName"] = this.fileName;
            }
            //If I am editing
            if (this.id){
              item['_id'] = this.id;
              this.spinner = true;
              await Api.putIn(this.modelName, item)
                  .then(response => {
                        const index = this.$store.state.backConfig.about.findIndex(a => a._id === this.id)
                        if(index !== -1) this.$store.state.backConfig.about[index] = item;
                        this.showToastMessage(this.$t('backoffice.list.messages.messageCreateSuccessSetting'), "success");
                        this.title = '';
                        this.subtitle = '';
                        this.description = '';
                        this.isEditing = false;
                        this.id = null;
                        this.file = null;
                        this.spinner = false;                       
                        this.manageFunSettings();
                        return response;
                  })
                  .catch(e => {
                        this.isBackdrop = false
                        console.log(e);
                        this.spinner = false;
                        this.ShowMessage(this.$t('backoffice.list.messages.errorTitle'),
                               this.$t('backoffice.list.messages.errorMessage'),
                                   this.$t('backoffice.list.messages.titleEditSetting'));
                  })
            }
            else{
              //Else, I am created a new category
              this.spinner = true;
              await Api.postIn(this.modelName, item)
                  .then(response => {
                      this.$store.state.backConfig.about.push(response.data)
                      this.showToastMessage(this.$t('backoffice.list.messages.messageEditSuccessSetting'), "success");
                      this.title = '';
                      this.subtitle = '';
                      this.description = '';
                      this.file = null;
                      this.spinner = false;
                      // this.$router.push({
                      //   name: 'About', 
                      // });
                      this.manageFunSettings();
                      return response;
                  })
                  .catch(e => {
                      this.isBackdrop = false
                      console.log(e);
                      this.spinner = false;
                      this.ShowMessage(this.$t('backoffice.list.messages.errorTitle'),
                          this.$t('backoffice.list.messages.errorMessage'),
                              this.$t('backoffice.list.messages.titleCreateSetting'));
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