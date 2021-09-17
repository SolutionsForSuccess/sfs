<template>
    <div id="user" class="page">
    <listView
      :title="getTitle()"
      :filter="filterProducts"
      :elements="products"
      :hasImg="true"
      :viewSelected="'Admin'"
      :add="hasPermission('canCreateProduct')"
      :edit="hasPermission('canEditProduct')"
      :remove="hasPermission('canDeleteProduct')"
      @handleInput="handleInput"
      @handleAddClick="goToForm"   
      @editElement="editProduct"
      @deleteElement="deleteProduct"   
    ></listView>
  </div>
</template>

<script>

import { Api } from '../api/api.js';
import listView from "../components/ListView";

export default {
   name: 'product',
   created: function(){
       this.init()
       this.screenWidth = screen.width;
   },
  
   data () {
    return {
      modelName: 'Product',
      /****** Form Data ******/
    //   categoryId: null,
      categories: [],
      categoriesIds: [],
      products: [],
      filterProducts: [],

      loading: null,

      paginate: ['languages'],

      cType: '',

      spinner: false,
      screenWidth: 0,

      currency: 'USD',

      rou: '/product-form',

      currentPageOrder: 1,
      keyList: 0,
    }
  },
  components: {
    listView,
  }, 
   methods: {
 
    async doRefresh() {
      this.spinner = true;
      await Api.fetchAll(this.modelName).then(async response => {
        this.$store.state.backConfig.product = response.data;
        await this.init();  
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
      if(count === 4) return this.getFormateNumber(option.SalePrice);
      if(count === 5) return this.getCategoryNameById(option.CategoryId);
    },
    
    getTitle(){
      if(this.cType == 'product') return this.$t('backoffice.titles.products');
      else return this.$t('backoffice.options.manageServices')
    },

    async init(){
    
      
        this.cType = this.$route.params.type || 'product';
        if (this.cType != 'product')
          this.rou = '/product-form/service'

        this.currency = this.$store.state.backConfig.restaurant.Currency;
        this.categories = this.$store.state.backConfig.category;

        if (this.cType == 'product')
        {
            this.categories = this.categories.filter(cat => !cat.Service || cat.Service == false)
        }
        else{
            this.categories = this.categories.filter(cat => cat.Service == true)
        }
        this.categories.forEach(cat => {
            this.categoriesIds.push(cat._id)
        })

        this.products =  this.$store.state.backConfig.product; 
        this.products = this.products.filter(prod => this.categoriesIds.includes(prod.CategoryId))
        this.filterProducts = this.products

        if(this.$route.params.currentPageOrder > 1){
          this.currentPageOrder = this.$route.params.currentPageOrder; 
          if (this.$refs.paginator)
            this.$refs.paginator.goToPage(this.currentPageOrder);
          if (this.$refs.paginator2)
            this.$refs.paginator2.goToPage(this.currentPageOrder);
        }

    },

    getFormateNumber: function(number){
      return new Intl.NumberFormat('en', {style: "currency", currency: this.currency} ).format(number).toString()
    },
    onLangsPageChange () { 
        this.currentPageOrder = this.$refs.paginator.currentPage + 1;        
    },
    onLangsPageChange2 () { 
        this.currentPageOrder = this.$refs.paginator2.currentPage + 1;        
    },
    goToForm(){
        if (this.cType != 'product')
        {
            this.$router.push({
                name: 'ProductForm',
                params: {
                    type: 'service'
                }
            })
        }
        else{
            this.$router.push({
                name: 'ProductForm',
                params: {
                    type: 'product'
                }
            })
        }
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

      this.filterProducts = this.products
      const query = value.toLowerCase();
      requestAnimationFrame(() => {   
        let cat2 = this.products.filter(item => item.Name.toLowerCase().indexOf(query) > -1 ||
                                               this.getCategoryNameById(item.CategoryId).toLowerCase().indexOf(query) > -1)
        if(cat2.length> 0)
          this.filterProducts = cat2
        else
          this.filterProducts = this.products
      });
    },
    hasPermission(permission){
        
        let res = false;
        if (this.$store.state.authenticated)
        {
            let roles = this.$store.state.roles;
            for (let index = 0; index < roles.length; index++) {
                switch(permission){                        
                      case 'canCreateProduct':
                          res = roles[index].canCreateProduct;
                          break;
                      case 'canEditProduct':
                          res = roles[index].canEditProduct;
                          break;
                      case 'canDeleteProduct':
                          res = roles[index].canDeleteProduct;
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
    loadMore: function(event) {
        // this.$store.dispatch('loadMore')
        event.target.complete();    
    },
    /****** CRUD category methods ******/
  
    fetchProducts: function(){

        this.products = this.$store.state.backConfig.product;             
        this.products = this.products.filter(prod => this.categoriesIds.includes(prod.CategoryId))
        this.filterProducts = this.products;

       },
    getCategoryNameById: function(id){
        var categ = '';
        this.categories.forEach(category => {
            if (category._id == id) {
                categ = category.Name;                
            }
        });
        return categ;
    },

    addProduct: function(){
      this.$router.push({
        name: 'ProductForm'
      });
    },
    
    editProduct: function(id){
          this.$router.push({
            name: 'ProductForm', 
            params: { 
              productId: id,
              type: this.cType,
              currentPageOrder: this.currentPageOrder
            }
          });
    },

    deleteProduct: function(id){

       const product = this.$store.state.backConfig.product.find( p=> p._id === id);      
        return this.$ionic.alertController.create({
        title: this.$t('backoffice.list.messages.confirmDelete'),
        message: this.$t('backoffice.list.messages.deleteProduct'),
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
                if (product.VariantGroupId)
                {
                    Api.deleteById('VariantGroup', product.VariantGroupId)
                    const index = this.$store.state.backConfig.variantgroup.findIndex(v => v._id === product.VariantGroupId); 
                    if(index !== -1) this.$store.state.backConfig.variantgroup.splice(index, 1)
                }
                Api.deleteById(this.modelName, id)
                .then(response => {
                     const index = this.$store.state.backConfig.product.findIndex(v => v._id === id); 
                    if(index !== -1) this.$store.state.backConfig.product.splice(index, 1);
                    this.showToastMessage(this.$t('backoffice.list.messages.messageDeleteSuccessProduct'), "success");
                    this.fetchProducts();
                    this.spinner = false;
                    return response;
                })
                .catch(e => {
                    e;
                    this.ifErrorOccured(mess => {
                      this.deleteProduct(id)
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
   } 
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