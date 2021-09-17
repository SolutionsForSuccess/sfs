<template>

  <div id="user" class="page">
    <listView      
      :title="$t('backoffice.options.managePyments')"
      :filter="filterOrders"
      :elements="orders"
      :add="false"
      :edit="false"
      :see="true"
      :remove="false"
      :viewSelected="'Report'"
      @handleInput="handleInput"
      @handleAddClick="viewOrder"   
      @editElement="viewOrder"
      @deleteElement="viewOrder"   
    ></listView>
  </div>

</template>

<script>

import { Api } from '../api/api.js';
import { Utils } from '../utils/utils.js';
import moment from 'moment-timezone';

import listView from "../components/ListView";

export default {

  name: 'order',
  created: function(){  
    this.fetchOrders();
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

    async doRefresh() {
      this.spinner = true;
      await Api.fetchAll(this.modelName).then(async response => {
        this.$store.state.backConfig.allpayments = response.data
         await this.fetchOrders(); 
        this.spinner = false;
      })
      .catch(e => {
        e;
        this.spinner = false;
      });  
  },

  ListViewData(option, count){
    if(count === 1) return null;
    if(count === 2) return option.ModelFrom  ;
    if(count === 3)  return this.getFormatPrice( parseFloat(option.Payment) - option.Refund - option.Void );
    if(count === 4) if(option.DeliveryPayment) return this.$t('frontend.tooltips.deliveryPayment'); else return null
    if(count === 5) return this.getFormatedDate(option.Date) ;
    if(count === 6) return 'TOTAL: ' + this.getSumatory();

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
                                            p.Method && p.ModelFrom && p.InvoiceNumber && p.Date && p.Payment);
            let cat2 = orderFiltered.filter(p =>
                                            p.Method.toLowerCase().indexOf(query) > -1
                                        ||  p.ModelFrom.toLowerCase().indexOf(query) > -1
                                        ||  p.InvoiceNumber.toLowerCase().indexOf(query) > -1                                 
                                        ||  p.Payment.toString().toLowerCase().indexOf(query) > -1                                 
                                        ||  p.Date.toLowerCase().indexOf(query) > -1)
            if(cat2.length> 0)
              this.filterOrders = cat2
            else
              this.filterOrders = this.orders  
          });
    
    },

    viewOrder: function(id){
        const paymentD = this.$store.state.backConfig.allpayments.find( p => p._id === id)
        this.$router.push({
        name: 'PaymentDetail', 
        params: { payment: paymentD ,
         currency: this.currency }
      });
    },
   
    getFormatedDate: function(date){
        return Utils.getFormatedDate(date);         
    },
    /****** CRUD category methods ******/
    fetchOrders: async function(){

       this.orders = this.$store.state.backConfig.allpayments;
       this.filterOrders = this.orders; 
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
   
    getCustomerById: function(id){
        var custom = '';
        this.customers.forEach(customer => {
            if (customer._id == id) {
                custom = customer;                
            }
        });
        return custom;
    },

     getFormatPrice(price){
       let result = price           
          if (this.currency)
            result = new Intl.NumberFormat('en', {style: "currency", currency: this.currency} ).format(price)      
      
         return result;
    },

    getSumatory(){
        let count = 0;
        for (const pay of this.filterOrders) {
           if(pay.Payment >= 0){
             count += parseFloat(pay.Payment) - parseFloat(pay.Refund) - parseFloat(pay.Void); 
           }                      
        }
        return this.getFormatPrice(count);
    },

    async filterDate(){
        if(this.dateTo  !=='' && this.dateTo < this.dateFrom){
            this.dateFrom = '';
            this.dateTo = '';
            return this.toastError('Error in Fechas');
        } 
        
        
        if( this.dateFrom !== '' &&  this.dateTo !== ''){

            this.dateFrom = moment(this.dateFrom).format('YYYY-MM-DD');
            this.dateTo = moment(this.dateTo).format('YYYY-MM-DD');
          
            this.$ionic.loadingController
            .create({
                cssClass: 'my-custom-class',
                message: this.$t('backoffice.titles.loading'),
                backdropDismiss: true
            })
            .then(loading => {
                loading.present()
                setTimeout(async () => {  // Some AJAX call occurs
                       await Api.getPaymentByDateToFrom(this.dateFrom, this.dateTo, this.$store.state.user.RestaurantId).then(response => {
                        this.orders = response.data;
                        this.filterOrders = this.orders; 
                        loading.dismiss();
                        this.key ++;
                        return true;
                    })
                    .catch(e => {
                        e
                        loading.dismiss()  
                        return true;                     
                    });
                })
            })    
        }
        else if(this.dateFrom !== ''){
            
            this.dateFrom = moment(this.dateFrom).format('YYYY-MM-DD');
              this.$ionic.loadingController
            .create({
                cssClass: 'my-custom-class',
                message: this.$t('backoffice.titles.loading'),
                backdropDismiss: true
            })
            .then(loading => {
                loading.present()
                setTimeout(async ()  => {  // Some AJAX call occurs
                        await Api.getPaymentByDateTo(this.dateFrom, this.$store.state.user.RestaurantId).then(response => {
                        this.orders = response.data;
                        this.filterOrders = this.orders; 
                        loading.dismiss();
                        this.key ++;
                        return true;
                    })
                    .catch(e => {
                        e
                        loading.dismiss()                        
                    });
                })
            })              
        }
        
       
              
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

    getFormateHour: function(date){
        return Utils.getFormatHourDate(date);         
    },

   viewOrderFrom: async function(from, id){
    if(from ==='Order' || from ==='Catering'){
        this.$router.push({
        name: 'OrderDetails', 
        params: { orderId: id }
        });
    }
    else if(from=='Reservation'){
      try {
          this.spinner1 = true;
        const reservation = await Api.fetchById('Reservation', id);
          this.spinner1 = false;
        if(reservation)
        this.$router.push({
            name: 'ReservationDetails',
            params: {reservation: reservation.data }
            }) 
        
      } catch (error) {
          this.spinner1 = false;
          error;
          
      }                 
    }  
   },

   deliveryPayments(){
     if(this.showDeliveryPayment)
      this.filterOrders = this.filterOrders.filter(p => p.DeliveryPayment);
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
        padding-left: 10%;
        padding-right: 10%;
        border: #edf1ee solid 1px;
        margin-right: 10%;
        margin-left: 10%;
        /* border-radius: 25px; */
    }

}

</style>