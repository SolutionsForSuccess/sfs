<template>
        <div id="user" class="page">
    <listView     
      :title="$t('frontend.createNew.restaurantType')"
      :filter="filterOrders"
      :elements="orders"
      :add="true"
      :edit="true"
      :remove="true"
      @handleInput="handleInput"
      @handleAddClick="addOrder"   
      @editElement="viewOrder"
      @deleteElement="deleteOrder"   
    ></listView>
  </div>
</template>

<script>

import { Api } from '../api/api.js';
import { Utils } from '../utils/utils.js';
import listView from "../components/ListView";

export default {

  name: 'restaurantType',
  created: function(){  
    this.fetchOrders();
  
  },
  components:{   
        listView,
  },
  data () {
    return {
      modelName: 'restauranttype',
      orders: [],

      filterOrders: [],
      resConf: null,

      update: null,
      loading: null,
      paginate: ['languages'],

      spinner: false,
      dateFrom: '',
      dateTo: '',
      key: 0,

      currency: 'USD',
      menuactive:'list',
      showActive: false,
    }
  }, 
  methods: {

      async doRefresh() {    
      await this.fetchOrders();     
     
    },

    ListViewData(option, count){
      if(count === 1) return null;
      if(count === 2) return option.Type
      if(count === 3) return null;
         
      if(count === 4) return this.getFormatedDate(option.Date);
      if(count === 5)  
        if(option.Service) return this.$t('frontend.menu.menu')+ ' ' + option.Datas.length
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
    showToastMessage(message, tColor){
      return this.$ionic.toastController.create({
        color: tColor,
        position: 'top',
        duration: 3000,
        message: message,
        showCloseButton: false
      }).then(a => a.present())
    }, 
    
    handleInput(value){
     
      const query = value.toLowerCase();
      requestAnimationFrame(() => {   
        const orderFiltered = this.orders.filter(p =>
                                        p.Date && p.Type);
        let cat2 = orderFiltered.filter(p => p.Type.toLowerCase().indexOf(query) > -1 )
        if(cat2.length> 0)
          this.filterOrders = cat2
        else
          this.filterOrders = this.orders  
      });
    },

    viewOrder: function(id){
        const restaurantType = this.orders.find( r=> r._id === id)
        return this.$router.push({ name: 'RestaurantType', params: {restaurantType: restaurantType, parent: this} })
    },

     addOrder: function(){
        return this.$router.push({ name: 'RestaurantType', params: { parent: this} })
    },

    
    async deleteOrder(id){
      try {
        this.spinner = true;
        const response = await Api.deleteById('restauranttype', id);
        if(response.status === 200)
           await this.fetchOrders(); 
         this.spinner = false;
        
      } catch (error) {
        error
         this.spinner = false;
      }
    },
   
    getFormatedDate: function(date){
        return Utils.getFormatedDate(date);         
    },

    /****** CRUD category methods ******/
    fetchOrders: async function(){
      this.spinner = true;
      try {
        const response = await Api.fetchAll('restauranttype')
        this.orders = response.data;
        this.filterOrders = this.orders; 
         this.spinner = false;
      } catch (error) {
        error;
         this.spinner = false;
      }   
    },
  
   getFormatPrice(price){
       let result = price           
          if (this.currency)
            result = new Intl.NumberFormat('en', {style: "currency", currency: this.currency} ).format(price)      
      
         return result;
    },

    async toastError(message) {
      return this.$ionic.toastController      
        .create({
          message: message,         
          position: 'middle',
          color:'danger',
           buttons: [
            {
              text: 'Done',
              role: 'cancel',
              handler: () => {}
            }
          ]
        })
      .then(a => a.present())
    },

    reverseOrders(){
      this.filterOrders.reverse();
    },

    scrollToTop() {
      document.querySelector('ion-card-content').scrollToTop(500);
    },
 
   getActives(){
     if(this.showActive)
      this.filterOrders = this.filterOrders.filter(p => p.State === true);
      else
       this.filterOrders = this.orders 
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

  .menu-col-4{
    flex: 0 0 calc(calc(4 / var(--ion-grid-columns, 12)) * 100%);
    width: calc(calc(4 / var(--ion-grid-columns, 12)) * 100%);
    max-width: calc(calc(4 / var(--ion-grid-columns, 12)) * 100%);
    text-align: left;
    visibility: visible;
    }

    .menu-col-6{
    flex: 0 0 calc(calc(6 / var(--ion-grid-columns, 12)) * 100%);
    width: calc(calc(6 / var(--ion-grid-columns, 12)) * 100%);
    max-width: calc(calc(6 / var(--ion-grid-columns, 12)) * 100%);
    text-align: left;
    visibility: visible;
    }
    
    .menu-col-5{
    flex: 0 0 calc(calc(5 / var(--ion-grid-columns, 12)) * 100%);
    width: calc(calc(5 / var(--ion-grid-columns, 12)) * 100%);
    max-width: calc(calc(5 / var(--ion-grid-columns, 12)) * 100%);
    text-align: left;
    visibility: visible;
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

  h6 {
    font-size: 16px;
    margin: 5px;
    font-weight: 200;
}

 .elipsis-menu{
        text-overflow: ellipsis !important;
    overflow: hidden !important;
    display: -webkit-box !important;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
  }

@media only screen and (min-width : 1024px){

    .screen{
        /* padding-left: 10%;
        padding-right: 10%;
        border: #edf1ee solid 1px; */
        margin-right: 10%;
        margin-left: 10%;
        /* border-radius: 25px; */
    }

}

</style>