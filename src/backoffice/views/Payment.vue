<template>
  <div id="order" class="screen">

    
    <ion-header>
          <ion-toolbar>
            <ion-buttons slot="start">
              <ion-back-button default-href="/controlPanel" @click="$router.push({ name: 'ControlPanel'})"></ion-back-button>
            </ion-buttons>
            <ion-label style="padding: 20px 100px;">
              <h1>{{$t('backoffice.options.managePyments')}}</h1>        
            </ion-label>

              <div style="display: flex;justify-content: center;align-items: center"> 
                  <ion-button @click="menuactive='list'" :style="menuactive==='list'? 'opacity: 1;;border: outset;' : 'opacity: 0.65;border: none;' ">
                    <span class="iconify" data-icon="foundation:list-bullet" data-inline="false" style="width: 20px;height: 20px;margin: 5px;"></span>
                  </ion-button>  
                  <ion-button    @click="menuactive='grid'" :style="menuactive==='grid'? 'opacity: 1;border: outset;' : 'opacity: 0.65;border: none;' ">
                    <span class="iconify" data-icon="clarity:grid-chart-solid" data-inline="false" style="width: 20px;height: 20px;margin: 5px;"></span>
                  </ion-button> 
                  <div v-if="filterStatus=='payment'" v-tooltip="$t('frontend.tooltips.deliveryPayment')" :style="showDeliveryPayment? 'opacity: 1;border: outset;display: flex' : 'opacity: 0.65;border: outset;display: flex' "
                    @click="showDeliveryPayment = !showDeliveryPayment , deliveryPayments()">
                    <span class="iconify" data-icon="emojione-monotone:delivery-truck" data-inline="false" style="margin: 0;"></span>
                  </div> 
                  <div style="border: outset; display: flex" @click="reverseOrders(); reverseHouse()">
                    <span class="iconify" data-icon="fluent:chevron-up-down-20-filled" data-inline="false" style="width: 20px;height: 20px;margin: 5px;"></span>
                  </div>                    
              </div> 

            <ion-item v-if="filterStatus=='payment'"> 
                <ion-datetime 
                    class="menu-col-5 elipsis-menu" 
                    placeholder="Desde"
                    :value="dateFrom"
                    @ionChange="dateFrom = $event.target.value"
                ></ion-datetime>
                <ion-datetime 
                    class="menu-col-5 elipsis-menu" 
                    placeholder="Hasta"
                    :value="dateTo"
                    @ionChange="dateTo =  $event.target.value"
                    pick-format="YYYY-MM-DD"
                ></ion-datetime> 
                 <div style="position: absolute;right: 0;top: 30%;" @click="filterDate()">
                     <span class="iconify" data-icon="fa-solid:search-dollar" data-inline="false" style="color: grey;margin:0;border: outset;padding: 1px !important;" ></span>
                    </div>                 
            </ion-item>
           
          </ion-toolbar>

          <ion-searchbar  
              @input="handleInput($event.target.value)" @ionClear="filterOrders = orders; filterHouse = houses"
                :placeholder="$t('frontend.home.search')">           
          </ion-searchbar>

          <div style="width: 100%">
              <ion-segment scrollable color="tertiary" @ionChange="filterStatus = $event.target.value" :value="filterStatus">
                  <ion-segment-button value="payment">
                        Payments
                  </ion-segment-button>
                  <ion-segment-button value="house">
                        House Account
                  </ion-segment-button>
              </ion-segment>
          </div>
          
    </ion-header>

      <div v-if="filterStatus == 'payment'">
        <ion-refresher 
            style="position: relative"
            slot="fixed"
            @ionRefresh="doRefresh($event)">
              <ion-refresher-content 
                refreshing-spinner="crescent"
              ></ion-refresher-content>
          </ion-refresher>

        <div v-if="spinner">
            <ion-spinner name="lines" class="spinner"></ion-spinner>
        </div>
        
        <div v-else >    

            <div  v-if="menuactive==='list'">
              <paginate
                :key="key"  
                name="languages"
                :list="filterOrders"
                :per="8"                     
              >
                <ion-item-sliding  v-for="order in paginated('languages')" v-bind:key="order._id" open='true'>
                  <ion-item 
                  :color="order.Void > 0 ? 'warning' : order.Refund > 0 ? 'danger' : 'light'"
                  @click="viewOrder(order)">
                    <ion-label class="menu-col-3 ">                   
                        {{ order.ModelFrom }} <br>  {{ getFormatedDate(order.Date) }}
                                    
                    </ion-label>
                    <ion-label class="menu-col-4 elipsis-menu"> 
                      {{ order.InvoiceNumber}} <br>
                      <div v-if="order.DeliveryPayment "   v-tooltip="$t('frontend.tooltips.deliveryPayment')" >
                        <span class="iconify" data-icon="emojione-monotone:delivery-truck" data-inline="false" style="margin: 0;"></span>
                      </div>   
                    </ion-label>
                    <ion-label class="menu-col-2 elipsis-menu">                   
                        <h6>{{ order.Method }}</h6>                   
                    </ion-label>  
                    <ion-label class="menu-col-3 elipsis-menu">                   
                        <h6>{{ getFormatPrice( parseFloat(order.Payment) - order.Refund - order.Void ) }}</h6>   
                        <div style="position: absolute;right: 0;top: 30%;" >
                            <span class="iconify" data-icon="mdi:backburger" style="color: grey;margin:0;width: 20px; height: 20px;" data-inline="false"></span>
                        </div>                 
                    </ion-label>              
                  </ion-item>
                  <ion-item-options side="end">                   
                      <ion-item-option color="primary" @click="viewOrder(order)">
                        <ion-icon slot="icon-only" name="list"></ion-icon>
                      </ion-item-option>                  
                    </ion-item-options >
              </ion-item-sliding>
            
                  <ion-item style="font-size: 20px;color: red;font-weight: 900;">
                      <ion-lable class="menu-col-6 elipsis-menu"></ion-lable>
                      <ion-lable class="menu-col-3 elipsis-menu" style="text-align: right;" >TOTAL</ion-lable>
                      <ion-lable class="menu-col-3 elipsis-menu" style="text-align: right;">{{getSumatory()}}</ion-lable>
                  </ion-item>

              </paginate>

              <paginate-links for="languages" color="primary" 
                :simple="{
                  next:'»' ,
                  prev: '« ' }"
              ></paginate-links>
            </div>

            <div v-if="menuactive==='grid'">
              <v-breakpoint>
                        <div slot-scope="scope" > 

                          <div style="display: flex;flex-wrap: wrap;flex-direction: row;align-items: flex-start;">    

                            <ion-chip color="primary"
                              @click="scrollToTop()"
                            outline style="position: fixed; right: 0;top: 50%;padding: 0; z-index: 20;">
                              <span class="iconify" data-icon="ant-design:caret-up-filled" data-inline="false" style="margin: 0"></span>
                            </ion-chip>

                            <div  v-for="order in filterOrders" v-bind:key="order._id" 
                                style="text-align: right;"             
                                :class="scope.isLarge || scope.isXlarge ? 'menu-col-3 card-categories' : scope.isMedium? 'menu-col-4 card-categories' : scope.isSmall || scope.noMatch ?'menu-col-12 card-categories': 'menu-col-3 card-categories'">
                                    
                                  <ion-chip style="margin: 0;bottom: -10px; font-weight: bold;" outline
                                    :color="order.Void > 0 ? 'warning' : order.Refund > 0 ? 'danger' : 'secondary'">
                                    {{getFormateHour(order.Date)}}
                                  </ion-chip>
                                <ion-card style="text-align: left;"   
                                :color="order.Void > 0 ? 'warning' : order.Refund > 0 ? 'danger' : 'secondary'">
                                    <ion-card-header style="margin: 10px 5px 2px; padding: 10px;background:white;color: black;">
                                      <ion-card-title  style="color: black;"> 
                                        <a v-if="order.ModelFrom && order.ModelId"><strong style="text-decoration: underline" @click="viewOrderFrom(order.ModelFrom, order.ModelId)">{{ order.ModelFrom }} </strong></a> 
                                      <span v-if="order.InvoiceNumber" style="text-transform: uppercase;"> {{order.InvoiceNumber.slice(-4)}} </span>   
                                      <div v-if="order.DeliveryPayment "   v-tooltip="$t('frontend.tooltips.deliveryPayment')" style="float: right;">
                                        <span class="iconify" data-icon="emojione-monotone:delivery-truck" data-inline="false" style="margin: 0;"></span>
                                      </div>                           
                                      </ion-card-title>
                                      
                                  
                                      <ion-card-subtitle v-if="order.StaffName"
                                        style="color: black; display: flex;justify-content: space-between;">
                                        <div style="text-align: center;"> 
                                          <span class="iconify" data-icon="grommet-icons:restaurant"
                                          style="color: #808080a6; width: 20px;  height: 20px; margin: 0;" data-inline="false"></span>
                                        </div>
                                        <span style="text-align: right;"  > {{ order.StaffName }}</span>
                                      </ion-card-subtitle>
                                        
                                      </ion-card-header>

                                      <ion-card-content style="margin: 1px 5px; padding: 5px;background:white;color: black;" >
                                        
                                        <p > <ion-label class="ion-text-wrap" >
                                            
                                            Pagado: <strong> {{getFormatPrice(order.Payment)}} </strong> 
                                        </ion-label></p>

                                          <p > <ion-label class="ion-text-wrap" >
                                              
                                              Void: <strong>{{getFormatPrice(order.Void)}} </strong>
                                          </ion-label></p>

                                          <p > <ion-label class="ion-text-wrap" >
                                            
                                              Refund: <strong> {{getFormatPrice(order.Refund)}} </strong> 
                                          </ion-label></p>

                                          
                                      </ion-card-content>
                                      
                                    
                                  <div style="display: flex;justify-content: space-between;align-items: center;"> 
                                    <div  >
                                    </div>
                                      <h3 style="text-align: center;">{{ getFormatPrice(parseFloat(order.Payment) - order.Refund - order.Void) }}</h3>
                                      <div v-tooltip="$t('frontend.tooltips.editTicket')" @click="viewOrder(order)">
                                        <span   class="iconify" data-icon="el:file-edit-alt" data-inline="false" style="width: 20px;height: 20px;"></span>
                                      </div>
                                  </div>                
                                </ion-card>
                            </div>

                          </div>
                        </div>
                      </v-breakpoint>   
            </div>

        </div>
      </div>

      <div v-if="filterStatus == 'house'">

          <div  v-if="menuactive==='list'">
            <paginate
              :key="key1"  
              name="languages2"
              :list="filterHouse"
              :per="8"                     
            >

                <ion-item v-for="house in paginated('languages2')" v-bind:key="house._id" color="light">
                  <ion-label class="menu-col-3">                   
                      <h2>{{house.ServerName}}</h2>
                      <h2>{{house.CustomerName}}</h2>
                  </ion-label>
                  <ion-label class="menu-col-3" style="margin-left: 20px"> 
                      <h2><a><strong @click="goToOrder(house.Model, house.ModelId)">{{house.Model}}</strong></a></h2>
                  </ion-label>
                  <ion-label class="menu-col-3">                   
                      <h2>Amount: {{ getFormatPrice(house.Amount) }}</h2>                
                  </ion-label>  
                  <ion-label class="menu-col-3 elipsis-menu">                   
                      <h2 v-if="house.Payed">Payed: YES</h2>
                      <h2 v-else>Payed: NO</h2>       
                  </ion-label>              
                </ion-item>
          
                <ion-item style="font-size: 20px;color: red;font-weight: 900;">
                    <ion-lable class="menu-col-6 elipsis-menu"></ion-lable>
                    <ion-lable class="menu-col-3 elipsis-menu" style="text-align: right;" >TOTAL</ion-lable>
                    <ion-lable class="menu-col-3 elipsis-menu" style="text-align: right;">{{getSumatoryHouse()}}</ion-lable>
                </ion-item>

            </paginate>

            <paginate-links for="languages2" color="primary" 
              :simple="{
                next:'»' ,
                prev: '« ' }"
            ></paginate-links>
          </div>

          <div v-if="menuactive==='grid'">
            <v-breakpoint>
                      <div slot-scope="scope" > 

                        <div style="display: flex;flex-wrap: wrap;flex-direction: row;align-items: flex-start;">    

                          <ion-chip color="primary"
                            @click="scrollToTop()"
                          outline style="position: fixed; right: 0;top: 50%;padding: 0; z-index: 20;">
                            <span class="iconify" data-icon="ant-design:caret-up-filled" data-inline="false" style="margin: 0"></span>
                          </ion-chip>

                          <div  v-for="house in filterHouse" v-bind:key="house._id" 
                              style="text-align: right;"             
                              :class="scope.isLarge || scope.isXlarge ? 'menu-col-3 card-categories' : scope.isMedium? 'menu-col-4 card-categories' : scope.isSmall || scope.noMatch ?'menu-col-12 card-categories': 'menu-col-3 card-categories'">
                                  
                                <ion-chip style="margin: 0;bottom: -10px; font-weight: bold;" outline
                                  color="light">
                                  {{house.ServerName}}
                                </ion-chip>
                              <ion-card style="text-align: left;" color="light">
                                  <ion-card-header style="margin: 10px 5px 2px; padding: 10px;background:white;color: black;">
                                    <ion-card-title  style="color: black;"> 
                                      <a><strong style="text-decoration: underline" @click="goToOrder(house.Model, house.ModelId)">{{ house.Model }}</strong></a>         
                                    </ion-card-title>
                                    
                                    <!-- <ion-card-subtitle v-if="order.StaffName"
                                      style="color: black; display: flex;justify-content: space-between;">
                                      <div style="text-align: center;"> 
                                        <span class="iconify" data-icon="grommet-icons:restaurant"
                                        style="color: #808080a6; width: 20px;  height: 20px; margin: 0;" data-inline="false"></span>
                                      </div>
                                      <span style="text-align: right;"  > {{ order.StaffName }}</span>
                                    </ion-card-subtitle> -->
                                      
                                    </ion-card-header>

                                    <ion-card-content style="margin: 1px 5px; padding: 5px;background:white;color: black;" >
                                      
                                      <p> 
                                        <ion-label class="ion-text-wrap" >
                                            Server Name: <strong> {{house.ServerName}} </strong> 
                                        </ion-label>
                                      </p>

                                      <p> 
                                        <ion-label class="ion-text-wrap" >
                                            Customer Name: <strong> {{house.CustomerName}} </strong> 
                                        </ion-label>
                                      </p>

                                        
                                    </ion-card-content>
                                    
                                  
                                <div style="display: flex;justify-content: space-between;align-items: center;"> 
                                  <div  >
                                  </div>
                                    <h3 style="text-align: center;">{{ getFormatPrice(parseFloat(house.Amount)) }}</h3>
                                    <!-- <div v-tooltip="$t('frontend.tooltips.editTicket')" @click="viewOrder(order)">
                                      <span   class="iconify" data-icon="el:file-edit-alt" data-inline="false" style="width: 20px;height: 20px;"></span>
                                    </div> -->
                                </div>                
                              </ion-card>
                          </div>

                        </div>
                      </div>
                    </v-breakpoint>   
          </div>

      </div>

  </div>
