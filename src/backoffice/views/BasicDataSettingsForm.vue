<template>
    <div>
    <ion-backdrop v-if="isBackdrop"></ion-backdrop>

    <br/>

    <!-- <ion-card> -->
     <ion-loading
        v-if="spinner"
        cssClass="my-custom-class"
        :message="$t('frontend.tooltips.loadRestaurant')"
    ></ion-loading>
    <ion-row>
        <ion-col  size="12"   size-md="6" >
        
          <ion-list>

            <ion-card style="width: 50%;"> 
              <label> 
                <img v-if="checkImage()"  :src="file">
                <input type="file" accept="image/png, image/jpeg" style="display:none"  @change="handleImage" >
              </label>
          </ion-card>

            <ion-item   class="row-config">
              <ion-label >{{$t('backoffice.form.fields.online')}}
              <ion-toggle name="online" style="top: 12px;"
              @ionChange="online=$event.target.checked" 
              :checked ="online">
              </ion-toggle></ion-label>
            </ion-item>

              
            
            <ion-item  class="row-config">
              <ion-label position="floating"><span style="color: red">*</span>{{$t('backoffice.form.fields.name')}}</ion-label>
              <ion-input type="text" name="name"
              @input="name = $event.target.value" 
              v-bind:value="name">
              </ion-input>
            </ion-item> 

            <ion-item class="row-config">
              <ion-label position="floating"><span style="color: red">*</span>{{$t('backoffice.form.fields.address')}}</ion-label>
              <ion-input name="address" type="text"
              @input="address = $event.target.value" 
              v-bind:value="address">
              </ion-input>
            </ion-item>
          
            <ion-item class="row-config">
              <ion-label position="floating"><span style="color: red">*</span>{{$t('backoffice.form.fields.email')}}</ion-label>
              <ion-input type="email" name="email"
              @input="email = $event.target.value" 
              v-bind:value="email">
              </ion-input>
            </ion-item>

            <ion-item  class="row-config">
              <ion-label position="floating"><span style="color: red">*</span>{{$t('backoffice.form.fields.phone')}}</ion-label>
              <ion-input type="tel" name="phone"
              @input="phone = $event.target.value" 
              v-bind:value="phone">
              </ion-input>
            </ion-item>

                 <!-- Currency -->
          <ion-item  class="row-config">
            <ion-label position="floating">Restaturant currency</ion-label>
              <ion-select interface="popover" icon="add"
                :ok-text="$t('backoffice.form.messages.buttons.ok')"
                :cancel-text="$t('backoffice.form.messages.buttons.dismiss')"
                :value="currencyCode"
                placeholder="Select a currency"
                @ionChange="currencyCode = $event.target.value; change()">
                  <ion-select-option v-for="curr in allCurrencies"                    
                    :key="curr.code" 
                    :value="curr.code" > {{curr.currency}} - {{curr.code}}
                  </ion-select-option>
                  
              </ion-select>
          </ion-item>
     

          </ion-list>

        </ion-col>

        <ion-col  size="12"   size-md="6"  >
          <ion-list>

              
          <ion-item    class="row-config">
            <ion-label position="floating">{{$t('backoffice.form.fields.web')}}</ion-label>
            <ion-input type="text" name="web"
            @input="web = $event.target.value" 
            v-bind:value="web">
            </ion-input>
          </ion-item>

          <ion-item    class="row-config">
            <ion-label position="floating">{{$t('backoffice.form.fields.urlLocation')}}</ion-label>
            <ion-input type="text" name="urlLocation"
            @input="urlLocation = $event.target.value" 
            v-bind:value="urlLocation">
            </ion-input>
          </ion-item>

          <ion-item  class="row-config">
            <ion-label position="floating">{{$t('backoffice.form.fields.fax')}}</ion-label>
            <ion-input type="text" name="fax"
            @input="fax = $event.target.value" 
            v-bind:value="fax">
            </ion-input>
          </ion-item>

          

          <ion-item class="row-config">
            <ion-label >Social Networks
               
            </ion-label>
             <ion-toggle name="socials" style="top: 12px;"
                @ionChange="socials=$event.target.checked" 
                :checked ="socials">
                </ion-toggle>
          </ion-item>

          <div v-if="socials">
            <ion-item>
              <ion-label position="floating">Facebook</ion-label>
              <ion-input type="text" name="facebook"
              @input="facebook = $event.target.value" 
              v-bind:value="facebook">
              </ion-input>
            </ion-item>
            <ion-item>
              <ion-label position="floating">Instagram</ion-label>
              <ion-input type="text" name="instagram"
              @input="instagram = $event.target.value" 
              v-bind:value="instagram">
              </ion-input>
            </ion-item>
            <ion-item>
              <ion-label position="floating">Twitter</ion-label>
              <ion-input type="text" name="twitter"
              @input="twitter = $event.target.value" 
              v-bind:value="twitter">
              </ion-input>
            </ion-item>
            <ion-item>
              <ion-label position="floating">YouTube</ion-label>
              <ion-input type="text" name="youtube"
              @input="youtube = $event.target.value" 
              v-bind:value="youtube">
              </ion-input>
            </ion-item>
          </div>

          <ion-item>
            <ion-label>{{$t('backoffice.form.titles.restaurantHours')}}</ion-label>
            <ion-toggle :checked="showHE==='horario'" @ionChange="$event.target.checked? showHE='horario' : showHE='' "></ion-toggle>
        </ion-item>
        <div v-if="showHE==='horario'">
            <ion-item>
              <ion-label>{{$t('backoffice.form.fields.sameHourForAllDays')}}</ion-label>
              <ion-checkbox slot="end" name="sameHourForAllDays" 
                    @ionChange="sameHourForAllDays = $event.target.checked; activeMonday = true"
                    :checked="sameHourForAllDays">
              </ion-checkbox>
        </ion-item>
        <div style="display: inherit">
            <ion-item>
                  <ion-checkbox v-if="!sameHourForAllDays" style="border-bottom: 1px solid lightgray; margin:5px" name="activeMonday" 
                        @ionChange="activeMonday = $event.target.checked"
                        :checked="activeMonday">
                  </ion-checkbox>
                  <ion-label v-if="!sameHourForAllDays">{{$t('backoffice.form.fields.monday')}}</ion-label>
                  <ion-label v-else>{{$t('backoffice.form.fields.allDays')}}</ion-label>
                  <ion-datetime style="border-bottom: 1px solid lightgray; margin:5px" name="mondayOpenHour" @ionChange="mondayOpenHour = $event.target.value" 
                                  v-bind:value="mondayOpenHour"
                                  placeholder="Select" display-format="h:mm a" picker-format="h:mm a"
                                  :disabled="!activeMonday">
                  </ion-datetime>
                  -
                  <ion-datetime style="border-bottom: 1px solid lightgray; margin:5px" name="mondayCloseHour" @ionChange="mondayCloseHour = $event.target.value" 
                                  v-bind:value="mondayCloseHour"
                                  placeholder="Select" display-format="h:mm a" picker-format="h:mm a"
                                  :disabled="!activeMonday">
                  </ion-datetime>
            </ion-item>
            <ion-item v-if="!sameHourForAllDays">
                  <ion-checkbox style="border-bottom: 1px solid lightgray; margin:5px" name="activeTuesday" 
                        @ionChange="activeTuesday = $event.target.checked"
                        :checked="activeTuesday">
                  </ion-checkbox>
                  <ion-label>{{$t('backoffice.form.fields.tuesday')}}</ion-label>
                  <ion-datetime style="border-bottom: 1px solid lightgray; margin:5px" name="tuesdayOpenHour" @ionChange="tuesdayOpenHour = $event.target.value" 
                                  v-bind:value="tuesdayOpenHour"
                                  placeholder="Select" display-format="h:mm a" picker-format="h:mm a"
                                  :disabled="!activeTuesday">
                  </ion-datetime>
                  -
                  <ion-datetime style="border-bottom: 1px solid lightgray; margin:5px" name="tuesdayCloseHour" @ionChange="tuesdayCloseHour = $event.target.value" 
                                  v-bind:value="tuesdayCloseHour"
                                  placeholder="Select" display-format="h:mm a" picker-format="h:mm a"
                                  :disabled="!activeTuesday">
                  </ion-datetime>
            </ion-item>
            <ion-item v-if="!sameHourForAllDays">
                  <ion-checkbox style="border-bottom: 1px solid lightgray; margin:5px" name="activeWednesday" 
                        @ionChange="activeWednesday = $event.target.checked"
                        :checked="activeWednesday">
                  </ion-checkbox>
                  <ion-label>{{$t('backoffice.form.fields.wednesday')}}</ion-label>
                  <ion-datetime style="border-bottom: 1px solid lightgray; margin:5px" name="wednesdayOpenHour" @ionChange="wednesdayOpenHour = $event.target.value" 
                                  v-bind:value="wednesdayOpenHour"
                                  placeholder="Select" display-format="h:mm a" picker-format="h:mm a"
                                  :disabled="!activeWednesday">
                  </ion-datetime>
                  -
                  <ion-datetime style="border-bottom: 1px solid lightgray; margin:5px" name="wednesdayCloseHour" @ionChange="wednesdayCloseHour = $event.target.value" 
                                  v-bind:value="wednesdayCloseHour"
                                  placeholder="Select" display-format="h:mm a" picker-format="h:mm a"
                                  :disabled="!activeWednesday">
                  </ion-datetime>
            </ion-item>
            <ion-item v-if="!sameHourForAllDays">
                  <ion-checkbox style="border-bottom: 1px solid lightgray; margin:5px" name="activeThursday" 
                        @ionChange="activeThursday = $event.target.checked"
                        :checked="activeThursday">
                  </ion-checkbox>
                  <ion-label>{{$t('backoffice.form.fields.thursday')}}</ion-label>
                  <ion-datetime style="border-bottom: 1px solid lightgray; margin:5px" name="thursdayOpenHour" @ionChange="thursdayOpenHour = $event.target.value" 
                                  v-bind:value="thursdayOpenHour"
                                  placeholder="Select" display-format="h:mm a" picker-format="h:mm a"
                                  :disabled="!activeThursday">
                  </ion-datetime>
                  -
                  <ion-datetime style="border-bottom: 1px solid lightgray; margin:5px" name="thursdayCloseHour" @ionChange="thursdayCloseHour = $event.target.value" 
                                  v-bind:value="thursdayCloseHour"
                                  placeholder="Select" display-format="h:mm a" picker-format="h:mm a"
                                  :disabled="!activeThursday">
                  </ion-datetime>
            </ion-item>
            <ion-item v-if="!sameHourForAllDays">
                  <ion-checkbox style="border-bottom: 1px solid lightgray; margin:5px" name="activeFriday" 
                        @ionChange="activeFriday = $event.target.checked"
                        :checked="activeFriday">
                  </ion-checkbox>
                  <ion-label>{{$t('backoffice.form.fields.friday')}}</ion-label>
                  <ion-datetime style="border-bottom: 1px solid lightgray; margin:5px" name="fridayOpenHour" @ionChange="fridayOpenHour = $event.target.value" 
                                  v-bind:value="fridayOpenHour"
                                  placeholder="Select" display-format="h:mm a" picker-format="h:mm a" :disabled="!activeFriday">
                  </ion-datetime>
                  -
                  <ion-datetime style="border-bottom: 1px solid lightgray; margin:5px" name="fridayCloseHour" @ionChange="fridayCloseHour = $event.target.value" 
                                  v-bind:value="fridayCloseHour"
                                  placeholder="Select" display-format="h:mm a" picker-format="h:mm a" :disabled="!activeFriday">
                  </ion-datetime>
            </ion-item>
            <ion-item v-if="!sameHourForAllDays">
                  <ion-checkbox style="border-bottom: 1px solid lightgray; margin:5px" name="activeSaturday" 
                        @ionChange="activeSaturday = $event.target.checked"
                        :checked="activeSaturday">
                  </ion-checkbox>
                  <ion-label>{{$t('backoffice.form.fields.saturday')}}</ion-label>
                  <ion-datetime style="border-bottom: 1px solid lightgray; margin:5px" name="saturdayOpenHour" @ionChange="saturdayOpenHour = $event.target.value" 
                                  v-bind:value="saturdayOpenHour"
                                  placeholder="Select" display-format="h:mm a" picker-format="h:mm a"
                                  :disabled="!activeSaturday">
                  </ion-datetime>
                  -
                  <ion-datetime style="border-bottom: 1px solid lightgray; margin:5px" name="saturdayCloseHour" @ionChange="saturdayCloseHour = $event.target.value" 
                                  v-bind:value="saturdayCloseHour"
                                  placeholder="Select" display-format="h:mm a" picker-format="h:mm a"
                                  :disabled="!activeSaturday">
                  </ion-datetime>
            </ion-item>
            <ion-item v-if="!sameHourForAllDays">
                  <ion-checkbox style="border-bottom: 1px solid lightgray; margin:5px" name="activeSunday" 
                        @ionChange="activeSunday = $event.target.checked"
                        :checked="activeSunday">
                  </ion-checkbox>
                  <ion-label>{{$t('backoffice.form.fields.sunday')}}</ion-label>
                  <ion-datetime style="border-bottom: 1px solid lightgray; margin:5px" name="sundayOpenHour" @ionChange="sundayOpenHour = $event.target.value" 
                                  v-bind:value="sundayOpenHour"
                                  placeholder="Select" display-format="h:mm a" picker-format="h:mm a"
                                  :disabled="!activeSunday">
                  </ion-datetime>
                  -
                  <ion-datetime style="border-bottom: 1px solid lightgray; margin:5px" name="sundayCloseHour" @ionChange="sundayCloseHour = $event.target.value" 
                                  v-bind:value="sundayCloseHour"
                                  placeholder="Select" display-format="h:mm a" picker-format="h:mm a"
                                  :disabled="!activeSunday">
                  </ion-datetime>
            </ion-item>
        </div>
        <div style="display: inherit">

            <ion-item>
                <ion-label>Custome Hours</ion-label>
                <ion-checkbox style="border-bottom: 1px solid lightgray; margin:5px" name="customHours" 
                    @ionChange="customHours = $event.target.checked"
                    :checked="customHours">
                </ion-checkbox>
            </ion-item>
            <ion-item v-if="customHours">
                <ion-textarea name="customHoursText" style="border-bottom: 1px solid lightgray; margin:5px"
                        @input="customHoursText = $event.target.value" 
                        v-bind:value="customHoursText">
                </ion-textarea>
            </ion-item>

        </div>
        </div>

          <ion-item>
            <ion-label>Servidor de Correo</ion-label>
            <ion-toggle :checked="showHE==='email'" @ionChange="$event.target.checked? showHE='email' : showHE='' "></ion-toggle>
          </ion-item>
           <div v-if="showHE==='email'">
             
            <ion-item   class="row-config">
              <ion-label  position="floating"><span style="color: red">*</span>Email host</ion-label>
              <ion-input type="email" name="emailHost"
              @input="emailHost = $event.target.value" 
              v-bind:value="emailHost">
              </ion-input>
            </ion-item>

            <ion-item class="row-config">
                <ion-label  position="floating"><span style="color: red">*</span>{{$t('backoffice.form.fields.password')}}</ion-label>
                <ion-input type="password" name="Password"
                @input="Password = $event.target.value" 
                v-bind:value="Password">
                </ion-input>
            </ion-item>

            <ion-item   class="row-config">
                <ion-label  position="floating"><span style="color: red">*</span>{{$t('backoffice.form.fields.smtpHost')}}</ion-label>
                <ion-input type="text" name="SmtpHost"
                @input="SmtpHost = $event.target.value" 
                v-bind:value="SmtpHost">
                </ion-input>
            </ion-item>

            <ion-item   class="row-config">
                <ion-label  position="floating"><span style="color: red">*</span>{{$t('backoffice.form.fields.port')}}</ion-label>
                <ion-input type="number" name="Port"
                @input="Port = $event.target.value" 
                v-bind:value="Port">
                </ion-input>
            </ion-item>

            <ion-item   class="row-config">
                <ion-label >{{$t('backoffice.form.fields.secure')}}</ion-label>
                <ion-toggle slot="end" name="Secure" 
                        @ionChange="Secure=$event.target.checked" 
                        :checked="Secure">
                </ion-toggle>
            </ion-item>

            <ion-item class="row-config">
                <ion-item-group side="start">
                    <ion-label  position="floating"><span style="color: red">*</span>{{$t('backoffice.form.fields.email')}}</ion-label>
                    <ion-input type="email" name="EmailTest"
                    @input="EmailTest = $event.target.value" 
                    v-bind:value="EmailTest">
                    </ion-input>
                </ion-item-group>
                <ion-item-group side="end">
                    <ion-button color="primary" :disabled="checkEmailTest()" @click="emailTest()">Test email <ion-spinner v-if="emailspinner" name="crescent"></ion-spinner></ion-button>
                </ion-item-group>
            </ion-item>
           </div>
        
          </ion-list>
        </ion-col>
    
     </ion-row>

      <ion-button expand="full" color="primary" :disabled="!isValidForm()" @click="saveSetting()">{{ $t('backoffice.form.buttons.save') }}</ion-button>
    
    </div>
