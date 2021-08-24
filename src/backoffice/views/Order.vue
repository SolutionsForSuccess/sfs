<template>

  <div id="order" class="screen" >
   
        <ion-header >
              <ion-toolbar>
                <ion-buttons slot="start">
                  <ion-back-button default-href="/controlPanel" @click="$router.push({ name: 'ControlPanel'})"></ion-back-button>
                </ion-buttons>
                <ion-label style="padding: 20px 100px;">
                  <h1>{{$t('backoffice.titles.orders')}}</h1>                               
                </ion-label> 
                <ion-label slot="end">  
                    <ion-chip style="font-size: 30px" outline color="primary" @click="createOrder()" v-if="hasPermission('canCreateOrder')">
                        <ion-label><ion-icon name="add"></ion-icon></ion-label>
                    </ion-chip>
                </ion-label> 
              </ion-toolbar>

                <div style="display: flex;justify-content: center;align-items: center;"> 
                    <ion-button @click="menuactive='list'" :style="menuactive==='list'? 'opacity: 1;;border: outset;' : 'opacity: 0.65;border: none;' ">
                      <span class="iconify" data-icon="foundation:list-bullet" data-inline="false" style="width: 20px;height: 20px;margin: 5px;"></span>
                    </ion-button>  
                    <ion-button    @click="menuactive='grid'" :style="menuactive==='grid'? 'opacity: 1;border: outset;' : 'opacity: 0.65;border: none;' ">
                      <span class="iconify" data-icon="clarity:grid-chart-solid" data-inline="false" style="width: 20px;height: 20px;margin: 5px;"></span>
                    </ion-button>  
                    <div  @click="reverseOrders()">
                      <span class="iconify" data-icon="fluent:chevron-up-down-20-filled" data-inline="false" style="width: 20px;height: 20px;margin: 5px;"></span>
                    </div>
                    <div >
                        <ion-icon name="home" @click="homeOrders= !homeOrders,filterHomeOreders()" :color="homeOrders? 'success': 'ligth'" style="width: 30px;height: 30px"></ion-icon>
                    </div>
                     <ion-select interface="popover" icon="add"
                        style="display: inline-flex; align-items: center;"
                        :ok-text="$t('backoffice.form.messages.buttons.ok')"
                        :cancel-text="$t('backoffice.form.messages.buttons.dismiss')"
                        :value="filterStatus"
                        :placeholder="$t('frontend.menu.menu')"
                          @ionChange="changeFilterStatus($event.target.value)">
                            <ion-select-option v-for="res in statusList"                    
                              :key="res.value" 
                              :value="res.value" > {{res.name}}
                            </ion-select-option>                          
                        </ion-select>
                </div> 

              <ion-searchbar  
                  @input="handleInput($event.target.value)" @ionClear="filterOrders = orders"
                    :placeholder="$t('frontend.home.search')">           
              </ion-searchbar>
              <div style="width: 100%">
                  
                 
                  <ion-segment scrollable color="tertiary"  :value="filterType">
                     
                      <ion-segment-button value="order" @click="filterType='order',changeFilterType('order')">
                        Order
                      </ion-segment-button>
                      <ion-segment-button v-if="setting.viewCatering" value="catering" @click="filterType='catering',changeFilterType('catering')">
                          Catering
                      </ion-segment-button>
                      <ion-segment-button value="ticket" @click="filterType='ticket',changeFilterType('ticket')">
                          Ticket
                      </ion-segment-button>  
                      <ion-segment-button v-if="hasPermission('canViewOrderForDelivery')"
                       value="delivery" @click="filterType='delivery',changeFilterType('delivery')">
                          Delivery
                      </ion-segment-button>                      
                  </ion-segment>
              </div>
        </ion-header>

        <div v-if="spinner">
          <ion-progress-bar type="indeterminate"></ion-progress-bar>
        </div>

        <div> 
              <paginate v-if="filterOrders.length > 0 && menuactive==='list'"
                name="languages"
                :list="filterOrders"
                :per="8">
                
                  <ion-item-sliding  v-for="order in paginated('languages')" v-bind:key="order._id">
                    <ion-item
                    @click="viewOrder(order)"
                      :color="order.State == 5 ? 'success' : order.State == 6 ? 'danger' : order.State == 0 ? 'warning' : order.State == 4 ? 'primary' : 'light'">
                      <ion-label class="menu-col-4 elipsis-menu">
                          <h6 v-if="order.CustomerName">{{ order.CustomerName }}</h6>
                          <span v-if="order.CarArrived && order.State !==5"                      
                            class="iconify" data-icon="clarity:car-solid" data-inline="false" 
                            style="width: 20px;height: 20px; float: left; color: #48bc76;"></span>                   
                      </ion-label>
                      <ion-label class="menu-col-4 elipsis-menu">                   
                          <h6>{{ getOrderState(order.State) }}</h6>
                          <h6>{{ getFormatedDate(order.Date) }}</h6>
                      </ion-label>
                      <ion-label class="menu-col-4 elipsis-menu">
                        
                          <h6>{{ order.OrderType }}</h6>
                          <h6>{{ getFormatPrice(order.Total) }}</h6>                  
                          <div style="position: absolute;right: 0;top: 30%;">
                              <span class="iconify" data-icon="mdi:backburger" style="color: grey;margin:0;width: 20px; height: 20px;" data-inline="false"></span>
                          </div> 
                      </ion-label>                
                    </ion-item>
                    <ion-item-options side="end"> 
                        <ion-item-option v-if="order.OrderType==='Curbside'" color="primary" @click="curbsideDetail(order.LicencePlate, order.VehicleModel, order.VehicleColor)">
                        <span class="iconify" data-icon="clarity:car-solid" data-inline="false" style="width: 20px;height: 20px; float: left; color: #48bc76;"></span>
                        </ion-item-option>
                        <ion-item-option color="primary" @click="viewOrder(order)">
                          <ion-icon slot="icon-only" name="list"></ion-icon>
                        </ion-item-option>
                        <ion-item-option color="primary" @click="reOrder(order)" v-tooltip="'Reorder'" v-if="hasPermission('canCreateOrder')">
                          <span class="iconify" data-icon="mi:shopping-cart-add" data-inline="false"></span>   
                        </ion-item-option>
                        <ion-item-option v-if="order.State != 0 && order.State != 6 && order.State != 5" color="danger" @click="cancelOrder(order, getCustomerById(order.ClientId))">
                          <ion-icon slot="icon-only" name="close"></ion-icon>
                        </ion-item-option>

                        <ion-item-option v-if="order.State == 4 && order.IsAccept" color="warning" 
                        @click="showDeliveringLocation(order)" v-tooltip="'showDeliveringLocation'">
                          <ion-icon slot="icon-only" name="locate"></ion-icon>
                        </ion-item-option>
                        <ion-item-option v-if="order.State == 5 && order.OrderType == 'Delivery'" color="warning"
                        @click="showTravel(order)" v-tooltip="'showTravel'">
                          <ion-icon slot="icon-only" name="car"></ion-icon>
                        </ion-item-option>
                        <ion-item-option v-if="hasPermission('canEditOrder') && order.State === 0 && !order.isTicket" color="danger"
                        @click="deleteOrder(order._id)" v-tooltip="'Eliminar'">
                            <ion-icon slot="icon-only" name="trash"></ion-icon>
                        </ion-item-option>
                    </ion-item-options >
                  </ion-item-sliding>

              </paginate>
              <div v-if="filterOrders.length > 0  && menuactive==='list'">
                  <paginate-links for="languages" color="primary" 
                    :simple="{
                      next:'»' ,
                      prev: '« ' }"
                  ></paginate-links>
              </div>

              <div v-if="menuactive==='grid'"  id="gridView">
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
                                :color="order.State == 5 ? 'success' : order.State == 6 ? 'danger' : order.State == 0 ? 'warning' : order.State == 4 ? 'primary' : 'secondary'">
                                {{getFormateHour(order.Date)}}
                              </ion-chip>
                            <ion-card style="text-align: left;"   
                            :color="order.State == 5 ? 'success' : order.State == 6 ? 'danger' : order.State == 0 ? 'warning' : order.State == 4 ? 'primary' : 'secondary'">
                                <ion-card-header style="margin: 10px 5px 2px; padding: 10px;background:white;color: black;">
                                  <ion-card-title  style="color: black;">{{ order.OrderType }} - 
                                  <span style="text-transform: uppercase;"> {{order._id.slice(-4)}} </span>
                                  <span v-if="order.CarArrived && order.State !==5"                      
                                    class="iconify" data-icon="clarity:car-solid" data-inline="false" 
                                    style="float: right; color: #48bc76; margin:0"></span> 
                                  </ion-card-title>
                                  
                                  <ion-card-subtitle v-if="order.CustomerName"
                                    style="color: black; display: flex;justify-content: space-between;">
                                    <div style="text-align: center;"> 
                                      <span class="iconify" data-icon="bx:bxs-user-circle" data-inline="false" 
                                      style="color: #808080a6;width: 20px;  height: 20px; margin: 0;"></span>
                                    </div>
                                    <div style="text-align: right;"  >{{ order.CustomerName }}</div>
                                  </ion-card-subtitle>

                                  <ion-card-subtitle v-if="order.StaffName"
                                    style="color: black; display: flex;justify-content: space-between;">
                                    <div style="text-align: center;"> 
                                      <span class="iconify" data-icon="grommet-icons:restaurant"
                                      style="color: #808080a6; width: 20px;  height: 20px; margin: 0;" data-inline="false"></span>
                                    </div>
                                    <span style="text-align: right;"  > {{ order.StaffName }}</span>
                                  </ion-card-subtitle>
                                    
                                  </ion-card-header>

                                  <ion-card-content style="margin: 1px 5px; padding: 5px;background:white;color: black;" :key="cartKey + 'C'">
                                    <div v-for="(prod, index) in order.Products" :key="index" >
                                          <div style="display: flex;justify-content: space-between; padding: 2px;margin:5px 0">
                                            <span :style="prod.State===1? 'text-decoration: line-through;':'text-decoration: none'">{{prod.Cant}} X {{prod.Name}} </span> 
                                            <ion-checkbox v-if="prod.State === 0" color="secondary" @click="changeProductState(order, index)"></ion-checkbox>
                                            <ion-checkbox v-if="prod.State ===1"  checked disabled color="secondary"></ion-checkbox>
                                          </div>

                                          <div v-if="prod.Aggregates.length > 0" style="padding-left: 5px;">
                                            <div v-for="(agg, index1) in prod.Aggregates" :key="index1"  style="padding-left: 2px; display: list-item; list-style: inside" >                                                          
                                            {{agg.Cant}} X {{agg.Name}} 
                                            </div>
                                          </div>
                                          <div v-if="prod.Note" style="padding-left: 15px;">                                                                                          
                                              <span style="background: #ffff0047;" >{{$t('frontend.order.notes')}}: {{prod.Note}}</span>                                 
                                          </div>                              
                                    </div>
                                    <div v-if="order.OtherCharges">
                                      <div v-if="order.OtherCharges.length > 0">
                                          <ion-label class="ion-text-wrap" >
                                              <strong class="titles-order" >
                                                {{$t('frontend.order.otherCharges')}}
                                              </strong> 
                                          </ion-label>
                                                          
                                        <div v-for="charge in order.OtherCharges" v-bind:key="charge.Id">                              
                                            <div style="padding-left: 2px; display: list-item; list-style: inside;">
                                                {{ charge.Name }}
                                            </div>                                
                                        </div>

                                    </div>
                                  </div>
                                  </ion-card-content>
                                  
                                  <ion-card-content style="margin:5px; background:white;color: black;text-align: center; padding: 0;" :key="stateKey + 'S'">

                                    

                                      <ion-select  :value="statesAll[order.State].name" interface="popover" icon="add"
                                          style="font-size: 16px;font-weight: 500;"
                                          @ionChange="stateToChange(order, $event.target.value)" >
                                          <ion-select-option
                                            v-for="(ps, index) in stateByOrder(order)" :key="index" :value="ps.name">
                                            {{ps.name}}
                                          </ion-select-option>
                                      </ion-select>
                                  </ion-card-content>
                              <div style="display: flex;justify-content: space-between;align-items: center;"> 
                                <div v-tooltip="$t('frontend.order.notes')" @click="showOrderNote(order)" >
                                  <span  class="iconify" data-icon="bi:info-circle-fill" data-inline="false" style="width: 20px;height: 20px;"></span>
                                </div>
                                  <h3 style="text-align: center;">{{ getFormatPrice(order.Total) }}</h3>
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


              <div class="emptyResult" v-if="filterOrders.length === 0">
                  {{$t('backoffice.titles.emptyResult')}}
              </div>
          

        </div>
       
  </div>

