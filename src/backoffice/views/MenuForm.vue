<template>
    <div id="menu" class="screen">
    <ion-backdrop v-if="isBackdrop"></ion-backdrop>
  
    <ion-header>
          <ion-toolbar>
            <ion-buttons slot="start">
              <ion-back-button default-href="/controlPanel" @click="$router.push({ name: 'Menu'})"></ion-back-button>
            </ion-buttons>
            <ion-label style="padding: 20px 100px;">
              <h1>{{title}}</h1>            
            </ion-label>
          </ion-toolbar>
    </ion-header>
    <br/>

    <modal name="productCat-modal"  width="80%" height="auto" style="left: 0px;width: auto;height: auto; max-width: 500px !important;">
        <ion-buttons slot="start" @click="hideProductCat()">
                <ion-back-button default-href="home"></ion-back-button>
        </ion-buttons>
        <!-- <ion-header>
            <ion-toolbar>
            <ion-title>{{$t('backoffice.form.titles.taxNewTitle')}}</ion-title>          
            </ion-toolbar>        
        </ion-header> -->

        <ion-card>  
            <ProductByCategory 
                :externalProp="true"
                :categoryId="thisCategoryId"
                :menuId="this.id"
            />
        </ion-card>
    </modal>

    <ion-loading
        v-if="spinner"
        cssClass="my-custom-class"
        :message="$t('frontend.tooltips.loadRestaurant')"
      ></ion-loading>
    <div >
      <!-- <ion-card> -->
        <ion-item>
          <ion-label position="floating"><span style="color: red">*</span>{{$t('backoffice.form.fields.menuName')}}</ion-label>
          <ion-input type="text" name="name"
          @input="name = $event.target.value" 
          v-bind:value="name">
          </ion-input>
        </ion-item>

      

        <ion-row>

          <ion-col size="12" size-md="3">
             <ion-item>
                <ion-label>{{$t('backoffice.form.fields.active')}}</ion-label>
                <ion-toggle slot="end" name="active" 
                  @ionChange="active = $event.target.checked"
                  :checked="active"  >    
                </ion-toggle>
              </ion-item>
          </ion-col>

          <ion-col size="12" size-md="3">
            <ion-item>
              <ion-label>{{$t('backoffice.form.fields.isCatering')}}</ion-label>
              <ion-toggle slot="end" name="isCatering" 
                @ionChange="isCatering = $event.target.checked"
                :checked="isCatering"  >    
              </ion-toggle>
            </ion-item>
          </ion-col>

           <ion-col size="12" size-md="3">
               <ion-item>
                <ion-label>{{$t('backoffice.form.fields.isService')}}</ion-label>
                <ion-toggle slot="end" name="isService" 
                  @ionChange="changeService($event.target.checked)"
                  :checked="isService"  >    
                </ion-toggle>
              </ion-item>
           </ion-col>

            <ion-col size="12" size-md="3">
                <ion-item>
                <ion-label>{{$t('backoffice.form.fields.isReservationMenu')}}</ion-label>
                <ion-toggle slot="end" name="isReservationMenu" 
                  @ionChange="changeReservationMenu($event.target.checked)"
                  :checked="isReservationMenu" >  
                </ion-toggle>
              </ion-item>

            </ion-col>

        </ion-row>

        <ion-row>
          <ion-col size="12" size-md="6">

            <ion-list class="content-list" style="margin: 0 15px;">
                  <ion-item>
                    <ion-label>
                        <router-link to="/category">{{$t('backoffice.form.fields.availableCategories')}}</router-link>
                    </ion-label>
                </ion-item>
                                
                <ion-item
                    v-for="(category, index) in  availableCategories"
                    v-bind:key="index"                               
                >
                    <ion-avatar >
                      <ion-img v-if="category.ImageUrl != ''" :src="category.ImageUrl"></ion-img>
                        <ion-img v-else :src="require('../assets/category.png')"></ion-img>
                    </ion-avatar>

                    <ion-label> 
                        <h2> <span style="padding: 0 10px">  {{ category.Name }} </span>    </h2>    
                    </ion-label>

                    <ion-button
                        fill="clear"
                        shape="round"
                        class="list-gourp-btn"
                        side="end"
                        @click.stop="addCategory(category._id)"
                        >
                            <ion-icon  slot="icon-only"  icon="add"  class="more-grid" ></ion-icon>
                    </ion-button>
                    <ion-button
                        fill="clear"
                        shape="round"
                        class="list-gourp-btn"
                        side="end"
                        @click.stop="productsByCategory(category._id)"
                        >
                            <ion-icon  slot="icon-only"  icon="list"  class="more-grid" ></ion-icon>
                    </ion-button>
                </ion-item>
            </ion-list>

          </ion-col>

          <ion-col size="12" size-md="6">

            <ion-list class="content-list" style="margin: 0 15px;">
                  <ion-item>
                    <ion-label>
                        <router-link to="/category">{{$t('backoffice.form.fields.selectedCategories')}}</router-link>
                    </ion-label>
                </ion-item>
                                
                <ion-item
                    v-for="(category, index) in  selectedCategories"
                    v-bind:key="index"                               
                >
                    <ion-avatar >
                      <ion-img v-if="category.ImageUrl != ''" :src="category.ImageUrl"></ion-img>
                        <ion-img v-else :src="require('../assets/category.png')"></ion-img>
                    </ion-avatar>

                    <ion-label> 
                        <h2> <span style="padding: 0 10px">  {{ category.Name }} </span>    </h2>    
                    </ion-label>

                    <ion-button
                        fill="clear"
                        shape="round"
                        class="list-gourp-btn"
                        side="end"
                        @click.stop="deleteCategory(category._id)"
                        >
                            <ion-icon  slot="icon-only"  icon="trash"  class="more-grid" ></ion-icon>
                    </ion-button>
                    <ion-button
                        fill="clear"
                        shape="round"
                        class="list-gourp-btn"
                        side="end"
                        @click.stop="productsByCategory(category._id)"
                        >
                            <ion-icon  slot="icon-only"  icon="list"  class="more-grid" ></ion-icon>
                    </ion-button>
                </ion-item>
            </ion-list>

          </ion-col>
        </ion-row>


      <!-- </ion-card>  -->
        <br/>
        <ion-button expand="full" color="primary" :disabled="!isValidForm()" @click="saveMenu()">{{ $t('backoffice.form.buttons.save') }}</ion-button>
    </div>
    </div>
