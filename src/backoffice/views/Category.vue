<template>
    <div id="user" class="page">


    <listView      
      :title="$t('backoffice.titles.categories')"
      :filter="filterCategories"
      :elements="categories"
      :hasImg="true"
      :viewSelected="'Admin'"
      :add="hasPermission('canCreateCategory')"
      :edit="hasPermission('canEditCategory')"
      :remove="hasPermission('canDeleteCategory')"
      @handleInput="handleInput"
      @handleAddClick="addCategory"   
      @editElement="editCategory"
      @deleteElement="deleteCategory"   
    ></listView>
  </div>
</template>

<script>

import { Api } from '../api/api.js';
import listView from "../components/ListView";

export default {

  name: 'category',
  created: function(){
   this.fetchCategories();
   this.screenWidth = screen.width;
  },
  data () {
    return {
      modelName: 'Category',
      categories: [],
      filterCategories: [],

      paginate: ['languages'],

      spinner: false,
      screenWidth: 0,
      key: 0,
      keyList: 0
    }
  },
  components: {
    listView,
  }, 
  methods: {
   async doRefresh() {
      this.spinner = true;
      await Api.fetchAll(this.modelName).then(response => {
        this.$store.state.backConfig.category = response.data;
        this.fetchCategories(); 
        this.spinner = false;
        this.keyList ++;
      })
      .catch(e => {
        e;
        this.spinner = false;
      });
  },

     ListViewData(option, count){
      if(count === 1) return option.ImageUrl;
      if(count === 2) return option.Name
      if(count === 3) return null;
         
      if(count === 4) return null;
      if(count === 5)  
        if(option.Service) return  this.$t('backoffice.form.fields.service');
          else  return  this.$t('backoffice.form.fields.product');
    },
    
    ifErrorOccured(action){
      return this.$ionic.alertController.create({
          title: this.$t('backoffice.list.messages.connectionError'),
          message: this.$t('backoffice.list.messages.connectionErrorMessage'),
          buttons: [
            {
              text: this.$t('backoffice.list.messages.buttons.goToAdministration'),
              handler: () => {
                  this.$router.push({
                      name: 'ControlPanel',
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
    handleInput(value){

      this.filterCategories = this.categories
      const query = value.toLowerCase();
      requestAnimationFrame(() => {   
        let cat2 = this.categories.filter(item => item.Name.toLowerCase().indexOf(query) > -1)
        if(cat2.length> 0)
          this.filterCategories = cat2
        else
          this.filterCategories = this.categories
      });
    },
    hasPermission(permission){
        
        let res = false;
        if (this.$store.state.authenticated)
        {
            let roles = this.$store.state.roles;
            for (let index = 0; index < roles.length; index++) {
                switch(permission){                        
                      case 'canCreateCategory':
                          res = roles[index].canCreateCategory;
                          break;
                      case 'canEditCategory':
                          res = roles[index].canEditCategory;
                          break;
                      case 'canDeleteCategory':
                          res = roles[index].canDeleteCategory;
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
    /****** CRUD category methods ******/
    fetchCategories: function(){

      this.categories = this.$store.state.backConfig.category;
       this.filterCategories = this.categories; 
       },

    addCategory: function(){
        this.$router.push({
        name: 'CategoryForm'
      });
    },

    editCategory: function(id){
        this.$router.push({
        name: 'CategoryForm', 
        params: { categoryId: id }
      });
    },

    deleteCategory: function(id){

        this.$ionic.alertController.create({
        title: this.$t('backoffice.list.messages.confirmDelete'),
        message: this.$t('backoffice.list.messages.deleteCategory'),
        buttons: [
          {
            text: this.$t('backoffice.list.messages.buttons.cancel'),
            role: 'cancel',
            handler: () => {
              
            }
          },
          {
            text: this.$t('backoffice.list.messages.buttons.delete'),
            handler: () => {
              
              this.spinner = true;
              Api.deleteById(this.modelName, id)
                .then(response => {
                  // this.ShowMessage(this.$t('backoffice.list.messages.infoDeleteSuccess'), 
                  //                       this.$t('backoffice.list.messages.messageDeleteSuccessCategory'), 
                  //                               this.$t('backoffice.list.messages.deleteSubtitleCategory'));
                  this.showToastMessage(this.$t('backoffice.list.messages.messageDeleteSuccessCategory'), "success");
                  const index = this.$store.state.backConfig.category.findIndex(men => men._id === id)
                  if(index !== -1) this.$store.state.backConfig.category.splice(index, 1);
                  this.key ++;
                  this.fetchCategories();
                  this.spinner = false;
                  return response;
                })
                .catch(e => {
                  e;
                  this.ifErrorOccured(mess => {
                      this.deleteCategory(id)
                      this.spinner = false
                      return mess
                  });
                })

            }
          }
        ]
      })
      .then(a => a.present());

      },
  },

}

</script>

<style>

.menu-col-3{
    flex: 0 0 calc(calc(3 / var(--ion-grid-columns, 12)) * 100%);
    width: calc(calc(3 / var(--ion-grid-columns, 12)) * 100%);
    max-width: calc(calc(3 / var(--ion-grid-columns, 12)) * 100%);
    text-align: left;
}
  
ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

.paginate-list {
  width: 159px;
  margin: 0 auto;
  text-align: left;
 
}
 .paginate-list li {
    display: block;   
  }

 .paginate-list li:before {
      content: '⚬ ';
      font-weight: bold;
      color: slategray;
    }

.paginate-links.items {
  user-select: none;
}
  a {
    cursor: pointer;
  }
  li.active a {
    font-weight: bold;
  }
  li.next:before {
    content: ' | ';
    margin-right: 13px;
    color: #ddd;
  }
  li.disabled a {
    color: #ccc;
    cursor: no-drop;
  }
  .prev, .next{
    font-size: 40px;
  }

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