</template>

<script>

import { Api } from '../api/api.js';
import { Utils } from '../utils/utils.js';
import Modal from './cancelOrderModal.vue';
 import { VBreakpoint } from 'vue-breakpoint-component'
export default {

  name: 'order',
  created: async function(){
    this.screenWidth = screen.width;
    this.fetchOrders();
    this.filterOrders = this.orders; 
    this.fetchCustomers();
    this.changeFilterStatus('all');

    this.resConf = this.$store.state.backConfig.restaurant;
    this.setting = this.$store.state.backConfig.setting;
    // setting.viewCatering
   
   this.update = setInterval(() => { this.initialize(); }, 30000);  
  },
   components:{   
    VBreakpoint: VBreakpoint,  
  },  
  destroyed: function(){
      if (this.update != null){
          clearInterval(this.update);
      }
  },
  data () {
    return {
      modelName: 'Order',
      orders: [],
      customers: [],
      setting: {},
      filterOrders: [],
      resConf: null,
      homeOrders: false,
      restaurantCustomer: null,

      update: null,
      loading: null,
      workflowOrderStaus: [this.$t('frontend.order.state0'), this.$t('frontend.order.state1'), this.$t('frontend.order.state2'), this.$t('frontend.order.state3'), this.$t('frontend.order.state4'), this.$t('frontend.order.state5'), this.$t('frontend.order.state6')],
      statusList: [
        {value:'all', name: this.$t('frontend.reservation.all')}, 
        {value:'state0', name: this.$t('frontend.order.state0')}, 
        {value:'state1', name: this.$t('frontend.order.state1')}, 
        {value:'state2', name: this.$t('frontend.order.state2')}, 
        {value:'state3', name: this.$t('frontend.order.state3')}, 
        {value:'state4', name: this.$t('frontend.order.state4')}, 
        {value:'state5', name: this.$t('frontend.order.state5')}, 
        {value:'state6', name: this.$t('frontend.order.state6')}, 
      ],
      paginate: ['languages'],

      spinner: false,
      screenWidth: 0,
      //colors
      primaryColor: "",
      secondaryColor: "",
      tertiaryColor: "",

      filterStatus: "all",

      menuactive: 'list',
      cartKey: 0,
      stateKey: 0,
      statesAll: [
        { state: 0,
          name: this.$t('frontend.order.state0')},
        { state: 1,
          name: this.$t('frontend.order.state1')},
        { state: 2,
          name: this.$t('frontend.order.state2')},
        { state: 3,
          name: this.$t('frontend.order.state3')},
        { state: 4,
          name: this.$t('frontend.order.state4')},
        { state: 5,
          name: this.$t('frontend.order.state5')},
        { state: 6,
          name: this.$t('frontend.order.state6')},
        { state: 7,
          name: this.$t('frontend.order.state7')},
        { state: 8,
          name: this.$t('frontend.order.state8')} ],  
      filterType: 'order',     
      completeOrder: [],  
    }
    
  },

  methods: {

    initialize(){
        this.fetchOrders();
        this.fetchCustomers();      
    },

    changeFilterStatus(value){
        // this.homeOrders = false; this.filterOrders = this.orders;
        this.filterStatus = value
        let status = -1
        this.allReservations = this.reservations       
        if (value == 'all') {
            this.filterOrders = this.orders
            return
        }
        if (value == 'state0')    status = 0
        if (value == 'state1') status = 1
        if (value == 'state2')  status = 2
        if (value == 'state3')  status = 3
        if (value == 'state4')  status = 4
        if (value == 'state5') status = 5
        if (value == 'state6') status = 6

        requestAnimationFrame(() => {
          let cat2 = this.orders.filter(item => item.State == status)
          this.filterOrders = cat2
        })
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

    deleteOrder: function(id){

        this.$ionic.alertController.create({
        title: this.$t('backoffice.list.messages.confirmDelete'),
        message: this.$t('backoffice.list.messages.deleteOrder'),
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
              Api.putIn(this.modelName, {"_id": id, "Deleted": true})
                .then(response => {                 
                  this.showToastMessage(this.$t('backoffice.list.messages.messageDeleteSuccessOrder'), "success");
                  this.fetchOrders();
                  this.spinner = false;
                  return response;
                })
                .catch(e => {
                  e;
                  this.ifErrorOccured(mess => {
                      this.deleteOrder(id)
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
    
    handleInput(value){
      this.filterOrders = this.orders
      const query = value.toLowerCase();
      requestAnimationFrame(() => {   
        // TODO filtrar por estado y precio y tipo.
         let cat2 = this.orders.filter(item => item.CustomerName.toLowerCase().indexOf(query) > -1)      
        if(cat2.length> 0)
          this.filterOrders = cat2
        else
          this.filterOrders = this.orders
      });
    },
  
    filterHomeOreders(){
      
         if (this.homeOrders)
          this.filterOrders = this.filterOrders.filter(item => item.StaffName &&  item.StaffName != '')
         else  this.filterOrders = this.orders
       
    },
 
    viewOrder: function(order){
      if(order.isTicket === true){
         if (order.State === 5)
          this.$router.push({ name: 'OrderDetails',  params: { orderId: order._id, type: 'ticket' }});        
        else
          this.$router.push({ name: 'TicketForm',  params: { orderId: order._id } });
      }
      else if(order.OrderForCatering === true)
       this.$router.push({  name: 'OrderDetails',  params: { orderId: order._id, type: 'catering' } });
      else 
        this.$router.push({ name: 'OrderDetails', params: { orderId: order._id } });
    },

    getOrderState(state){
        return this.workflowOrderStaus[state];
    },

    getFormatedDate: function(date){
        return Utils.getFormatedDate(date);         
    },

    getFormateHour: function(date){
        return Utils.getFormatHour(date);         
    },

    getFormatPrice: function(price){
        return Utils.getFormatPrice(price);         
    },

    /****** CRUD category methods ******/
    fetchOrders: async function(){
      this.spinner = true;
      await Api.fetchAll(this.modelName).then(response => {
        this.completeOrder = response.data;
        this.spinner = false;
        this.changeFilterType(this.filterType);
      })
      .catch(e => { e;
        console.log(e);
        this.ifErrorOccured(this.initialize);
          this.spinner = false;
      });
    },

    fetchCustomers: function(){
        Api.fetchAll('Customer').then(response => {
          this.customers = response.data
          return response
        })
        .catch(e => {
          e
        });
    },

    createOrder: function(){
      if(this.$store.state.restaurantActive.restaurantUrl){
        return this.$router.push({ name: 'Home', params: {url: this.$store.state.restaurantActive.restaurantUrl}  })
      } 
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
                      case 'canViewOrderForDelivery':
                          res = roles[index].canViewOrderForDelivery;
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

    // TODO Revisar el modal de cancelar una orden, buscar mejor manera.
    cancelOrder(order, customer){
      return this.$ionic.modalController
          .create({
          component: Modal,
          cssClass: 'my-custom-class',
          componentProps: {
              data: {
                  content: order._id,
              },
              propsData: {
                  title: this.$t('backoffice.form.titles.cancelOrder'),
                  button: this.$t('backoffice.list.messages.buttons.close'),
                  button2: this.$t('backoffice.form.buttons.cancelOrder'),
                  order: order,
                  customer: customer,
                  parent: this,
              },
          },
          })
          .then(m => m.present())
      },

    showDeliveringLocation(orderP){
      this.$router.push({
          name: 'Localization',
          params: {
            order: orderP,
            fun: 'read'
          }
      });
    },

    showTravel(orderP){
      this.$router.push({
          name: 'Localization',
          params: {
            order: orderP,
            fun: 'travel'
          }
      });
    },

    curbsideDetail(licencePlate, vehicleModel, vehicleColor){

      let mess = this.$t('frontend.orderType.licencePlate') + ': <strong>' + licencePlate + '</strong>';
      mess += '<br> ';
      mess += this.$t('frontend.orderType.vehicleModel') + ': <strong>' + vehicleModel+ '</strong>';
      mess += '<br> ';
      mess += this.$t('frontend.orderType.vehicleColor') + ': <strong>' + vehicleColor+ '</strong>';

        return this.$ionic.alertController.create({
        title: this.$t('frontend.home.curbsideDetail'),
        message: mess,
        buttons: [
          {
            text: this.$t('frontend.home.acept'),
            handler: () => {
            }
          },
        ]
      })
      .then(a => a.present());

    },

    alertNotProductForReoder(){
      return  this.$ionic.alertController
      .create({
          cssClass: 'my-custom-class',
          header: 'Error',
          message: this.$t('frontend.home.noProductForReorder'),
          buttons: [                   
          {
              text: this.$t('frontend.home.acept'),
              handler: () => { 
              },
          },
          ],
      })
      .then(a => a.present())
    },

    async reOrder(order){

      const response = this.$store.state.backConfig.staff.product;
      const products = response.data;
    
      for(var i=0; i< order.Products.length; i++){
        order.Products[i].State = 0;
        const inx = products.findIndex(pr => pr._id === order.Products[i].ProductId);      
        if(inx !== -1){
          if(products[inx].Available === false){         
            order.Products.splice(i, 1);
            this.producstNotAvailables +=', ' + products[inx].Name;
          }  
        }               
      }  
      if(order.Products.length === 0)
        return this.alertNotProductForReoder();      
    else{
      if(order.OrderType !== 'Delivery') delete order.OrderType;
      if(order.Discount ) delete order.Discount;
      if(order.isTicket ) delete order.isTicket;
      delete order._id;

        const guess = {            
          Name: order.CustomerName || '',
          EmailAddress: order.CustomerEmail || '',
          Phone: order.CustomerPhone || '',
      }
      this.$store.commit('setGuess', guess);
      this.$store.commit('setOrder', order);
      this.$store.commit('setCart', order.Products);

      
      if(this.$store.state.restaurantActive.restaurantUrl){
          if(order.OrderForCatering)
        return this.$router.push({ name: 'Home', params: {isCatering: true, url: this.$store.state.restaurantActive.restaurantUrl} })
      return this.$router.push({ name: 'Home', params: {url: this.$store.state.restaurantActive.restaurantUrl}  })

      }
      
    }
    },

    reverseOrders(){
      this.filterOrders.reverse();
    },

    getIdNumber(order){
      let transId = order._id;
       return transId.slice(-4)
    },

    async changeProductState(order, index){
      order.Products[index].State = 1;
      await Api.putIn('Order', order);
      this.cartKey ++;
    },

    stateByOrder(order){
      // TODO definir los estados para Ticket y Catering.
      const possibleStates = [];
          for (let i = order.State; i < this.statesAll.length - 1; i++) {
              const element = this.statesAll[i];
              if (order.OrderType != "Delivery" && this.statesAll[i].name == "On the way")
                    continue;
              if (!possibleStates.includes(element))
                    possibleStates.push(element);
          }
      return possibleStates
    },

    async stateToChange(order, state){      
      const index = this.statesAll.findIndex(s => s.name === state)
      //console.log(index);
      if(index !== -1 ){
        order.State = index;
        await Api.putIn('Order', order);
        this.fetchOrders();
        this.stateKey ++;
      }      
    },

    async showOrderNote(order){
      const alert = await this.$ionic.alertController
      .create({
        cssClass: 'my-custom-class',
        header: this.$t('frontend.order.notes') ,
        message: order.Note,
        inputs: [  
          { type:'textarea', name: 'address', placeholder: this.$t('frontend.order.add') },               
        ],  
        buttons: [
          {text: this.$t('frontend.home.cancel'),role: 'cancel', cssClass: 'secondary',
            handler: () => {                
            },
          },
          {
            text: this.$t('frontend.home.acept'),
            handler: async (data) => {
                if(data.address !== order.Note){
                  const n = order.Note || ''
                  order.Note = n + "\n" + data.address;
                  await Api.putIn('Order', order);
                }              
            },
          },
        ],
      })
      // .then(a => a.present())
      return alert.present();
    },

    // TODO hacer el scroll to top.
    scrollToTop() {
      document.querySelector('ion-card-content').scrollToTop(500);
    },

    changeFilterType(value){
        
      if(value === 'order'){
          console.log('entro a order');
        this.orders = this.completeOrder.filter(order => !order.Deleted);
        this.orders = this.orders.filter(order => order.OrderForCatering != true);
        this.orders = this.orders.filter(order => order.isTicket == false || (order.isTicket == true && order.State == 5));
        this.orders.reverse();
        this.filterOrders = this.orders;   
        console.log(this.orders);
        console.log(this.filterOrders);
        return;
      }
      if(value === 'ticket'){
        this.orders = this.completeOrder.filter(order => !order.Deleted);
        this.orders = this.orders.filter(order => order.OrderForCatering != true);
        this.orders = this.orders.filter(order => order.isTicket === true );
        this.orders.reverse();
        this.filterOrders = this.orders; 
        return;  
      }
      if(value === 'catering'){
        this.orders = this.completeOrder.filter(order => !order.Deleted);
        this.orders = this.orders.filter(order => order.OrderForCatering === true);
        this.orders = this.orders.filter(order => order.isTicket === false );
        this.orders.reverse();
        this.filterOrders = this.orders;   
        return; 
      }
      if(value === 'delivery'){
         const user_login = this.$store.state.user;
         this.orders = this.completeOrder.filter(order => !order.Deleted);
          //Verificar si es un usuario con el rol de driver
          if (user_login.IsDriver)
            this.orders = this.orders.filter(item => item.State == 4 && item.Driver == user_login._id)
          else
            this.orders = this.orders.filter(item => item.State == 4)
            this.orders.reverse();
            this.filterOrders = this.orders;

             //TODO verificar el resto del flujo de delivery.
      }
     
   

    }

 
  },

}

</script>

<style>

html {
  scroll-behavior: smooth;
}

.emptyResult{
    padding: 20px;
}

.card-categories{
  float: left;
}

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