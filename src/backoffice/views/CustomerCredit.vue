<template>

  <div id="credit" class="screen" >
   
        <ion-header>
              <ion-toolbar>
                <ion-buttons slot="start">
                  <ion-back-button default-href="/controlPanel" @click="$router.push({ name: 'ControlPanel'})"></ion-back-button>
                </ion-buttons>
                <ion-label style="padding: 20px 100px;">
                  <h1>{{$t('backoffice.titles.customerCredit')}}</h1>                               
                </ion-label> 
                <ion-label slot="end">  
                    <!-- <ion-chip style="font-size: 30px" outline color="primary" @click="createCredit()" v-if="hasPermission('canCreateCredit')" > -->
                    <ion-chip style="font-size: 30px" v-if="hasPermission('canCreateCredit')" outline color="primary" @click="createCredit()" >
                        <ion-label><ion-icon name="add"></ion-icon></ion-label>
                    </ion-chip>
                </ion-label> 
                <ion-label slot="end">  
                    <!-- <ion-chip style="font-size: 30px" outline color="primary" @click="createCredit()" v-if="hasPermission('canCreateCredit')" > -->
                    <ion-chip style="font-size: 30px" v-if="hasPermission('canChangeSetting')" outline color="primary" @click="showSettingModal()" >
                        <ion-label><span class="iconify" data-icon="ic:baseline-settings" data-inline="false"></span></ion-label>
                    </ion-chip>
                </ion-label> 
              </ion-toolbar>

                <div > 
                    <ion-button @click="menuactive='list'" :style="menuactive==='list'? 'opacity: 1;;border: outset;' : 'opacity: 0.65;border: none;' ">
                      <span class="iconify" data-icon="foundation:list-bullet" data-inline="false" style="width: 20px;height: 20px;margin: 5px;"></span>
                    </ion-button>  
                    <ion-button    @click="menuactive='grid'" :style="menuactive==='grid'? 'opacity: 1;border: outset;' : 'opacity: 0.65;border: none;' ">
                      <span class="iconify" data-icon="clarity:grid-chart-solid" data-inline="false" style="width: 20px;height: 20px;margin: 5px;"></span>
                    </ion-button>  
                    <ion-button style="border: outset;" @click="reverseCredits()">
                      <span class="iconify" data-icon="fluent:chevron-up-down-20-filled" data-inline="false" style="width: 20px;height: 20px;margin: 5px;"></span>
                    </ion-button>
                </div> 

              <ion-searchbar  
                  @input="handleInput($event.target.value)" @ionClear="filterCredits = credits"
                    :placeholder="$t('frontend.home.search')">           
              </ion-searchbar>
              <div style="width: 100%">
                  <ion-segment scrollable color="tertiary" @ionChange="changeFilterStatus($event.target.value)" :value="filterStatus">
                      <ion-segment-button value="home">
                            <ion-icon name="home"></ion-icon>
                      </ion-segment-button>
                      <ion-segment-button value="all">
                            {{$t('frontend.reservation.all')}}
                      </ion-segment-button>
                      <ion-segment-button value="active">
                            {{$t('backoffice.form.fields.active')}}
                      </ion-segment-button>
                      <ion-segment-button value="requested">
                            Requested
                      </ion-segment-button>
                      <ion-segment-button value="accepted">
                            Accepted
                      </ion-segment-button>
                      <ion-segment-button value="closed">
                            Closed
                      </ion-segment-button>
                      <ion-segment-button value="state6">
                            {{$t('frontend.order.state6')}}
                      </ion-segment-button>
                  </ion-segment>
              </div>
        </ion-header>

        <div v-if="spinner">
            <ion-spinner name="lines" class="spinner"></ion-spinner>
        </div>
        <div v-else> 
              <paginate v-if="filterCredits.length > 0 && menuactive==='list'"
                name="languages"
                :list="filterCredits"
                :per="8">
                
                  <ion-item-sliding  v-for="credit in paginated('languages')" v-bind:key="credit._id">
                    <ion-item
                        @click="viewCredit(credit._id)"
                        :style="credit.State == 0 ? '--background:#bb6d09' : credit.State == 1 ? '--background:#49750a' :
                        credit.State == 2 ? '--background:#2f2f31' : '--background:#b70808'">
                        <ion-label class="menu-col-4 elipsis-menu">
                            <h6><span style="color: white;">{{ credit.Name }}</span></h6>
                            <h6 v-if="credit.CustomerId"><span style="color: white;">{{ getCustomerById(credit.CustomerId).Name }}</span></h6>           
                        </ion-label>
                        <ion-label class="menu-col-4 elipsis-menu">                   
                            <h6><span style="color: white;"><b>{{ getFormatedDate(credit.DateFrom) }}/{{ getFormatedDate(credit.DateTo) }}</b></span></h6>
                        </ion-label>
                        <ion-label class="menu-col-4 elipsis-menu">
                            <h6><span style="color: darkblue"><b>{{ getTotalPayed(credit) }}</b></span></h6>
                            <h6><span style="color: darkblue"><b>{{ getFormatPrice(credit.Debt) }}</b></span></h6>
                            <h6><span><b>{{ getFormatPrice(credit.CreditAmount) }}</b></span></h6>                 
                        </ion-label>                
                    </ion-item>
                    <ion-item-options side="end"> 
                        <ion-item-option color="primary" v-if="hasPermission('canEditCredit')" @click="viewCredit(credit._id)">
                          <ion-icon slot="icon-only" name="list"></ion-icon>
                        </ion-item-option>
                        <ion-item-option v-if="credit.State != 1 && credit.State != 3 && hasPermission('canEditCredit')" color="primary" @click="showCreditApproveModal(credit._id)">
                          <ion-icon slot="icon-only" name="checkmark"></ion-icon>
                        </ion-item-option>
                        <ion-item-option v-if="credit.State != 3 && hasPermission('canEditCredit')" color="danger" @click="cancelCredit(credit)">
                          <ion-icon slot="icon-only" name="close"></ion-icon>
                        </ion-item-option>
                        <!-- <ion-item-option v-if="hasPermission('canDeleteCredit')" color="danger"
                        @click="deleteCredit(credit._id)" v-tooltip="'Eliminar'"> -->
                        <ion-item-option color="danger" v-if="hasPermission('canDeleteCredit')"
                        @click="deleteCredit(credit._id)" v-tooltip="'Eliminar'">
                            <ion-icon slot="icon-only" name="trash"></ion-icon>
                        </ion-item-option>
                    </ion-item-options >
                  </ion-item-sliding>

              </paginate>
              <div v-if="filterCredits.length > 0  && menuactive==='list'">
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

                        <div  v-for="credit in filterCredits" v-bind:key="credit._id" 
                            style="text-align: right;"             
                            :class="scope.isLarge || scope.isXlarge ? 'menu-col-3 card-categories' : scope.isMedium? 'menu-col-4 card-categories' : scope.isSmall || scope.noMatch ?'menu-col-12 card-categories': 'menu-col-3 card-categories'">
                                
                              <ion-chip style="margin: 0;bottom: -10px; font-weight: bold;" outline
                                 :style="credit.State == 0 ? '--background:#bb6d09' : credit.State == 1 ? '--background:#49750a' :
                        credit.State == 2 ? '--background:#2f2f31' : '--background:#b70808'"
                                >
                                {{ getFormatedDate(credit.DateFrom) }} - {{ getFormatedDate(credit.DateTo) }}
                              </ion-chip>
                            <ion-card style="text-align: left;"   
                            :style="credit.State == 0 ? '--background:#bb6d09' : credit.State == 1 ? '--background:#49750a' :
                        credit.State == 2 ? '--background:#2f2f31' : '--background:#b70808'">
                                <ion-card-header style="margin: 10px 5px 2px; padding: 10px;background:white;color: black;">
                                  <ion-card-title  style="color: black;">{{ credit.Name }}
                                  </ion-card-title>
                                  
                                  <ion-card-subtitle style="color: black; display: flex;justify-content: space-between;">
                                    <div style="text-align: center;"> 
                                      <span class="iconify" data-icon="bx:bxs-user-circle" data-inline="false" 
                                      style="color: #808080a6;width: 20px;  height: 20px; margin: 0;"></span>
                                    </div>
                                    <div style="text-align: right;"  >{{ getCustomerById(credit.CustomerId).Name }}</div>
                                  </ion-card-subtitle>

                                  <!-- <ion-card-subtitle v-if="order.StaffName"
                                    style="color: black; display: flex;justify-content: space-between;">
                                    <div style="text-align: center;"> 
                                      <span class="iconify" data-icon="grommet-icons:restaurant"
                                      style="color: #808080a6; width: 20px;  height: 20px; margin: 0;" data-inline="false"></span>
                                    </div>
                                    <span style="text-align: right;"  > {{ order.StaffName }}</span>
                                  </ion-card-subtitle> -->
                                    
                                  </ion-card-header>

                                  <ion-card-content style="margin: 1px 5px; padding: 5px;background:white;color: black;" :key="cartKey + 'C'">
                                    <div>
                                          <div style="display: flex;justify-content: space-between; padding: 2px;margin:5px 0">
                                            <span>Total Amount: {{getFormatPrice(credit.CreditAmount)}}</span>
                                            <span :style="credit.State == 3 ? 'text-decoration: line-through;':'text-decoration: none'">Debt: {{getFormatPrice(credit.Debt)}}</span> 
                                          </div>                          
                                    </div>
                                    <div v-for="pay in credit.Payed" v-bind:key="pay.id" >
                                        <span style="text-decoration: line-through;">{{pay.Date}} - {{getFormatPrice(pay.Amount)}}</span>
                                    </div>
                                  </ion-card-content>
                                  
                                  <ion-card-content style="margin:5px; background:white;color: black;text-align: center; padding: 0;" :key="stateKey + 'S'">
                                        <ion-button color="primary" v-if="hasPermission('canEditCredit')" @click="viewCredit(credit._id)">
                                            <ion-icon slot="icon-only" name="list"></ion-icon>
                                        </ion-button>
                                        <ion-button v-if="credit.State != 1 && credit.State != 3 && hasPermission('canEditCredit')" color="primary" @click="showCreditApproveModal(credit._id)">
                                            <ion-icon slot="icon-only" name="checkmark"></ion-icon>
                                        </ion-button>
                                        <ion-button v-if="credit.State != 3 && hasPermission('canEditCredit')" color="danger" @click="cancelCredit(credit)">
                                            <ion-icon slot="icon-only" name="close"></ion-icon>
                                        </ion-button>
                                        <ion-button color="danger" v-if="hasPermission('canDeleteCredit')" @click="deleteCredit(credit._id)" v-tooltip="'Eliminar'">
                                            <ion-icon slot="icon-only" name="trash"></ion-icon>
                                        </ion-button>
                                  </ion-card-content>              
                            </ion-card>
                        </div>

                      </div>
                    </div>
                  </v-breakpoint>
              </div>


              <div class="emptyResult" v-if="filterCredits.length === 0">
                  {{$t('backoffice.titles.emptyResult')}}
              </div>
        </div>    
  </div>

