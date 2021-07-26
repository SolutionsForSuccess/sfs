<template>
    <div class="screen">

    <ion-header>
          <ion-toolbar>
            <ion-buttons slot="start">
              <ion-back-button default-href="/controlPanel" @click="$router.push({ name: 'Credit'})"></ion-back-button>
            </ion-buttons>
            <ion-label style="padding: 20px 100px;">
              <h1>{{title}}</h1>            
            </ion-label>
          </ion-toolbar>
    </ion-header>
    <br/>

      <!-- <ion-card> -->
    <div v-if="spinner">
        <ion-spinner name="lines" class="spinner"></ion-spinner>
    </div>
    <div v-else>
        <!-- States -->
        <div v-if="state == 0" style="height:45px; width:100%; background-color:#b38448; padding:10px; color:white">State: Requested</div>
        <div v-if="state == 1" style="height:45px; width:100%; background-color:#74845e; padding:10px; color:white">State: Accepted</div>
        <div v-if="state == 2" style="height:45px; width:100%; background-color:#76b6d5; padding:10px; color:white">State: Closed</div>
        <div v-if="state == 3" style="height:45px; width:100%; background-color:#e37b7b; padding:10px; color:white">State: Canceled</div>

        <div v-if="state == 0 || state == -1">
            <ion-item>
            <ion-label position="floating"><span style="color: red">*</span>{{$t('backoffice.form.fields.name')}}</ion-label>
            <ion-input name="creditName" 
                @input="creditName = $event.target.value"
                v-bind:value="creditName">    
                </ion-input>
            </ion-item>

            <ion-list>
                <ion-list-header>
                    <ion-label>
                    <span style="color: red">*</span>{{$t('backoffice.form.titles.customer')}}
                    </ion-label>
                </ion-list-header>

                <ion-item>
                    <ion-label>{{$t('backoffice.form.titles.selectACustomer')}}</ion-label>
                    <ion-select  :ok-text="$t('backoffice.form.messages.buttons.ok')" :cancel-text="$t('backoffice.form.messages.buttons.dismiss')"
                    @ionChange="customerId = $event.target.value" v-bind:value="customerId">
                        <ion-select-option v-for="customer in customers" v-bind:key="customer.Id" v-bind:value="customer._id" >{{customer.Name}}</ion-select-option>
                    </ion-select>
                </ion-item>
            </ion-list>

            <ion-item>
                <span style="color: red">*</span><ion-label position="floating">{{$t('backoffice.form.fields.CreditAmount')}}</ion-label>
                <ion-input type="number" name="CreditAmount"
                @input="creditAmount = $event.target.value" 
                v-bind:value="creditAmount">
                </ion-input>
            </ion-item>

            <!-- <ion-item>
                <ion-label>{{$t('backoffice.form.fields.available')}}</ion-label>
                <ion-checkbox slot="end" name="active" 
                @ionChange="active = $event.target.checked"
                :checked="active"  >    
                </ion-checkbox>
            </ion-item> -->

            <ion-item>
                <span style="color: red">*</span><ion-label>{{$t('backoffice.form.fields.DateFrom')}}(yyyy-dd-MM)</ion-label>
                <ion-datetime name="dateFrom" @ionChange="dateFrom = $event.target.value" 
                                v-bind:value="dateFrom"
                                :placeholder="$t('backoffice.form.titles.dateFromSelect')" display-format="YYYY-DD-MM">
                </ion-datetime>
            </ion-item>

            <ion-item>
                <span style="color: red">*</span><ion-label>{{$t('backoffice.form.fields.DateTo')}}(yyyy-dd-MM)</ion-label>
                <ion-datetime name="dateFrom" @ionChange="dateTo = $event.target.value" 
                                v-bind:value="dateTo"
                                :placeholder="$t('backoffice.form.titles.dateToSelect')" display-format="YYYY-DD-MM">
                </ion-datetime>
            </ion-item>

            <ion-item>
                <span style="color: red">*</span><ion-label>{{$t('backoffice.form.fields.DateLimit')}}(yyyy-dd-MM)</ion-label>
                <ion-datetime name="dateFrom" @ionChange="dateLimit = $event.target.value" 
                                v-bind:value="dateLimit"
                                :placeholder="$t('backoffice.form.titles.dateToSelect')" display-format="YYYY-DD-MM">
                </ion-datetime>
            </ion-item>

            <ion-item v-if="state == 0 && othersRestaurants.length > 1">
                <ion-label>Extend for All Restaurants</ion-label>
                    <ion-checkbox slot="end" name="active" 
                    @ionChange="extendAll = $event.target.checked"
                    :checked="extendAll"  >    
                </ion-checkbox>
            </ion-item>
        </div>

        <div v-if="state == 1 || state == 2 || state == 3">
            <ion-grid>
                <ion-row class="left">
                    <ion-col>
                        <div><span class="title">Credit Name: </span> </div>
                    </ion-col>
                    <ion-col>
                        {{creditName}}
                    </ion-col>
                </ion-row>
                <ion-row class="left">
                    <ion-col>
                        <div><span class="title">Customer Name: </span></div>
                    </ion-col>
                    <ion-col>
                        {{getCustomerById(customerId)}}
                    </ion-col>
                </ion-row>
                <ion-row class="left">
                    <ion-col>
                        <div><span class="title">Credit Amount: </span></div>
                    </ion-col>
                    <ion-col>
                        {{getFormatPrice(creditAmount)}}
                    </ion-col>
                </ion-row>
                <ion-row class="left">
                    <ion-col>
                        <div><span class="title">Date From: </span></div>
                    </ion-col>
                    <ion-col class="right">
                        {{getFormatedDate(dateFrom)}}
                    </ion-col>
                </ion-row>
                <ion-row class="left">
                    <ion-col>
                        <div><span class="title">Date To:</span></div>
                    </ion-col>
                    <ion-col>
                        {{getFormatedDate(dateTo)}}
                    </ion-col>
                </ion-row>
                <ion-row class="left">
                    <ion-col>
                        <div><span class="title">Date Limit: </span></div>
                    </ion-col>
                    <ion-col>
                        {{getFormatedDate(dateLimit)}}
                    </ion-col>
                </ion-row>
            </ion-grid>
        </div>

      <br/>

      <ion-card v-if="state == 1 || state == 2 || state == 3">
          <ion-item v-if="debt > 0">
              <ion-label position="floating"></ion-label>
              <ion-input :placeholder="'Please, enter an amount to pay. Total for pay: ' + pendingAmount()" name="amountToPay" 
                    @input="amountToPay = $event.target.value" @change="verifyAmount()"
                    v-bind:value="amountToPay"></ion-input>
              <ion-item-group slot="end">
                  <ion-button :disabled="!isValidAmount()" color="primary" @click="payCredit()">{{ $t('frontend.order.pay') }}</ion-button>
              </ion-item-group>
          </ion-item>
          <ion-grid v-if="Payed.length > 0">
              <ion-row style="text-align: center">
                  <ion-col>
                      <b>Transaction</b>
                  </ion-col>
                  <ion-col>
                      <b>Date</b>
                  </ion-col>
                  <ion-col>
                      <b>Amount</b>
                  </ion-col>
              </ion-row>
              <ion-row v-for="pay in Payed" :key="pay.PaymentId">
                  <ion-col>
                      <a @click="goToPayment(pay.Payment)">{{pay.Payment.transId}}</a>
                  </ion-col>
                  <ion-col>
                      {{getFormatedDate(pay.Date)}}
                  </ion-col>
                  <ion-col>
                      {{getFormatPrice(pay.Amount)}}
                  </ion-col>
              </ion-row>
          </ion-grid>

      </ion-card>

      <div v-if="state == 0 || state == -1">
          <ion-button expand="full" color="primary" :disabled="!isValidForm()" @click="saveCredit()">{{ $t('backoffice.form.buttons.save') }}</ion-button>
      </div>
        <!-- <ion-button expand="full" color="tertiary" @click="getAnothersRestaurants()">test</ion-button> -->
    </div>
    </div>
