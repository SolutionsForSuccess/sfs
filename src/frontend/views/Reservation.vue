<template>
<div :key="keyForceUpdate"> 

     <ion-loading
          v-if="firstSpinner"
          showBackdrop="false"
          cssClass="my-custom-class"
          :message="$t('frontend.tooltips.loadRestaurant')"
        >
      </ion-loading>  
  
      
  <ion-toolbar >
       <ion-card-title style="text-align: left;padding: 10px;">
           {{$t('frontend.reservation.reservations')}}

      </ion-card-title>
      
    <ion-segment 
    
    id="reservationSegment" 
    @ionChange="segmentChanged($event.target.value)" :value="segmentValue" 
    @input="value=segmentValue">
      <ion-segment-button value="newReserv">
        <span class="iconify" data-icon="ant-design:plus-outlined" data-inline="false"></span>
         <!-- ADD -->
      </ion-segment-button>
       <!-- <ion-segment-button value="codeReserv"> -->
      <!-- <span class="iconify" data-icon="tabler:search" data-inline="false"></span> -->
      <!-- SEARCH -->
      <!-- </ion-segment-button>  -->
      <ion-segment-button value="listReserv" v-if="clientId !== ''">
      <span class="iconify" data-icon="ant-design:unordered-list-outlined" data-inline="false"></span>
      <!-- LIST -->
    </ion-segment-button>
    </ion-segment>
   
  </ion-toolbar>

  <div v-if="newReserv" style="    width: 80%; margin: 0 auto;">
      <hr>
        <ion-card-title>{{$t('frontend.reservation.create')}} 
          <ion-chip @click="toastInfoHorarios" style="background: transparent; padding: 0; margin: 0;">
            <span  class="iconify" data-icon="ph:info-light" data-inline="false" style="width: 20px;height: 20px;"></span>
          </ion-chip>
        </ion-card-title>

       
       
          <div>

            <div v-if="spinner" class="menu-col-12">
              <ion-progress-bar  color="primary" type="indeterminate" reversed="true"></ion-progress-bar>
            </div>


            <!-- <ion-label class="ion-text-wrap menu-col-12" v-if="clientId ===''">
              <p style="display: inline-block; text-align: center; font-style: italic;color: red;font-weight: 500;" color="danger" v-if="clientId ===''" class="ion-text-wrap menu-col-12">
                  <span class="iconify" data-icon="el:error-alt" data-inline="false" style="color: red; margin: 5px 0 0 15px; width: 18px;height: 18px;"></span>
                  {{$t('frontend.home.clientRequired')}}</p>
              </ion-label>  -->

            <ion-row  v-if="!spinner " :key="keyCreated+'KC'">

                 <ion-col  size="12" size-md="6">
                    <ion-item >
                      <ion-label >{{$t('frontend.orderType.name')}} <strong style="color: red">*</strong></ion-label>
                      <ion-input type="text" :value="CustomerName" @input="theName = $event.target.value" autocomplete="name"></ion-input>
                    </ion-item>
                 </ion-col>

                 <ion-col size="12" size-md="6">
                    <ion-item >
                      <ion-label >{{$t('frontend.orderType.email')}} <strong style="color: red">*</strong></ion-label>
                      <ion-input type="text" :value="email"  @input="theEmail = $event.target.value" @change="value=ValidateEmail()" autocomplete="email"></ion-input>
                    </ion-item>
                 </ion-col>

                 <ion-col size="12" size-md="6">
                    <ion-item >
                      <ion-label >{{$t('frontend.orderType.phone')}} <strong style="color: red">*</strong></ion-label>
                      <ion-input type="text" :value="phone"  @input="thePhone = $event.target.value" autocomplete="tel"></ion-input>
                    </ion-item> 
                 </ion-col>

                 <ion-col size="12" size-md="6">
                    <ion-item >
                      <ion-label >{{$t('frontend.reservation.reason')}}</ion-label>
                      <ion-input type="text"  @ionChange="reasonToReser=$event.target.value "></ion-input>
                   </ion-item>
                 </ion-col>

                 <ion-col size="12" size-md="6" v-if="!configuration.reservationByStaff">
                   <ion-item >
                      <ion-label >{{$t('frontend.reservation.peoples')}} <strong style="color: red">*</strong></ion-label>
                      <ion-input type="number" :value="guest" @ionChange="guest=$event.target.value "></ion-input>
                    </ion-item>
                 </ion-col>

                <ion-col size="12" size-md="6" v-if="!configuration.reservationByStaff">
                   <ion-item >
                      <ion-label >{{$t('frontend.reservation.timeToReserve')}}  (min) <strong style="color: red">*</strong></ion-label>
                      <ion-input type="number" :value="serviceTime"
                      @ionChange="serviceTime=$event.target.value,fetchTables()" ></ion-input>
                    </ion-item>
                 </ion-col>

                  <ion-col size="12" size-md="6">
                   <ion-item lines="none">
                      <ion-label >{{$t('frontend.reservation.reservationDate')}} <strong style="color: red">*</strong>
                      </ion-label>
                   </ion-item>
                   <ion-item>
                      <v-date-picker style="padding-bottom:5px"
                       v-model="dateToDay"
                       @dayclick='dayClicked'
                       :min-date="minDate"
                       :max-date="maxDate"
                       :show-day-popover=true
                       is-double-paned
                       show-caps />
                   </ion-item>
                  </ion-col> 

                 <!-- <ion-col size="12" size-md="6">
                   <ion-item >
                      <ion-label>{{$t('frontend.reservation.reservationDate')}} <strong style="color: red">*</strong>
                      <ion-datetime :value="dateToDay" max="2030" style="display: inline-flex"  
                        @ionChange="dateToReserv=$event.target.value,validateHour(),GetAllSheetHour()" :min="dateToDay.format('YYYY-MM-DD')" >    
                      </ion-datetime>
                    </ion-label>
                  </ion-item>
                 </ion-col> -->

                 <ion-col  size="12" size-md="6">
                    <ion-item lines="none">
                      <ion-label >{{$t('frontend.reservation.reservationHour')}} <strong style="color: red">*</strong></ion-label> 
                      <!-- <ion-datetime :value="hourToReserv" display-format="h:mm A" picker-format="h:mm A" 
                      @ionChange="hourToReserv=$event.target.value, validateHour()" :key="key" style="display: inline-flex"></ion-datetime> -->
                    </ion-item>
                    <ion-item >
                      <v-date-picker
                       @input="timeChanged"
                       v-model="time"
                       mode="time"/>
                    </ion-item>
                 </ion-col>
              
               
            </ion-row>  
               

            <div class="menu-col-12" style="float: left;" >

              <div v-if="spinnerTable" style="text-align: center;" >
                <ion-spinner ></ion-spinner>
              </div> 

              <div v-if="configuration.reservationByTable && !spinnerTable">
                Reservation By Table
                <div style="text-align: center;" >
                  <ion-label position="floating"><strong>
                    <ion-label color="success" v-if="totalSeats > 0"> {{totalSeats}} {{$t('frontend.reservation.seatsAvailable')}} </ion-label>
                    <ion-label color="danger" v-if="totalSeats === 0">{{$t('frontend.reservation.notAvailable')}} </ion-label>
                    </strong>
                    </ion-label>
                </div>
                <div  class="menu-col-12" style="float: left;" v-if="tablesChoose && totalSeats > 0">  
                    <div  style="text-align: center;" >
                          
                        <ion-label color="danger" v-if="totalSeats < guest && totalSeats > 0"><strong>{{$t('frontend.reservation.notGuestAvaibility')}}</strong></ion-label>             
                        <div v-else>
                          <ion-label color="danger" v-if="seatSelected < guest && !spinnerTable">{{$t('frontend.reservation.guestLocation')}}</ion-label> 
                        </div>
                      
                    </div>  
                    <div v-if="hourToReserv!=='' && dateToReserv!==''">                      

                          <div
                            v-for="(r, index ) in configuration.tableDesign" :key="index" 
                            class="menu-col-12" style="display: flex;position: relative;">                         
                          
                            <div v-for="(r1, index1 ) in r.length" :key="index1" 
                              :style="' display: flex; flex-direction: column; align-items: center;justify-content: center;width:'+100/r.length+'%;'" 
                              class="menu-grid">
                                <ion-card 
                                :color="findTable(configuration.tableDesign[index][index1].table).CanReserve === false? 'danger' : 'success'" 
                                :disabled="findTable(configuration.tableDesign[index][index1].table).CanReserve === false ? true: false"
                                  v-if="findTable(configuration.tableDesign[index][index1].table).Name"
                                  :class="findTable(configuration.tableDesign[index][index1].table).Shape==='Square'?'square':
                                  findTable(configuration.tableDesign[index][index1].table).Shape==='Circle'?'circle' :
                                  findTable(configuration.tableDesign[index][index1].table).Shape==='Rectangular'? 'rectangle':
                                  'oval'"                           
                                  :style="serviceLocation.includes(configuration.tableDesign[index][index1].table)?'display: flex;justify-content: center;align-items: center;align-content: center;flex-wrap: wrap;flex-direction: column;opacity:1':'display: flex;justify-content: center;align-items: center;align-content: center;flex-wrap: wrap;flex-direction: column;opacity:0.8'"
                                  @click="getIdTable(configuration.tableDesign[index][index1].table)"
                                > 

                                    
                                <div style="position: absolute">
                                    <div :style="serviceLocation.includes(configuration.tableDesign[index][index1].table)?'font-weight: 700;font-size: 18px;text-transform: uppercase;display: flex; align-items: center;':'font-weight: 700;font-size: 18px;text-transform: none;display: flex; align-items: center;'">
                                    {{findTable(configuration.tableDesign[index][index1].table).Name}}
                                    <ion-checkbox :checked="serviceLocation.includes(configuration.tableDesign[index][index1].table)?true: false" style="margin: 5px;"></ion-checkbox> 
                                  </div>

                                  <div style="display: flex; align-items: center;    justify-content: center;">                                                          
                                      {{findTable(configuration.tableDesign[index][index1].table).Seats.length}}
                                      <span class="iconify" data-icon="la:chair" data-inline="false" data-flip="horizontal"></span>
                                  </div>
                                </div>
                              

                                </ion-card>                             
                            </div>

                          </div>    

                    </div>                                      
                </div>
              </div>   

              <div v-if="configuration.reservationByStaff  && !spinnerTable" :key="keyStaff">
                Reservation By Staff 

                <div style="text-align: center;" v-if="staffAvailable.length > 0">
                  <ion-label position="floating"><strong>
                    <ion-label color="danger" v-if="staffSelected==='' && tablesChoose"> {{$t('frontend.reservation.selectStaff')}} </ion-label>
                    </strong>
                  </ion-label>
                </div>
                
                <div v-if="tablesChoose" style="display: flex;justify-content: center;">
                                          
                    <ion-card v-for="(staff, index) in staffAvailable" :key="index"
                      @click="staffSelected !==staff.staffID? staffSelected=staff.staffID: staffSelected='', staffObj=staff "
                      class="menu-col-3 staff-grid" color="secondary" 
                      :style="staff.staffID===staffSelected?'opacity:1':'opacity:0.8'"> 
                      
                      <ion-thumbnail slot="start">
                          <ion-img :src="staff.ImgUrl"></ion-img>
                      </ion-thumbnail>

                        <ion-label>{{staff.Name}}</ion-label>                      
                  </ion-card>
                </div>
                
              </div>  

            </div>      
            
              
            <ion-item class="menu-col-12" >
              <ion-label position="floating">{{$t('frontend.order.notes')}}</ion-label>
              <ion-textarea type="text"  @ionChange="noteToReserv=$event.target.value "></ion-textarea>
            </ion-item>

              
           
            
          
          </div>  

       

         <ion-card>

            <ion-item class="menu-col-12" >
              <p><strong>{{$t('frontend.reservation.deposit')}}: {{getFormatPrice(configuration.payForReservationQuotation)}}</strong></p>
            </ion-item>

            

                <ion-button color="danger" @click="cancelReservation()">{{$t('frontend.home.cancel')}}</ion-button>
                <ion-button color="primary" @click="confirmReservation()" v-if="configuration.reservationByTable"
                  :disabled="totalSeats < 1 || totalSeats < guest || (seatSelected < guest && tablesChoose)? true: false">                           
                  {{$t('frontend.home.confirm')}}
                  <ion-spinner v-if="spinnerPayment" name="lines-small"></ion-spinner>
                </ion-button>
                <ion-button color="primary" @click="confirmReservation()" v-if="configuration.reservationByStaff"
                  :disabled="staffSelected==='' && tablesChoose? true: false">                           
                  {{$t('frontend.home.confirm')}}
                  <ion-spinner v-if="spinnerPayment" name="lines-small"></ion-spinner>
                </ion-button>

                

         </ion-card>

       


  </div>
  
  <div v-if="codeReserv">
    <hr>
       <ion-card-title>{{$t('frontend.reservation.find')}}</ion-card-title>
      <ion-card>

      <div class="ion-text-wrap menu-col-12">
        <ion-searchbar 
        v-if="!spinner "
         inputmode="text"
         animated :placeholder="$t('frontend.reservation.enterCode')" 
         search-icon=false
         class="menu-col-10"
         style="float: left"
         @ionChange="theCode= $event.target.value"
         >        
        </ion-searchbar >

        <ion-button fill="outline"  style="float: left; margin: 10px 0;" @click="findByCode()"
        v-if="!spinner">
         <span class="iconify" data-icon="flat-ui:search" data-inline="false" style="margin: 0 -10px;"></span>
        </ion-button>
      </div>
          
      </ion-card>

      <ion-card>
          <div v-if="spinner" class="menu-col-12">
           <ion-progress-bar  color="primary" type="indeterminate" reversed="true"></ion-progress-bar>
          </div>

           <!-- <ion-label class="ion-text-wrap menu-col-12" v-if="clientId ===''">
            <p style="display: inline-block; text-align: center; font-style: italic;color: red;font-weight: 500;" color="danger" v-if="clientId ===''" class="ion-text-wrap menu-col-12">
                <span class="iconify" data-icon="el:error-alt" data-inline="false" style="color: red; margin: 5px 0 0 15px; width: 18px;height: 18px;"></span>
                {{$t('frontend.home.clientRequired')}}</p>
            </ion-label>  -->

          <div v-if="!spinner && reservationByCode.CustomerName "  class="menu-col-12">
              <ion-item>
                <p class="menu-col-4"><strong>{{$t('frontend.orderType.name')}} </strong></p>
                <ion-input readonly=true type="text">{{reservationByCode.CustomerName}}</ion-input>
              </ion-item>
              <ion-item>
                <p class="menu-col-4"><strong>{{$t('frontend.orderType.email')}} </strong></p>
                <ion-input readonly=true type="text">{{reservationByCode.CustomerEmail}}</ion-input>
              </ion-item>
              <ion-item>
                <p class="menu-col-4"><strong>{{$t('frontend.orderType.phone')}} </strong></p>
                <ion-input readonly=true type="text">{{reservationByCode.CustomerPhone}}</ion-input>
              </ion-item> 
              <ion-item>
                  <p class="menu-col-4"><strong>{{$t('frontend.reservation.reservationDate')}}</strong></p>
                  <ion-input readonly=true type="text">{{getReservationDate(reservationByCode.Date)}}</ion-input>
              </ion-item>
              <ion-item>
                <p class="menu-col-4"><strong> {{$t('frontend.reservation.reservationHour')}}</strong></p>
                <ion-input readonly=true type="text">{{getReservationHour(reservationByCode.Hour)}}</ion-input>         
              </ion-item>
              <ion-item>
                <p class="menu-col-4"><strong>{{$t('frontend.reservation.peoples')}} </strong></p>
                <ion-input readonly=true type="text">{{reservationByCode.Capacity}}</ion-input>
              </ion-item>
               <ion-item v-if="reservationByCode.QuotationPayment">
                <p class="menu-col-4"><strong>{{$t('frontend.order.quotationPayment')}} </strong></p>
                <ion-input readonly=true type="text"> $ {{reservationByCode.QuotationPayment.toFixed(2)}}</ion-input>
              </ion-item> 
              <ion-item
                :style="
                                reservationByCode.State===0 ? '--background: #edeb3038' // solicitada
                                :reservationByCode.State===1 || reservationByCode.State===2 ? '--background: #e8d21652' // aceptada o changedHour
                                :reservationByCode.State=== 3 || reservationByCode.State=== 5 ?'--background:#ff00001f' //cancelada
                                : reservationByCode.State===4 ? '--background:#1ee81652' // confirmada  
                                : reservationByCode.State===6 ? '--background: #71676738' // carrada
                                :'--background: '">
                <p class="menu-col-4"><strong>{{$t('frontend.home.state')}} </strong></p>
                <ion-input readonly=true type="text">{{allState[reservationByCode.State]}}</ion-input>
              </ion-item>   
               <ion-item v-if="reservationByCode.Note">
                <p class="menu-col-4"><strong>{{$t('frontend.order.notes')}} </strong></p>
                <ion-input readonly=true type="text">{{reservationByCode.Note}}</ion-input>
              </ion-item> 
               <ion-item v-if="reservationByCode.Reason">
                <p class="menu-col-4"><strong>{{$t('frontend.reservation.reason')}} </strong></p>
                <ion-input readonly=true type="text">{{reservationByCode.Reason}}</ion-input>
              </ion-item>          
          </div>

      </ion-card>
      
        
  </div>

  <div v-if="listReserv">

        <hr>
           <ion-card-title>
      {{$t('frontend.reservation.yoursReservations')}}
       <ion-button fill="outline" style="float: right; margin-right: 10px;" @click="segmentChanged('newReserv')" v-tooltip="$t('frontend.tooltips.addOrder')"> +  </ion-button>

        <ion-label class="ion-text-wrap"> 
        </ion-label>
         <ion-searchbar 
                @ionClear="handleInput('')"
                @input="$event.target.value?handleInput($event.target.value):handleInput('')"
                :placeholder="$t('frontend.home.search')">           
            </ion-searchbar>
      </ion-card-title>

      <ion-refresher 
        style="position: relative"
        slot="fixed"
        @ionRefresh="doRefresh($event)">
          <ion-refresher-content 
            refreshing-spinner="crescent"
          ></ion-refresher-content>
      </ion-refresher>
      

      <div v-if="spinner">
        <ion-spinner  name="lines" class="spinner"></ion-spinner>
      </div>

         <ion-label class="ion-text-wrap menu-col-12" v-if="clientId ===''">
            <p style="display: inline-block; text-align: center; font-style: italic;color: red;font-weight: 500;" color="danger" v-if="clientId ===''" class="ion-text-wrap menu-col-12">
                <span class="iconify" data-icon="el:error-alt" data-inline="false" style="color: red; margin: 5px 0 0 15px; width: 18px;height: 18px;"></span>
                {{$t('frontend.home.clientRequired')}}</p>
        </ion-label> 

        <div  v-if="!spinner">
          <ion-item-sliding>

            <ion-item >
                <ion-label class="ion-text-wrap menu-col-4 elipsis-menu"><h2 style="font-size: 16px;font-weight: bold;"> {{$t('frontend.reservation.completeDateReservacion')}} </h2> </ion-label>
                <ion-label class="ion-text-wrap menu-col-3 elipsis-menu"> <h3  style="font-size: 16px;font-weight: bold;">{{$t('frontend.reservation.peoples')}}</h3></ion-label>
                <ion-label class="ion-text-wrap menu-col-5 elipsis-menu"><h3  style="font-size: 16px;font-weight: bold;">{{$t('frontend.home.state')}}</h3></ion-label>
            </ion-item>

            

          </ion-item-sliding>

          <paginate
              ref="paginator"
              v-if="!spinner"
              name="allReservations"
              :list="reservationToFilter"
              :per="8"
            >
          <ion-item-sliding v-for="(reservation, index) in paginated('allReservations')" :key="index">
                 
            <ion-item
              @click="getReservationState(reservation, index)"
              style="width: 100%;"    
              :style="
               reservation.State===0 ? '--background: #edeb3038' // solicitada
               :reservation.State===1 || reservation.State===2 ? '--background: #e8d21652' // aceptada o changedHour
              :reservation.State=== 3 || reservation.State=== 5 ?'--background:#ff00001f' //cancelada
              : reservation.State===4 ? '--background:#1ee81652' // confirmada  
              : reservation.State===6 ? '--background: #71676738' // carrada
              :'--background: '">
                    
              <ion-label class="ion-text-wrap menu-col-4">
                  <h2>{{ getReservationDate(reservation.Date) }}</h2>               
                  <h2>{{ getReservationHour(reservation.Hour) }}</h2>               
              </ion-label>

              <ion-label  class="ion-text-wrap menu-col-3">
                  <h2 >{{ reservation.Capacity }}</h2>               
              </ion-label>

              <ion-label class="ion-text-wrap menu-col-5">
                  <h2 style="display: contents">{{allState[reservation.State] }}</h2> 
                 <span class="iconify" data-icon="mdi:backburger" style="color: grey;margin:0;width: 20px; height: 20px;float: right;" data-inline="false"></span>              
              </ion-label >

              

            </ion-item>

             <ion-item-options side="end">
                <ion-item-option color="primary" @click="sendReservationCustomer(reservation)" v-tooltip="$t('frontend.tooltips.forward')">
                     <span  class="iconify" data-icon="carbon:mail-all" data-inline="false"></span>
                     <ion-spinner v-if="spinnerEmail"></ion-spinner>
                </ion-item-option>  
                
                <ion-item-option color="primary" @click="sendPrint(reservation)" v-tooltip="$t('frontend.tooltips.printRes')">
                    <span class="iconify" data-icon="ic:round-local-printshop" data-inline="false" ></span>
                </ion-item-option>

            </ion-item-options>

          </ion-item-sliding>

          </paginate>

          <paginate-links for="allReservations" color="primary" 
           @change="onLangsPageChange()"  
           :async="true"
            :simple="{
              next:'»' ,
              prev: '« ' }"
          ></paginate-links>

        </div>


  
  


  </div>


