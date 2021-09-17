<template>
<div class="screen">
  
    
    <ion-toolbar>      
    <ion-segment id="reservationSegment" @ionChange="segmentChanged($event.target.value)" :value="segmentValue" @input="value=segmentValue">
     
      <ion-segment-button value="heart">
        <div style="display: flex;flex-direction: column;align-items: center;">
            <span class="iconify" data-icon="ant-design:unordered-list-outlined" data-inline="false"></span>
            <ion-text style="    font-size: 10px;">
                {{$t('backoffice.options.manageReservation')}}
            </ion-text>
        </div>
      </ion-segment-button>
      <ion-segment-button value="waitlist">
        <div style="display: flex;flex-direction: column;align-items: center;">
            <span class="iconify" data-icon="mdi:playlist-plus" data-inline="false"></span>
            <ion-text style="    font-size: 10px;">
                {{$t('backoffice.options.manageWaitList')}}
            </ion-text>
        </div>
      </ion-segment-button>

    </ion-segment>   
  </ion-toolbar>
  



  

  <div v-if="heart">
    <div id="user" class="page">
      <listView
        :title="$t('backoffice.options.manageReservation')"
        :filter="allReservations"
        :elements="reservations"
        :add="hasPermission('canCreateReservation')"
        :edit="hasPermission('canEditReservation')"
        :remove="false"
        :viewSelected="'Sale'"
        @handleInput="handleInput"
        @handleAddClick="addReservation"   
        @editElement="getReservationState"
        @deleteElement="getReservationState"   
      ></listView>
    </div>
  </div>

  <div v-if="waitlist" class="page">

         <ion-loading
        v-if="spinner"
        cssClass="my-custom-class"
        :message="$t('frontend.tooltips.loadRestaurant')"
      ></ion-loading>

        <div @click="goControlView()">
            <div class="back-btn">
                <ion-icon name="ios-arrow-back" color="#9D9D9D"></ion-icon>
                <!-- <span>{{ $t("backoffice.form.buttons.back") }}</span> -->
                <h1> Wait List</h1> 
                <ion-chip @click.stop="toastInfoHorarios" style="background: transparent; padding: 0; margin: 0;">
                  <span  class="iconify" data-icon="ph:info-light" data-inline="false" style="width: 20px;height: 20px;"></span>
                </ion-chip>
            </div>
        </div>
      

        <ion-card >

          <ion-row>

            <ion-col size="12" size-md="6">
                <ion-item>
                <ion-label position="floating">{{$t('frontend.orderType.name')}} <strong style="color: red">*</strong></ion-label>
                <ion-input type="text" 
                :value="waitName" 
                autocomplete="Name"
                @input="waitName = $event.target.value"></ion-input>
              </ion-item>
             <ion-item>
                <ion-label position="floating">{{$t('frontend.reservation.peoples')}} <strong style="color: red">*</strong></ion-label>
                <ion-input type="number" autocomplete="0" :value="waitPeople" @ionChange="waitPeople=$event.target.value "></ion-input>
              </ion-item>
             

            </ion-col>

            <ion-col size="12" size-md="6">
               <ion-item>
                <ion-label position="floating">{{$t('frontend.orderType.phone')}} <strong style="color: red">*</strong></ion-label>
                <ion-input type="number" 
                :value="waitPhone" 
                 autocomplete="phone"
                @input="waitPhone = $event.target.value" ></ion-input>
              </ion-item>
                <ion-item>
                <ion-label position="floating">{{$t('frontend.orderType.email')}} <strong style="color: red">*</strong></ion-label>
                <ion-input type="text" :value="waitEmail"  autocomplete="email"  @input="waitEmail = $event.target.value" ></ion-input>
              </ion-item>
            </ion-col>

          </ion-row>
        
          <ion-button @click="saveWaitList()" v-if="!spinner" :disabled="!isValidWaitList()">{{ this.$t('frontend.home.acept') }}</ion-button>           
        </ion-card>

        <div >

          <div style="width: 100%">
              <ion-segment scrollable color="tertiary" @ionChange="changeWaitlistFilter($event.target.value)" :value="filterWaitList">
                  <ion-segment-button value="todaywaitlist">
                        Today<!-- {{$t('frontend.reservation.all')}} -->
                  </ion-segment-button>
                  <ion-segment-button value="activewaitlist">
                        Active<!-- {{$t('frontend.reservation.state0')}} -->
                  </ion-segment-button>
                  <ion-segment-button value="allwaitlist">
                        All<!-- {{$t('frontend.reservation.state1')}} -->
                  </ion-segment-button>
              </ion-segment>
          </div>

    
          <paginate name="allWaitList" :list="allWaitList" :per="5">
            <ion-list class="content-list" >
              <ion-item
                v-for="option in paginated('allWaitList')"
                v-bind:key="option._id"               
                >
                <ion-label> 
                  <h2>{{ option.CustomerName }} ({{option.Capacity}})</h2>
                  <h3>
                    {{option.CustomerEmail}} <br>
                  {{ option.CustomerPhone}}
                  </h3>                 
                </ion-label>

                <ion-button
                  fill="clear"
                  shape="round"
                  class="list-gourp-btn"
                  side="end"   
                  v-tooltip="'Acept'"
                  v-if="hasPermission('canEditReservation') && option.State !== 'Done'"       
                  @click="acceptWaitListItem(option)"            
                >
                  <span class="iconify" data-icon="ic:baseline-check" data-inline="false"></span>
                </ion-button>
              
                <ion-button
                  fill="clear"
                  shape="round"
                  class="list-gourp-btn"
                  side="end"  
                    v-tooltip="'Resend Email'" 
                  v-if="hasPermission('canEditReservation')"       
                  @click="sendMessageWaitList(option)"            
                >
                    <span class="iconify" data-icon="mdi:email-send" data-inline="false"></span>
                </ion-button>
            
                <ion-button
                  fill="clear"
                  shape="round"
                  class="list-gourp-btn"
                  side="end"   
                    v-tooltip="'Remove'"
                  v-if="hasPermission('canEditReservation')"       
                  @click="deleteFromWaitList(option._id)"            
                >
                  <ion-icon
                    slot="icon-only"
                    icon="md-trash"
                    class="more-grid"                   
                  ></ion-icon>
                </ion-button>
                
              </ion-item>
            </ion-list>
          </paginate>
       
        </div>

  </div>