</template>

<script>

import { Api } from '../api/api.js';
import { Utils } from '../utils/utils.js';
import moment from 'moment-timezone';
import { VBreakpoint } from 'vue-breakpoint-component'

export default {

  name: 'order',
  created: function(){  
    this.fetchOrders();
    this.fetchHouseAccount();
    // this.fetchCustomers();
    this.getRestaurantConfig(); 
  
  },
  destroyed: function(){
      if (this.update != null){
          clearInterval(this.update);
      }
  },
  components:{   
    VBreakpoint: VBreakpoint,  
  },
  data () {
    return {
      modelName: 'Allpayment',
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
    goToOrder(model, modelId){

        if (model == 'Order'){
            this.$router.push({
              path: '/orderdetails/'+ modelId
            })
        }
        
        if (model == 'Catering'){
            this.$router.push({
              path: '/cateringOrderForm/'+ modelId
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
    reverseHouse(){
      this.filterHouse.reverse();
    },
    /** End House Account Method */

      async doRefresh(event) {
    
      await this.fetchOrders();      
      event.target.complete();
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

      if (this.filterStatus == 'payment'){
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
      }

      if (this.filterStatus == 'house'){
        requestAnimationFrame(() => {   
            const houseFiltered = this.houses.filter(h => h.ServerName && h.CustomerName);
            let cat2 = houseFiltered.filter(h =>
                                            h.ServerName.toLowerCase().indexOf(query) > -1 ||
                                            h.CustomerName.toLowerCase().indexOf(query) > -1)
            if(cat2.length > 0)
              this.filterHouse = cat2
            else
              this.filterHouse = this.houses  
          });
      }
    },

    viewOrder: function(paymentD){
        //console.log('Open Payment con ID '+ paymentD);
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

    // fetchCustomers: function(){
    //     Api.fetchAll('Customer').then(response => {
    //       // console.log(response.data)
    //       this.customers = response.data
    //       return response
    //     })
    //     .catch(e => {
    //       console.log(e)
    //     });
    // },
    // getRestaurantCustomer: function(){
    //     Api.findCustomerByEmail(this.resConf.Email)
    //     .then(response => { 
    //         this.restaurantCustomer = response.data;            
    //     })
    // },
    getRestaurantConfig: function(){
      this.resConf = this.$store.state.backConfig.restaurant;
      // this.getRestaurantCustomer();
     
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
                        console.log(e)
                        loading.dismiss()  
                        return true;                     
                    });
                })
            })    
        }
        else if(this.dateFrom !== ''){
            
            this.dateFrom = moment(this.dateFrom).format('YYYY-MM-DD');
            //console.log('date from ' + this.dateFrom)   ;  
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
                        console.log(e)
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
          console.log(error);
          
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