</template>
<script>

import { Api } from '../api/api.js';
import ProductByCategory from './ProductByCategory.vue'

export default{

  name: 'menuForm',
   
  data () {
    return {
      modelName: 'Menu',
      /****** Form Data ******/
      id: null,
      name: '',
      date: '',
      active: false,
      isCatering: false,
      isService: false,
      isReservationMenu: false,

      categories: [],
      selectedCategories: [],
      availableCategories: [],

      initialLoading: true,

      isBackdrop: false,
      spinner: false,

      screenWidth : 0,
      thisCategoryId: '',
    }
  },
  created: function(){
    this.screenWidth = screen.width;
    this.fetchAllCategories();
  },
  computed: {
        title() {
            return this.id ? this.$t('backoffice.form.titles.menuEditTitle') :  this.$t('backoffice.form.titles.menuNewTitle');
        }
  },
  components:{
      ProductByCategory,
  },
  methods:{

        changeService(val){
            this.isService = val;
         
            if (!this.id)
              this.initialLoading = false;

            if (!this.initialLoading)
            {
                this.availableCategories = [];
                this.selectedCategories = [];
                this.fetchAllCategoriesByType(val);
            }

            this.initialLoading = false;
        },

        changeReservationMenu(val){
              this.isReservationMenu = val;

              if (!this.id)
                this.initialLoading = false;

              if (!this.initialLoading)
              {
                  this.availableCategories = [];
                  this.selectedCategories = [];
                  this.fetchAllCategoriesByType(val);
              }

              this.initialLoading = false;
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
                          name: 'Menu',
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

        hasPermission(permission){
        
        let res = false;
        if (this.$store.state.authenticated)
        {
            let roles = this.$store.state.roles;
            for (let index = 0; index < roles.length; index++) {
                switch(permission){                        
                      case 'canEditProduct':
                          res = roles[index].canEditProduct;
                          break;
                      default:
                          break;
                }
                if (res)
                { 
                    return res;
                }              
            }
        }
        return res;
        },

        isValidForm(){
        // let errors = [];
        if (this.name == "")
        {
            // errors.push(this.$t('backoffice.form.validate.name'));
            return false
        }
        // if (this.date == "")
        // {
        //     // errors.push(this.$t('backoffice.form.validate.date'));
        //     return false
        // }
        if (this.selectedCategories.length == 0)
        {
            // errors.push(this.$t('backoffice.form.validate.category'));
            return false
        }

        return true

        // if (errors.length > 0)
        // {
        //     let message = "";
        //     for (let i = 0; i < errors.length; i++) {
        //          message += (i + 1) + "- " + errors[i] + "<br/>";
        //     }
        //     // this.ShowMessage(this.$t('backoffice.form.validate.validate'), 
        //     //                   message, this.$t('backoffice.form.validate.validateMenu'));
        //     this.showToastMessage(message, "danger");
        //     return false;
        // }
        // else
        // {
        //     return true;
        // }
        },

        ShowMessage: function(type, message, topic='') {
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

      productsByCategory: function(id){
        this.thisCategoryId = id;
        this.showProductCat();
          // this.$router.push({
          //   name: 'ProductByCategory', 
          //   params: {
          //            "categoryId": id,
          //            "menuId": this.id,
          //           }
          // });
      },

      fetchAllCategoriesByType: function(val){
        this.availableCategories =  this.$store.state.backConfig.category;
        if (val)
          this.availableCategories = this.availableCategories.filter(categ => categ.Service == true);
        else
          this.availableCategories = this.availableCategories.filter(categ => !categ.Service || categ.Service == false);
      },

      fetchAllCategories: function(){
        this.categories = this.$store.state.backConfig.category;
        this.id = this.$route.params.menuId;
          if (this.id){
             const data = this.$store.state.backConfig.menu.find(m => m._id === this.id)
             if(data){
              this.name = data.Name;
              this.date = data.Date;
              this.active = data.Active;
              this.isCatering = data.IsCatering;
              this.isService = data.IsService;
              this.isReservationMenu = data.IsReservationMenu;
              let categoriesIds = data.Categories;
              this.selectedCategories = this.mapCategory(categoriesIds);

              this.initAvailableCategories();
             }
          }
          else{
            this.initAvailableCategories();
          }
      },
   
      mapCategory: function(categoriesIds){
         let selCategories = [];
         
         categoriesIds.forEach(categoryId => {

            let selCategory = null;
            this.categories.forEach(category => {
                if (categoryId == category._id)
                    selCategory = category;
            });

            if (selCategory != null)
                selCategories.push(selCategory);

         });
         return selCategories;
         
      },
      ///aqui
      initAvailableCategories: function(){
          if (this.id)
          {
              let availableCateg = [];
              this.categories.forEach(category => {
                  let found = false;
                  this.selectedCategories.forEach(selectCateg => {
                     if (selectCateg != null && category != null){
                        if (selectCateg._id == category._id)
                            found = true;
                     }
                  });
                  if (!found)
                    availableCateg.push(category);
              });

             this.availableCategories = availableCateg;
             if (this.isService || this.isReservationMenu)
                this.availableCategories = this.availableCategories.filter(categ => categ.Service == true)
             else
                this.availableCategories = this.availableCategories.filter(categ => !categ.Service || categ.Service == false)
          }
          else
          {
              this.availableCategories = this.categories;
              this.availableCategories = this.availableCategories.filter(categ => !categ.Service || categ.Service == false)
          } 
      },
     
      clearData: function(){
          this.name = '';
          this.date = Date.now();
          this.active = false;
          this.categories = [];
          this.selectedCategories = [];
          this.availableCategories = [];
      },

      addCategory: function(id){
          let categ = this.availableCategories.find(category => category._id == id);
          this.selectedCategories.push(categ);

          var categoryIndex = this.availableCategories.indexOf(categ); // get index
          this.availableCategories.splice(categoryIndex, 1);
      },

      deleteCategory: function(id){
          let categ = this.selectedCategories.find(category => category._id == id);
          this.availableCategories.push(categ);

          var categoryIndex = this.selectedCategories.indexOf(categ);
          this.selectedCategories.splice(categoryIndex, 1);
      },
    
    createCategoriesObject: function(){

        let sCategories = [];
        this.selectedCategories.forEach(categorySelected => {
            if (categorySelected != null)
                sCategories.push(categorySelected._id);
        });
         return sCategories;
      },
  
      saveMenu: async function(){

        if (this.isValidForm())
        {
            this.isBackdrop = true;
            let categories = this.createCategoriesObject();
            let item = {
                "Name": this.name,
                "Active": this.active,
                "IsCatering": this.isCatering,
                "IsService": this.isService,
                "IsReservationMenu": this.isReservationMenu,
                "Categories": categories,
                "Date": this.date,
            }
         
            if (this.id){
              item['_id'] = this.id;
              this.spinner = true;
              await Api.putIn(this.modelName, item)
                  .then(response => {
                        const index = this.$store.state.backConfig.menu.findIndex( m => m._id === this.id);
                        if(index !== -1)  this.$store.state.backConfig.menu[index] = item;
                        this.showToastMessage(this.$t('backoffice.list.messages.messageEditSuccessMenu'), "success");
                        this.clearData();
                        this.spinner = false;
                        this.$router.push({
                          name: 'Menu', 
                        });
                        return response;
                  })
                  .catch(e => {
                        this.isBackdrop = false;
                        e;
                        this.spinner = false;
                        this.ifErrorOccured(this.saveMenu);
                  })
            }
            else{
              //Else, I am created a new menu
              this.spinner = true;
              Api.postIn(this.modelName, item)
                  .then(response => {
                      this.$store.state.backConfig.menu.push(response.data);
                      this.showToastMessage(this.$t('backoffice.list.messages.messageCreateSuccessMenu'), "success");
                      this.clearData();
                      this.spinner = false;
                      this.$router.push({
                        name: 'Menu', 
                      });
                      return response;
                  })
                  .catch(e => {
                      this.isBackdrop = false;
                      e;
                      this.spinner = false;
                      this.ifErrorOccured(this.saveMenu);
                  })
            }

        }
        
      },

      showProductCat () {
      this.$modal.show('productCat-modal');
        },
    
    hideProductCat () {
      this.$modal.hide('productCat-modal');
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