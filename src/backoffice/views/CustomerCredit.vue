<template>
  <div id="user" class="page">
    <listView v-if="1"
      :title="$t('backoffice.titles.customerCredit')"
      :filter="filterCredits"
      :elements="credits"
      :hasConfig="true"
      :viewSelected="'Admin'"
      :add="hasPermission('canCreateCredit')"
      :edit="hasPermission('canEditCredit')"
      :remove="hasPermission('canDeleteCredit')"
      @handleInput="handleInput"
      @handleAddClick="createCredit"   
      @editElement="viewCredit"
      @deleteElement="deleteCredit"   
    ></listView>
  </div>

</template>

<script>

import { Api } from '../api/api.js';
import { Utils } from '../utils/utils.js';
import listView from "../components/ListView";

 import CreditSetting from './creditSetting.vue'

export default {

  name: 'credit',
  created: async function(){
    this.screenWidth = screen.width;
    this.credits = this.$store.state.backConfig.customerCredit;
    this.credits.reverse();
    this.filterCredits = this.credits; 
     this.customers = this.$store.state.backConfig.allCustomer;
  },
   components:{   
    listView,
  },  

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
      paginate: ['languages'],

      spinner: false,
      screenWidth: 0,

      filterStatus: "all",
      menuactive: 'list',
      
      cartKey: 0,
      stateKey: 0,
      statesAll: [        
        { state: 0,
          name: 'Requested'},
        { state: 1,
          name: 'Accepted'},
        { state: 2,
          name:  'Closed' },
        { state: 3,
          name: 'Cancelled'},
        ],
    keyList: 0,      
    }
  }, 
  methods: {

    async doRefresh() {
      this.spinner = true;
      await Api.fetchAll(this.modelName).then(async response => {
        this.$store.state.backConfig.category = response.data
         await this.fetchCategories();    
        this.spinner = false;
        this.keyList ++;
      })
      .catch(e => {
        e;
        this.spinner = false;
      });
        
    },

    ListViewData(option, count){
      if(count === 1) return null;
      if(count === 2) return option.Name;
      if(count === 3) return '- ' + this.getCustomerById(option.CustomerId).Name 
      if(count === 4) return this.getFormatedDate(option.DateFrom) +' - ' +this.getFormatedDate(option.DateTo);
      if(count === 5) return this.statesAll[option.State].name

    },

    initialize(){
        this.fetchCredit();
        this.fetchCustomers();
        this.changeFilterStatus('all');
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

    deleteCredit: async function(id){

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
            handler: async() => {
              
              this.spinner = true;
              await Api.deleteById(this.modelName, id)
                .then(response => {
                  const index = this.$store.state.backConfig.customerCredit.findIndex( c => c._id === id);
                  if(index !== -1) this.$store.state.backConfig.customerCredit.splice(index, 1)
                  this.showToastMessage(this.$t('backoffice.list.messages.messageDeleteSuccessCredit'), "success");
                  this.fetchCredit();
                  this.spinner = false;
                  return response;
                })
                .catch(e => {
                  e;
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
  
    handleInput(value) {
       this.filterCredits = this.credits
      const query = value.toLowerCase();
      requestAnimationFrame(() => {
        let cat2 = this.credits.filter(
          (item) => item.Name.toLowerCase().indexOf(query) > -1 ||
          this.statesAll[item.State].name.toLowerCase().indexOf(query) > -1
        );
        if (cat2.length > 0) this.filterCredits = cat2;
        else this.filterCredits = this.credits;
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
                let cat2 = this.credits.filter(item => item.StaffName &&
                                                        item.StaffName != '')
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
   
    getFormatedDate: function(date){
        return Utils.getFormatedDate(date);
    },
   
    getFormatPrice: function(price){
        return Utils.getFormatPrice(price);         
    },

    fetchCredit: async function(){
      this.credits = this.$store.state.backConfig.customerCredit;
      this.credits.reverse();
      this.filterCredits = this.credits;
    },

    fetchCustomers: function(){
      this.customers = this.$store.state.backConfig.allCustomer;
      // CONOCER SI ES A CUALQUIER CUSTOMER O A LOS CUSTOMERS DEL RESTAURANTE       
    },
    
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
        const customer  = this.customers.find(c => c._id === id)
        if(customer) return customer
        else return {}
    },



    acceptCredit(credit){
        if (credit.DateTo != '' && credit.DateFrom != ''){
            credit.State = 1
            Api.putIn('customercredit', credit)
            .then(() => {
              const index = this.$store.state.backConfig.customerCredit.find(c => c._id === credit._id);
              if(index !== -1){
               this.$store.state.backConfig.customerCredit[index].State = 1
            }
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