</div>
</template>
<script>

import { Api } from '../../backoffice/api/api.js';
 import Moment from 'moment';
 import moment from 'moment-timezone';
  import { EventBus } from '../event-bus';
   import { Commons } from '../commons';
  import PaymentSplited from '../components/PaymentSplited';
import { setTimeout } from 'timers';
  // import { popoverController } from '@ionic/vue';
  // import VCalendar from './VCalendar.vue';

export default {
    name: 'Reservation',
     components: { },
     data () {
      return {
        selectedDate: null,
      themeStyles: {
        wrapper: {
          border: '1',
        },
        header: {
          color: '#fafafa',
          backgroundColor: '#f142f4',
          borderColor: '#404c59',
          borderWidth: '1px 1px 0 1px',
        },
        headerVerticalDivider: {
          borderLeft: '1px solid #404c59',
        },
        weekdays: {
          color: '#ffffff',
          backgroundColor: '#f142f4',
          borderColor: '#ff0098',
          borderWidth: '0 1px',
          padding: '5px 0 10px 0',
        },
        weekdaysVerticalDivider: {
          borderLeft: '1px solid #404c59',
        },
        weeks: {
          border: '1px solid #dadada',
        },
      },
        date: new Date(),
        time: new Date(),
        firstSpinner: false,
        spinnerEmail: false,
         newReserv: true,
         codeReserv: false,
         listReserv: false,
         spinner: false,
         paginate: ['allReservations'],
         theCode: '',
         reservationByCode: {},
         theName: this.CustomerName || '',
         theEmail: this.email || '',
         thePhone: this.phone || '',
         
         hourToReserv: '',
         guest: 2,
         serviceTime: 30,
         serviceLocation: [],
         noteToReserv: '',
         reasonToReser: '',
         allState: [this.$t('frontend.reservation.state0'), this.$t('frontend.reservation.state1'),
                    this.$t('frontend.reservation.state2'), this.$t('frontend.reservation.state3'),
                    this.$t('frontend.reservation.state4'), this.$t('frontend.reservation.state5'),
                    this.$t('frontend.reservation.state6')],
        segmentValue: 'newReserv',
        
        key: 0,
        reservationToFilter: [],
        cardNumber:'',
        cardCode: '',
        expirationCard:'',
        dateTodaymin: new Date().toISOString().substr(0, 7),
        dateTodaymax:  new Date().getFullYear(),
        currentPageReservation: 1,
         clientId: '',
        CustomerName: '', 
        email: '', 
        phone: '',  
        allReservations: [],
        configuration: {},
        restaurantActive: {},
        dateToDay: moment(),
        dateToReserv: this.dateToDay,
        filterTables: [],
        spinnerTable: false, 
        totalSeats : 0,
        spinnerPayment: false,
        googleData: {},
        restaurantSelectedId: '',
        reservation: {},
        keyCreated: 0,
        keyForceUpdate: 0,
        tablesChoose: false,
        seatSelected: 0,
        AllTables: [],
        AllSheetHours: [],
        staffAvailable: [],
        allStaff: [],
        staffSelected: '',
        staffObj: null,
        keyStaff: 0,
        selectedDay: null,
        maxDate: new Date().setFullYear(new Date().getFullYear()+10),
        minDate: new Date()
      }
     },     
     created: async function(){
       
      this.firstSpinner = true;  
      if(this.$store.state.customer._id){
        this.clientId= this.$store.state.customer._id;
      this.CustomerName= this.$store.state.customer.Name;
      this.email= this.$store.state.customer.EmailAddress;
      this.phone=this.$store.state.customer.Phone;
      this.marketingEmail=this.$store.state.customer.MarketingConsent.Email;
      this.marketingPhone=this.$store.state.customer.MarketingConsent.Phone; 
      }
      this.restaurantSelectedId = this.$store.state.restaurantActive.restaurantId || '';
      this.allReservations = this.$store.state.allReservations;
      this.configuration = this.$store.state.configuration; 
      this.restaurantActive = this.$store.state.restaurantActive ;
      this.allStaff = this.$store.state.allStaff;

      this.tablesChoose = this.configuration.tablesChoose;
      this.dateToDay = moment().add('days', this.configuration.minDayToReservation);
      this.dateToReserv = moment().add('days', this.configuration.minDayToReservation);

      for(var i=0; i< this.allReservations.length; i++) {
        this.allReservations[i].iState = this.allState[this.allReservations[i].State];
      }

      this.reservationToFilter = this.allReservations 
       
       if(this.$route.params.showAllReservation){
         this.segmentChanged('listReserv')
       } 
  
      

        EventBus.$on('updateAllReservationsInParent', (value) => { this.allReservations =  value});

        EventBus.$on('updateCustomerGuess', (value) => {
          value; 
          this.clientId= this.$store.state.guess._id || '';
          this.CustomerName= this.$store.state.guess.Name || '';
          this.email= this.$store.state.guess.EmailAddress || '';
          this.phone= this.$store.state.guess.Phone || '';   

          this.keyForceUpdate++; 
        });

         await this.GetAllTables();
         await this.GetAllSheetHour();
        
        this.firstSpinner = false;
        setTimeout(()=> {
          this.minDate = this.dateToDay.format('YYYY-MM-DD')
        }, 1000);
     },
    mounted: function(){
        if(this.$route.params.currentPageReservation > 1){
          this.currentPageReservation = this.$route.params.currentPageReservation; 
           this.$refs.paginator.goToPage(this.currentPageReservation);
       }
      },
     methods: { 

      dayClicked(day) {
        this.dateToReserv = day.id;
        this.validateHour();
        this.GetAllSheetHour();
      },

      timeChanged(datetime){
        this.hourToReserv = datetime;
        this.validateHour();
      },
       


    async doRefresh(event) {    
      await this.getReservations();      
      event.target.complete();
    },
       
      handleInput(value){
        this.reservationToFilter = this.allReservations
        const query = value.toLowerCase();
        requestAnimationFrame(() => {   
          let cat2 = this.allReservations.filter(item => item.Code.toLowerCase().indexOf(query) > -1 ||
                                            item.iState.toLowerCase().indexOf(query) > -1  )
          
          if(cat2.length> 0)
            this.reservationToFilter = cat2
          else
            this.reservationToFilter = this.allReservations 
        });
      },
         
      segmentChanged(value){            
             if(value === 'newReserv'){
                 this.newReserv = true;
                 this.codeReserv = false;
                 this.listReserv = false;
             }
             if(value === 'codeReserv'){
                 this.newReserv = false;
                 this.codeReserv = true;
                 this.listReserv = false;
             }  
              if(value === 'listReserv'){
                 this.newReserv = false;
                 this.codeReserv = false;
                 this.listReserv = true;                
             }
             this.segmentValue = value;

         },

      getReservations: async function(){
          if(this.clientId =='')
            return false;
           
            await Api.getCustomerReservations(this.clientId)
            .then(response => {
                this.$store.commit('setAllReservations', response.data)
                this.allReservations = response.data;  
                for(var i=0; i< this.allReservations.length; i++){
                  this.allReservations[i].iState = this.allState[this.allReservations[i].State];
                }
                this.reservationToFilter = this.allReservations 
            })
            .catch(e => {
                e;            
            })  
        },

      findByCode: async function(){
        if(this.theCode === '')
          return this.notCodeFind();
         this.spinner = true;
       
        try {
           const response =await Api.getReservationByCode(this.theCode);
           if(response.status === 200){
              this.reservationByCode = response.data  
              this.spinner = false;
           }
           else{
             this.spinner = false;
             return this.notCodeFind();
           }            
          
        } catch (error) {
           this.spinner = false 
                error;  
        }
            
      },

     

      getReservationDate(thisDate){
        return  moment.tz(thisDate, moment.tz.guess()).format('MM-DD-YYYY') 
      },

       getReservationHour(thisHour){
        return  moment.tz(thisHour, moment.tz.guess()).format('hh:mm A') 
      },

      getReservationState(reservation, index){
          return this.$router.push({ name: 'ReservationDetail', params: {reservation: reservation, currentPageReservation: this.currentPageReservation, tables: this.AllTables, indexPosition: index} })    
      },

     async sendReservationEmail(reservation){

            this.spinnerEmail = true;
            const html = Commons.htmlSendReservation(reservation);
            let subject = this.$t('frontend.reservation.create') ;            
                    
            var items = {
                "email": this.restaurantActive.restaurantEmail,
                "mess": html,
                "subject": subject
            }
            await Api.sendEmail(items);
            this.spinnerEmail = false;
      },

        async sendReservationCustomer(reservation){

            this.spinnerEmail = true;
            const html = Commons.htmlSendReservation(reservation);
            let subject = this.$t('frontend.reservation.create') ;            
                    
            var items = {
                "email": reservation.CustomerEmail,
                "mess": html,
                "subject": subject
            }
            await Api.sendEmail(items);
            this.spinnerEmail = false;
      },

      stringToMinutes(timeString){
        var hours = timeString.split(":")[0];
        var minutes = timeString.split(":")[1];
        return hours*60 + minutes;
      },

      async validateHour(){
        this.key ++;
        if(this.hourToReserv === '')
          return ''
        
        var hour = Moment(this.hourToReserv).toISOString();
        var day =  Moment(this.dateToReserv).toISOString();
        hour = moment.tz(hour,  moment.tz.guess()).format('HH:mm') ;
        day =  moment.tz(day,  moment.tz.guess()).format('dddd') ;


        const index = this.configuration.reservationDaysAndTime.findIndex(re=> re.Day === day);

        if(index !== -1){
          const openHour =  moment.tz(this.configuration.reservationDaysAndTime[index].OpenHour,  moment.tz.guess()).format('HH:mm') ; 
          const closeHour =  moment.tz(this.configuration.reservationDaysAndTime[index].CloseHour,  moment.tz.guess()).format('HH:mm') ; 

          if( this.stringToMinutes(hour) < this.stringToMinutes(openHour)
           || this.stringToMinutes(hour) > this.stringToMinutes(closeHour)){
            this.hourToReserv = '';       

            const mess = this.$t('frontend.reservation.errorHour')+ day + 
            this.$t('frontend.reservation.errorHour2') +
            this.getReservationHour(this.configuration.reservationDaysAndTime[index].OpenHour) + ' - '+ this.getReservationHour(this.configuration.reservationDaysAndTime[index].CloseHour);
            this.totalSeats = 0;
            this.serviceLocation = [];
            this.staffAvailable = [];
            this.staffSelected = '';
            this.staffObj = null;
            return this.alertNotGoodHour(mess);
           
          } 

          if(this.configuration.reservationByTable)
            await this.fetchTables();
          else await this.fetchStaff();
        }
      },

      ValidateEmail(){
        let emailRegex = /^[-\w.%+]{1,64}@(?:[A-Z0-9-]{1,63}\.){1,125}[A-Z]{2,63}$/i;
            if (emailRegex.test(this.theEmail) == false){
              this.theEmail =''
              return  this.$ionic.alertController
              .create({
                  cssClass: 'my-custom-class',
                  header: '',
                  message: this.$t('frontend.home.notValidEmail') , 
                  buttons: [                   
                  {
                    text: this.buttonAcept,
                    handler: () => {                                 
                                  
                    },
                  },
                  ],
              })
              .then(a => a.present())
            }
      },

      validateCard(event){
        var valid = require("card-validator");
 
        var numberValidation = valid.number(event);
 
        if (!numberValidation.isValid) {
            this.cardNumber = ""
            return  this.$ionic.alertController
                .create({
                    cssClass: 'my-custom-class',
                    header: '',
                    message: this.$t('frontend.order.notValidCC'),
                    buttons: [                   
                    {
                        text: this.$t('frontend.home.acept'),
                        handler: () => {                                 
                                        
                        },
                    },
                    ],
                })
                .then(a => a.present())
                    }
 
        else {
         this.cardNumber = event;
        }   
        
    },

      alertRequiredDatas(mss){
        return  this.$ionic.alertController
        .create({
            cssClass: 'my-custom-class',
            header: '',
            message: this.$t('frontend.home.errorRequired') + ': ' + mss,
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

      alertNotGoodHour(message){
        return  this.$ionic.alertController
        .create({
            cssClass: 'my-custom-class',
            header: '',
            message: message,
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

      async openToast() {
        return this.$ionic.toastController
        
          .create({
            message: this.$t('frontend.product.massageToast'),
            duration: 500,
            position: 'middle',
            color:'success'
          })
        .then(a => a.present())
      },

      async notCodeFind() {
        return this.$ionic.toastController
        
          .create({
            message: this.$t('frontend.reservation.notcodefind'),
            duration: 700,
            position: 'middle',
            color:'danger'
          })
        .then(a => a.present())
      },

      sendPrint:  function(reservation){

            const html = Commons.htmlSendReservation(reservation);

            var winimp = window.open('/print', 'popimpr');         
            winimp.document.write( html );
            winimp.document.close();
            winimp.focus();
            winimp.print();
            winimp.close();

           

          
           
      },
    

      async toastInfoHorarios() {

        let html = '';
        for (const iterator of this.configuration.reservationDaysAndTime) {
          html += '<ion-item>';
          html += `<p>${iterator.Day}:   </p>`
          html += `<p>${this.getReservationHour(iterator.OpenHour)}   -   </p>`
          html += `<p>${this.getReservationHour(iterator.CloseHour)}</p>`
          html += '</ion-item>';
          
        }
        return this.$ionic.toastController
          .create({
            header: 'Hora de reservaciones semanales',
            message: html,
            position: 'middle',
            buttons: [
              {
                side: 'start',
                icon: 'close',
                role: 'cancel',
                handler: () => {
                }
              }
            ]
          })
        .then(a => a.present())
      },

      async errorPaymentDetail(msg) {
        return this.$ionic.toastController      
        .create({
            header:'Error',
            message:  msg,
            duration: 5000,
            position: 'middle',
            color:'danger'
            })
      .then(a => a.present())
    },

     onLangsPageChange () {          
        this.currentPageReservation = this.$refs.paginator.currentPage + 1;        
       },

    fetchTables: async function(){

     try {
        if(this.serviceTime < 1 || this.hourToReserv === '' || this.dateToReserv === '' || this.guest < 1) return

     this.spinnerTable = true;
     this.serviceLocation = [];
     const response = await Api.fetchAll('Table')
     this.spinnerTable = false;
     this.totalSeats = 0;
      // dateToReserv, hourToReserv

      const day = moment(this.dateToReserv).format('MM-DD-YYYY');
      const hour = moment(this.hourToReserv).format('HH:mm');
      const hourOut = moment(this.hourToReserv).add(parseInt(this.serviceTime), 'minutes').format('HH:mm');
      const tableAvailables = response.data;
      for (const table of tableAvailables) {
        let isBussy = false;
        if(table.Reservations){
          for (const res of table.Reservations) {             
            if(res.Day === day &&  ( (hour >= res.HourIn && hour <= res.HourOut) || (hourOut >= res.HourIn && hourOut <= res.HourOut) ) ){
              table.CanReserve = false; 
              isBussy = true;
              break;
            } 
          }
        }
        if(!isBussy){
          table.CanReserve = true;
          this.totalSeats += table.Seats.length;
        }  
         
      }
     this.filterTables = tableAvailables;   
       
     } catch (error) {
       error;
        this.spinnerTable = false;
     }

     },

    findTable(id){
      const index = this.filterTables.findIndex( t => t._id === id)
    
      if(index !== -1)
        return this.filterTables[index];
      return {};
    },

     getIdTable(value){
     
      if(this.serviceLocation.includes(value)){
        const index = this.serviceLocation.findIndex(p => p == value);
        if(index !== -1){
            this.seatSelected -= this.findTable(value).Seats.length;
            this.serviceLocation.splice(index, 1); 
            } 
      }
      else{
        this.seatSelected += this.findTable(value).Seats.length;
        this.serviceLocation.push(value)
      } 

    },

    async addBussyTime(value){ 

      const busy = {
        ReservationId: value.reservationId,
        Day:value.day,
        HourIn: value.hourIn,
        HourOut: value.hourOut,
        State: 0,            
      }

      if(value.modelName ==='Table'){ 
       for (const tId of value.modelId) {
          const table = await this.findTable(tId);
          if(table._id){
            if(table.Reservations) table.Reservations.push(busy)
            else {
              table.Reservations = [];
              table.Reservations.push(busy)
            }
            delete table.CanReserve;
            await Api.putIn(value.modelName, table);
          }         
       }
      }
      else{
        if(this.staffObj !== null){

          this.AllSheetHours[this.staffObj.indexSheet].StaffHour[this.staffObj.indexstaffHour].DaysArray[this.staffObj.indexDay].busy.push(busy)
          await Api.putIn('sheethour', this.AllSheetHours[this.staffObj.indexSheet]);
          this.staffObj = null
        }
     
        
      }

    },

    getFormatPrice(price){
      let result = price
      if(this.currency !== '')
      result = new Intl.NumberFormat('en', {style: "currency", currency: this.restaurantActive.currency} ).format(price);
      return result;
    },

     async cancelReservation(){
        return this.$router.push({ name: 'AboutFront', params: {url: this.restaurantActive.restaurantUrl} }).catch(()=>{})
    },

    async AsignServiceLocation(){
        await this.fetchTables();

        const tableService = [];
        let count = 0;


        for (const table of this.filterTables) {
          if(table.CanReserve){
            count += table.Seats.length;
            tableService.push(table._id);
            if(count >= this.guest){
               this.serviceLocation = [...tableService];
               break;
            }
          }          
        }
        return;
    },

    async confirmReservation(){

      if(this.configuration.reservationByTable && this.seatSelected === 0 && !this.tablesChoose){
        await this.AsignServiceLocation();
      }

        if(this.clientId !=''){
          this.theName= this.CustomerName;
         this.theEmail= this.email;
         this.thePhone = this.phone ;
          if(this.dateToReserv === '' || this.hourToReserv=== '' || this.guest < 1 || this.serviceTime < 1){
            let mss = '';
            if(this.dateToReserv === '') mss +='<br><strong>'+ this.$t('frontend.reservation.reservationDate')+'</strong>';
            if(this.hourToReserv === '') mss +='<br><strong>'+ this.$t('frontend.reservation.reservationHour')+'</strong>';
            if(this.guest < 1) mss +='<br><strong>'+ this.$t('frontend.reservation.peoples') +' > 1'+'</strong>';
            if(this.serviceTime < 1) mss +='<br> <strong>'+ this.$t('frontend.reservation.timeToReserve') +' > 1min'+'</strong>';
             return this.alertRequiredDatas(mss);
          }          
        }
        else{
            
          if(this.theName ===''  || this.theEmail ==='' || this.thePhone ==='' ||
            this.dateToReserv === '' || this.hourToReserv === '' || this.guest < 1 || this.serviceTime < 1){
              var mss1 = '';
              if(this.theName === '') mss1 += '<br><strong>' + this.$t('frontend.orderType.name')+'</strong>';
              if(this.theEmail === '') mss1 += '<br><strong>' + this.$t('frontend.orderType.email')+'</strong>';
              if(this.thePhone === '') mss1 += '<br><strong>' + this.$t('frontend.orderType.phone')+'</strong>';
              if(this.dateToReserv === '') mss1 += '<br><strong>' + this.$t('frontend.reservation.reservationDate')+'</strong>';
              if(this.hourToReserv === '') mss1 +='<br><strong>'+ this.$t('frontend.reservation.reservationHour')+'</strong>';
              if(this.guest < 1) mss1 +='<br><strong>'+ this.$t('frontend.reservation.peoples')+ ' > 1'+'</strong>';
              if(this.serviceTime < 1) mss1 +='<br><strong>'+ this.$t('frontend.reservation.timeToReserve') +' > 1min'+'</strong>';
              return this.alertRequiredDatas(mss1);
            }
           
        }          

        this.reservation = {
        "CustomerId" : this.clientId,
        "CustomerName": this.theName,
        "CustomerEmail": this.theEmail,
        "CustomerPhone":  this.thePhone,
        "Capacity":  this.guest,
        "ServiceTime": this.serviceTime,     
        "ServiceLocation": [],
        "ServiceModel": '',  
        "Date": Moment(this.dateToReserv).toISOString(),
        "Hour": Moment(this.hourToReserv).toISOString(),
        "Note": this.noteToReserv,
        "Reason": this.reasonToReser,
        "State": 0
        }


        if(this.restaurantActive.RestaurantBussines){
           this.reservation.ServiceLocation = this.serviceLocation;
           this.reservation.ServiceModel = 'Table';
        }
        else if(this.restaurantActive.ServiceBussines && this.tablesChoose && this.staffSelected!==''){
           this.reservation.ServiceLocation = [this.staffSelected];
           this.reservation.ServiceModel = 'Staff';
        }

        if(this.configuration.hasReservationQuotation && this.configuration.payForReservationQuotation > 0 ){
            this.spinnerPayment = true;
            await this.getWalletInformation();
            this.spinnerPayment = false;
            return this.openPayment();
        }
        else{
            alert('The restaurant has not yet defined a reservation feet')
            return;
        }
       
        
    },

    async getWalletInformation(){
      const  newT =  parseInt( this.configuration.payForReservationQuotation.toFixed(2).replace('.', ''));
      const basket = {"invoice": 666, "total": newT };       
      
     
      const ipClient = await Api.getClientIp();
      const res = await Api.walletInformation(basket, this.restaurantSelectedId, ipClient.data.ip); 
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
                    Total: this.configuration.payForReservationQuotation.toFixed(2),
                    Taxe: "1.00",
                    Tip: 0,
                    SubTotal: this.configuration.payForReservationQuotation.toFixed(2),
                    Products: []
                }, 
                Total: this.configuration.payForReservationQuotation.toFixed(2),
                Tax:  "1.00",
                TaxName: '',     
                restaurantId: this.restaurantSelectedId,
                payMethod: this.restaurantActive.payMethod  ,   
                currency: this.restaurantActive.currency,
                returnTo: 'ReservationState',   
                googleData: this.googleData,
                staffName: this.$store.state.staffName || '',
                deviceTransactionType: '01',
                deviceData: {
                    'amountInformation': {
                            'TransactionAmount': this.configuration.payForReservationQuotation.toFixed(2),
                            'TipAmount': 0,
                            'TaxAmount': "1.00",
                        },
                        'accountInformation':{
                            'FirstName': this.reservation.CustomerName
                        },
                        'traceInformation':{
                            'TransactionNumber': ''
                        }
                },   
                customerName: this.reservation.CustomerName,
                restaurantName: this.restaurantActive.restaurantName,
          },
            },
        })
        .then(m => m.present())
    
    },

    async makeSplitPayment(res){  

      try {
          this.spinner = true;

          this.reservation.QuotationPayment = this.configuration.payForReservationQuotation; 
          this.reservation.State = 4;    
          this.reservation.Payment= {
            TransId : res.transId, 
            Total: this.configuration.payForReservationQuotation,           
            Method : res.method + ' '+ res.accountType+ ' '+ res.accountNumber,           
            AccountNumber : res.accountNumber,  
            ExpirationCard : res.expirationCard 
          }   
          const response = await Api.postIn('Reservation', this.reservation);
          if(response.status === 200 && response.statusText === "OK"){             
             
            this.openToast(); 
            this.sendReservationEmail(this.reservation); 
            this.sendReservationCustomer(this.reservation);
            const busyObj = {
                reservationId: response.data._id,
                day: moment(this.dateToReserv).format('MM-DD-YYYY'),
                hourIn: moment(this.hourToReserv).format('HH:mm'),
                hourOut: moment(this.hourToReserv).add(parseInt(this.serviceTime), 'minutes').format('HH:mm'), 
                modelName: this.reservation.ServiceModel,
                modelId: this.reservation.ServiceLocation
            }      
            this.addBussyTime(busyObj); 

            this.dateToReserv = this.dateToDay;
            this.hourToReserv = '' ; this.guest = 1; this.serviceTime = 1; this.serviceLocation = [];
            this.noteToReserv = ''; this.reasonToReser = ''; this.totalSeats = 0; this.staffSelected ='', this.staffObj = null;
            this.staffAvailable =[];
            this.keyCreated ++

            if(this.clientId !== ''){
              await this.getReservations();
              this.segmentChanged('listReserv'); 
            }
            else this.sendPrint(this.reservation);
              
            this.spinner = false;
              
            if(res.method === 'Credit')
                Commons.updateCustomerCredit(parseFloat(res.total), 'Reservation', response.data._id); 
            else if(res.method === 'HouseAccount'){
              const houseAccount = { 
                  "ServerName": this.$store.state.staffName, 
                  "CustomerName": this.theName,                 
                  "Amount": res.total,    
                  "Model": "Reservation",
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
                  "ModelFrom": "Reservation",
                  "StaffName": this.$store.state.staffName,               
                  }
              await Api.postIn('allpayments', paymentEntry);
            }             
            return 
          }
          
      } catch (error) {            
         error;
          this.spinner = false;
      }
  
    },

    async GetAllTables(){
      try {
        const response = await Api.fetchAll('Table')
        if(response.status === 200) this.AllTables = response.data;
        
      } catch (error) {
        error
      }
    },

    async GetAllSheetHour(){
      if(this.dateToReserv === '') return;
      const date = moment(this.dateToReserv).format('YYYY-MM-DD');
      try {
        this.spinnerTable = true;
        const response = await Api.thisDateSheetHour(date)
        if(response.status === 200) this.AllSheetHours = response.data;
        this.spinnerTable = false;
        
      } catch (error) {
        error;
        this.spinnerTable = false;
      }
    },

    fetchStaff: async function(){

    
     if(this.serviceTime < 1 || this.hourToReserv === '' || this.dateToReserv === '' || this.guest < 1) return

     this.spinnerTable = true;
     this.staffAvailable = [];
     this.staffSelected = '';
     this.staffObj = null;
     const SheetHours = this.AllSheetHours;
    

    const day = moment(this.dateToReserv).format('MM-DD-YYYY');
    const hour = moment(this.hourToReserv).format('HH:mm');
    const hourOut = moment(this.hourToReserv).add(parseInt(this.serviceTime), 'minutes').format('HH:mm');
    for (const [indexSheet, sheet] of SheetHours.entries()) {
      if(sheet.State === 1){
      for (const [indexstaffHour, staffHour] of sheet.StaffHour.entries()) {          
        for (const [indexDay, date] of staffHour.DaysArray.entries()) {
          const resHourIn = moment(date.hourIn).format('HH:mm');
          const resHourOut = moment(date.hourOut).format('HH:mm');
          if(day === moment(date.day).format('MM-DD-YYYY') &&
            ( (hour >= resHourIn && hour <= resHourOut) &&
            (hourOut >= resHourIn && hourOut <= resHourOut) ) ){
            
            var staffCanReserve = true;

            for (const res of date.busy) {             
              if(res.Day === day &&  ( (hour >= res.HourIn && hour <= res.HourOut) || (hourOut >= res.HourIn && hourOut <= res.HourOut) ) ){
                staffCanReserve = false; 
                break;
              } 
            }

            if(staffCanReserve){
              const SatffObj = this.getStaff(staffHour.IdStaff); 
              this.staffAvailable.push({            
              'staffID': staffHour.IdStaff,
              'Name': SatffObj.FirstName + ' '+ SatffObj.LastName,
              'ImgUrl': SatffObj.ImageUrl,
              'staffCanReserve': staffCanReserve,
              'indexSheet': indexSheet,
              'indexstaffHour': indexstaffHour,
              'indexDay': indexDay,
              });

             

            }
          }            
        }
      }
      }


       this.spinnerTable = false;
       this.keyStaff ++;
    
      
    } 

    },

    getStaff(id){
      const index = this.allStaff.findIndex( s=> s._id === id)
      if(index !== -1)
       return this.allStaff[index];
      else return {};
    },

  }
  
}

</script>

<style>
   
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
  .elipsis-menu{
        text-overflow: ellipsis !important;
    overflow: hidden !important;
    display: -webkit-box !important;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
  }

.content {
  position: absolute;
  width: 100%;
  height: 100%;
}  
.square {
  /* width: inherit; */
  opacity: 0.8;
  max-height: 200px;
    max-width: 200px;
  width: 100%;
}

.square:after {
  content: "";
  display: block;
  padding-bottom: 100%;
}
.square:hover{
 opacity: 0.9;
}

.circle{
   width: 100%;
     opacity: 0.8;
   /* width: inherit; */
   max-height: 200px;
    max-width: 200px;
  border-radius: 50%;
}
.circle:after {
  content: "";
  display: block;
  padding-bottom: 100%;
}
.circle:hover{
    opacity: 0.9;
}
.rectangle{
    width: 100%; 
      opacity: 0.8;
    /* width: inherit; */
    max-height: 200px;
    max-width: 200px;
}
.rectangle:after {
  content: "";
  display: block;
  padding-bottom: 60%;
}
.rectangle:hover{
    opacity: 0.9;
}
.oval{
  /* width: inherit; */
  max-height: 200px;
    opacity: 0.8;
    max-width: 200px;
    width: 100%; 
    border-radius: 50%;
}
.oval:after {
  content: "";
  display: block;
  padding-bottom: 60%;
}
.oval:hover{
    opacity: 0.9;
}

.menu-grid{
  float: left;
  height: 220px;
  border: none;
  padding: 5px;
}
.staff-grid{
  float: left;
  height: 120px;
  border: none;
  padding: 5px;
  opacity: 0.7;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
}
.staff-grid:hover{
  opacity: 0.9
}
.menu-col-1{
    flex: 0 0 calc(calc(1 / var(--ion-grid-columns, 12)) * 100%);
    width: calc(calc(1 / var(--ion-grid-columns, 12)) * 100%);
    max-width: calc(calc(1 / var(--ion-grid-columns, 12)) * 100%);
    text-align: left;
}
.menu-col-2{
    flex: 0 0 calc(calc(2 / var(--ion-grid-columns, 12)) * 100%);
    width: calc(calc(2 / var(--ion-grid-columns, 12)) * 100%);
    max-width: calc(calc(2 / var(--ion-grid-columns, 12)) * 100%);
    text-align: left;
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
}
.menu-col-5{
    flex: 0 0 calc(calc(5 / var(--ion-grid-columns, 12)) * 100%);
    width: calc(calc(5 / var(--ion-grid-columns, 12)) * 100%);
    max-width: calc(calc(5 / var(--ion-grid-columns, 12)) * 100%);
    text-align: left;
}
.menu-col-6{
    flex: 0 0 calc(calc(6 / var(--ion-grid-columns, 12)) * 100%);
    width: calc(calc(6 / var(--ion-grid-columns, 12)) * 100%);
    max-width: calc(calc(6 / var(--ion-grid-columns, 12)) * 100%);
    text-align: left;
}
.menu-col-7{
    flex: 0 0 calc(calc(7 / var(--ion-grid-columns, 12)) * 100%);
    width: calc(calc(7 / var(--ion-grid-columns, 12)) * 100%);
    max-width: calc(calc(7 / var(--ion-grid-columns, 12)) * 100%);
    text-align: left;
}
.menu-col-8{
    flex: 0 0 calc(calc(8 / var(--ion-grid-columns, 12)) * 100%);
    width: calc(calc(8 / var(--ion-grid-columns, 12)) * 100%);
    max-width: calc(calc(8 / var(--ion-grid-columns, 12)) * 100%);
    text-align: left;
}
.menu-col-9{
    flex: 0 0 calc(calc(9 / var(--ion-grid-columns, 12)) * 100%);
    width: calc(calc(9 / var(--ion-grid-columns, 12)) * 100%);
    max-width: calc(calc(9 / var(--ion-grid-columns, 12)) * 100%);
    text-align: left;
}
.menu-col-10{
    flex: 0 0 calc(calc(10 / var(--ion-grid-columns, 12)) * 100%);
    width: calc(calc(10 / var(--ion-grid-columns, 12)) * 100%);
    max-width: calc(calc(10 / var(--ion-grid-columns, 12)) * 100%);
    text-align: left;
}
.menu-col-11{
    flex: 0 0 calc(calc(11 / var(--ion-grid-columns, 12)) * 100%);
    width: calc(calc(11 / var(--ion-grid-columns, 12)) * 100%);
    max-width: calc(calc(11 / var(--ion-grid-columns, 12)) * 100%);
    text-align: left;
}
.menu-col-12{
    flex: 0 0 calc(calc(12 / var(--ion-grid-columns, 12)) * 100%);
    width: calc(calc(12 / var(--ion-grid-columns, 12)) * 100%);
    max-width: calc(calc(12 / var(--ion-grid-columns, 12)) * 100%);
    text-align: left;
}
.card-categories{
  visibility: visible;
}
    
</style>