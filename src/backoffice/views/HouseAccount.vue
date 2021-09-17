<template>
<div id="user" class="page">
    <listView      
      :title="$t('backoffice.options.manageHouseAccount')"
      :filter="filterHouse"
      :elements="houses"
      :add="false"
      :edit="false"
      :see="true"
      :remove="false"
      :viewSelected="'Report'"
      @handleInput="handleInput"
      @handleAddClick="goToOrder"   
      @editElement="goToOrder"
      @deleteElement="goToOrder"   
    ></listView>
  </div>
</template>

<script>

import { Api } from '../api/api.js';

import listView from "../components/ListView";

export default {

  name: 'order',
  created: function(){  
    this.fetchHouseAccount();
    // this.fetchCustomers();
    this.getRestaurantConfig(); 
  
  },
  unmounted: function(){
      if (this.update != null){
          clearInterval(this.update);
      }
  },
  components:{   
     listView, 
  },
  data () {
    return {
      modelName: 'Allpayments',
      orders: [],
      customers: [],

      filterOrders: [],
      resConf: null,
      restaurantCustomer: null,

      houses: [],
      filterHouse: [],

      update: null,
      loading: null,
      paginate: ['languages', 'languages2'],

      spinner: false,
      dateFrom: '',
      dateTo: '',
      key: 0,
      key1: 0,

      currency: 'USD',
      menuactive:'list',
      showDeliveryPayment: false,

      filterStatus: "payment",
    }
  }, 
  methods: {

    /** House Account Method */
  goToOrder(id){
      const house = this.$store.state.backConfig.houseAccount.find(h => h._id === id);

        if (house.Model == 'Order'){
            this.$router.push({
              name: 'OrderDetails' ,
              params: { orderId:  house.ModelId}
            })
        }
        
        if (house.Model == 'Catering'){
          this.$router.push({
              name: 'OrderCateringForm' ,
              params: { orderId:  house.ModelId}
            })
        }
        
    },

    getSumatoryHouse(){
        let count = 0;
        for (const house of this.filterHouse) {
           if(house.Amount >= 0){
              count += parseFloat(house.Amount); 
           }                      
        }
        return this.getFormatPrice(count);
    },

    fetchHouseAccount(){
        this.houses = this.$store.state.backConfig.houseAccount;
        this.filterHouse = this.houses
    },
   
    /** End House Account Method */

    async doRefresh() {
      this.spinner = true;
      await Api.fetchAll('HouseAccount').then(async response => {
        this.$store.state.backConfig.houseAccount = response.data
        this.spinner = false;
        this.$store.state.backConfig.houseAccount
        await this.fetchHouseAccount();    
      })
      .catch(e => {
        e;
        this.spinner = false;
      });

  },

  ListViewData(option, count){
    if(count === 1) return null;
    if(count === 2) return option.CustomerName  ;
    if(count === 3)  return  this.getFormatPrice(option.Amount);
    if(count === 4) return option.Model;
    if(count === 5) if(option.Payed) return this.$t('backoffice.form.fields.payed'); else return this.$t('backoffice.form.fields.pendingPay');
    if(count === 6) return 'TOTAL: ' + this.getSumatoryHouse();

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
        const houseFiltered = this.houses.filter(h => h.ServerName && h.CustomerName && h.Model);
        let cat2 = houseFiltered.filter(h =>
                                        h.Model.toLowerCase().indexOf(query) > -1 ||
                                        h.ServerName.toLowerCase().indexOf(query) > -1 ||
                                        h.CustomerName.toLowerCase().indexOf(query) > -1)
        if(cat2.length > 0)
          this.filterHouse = cat2
        else
          this.filterHouse = this.houses  
      });
    },

    getRestaurantConfig: function(){
      this.resConf = this.$store.state.backConfig.restaurant;
     
    },    
    hasPermission(permission){
        
        let res = false;
        if (this.$store.state.authenticated)
        {
            let roles = this.$store.state.roles;
            for (let index = 0; index < roles.length; index++) {
                switch(permission){                        
                      case 'canCreateOrder':
                          res = roles[index].canCreateOrder;
                          break;
                      case 'canEditOrder':
                          res = roles[index].canEditOrder;
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
        padding-left: 10%;
        padding-right: 10%;
        border: #edf1ee solid 1px;
        margin-right: 10%;
        margin-left: 10%;
        /* border-radius: 25px; */
    }

}

</style>