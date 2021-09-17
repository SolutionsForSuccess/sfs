<template>
    <div>
        <div style="padding: 20px;" :key="$store.state.user.RestaurantId">
         
            <ion-loading
                v-if="spinner"
                cssClass="my-custom-class"
                :message="$t('frontend.tooltips.loadRestaurant')"
            ></ion-loading>
                   
                <div  :key="getOnline()">
                 
                    

                    

                    <div v-if="vClockin">

                        <ion-card-header style="font-size: 1.3em;font-weight: 400;">
                            {{$t('backoffice.titles.controlPanel')}} 
                            <ion-button v-tooltip="'Reload All Restaurant Data'" @click="reloadAllData()">
                                <div v-if="!spinnerReload">
                                    <span class="iconify" data-icon="si-glyph:arrow-reload" style="margin:0"></span>
                                </div>                              
                              <ion-spinner name="dots" v-if="spinnerReload"></ion-spinner>
                            </ion-button>
                        </ion-card-header>

                            <!-- Mensaje online -->
                        <div class=" menu-col-12 ">
                            <ion-text v-if="!getOnline()" style="color: rgb(172 127 14)">
                                <span class="iconify" data-icon="twemoji:warning" data-inline="false" style="margin: 5px 0 0 15px; width: 18px;height: 18px;"></span>
                                {{$t('backoffice.form.fields.onlineMss')}}</ion-text>
                            
                            <ion-text v-if="getOnline()" style="color: rgb(44 172 14)">
                                <span class="iconify" data-icon="emojione-v1:left-check-mark" data-inline="false" style="margin: 5px 0 0 15px; width: 18px;height: 18px;"></span>
                                {{$t('backoffice.form.fields.onlineMss1')}}</ion-text>
                        </div>

                            <!-- CHIP SELECTED -->
                       <ion-row>
                            <ion-col size="3" style="padding:0">
                                <ion-chip class="chip-support" 
                                :color="viewSelected==='Sale'? 'dark': 'secondary'" 
                                @click="viewSelected==='Sale'? viewSelected='' : viewSelected='Sale'" >
                                    <span class="iconify" data-icon="dashicons:money-alt"></span>
                                    {{ $t('backoffice.menu.sales') }}
                                </ion-chip>
                            </ion-col>

                            <ion-col size="3" style="padding:0">
                                    <ion-chip class="chip-support"  
                                    :color="viewSelected==='Admin'? 'dark': 'secondary'"  
                                    @click="viewSelected==='Admin'? viewSelected='' : viewSelected='Admin'">
                                        <span class="iconify" data-icon="dashicons:admin-appearance"></span>
                                    Admin <!-- {{ $t('backoffice.menu.restaurantAdministration') }} -->
                                    </ion-chip>
                            </ion-col>

                            <ion-col  size="3" style="padding:0">
                                <ion-chip class="chip-support"
                                :color="viewSelected==='Report'? 'dark': 'secondary'"  
                                @click="viewSelected==='Report'? viewSelected='' : viewSelected='Report'">
                                    <span class="iconify" data-icon="icon-park-outline:table-report"></span>
                                    {{ $t('backoffice.menu.report') }}
                                </ion-chip>
                            </ion-col>

                            <ion-col size="3" style="padding:0">
                                    <ion-chip class="chip-support" 
                                    :color="viewSelected==='Config'? 'dark': 'secondary'" 
                                    @click="viewSelected==='Config'? viewSelected='' : viewSelected='Config'">
                                        <span class="iconify" data-icon="eos-icons:configuration-file"></span>
                                        Config<!-- {{ $t('backoffice.menu.settings') }} -->
                                    </ion-chip>
                            </ion-col>

                       
                       </ion-row>

                    

                        <!-- Content X CHip Selected -->
                        <div>
                            <div v-if="viewSelected==='Sale'">
                                <ion-chip 
                                class="menu-col-8"
                                v-tooltip="$t('backoffice.controlPanel.orders')" v-if="hasPermission('canViewOrder')|| hasPermission('canViewOrderForDelivery')" @click="$router.push( '/order')"  color="secondary" style="border: 1px solid grey;visibility: visible;">
                                    <span class="iconify" data-icon="mdi:order-bool-descending" data-inline="false"></span>
                                    <ion-label style=" width: 80%; text-align: center;">{{ $t('backoffice.options.viewOrders') }}</ion-label>   
                                </ion-chip> 
                                 <br>
                                <ion-chip
                                class="menu-col-8"
                                 v-tooltip="$t('backoffice.controlPanel.reservations')" v-if="hasPermission('canViewReservation')" @click="$router.push('/reservationbackoffice')" color="secondary" style="border: 1px solid grey;visibility: visible;">
                                    <span class="iconify" data-icon="ic:baseline-access-time" data-inline="false"></span>
                                    <ion-label style=" width: 80%; text-align: center;">{{ $t('backoffice.options.manageReservation') }}</ion-label>   
                                </ion-chip>
                                <br> 
                            </div>
                            <div v-if="viewSelected==='Admin'">
                                 <div v-if="hasPermission('canViewMenu') || hasPermission('canViewCategory') ||
                                     hasPermission('canViewProduct')">{{ $t('backoffice.menu.foodServices') }}</div>
                                <ion-chip 
                                    class="menu-col-8"
                                    v-tooltip="$t('backoffice.controlPanel.menus')" 
                                    v-if="hasPermission('canViewMenu')" @click="$router.push('/menu')" 
                                    color="secondary" 
                                    style="border: 1px solid grey;visibility: visible;">
                                    <span class="iconify" data-icon="bx:bx-food-menu" color="primary" data-inline="false"></span>
                                    <ion-label style=" width: 80%; text-align: center;">{{ $t('backoffice.options.manageMenus') }}</ion-label>   
                                </ion-chip>
                                <br>
                                <ion-chip 
                                    class="menu-col-8"
                                    v-tooltip="$t('backoffice.controlPanel.categories')" v-if="hasPermission('canViewCategory')"  
                                    @click="$router.push('/category')" color="secondary" 
                                    style="border: 1px solid grey;visibility: visible;">
                                    <span class="iconify" data-icon="carbon:category-new-each" data-inline="false"></span>
                                    <ion-label style=" width: 80%; text-align: center;">{{ $t('backoffice.options.manageCategories') }}</ion-label>   
                                </ion-chip>
                                <br>
                                <ion-chip 
                                class="menu-col-8"
                                v-tooltip="$t('backoffice.controlPanel.menuItems')"  v-if="hasPermission('canViewProduct')" @click="$router.push('/product')"  color="secondary" style="border: 1px solid grey;visibility: visible;">
                                    <span class="iconify" data-icon="dashicons:products" data-inline="false"></span>
                                    <ion-label style=" width: 80%; text-align: center;">{{ $t('backoffice.options.manageProducts') }}</ion-label>   
                                </ion-chip>
                                <br>
                                <ion-chip 
                                    class="menu-col-8"
                                    v-tooltip="$t('backoffice.controlPanel.services')" v-if="hasPermission('canViewProduct')" 
                                    @click="$router.push('/product/service')"  color="secondary" style="border: 1px solid grey;visibility: visible;">
                                    <span class="iconify" data-icon="dashicons:businessman" data-inline="false"></span>
                                    <ion-label style=" width: 80%; text-align: center;">{{ $t('backoffice.options.manageServices') }}</ion-label>   
                                </ion-chip>
                                <br>
                                 <ion-chip 
                                 class="menu-col-8"
                                 v-tooltip="$t('backoffice.controlPanel.otherCharges')" v-if="hasPermission('canViewOtherCharge')"  @click="$router.push('/otherCharge')" color="secondary" style="border: 1px solid grey;visibility: visible;">
                                    <span class="iconify" data-icon="si-glyph:money-bag" data-inline="false"></span>
                                        <ion-label style=" width: 80%; text-align: center;">{{ $t('backoffice.options.manageOtherCharges') }}</ion-label>   
                                </ion-chip>
                                <br>
                                <ion-chip 
                                class="menu-col-8"
                                 v-tooltip="$t('frontend.specialsPrice.titles')" v-if="hasPermission('canViewSpecialPrices')"  @click="$router.push('/specialsprice')"  color="secondary" style="border: 1px solid grey;visibility: visible;">
                                    <span class="iconify" data-icon="ic:baseline-price-check" data-inline="false"></span>
                                    <ion-label style=" width: 80%; text-align: center;">{{ $t('frontend.specialsPrice.titles') }}</ion-label>  
                                </ion-chip>

                                <div v-if="hasPermission('canViewUser') || hasPermission('canViewRole') || 
                                            hasPermission('canViewOccupation') || hasPermission('canViewCustomer') ||
                                             hasPermission('canViewDriver')" 
                                             style="margin-top: 40px;">{{ $t('backoffice.menu.staffOccupationsCustomersDrivers') }}
                                </div>
                                <ion-chip
                                 class="menu-col-8"
                                 v-tooltip="$t('backoffice.controlPanel.staff')" v-if="hasPermission('canViewUser')" @click="$router.push('/user')"  color="secondary" style="border: 1px solid grey;visibility: visible;">
                                <span class="iconify"  color="primary" data-icon="simple-icons:codechef" data-inline="false"></span>
                                    <ion-label style=" width: 80%; text-align: center;">{{ $t('backoffice.options.manageUsers') }}</ion-label>   
                                </ion-chip>
                                <br>
                                <ion-chip
                                 class="menu-col-8"
                                 v-tooltip="$t('backoffice.controlPanel.driver')" v-if="hasPermission('canViewDriver')"  @click="manageDriver()" color="secondary" style="border: 1px solid grey;visibility: visible;">
                                        <span class="iconify" data-icon="mdi:car-child-seat" data-inline="false"></span>
                                        <ion-label style=" width: 80%; text-align: center;">{{ $t('backoffice.options.manageDriver') }}</ion-label>   
                                </ion-chip>
                                <br>
                                <ion-chip 
                                class="menu-col-8"
                                 v-tooltip="$t('backoffice.controlPanel.roles')" v-if="hasPermission('canViewRole')"  @click="$router.push('/role')" color="secondary" style="border: 1px solid grey;visibility: visible;">
                                        <span class="iconify" data-icon="ls:cookpad" data-inline="false"></span>
                                        <ion-label style=" width: 80%; text-align: center;">{{ $t('backoffice.options.manageRoles') }}</ion-label>   
                                </ion-chip>

                                <!-- WorkSheet -->
                                <!-- v-if="hasPermission('canViewWorkSheet')" -->
                                <ion-chip 
                                class="menu-col-8"
                                 v-tooltip="$t('backoffice.controlPanel.workSheet')" v-if="hasPermission('canViewWorkSheet')" @click="$router.push('/workSheet')" color="secondary" style="border: 1px solid grey;visibility: visible;">
                                        <span class="iconify" data-icon="bx:bx-spreadsheet" data-inline="false"></span>
                                        <ion-label style=" width: 80%; text-align: center;">{{ $t('backoffice.options.manageWorkSheet') }}</ion-label>   
                                </ion-chip>

                                <br>
                                <ion-chip
                                class="menu-col-8"
                                 v-tooltip="$t('backoffice.controlPanel.occupations')" v-if="hasPermission('canViewOccupation')" @click="$router.push( '/occupation')"  color="secondary" style="border: 1px solid grey;visibility: visible;">
                                    <span class="iconify" data-icon="tabler:tools-kitchen" data-inline="false"></span>
                                        <ion-label style=" width: 80%; text-align: center;">{{ $t('backoffice.options.manageOccupation') }}</ion-label>   
                                </ion-chip>
                                <br>
                                <ion-chip
                                 class="menu-col-8"
                                 v-tooltip="$t('backoffice.controlPanel.customers')" v-if="hasPermission('canViewCustomer')"  @click="$router.push('/customer')" color="secondary" style="border: 1px solid grey;visibility: visible;">
                                        <span class="iconify" data-icon="raphael:people" data-inline="false"></span>
                                        <ion-label style=" width: 80%; text-align: center;">{{ $t('backoffice.options.manageCustomers') }}</ion-label>   
                                </ion-chip>
                                <br>
                                <ion-chip 
                                class="menu-col-8"
                                 v-tooltip="$t('backoffice.controlPanel.credit')" v-if="hasPermission('canViewCredit')" @click="$router.push('/credit')" color="secondary" style="border: 1px solid grey;visibility: visible;">
                                        <span class="iconify" data-icon="mdi:credit-card-plus" data-inline="false"></span>
                                        <ion-label style=" width: 80%; text-align: center;">{{ $t('backoffice.options.manageCredits') }}</ion-label>   
                                </ion-chip>                  

                                <div v-if="hasPermission('canViewTable') || hasPermission('canViewTax') ||
                                    hasPermission('canViewShipping') || hasPermission('canViewOtherCharge') ||
                                        hasPermission('canChangeSetting')" style="margin-top: 40px;">{{ $t('backoffice.menu.restaurantAdministration') }}</div>
                                <ion-chip 
                                class="menu-col-8"
                                 v-tooltip="$t('backoffice.controlPanel.tables')" v-if="hasPermission('canViewTable')" @click="$router.push('/table')" color="secondary" style="border: 1px solid grey;visibility: visible;">
                                    <span class="iconify" data-icon="vs:table-o" data-inline="false"></span>
                                    <ion-label style=" width: 80%; text-align: center;">{{ $t('backoffice.options.manageTables') }}</ion-label>   
                                    </ion-chip>
                                <br>
                                <ion-chip 
                                class="menu-col-8"
                                v-tooltip="$t('backoffice.controlPanel.taxes')" v-if="hasPermission('canViewTax')" @click="$router.push( '/tax')"  color="secondary" style="border: 1px solid grey;visibility: visible;">
                                    <span class="iconify" data-icon="heroicons-outline:receipt-tax" data-inline="false"></span>
                                        <ion-label style=" width: 80%; text-align: center;">{{ $t('backoffice.options.manageTaxes') }}</ion-label>   
                                </ion-chip>
                                <br>
                                <ion-chip 
                                class="menu-col-8"
                                v-tooltip="$t('backoffice.controlPanel.deliveries')" v-if="hasPermission('canViewShipping')"  @click="$router.push('/shipping')" color="secondary" style="border: 1px solid grey;visibility: visible;">
                                    <span class="iconify" data-icon="la:truck-pickup-solid" data-inline="false"></span>
                                    <ion-label style=" width: 80%; text-align: center;">{{ $t('backoffice.options.manageShippings') }}</ion-label>   
                                </ion-chip>
                                <br>                              
                                <br>
                                  <div v-if="hasPermission('canViewSuscriptor')" style="margin-top: 40px;">{{ $t('backoffice.menu.marketing') }}</div>
                                <ion-chip
                                class="menu-col-8"
                                 v-tooltip="$t('backoffice.menu.marketing')" v-if="hasPermission('canViewSuscriptor')"  @click="$router.push('/suscriptor')" color="secondary" style="border: 1px solid grey;visibility: visible;">
                                    <span class="iconify" data-icon="mdi:email-newsletter" data-inline="false"></span>
                                    <ion-label style=" width: 80%; text-align: center;">{{ $t('backoffice.titles.suscriptors') }}</ion-label>   
                                </ion-chip>
                                <br>
                            </div>
                            <div v-if="viewSelected==='Config'">
                         
                                <ion-chip
                                class="menu-col-8"
                                 v-tooltip="$t('backoffice.controlPanel.funtionalitiesSettings')" v-if="hasPermission('canChangeSetting')"  @click="manageFunSettings()" color="secondary" style="border: 1px solid grey;visibility: visible;">
                                    <span class="iconify" data-icon="clarity:file-settings-line" data-inline="false"></span>
                                    <ion-label style=" width: 80%; text-align: center;">{{ $t('backoffice.menu.settings') }}</ion-label>   
                                </ion-chip>
                                <br>
                              
                                <!-- <ion-chip
                                class="menu-col-8"
                                 v-tooltip="$t('backoffice.controlPanel.paymentSettings')" v-if="hasPermission('canChangeSetting')" @click="managePaymentSettings()"  color="secondary" style="border: 1px solid grey;visibility: visible;">
                                    <span class="iconify" data-icon="ic:twotone-payments" data-inline="false"></span>
                                    <ion-label style=" width: 80%; text-align: center;">{{ $t('backoffice.options.managePaymentSettings') }}</ion-label>
                                </ion-chip>
                                <br> -->
                                <!-- <ion-chip v-tooltip="$t('backoffice.controlPanel.systemSettings')"  v-if="hasPermission('canChangeSetting')"   @click="manageKeySettings()" color="secondary" style="border: 1px solid grey;visibility: visible;">
                                    <span class="iconify" data-icon="clarity:network-settings-solid" data-inline="false"></span>
                                    <ion-label style=" width: 80%; text-align: center;">{{ $t('backoffice.options.manageKeySettings') }}</ion-label>   
                                </ion-chip> -->
                                <!-- <br> -->
                                <ion-chip
                                class="menu-col-8"
                                 v-tooltip="'Description.'" v-if="hasPermission('canSuperUser')"   @click="manageSupportSettings()" color="danger" style="border: 1px solid grey;visibility: visible;">
                                    <span class="iconify" data-icon="mdi:account-supervisor" data-inline="false"></span>
                                    <ion-label style=" width: 80%; text-align: center;">{{ $t('backoffice.options.supportSettings') }}</ion-label>  
                                </ion-chip>
                            </div>
                            <div v-if="viewSelected==='Report'">
                                <ion-chip 
                                class="menu-col-8"
                                 v-tooltip="$t('backoffice.controlPanel.payments')" v-if="hasPermission('canViewPayments')" @click="$router.push('/payment')"  color="secondary" style="border: 1px solid grey;visibility: visible;">
                                    <span class="iconify" data-icon="ic:twotone-attach-money" data-inline="false"></span>
                                    <ion-label style=" width: 80%; text-align: center;">{{ $t('backoffice.options.managePyments') }}</ion-label>
                                </ion-chip>
                                <br>
                                 <ion-chip 
                                class="menu-col-8"
                                 v-tooltip="$t('backoffice.controlPanel.payments')" v-if="hasPermission('canViewPayments')" @click="$router.push('/houseaccount')"  color="secondary" style="border: 1px solid grey;visibility: visible;">
                                    <span class="iconify" data-icon="ic:twotone-attach-money" data-inline="false"></span>
                                    <ion-label style=" width: 80%; text-align: center;">{{ $t('backoffice.options.manageHouseAccount') }}</ion-label>
                                </ion-chip>

                            </div>

                        </div>  

                      
                         

                    </div>
                    <ion-card v-else>
                        <ion-title style="color: rgb(172, 14, 14)">
                        <span class="iconify" data-icon="mdi:account-clock" data-inline="false"></span>
                        {{$t('backoffice.form.fields.mustClockinMss')}} <router-link to="/assistance" style="cursor: pointer; text-decoration: none; color: black;">{{$t('backoffice.form.fields.mustClockin2Mss')}}</router-link></ion-title>
                    </ion-card>

                    <!-- <Clock/> -->

                      <!-- //Graficas.         -->...

                        <ion-row class="grafic-imenu">
                             <ion-col size="12" size-md="6">  
                                <ion-label>{{$t('backoffice.titles.payments')}}</ion-label>                     
                                <v-chart    style="margin: 0 auto;"                                                
                                :options="optionsPayment"  />
                            </ion-col>

                            <ion-col  size="12" size-md="6" v-if="options.series[0].data.length > 0" >
                                <ion-la> Restaurant's Rating </ion-la>
                                <v-chart   style="margin: 0 auto;"                                                     
                                :options="options2"  />
                            </ion-col> 
                        </ion-row>
                            
                </div>
           
        </div>
    </div>
