<template>

  <div id="user" class="page">
    <listView
      :title="$t('backoffice.titles.orders')"
      :filter="filterOrders"
      :filterType="filterType"
      :elements="orders"
      :selectOptions="selectOptions"
      :cartKey="cartKey"
      :isOrder="true"
      :notAccepted="notAccepted"
      :viewSelected="'Sale'"
      :add="hasPermission('canCreateOrder')"
      :edit="hasPermission('canEditOrder') && !$store.state.user.IsDriver"
      :delivery="hasPermission('canViewOrderForDelivery')"	
      :remove="hasPermission('canEditOrder') && !$store.state.user.IsDriver"
      @handleInput="handleInput"
      @handleAddClick="createOrder"   
      @editElement="viewOrder"
      @deleteElement="deleteOrder"   
    ></listView>


   <ion-item-options side="end" v-if="0"> 

                                             

                     
                    </ion-item-options >


  </div>





</template>

<script>

import { Api } from '../api/api.js';
import { Utils } from '../utils/utils.js';
import Modal from './cancelOrderModal.vue';
 import listView from "../components/ListView";
export default {

  name: 'order',
  created: async function(){
    this.screenWidth = screen.width;
   
    this.completeOrder = this.$store.state.backConfig.order;
     const res = this.completeOrder.find(item => item.IsAccept === true)
    if (res)this.notAccepted = false;
    if(this.hasPermission('canViewOrder')) {
      this.changeFilterType('order');
      this.selectOptions = [ {state: 'order', value: this.$parent.$t('backoffice.titles.allOrders') },
                             { state: 'ticket', value: this.$parent.$t('backoffice.titles.tickets')} ,                            
                             {state: 'delivery', value: this.$parent.$t('backoffice.titles.ordersForDelivery')}]
      if(this.setting.viewCatering)
        this.selectOptions.push( { state: 'catering', value: this.$parent.$t('backoffice.titles.cateringOrders')});
    }
    else if(this.hasPermission('canViewOrderForDelivery')) {
      this.changeFilterType('delivery')
       this.selectOptions = [ {state: 'delivery', value: this.$parent.$t('backoffice.titles.ordersForDelivery')}]
      }



    this.resConf = this.$store.state.backConfig.restaurant;
    this.setting = this.$store.state.backConfig.setting;
    // setting.viewCatering
   
   this.update = setInterval(() => { this.fetchOrders();  }, this.timeInit);  
  },
   components:{   
    listView
  },  
  unmounted: function(){
      if (this.update != null){
          clearInterval(this.update);
      }
  },
  data () {
    return {
      modelName: 'Order',
      timeInit: 30000,
      orders: [],
      customers: [],
      setting: {},
      filterOrders: [],
      resConf: null,
      homeOrders: false,
      restaurantCustomer: null,

      update: null,
      loading: null,
      workflowOrderStaus: [this.$t('frontend.order.state0'), this.$t('frontend.order.state1'), this.$t('frontend.order.state2'), this.$t('frontend.order.state3'), this.$t('frontend.order.state4'), this.$t('frontend.order.state5'), this.$t('frontend.order.state6'), this.$t('frontend.order.state7'), this.$t('frontend.order.state8')],
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
      notAccepted: true,
      selectOptions: [],
      keyList: 0,
    }
    
  },

  methods: {

  
     async doRefresh() {
      // this.timeInit = 30000;
     await this.fetchOrders();     
     
    },

    ListViewData(option, count){
      if(count === 1) return null;
      if(count === 2) return option.OrderType;
      if(count === 3) return '- ' + this.getOrderState(option.State) 
      if(count === 4) if( option.CustomerName) return this.getFormatedDate(option.Date) +' '+ option.CustomerName; else return this.getFormatedDate(option.Date) ;
      if(count === 5) return this.getFormatPrice(option.Total)

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
         let cat2 = this.orders.filter(

          (item) => item.CustomerName &&
          item.CustomerName.toLowerCase().indexOf(query) > -1 ||
          item.StaffName &&
          item.StaffName.toLowerCase().indexOf(query) > -1 ||
          this.statesAll[item.State].name.toLowerCase().indexOf(query) > -1 ||
          item.OrderType.toLowerCase().indexOf(query) > -1 )      
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
 
    viewOrder: function(id){
      const order = this.orders.find( o => o._id === id);
      if(order.isTicket === true){
         if (order.State === 5)
          this.$router.push({ name: 'OrderDetails',  params: { orderId: order._id, type: 'ticket' }});        
        else
          this.$router.push({ name: 'TicketForm',  params: { orderId: order._id } });
      }
      else if(order.OrderForCatering === true)
       this.$router.push({  name: 'OrderDetails',  params: { orderId: order._id, type: 'catering' } });
      // else if(  order.State === 4  && order.OrderType==='Delivery')
      //  this.$router.push({name: 'Localization', params: {order: order, fun: 'write'   }});
      else  this.$router.push({ name: 'OrderDetails', params: { orderId: order._id } });
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
        const res = this.completeOrder.find(item => item.IsAccept === true)
        if (res)this.notAccepted = false;
        this.$store.state.backConfig.order = response.data;
        this.spinner = false;
        this.changeFilterType(this.filterType);
      })
      .catch(e => { e;
        e;
         this.spinner = false;
      });
    },

    createOrder: function(){
      if(this.$store.state.restaurantActive.restaurantUrl){
        return this.$router.push({ name: 'Home', params: {url: this.$store.state.restaurantActive.restaurantUrl, isFronBack: true}  })
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
                      case 'canViewOrder':
                            res = roles[index].canViewOrder;
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
      this.$router.push({ name: 'Localization',  params: { order: orderP,fun: 'read' } });
    },

    showTravel(orderP){
      this.$router.push({  name: 'Localization', params: { order: orderP,  fun: 'travel' } });
    },

    curbsideDetail(order){

      const licencePlate = order.LicencePlate;
      const vehicleModel =  order.VehicleModel;
      const vehicleColor = order.VehicleColor;

      let mess = this.$t('frontend.orderType.vehicleModel') + ': <strong>' + vehicleModel+ '</strong>' ;
      mess += '<br> ';
      mess += this.$t('frontend.orderType.licencePlate') + ': <strong>' + licencePlate + '</strong>';
      mess += '<br> ';
      mess += this.$t('frontend.orderType.vehicleColor') + ': <strong>' + vehicleColor+ '</strong>';

        return this.$ionic.alertController.create({
        header: this.$t('frontend.home.curbsideDetail'),
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
          header: '',
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

      const products = this.$store.state.backConfig.product;
    
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
        return this.$router.push({ name: 'Home', params: {isCatering: true, url: this.$store.state.restaurantActive.restaurantUrl,isFronBack: true } })
      return this.$router.push({ name: 'Home', params: {url: this.$store.state.restaurantActive.restaurantUrl, isFronBack: true}  })

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

   

    async stateToChange(order, state){      
      const index = this.statesAll.findIndex(s => s.name === state)
      if(index !== -1 ){
        order.State = index;
        await Api.putIn('Order', order);
        this.fetchOrders();
        this.stateKey ++;
      }      
    },

    async acceptOrder(order){
        const item = {
            "_id": order._id,
            'IsAccept': true
        }
        this.spinner = true;
        await Api.putIn('Order', item);
        await this.fetchOrders();
        this.spinner = false;         
    },

    async notAcceptOrder(order){
        const item = {
            "_id": order._id,
            'IsAccept': false
        }
        this.spinner = true;
        await Api.putIn('Order', item);
        await this.fetchOrders();
        this.spinner = false;         
    },

    writeLocalization(orderP){
        this.$router.push({ name: 'Localization', params: {  order: orderP,  fun: 'write'   } });
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
      this.filterType = value;
        
      if(value === 'order'){         
        this.orders = this.completeOrder.filter(order => !order.Deleted);       
        this.orders.reverse();
        this.filterOrders = this.orders;   
        this.keyList ++;
        return;
      }
      if(value === 'ticket'){
        this.orders = this.completeOrder.filter(order => !order.Deleted);
        this.orders = this.orders.filter(order => order.OrderForCatering != true);
        this.orders = this.orders.filter(order => order.isTicket === true );
        this.orders.reverse();
        this.filterOrders = this.orders; 
         this.keyList ++;
        return;  
      }
      if(value === 'catering'){
        this.orders = this.completeOrder.filter(order => !order.Deleted);
        this.orders = this.orders.filter(order => order.OrderForCatering === true);
        this.orders = this.orders.filter(order => order.isTicket === false );
        this.orders.reverse();
        this.filterOrders = this.orders;   
         this.keyList ++;
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

           this.keyList ++;
           return;

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