</template>

<script>

import { Api } from '../api/api.js';
import Moment from 'moment';
// import CurrencyCodes from 'currency-codes'

export default {

  name: 'basicDataSettingForm',
   
  data () {
    return {
      modelName: 'Restaurant',
      /****** Form Data ******/
      emailspinner: false,
      showHE: '',

      id: null,
      name: '',
      address: '',
      online: false,
      // showOthersRestaurant: false,
      email: '',
      SmtpHost: '',
      emailHost: '',
      // EmailHost: '',
      Port: 0,
      Secure: false,
      Password: '',
      EmailTest: '',


      phone: '',
      web: '',
      urlLocation: '',
      fax: '',
      file: null,
      fileName: '',

      // Restaurant hours
      restaurantDaysAndTime: [],
      sameHourForAllDays: false,

      activeMonday: false,
      mondayOpenHour: '',
      mondayCloseHour: '',

      activeTuesday: false,
      tuesdayOpenHour: '',
      tuesdayCloseHour: '',
      
      activeWednesday: false,
      wednesdayOpenHour: '',
      wednesdayCloseHour: '',

      activeThursday: false,
      thursdayOpenHour: '',
      thursdayCloseHour: '',

      activeFriday: false,
      fridayOpenHour: '',
      fridayCloseHour: '',

      activeSaturday: false,
      saturdayOpenHour: '',
      saturdayCloseHour: '',

      activeSunday: false,
      sundayOpenHour: '',
      sundayCloseHour: '',

      customHours: false,
      customHoursText: '',
      // End

      //Currencies
      allCurrencies: [],
      currencyCode: 'USD',
      example: '',
      
      isBackdrop: false,

      spinner: false,

      //Socials network
      socials: true,
      socialList: [],
      facebook: '',
      instagram: '',
      twitter: '',
      youtube: '',
    }
  },
  created: function(){
      this.init();
  },
  computed: {
        title() {
            return this.id ? this.$t('backoffice.form.titles.generalSettingEditTitle') :  this.$t('backoffice.form.titles.generalSettingNewTitle');
        }
  },
  methods: {

    checkEmailTest(){
        if (this.EmailTest == '')
            return true
        else{
            let emailRegex = /^[-\w.%+]{1,64}@(?:[A-Z0-9-]{1,63}\.){1,125}[A-Z]{2,63}$/i;
            if (emailRegex.test(this.EmailTest) == false){
                return true
            }
        }
        return false
    },

    emailTest(){
        this.emailspinner = true
        const test = {
            "Email": this.EmailTest,
            "mss": this.$t('backoffice.emailTest.message'),
            "subject": this.$t('backoffice.emailTest.subject')
        }
        Api.testRestaurantEmail(test)
        .then(() => {
            this.showToastMessage(this.$t('backoffice.emailTest.success'), 'success')
            this.emailspinner = false
        })
        .catch(e => {
           e;
            this.showToastMessage(e, 'danger')
            this.emailspinner = false
        })
    },

    change(){
        this.example = new Intl.NumberFormat('en', {style: "currency", currency: this.currencyCode} ).format(123456)
    },

    init(){

        this.allCurrencies = require('currency-codes/data');      
        this.id = this.$store.state.user.RestaurantId     
        if (this.id){
            const data = this.$store.state.backConfig.restaurant;
            this.name = data.Name;
            this.address = data.Address;
            this.online = data.Online;
            // this.showOthersRestaurant = data.ShowOtherRestaurant;
            this.email = data.Email;
            this.SmtpHost = data.SmtpHost,
            this.emailHost = data.EmailHost,
            this.Port = data.Port,
            this.Secure = data.Secure,
            this.Password = data.Password,
            this.phone = data.Phone;
            this.web = data.Web;
            this.urlLocation = data.UrlLocation;
            this.fax = data.Fax;
            this.file = data.ImageUrl;
            this.currencyCode = data.Currency;
            this.customHours = data.CustomHours;
            this.customHoursText = data.CustomHoursText;

            //socials
            this.socialList = data.Sociasls;
            if (this.socialList.length > 0){
              this.socials = true
              this.socialList.forEach(s => {
                if (s.SocialName == 'Facebook')
                  this.facebook = s.SocialUrl
                if (s.SocialName == 'Instagram')
                  this.instagram = s.SocialUrl
                if (s.SocialName == 'Twitter')
                  this.twitter = s.SocialUrl
                if (s.SocialName == 'Youtube')
                  this.youtube = s.SocialUrl
              });
            }
            this.change();

            // Restaurant date and time
            if (data.RestaurantDaysAndTime)
            {
              data.RestaurantDaysAndTime.forEach(element => {
                  if (element.Day == 'Monday')
                  {
                      this.activeMonday = true
                      this.mondayOpenHour = Moment.tz(element.OpenHour, Moment.tz.guess()).format('HH:mm')
                      this.mondayCloseHour = Moment.tz(element.CloseHour, Moment.tz.guess()).format('HH:mm')
                  }
                  if (element.Day == 'Tuesday')
                  {
                      this.activeTuesday = true
                      this.tuesdayOpenHour = Moment.tz(element.OpenHour, Moment.tz.guess()).format('HH:mm')
                      this.tuesdayCloseHour = Moment.tz(element.CloseHour, Moment.tz.guess()).format('HH:mm')
                  }
                  if (element.Day == 'Wednesday')
                  {
                      this.activeWednesday = true
                      this.wednesdayOpenHour = Moment.tz(element.OpenHour, Moment.tz.guess()).format('HH:mm')
                      this.wednesdayCloseHour = Moment.tz(element.CloseHour, Moment.tz.guess()).format('HH:mm')
                  }
                  if (element.Day == 'Thursday')
                  {
                      this.activeThursday = true
                      this.thursdayOpenHour = Moment.tz(element.OpenHour, Moment.tz.guess()).format('HH:mm')
                      this.thursdayCloseHour = Moment.tz(element.CloseHour, Moment.tz.guess()).format('HH:mm')
                  }
                  if (element.Day == 'Friday')
                  {
                      this.activeFriday = true
                      this.fridayOpenHour = Moment.tz(element.OpenHour, Moment.tz.guess()).format('HH:mm')
                      this.fridayCloseHour = Moment.tz(element.CloseHour, Moment.tz.guess()).format('HH:mm')
                  }
                  if (element.Day == 'Saturday')
                  {
                      this.activeSaturday = true
                      this.saturdayOpenHour = Moment.tz(element.OpenHour, Moment.tz.guess()).format('HH:mm')
                      this.saturdayCloseHour = Moment.tz(element.CloseHour, Moment.tz.guess()).format('HH:mm')
                  }
                  if (element.Day == 'Sunday')
                  {
                      this.activeSunday = true
                      this.sundayOpenHour = Moment.tz(element.OpenHour, Moment.tz.guess()).format('HH:mm')
                      this.sundayCloseHour = Moment.tz(element.CloseHour, Moment.tz.guess()).format('HH:mm')
                  }
              
              });
              this.restaurantDaysAndTime
            }

                    // End
        }

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
    
    isValidForm(){
        if (this.name == "")return false
        if (this.address == "")return false
        if (this.email == "") return false
        if (this.phone == "") return false
        if (this.file == null)return false

        return true

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

    /****** Load image use base64 encode esto debería ir en un componente******/
    checkImage: function(){
      return this.file != null;
    },

    handleImage: function(event)
    {
        const selectedImage = event.target.files[0];
        this.fileName = selectedImage.name;
        this.createBase64Img(selectedImage);
    },

    createBase64Img: function(fileObject){
        const reader = new FileReader();

        reader.onload = (e) => {
            this.file = e.target.result;
        };
        reader.readAsDataURL(fileObject);
    },
    /*******                              Fin                              *******/
    //Create or edit a new restaurant basic setting

    saveRestaurantDaysAndTime(){
      let reservation = [] 
      if (!this.sameHourForAllDays){
          if (this.activeMonday){
              reservation.push({
                  "Day": 'Monday',
                  "OpenHour": Moment(this.mondayOpenHour, 'HH:mm').toISOString(),
                  "CloseHour": Moment(this.mondayCloseHour, 'HH:mm').toISOString(),
              })
          }
          if (this.activeTuesday){
              reservation.push({
                  "Day": 'Tuesday',
                  "OpenHour": Moment(this.tuesdayOpenHour, 'HH:mm').toISOString(),
                  "CloseHour": Moment(this.tuesdayCloseHour, 'HH:mm').toISOString(),
              })
          }
          if (this.activeWednesday){
              reservation.push({
                  "Day": 'Wednesday',
                  "OpenHour": Moment(this.wednesdayOpenHour, 'HH:mm').toISOString(),
                  "CloseHour": Moment(this.wednesdayCloseHour, 'HH:mm').toISOString(),
              })
          }
          if (this.activeThursday){
              reservation.push({
                  "Day": 'Thursday',
                  "OpenHour": Moment(this.thursdayOpenHour, 'HH:mm').toISOString(),
                  "CloseHour": Moment(this.thursdayCloseHour, 'HH:mm').toISOString(),
              })
          }
          if (this.activeFriday){
              reservation.push({
                  "Day": 'Friday',
                  "OpenHour": Moment(this.fridayOpenHour, 'HH:mm').toISOString(),
                  "CloseHour": Moment(this.fridayCloseHour, 'HH:mm').toISOString(),
              })
          }
          if (this.activeSaturday){
              reservation.push({
                  "Day": 'Saturday',
                  "OpenHour": Moment(this.saturdayOpenHour, 'HH:mm').toISOString(),
                  "CloseHour": Moment(this.saturdayCloseHour, 'HH:mm').toISOString(),
              })
          }
          if (this.activeSunday){
              reservation.push({
                  "Day": 'Sunday',
                  "OpenHour": Moment(this.sundayOpenHour, 'HH:mm').toISOString(),
                  "CloseHour": Moment(this.sundayCloseHour, 'HH:mm').toISOString(),
              })
          }
      }
      else{
        reservation = [
            {
              "Day": 'Monday',
              "OpenHour": Moment(this.mondayOpenHour, 'HH:mm').toISOString(),
              "CloseHour": Moment(this.mondayCloseHour, 'HH:mm').toISOString(),
            },
            {
              "Day": 'Tuesday',
              "OpenHour": Moment(this.mondayOpenHour, 'HH:mm').toISOString(),
              "CloseHour": Moment(this.mondayCloseHour, 'HH:mm').toISOString(),
            },
            {
              "Day": 'Wednesday',
              "OpenHour": Moment(this.mondayOpenHour, 'HH:mm').toISOString(),
              "CloseHour": Moment(this.mondayCloseHour, 'HH:mm').toISOString(),
            },
            {
              "Day": 'Thursday',
              "OpenHour": Moment(this.mondayOpenHour, 'HH:mm').toISOString(),
              "CloseHour": Moment(this.mondayCloseHour, 'HH:mm').toISOString(),
            },
            {
              "Day": 'Friday',
              "OpenHour": Moment(this.mondayOpenHour, 'HH:mm').toISOString(),
              "CloseHour": Moment(this.mondayCloseHour, 'HH:mm').toISOString(),
            },
            {
              "Day": 'Saturday',
              "OpenHour": Moment(this.mondayOpenHour, 'HH:mm').toISOString(),
              "CloseHour": Moment(this.mondayCloseHour, 'HH:mm').toISOString(),
            },
            {
              "Day": 'Sunday',
              "OpenHour": Moment(this.mondayOpenHour, 'HH:mm').toISOString(),
              "CloseHour": Moment(this.mondayCloseHour, 'HH:mm').toISOString(),
            },
        ]
      }       
        return reservation
    },

    saveSetting: async function(){

      if (this.isValidForm()){
        this.isBackdrop = true;
        let item = {
          "Name": this.name,
          "Address": this.address,
          "Online": this.online,
          // "ShowOtherRestaurant": this.showOthersRestaurant,
          "Email": this.email,
          "SmtpHost": this.SmtpHost,
          "EmailHost": this.emailHost,
          "Port": this.Port,
          "Secure": this.Secure,
          "Password": this.Password,
          "Phone": this.phone,
          "Web": this.web,
          "Currency": this.currencyCode,
          "RestaurantDaysAndTime": this.saveRestaurantDaysAndTime(),
          "CustomHours": this.customHours,
          "CustomHoursText": this.customHoursText,
        }
        if (this.file != null)
        {
          item["ImageUrl"] = this.file;
          item["ImageName"] = this.fileName;
        }
        if (this.fax != '') item["Fax"] = this.fax
        if (this.urlLocation != '') item["UrlLocation"] = this.urlLocation
        let listS = []
        if (this.socials){
          if (this.facebook != '')
            listS.push({'SocialName': 'Facebook', 'SocialUrl': this.facebook})
          if (this.instagram != '')
            listS.push({'SocialName': 'Instagram', 'SocialUrl': this.instagram})
          if (this.twitter != '')
            listS.push({'SocialName': 'Twitter', 'SocialUrl': this.twitter})
          if (this.youtube != '')
            listS.push({'SocialName': 'Youtube', 'SocialUrl': this.youtube})
        }
        item["Sociasls"] = listS
        //If I am editing
        if (this.id){
          item['_id'] = this.id
          this.spinner = true
          await Api.putIn(this.modelName, item)
              .then(response => {
                    this.$store.state.backConfig.restaurant = item;
                    this.showToastMessage(this.$t('backoffice.list.messages.messageEditSuccessSetting'), "success");
                    // this.$router.push({
                    //   name: 'ControlPanel', 
                    // });
                    this.spinner = false;
                    return response;
              })
              .catch(e => {
                    this.isBackdrop = false
                    e;
                    this.spinner = false;
                    this.ifErrorOccured(this.saveSetting);
              })
        }
      }
    },
  },

}
    
</script>

<style>

.row-config{
  display: flex;
    justify-content: flex-start;
    align-items: center;
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