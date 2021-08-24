<template>
    <div class="screen">
        <ion-header v-if="!orderProps && !funProps">
            <ion-toolbar>
                <ion-buttons slot="start">
                <ion-back-button v-if="fun == 'write'" default-href="/controlPanel" @click="$router.push({ name: 'OrderForDelivered'})"></ion-back-button>
                <ion-back-button v-else default-href="/controlPanel" @click="$router.push({ path: '/order'})"></ion-back-button>
                </ion-buttons>
                <ion-label style="padding: 20px 100px;">
                <h1>{{$t('backoffice.titles.deliveryLocation')}}</h1>        
                </ion-label>
            </ion-toolbar>
        </ion-header>
        <Map :coordinates = coordinates :title = driverName :travel = order.Travel :isTravel= isTravel />
        <div v-if="!orderProps && !funProps">
            <h4>{{$t('frontend.order.orderDetail')}}</h4>
                <ion-grid>
                    <ion-row class="left">
                        <ion-col>
                            <div v-if="customer != null"><span class="title">{{$t('backoffice.form.titles.customer')}}:</span> {{customer.Name}}</div>
                        </ion-col>
                        <ion-col>
                            <div><span class="title">{{$t('backoffice.form.titles.date')}}:</span> {{getFormatedDate(order.Date)}}</div>
                        </ion-col>
                    </ion-row>
                    <ion-row class="left">
                        <ion-col>
                            <div><span class="title">{{$t('backoffice.form.titles.addressToDelivery')}}:</span> {{order.AddressToDeliver}}</div>
                        </ion-col>
                    </ion-row>
                </ion-grid>
                <br/>
                <ion-grid>
                    <ion-row class="left">
                        <ion-col>
                            <div><span class="title">{{$t('backoffice.form.titles.products')}}:</span></div>
                        </ion-col>
                    </ion-row>
                    <ion-row class="left" v-for="product in order.Products" :key="product._id">
                        <ion-col size="3">
                            <div>{{product.Name}}<span v-if="product.VariantSelected"> - {{product.VariantSelected.name}}</span></div>
                        </ion-col>
                        <ion-col size="2">
                            <div>{{product.Cant}}</div>
                        </ion-col>
                        <ion-col size="2">
                            <div class="end">{{ getFormateNumber(product.Price)}} </div>
                        </ion-col>
                        <ion-col size="5">
                            <div style="background-color: yellow">{{product.Note}}</div>
                        </ion-col>
                    </ion-row>
                    <ion-row v-if="order.OtherCharges.length > 0" class="left">
                        <ion-col>
                            <div><span class="title">{{$t('backoffice.form.titles.otherCharges')}}:</span></div>
                        </ion-col>
                    </ion-row>
                    <ion-row v-for="otherCharge in order.OtherCharges" :key="otherCharge._id" class="left">
                        <ion-col size="10">
                            <div>{{otherCharge.Name}}</div>
                        </ion-col>
                        <ion-col size="2">
                            <div class="end">{{ getFormateNumber(otherCharge.Price)}}</div>
                        </ion-col>
                    </ion-row>
                </ion-grid>
                <br/>
                <ion-grid>
                    <ion-row>
                        <ion-col>
                            <div class="end"><span class="title">{{$t('backoffice.form.titles.shippingPrice')}}:</span>{{ getFormateNumber(order.Shipping)}}</div>
                        </ion-col>
                    </ion-row>
                    <ion-row>
                        <ion-col>
                            <div class="end"><span class="title">{{$t('backoffice.form.titles.subtotal')}}:</span> {{ getFormateNumber(order.SubTotal)}}</div>
                        </ion-col>
                    </ion-row>
                    <ion-row>
                        <ion-col>
                            <div class="end"><span class="title">{{$t('backoffice.form.titles.tax')}}:</span> {{ getFormateNumber(order.Taxe)}}</div>
                        </ion-col>
                    </ion-row>
                    <ion-row>
                        <ion-col>
                            <div class="end"><span class="title">{{$t('backoffice.form.titles.total')}}:</span> {{ getFormateNumber(order.Total)}}</div> 
                        </ion-col>
                    </ion-row>
                </ion-grid>
                <br/>
                <ion-grid>
                    <ion-row v-if="order.Note != ''" class="left">
                        <ion-col>
                            <span class="title">{{$t('backoffice.form.titles.notes')}}:</span>
                        </ion-col>
                    </ion-row>
                    <ion-row class="left">
                        <ion-col>
                            {{order.Note}}
                        </ion-col>
                    </ion-row>
                </ion-grid>
                <ion-grid v-if="!IsDriver()">
                    <ion-list>
                        <ion-list-header>
                            <ion-label>
                                <!-- <span style="color: red">*</span> -->
                                {{$t('backoffice.form.fields.driver')}}
                            </ion-label>
                        </ion-list-header>

                        <ion-item>
                            <ion-label>{{$t('backoffice.form.titles.selectADriver')}}</ion-label>
                            <ion-select :ok-text="$t('backoffice.form.messages.buttons.ok')" :cancel-text="$t('backoffice.form.messages.buttons.dismiss')"
                            @ionChange="driver = $event.target.value" v-bind:value="driver">
                                <ion-select-option v-for="user in drivers" v-bind:key="user.Id" v-bind:value="user._id" >{{user.FirstName}} {{user.LastName}}</ion-select-option>
                            </ion-select>
                        </ion-item>
                        <ion-item v-if="driver != ''">
                            <ion-button color="primary" @click="saveDriver()">Assing driver</ion-button>
                        </ion-item>
                        
                    </ion-list>
                      
                </ion-grid>
        </div>
        <br/>
        <ion-button v-if="fun == 'write'" expand="full" color="primary" @click="deliveredOrder()">Delivered</ion-button>
    </div>