</template>

<script>
// import { Api } from '../api/api.js';
import ECharts from 'vue-echarts';
import Modal from './SetDeviceDataModal.vue';
import Moment from 'moment';
import { EventBus } from '../../frontend/event-bus';
import 'echarts';
import { Commons } from '../../frontend/commons';
// import SHA256 from "crypto-js/sha256";

export default {
    data(){
        return{
            optionsPayment: {
                xAxis: {
                    type: 'category',
                    data: []
                },
                yAxis: {
                    type: 'value'
                },
                series: [{
                    data: [],
                    type: 'line',
                    smooth: true
                }],
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                    type: 'shadow',
                    },
                },
            },
            options: {
                xAxis: {
                    type: 'category',
                    data: []
                },
                yAxis: {
                    type: 'value'
                },
                series: [{
                    data: [],
                    type: 'line',
                    smooth: true
                }],
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                    type: 'shadow',
                    },
                },
            },

            options2: {
                title: {
                    text: '',
                    subtext: '',
                    left: 'center'
                },
                grid: {
                     right: '25%',
                    left: 0,
                },
                tooltip: {
                    trigger: 'item',
                    formatter: '{a} <br/>{b} : {c} ({d}%)'
                },
                // legend: {
                //     orient: 'vertical',
                //     left: 'left',
                //     data: ['直接访问', '邮件营销', '联盟广告', '视频广告', '搜索引擎']
                // },
                series: [
                    {
                        name: 'Rating by Star',
                        type: 'pie',
                        radius: '55%',
                        center: ['50%', '50%'],
                        data: [
                            {value: 0, name: '1'},
                            {value:0, name: '2'},
                            {value: 0, name: '3'},
                            {value: 0, name: '4'},
                            {value: 0, name: '5'}
                        ],
                        emphasis: {
                            itemStyle: {
                                shadowBlur: 10,
                                shadowOffsetX: 0,
                                shadowColor: 'rgba(0, 0, 0, 0.5)'
                            }
                        }
                    }
                ]
            },
            spinner: false,

            allRestaurant: [],
            restaurantId: -1,
            
            item: 0,
            online: false,
            vClockin: false,

            restaurantS: null,
            viewSelected: '',
            spinnerReload: false,
        }
    },
    created: async function(){
        this.init()
        if(this.$route.params.viewSelected) this.viewSelected = this.$route.params.viewSelected
        this.vClockin = this.verifyClockin()        
        EventBus.$emit('clockIn', this.vClockin);
    }, 
    components: {
        vChart: ECharts ,
    },
    methods: {

        async reloadAllData(){
            this.spinnerReload = true;
            this.spinner = true;
            try {
                await Commons.getAllRestaurantCustomers();
                await Commons.getCompleteRestaurant();  
                 this.spinnerReload = false; 
                 this.spinner = false;    
                 this.viewSelected = '' ;                
            } catch (error) {
                error;
                 this.spinnerReload = false;
                 this.spinner = false;   
            }
        },
       
        async verifyClockin(){
            
            if (!this.hasPermission('canIgnoreClockin')) return false
            try{
                let attendanceDay = this.$store.state.backConfig.attendance;
                let StaffId = this.$store.state.user._id
                //Los registro del staff en cuestion
                attendanceDay = attendanceDay.filter(att => att.StaffId == StaffId)
                //Sean del mismo día
                attendanceDay = attendanceDay.filter(att => Moment(att.DateTime).format('YYYYMMDD') == Moment().format('YYYYMMDD'))
                if (attendanceDay.length == 0) return true
                return true
            }
            catch(e){
               e;
                return false;
                
            }
        },
        showSetDeviceModal(){
            return this.$ionic.modalController
                .create({
                component: Modal,
                cssClass: 'my-custom-class',
                componentProps: {
                    data: { },
                    propsData: {
                        parent: this
                    },
                },
                })
                .then(m => m.present())
        },
        async init(){
           try {
               this.spinner = true;
            this.restaurantS = this.$store.state.backConfig.setting; 
            this.restoreDataDefault();
            await this.fetchAllRestaurant()
            
            if(this.$store.state.user.RestaurantId){
                this.restaurantId = this.$store.state.user.RestaurantId
                let oneStart, twoStart, threeStart, fourStart, fiveStart =  0; 
                const payments= this.$store.state.backConfig.allpayments
                if(payments.length > 0){
                    payments.forEach(r =>{
                        this.optionsPayment.xAxis.data.push(Moment(r.date).format('YYYY-MM-DD')),                               
                        this.optionsPayment.series[0].data.push( parseFloat(r.Payment) - r.Refund - r.Void) ;                                              
                    });
                }  
                const rating =  this.$store.state.backConfig.restaurant.rating || [];
                this.online = this.$store.state.backConfig.restaurant.Online; 
                if(rating.length > 0)
                {
                    rating.forEach(r =>{
                        this.options.xAxis.data.push(Moment(r.date).format('YYYY-MM-DD')),
                        this.options.series[0].data.push(r.rating) ;
                        if( r.rating >=1 && r.rating <=1.9) oneStart++;
                        if(r.rating >=2 && r.rating <=2.9) twoStart++;
                        if(r.rating >=3 && r.rating <=3.9) threeStart++;
                        if(r.rating >=4 && r.rating <=4.9) fourStart++;
                        if(r.rating ===5) fiveStart++;                          
                    });
                }
                this.options2.series[0].data['0'].value = oneStart            
                this.options2.series[0].data['1'].value = twoStart            
                this.options2.series[0].data['2'].value = threeStart            
                this.options2.series[0].data['3'].value = fourStart            
                this.options2.series[0].data['4'].value = fiveStart
               
            } 
             this.spinner = false
               
           } catch (error) {
               error;
                this.spinner = false
           }

            
         
        },
        

        restoreDataDefault(){
            this.options = {
                xAxis: {
                    type: 'category',
                    data: []
                },
                yAxis: {
                    type: 'value'
                },
                series: [{
                    data: [],
                    type: 'line',
                    smooth: true
                }],
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                    type: 'shadow',
                    },
                },
            };
            this.options2 = {
                title: {
                    text: '',
                    subtext: '',
                    left: 'center'
                },
                grid: {
                     right: '25%',
                    left: 0,
                },
                tooltip: {
                    trigger: 'item',
                    formatter: '{a} <br/>{b} : {c} ({d}%)'
                },
                series: [
                    {
                        name: 'Rating by Star',
                        type: 'pie',
                        radius: '55%',
                        center: ['50%', '50%'],
                        data: [
                            {value: 0, name: '1'},
                            {value:0, name: '2'},
                            {value: 0, name: '3'},
                            {value: 0, name: '4'},
                            {value: 0, name: '5'}
                        ],
                        emphasis: {
                            itemStyle: {
                                shadowBlur: 10,
                                shadowOffsetX: 0,
                                shadowColor: 'rgba(0, 0, 0, 0.5)'
                            }
                        }
                    }
                ]
            };
            this.allRestaurant = [];
            this.restaurantId = -1
        },

        async fetchAllRestaurant(){
           let restaurants = this.$store.state.allRestaurant;
            let myRestaurants = this.$store.state.user.AllRestaurant;

            restaurants.forEach(restaurant => {
                if (myRestaurants.indexOf(restaurant._id) != -1)
                    this.allRestaurant.push(restaurant)
            });           
        },
   
        hasPermission(permission){
            
            let res = false;
            if (this.$store.state.authenticated)
            {
                let roles = this.$store.state.roles;
                for (let index = 0; index < roles.length; index++) {
                    switch(permission){                        
                        case 'canViewMenu':
                            res = roles[index].canViewMenu;
                            break;
                        case 'canViewCategory':
                            res = roles[index].canViewCategory;
                            break;
                        case 'canViewProduct':
                            res = roles[index].canViewProduct;
                            break;
                        case 'canViewVariantGroup':
                            res = roles[index].canViewVariantGroup;
                            break;
                        case 'canViewCustomer':
                            res = roles[index].canViewCustomer;
                            break;
                        case 'canViewTable':
                            res = roles[index].canViewTable;
                            break;
                        case 'canViewTax':
                            res = roles[index].canViewTax;
                            break;
                        case 'canViewShipping':
                            res = roles[index].canViewShipping;
                            break;
                        case 'canViewOtherCharge':
                            res = roles[index].canViewOtherCharge;
                            break;
                        case 'canViewReservation':
                            res = roles[index].canViewReservation;
                            break;
                        case 'canViewUser':
                            res = roles[index].canViewUser;
                            break;
                        case 'canViewOccupation':
                            res = roles[index].canViewOccupation;
                            break;
                        case 'canViewRole':
                            res = roles[index].canViewRole;
                            break;
                        case 'canViewOrder':
                            res = roles[index].canViewOrder;
                            break;
                        case 'canViewOrderForDelivery':
                            res = roles[index].canViewOrderForDelivery;
                            break;
                        case 'canChangeSetting':
                            res = roles[index].canChangeSetting;
                            break;
                        case 'canSuperUser':
                            res = this.$store.state.user.IsSupport;
                            break;
                        case 'canViewDriver':
                            res = roles[index].canViewDriver;
                            break;
                        case 'canViewSuscriptor':
                            res = roles[index].canViewSuscriptor;
                            break;
                        case 'canViewPayments':
                            res = roles[index].canViewPayments;
                            break;
                        case 'canIgnoreClockin':
                            res = roles[index].canIgnoreClockin;
                            break;
                        case 'canViewSpecialPrices':
                            res = roles[index].canViewSpecialPrices;
                            break;
                        case 'canViewCredit':
                            res = roles[index].canViewCredit;
                            break;
                        case 'canViewWorkSheet':
                            res = roles[index].canViewWorkSheet
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
        manageBasicSettings(){
            const restaurantID = this.$store.state.user.RestaurantId
            if (restaurantID)
            {
                this.$router.push({
                    name: 'BasicSettingForm',
                    params: {
                        "settingId": restaurantID,
                    }
                });
            }
            else{
                this.$router.push({
                    name: 'BasicSettingForm',
                });
            }
        },
        managePaymentSettings(){
            const restaurantID = this.$store.state.user.RestaurantId
            if (restaurantID)
            {
                this.$router.push({
                    name: 'PaymentSettingsForm',
                    params: {
                        "settingId": restaurantID,
                    }
                });
            }
            else{
                this.$router.push({
                    name: 'PaymentSettingsForm',
                });
            }
        },
        manageFunSettings(){
          let funSettings = this.$store.state.backConfig.setting;
                if (funSettings._id)
                {
                    this.$router.push({
                        name: 'FunSettingForm',
                        params: {
                            "settingId": funSettings._id,
                        }
                    });
                }
                else{
                    this.$router.push({
                        name: 'FunSettingForm',
                    });
                }
        },
      
        manageSupportSettings(){
            this.$router.push({
                name: 'Support',
            });
        },
        manageDriver(){
            this.$router.push({
                name: 'Driver',
                params: {
                    isForDriversSupervisor: true,
                },
            });
        },
        manageKeySettings(){
            const restaurantID = this.$store.state.user.RestaurantId
            if (restaurantID)
            {
                this.$router.push({
                    name: 'KeySettingForm',
                    params: {
                        "settingId": restaurantID,
                    }
                });
            }
            else{
                this.$router.push({
                    name: 'KeySettingForm',
                });
            }
        },
        getOnline(){         
            if(this.$store.state.backConfig)
                if(this.$store.state.backConfig.restaurant)
                    if(this.$store.state.backConfig.restaurant.Online){                        
                        return this.$store.state.backConfig.restaurant.Online
                    }
        }
}

}
</script>

<style>

.chip-support{
        height: 100px;
    width: 90%;
    border: 1px solid grey;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background: rgba(var(--ion-color-base-rgb),0.18) !important;
}

  .card-category{
      float: left;
      margin: 0;
      padding: 10px 2px;
    }

   .menu-col-6{
    flex: 0 0 calc(calc(6 / var(--ion-grid-columns, 12)) * 100%);
    width: calc(calc(6 / var(--ion-grid-columns, 12)) * 100%);
    max-width: calc(calc(6 / var(--ion-grid-columns, 12)) * 100%);
    padding: 0 5px;
    }
    .menu-col-12{
        flex: 0 0 calc(calc(12 / var(--ion-grid-columns, 12)) * 100%);
        width: calc(calc(12 / var(--ion-grid-columns, 12)) * 100%);
        max-width: calc(calc(12 / var(--ion-grid-columns, 12)) * 100%);
        padding: 0 5px;
    }

.tooltip {
  display: block !important;
  z-index: 10000;
}
 
.tooltip .tooltip-inner {
  background: #3880ff;
  color: white;
  border-radius: 10px;
  padding: 5px 10px 4px;
}
 
.tooltip .tooltip-arrow {
  width: 0;
  height: 0;
  border-style: solid;
  position: absolute;
  margin: 5px;
  border-color: #3880ff;
  z-index: 1;
}
 
.tooltip[x-placement^="top"] {
  margin-bottom: 5px;
}
 
.tooltip[x-placement^="top"] .tooltip-arrow {
  border-width: 5px 5px 0 5px;
  border-left-color: transparent !important;
  border-right-color: transparent !important;
  border-bottom-color: transparent !important;
  bottom: -5px;
  left: calc(50% - 5px);
  margin-top: 0;
  margin-bottom: 0;
}
 
.tooltip[x-placement^="bottom"] {
  margin-top: 5px;
}
 
.tooltip[x-placement^="bottom"] .tooltip-arrow {
  border-width: 0 5px 5px 5px;
  border-left-color: transparent !important;
  border-right-color: transparent !important;
  border-top-color: transparent !important;
  top: -5px;
  left: calc(50% - 5px);
  margin-top: 0;
  margin-bottom: 0;
}
 
.tooltip[x-placement^="right"] {
  margin-left: 5px;
}
 
.tooltip[x-placement^="right"] .tooltip-arrow {
  border-width: 5px 5px 5px 0;
  border-left-color: transparent !important;
  border-top-color: transparent !important;
  border-bottom-color: transparent !important;
  left: -5px;
  top: calc(50% - 5px);
  margin-left: 0;
  margin-right: 0;
}
 
.tooltip[x-placement^="left"] {
  margin-right: 5px;
}
 
.tooltip[x-placement^="left"] .tooltip-arrow {
  border-width: 5px 0 5px 5px;
  border-top-color: transparent !important;
  border-right-color: transparent !important;
  border-bottom-color: transparent !important;
  right: -5px;
  top: calc(50% - 5px);
  margin-left: 0;
  margin-right: 0;
}
 
.tooltip.popover .popover-inner {
  background: #f9f9f9;
  color: #3880ff;
  padding: 24px;
  border-radius: 5px;
  box-shadow: 0 5px 30px rgba(#3880ff, .1);
}
 
.tooltip.popover .popover-arrow {
  border-color: #f9f9f9;
}
 
.tooltip[aria-hidden='true'] {
  visibility: hidden;
  opacity: 0;
  transition: opacity .15s, visibility .15s;
}
 
.tooltip[aria-hidden='false'] {
  visibility: visible;
  opacity: 1;
  transition: opacity .15s;
}

  .grafic-imenu{
      display:  none;
  }

@media (min-width: 648px) {
  .grafic-imenu{
      display:  inline-flex;
  }
  
}

</style>