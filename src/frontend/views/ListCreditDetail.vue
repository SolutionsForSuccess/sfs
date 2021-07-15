<template>
  <div id="order" class="screen">
    
    <ion-header>
          <div style="display: flex; align-items: center;flex-direction: row; justify-content: space-between;">
            <ion-buttons slot="start">
              <ion-back-button default-href="/"  @click="$router.push({ name: 'ListCredit'})"></ion-back-button>
            </ion-buttons>
            
               <h1>{{$t('frontend.menu.credit')}}</h1>  
           
            <div>
              <ion-button @click="saveCredit()">{{$t('backoffice.form.buttons.save')}}</ion-button>
            </div>
          </div>
                  
                  
    </ion-header>

      <ion-refresher 
        style="position: relative"
        slot="fixed"
        @ionRefresh="doRefresh($event)">
          <ion-refresher-content 
            refreshing-spinner="crescent"
          ></ion-refresher-content>
      </ion-refresher>

  
      <ion-loading
        v-if="spinner"
        cssClass="my-custom-class"
        :message="$t('frontend.tooltips.loadRestaurant')"
      ></ion-loading>
  
      <div :key="key"> 

        <ion-item :disabled="spinner? true: false">                  
            <ion-label position="floating">{{$t('frontend.specialsPrice.name')}} <strong style="color: red">*</strong></ion-label>                               
            <ion-input type="text" required=true   :readonly="credit.State !== 0? true  : false"
            class="menu-col-8" 
            :value="credit.Name" @input="credit.Name = $event.target.value"
                ></ion-input>
            
        </ion-item>
        <ion-item :disabled="spinner? true: false" v-if="credit.State !== 0"> 
             {{$t('frontend.credit.createDate')}}  :  {{getDate(credit.CreateDate)}}  
        </ion-item> 
         <ion-item :disabled="spinner? true: false">                  
            <ion-label position="floating">{{$t('frontend.credit.amount')}} <strong style="color: red">*</strong></ion-label>                               
            <ion-input type="number" required=true   :readonly="credit.State !== 0 ? true  : false"
            class="menu-col-8" 
            :value="credit.CreditAmount" @input="credit.CreditAmount = $event.target.value"
                ></ion-input>            
        </ion-item>   
         <ion-item :disabled="spinner? true: false" v-if="credit.State !== 0 && pendingAmount() !== 0">                  
            <ion-label position="floating">{{$t('frontend.credit.debt')}} <strong style="color: red">*</strong></ion-label>                               
            <ion-input type="number" readonly=true  
            class="menu-col-8" 
            :value="credit.Debt" @input="credit.Debt = $event.target.value"
                ></ion-input>            
        </ion-item> 
         <ion-item :disabled="spinner? true: false" v-if="credit.State !== 0 && credit.DateFrom"> 
             {{$t('frontend.credit.dateFrom')}}  :  {{getDate(credit.DateFrom)}}  
        </ion-item>
         <ion-item :disabled="spinner? true: false" v-if="credit.State !== 0 && credit.DateTo"> 
             {{$t('frontend.credit.dateTo')}}  :  {{getDate(credit.DateTo)}}  
        </ion-item> 
         <ion-item :disabled="spinner? true: false" v-if="credit.State !== 0 && credit.PayLimitDate"> 
             {{$t('frontend.credit.paymentDate')}}  :  {{getDate(credit.PayLimitDate)}}  
        </ion-item>

        <div v-if="credit.State !== 0">
            
               <ion-segment :value="segmentValue">
                    <ion-segment-button value="used" @click="segmentValue='used'">
                       <span class="iconify" data-icon="fluent:task-list-square-ltr-24-regular" data-inline="false"></span>
                        USADO
                    </ion-segment-button>
                    <ion-segment-button value="payment" @click="segmentValue='payment'">
                        <span class="iconify" data-icon="fluent:task-list-square-ltr-24-filled" data-inline="false"></span>
                        PAGADO
                    </ion-segment-button>
                </ion-segment>

               <div style="padding: 20px;">
                    <div v-if="segmentValue=='used'">
                        <ion-progress-bar color="primary" type="indeterminate" reversed="true" v-if="spinnerUsed"></ion-progress-bar>
                        <div v-for="(used, index) in credit.UsedIn" :key="index">
                            <ion-item>                         
                                <h2 style="width: 100%;float: left;font-size: 16px;
                                        text-align: left; color: black;margin: 5px !important;">
                                            <a @click="getOrderDetail(used.Model, used.ModelId)">{{used.Model}}-{{used.ModelId.slice(-4)}}</a> <strong>   {{getFormatPrice(used.Total)}}     </strong>
                                            
                                </h2>                                                                                                       
                            </ion-item>
                        </div>
                </div>
                <div v-if="segmentValue=='payment'">

                    <div v-for="(pay, index) in credit.Payed" :key="index">
                        <ion-item>                         
                             <h2 style="width: 100%;float: left;font-size: 16px;
                                    text-align: left; color: black;margin: 5px !important;">
                                        {{$t('frontend.order.total')}}: <strong>   {{getDate(pay.Date)}}     </strong>  |
                                        {{$t('frontend.order.total')}}: <strong>  {{getFormatPrice(pay.Amount)}}  </strong>  |
                                        {{$t('frontend.order.transId')}}: <strong> {{pay.Payment.transId}} </strong>  
                            </h2>                                                                                                       
                        </ion-item>
                    </div>


                    <ion-item :disabled="spinner? true: false" v-if="credit.State !== 0"> 
                        Total  :  {{ getFormatPrice(credit.CreditAmount) }}  
                    </ion-item>
                      <ion-item :disabled="spinner? true: false" v-if="credit.State !== 0"> 
                        {{$t('frontend.credit.payed')}}  : {{ getFormatPrice(getPayed()) }}  
                    </ion-item>
                     <ion-item :disabled="spinner? true: false" v-if="credit.State !== 0"> 
                        {{$t('frontend.credit.pendingPay')}}  :  {{getFormatPrice(pendingAmount())}}                            
                    </ion-item>
                     <ion-item :disabled="spinner? true: false" v-if="credit.State !== 0 && pendingAmount() > 0"> 
                        <ion-input :value="amountForPay" 
                        @ionChange="$event.target.value > pendingAmount() || $event.target.value < 1 ? amountForPay=pendingAmount(): amountForPay=$event.target.value"></ion-input>     
                        <ion-button @click="openPayment()">pay</ion-button>
                    </ion-item>
                   
                </div>
               </div>
        </div>
 

      </div>
            
  </div>