</template>

<script>

import Map from './Map'
import { Geolocation } from '@ionic-native/geolocation/'
import { Api } from '../api/api.js'
import { Commons} from '../../frontend/commons.js'
import { Utils } from '../utils/utils.js'

export default {

    data(){
        return {
            order: null,
            customer: null,
            fun: 'write',
            coordinates: {
                lat: 0,
                lng: 0
            },
            driverName: '',
            isTravel: false,

            readInterval: null,
            writeInterval: null,

            currency: 'USD',

            driver: '',
            drivers: [],
        }
    },

     props: {
        orderProps: { type: Object, default:() => {} },
        funProps: {type: String, default: ''}
     },
   
    created(){
       
        
        this.order = this.$route.params.order || this.orderProps;
        this.fun = this.$route.params.fun || this.funProps;
        console.log(this.fun)
        this.driver = this.order.Driver;
        this.drivers = this.$store.state.backConfig.staff.filter(urs => urs.IsDriver)
        this.currency = this.$store.state.backConfig.restaurant.Currency;

        const data = this.$store.state.backConfig.staff.find(x => x._id === this.driver)
        if(data)  this.driverName = data.FirstName + " " + data.LastName

         const dataCust = this.$store.state.backConfig.customer.find(c => c._id === this.order.ClientId)
        if(dataCust)   this.customer = dataCust;

       
        if (this.fun == 'write')
        {
            this.readAndPutPosition();
            this.ShowMessage('Entención, por favor!', 
                'No cierre esta ventana. La geolocalización está activada. Para una mejor precisión, active el sistema GPS de su dispositivo.', '');
            this.writeInterval = setInterval(() => {
                this.readAndPutPosition();  
            } , 20000);
        }
        else if(this.fun == 'read'){
            this.getAndShowPosition();
            this.readInterval = setInterval(() => {
                this.getAndShowPosition();  
             } , 25000);
        }
        else if(this.fun == 'travel'){
            this.getAndShowPosition()
            this.isTravel = true
        }
    },

    destroyed(){
        console.log(this.writeInterval)
        if (this.writeInterval != null)
            clearInterval(this.writeInterval);
        console.log(this.readInterval)
        if (this.readInterval != null)
            clearInterval(this.readInterval);
    },
    methods:{
        IsDriver(){
            return this.$store.state.user.IsDriver;
        },
    
        
        async saveDriver(){
            const item = {
                '_id': this.order._id,
                'Driver': this.driver,
            }

            await Api.putIn('Order', item)
            .then( () => {
                console.log("Driver was set successfully")
                this.showToastMessage("The order was assigned successfully", "success");
            })
            .catch(e => {
                this.showToastMessage("There was an error assing the order", "success");
                console.log(e);
            })
        },
        
        getFormatedDate: function(date){
            return Utils.getFormatedDate(date);         
        },

        getFormateNumber: function(number){
          return new Intl.NumberFormat('en', {style: "currency", currency: this.currency} ).format(number).toString()
        },

        readAndPutPosition(){
            console.log(this.order.IsAccept)
            // if (this.order.IsAccept){
                Geolocation.getCurrentPosition({   
                timeout: 30000     
                }).then(response => {
                    this.coordinates.lat = response.coords.latitude
                    this.coordinates.lng = response.coords.longitude
                    this.putPosition();
                    console.log("Writing position");
                }).catch(e => {
                    console.log(e);
                });
            // }
        },

        getAndShowPosition(){
            // if (this.order.IsAccept){
                Api.fetchById("Order", this.order._id)
                .then(response => {
                this.coordinates.lat = response.data.lat
                this.coordinates.lng = response.data.lng
                console.log("Read successfully")
                return response;
                })
                .catch(e => {
                console.log(e);
                }) 
            // }
        },

        putPosition(){
            let travel = []
            if (this.order.Travel)
            {
                travel = this.order.Travel
            }
            travel.push(
                            {
                                'lat': this.coordinates.lat,
                                'lng': this.coordinates.lng
                            }
                        )
            const item = {
                '_id': this.order._id,
                'lat': this.coordinates.lat,
                'lng': this.coordinates.lng,
                'Travel': travel,
            }
            
            Api.putIn('Order', item)
            .then( () => {
                console.log("Writing successfully")
                if (!this.order.Travel)
                {
                    this.order["Travel"] = travel
                }
            })
            .catch(e => {
                console.log(e);
            })
        },

        async sendEmail(item){
            
            await Api.sendEmail(item)
            .catch(e => {
                console.log(e)
            })
        },

        async deliveredOrder(){
            const item = {
                '_id': this.order._id,
                'State': 5,
                'IsAccept': false
            }

            await Api.putIn('Order', item)
            .then( () => {
                const index = this.$store.state.backConfig.order.findIndex( o => o._id ===this.order._id )
                if(index !== -1) this.$store.state.backConfig.order[index] = item;
                const orderBody = Commons.htmlToSendEmailOrder(this.order)
                //Enviarle email al merchant
                const restaurantEmail = this.$store.state.backConfig.restaurant.Email
                if (restaurantEmail != '')
                {
                     let restaurantEmailItem = {
                        "email": restaurantEmail,
                        "mess": orderBody,
                        "subject": "Delivery Complete"
                      };
                      this.sendEmail(restaurantEmailItem)
                }
                //Enviarle email a el StaffPadre
                const parentStaffId = this.$store.state.user.ParentStaffId
                if (parentStaffId){
                     const data = this.$store.state.backConfig.staff.find( s => s._id === parentStaffId)
                    if(data) {
                        const parentStaff = data
                        let staffEmailItem = {
                            "email": parentStaff.Email,
                            "mess": orderBody,
                            "subject": "Delivery Complete"
                        };
                        this.sendEmail(staffEmailItem)
                    }
                }
                this.showToastMessage("The order was delivered successfully", "success");
                this.$router.push({
                    name: 'OrderForDelivered',
                });
            })
            .catch(e => {
                console.log(e);
            })
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
    },
    components:{
        Map,
    }
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