</div>
</template>
<script>

import { Api } from '../../backoffice/api/api.js';
 import Moment from 'moment'
 import moment from 'moment-timezone';
import listView from "../components/ListView";

export default {
    name: 'Reservation',
     props: {   
      clientId: {type: String, default: "" } ,
      CustomerName: {type: String, default: "" } , 
      email: {type: String, default: "" }, 
      phone: {type: String, default: "" },     
  },
   components:{   
    listView,
  }, 
     data () {
      return {
         screenWidth: 0,
         heart: true,
         waitlist: false,
         spinner: false,
         allReservations: [],        
         paginate: ['allReservations', 'allWaitList'],
         reservations: [],
         theCode: '',
         reservationByCode: {},
         theName:  '', //  theName: this.CustomerName || '',
         theEmail: '', //  theEmail: this.email || '',
         thePhone: '', //  thePhone: this.phone || '',
         dateToReserv: '',
         hourToReserv: '',
         guest: 1,
         noteToReserv: '',
         reasonToReser: '',
         allState: [this.$t('frontend.reservation.state0'), this.$t('frontend.reservation.state1'),
                    this.$t('frontend.reservation.state2'), this.$t('frontend.reservation.state3'),
                    this.$t('frontend.reservation.state4'), this.$t('frontend.reservation.state5'),
                    this.$t('frontend.reservation.state6')],
        segmentValue: 'heart',
        filterStatus: 'all',
        dateToDay: '',
        restaurantConfig: null,

        //Wait List
        waitlistL: [],
        allWaitList: [],
        waitName: '',
        waitEmail: '',
        waitPhone: '',
        waitPeople: 1,
        filterWaitList: 'todaywaitlist',
        keyList: 0
      }
     },
     created: function(){
        
       this.screenWidth = screen.width;
    
       this.segmentChanged('heart')
      //  }
       
       this.dateToDay = moment.tz(moment.tz.guess()).format('MM-DD-YYYY')    
       const minD = this.$store.state.backConfig.setting.MinDayToReservation || 0;
       this.dateToDay = moment(this.dateToDay, "MM-DD-YYYY").add('days', minD)
       this.getReservations()
       this.getWaitList()
       this.getRestaurantConfig()
       this.changeWaitlistFilter('todaywaitlist')
       
     },
     methods: {

      async doRefresh() {
        this.spinner = true;
        await Api.fetchAll('Reservation').then(response => {
          this.$store.state.backConfig.reservation = response.data
         
        })
        .catch(e => {
          e;
          this.spinner = false;
        });

        await Api.fetchAll('waitlist').then(response => {
          this.$store.state.backConfig.waitlist = response.data
        
        })
        .catch(e => {
          e;
          this.spinner = false;
        });
          
      this.getReservations()
      this.getWaitList()
       this.keyList ++;
       this.spinner = false
   
    },

     ListViewData(option, count){
      if(count === 1) return null;
      if(count === 2) return option.CustomerName;
      if(count === 3) return null 
      if(count === 4) return this.getReservationDate(option.Date)+ ' - ' + this.getReservationHour(option.Hour);
      if(count === 5) return this.allState[option.State]

    },
      

     async sendMessageWaitList(wait){

          this.$ionic.alertController.create({           
            title: "Send message",
            message: "Do you want to send a message to customer?",
            buttons: [
              {
                text: this.$t('backoffice.list.messages.buttons.cancel'),
                role: 'cancel',
                handler: () => {
                }
              },
              {
                text: "Ok",
                handler: async() => {
                  
                  if (wait.CustomerEmail != "")
                  {
                      this.spinner = true
                      let email = {
                        "email": wait.CustomerEmail,
                        "mess": "Your reservation is ready. We are waiting for you. Thanks.",
                        "subject": "Reservation is Ready"
                      };
                      await Api.sendEmail(email)
                      .then(() => {
                          this.spinner = false
                          this.showToastMessage('An email has been sent to the customer successfully.', 'success')
                          this.changeWaitlistFilter(this.filterWaitList)
                      })
                      .catch(e => {
                          e
                          this.ifErrorOccured(mess => {
                            this.sendMessageWaitList(wait)
                            this.spinner = false
                            return mess
                          });
                      })
                  }
                  if (wait.CustomerPhone != "")
                  {
                      this.spinner = true
                      let text = {
                        "phone": wait.CustomerPhone,
                        "mess": "Your reservation is ready. We are waiting for you. Thanks."
                      };
                      await Api.sendSms(text)
                      .then(() => {
                          this.spinner = false
                          this.showToastMessage('A text has been sent to the customer successfully.', 'success')
                          this.changeWaitlistFilter(this.filterWaitList)
                      })
                      .catch(e => {
                          e
                          this.ifErrorOccured(mess => {
                            this.sendMessageWaitList(wait)
                            this.spinner = false
                            return mess
                          });
                      })
                  }

                }
              }
            ]
          })
          .then(a => a.present());

      },
      async acceptWaitListItem(item){

          this.$ionic.alertController.create({
            title: "Mark as done",
            message: "Do you want to mark as done this wait list item?",
            buttons: [
              {
                text: this.$t('backoffice.list.messages.buttons.cancel'),
                role: 'cancel',
                handler: () => {
                }
              },
              {
                text: "Done",
                handler: async () => {
                  
                  this.spinner = true;
                  item.State = "Done"
                  await Api.putIn('waitlist', item)
                    .then(response => {
                      const index =  this.$store.state.backConfig.waitlist.findIndex( w => w._id === item._id);
                      if(index !== -1)  this.$store.state.backConfig.waitlist[index] = item;
                      this.showToastMessage("The item was successfuly mark as done", "success");
                      this.getWaitList();
                      this.changeWaitlistFilter(this.filterWaitList)
                      this.spinner = false;
                      return response;
                    })
                    .catch(e => {
                      e;
                      this.ifErrorOccured(mess => {
                          this.acceptWaitListItem(item)
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
      async deleteFromWaitList(id){

            this.$ionic.alertController.create({
            title: this.$t('backoffice.list.messages.confirmDelete'),
            // message: this.$t('backoffice.list.messages.deleteCategory'),
            message: "Do you want to delete this item from wait list",
            buttons: [
              {
                text: this.$t('backoffice.list.messages.buttons.cancel'),
                role: 'cancel',
                handler: () => {
                }
              },
              {
                text: this.$t('backoffice.list.messages.buttons.delete'),
                handler: async() => {
                  
                  this.spinner = true;
                  await Api.deleteById('waitlist', id)
                    .then(response => {
                      const index =  this.$store.state.backConfig.waitlist.findIndex( w => w._id === id);
                      if(index !== -1)  this.$store.state.backConfig.waitlist.splice(index, 1);
                      this.showToastMessage("The item was successfuly deleted from the wait list", "success");
                      this.getWaitList();
                      this.changeWaitlistFilter(this.filterWaitList)
                      this.spinner = false;
                      return response;
                    })
                    .catch(e => {
                      e;
                      this.ifErrorOccured(mess => {
                          this.deleteFromWaitList(id)
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
      changeWaitlistFilter(value){

            this.filterWaitList = value
            this.allWaitList = this.waitlistL
            if (value == 'allwaitlist')
            {
                this.allWaitList = this.waitlistL
            }
            if (value == 'activewaitlist')
            {
                requestAnimationFrame(() => {
                  let cat = this.allWaitList.filter(item => {
                      return item.State != "Done"
                  }) 
                  this.allWaitList = cat
                })
            }
            if (value == 'todaywaitlist')
            {
                requestAnimationFrame(() => {   
                  let cat2 = this.allWaitList.filter(item => {
                       const storeDate = item.Date.split('T')[0]
                       const now = moment().format('YYYY-MM-DD')
                       return storeDate == now 
                  })
                  this.allWaitList = cat2
                })
            }
        },
        changeFilterStatus(value){
            let status = -1
            this.filterStatus = value
            this.allReservations = this.reservations
            if (value == 'all')
            {
                this.allReservations = this.reservations
                return
            }
            if (value == 'request')
            {
                status = 0
            }
            if (value == 'approved')
            {
                status = 1
            }
            if (value == 'proposed')
            {
                status = 2
            }
            if (value == 'confirmed')
            {
                status = 4
            }
            if (value == 'rejected')
            {
                status = 3
            }
            if (value == 'canceled')
            {
                status = 5
            }
            if (value == 'close')
            {
                status = 6
            }
            requestAnimationFrame(() => {   
              let cat2 = this.allReservations.filter(item => item.State == status)
              this.allReservations = cat2
            })
        },
        handleInput(value){

          this.filterStatus = 'all'
          const query = value.toLowerCase();
          if (value != '')
          {
              requestAnimationFrame(() => {   
              let cat2 = this.allReservations.filter(item => 
                  item.CustomerName.toLowerCase().indexOf(query) > -1 ||
                 this.allState[item.State].toLowerCase().indexOf(query) > -1 ||
                  item.CustomerEmail.toLowerCase().indexOf(query) > -1 ||
                  item.CustomerPhone.toLowerCase().indexOf(query) > -1)
              if(cat2.length> 0)
                this.allReservations = cat2
              else
                this.allReservations = this.reservations
            });
          }
          else this.allReservations = this.reservations
          
        },

       sendEmail(reservation, mess){
            let email = {
              "email": reservation.CustomerEmail,
              "mess": mess,
              "subject": this.$t('backoffice.form.marketingMessages.reservationChangeStatus')
            };
            Api.sendEmail(email)
            .then(() => {
            })
            .catch(e => {
                e;
            })
        },

        sendSMS(reservation, mess){
            let text = {
              "phone": reservation.CustomerPhone,
              "mess": mess
            };
            Api.sendSms(text)
            .then(() => {
            })
            .catch(e => {
                e;
            })
        },

        getRestaurantConfig: function(){
           this.restaurantConfig =this.$store.state.backConfig.restaurant;
                  
        },
      
         
      hasPermission(permission){
        
        let res = false;
        if (this.$store.state.authenticated)
        {
                let roles = this.$store.state.roles;
                for (let index = 0; index < roles.length; index++) {
                    switch(permission){                        
                        case 'canCreateReservation':
                            res = roles[index].canCreateReservation;
                            break;
                        case 'canEditReservation':
                            res = roles[index].canEditReservation;
                            break;
                        case 'canDeleteReservation':
                            res = roles[index].canDeleteReservation;
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
         
      segmentChanged(value){            
        
            
             if(value === 'heart'){
                 this.heart = true;
                 this.waitlist = false;                
             }
             if(value === 'waitlist'){
                 this.heart = false;
                 this.waitlist = true;
                 this.changeWaitlistFilter('todaywaitlist')        
             }
             this.segmentValue = value;

         },

      async approve(reservation){
          this.spinner = true
          reservation.State = 1
          await Api.putIn('Reservation', reservation)
          .then(() => {
              const index = this.$store.state.backConfig.reservation.findIndex( r => r._id === reservation._id);
              if( index !== -1) this.$store.state.backConfig.reservation[index]= reservation;
              this.sendEmail(reservation, this.$t('backoffice.form.marketingMessages.reservationApproved'))
              this.sendSMS(reservation, this.$t('backoffice.form.marketingMessages.reservationApproved'))
              this.getReservations()
              this.spinner = false
          })
          .catch(e => {
              this.spinner = false
              e
          })

      },

      async close(reservation){
          this.spinner = true
          reservation.State = 6
          await Api.putIn('Reservation', reservation)
          .then(() => {
               const index = this.$store.state.backConfig.reservation.findIndex( r => r._id === reservation._id);
              if( index !== -1) this.$store.state.backConfig.reservation[index]= reservation;
              this.getReservations()
              this.spinner = false
          })
          .catch(e => {
              this.spinner = false
              e
          })

      },

      getReservations: function(){
        this.allReservations = this.$store.state.backConfig.reservation
        this.allReservations.reverse()
        this.reservations = this.allReservations
        },

      getWaitList: function(){
         this.allWaitList = this.$store.state.backConfig.waitlist
          this.allWaitList.reverse()
          this.waitlistL = this.allWaitList
      },


    

      isValidForm(){
          if(this.theName===''  || this.theEmail==='' || this.thePhone ==='' ||
            this.dateToReserv === '' || this.hourToReserv=== '' || this.guest < 1)
              return false
          return true
      },
    
      async saveReservation(){

        const Reservation = {
        "CustomerId" : '',
        "CustomerName": this.theName,
        "CustomerEmail": this.theEmail,
        "CustomerPhone":  this.thePhone,
        "StaffName":  this.$store.state.staffName || '',
        "Capacity":  this.guest,
        "Date": Moment(this.dateToReserv).toISOString(),
        "Hour": Moment(this.hourToReserv).toISOString(),
        "Note": this.noteToReserv,
        "Reason": this.reasonToReser,
        "State": 0
        }

      

        try {
          this.spinner = true;
          const response = await Api.postIn('Reservation', Reservation);
          if(response.status === 200){
            this.$store.state.backConfig.reservation.push(response.data);
            this.dateToReserv = ''; this.hourToReserv = '' ; this.guest = 1;
            this.noteToReserv = ''; this.reasonToReser = ''; this.spinner = false;
            this.openToast();      
            this.getReservations();  
            this.segmentChanged('heart');
          }
         
        } catch (error) {
           error;
           this.spinner = false;          
        }
      },

      getReservationDate(thisDate){
        return  moment.tz(thisDate, moment.tz.guess()).format('MM-DD-YYYY') 
      },
      getReservationHour(thisHour){
        return  moment.tz(thisHour, moment.tz.guess()).format('hh:mm A') 
      },

      getReservationState(id){
          const reservation = this.allReservations.find( r => r._id === id)
          return this.$router.push({ name: 'ReservationDetails', params: {reservation: reservation } })    
      },

      addReservation(){
         return this.$router.push({ name: 'Reservation', params: { url: this.$store.state.restaurantActive.restaurantUrl}  })    
      },

      sendReservationEmail(reservation){
           
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
            html += `<h2>${this.$t('frontend.reservation.create')}</h2>  `;
            html +=`</td>`;     
            html += `</tr>`;          
            html += '<tr><td colspan=6 >'
            if(reservation.CustomerName)
              html += `<br> <h4> ${this.$t('frontend.orderType.name')}: ${reservation.CustomerName}</h4>`;
            if(reservation.CustomerEmail)
              html += `<br> <h4> ${this.$t('frontend.orderType.email')}: ${reservation.CustomerEmail}</h4>`;
            if(reservation.CustomerPhone)
              html += `<br> <h4> ${this.$t('frontend.orderType.phone')}: ${reservation.CustomerPhone}</h4>`;
            if(reservation.Capacity)
              html += `<br> <h4> ${this.$t('frontend.reservation.peoples')}: ${reservation.Capacity}</h4>`;
            if(reservation.Date)
              html += `<br> <h4> ${this.$t('frontend.reservation.reservationDate')}: ${this.getReservationDate(reservation.Date)}</h4>`;
            if(reservation.Hour)
              html += `<br> <h4> ${this.$t('frontend.reservation.reservationHour')}: ${this.getReservationHour(reservation.Hour)}</h4>`;
            if(reservation.Note)
              html += `<br> <h4> ${this.$t('frontend.order.notes')}: ${reservation.Note}</h4>`;
            if(reservation.Reason)
              html += `<br> <h4> ${this.$t('frontend.reservation.reason')}: ${reservation.Reason}</h4>`;
           
            html += `</td></tr>`;      
           
            html += `</table></div></body></html>`;

            let subject = this.$t('frontend.reservation.create') ;
            
                    
            var items = {
                "email": this.$store.state.backConfig.restaurant.Email,
                "mess": html,
                "subject": subject
            }
            Api.sendEmail(items);
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

    alertRequiredDatas(){
      return  this.$ionic.alertController
      .create({
          cssClass: 'my-custom-class',
          header: '',
          message: this.$t('frontend.home.errorRequired'),
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
          position: 'center',
          color:'success'
        })
      .then(a => a.present())
    },

    isValidWaitList(){

        if (this.waitName == "")
          return false
        if (this.waitEmail == "" && this.waitPhone == "")
          return false

        if (this.waitEmail != "")
        {
            const emailRegex = /^[-\w.%+]{1,64}@(?:[A-Z0-9-]{1,63}\.){1,125}[A-Z]{2,63}$/i;
            if (emailRegex.test(this.waitEmail) == false)
            {
                return false
            }
        }
        
        if (this.waitPeople == "" || this.waitPeople < 1)
          return false

        return true

    },

    async saveWaitList(){
        let item = {
            'CustomerName': this.waitName,
            'CustomerEmail': this.waitEmail,
            'CustomerPhone': this.waitPhone,
            'Capacity': this.waitPeople,
        }
        await Api.postIn('waitlist', item)
        .then((response) => {
            this.$store.state.backConfig.waitlist.push(response.data);
            this.showToastMessage('Wait list update', 'success')
            this.getWaitList()
            this.clearWaitFields()
            this.changeWaitlistFilter(this.filterWaitList)
        })
        .catch(e => {
            e
        })
    },

    sendPrint:  function(reservation){

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
          html += `<h2>${this.$t('frontend.reservation.create')}</h2>  `;
          html +=`</td>`;     
          html += `</tr>`;          
          html += '<tr><td colspan=6 >'
          if(reservation.CustomerName)
            html += `<br> <h4> ${this.$t('frontend.orderType.name')}: ${reservation.CustomerName}</h4>`;
          if(reservation.CustomerEmail)
            html += `<br> <h4> ${this.$t('frontend.orderType.email')}: ${reservation.CustomerEmail}</h4>`;
          if(reservation.CustomerPhone)
            html += `<br> <h4> ${this.$t('frontend.orderType.phone')}: ${reservation.CustomerPhone}</h4>`;
          if(reservation.Capacity)
            html += `<br> <h4> ${this.$t('frontend.reservation.peoples')}: ${reservation.Capacity}</h4>`;
          if(reservation.Date)
            html += `<br> <h4> ${this.$t('frontend.reservation.reservationDate')}: ${this.getReservationDate(reservation.Date)}</h4>`;
          if(reservation.Hour)
            html += `<br> <h4> ${this.$t('frontend.reservation.reservationHour')}: ${this.getReservationHour(reservation.Hour)}</h4>`;
          if(reservation.Note)
            html += `<br> <h4> ${this.$t('frontend.order.notes')}: ${reservation.Note}</h4>`;
          if(reservation.Reason)
            html += `<br> <h4> ${this.$t('frontend.reservation.reason')}: ${reservation.Reason}</h4>`;
          if(reservation.State)
            html += `<br> <h4> ${this.$t('frontend.home.state')}: ${this.allState[reservation.State]}</h4>`;
          
          html += `</td></tr>`;      
          
          html += `</table></div></body></html>`;


          var winimp = window.open('/print', 'popimpr');         
          winimp.document.write( html );
          winimp.document.close();
          winimp.focus();
          winimp.print();
          winimp.close();
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

    clearWaitFields(){
        this.waitName = ''
        this.waitEmail = ''
        this.waitPhone = ''
        this.waitPeople = 1
    },

      async toastInfoHorarios() {

        let html = '';
        const array = this.$store.state.backConfig.setting.ReservationDaysAndTime || [];
        for (const iterator of array) {
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
                // side: 'start',
                icon: 'close',
                text: 'Done',
                role: 'cancel',
                handler: () => {
                }
              }
            ]
          })
        .then(a => a.present())
      },

      goControlView: function(){
        return this.$router.push({ name: 'ControlPanel', params: {viewSelected: 'Sale'}  })
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