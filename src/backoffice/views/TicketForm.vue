<template>
    <div class="screen">
    <ion-backdrop v-if="isBackdrop"></ion-backdrop>
    <!-- <router-link to="/controlPanel"><ion-button expand="full" color="tertiary"><ion-icon name="hammer"></ion-icon>{{$t('backoffice.list.buttons.goToControlPanel')}}</ion-button></router-link>
    <router-link to="/otherCharge"><ion-button expand="full" color="tertiary"><ion-icon name="arrow-round-back"></ion-icon>{{$t('backoffice.form.buttons.backToOtherChargesList')}}</ion-button></router-link> -->

    <ion-header>
          <ion-toolbar>
            <ion-buttons slot="start">
              <ion-back-button default-href="/controlPanel"  @click="$router.push({ name: 'Order'})"></ion-back-button>
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
        <div v-if="order != null">
        <ion-grid>
            <ion-row class="left">
                <ion-col>
                    <div v-if="customer"><span class="title">{{$t('backoffice.form.titles.customer')}}:</span> {{customer.Name}}</div>
                    <div v-if="order.CustomerName"><span class="title">{{$t('backoffice.form.titles.customer')}}:</span> {{order.CustomerName }}</div>
                </ion-col>
            </ion-row>
            <ion-row class="left">
                <ion-col>
                    <div><span class="title">{{$t('backoffice.form.titles.date')}}:</span> {{date}}
                        <!-- <ion-datetime style="border-bottom: 1px solid darkred" name="date" @ionChange="date = $event.target.value" 
                            v-bind:value="date" :placeholder="$t('backoffice.form.titles.selectDate')">
                        </ion-datetime> -->
                    </div>
                </ion-col>
                <!-- <ion-col>
                    <div><span class="title">{{$t('backoffice.form.titles.orderType')}}:</span> 
                        <ion-list>
                                <ion-select style="border-bottom: 1px solid darkred" interface="popover" :ok-text="$t('backoffice.form.messages.buttons.ok')" :cancel-text="$t('backoffice.form.messages.buttons.dismiss')"
                                    @ionChange="orderType = $event.target.value, shipping = 0, calcTotal()" v-bind:value="orderType">
                                    <ion-select-option value="PickUp">{{$t('frontend.app.pickup')}}</ion-select-option>
                                    <ion-select-option value="Delivery">{{$t('frontend.app.deliver')}}</ion-select-option>
                                </ion-select>
                        </ion-list>
                    </div>
                </ion-col> -->
            </ion-row>
        </ion-grid>
        <br/>
        <ion-grid v-if="order.StaffName">
            <ion-row class="left">
                <ion-col>
                    <div><span class="title">{{$t('backoffice.form.fields.serverName')}}:</span> {{order.StaffName}}</div>
                </ion-col>
            </ion-row>
        </ion-grid>
        <br v-if="order.StaffName" />
        <ion-grid>
            <ion-row class="left">
                <ion-col style="border-right: none">
                    <div>
                        <span class="title">{{$t('backoffice.form.titles.products')}}:</span>
                    </div>
                </ion-col>
                <ion-col style="border-left: none">
                    <div style="text-align: end;">
                        <ion-button size="small" slot="end" color="primary" @click="addProduct()" v-if="order.State != 5">
                            <ion-icon slot="icon-only" name="add"></ion-icon>
                        </ion-button>
                    </div>
                </ion-col>
            </ion-row>
            <div v-if="order.State != 5">
                <ion-list v-if="screenWidth < 600">
                    <ion-item-sliding v-for="product in products" :key="product._id">
                        <ion-item v-if="!product.isService" style="border: 1px solid darkred">
                            <ion-input style="border-bottom: 1px solid darkred; margin:15px" type="text" name="productName"
                                @input="product.Name = $event.target.value" 
                                v-bind:value="product.Name">
                            </ion-input>
                            <ion-input style="border-bottom: 1px solid darkred; margin:15px" type="number" name="productCant"
                                @input="product.Cant = $event.target.value" @ionChange="calcTotal()"
                                v-bind:value="product.Cant">
                            </ion-input>
                            <ion-input style="border-bottom: 1px solid darkred; margin:15px" type="number" name="productCost"
                                @input="product.Price = $event.target.value" @ionChange="calcTotal()"
                                v-bind:value="product.Price">
                            </ion-input>
                            <ion-textarea style="border: 1px solid darkred; margin:15px" name="note" 
                                    @input="product.Note = $event.target.value" 
                                    v-bind:value="product.Note">
                            </ion-textarea>
                        </ion-item>
                        <ion-item-options side="end" v-if="products[products.indexOf(product)].State == 0">
                            <ion-item-option color = "success" @click="receiveProduct(product)">
                                <ion-icon slot="icon-only" name="checkmark"></ion-icon>
                            </ion-item-option>
                            <ion-item-option color = "danger" @click="delProduct(product._id)">
                                <ion-icon slot="icon-only" name="trash"></ion-icon>
                            </ion-item-option>
                        </ion-item-options>
                    </ion-item-sliding>
                </ion-list>
                <ion-list v-if="screenWidth >= 600" >
                        <ion-item v-for="product in products" :key="product._id">
                            <div style="display: inherit" v-if="!product.isService">
                                <ion-input style="border-bottom: 1px solid darkred; margin:5px" type="text" name="productName"
                                    @input="product.Name = $event.target.value" 
                                    v-bind:value="product.Name">
                                </ion-input>
                                <ion-input style="border-bottom: 1px solid darkred; margin:5px" type="number" name="productCant"
                                    @input="product.Cant = $event.target.value" @ionChange="calcTotal()"
                                    v-bind:value="product.Cant">
                                </ion-input>
                                <ion-input style="border-bottom: 1px solid darkred; margin:5px" type="number" name="productCost"
                                    @input="product.Price = $event.target.value" @ionChange="calcTotal()"
                                    v-bind:value="product.Price">
                                </ion-input>
                                <ion-textarea style="border: 1px solid darkred; margin:5px" name="note" 
                                        @input="product.Note = $event.target.value" 
                                        v-bind:value="product.Note">
                                </ion-textarea>
                                <ion-item-group side="end" v-if="products[products.indexOf(product)].State == 0">
                                    <ion-button color = "success" @click="receiveProduct(product)">
                                        <ion-icon slot="icon-only" name="checkmark"></ion-icon>
                                    </ion-button>
                                    <ion-button color="danger" @click="delProduct(product._id)">
                                        <ion-icon slot="icon-only" name="trash"></ion-icon>
                                    </ion-button>
                                </ion-item-group>
                            </div>
                        </ion-item>
                </ion-list>
            </div>
            <div v-else>
                <ion-row class="left" v-for="product in products" :key="product._id">
                    <ion-col>
                        <div>
                            <span>{{product.Name}}</span>
                        </div>
                    </ion-col>
                    <ion-col>
                        <div>
                            <span>{{product.Cant}}</span>
                        </div>
                    </ion-col>
                    <ion-col>
                        <div>
                            <span>{{product.Price}}</span>
                        </div>
                    </ion-col>
                    <ion-col>
                        <div>
                            <span>{{product.Note}}</span>
                        </div>
                    </ion-col>
                </ion-row>
            </div>
        </ion-grid>
            <!-- <ion-row class="left">
                <ion-col style="border-right: none">
                    <div>
                        <span class="title">{{$t('backoffice.options.manageServices')}}:</span>
                    </div>
                </ion-col>
                <ion-col style="border-left: none">
                    <div style="text-align: end;">
                        <ion-button size="small" slot="end" color="primary" @click="addService()">
                            <ion-icon slot="icon-only" name="add"></ion-icon>
                        </ion-button>
                    </div>
                </ion-col>
            </ion-row>


            <ion-list v-if="screenWidth < 600">
                <ion-item-sliding v-for="service in products" :key="service._id">
                    <ion-item v-if="service.isService" style="border: 1px solid darkred">
                        <ion-input style="border-bottom: 1px solid darkred; margin:15px" type="text" name="serviceName"
                            @input="service.Name = $event.target.value" 
                            v-bind:value="service.Name">
                        </ion-input>
                        <ion-input style="border-bottom: 1px solid darkred; margin:15px" type="number" name="serviceCant"
                            @input="service.Cant = $event.target.value" @ionChange="calcTotal()"
                            v-bind:value="service.Cant">
                        </ion-input>
                        <ion-input style="border-bottom: 1px solid darkred; margin:15px" type="number" name="serviceCost"
                            @input="service.Price = $event.target.value" @ionChange="calcTotal()"
                            v-bind:value="service.Price">
                        </ion-input>
                        <ion-textarea style="border: 1px solid darkred; margin:15px" name="note" 
                                @input="service.Note = $event.target.value" 
                                v-bind:value="service.Note">
                        </ion-textarea>
                    </ion-item>
                    <ion-item-options side="end">
                        <ion-item-option color = "danger" @click="delService(service._id)">
                            <ion-icon slot="icon-only" name="trash"></ion-icon>
                        </ion-item-option>
                    </ion-item-options>
                </ion-item-sliding>
            </ion-list>
            <ion-list v-if="screenWidth >= 600" >
                    <ion-item v-for="service in products" :key="service._id" >
                        <div style="display: inherit" v-if="service.isService">
                            <ion-input style="border-bottom: 1px solid darkred; margin:5px" type="text" name="serviceName"
                                @input="service.Name = $event.target.value" 
                                v-bind:value="service.Name">
                            </ion-input>
                            <ion-input style="border-bottom: 1px solid darkred; margin:5px" type="number" name="serviceCant"
                                @input="service.Cant = $event.target.value" @ionChange="calcTotal()"
                                v-bind:value="service.Cant">
                            </ion-input>
                            <ion-input style="border-bottom: 1px solid darkred; margin:5px" type="number" name="serviceCost"
                                @input="service.Price = $event.target.value" @ionChange="calcTotal()"
                                v-bind:value="service.Price">
                            </ion-input>
                            <ion-textarea style="border: 1px solid darkred; margin:5px" name="note" 
                                    @input="service.Note = $event.target.value" 
                                    v-bind:value="service.Note">
                            </ion-textarea>
                            <ion-item-group side="end">
                                <ion-button color="danger" @click="delService(service._id)">
                                    <ion-icon slot="icon-only" name="trash"></ion-icon>
                                </ion-button>
                            </ion-item-group>
                        </div>
                    </ion-item>
            </ion-list> -->

            <!-- Otros cargos -->
            <!-- <ion-row v-if="otherCharges.length > 0" class="left">
                <ion-col>
                    <div><span class="title">{{$t('backoffice.form.titles.otherCharges')}}:</span></div>
                </ion-col>
            </ion-row>
            <ion-row v-for="otherCharge in otherCharges" :key="otherCharge._id" class="left">
                <ion-col size="10">
                    <div>{{otherCharge.Name}}</div>
                </ion-col>
                <ion-col size="2">
                    <div class="end">
                        <ion-input style="border-bottom: 1px solid darkred" type="number" name="otherCharge"
                            @input="otherCharge.Price = $event.target.value" @ionChange="calcTotal()"
                            v-bind:value="otherCharge.Price">
                        </ion-input>
                    </div>
                </ion-col>
            </ion-row> -->
        <br/>
        <ion-grid>
            <!-- <ion-row v-if="orderType == 'Delivery'">
                <ion-col>
                    <div class="end"><span class="title">{{$t('backoffice.form.titles.shippingPrice')}}:</span> 
                        <ion-input style="border-bottom: 1px solid darkred" type="number" name="shipping"
                            @input="shipping = $event.target.value" @ionChange="calcTotal()"
                            v-bind:value="shipping">
                        </ion-input>
                    </div>
                </ion-col>
            </ion-row> -->
            <ion-row v-if="order.State != 5">
                    <ion-item style="width: 100%"> 
                        <ion-input style="border-bottom: 1px solid darkred; margin-right: 5px; width: 10%" type="number" name="discount"
                            @input="calcDiscount($event.target.value)"
                            v-bind:value="discount">
                        </ion-input>
                        <ion-select style="width: 50%; border-bottom: 1px solid darkred;" interface="popover" :ok-text="$t('backoffice.form.messages.buttons.ok')" :cancel-text="$t('backoffice.form.messages.buttons.dismiss')"
                                @ionChange="changeDiscountType($event.target.value)" v-bind:value="discountType">
                                    <ion-select-option key="percent" value="percent" >{{$t('backoffice.form.fields.percent')}}</ion-select-option>
                                    <ion-select-option key="fixed" value="fixed" >{{$t('backoffice.form.fields.fixed')}}</ion-select-option>
                        </ion-select>
                        <ion-label style="width: 40%" slot="end"><span class="title">{{$t('backoffice.form.fields.discount')}}:</span> {{discountAmount}}</ion-label>
                    </ion-item>
            </ion-row>
            <ion-row v-else>
                <ion-label style="width: 40%" slot="end"><span class="title">{{$t('backoffice.form.fields.discount')}}:</span> {{discountAmount}}</ion-label>
            </ion-row>
            <ion-row>
                <ion-col>
                    <div class="end"><span class="title">{{$t('backoffice.form.titles.subtotal')}}:</span> {{ getFormateNumber(subtotal)}}</div>
                </ion-col>
            </ion-row>
            <ion-row>
                <ion-col>
                    <div class="end"><span class="title">{{$t('backoffice.form.titles.tax')}}:</span> {{ getFormateNumber(calcTax)}} ({{taxe}}%)</div>
                    <div v-if="order.AllTaxes">
                        <div class="end" v-for="tax in order.AllTaxes" v-bind:key="tax._id"><span class="title">{{tax.Name}}:</span>{{calcAmountTax(tax.Percentage)}} ({{tax.Percentage}}%)</div>
                    </div>
                </ion-col>
            </ion-row>
            <ion-row>
                <ion-col>
                    <div class="end"><span class="title">{{$t('backoffice.form.titles.tip')}}:</span> {{ getFormateNumber(calcTip)}} ({{tip}}%)</div>
                </ion-col>
            </ion-row>
            <ion-row>
                <ion-col>
                    <div class="end"><span class="title">{{$t('backoffice.form.titles.total')}}:</span> {{ getFormateNumber(total)}}</div> 
                </ion-col>
            </ion-row>
            <!-- <ion-row>
                <ion-col>
                    <div class="end" style="color: red"><span class="title">{{$t('backoffice.form.fields.pendingPay')}}:</span> {{ getFormateNumber(pendingPay())}}</div> 
                </ion-col>
            </ion-row>
            <ion-row>
                <ion-col>
                    <div class="end" style="color: darkblue"><span class="title">{{$t('backoffice.form.fields.payed')}}:</span> {{ getFormateNumber(payed)}}</div> 
                </ion-col>
            </ion-row> -->
        </ion-grid>
        <br/>
        <!-- Plazos
        <ion-item>
            <ion-label>{{$t('backoffice.form.fields.deadlines')}}</ion-label>
            <ion-checkbox slot="end" name="haveDeadlines" 
                @ionChange="haveDeadlines = $event.target.checked"
                :checked="haveDeadlines"  >    
            </ion-checkbox>
        </ion-item>
        <div v-if="haveDeadlines" style="margin-left: 30px">
            <ion-list>
                <ion-item>
                    <h1>{{$t('backoffice.form.fields.deadlines')}}</h1>
                </ion-item>
                <ion-item>
                    <ion-datetime id="dateDeadLine" style="margin-left: 20px; margin-right: 20px; border-bottom: 1px solid darkred; padding: 5px !important; border-radius: 3px;" name="dateDeadLine" 
                        @ionChange="dateDeadLine = $event.target.value" 
                        v-bind:value="dateDeadLine" :placeholder="$t('backoffice.form.titles.selectDate')">
                    </ion-datetime>
                    <ion-input id="percentDeadLine" style="margin-left: 20px; margin-right: 20px; border-bottom: 1px solid darkred; padding: 0px !important; border-radius: 3px;" type="number" name="cateringPrice"
                        @input="percentDeadLine = $event.target.value" 
                        v-bind:value="percentDeadLine">
                    </ion-input>
                    <ion-button color="primary" @click="addDeadLine()"><ion-icon slot="icon-only" name="add"></ion-icon></ion-button>
                </ion-item>
                <ion-item style="margin-left: 30px" v-for="deadLine in deadLines" v-bind:key="deadLines.indexOf(deadLine)">
                    <ion-datetime style="margin-left: 20px; margin-right: 20px; border-bottom: 1px solid darkred; padding: 5px !important; border-radius: 3px;" name="date" 
                        @ionChange="deadLine.Date = $event.target.value" 
                        v-bind:value="deadLine.Date" :placeholder="$t('backoffice.form.titles.selectDate')">
                    </ion-datetime>
                    <ion-input style="margin-left: 20px; margin-right: 20px; border-bottom: 1px solid darkred; padding: 0px !important; border-radius: 3px;" type="number" name="cateringPrice"
                        @input="deadLine.Percent = $event.target.value" 
                        v-bind:value="deadLine.Percent" >
                    </ion-input>
                    <ion-button v-if="deadLines.length > 2" color="danger" @click="delDeadLine(deadLines.indexOf(deadLine))"><ion-icon slot="icon-only" name="trash"></ion-icon></ion-button>
                </ion-item>
                <ion-item>
                    <p style="color: red">{{$t('backoffice.form.titles.deadlinesNotes')}}</p>
                </ion-item>
            </ion-list>
        </div> -->

        <ion-grid>
            <ion-row class="left">
                <ion-col>
                    <span class="title">{{$t('backoffice.form.titles.notes')}}:</span>
                </ion-col>
            </ion-row>
            <ion-row class="left">
                <ion-col v-if="order.State != 5">
                    <ion-textarea style="border-bottom: 1px solid darkred" name="note" 
                        @input="note = $event.target.value" 
                        v-bind:value="note">
                    </ion-textarea>
                </ion-col>
                <ion-col v-else>
                    <div>{{ note }}</div>
                </ion-col>
            </ion-row>
            <ion-row class="left">
                <ion-col>
                    <div v-if="order.State != 0"><span class="title">{{$t('backoffice.form.titles.state')}}:</span> {{$t('frontend.order.closed')}}</div> 
                    <div v-else><span class="title">{{$t('backoffice.form.titles.state')}}:</span> {{$t('frontend.reservation.open')}}</div>
                </ion-col>
            </ion-row>
        </ion-grid>
        <!-- <ion-button color="primary" :key="deadLinePercentInc" :disabled="!isValidForm() ? true : false" @click="approve()">{{$t('frontend.order.state8')}}</ion-button>
        <ion-button color="danger" @click="cancel()">{{$t('frontend.order.state6')}}</ion-button> -->
        <div v-if="order.State != 5">
            <ion-button color="primary" @click="cancelTicket()">Cancel Ticket</ion-button>
            <ion-button color="primary" @click="addToTicket()">Add to Ticket</ion-button>
            <ion-button color="secondary" @click="closeTicket()">Close Ticket</ion-button>
            <ion-button color="tertiary" @click="save('The Ticket was saved successfully.')">Save</ion-button>
        </div>
        </div>
    </div>
    </div>