</template>

<script>

import { Api } from '../../backoffice/api/api.js';
import PaymentSplited from '../components/PaymentSplited'
import { Commons } from '../commons'
import moment from 'moment-timezone';
export default {

  name: 'creditDetail',
  created: function(){  
    
    if(this.$route.params.credit){
      this.credit = this.$route.params.credit;      
      this.amountForPay = this.pendingAmount();
    }   
    else
     this.credit.State = 0
     

     console.log(this.$store.state.customer._id)
     console.log(this.credit)

     if(this.$route.params.index){
      this.index = this.$route.params.index;      
    } 
    this.currency= this.$store.state.restaurantActive.currency;
    this.staffName = this.$store.state.staffName || '';
  
  },
  components:{   
    // VBreakpoint: VBreakpoint,  
  },
  data () {
    return {
      modelName: 'CreditDetail',     
      spinner: false, 
      spinnerUsed: false,    
      currency: 'USD',
      credit: {},
       key: 0,      
      index : -1 ,   
      allStates: [
        this.$t('frontend.credit.state0'),
        this.$t('frontend.credit.state1'), 
        this.$t('frontend.credit.state2'),
        this.$t('frontend.credit.state3')
        ],
     segmentValue: 'used',
     amountForPay:  0,
     googleData: {},
     staffName: ''

    }
  }, 
  methods: {


   getFormatPrice(price){
       let result = price           
          if (this.currency)
            result = new Intl.NumberFormat('en', {style: "currency", currency: this.currency} ).format(price)      
         return result;
    },

   async toastMss(message, color) {
      return this.$ionic.toastController      
        .create({
          message: message,         
          position: 'top',
          color: color,
           duration: 1000
        
        })
      .then(a => a.present())
    },

   alertRequiredDatas(){
      return  this.$ionic.alertController
      .create({
          cssClass: 'my-custom-class',
          header: 'Error',
          message: this.$t('frontend.home.errorRequired') ,
          buttons: [                   
          {
              text: this.$t('frontend.home.acept'),
              handler: () => {},
          },
          ],
      })
      .then(a => a.present())                  
    },
    
   async saveCredit(){

      if(['', undefined].includes(this.credit.Name)  ||  [0, undefined].includes(this.credit.CreditAmount) )
          return this.alertRequiredDatas();

     
     try {
       this.spinner = true;
        let res;
        if(this.credit._id)
           res = await Api.putIn('customercredit', this.credit)
        else {
            this.credit.CustomerId = this.$store.state.customer._id
            res = await Api.postIn('customercredit', this.credit)
        }
        await Commons.getAllCredit();         
        this.key ++;
        this.spinner = false;
        if(res.status === 200 && !this.credit._id){
            this.credit = res.data;      
            return this.toastMss('Ok', 'success')
        }
       
     } catch (error) {
       error
       this.spinner = false;
       return this.toastMss('mal hecho', 'danger')
     }
    },

   getDate(date){
      var formatDate = moment.tz(date, moment.tz.guess()).format('LL');
      return formatDate;

    },

   async getWalletInformation(){
      const  newT =  parseInt( parseFloat(this.amountForPay).toFixed(2).replace('.', ''));
      const basket = {"invoice": 666, "total": newT };       
      
     
      const ipClient = await Api.getClientIp();
      const res = await Api.walletInformation(basket,  this.$store.state.restaurantActive.restaurantId, ipClient.data.ip); 
      if(res.status === 200 && res.statusText === "OK"){
               
        this.googleData.merchantId = res.data.walletConfig.merchantID.toString();  
        this.googleData.gateway = res.data.walletConfig.googlePay.gateway;           
        this.googleData.allowedAuthMethods= res.data.walletConfig.googlePay.allowedAuthMethods;         
        this.googleData.allowedCardNetworks= res.data.walletConfig.googlePay.allowedCardNetworks;  
        this.googleData.currencyCode =res.data.walletConfig.currencyCode; 
        this.googleData.countryCode =res.data.walletConfig.countryCode;   
      }
    }, 

   async openPayment(){
        this.spinner = true;
        await this.getWalletInformation();
        this.spinner = false;

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
                        Total: this.amountForPay,
                        Taxe: "1.00",
                        Tip: 0,
                        SubTotal: this.amountForPay,
                        Products: []
                    }, 
                    Total: this.amountForPay,
                    Tax:  "1.00",
                    TaxName: '',     
                    restaurantId:  this.$store.state.restaurantActive.restaurantId,
                    payMethod: this.$store.state.restaurantActive.payMethod  ,   
                    currency: this.currency,
                    returnTo: 'CreditDetail',   
                    googleData: this.googleData,
                    staffName: this.staffName,
                    deviceTransactionType: '01',
                    deviceData: {
                        'amountInformation': {
                                'TransactionAmount': this.amountForPay,
                                'TipAmount': 0,
                                'TaxAmount': "1.00",
                            },
                            'accountInformation':{
                                'FirstName': this.$store.state.customer.Name
                            },
                            'traceInformation':{
                                'TransactionNumber': ''
                            }
                    },   
                    customerName: this.$store.state.customer.Name,
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
                    "ModelId": this.credit._id,
                    "ModelFrom": "Credit"                   
                }                   
                const payResponse = await Api.postIn('allpayments', paymentEntry);
                const pay = {
                    'Date': moment().toISOString(),
                    'Amount': res.total,
                    'Payment': res,
                    'PaymentId': payResponse.data._id,
                }

                this.credit.Payed.push(pay);
                console.log(this.pendingAmount());
                if(this.pendingAmount() === 0){
                    this.credit.Active = false;
                    this.credit.State = 3;
                }
                await Api.putIn('customercredit', this.credit)
                await Commons.getAllCredit(); 
                this.sendMerchantEmail(res.total);
                this.amountForPay = this.pendingAmount();
                this.spinner = false;
            
        } catch (error) {            
            console.log(error)
            this.spinner = false;
        }
    
    },

    getPayed(){
        var cant = 0;
        for (const pay of this.credit.Payed) {
            cant+= pay.Amount;            
        }       
        return cant;
    },

    pendingAmount(){
      return   this.credit.Debt - this.getPayed();
    },

    creditHTML(total){
     
      var html =' <html><head>';    
      html +='<style> .progressBar { width: 100%;  border-bottom: 1px solid black;display: list-item;list-style: unset; padding: 0}';
      html += '.progressBar li {list-style-type: none; float: left; position: relative; text-align: center; margin:0}';
      html += '.progressBar li .before {content: " "; line-height: 30px; border-radius: 50%; width: 30px; height: 30px; border: 1px solid #ddd;';
      html += 'display: block;text-align: center;margin: 0 auto 10px;background-color: white}';
      html += '.progressBar li .after { content: "";position: absolute;width: 100%;height: 4px;background-color: #ddd;top: 15px;left: -50%;z-index: -1;}';
      html += '.progressBar li .one .after {content: none;}.progressBar li.active {color: black;}';
      html += '.progressBar li.active .before { border-color: #63ee68; background-color: #63ee68}.progressBar .active:after {background-color: #4ca44f;} </style>';
      
      html += '</head><body><div >';
      html += '<table  align=center style="width: 90%;">';
      html += '<tr><td colspan=6 style="text-align: center;">';
      html += `<h2>${this.$store.state.restaurantActive.restaurantName}</h2>  `;
      html += `<img src="${this.$store.state.restaurantActive.restaurantLogo}" style="max-width: 100px;"></img> `;     
      html +=`</td>`;     
      html += `</tr>`; 
      
      html +=`<tr>`;     
      html += `<td>`;       
      html += `${this.$t('frontend.credit.mssPay1')}${this.$store.state.customer.Name} ${this.$t('frontend.credit.mssPay2')}${this.credit.Name} ${this.$t('frontend.credit.mssPay3')}${this.getFormatPrice(total)}`
      html +=`</td>`;     
      html += `</tr>`;       
      html += `</table></div></body></html>`;
      
    return html;
    },

    sendMerchantEmail(total){        
        const html = this.creditHTML(total);
        var items = {
            "email": this.store.state.restaurantActive.restaurantEmail,
            "mess": html,
            "subject": this.$t('frontend.credit.creditpayed') + ': '+ this.credit.Name+ ' | ' + this.$store.state.restaurantActive.restaurantName   
        }
      return Api.sendEmail(items);    
    },

    async getOrderDetail(model, modelId){     
        this.spinnerUsed = true;        
        const obj = await Api.fetchById(model, modelId);
        this.spinnerUsed = false;       
        if(model === 'Order')
            return this.$router.push({ name: 'OrderState', params: {order: obj.data, fromMyAccount: 'Credit'} });
    }

   
    


   



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