</template>

<script>

import { Api } from '../api/api.js';
import { Utils } from '../utils/utils.js';
// import { payAuthorizeNet } from '../api/payments.js';
// import Modal from './cancelOrderModal.vue';
// import { EventBus } from '../../frontend/event-bus';
 import { VBreakpoint } from 'vue-breakpoint-component'
 import CreditSetting from './creditSetting.vue'
 import CreditApprove from './CustomerCreditApprove.vue'
export default {

  name: 'credit',
  created: async function(){
   this.screenWidth = screen.width;


    this.$ionic.loadingController
        .create({
        cssClass: 'my-custom-class',
        message: this.$t('backoffice.titles.loading'),
        // duration: 1000,  
        backdropDismiss: true
    })
    .then(loading => {
        loading.present()
        setTimeout(async () => {  // Some AJAX call occurs
            await Api.fetchAll(this.modelName).then(response => {
              this.credits = response.data
              this.credits.reverse();
              this.filterCredits = this.credits; 
              loading.dismiss()
            })
            .catch(e => {
              console.log(e)
              loading.dismiss()
              this.ifErrorOccured(this.initialize)
            });

            this.fetchCustomers();
            this.changeFilterStatus('all');
        })
    })   

//    await this.getRestaurantConfig(); 

//    this.update = setInterval(() => {
//       this.initialize();
//    }, 30000);
//    if(this.resConf.Email)
//     this.getRestaurantCustomer();
  },
   components:{   
    VBreakpoint: VBreakpoint 
  },  
//   destroyed: function(){
//       if (this.update != null){
//           clearInterval(this.update);
//       }
//   },
  data () {
    return {
      modelName: 'customercredit',
      credits: [],
      customers: [],
      filterCredits: [],

      resConf: null,
      homeOrders: false,
      restaurantCustomer: null,

      update: null,
      loading: null,

      status: ['requested', 'accepted', 'closed', 'cancelled'],

      // workflowOrderStaus: ['Pending of pay', 'Started', 'In kitchen', 'Cooked', 'Delivering', 'Delivered', 'Canceled'],
      //   workflowOrderStaus: [this.$t('frontend.order.state0'), this.$t('frontend.order.state1'), this.$t('frontend.order.state2'), this.$t('frontend.order.state3'), this.$t('frontend.order.state4'), this.$t('frontend.order.state5'), this.$t('frontend.order.state6')],

      paginate: ['languages'],

      spinner: false,
      screenWidth: 0,

      //colors
    //   primaryColor: "",
    //   secondaryColor: "",
    //   tertiaryColor: "",

      filterStatus: "all",
      menuactive: 'list',
      
      cartKey: 0,
      stateKey: 0,
    //   statesAll: [
    //     { state: 0,
    //       name: this.$t('frontend.order.state0')},
    //     { state: 1,
    //       name: this.$t('frontend.order.state1')},
    //     { state: 2,
    //       name: this.$t('frontend.order.state2')},
    //     { state: 3,
    //       name: this.$t('frontend.order.state3')},
    //     { state: 4,
    //       name: this.$t('frontend.order.state4')},
    //     { state: 5,
    //       name: this.$t('frontend.order.state5')},
    //     { state: 6,
    //       name: this.$t('frontend.order.state6')},
    //     { state: 7,
    //       name: this.$t('frontend.order.state7')},
    //     { state: 8,
    //       name: this.$t('frontend.order.state8')} ],
          
    }
  }, 
  methods: {
    initialize(){
        this.fetchCredit();
        this.fetchCustomers();
        this.changeFilterStatus('all');
        //console.log("Update order");
    },
    showSettingModal(){

        return this.$ionic.modalController
                .create({
                component: CreditSetting,
                cssClass: 'my-custom-class',
                componentProps: {
                    data: {
                      
                    },
                    propsData: {
                       parent: this,
                    },
                },
                })
                .then(m => m.present())
    },
    showCreditApproveModal(creditId){

        return this.$ionic.modalController
                .create({
                component: CreditApprove,
                cssClass: 'my-custom-class',
                componentProps: {
                    data: {
                      
                    },
                    propsData: {
                       parent: this,
                       cId: creditId
                    },
                },
                })
                .then(m => m.present())
    },
    getTotalPayed(credit){
        let amount = 0;
        if (credit.Payed){
            credit.Payed.forEach(pay => {
                amount += pay.Amount
            });
        }
        
        return this.getFormatPrice(amount)
    },
    changeFilterStatus(value){

        //console.log(value)
        this.filterStatus = value
        let status = -1
        this.allReservations = this.reservations
        if (value == 'home')
        {
            this.filterHomeOreders()
            return
        }
        if (value == 'all')
        {
            this.filterCredits = this.credits
            return
        }
        if (value == 'active')
        {
            requestAnimationFrame(() => {
              let cat2 = this.credits.filter(item => item.Active == true)
              this.filterCredits = cat2
            })
            return
        }
        if (value == 'state6')
        {
            status = 3
        }
        if (value == 'requested')
        {
            status = 0
        }
        if (value == 'accepted')
        {
            status = 1
        }
        if (value == 'closed')
        {
            status = 2
        }
        requestAnimationFrame(() => {
          let cat2 = this.credits.filter(item => item.State == status)
          this.filterCredits = cat2
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
    deleteCredit: function(id){

        this.$ionic.alertController.create({
        title: this.$t('backoffice.list.messages.confirmDelete'),
        message: this.$t('backoffice.list.messages.deleteCredit'),
        buttons: [
          {
            text: this.$t('backoffice.list.messages.buttons.cancel'),
            role: 'cancel',
            handler: () => {}
          },
          {
            text: this.$t('backoffice.list.messages.buttons.delete'),
            handler: () => {
              
              this.spinner = true;
              Api.deleteById(this.modelName, id)
                .then(response => {
                  this.showToastMessage(this.$t('backoffice.list.messages.messageDeleteSuccessCredit'), "success");
                  this.fetchCredit();
                  this.spinner = false;
                  return response;
                })
                .catch(e => {
                  console.log(e);
                  this.ifErrorOccured(mess => {
                      this.deleteCredit(id)
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
    // showLoading(){
    //     return this.$ionic.loadingController
    //     .create({
    //       cssClass: 'my-custom-class',
    //       message: this.$t('backoffice.titles.loading'),
    //       // duration: 1000,  
    //       backdropDismiss: true
    //     })
    //     .then(a => a.present())
    // },
    handleInput(value){
      this.filterCredits = this.credits
      const query = value.toLowerCase();
      requestAnimationFrame(() => {   
        // let cat2 = this.credits.filter(item => 
        //                                   item.Date.indexOf(query) > -1 || 
        //                                        this.getOrderState(item.State).toLowerCase().indexOf(query) > -1)
        let cat2 = this.getCreditByCustomerName(query);
        if(cat2.length> 0)
          this.filterCredits = cat2
        else
          this.filterCredits = this.credits
      });
    },
    getCreditByCustomerName(name){
        let creditList = []
        this.credits.forEach(credit => {
            if (credit.CustomerId){
              if ((this.getCustomerById(credit.CustomerId).Name).toLowerCase() == name)
                  creditList.push(credit);
            }
            else{
               if (credit.CustomerName.toLowerCase() == name)
                  creditList.push(credit);
            }
        })
        return creditList
    },
    filterHomeOreders(){

        if (this.homeOrders == false)
        {
            // if(this.restaurantCustomer)
            // {
                //console.log("Restaurant Customer")
                // console.log(this.restaurantCustomer._id)
                // console.log(this.credits)
                // let cat2 = this.credits.filter(item => 
                //                               item.ClientId.indexOf(this.restaurantCustomer._id) > -1)
                let cat2 = this.credits.filter(item => item.StaffName &&
                                                        item.StaffName != '')
                //console.log(cat2)
                if(cat2.length > 0)
                {
                    this.filterCredits = cat2
                    this.homeOrders = true
                }
                else{
                    this.showToastMessage('There are not credits.', 'warning')
                }    
            // }
               
        }
        else{
            this.filterCredits = this.credits
            this.homeOrders = false
        }

    },
    payCredit: function(){
        //Implementar código para el pago del crédito.
    },
    viewCredit: function(id){
        this.$router.push({
        name: 'Credit-Form', 
        params: { creditId: id }
      });
    },
    // getOrderState(state){
    //     return this.workflowOrderStaus[state];
    // },
    getFormatedDate: function(date){
        return Utils.getFormatedDate(date);
    },
    // getFormateHour: function(date){
    //     return Utils.getFormatHour(date);         
    // },
    getFormatPrice: function(price){
        return Utils.getFormatPrice(price);         
    },
    /****** CRUD category methods ******/
    fetchCredit: async function(){
        await Api.fetchAll(this.modelName).then(response => {
          this.credits = response.data
          this.credits.reverse();
          this.filterCredits = this.credits;      
        })
        .catch(e => {
          console.log(e)
          this.ifErrorOccured(this.initialize)
        });
    },
    fetchCustomers: function(){
        Api.fetchAll('Customer').then(response => {
          this.customers = response.data
          return response
        })
        .catch(e => {
          console.log(e)
        });
    },
    // getRestaurantCustomer: async function(){
    //    await Api.findCustomerByEmail(this.resConf.Email)
    //     .then(response => { 
    //         this.restaurantCustomer = response.data
    //         //console.log("RESTAURANT CUSTOMER")
    //         //console.log(this.restaurantCustomer)
    //     })
    // },
    // getRestaurantConfig: async function(){
    //   await Api.fetchById('Restaurant', this.$store.state.user.RestaurantId).then(response => {
    //         this.resConf = response.data;
    //         if(this.resConf.Email)
    //           this.getRestaurantCustomer();
    //   })
    //   .catch(e => {
    //     console.log(e)
    //   });
    // },
    createCredit: function(){
        this.$router.push({
            name: 'Credit-Form', 
        });
    },
    hasPermission(permission){
        
        let res = false;
        if (this.$store.state.authenticated)
        {
            let roles = this.$store.state.roles;
            for (let index = 0; index < roles.length; index++) {
                switch(permission){                        
                      case 'canCreateCredit':
                          res = roles[index].canCreateCredit;
                          break;
                      case 'canEditCredit':
                          res = roles[index].canEditCredit;
                          break;
                      case 'canDeleteCredit':
                          res = roles[index].canDeleteCredit;
                          break;
                      case 'canChangeSetting':
                          res = roles[index].canChangeSetting;
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
    cancelCredit(credit){
        console.log(credit)
        credit.State = 3
        Api.putIn('customercredit', credit)
        .then(() => {
            this.showToastMessage('The credit was canceled sucessfully', 'success')
        })
    },
    acceptCredit(credit){
        if (credit.DateTo != '' && credit.DateFrom != ''){
            credit.State = 1
            Api.putIn('customercredit', credit)
            .then(() => {
                this.showToastMessage('The credit was accepted sucessfully', 'success')
            })
        }
        else{
            if (credit.DateTo == ''){
                this.showToastMessage('Date To cant be empty. You must fill Date To', 'danger')
            }
            if (credit.DateFrom == ''){
                this.showToastMessage('Date From cant be empty. You must fill Date From', 'danger')
            }
        }
        
    },
    reverseCredits(){
      this.filterCredits.reverse();
    },

    scrollToTop() {
      document.querySelector('ion-card-content').scrollToTop(500);
    },

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