</template>

<script>

import { Api } from '../api/api.js';
import Modal from './addProductSeviceModal.vue';
import { EventBus } from '../../frontend/event-bus';
// import Moment from 'moment';
import { payAuthorizeNet } from '../api/payments.js';
import PaymentModal from '../../frontend/components/PaymentModal'
import { Commons } from '../../frontend/commons'

export default {

  name: 'orderCateringForm',
   
  data () {
    return {
      modelName: 'Order',
       /****** Form Data ******/
      id: null,
      productName: '',
      order: null,
      customer: null,
      date: '',
      orderType: '',
      address: '',
    //   hourToPick: '',
      products: [],
      otherCharges: [],
    //   shipping: 0,
      subtotal: 0,

      discountType: 'percent',
      discount: 0,
      discountAmount: 0,

      taxe: 0,
      tip: 0,
      payed: 0,
      total: 0,
      note: '',

    //   deadLines: [
    //       {
    //           'Percent': 50,
    //           'Date': '',
    //           'State': 0		
    //       },
    //       {
    //           'Percent': 50,
    //           'Date': '',
    //           'State': 0
    //       }
    //   ],
    //   dateDeadLine: '',
    //   percentDeadLine: 0,
    //   haveDeadlines : false,
    //   deadLinePercentInc : 0,

      isBackdrop: false,

      spinner: false,
      screenWidth: 0,

      currency: 'USD',
      restaurantActive: null,
      taxName: '',

    //   allTypeOrder:{'Delivery':this.$t('frontend.app.deliver'), 'PickUp':this.$t('frontend.app.pickup'), 'On Table':this.$t('frontend.app.table') },
      workflowOrderStaus: [this.$t('frontend.order.state0'), this.$t('frontend.order.state1'), this.$t('frontend.order.state2'), this.$t('frontend.order.state3'), this.$t('frontend.order.state4'), this.$t('frontend.order.state5'), this.$t('frontend.order.state6'), this.$t('frontend.order.state7'), this.$t('frontend.order.state8')],

    }
  },
  mounted: function(){
    EventBus.$on('ProductsSelected', (productsSelected) => {
      productsSelected.forEach(prod => {
          prod.State = 0
          this.products.push(prod)
      })
      this.calcTotal()
    });
   
  },
  created: async function(){
    await this.init();
    this.screenWidth = screen.width;
  },
  computed: {
        title() {
            return  this.$t('backoffice.titles.ticketDetails');
        },
        calcTax(){
            return this.subtotal * this.taxe / 100;
        },
        calcTip(){
            return this.subtotal * this.tip / 100;
        }
  },
  methods: {
    calcAmountTax(percentage)
    {
        return (this.order.SubTotal * percentage / 100).toFixed(2)
    },
    async init(){
        this.id = this.$route.params.orderId;
         this.getTaxName();
        await this.getCurrency();
         this.getOrder();

    },
    async getCurrency(){
        const restaurantID = this.$store.state.user.RestaurantId
        if (restaurantID){
           await Api.fetchById('Restaurant', restaurantID).then(response => {
                this.currency = response.data.Currency
                this.restaurantActive = response.data
               
            }).catch(e => {
                e
            })
        } 
    },
    getTaxName(){
      Api.getAvailbleTax().then(response => {
          this.taxName = response.data.Name
      })
      .catch(e => {
         e
      })
    },
    changeDiscountType(value){
        this.discount = 0
        this.calcTotal()
        this.discountType = value
        this.calcDiscount(this.discount)
    },
    calcDiscount(value){

        this.discount = 0
        this.discountAmount = 0
        this.calcTotal()
        this.discount = value
        if (this.discountType == 'percent')
        {
            this.discountAmount = (this.discount * this.subtotal / 100).toFixed(2)
        }
        else{
            this.discountAmount = value
        }
        
        this.calcTotal()
    },
    calcSubtotal(){
        let partialSubtotal = 0

        let productsSubtotal = 0;
        this.products.forEach(prod => {
            productsSubtotal += parseFloat(prod.Price * prod.Cant)
        });
        partialSubtotal += productsSubtotal

        let otherChargeSubtotal = 0;
        this.otherCharges.forEach(och => {
            otherChargeSubtotal += parseFloat(och.Price)
        });
        partialSubtotal += otherChargeSubtotal
        partialSubtotal -= this.discountAmount

        this.subtotal = partialSubtotal.toString()
    },
    calcTotal(){
        let partialTotal = 0
        
        this.calcSubtotal()
        partialTotal += parseFloat(this.subtotal)

        partialTotal +=  parseFloat(this.calcTax)
        partialTotal += parseFloat(this.calcTip)    
        this.total = partialTotal.toFixed(2)
    },
    pendingPay(){
        this.calcTotal()
        const pendingPay = parseFloat(this.total) - parseFloat(this.payed)
        return  pendingPay.toString()
    },
    getOrder(){
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
                        this.order = response.data;
                        this.date = this.order.Date;
                        this.orderType = this.order.OrderType;
                        this.address = this.order.AddressToDeliver;
                        this.hourToPick = this.order.HourToPick;
                        this.products = this.order.Products;
                        this.otherCharges = this.order.OtherCharges;
                        this.shipping = this.order.Shipping || 0;
                        this.subtotal = this.order.SubTotal;
                        this.taxe = this.order.Taxe;
                        this.tip = this.order.Tip;
                        this.payed = this.order.QuotationPayment;
                        this.total = this.order.Total;
                        this.note = this.order.Note;
                        loading.dismiss();
                        return this.getCustomer(this.order.ClientId);
                    })
                    .catch(e => {
                        e;
                        loading.dismiss();
                        this.ifErrorOccured(this._init)
                    })     
                })
            }) 
        }
    },
    receiveProduct(product){
        this.$ionic.alertController.create({
            title: this.$t('backoffice.list.messages.confirmAccept'),
            message: this.$t('backoffice.list.messages.confirmProduct'),
            buttons: [
              {
                text: this.$t('backoffice.list.messages.buttons.cancel'),
                role: 'cancel',
                handler: () => {
                
                }
              },
              {
                text: this.$t('backoffice.form.messages.buttons.ok'),
                handler: () => {
                    this.products[this.products.indexOf(product)].State = 1         
                }
              }
            ]
          })
          .then(a => a.present());
    },
    delProduct(id){

        this.$ionic.alertController.create({
            title: this.$t('backoffice.list.messages.confirmDelete'),
            message: this.$t('backoffice.list.messages.deleteProduct'),
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
                  this.products.splice(this.products.findIndex(prod => prod._id === id), 1);
                  this.calcTotal();          
                }
              }
            ]
          })
          .then(a => a.present());
    },
   
    addProduct(){
        return this.$ionic.modalController
                .create({
                component: Modal,
                cssClass: 'my-custom-class',
                componentProps: {
                    data: {
                        content: '',
                    },
                    propsData: {
                        title: 'Select Product',
                        button: 'Close',
                        button2: 'Save',
                        parent: this,
                        isCatering: false,
                    },
                },
                })
                .then(m => m.present())
    },
    // addService(){
    //     return this.$ionic.modalController
    //             .create({
    //             component: Modal,
    //             cssClass: 'my-custom-class',
    //             componentProps: {
    //                 data: {
    //                     content: '',
    //                 },
    //                 propsData: {
    //                     title: 'Select Service',
    //                     button: 'Close',
    //                     button2: 'Save',
    //                     parent: this,
    //                     addType: 'Service',
    //                 },
    //             },
    //             })
    //             .then(m => m.present())
    // },
    // delDeadLine(id){
    //     this.deadLines.splice(id, 1)
    // },
    // addDeadLine(){
    //     if (this.percentDeadLine < 1 || this.percentDeadLine > 100)
    //     {
    //         this.ShowMessage('El porciento de pago debe ser un valor entre 1 y 100.')
    //         return;
    //     }
    //     if (isNaN(this.percentDeadLine))
    //     {
    //         this.ShowMessage('El porciento de pago debe ser un número.')
    //         return;
    //     }
    //     if (this.dateDeadLine == ''){
    //         this.ShowMessage('La fecha tentativa del pago del plazo es requerida.')
    //         return;
    //     }
    //     const dl = {
    //           'Percent': this.percentDeadLine,
    //           'Date': this.dateDeadLine,
    //           'State': 0		
    //       }
    //     this.deadLines.push(dl);
    //     document.getElementById('percentDeadLine').value = '';
    //     document.getElementById('dateDeadLine').value = '';
    // },
    getCustomer(id){
        Api.fetchById("customer", id)
        .then(response => {
            this.customer = response.data;
            return response;
        })
        .catch(e => {
            e;
            return e;
        })  
    },
    getOrderState(state){
        return this.workflowOrderStaus[state];
    },
    getFormateNumber: function(number){
        return new Intl.NumberFormat('en', {style: "currency", currency: this.currency} ).format(number).toString()
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
                      name: 'OrderCateringForm',
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
    isValidForm(){
        return
    },
    ShowMessage(type, message, topic='') {
        return this.$ionic.alertController
          .create({
            cssClass: 'my-custom-class',
            header: type,
            subHeader: topic,
            message: message,
            buttons: [this.$t('backoffice.form.messages.buttons.ok')],
          })
        .then(a => a.present())
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

    // buildOrder(){ 
    //      this.order.Products = this.products;        
    //      this.order.StaffName = this.staffName;      
    //      this.order.Note = this.note;        
    //      this.order.OtherCharges = this.otherCharges;       
    //      this.order.Total = (this.total - this.discount).toFixed(2);        
    //      this.order.SubTotal = this.subTotal;
    //      this.order.Taxe = this.taxes;       
    //      this.order.Shipping = this.shipping;       
    //     this.order.Tip = this.tip;
    //     if(this.discount > 0)
    //         this.order.Discount = this.discount; 
    //         return true;      
    // },

    //Acciones.
    async save(message){
        this.order.Products = this.products;
        this.order.SubTotal = this.subtotal;
        this.order.Discount = this.discountAmount;
        this.order.Taxe = this.taxe;
        this.order.Total = this.total;
    
        const responseOrder = await Api.putIn('Order', this.order)
        if (responseOrder)
        {
            this.spinner = false;
            this.showToastMessage(message, 'success')
            return true;
        }
        else
        {
            this.spinner = false;
            this.showToastMessage('Error save order', 'danger')
            return false
        }
    },
    async cancelTicket(){

        if(this.order.AuthorizationPayment){
    
            if(this.order.AuthorizationPayment[0].paymentInfo.transId){
                try {
                    const  transId = this.order.AuthorizationPayment[0].paymentInfo.transId;
                    const moto = this.order.AuthorizationPayment[0].paymentInfo.moto;
                    const  restaurantId = this.restaurantActive._id;
                    const payMethod = this.restaurantActive.PayMethod;
                     const isDelivery = this.order.AuthorizationPayment[0].paymentInfo.isDelivery || false;

                    this.spinner = true; 
                    const resVoid = await payAuthorizeNet.void(transId, moto, restaurantId, payMethod, isDelivery)
                  
                    if(resVoid){
                        this.order.State = 6;
                        await  Api.putIn('order', this.order);
                        this.spinner = false;

                    }
                    
                } catch (error) {
                    error;
                    
                }
            

            }
        }

    },
    async addToTicket(){

        const data =  {         
                restaurantId: this.restaurantActive._id,
                payMethod: this.restaurantActive.PayMethod,
                total: this.total,
                // tax: ((parseFloat(this.order.Taxe) * parseFloat(this.order.subtotal() )/ 100).toFixed(2),
                // tip: ((parseFloat(this.order.Tip) * parseFloat(this.order.subtotal() )/ 100).toFixed(2),
                tax: this.calcTax.toFixed(2),
                tip: this.calcTip.toFixed(2),
                taxName: this.taxName, //?        
                products: this.products,  
                firstName : this.order.CustomerName || ''      
        }

      

        if(this.order.AuthorizationPayment){
        
            if(this.order.AuthorizationPayment[0].paymentInfo.transId){

            try {

                this.spinner = true;            
                data.invoiceNumber = this.order.AuthorizationPayment[0].paymentInfo.transId;
                const moto = this.order.AuthorizationPayment[0].paymentInfo.moto;
                if(this.order.AuthorizationPayment[0].paymentInfo.accountNumber)
                    data.cardNumber = this.order.AuthorizationPayment[0].paymentInfo.accountNumber;

               
                const response = await payAuthorizeNet.firstAuthorizeOrder(data, moto);
              
                if(response){
                   
                    this.order.AuthorizationPayment = [{
                        state: 1,
                        total: response.total,
                        paymentInfo: response, 
                        PaymentMethod:response.method + ' '+ response.accountType+ ' '+ response.accountNumber
                    }]   ;
                    // this.buildOrder();
                    //Build order.

                    this.save('The payment was authorize successfully.');
                    return true;
                   
                } 
                else{
                    this.showToastMessage('An error has occurred during payment authorization', 'danger')
                    this.spinner = false
                    return false;          
                } 
            } 
            catch (error) {
                this.spinner = false;
                error;
                return false;
            }

            }
            else{
                this.showToastMessage('TransId not found', 'danger')
                return false;
            }
        }
        else{
            this.save('The payment was authorize successfully.');
            return false;
        }
        
    },
    async closeTicket(){
        try {
             if(this.order.AuthorizationPayment){
                this.spinner = true;
                let autho = true;
                if(this.restaurantActive.PayMethod !== 'TSYS')                
                     autho =  await this.addToTicket();
                if(autho)
                {
                    const invoiceNumber = this.order.AuthorizationPayment[0].paymentInfo.transId;
                    const moto = this.order.AuthorizationPayment[0].paymentInfo.moto;
                    const response = await payAuthorizeNet.captureOrder(invoiceNumber, moto,  this.restaurantActive._id, this.restaurantActive.PayMethod, this.order.Total);      
                    delete this.order.AuthorizationPayment;
                    this.recivePayment(response);
                    this.showToastMessage('The payment was complete successfully', 'success')
                }
                else
                {
                    this.spinner = false
                    this.showToastMessage('An error has occurred during payment authorization. Payment denied', 'danger')
                }

             }
             else{
                 //Lanzar el modal de Pago de Order

                 const modalProps = { 
                            parent: this, 
                            order: this.order,   
                            canSplitPayment: true,          
                            Acept: this.$t('frontend.home.acept'),
                            Cancel: this.$t('frontend.home.cancel'), 
                            Total: parseFloat(this.order.Total).toFixed(2),
                            Tax:  this.taxe.toString(),
                            TaxName: this.taxName,     
                            restaurantId: this.$store.state.user.RestaurantId,
                            payMethod: this.restaurantActive.PayMethod  ,  
                            RestaurantName: this.restaurantActive.RestaurantName,              
                            errorPaymentHeader: this.$t('frontend.order.transictionTitle'),
                            errorPaymentMss: this.$t('frontend.order.transictionError'),
                            gooPaymentHeader: this.$t('frontend.order.transictionTitle'),
                            gooPaymentMss: this.$t('frontend.order.transictionOk'),
                            notValidEmail: this.$t('frontend.home.notValidEmail'),
                            codeNotValid: this.$t('frontend.home.zipCodeNotValid'),
                            notValidCC: this.$t('frontend.order.notValidCC'),
                            dataRequired: this.$t('frontend.home.errorRequired'),
                            paymentByCard: this.$t('frontend.order.paymentByCard'),
                            totalForPay: this.$t('frontend.order.totalForPay'),
                            currency: this.restaurantActive.Currency,
                            ccard: this.$t('frontend.order.ccard'),
                            expcard: this.$t('frontend.order.expcard'),
                            ccode: this.$t('frontend.order.ccode'),
                            cityText: this.$t('frontend.home.city'),
                            stateText: this.$t('frontend.home.state'),
                            firstNameText: this.$t('frontend.order.firstName'),
                            lastNameText: this.$t('frontend.order.lastName'),
                            postalCode: this.$t('frontend.order.postalCode'),
                            addressLine1: this.$t('frontend.order.addressLine1'),
                            payText: this.$t('frontend.order.pay'),
                            verifyText: this.$t('frontend.order.verify'),
                            returnTo: 'Ticket',
                            isTicket: true,
                        }


                 return this.$ionic.modalController
                    .create({
                        component: PaymentModal,
                        backdropDismiss: false,
                        keyboardClose: false,
                        cssClass: 'my-custom-class',
                        componentProps: {
                        data: {
                            content: 'New Content',
                        },
                        propsData: modalProps,
                        },
                    })
                    .then(m => m.present()) 
                        }

            
        }
        catch (error)
        {
            this.spinner = false;
            error;
            this.showToastMessage('An error was occur', 'danger')
        }
    },
    recivePayment: async function(res){  

        try {
            this.order.Payment = [{
                state: 1,
                total: res.total,
                paymentInfo: res, 
                PaymentMethod:res.method + ' '+ res.accountType+ ' '+ res.accountNumber
            }];        
            this.order.State = 5;  

            for(var i=0; i< this.order.Products.length; i++){
              this.order.Products[i].State = 1;
            }         
            const response = await Api.putIn('Order', this.order)
            if(response.status === 200 && response.statusText === "OK")
            {
                if(res.method === 'Credit')
                      Commons.updateCustomerCredit(parseFloat(res.total), 'Order', response.data._id); 
                    else if(res.method === 'HouseAccount'){
                      const houseAccount = { 
                        "ServerName": this.order.StaffName, 
                        "CustomerName": this.order.CustomerName,                 
                          "Amount": res.total,    
                          "Model": "Order",
                          "ModelId": response.data._id,
                        }
                      await Api.postIn('houseAccount', houseAccount); 
                    }             
                    else{
                      const paymentEntry = {                       
                        "Method": res.method,
                        "Payment": res.total,
                        "InvoiceNumber": res.transId,
                        "ModelId": response.data._id,
                        "ModelFrom": "Order",
                        "StaffName": this.order.StaffName,               
                        }
                      await Api.postIn('allpayments', paymentEntry);
                    }  
                  this.spinner = false;
                    
            }    
        } 
        catch (error) {            
         error;
            this.spinner = false;
            // this.errorPaymentDetail(error); 
        }
    },

   

   },

}
    
</script>

<style>

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