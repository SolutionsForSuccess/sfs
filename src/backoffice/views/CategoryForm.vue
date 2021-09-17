<template>
    <div :class="!externalProp ? 'screen' : ''">

    <ion-backdrop v-if="isBackdrop"></ion-backdrop>
    <ion-header v-if="!externalProp">
          <ion-toolbar>
            <ion-buttons slot="start">
              <ion-back-button default-href="/controlPanel" @click="$router.push({ name: 'Category'})"></ion-back-button>
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
    <div >

      <div>
        <ion-row>

          <ion-col size="12" size-md="6" style="display: flex;align-items: center;justify-content: center;">

            <ion-card style="width: 50%;"> 
                <label v-if="checkImage()"> 
                    <img   :src="file">
                    <input type="file" accept="image/png, image/jpeg" style="display:none"  @change="handleImage" >
                </label>
                <label v-else>  {{ $t('backoffice.form.titles.imageText')}} 
                    <input type="file" accept="image/png, image/jpeg" style="display:block"  @change="handleImage" >
                </label>
            </ion-card>

          </ion-col>

          <ion-col size="12" size-md="6">

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

            <ion-item>
                {{$t('backoffice.form.fields.parentCategory')}}
              <ion-select   interface="popover"
              @ionChange="parentId = $event.target.value" v-bind:value="parentId">
                  <ion-select-option :key="null" value="" >None</ion-select-option>
                  <ion-select-option v-for="category in categories" v-bind:key="category.Id" v-bind:value="category._id" >{{category.Name}}</ion-select-option>
              </ion-select>
            </ion-item>

            <ion-item v-if="!externalProp">
                <ion-label>{{$t('backoffice.form.fields.service')}}</ion-label>
                <ion-toggle slot="end" name="service" 
                @ionChange="service = $event.target.checked"
                :checked="service"  >    
              </ion-toggle>
            </ion-item>


          </ion-col>
        </ion-row>
      </div>

        
       
        
      

           
          

      <!-- </ion-card>  -->

      <br/>

      <div>
          <ion-button expand="full" color="primary" :disabled="!isValidForm()" @click="saveCategory()">{{ $t('backoffice.form.buttons.save') }}</ion-button>
      </div>

    </div>
    </div>
</template>

<script>

import { Api } from '../api/api.js';
// import { ImagePicker } from '@ionic-native/image-picker/'
// import { Camera } from '@ionic-native/camera';
// import { File } from '@ionic-native/file';
// import { FileChooser } from '@ionic-native/file-chooser/'

export default {

  name: 'categoryForm',
   
  data () {
    return {
      modelName: 'Category',
      /****** Form Data ******/
      id: null,
      name: '',
      description: '',
      file: null,
      fileName: '',
      service: false,

      epos: null,
      
      categories: [],
      parentId: null,

      //Bloque de pantalla
      isBackdrop: false,

      temp: '',

      spinner: false,
    }
  },
  created: function(){
      this.init()
  },
  computed: {
        title() {
            return this.id ? this.$t('backoffice.form.titles.categoryEditTitle') :  this.$t('backoffice.form.titles.categoryNewTitle');
        }
  },
  props: {
      externalProp: {type: Boolean, default: false},
      categTypeProp: {type: String, default: 'product'}
  },
  methods: {
    init(){
        this.fetchParentId();
        this.id = this.$route.params.categoryId;
        const data = this.$store.state.backConfig.category.find(c => c._id === this.id);
        if(data){
          this.service = data.Service;
          this.name = data.Name;
          this.description = data.Description;
          this.file = data.ImageUrl;
          this.parentId = data.ParentId;
          this.epos = data.EposId;
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
                      name: 'Category',
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
        if (this.name == "")
        {
            // errors.push(this.$t('backoffice.form.validate.name'));
            return false
        }
        // if (this.file == null)
        // {
        //     // errors.push(this.$t('backoffice.form.validate.image'));
        //     return false
        // }

        return true

        // if (errors.length > 0)
        // {
        //     let message = "";
        //     for (let i = 0; i < errors.length; i++) {
        //          message += (i + 1) + "- " + errors[i] + "<br/>";
        //     }
        //     // this.ShowMessage(this.$t('backoffice.form.validate.validate'),
        //     //                    message, this.$t('backoffice.form.validate.validateCategory'));
        //     this.showToastMessage(message, "danger")                   
        //     return false;
        // }
        // else
        // {
        //     return true;
        // }
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
        };
        reader.readAsDataURL(fileObject);
    },
    /*******                              Fin                              *******/
    fetchParentId(){
       this.categories = this.$store.state.backConfig.category;
          if (this.id)
              this.categories = this.categories.filter(item => item._id != this.id && !item.ParentId);
    },
    //Create or edit a new category
    saveCategory: function(){
        
        if (this.isValidForm()){

            this.isBackdrop = true;

            //Si el formulario de categoría está embebido.
            if (this.externalProp){
                if (this.categTypeProp == 'service') //Si se indica en el componente que viene de un servicio
                  this.service = true //se crea la categoría de servicio
            }

            let item = {
              "Name": this.name,
              "Description": this.description,
              "Service": this.service,
              "ImageUrl": "",
              "ParentId": "",
            }
            if (this.file != null)
            {
              item["ImageUrl"] = this.file;
              item["ImageName"] = this.fileName;
            }
            if (this.parentId)
            {
                item["ParentId"] = this.parentId;
            }
            //If I am editing
            if (this.id){
              item['_id'] = this.id;
              if (this.epos)
              {
                  item["EposId"] = this.epos;
              }
              this.spinner = true;
              Api.putIn(this.modelName, item)
                  .then(response => {
                       
                        const index = this.$store.state.backConfig.category.findIndex(men => men._id === item._id)
                        if(index !== -1) this.$store.state.backConfig.category[index]= item;
                        this.name = '';
                        this.description = '';
                        this.isEditing = false;
                        this.id = null;
                        this.file = null;
                        this.spinner = false;
                      
                        this.$router.push({
                          name: 'Category', 
                        });
                         this.showToastMessage(this.$t('backoffice.list.messages.messageEditSuccessCategory'), "success");
                        return response;
                  })
                  .catch(e => {
                        this.isBackdrop = false
                        e;
                        this.spinner = false;
                        this.ifErrorOccured(this.saveCategory)
                  })
            }
            else{
              //Else, I am created a new category
              this.spinner = true;
              Api.postIn(this.modelName, item)
                  .then(response => {
                      // this.ShowMessage(this.$t('backoffice.list.messages.infoDeleteSuccess'),
                      //        this.$t('backoffice.list.messages.messageCreateSuccessCategory'), 
                      //           this.$t('backoffice.list.messages.titleCreateCategory'));
                      this.showToastMessage(this.$t('backoffice.list.messages.messageCreateSuccessCategory'), "success");                      
                      this.$store.state.backConfig.category.push(response.data);
                       if(this.externalProp) return this.$emit("reloadCategory", response.data._id);
                      this.name = '';
                      this.description = '';
                      this.file = null;
                      this.spinner = false;

                      if (!this.externalProp){
                          this.$router.push({
                            name: 'Category', 
                          });
                      }

                      return response;
                  })
                  .catch(e => {
                      this.isBackdrop = false
                      e;
                      this.spinner = false;
                      this.ifErrorOccured(this.saveCategory)
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