</template>

<script>

import { Api } from '../api/api.js';
import PaymentSplited from '../../frontend/components/PaymentSplited';
import moment from 'moment-timezone';
import { Utils } from '../utils/utils.js';

export default {

  name: 'creditForm',
   
  data () {
    return {
      modelName: 'customercredit',
      /****** Form Data ******/
      id: null,

      creditName: '',
      customerId: null,
      customerName: null,

      creditAmount: 0,
      debt: 0,
      active: false,
      state: -1,
      dateFrom: '',
      dateTo: '',
      dateLimit: '',
      Payed: [],

      extendAll: false,
      othersRestaurants: [],

      creditSetting: null,

      customers: [],
      parentId: null,

      allCredits: [],

      //Pay
      amountToPay: '',

      spinner: false,
    }
  },
  created: function(){
      this.init()
  },
  computed: {
        title() {
            return this.id ? this.$t('backoffice.form.titles.creditEditTitle') :  this.$t('backoffice.form.titles.creditNewTitle');
        }
  },
  methods: {
    init(){
        console.log(this.today)

        this.id = this.$route.params.creditId;
        this.fetchCustomers();
        this.fetchAllCredits();
        this.getCreditConfig();
        this.getAnothersRestaurants();
        if (this.id){
          this.$ionic.loadingController
          .create({
            cssClass: 'my-custom-class',
            message: this.$t('backoffice.titles.loading'),
            backdropDismiss: true
          })
          .then(loading => {
              loading.present()
              setTimeout(() => {  // Some AJAX call occurs
                  Api.fetchById(this.modelName, this.id)
                    .then(response => {
                      this.creditName = response.data.Name;
                      this.customerId = response.data.CustomerId;
                      this.creditAmount = response.data.CreditAmount;
                      this.active = response.data.Active;
                      this.state = response.data.State;
                      this.dateFrom = response.data.DateFrom;
                      this.dateTo = response.data.DateTo;
                      this.dateLimit = response.data.PayLimitDate;
                      this.Payed = response.data.Payed;
                      this.debt = response.data.Debt;

                      console.log(this.Payed)
                      loading.dismiss();
                      return response;
                    })
                    .catch(e => {
                      console.log(e);
                      loading.dismiss();
                      this.ifErrorOccured(this.init)
                    })
              })
          })

          }
    },
    getCustomerById: function(id){
        var custom = '';
        this.customers.forEach(customer => {
            if (customer._id == id) {
                custom = customer;                
            }
        });
        return custom.Name;
    },
    getAnothersRestaurants(){
        const user = this.$store.state.user
        var restaurants = user.AllRestaurant
        // restaurants.splice(restaurants.indexOf(user.RestaurantId), 1)
        console.log(user.RestaurantId)
        this.othersRestaurants = restaurants
        console.log(this.othersRestaurants)
        console.log(this.$store.state.user.AllRestaurant)
    },
    getCreditConfig(){
        Api.fetchAll('Setting')
        .then(response => {
            this.creditSetting = response.data[0]
            console.log(this.creditSetting)
        })
        .catch(e => {
            console.log(e)
        })
    },
    getFormatPrice: function(price){
        return Utils.getFormatPrice(price);         
    },
    getFormatedDate: function(date){
        return Utils.getFormatedDate(date);
    },
    goToPayment(pay){
        this.$router.push({
            name: 'PaymentDetail',
            params: {
              payment: pay,
            }
        })
    },
    getSelectedCustomerName(customerId){
        const customer = this.customers.find(customer => customer._id == customerId)
        return customer.Name
    },
    ifErrorOccured(action){
      return this.$ionic.alertController.create({
          title: this.$t('backoffice.list.messages.connectionError'),
          message: this.$t('backoffice.list.messages.connectionErrorMessage'),
          buttons: [
            {
              text: this.$t('backoffice.list.messages.buttons.goToList'),
              handler: () => {
                this.$router.push({
                    name: 'Credit',
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
    fetchAllCredits(){
        Api.fetchAll('customercredit')
        .then(response => {
            this.allCredits = response.data
            this.allCredits = this.allCredits.filter(credit => credit.Active == true)
        })
        .catch(e => {
            console.log(e)
        })
    },
    verifyActiveCredits(customerId){
        const creditExist = this.allCredits.find(credit => credit.CustomerId == customerId && credit.Active == true)
        if (creditExist)
        { 
            return false
        }
        return true
    },
    verifyAmount(){
        if (this.amountToPay > this.pendingAmount())
            this.amountToPay = this.pendingAmount()
    },
    isValidForm(){
        // let errors = [];
        if (this.creditName == ""){
            return false
        }
        if (!this.customerId){
            return false
        }
        if(this.creditAmount == 0){
            return false
        }
        if(this.dateFrom == ''){
            return false
        }
        if(this.dateTo == ''){
            return false
        }
        if (this.dateLimit == ''){
            return false
        }

        return true
    },
    isValidAmount(){
        if (this.amountToPay <= 0 || this.amountToPay > this.pendingAmount())
            return false
        return true
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
    fetchCustomers: function(){

        Api.fetchAll('Customer').then(response => {

            const allCustomers = response.data
            
            Api.fetchAll("order").then(response => {
                const orders = response.data
                orders.forEach(order => {
                    if (order.ClientId){
                        for (let index = 0; index < allCustomers.length; index++) {
                            let customer = allCustomers[index]
                            if (order.ClientId == customer._id && !this.customers.find(c => c._id === customer._id))
                            {
                                this.customers.push(customer)
                                break
                            }
                        }
                    }
                });
            })
            .catch(e => {
                console.log(e)
            })
        })
        .catch(e => {
            console.log(e)
            this.ifErrorOccured(this.fetchCustomers)
        });

    },
    //Create or edit a new category
    saveCredit: function(){
        
        if (this.isValidForm()){

            // if (this.verifyActiveCredits(this.customerId)){

                let item = {
                  "Name": this.creditName,
                  "CustomerId": this.customerId,
                  "CreditAmount": this.creditAmount,
                  "Active": true,
                  "DateFrom": this.dateFrom,
                  "DateTo": this.dateTo,
                  "PayLimitDate": this.dateLimit,
                }
                //If I am editing
                if (this.id){
                  item['_id'] = this.id;
                  this.spinner = true;
                  Api.putIn(this.modelName, item)
                      .then(response => {
                            this.spinner = false;
                            this.showToastMessage(this.$t('backoffice.list.messages.messageEditSuccessCredit'), "success");
                            this.$router.push({
                              name: 'Credit',
                            });
                            return response;
                      })
                      .catch(e => {
                            console.log(e);
                            this.spinner = false;
                            this.ifErrorOccured(this.saveCredit)
                      })
                }
                else{
                  //Else, I am created a new categor
                  if (this.extendAll && this.othersRestaurants.length > 0){
                      this.spinner = true;
                      const data= {
                            "credit": {
                                "CreditAmount": this.creditAmount,
                                "Debt": 0,
                                // "State": 1,
                                "Amount": 0,
                                "Name": this.creditName,
                                "CustomerId": this.customerId
                            },
                            "restaurants": this.othersRestaurants
                      }
                      Api.customerCreditForAll(data)
                      .then(response => {
                          this.spinner = false;
                            this.showToastMessage('The credit was created successfully', "success");
                            this.$router.push({
                                name: 'Credit-Form', 
                            });
                            return response;
                      })
                     .catch(e => {
                        console.log(e);
                        this.spinner = false;
                        this.ifErrorOccured(this.saveCredit)
                     })
                  }
                  else{
                        this.spinner = true;
                        item["State"] = 1;
                        item["Debt"] = 0;
                        Api.postIn(this.modelName, item)
                        .then(response => {
                            this.spinner = false;
                            this.showToastMessage('The credit was created successfully', "success");
                            this.$router.push({
                                name: 'Credit-Form', 
                            });
                            return response;
                        })
                        .catch(e => {
                            console.log(e);
                            this.spinner = false;
                            this.ifErrorOccured(this.saveCredit)
                        })
                    }
                }

            // }

        }
    },
    payCredit(){
        this.openPayment()
    },
    getAmountToPay(payDatas){
        /*
       payDatas = {

            feeType: "Fixed" || "Percent" (Viene de la conf),
            feeFrecuency: "Monthy" || "Anual" (Viene de la conf),
            feeValue: 11 (Viene de la conf),
            limitDate: this.dateLimit (Fecha límite de pago del crédito),
            amountToPay: 200 (Monto que se pretende pagar),
       }
       */

       const payDate = moment() //Fecha actual
       const limitDate = moment(payDatas.limitDate)
       const dayDiff = payDate.diff(limitDate, "minutes") //Si dayDiff > 0 entonces se pasó de la fecha límite
       let totalAmountToPay = payDatas.amountToPay

       if (dayDiff > 0){
           const months = payDate.diff(limitDate, "months")
           if (months > 0){
               //Ver si la frecuencia es mensual o anual
               let valFee = payDatas.feeValue // Asumiendo que es mensual
               if (payDatas.feeFrecuency == "Anual")
               {
                   //Si es anual
                   valFee = payDatas.feeValue / 12
               }

               let countM = 1
               let feeArr = [payDatas.amountToPay]
               console.log("FeeArr", feeArr)
               let lastFee = 0
               while (countM <= months){
                   if (payDatas.feeType === 'Percent'){
                       lastFee = feeArr[feeArr.length - 1]
                       feeArr.push(lastFee + (lastFee * valFee / 100))
                   }
                   if (payDatas.feeType === 'Fixed'){
                       lastFee = feeArr[feeArr.length - 1]
                       feeArr.push(lastFee + valFee)
                   }
                   countM++
               }
               totalAmountToPay = feeArr[feeArr.length - 1]  
           }
       }

       console.log("Amount to pay: ", totalAmountToPay.toFixed(2))
       return totalAmountToPay.toFixed(2)

    },
    //Este es el metodo que abre el modal de pago 
    async openPayment(){

        const payDatas = {
            feeType: this.creditSetting.feeType || "Percent",
            feeFrecuency: this.creditSetting.feeFrecuency || "Monthy",
            feeValue: this.creditSetting.feeAmount || 0,
            limitDate: this.dateLimit,
            amountToPay: this.amountToPay,
        }

        const amountForPay = this.getAmountToPay(payDatas)
       
        return this.$ionic.modalController
            .create({
                component: PaymentSplited,
                cssClass: 'my-custom-class',
                componentProps: {
                data: {
                    content: 'New Content',
                },
                propsData: {  
                    parent:this,
                    order: {
                        Total: amountForPay, // monto a pagar.
                        Taxe: "1.00",
                        Tip: 0,
                        SubTotal: amountForPay, // monto a pagar.
                        Products: []
                    }, 
                    Total: amountForPay,
                    Tax:  "1.00",
                    TaxName: '',     
                    restaurantId:  this.$store.state.restaurantActive.restaurantId, // id del restaurante
                    payMethod: this.$store.state.restaurantActive.payMethod  ,   // metodo de pago del restaurante
                    currency: this.$store.state.restaurantActive.currency,
                    returnTo: 'CreditDetail',                      
                    staffName: this.$store.state.user.FirstName + ' ' + this.$store.state.user.LastName,
                    deviceTransactionType: '01',
                    deviceData: {
                        'amountInformation': {
                                'TransactionAmount': amountForPay, // monto a pagar.
                                'TipAmount': 0,
                                'TaxAmount': "1.00",
                            },
                            'accountInformation':{
                                'FirstName': this.getSelectedCustomerName(this.customerId) // nombre y apellidos del customer
                            },
                            'traceInformation':{
                                'TransactionNumber': ''
                            }
                    },   
                    customerName: this.getSelectedCustomerName(this.customerId), // nombre y apellidos del customer
                    restaurantName: this.$store.state.restaurantActive.restaurantName,
              },
                },
            })
            .then(m => m.present())
        
    },

    async makeSplitPayment(res){  
        try {
            this.spinner = true;

                const paymentEntry = {                       
                    "Method": res.method, 
                    "Payment": res.total,
                    "InvoiceNumber": res.transId,
                    "ModelId": this.id,
                    "ModelFrom": "Credit"               
                }                   
                const payResponse = await Api.postIn('allpayments', paymentEntry);
                const pay = {
                    'Date': moment().toISOString(),
                    'Amount': res.total,
                    'Payment': res,
                    'PaymentId': payResponse.data._id,
                }

                this.Payed.push(pay);

                let item = {
                    "_id": this.id,
                    "Payed": this.Payed
                }
               
                if(this.pendingAmount() === 0){
                    item["Active"] = false;
                    item["State"] = 3;
                }
                await Api.putIn('customercredit', item)               
                this.spinner = false;
            
        } catch (error) {            
            console.log(error)
            this.spinner = false;
        }
    
    },

    getPayed(){
        var cant = 0;
        for (const pay of this.Payed) {
            cant += pay.Amount;            
        }       
        return cant;
    },

    pendingAmount(){
      return this.debt - this.getPayed();
    },
    

    },

}
    
</script>

<style>

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

ion-col{

    border: 1px solid lightgray;

}

span.title{
    font-weight: bolder;
}

div.end{
    text-align: end;
}

ion-row.left{
    text-align: left;
}

ion-row.right{
    text-align: right;
}

</style>