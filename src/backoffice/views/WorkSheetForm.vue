<template>
    <div id="menu" class="screen">
    <ion-backdrop v-if="isBackdrop"></ion-backdrop>

    <ion-header>
          <ion-toolbar>
            <ion-buttons slot="start">
              <ion-back-button default-href="/controlPanel" @click="$router.push({ name: 'WorkSheet'})"></ion-back-button>
            </ion-buttons>
            <ion-label style="padding: 20px 100px;">
              <h1>{{title}}</h1>            
            </ion-label>
          </ion-toolbar>
    </ion-header>
    <br/>

    <div v-if="spinner">
        <ion-spinner name="lines" class="spinner"></ion-spinner>
    </div>
    <div v-else>
        <ion-grid>

            <ion-row class="left">
                <ion-col>
                    <div v-if="workSheet.State == 0">
                        <v-date-picker mode="date" v-model="workSheet.StartDate">
                            <template v-slot="{ inputValue, inputEvents }">
                                <ion-input
                                style="border-bottom: 1px solid darkred"
                                class="bg-white border px-2 py-1 rounded"
                                :value="inputValue"
                                :placeholder="$t('backoffice.form.titles.startDate')"
                                v-on="inputEvents"
                                @click="checkMess()"
                                :disabled="workSheet.State != 0"
                                ></ion-input>
                            </template>
                        </v-date-picker>
                    </div>
                    <div v-if="workSheet.State != 0" style="border: 1px solid lightgray; padding: 8px">
                        {{$t('backoffice.worksheetStatus.fields.startDate')}}: {{getFormatedDate(workSheet.StartDate)}}
                    </div>
                </ion-col>
                <ion-col v-if="workSheet.StartDate !== ''">
                    <div v-if="workSheet.State == 0">
                        <v-date-picker mode="date" v-model="workSheet.EndDate" :min-date="workSheet.StartDate">
                            <template v-slot="{ inputValue, inputEvents }">
                                <ion-input
                                style="border-bottom: 1px solid darkred"
                                class="bg-white border px-2 py-1 rounded"
                                :value="inputValue"
                                :placeholder="$t('backoffice.form.titles.startDate')"
                                v-on="inputEvents"
                                @click="checkMess()"
                                :disabled="workSheet.State != 0"
                                ></ion-input>
                            </template>
                        </v-date-picker>
                    </div>
                    <div v-if="workSheet.State != 0" style="border: 1px solid lightgray; padding: 8px">
                        {{$t('backoffice.worksheetStatus.fields.endDate')}}: {{getFormatedDate(workSheet.EndDate)}}
                    </div>
                </ion-col>
            </ion-row>

            <!-- <ion-row class="left">
                <ion-col>
                    <div>
                        <ion-datetime style="border-bottom: 1px solid darkred" name="startdate" @click="checkMess()" @ionChange="workSheet.StartDate = $event.target.value" 
                            v-bind:value="workSheet.StartDate" :placeholder="$t('backoffice.form.titles.startDate')" :disabled="workSheet.State != 0">
                        </ion-datetime>
                    </div>
                </ion-col>
                <ion-col v-if="workSheet.StartDate !== ''">
                    <div>
                        <ion-datetime style="border-bottom: 1px solid darkred" name="enddate" @click="checkMess()" @ionChange="workSheet.EndDate = $event.target.value" 
                            v-bind:value="workSheet.EndDate" :placeholder="$t('backoffice.form.titles.endDate')" :min="workSheet.StartDate" :disabled="workSheet.State != 0">
                        </ion-datetime>
                    </div>
                </ion-col>
            </ion-row> -->
            <!-- <ion-button @click="getDatesOfSheet()">Dates</ion-button> -->
        </ion-grid>

        <ion-grid v-if="workSheet.StartDate !== '' && workSheet.EndDate !== '' && workSheet.State != 2">

            <div v-if="screenWidth < 600">

                    <ion-item>
                        <ion-label>
                            <router-link to="/user">{{$t('backoffice.form.fields.availableStaff')}}</router-link>
                        </ion-label>
                    </ion-item>
                    <ion-list>
                        <ion-item-sliding v-for="staff in availableStaff" v-bind:key="staff._id">
                        <ion-item>
                            <ion-thumbnail slot="start">
                                <ion-img v-if="staff.ImageUrl  != ''" :src="staff.ImageUrl"></ion-img>
                                <ion-img v-else :src="require('../assets/user.png')"></ion-img>
                            </ion-thumbnail>
                            <ion-label>
                                <h2><div style="word-wrap: break-word">{{ staff.FirstName }} {{ staff.LastName }}</div></h2>
                                <h3><div style="word-wrap: break-word">{{ staff.Email }}</div></h3>
                                <h3><div style="word-wrap: break-word">{{getStaffOcuppations(staff.OccupationId)}}</div></h3>
                            </ion-label>
                            <span slot="end" class="iconify" data-icon="mdi:backburger" data-inline="false"></span>
                        </ion-item>
                        <ion-item-options side="end">
                            <ion-item-option color="primary">
                                <ion-icon slot="icon-only" name="add" @click="addStaff(staff._id)"></ion-icon>
                            </ion-item-option>
                        </ion-item-options>
                        </ion-item-sliding>
                    </ion-list>

                </div>

                <div v-if="screenWidth >= 600">

                    <ion-item>
                        <ion-label>
                            <router-link to="/user">{{$t('backoffice.form.fields.availableStaff')}}</router-link>
                        </ion-label>
                    </ion-item>
                    <ion-list>
                        <ion-item v-for="staff in availableStaff" v-bind:key="staff._id">

                            <ion-thumbnail slot="start">
                                 <ion-img v-if="staff.ImageUrl  != ''" :src="staff.ImageUrl"></ion-img>
                                 <ion-img v-else :src="require('../assets/user.png')"></ion-img>
                            </ion-thumbnail>
                            <ion-label>
                                <h2><div style="word-wrap: break-word">{{ staff.FirstName }} {{ staff.LastName }}</div></h2>
                                <h3><div style="word-wrap: break-word">{{ staff.Email }}</div></h3>
                            </ion-label>
                            <ion-label>
                                <h2><div style="word-wrap: break-word">{{getStaffOcuppations(staff.OccupationId)}}</div></h2>
                            </ion-label>
                            <ion-item-group side="end">
                                <ion-button color="primary" @click="addStaff(staff._id)" :v-tooltip="$t('backoffice.form.tooltip.staffWorker')">
                                    <ion-icon slot="icon-only" name="add"></ion-icon>
                                </ion-button>
                            </ion-item-group>
                        </ion-item>
                    </ion-list>

                </div>

        </ion-grid>

        <ion-grid v-if="workSheet.StartDate !== '' && workSheet.EndDate !== ''">

            <div v-if="screenWidth < 600">
                <ion-item>
                    <ion-label>
                        <span style="color: red">*</span>{{$t('backoffice.form.fields.selectedStaff')}}
                    </ion-label>
                    <ion-item-group v-if="workSheet.State == 0" slot="end">
                        <ion-button color="primary" @click="resetStaffCalendar()">
                            <span class="iconify" data-icon="mdi:calendar-refresh-outline" data-inline="false"></span>
                        </ion-button>
                    </ion-item-group>
                </ion-item>
                <ion-list>
                    <div v-for="staff in selectedStaff" v-bind:key="staff._id">
                        <ion-item-sliding>
                        <ion-item>
                            <ion-thumbnail slot="start">
                                <ion-img v-if="staff.ImageUrl  != ''" :src="staff.ImageUrl"></ion-img>
                                <ion-img v-else :src="require('../assets/user.png')"></ion-img>
                            </ion-thumbnail>
                            <ion-label>
                                <h2><div style="word-wrap: break-word">{{ staff.FirstName }} {{ staff.LastName }}</div></h2>
                                <h3><div style="word-wrap: break-word">{{ staff.Email }}</div></h3>
                                <h3><div style="word-wrap: break-word">{{getStaffOcuppations(staff.OccupationId)}}</div></h3>
                            </ion-label>
                            <span slot="end" class="iconify" data-icon="mdi:backburger" data-inline="false"></span>
                        </ion-item>
                        <ion-item-options side="end">

                            <ion-item-option color="primary"  v-if="detail == staff._id" @click="detail=''">
                                <span class="iconify" data-icon="icon-park-outline:calendar-three" data-inline="false"></span>
                            </ion-item-option>

                            <ion-item-option color="primary" v-if="detail != staff._id" @click="detail=staff._id">
                                <span class="iconify" data-icon="icon-park-outline:calendar-three" data-inline="false"></span>
                            </ion-item-option>

                            <ion-item-option color="primary" v-if="workSheet.State != 2" @click="resetStaffCalendar(staff._id)">
                                <span class="iconify" data-icon="mdi:calendar-refresh-outline" data-inline="false"></span>
                            </ion-item-option>

                            <ion-item-option color="danger" v-if="workSheet.State != 2" @click="deleteStaff(staff._id)">
                                <ion-icon slot="icon-only" name="trash"></ion-icon>
                            </ion-item-option>
                        </ion-item-options>
                        </ion-item-sliding>
                        <ion-item style="margin-left:0px" v-if="detail == staff._id">
                          <div style="width: 100%;" v-for="sh in myStaffCalendar(staff._id)" v-bind:key="staffHour.indexOf(sh)">
                              <div style="width: 100%;" v-if="sh.IdStaff == staff._id">
                                      <ion-row v-for="date in sh.DaysArray" v-bind:key="sh.DaysArray.indexOf(date)" :style="date.State == 1 ? 'background-color: lightgreen' : ''">
                                          <ion-col size="4" style="margin-top: 18px">
                                              <div>
                                                  {{date.day.format('ddd, YYYY-DD-MM')}}
                                              </div>
                                          </ion-col>
                                          <ion-col size="3" style="margin-top: 7px"> 
                                              <div>
                                                    <ion-datetime placeholder="From" display-format="HH:mm"
                                                     @ionChange="date.hourIn = $event.target.value"  
                                                     v-bind:value="date.hourIn"
                                                     :disabled="workSheet.State == 2 || date.State == 1">
                                                    </ion-datetime>
                                              </div>
                                          </ion-col>
                                          <ion-col size="3" style="margin-top: 7px"> 
                                              <div>
                                                    <ion-datetime placeholder="To" display-format="HH:mm"
                                                    @ionChange="date.hourOut = $event.target.value"  
                                                    v-bind:value="date.hourOut" :min="date.hourIn" :disabled="date.hourIn === '' || workSheet.State == 2 || date.State == 1">
                                                    </ion-datetime>
                                              </div>
                                          </ion-col>
                                          <ion-col size="2" style="margin-top: 7px">  
                                              <div v-if="date.State == 0 && workSheet.State != 2">
                                                  <ion-button @click="addHour(date, sh.IdStaff)"><ion-icon slot="icon-only" name="checkmark"></ion-icon></ion-button>
                                              </div>
                                              <div v-if="date.State == 1 && workSheet.State != 2">
                                                  <ion-button color="danger" @click="delHour(date, sh.IdStaff)"><ion-icon slot="icon-only" name="close"></ion-icon></ion-button>
                                              </div>
                                          </ion-col>
                                      </ion-row>
                                      <ion-row v-if="sh.TotalHour > 0 || sh.TotalMinutes > 0" size="12" style="margin-top: 7px">
                                        <ion-col>
                                            <div style="background-color: lightgreen">
                                                {{$t('backoffice.worksheetStatus.message.totalHour')}}: <b>{{sh.TotalHour}}</b> {{$t('backoffice.worksheetStatus.message.hours')}}<span v-if="sh.TotalMinutes > 0"> {{$t('backoffice.worksheetStatus.message.with')}} <b>{{sh.TotalMinutes}}</b> {{$t('backoffice.worksheetStatus.message.minutes')}}</span>.        
                                            </div>
                                        </ion-col>
                                      </ion-row>
                              </div>
                          </div>
                        </ion-item>
                    </div>
                </ion-list>
            </div>

            <div v-if="screenWidth >= 600">
                <ion-item>
                    <ion-label>
                        <span style="color: red">*</span>{{$t('backoffice.form.fields.selectedStaff')}}
                    </ion-label>
                    <ion-item-group v-if="workSheet.State == 0" slot="end">
                        <ion-button color="primary" @click="resetStaffCalendar()" :v-tooltip="$t('backoffice.worksheetStatus.tooltip.resetAllCalendar')">
                            <span class="iconify" data-icon="mdi:calendar-refresh-outline" data-inline="false"></span>
                        </ion-button>
                    </ion-item-group>
                </ion-item>
                <ion-list>
                    <div v-for="staff in selectedStaff" v-bind:key="staff._id">
                        <ion-item >
                            <ion-thumbnail slot="start">
                                <ion-img v-if="staff.ImageUrl  != ''" :src="staff.ImageUrl"></ion-img>
                                <ion-img v-else :src="require('../assets/user.png')"></ion-img>
                            </ion-thumbnail>
                            <ion-label>
                                <h2><div style="word-wrap: break-word">{{ staff.FirstName }} {{ staff.LastName }}</div></h2>
                                <h3><div style="word-wrap: break-word">{{ staff.Email }}</div></h3>
                            </ion-label>
                            <ion-label>
                                <h2><div style="word-wrap: break-word">{{getStaffOcuppations(staff.OccupationId)}}</div></h2>
                            </ion-label>
                            <ion-item-group side="end">

                                <ion-button color="primary" v-if="detail == staff._id" @click="detail=''" :v-tooltip="$t('backoffice.worksheetStatus.tooltip.showCalendarDetails')">
                                    <span class="iconify" data-icon="icon-park-outline:calendar-three" data-inline="false"></span>
                                </ion-button>
                                <ion-button color="primary" v-if="detail != staff._id" @click="detail=staff._id" v-tooltip="$t('backoffice.worksheetStatus.tooltip.showCalendarDetails')">
                                    <span class="iconify" data-icon="icon-park-outline:calendar-three" data-inline="false"></span>
                                </ion-button>
                                <ion-button v-if="workSheet.State != 2" color="primary" @click="resetStaffCalendar(staff._id)" v-tooltip="$t('backoffice.worksheetStatus.tooltip.resetCalendar')">
                                    <span class="iconify" data-icon="mdi:calendar-refresh-outline" data-inline="false"></span>
                                </ion-button>
                                <ion-button v-if="workSheet.State != 2" color="danger" @click="deleteStaff(staff._id)" v-tooltip="$t('backoffice.worksheetStatus.tooltip.removeStaffWorker') ">
                                    <ion-icon slot="icon-only" name="trash"></ion-icon>
                                </ion-button>
                            </ion-item-group>

                        </ion-item>
                        <ion-item style="margin-left:2px" v-if="detail == staff._id">
                          <div style="width: 100%;" v-for="sh in myStaffCalendar(staff._id)" v-bind:key="staffHour.indexOf(sh)">
                              <div style="width: 100%;" v-if="sh.IdStaff == staff._id">
                                      
                                      <ion-row v-for="date in sh.DaysArray" v-bind:key="sh.DaysArray.indexOf(date)" :style="date.State == 1 ? 'background-color: lightgreen' : ''">
                                          <ion-col size="4" style="margin-top: 18px">
                                              <div>
                                                  {{date.day.format('ddd, YYYY-DD-MM')}}
                                              </div>
                                          </ion-col>
                                          <ion-col size="3" style="margin-top: 7px"> 
                                              <div>
                                                    <ion-datetime placeholder="From" display-format="HH:mm"
                                                     @ionChange="date.hourIn = $event.target.value"  
                                                     v-bind:value="date.hourIn" :disabled="workSheet.State == 2 || date.State == 1">
                                                    </ion-datetime>
                                              </div>
                                          </ion-col>
                                          <ion-col size="3" style="margin-top: 7px"> 
                                              <div>
                                                    <ion-datetime placeholder="To" display-format="HH:mm"
                                                    @ionChange="date.hourOut = $event.target.value"  
                                                    v-bind:value="date.hourOut" :min="date.hourIn" :disabled="date.hourIn === '' || workSheet.State == 2 || date.State == 1">
                                                    </ion-datetime>
                                              </div>
                                          </ion-col>
                                          <ion-col size="1" style="margin-top: 7px">  
                                              <div v-if="date.State == 0 && workSheet.State != 2">
                                                  <ion-button @click="addHour(date, sh.IdStaff)" v-tooltip="'Add this day.'"><ion-icon slot="icon-only" name="checkmark"></ion-icon></ion-button>
                                              </div>
                                              <div v-if="date.State == 1 && workSheet.State != 2">
                                                  <ion-button color="danger" @click="delHour(date, sh.IdStaff)" v-tooltip="'Remove this day.'"><ion-icon slot="icon-only" name="close"></ion-icon></ion-button>
                                              </div>
                                          </ion-col>
                                      </ion-row>
                                      <ion-row v-if="sh.TotalHour > 0 || sh.TotalMinutes > 0" size="12" style="margin-top: 7px">
                                        <ion-col>
                                            <div style="background-color: lightgreen">
                                                {{$t('backoffice.worksheetStatus.message.totalHour')}}: <b>{{sh.TotalHour}}</b> {{$t('backoffice.worksheetStatus.message.hours')}}<span v-if="sh.TotalMinutes > 0"> {{$t('backoffice.worksheetStatus.message.with')}} <b>{{sh.TotalMinutes}}</b> {{$t('backoffice.worksheetStatus.message.minutes')}}</span>.
                                            </div>
                                        </ion-col>
                                      </ion-row>
                              </div>
                          </div>
                        </ion-item>
                    </div>
                </ion-list>
            </div>

        </ion-grid>

        <br/>
        <ion-button v-if="workSheet.State == 0" color="primary" :disabled="!isValidForm()" @click="saveWorkSheet()">{{$t('backoffice.worksheetStatus.button.saveDraft')}}</ion-button>
        <ion-button v-if="workSheet.State == 0" color="primary" :disabled="!isValidForm()" @click="saveWorkSheet(1)">{{$t('backoffice.worksheetStatus.button.saveOpen')}}</ion-button>
        <ion-button v-if="workSheet.State == 1" color="dark" :disabled="!isValidForm()" @click="saveWorkSheet(2)">{{$t('backoffice.worksheetStatus.button.close')}}</ion-button>
    </div>
    </div>
</template>
<script>

import { Api } from '../api/api.js';
import moment from 'moment';
import { Utils } from '../utils/utils.js';

export default{

  name: 'menuForm',
   
  data () {
    return {
      modelName: 'sheethour',
      /****** Form Data ******/
      id: null,

      workSheet: {
          State: 0,
          ResponsableId: this.$store.state.user._id,
          StartDate: '',
          EndDate: '',
          StaffHour: []
      },

      staffHour: [],

      allStaff: [],
      availableStaff: [],
      selectedStaff: [],

      allOccupations: [],

      initialLoading: true,

      isBackdrop: false,
      spinner: false,

      screenWidth : 0,

      detail: '',

      onedate: '',
    }
  },
  created: function(){
    this.screenWidth = screen.width;
    this.fetchAllStaff();
    this.fetchAllOccupations();
  },
  computed: {
        title() {
            return this.id ? this.$t('backoffice.form.titles.workSheetEditTitle') :  this.$t('backoffice.form.titles.workSheetNewTitle');
        }
  },
  methods:{
    getFormatedDate: function(date){
        return Utils.getFormatedDate(date);
    },
    myStaffCalendar(staffId){
        let list = []
        this.staffHour.forEach(staffH => {
            if (staffH.IdStaff == staffId)
                list.push(staffH)
        })
        return list
    },
    checkMess(){
        if (this.selectedStaff.length > 0){
            this.showToastMessage('If you change the date, you must reset calendar.', 'primary')
        }
    },
    resetStaffCalendar(id=null){

        if (id==null){
            
            this.staffHour = []
            this.selectedStaff.forEach(staff => {
                const sh = {
                    IdStaff: staff._id,
                    DaysArray: this.getDaysArray()
                }
                this.staffHour.push(sh)
                this.totalHoursWorked(staff._id)
            })
            
        }
        else{
            this.staffHour.forEach(staffH => {
                if (staffH.IdStaff == id){
                    staffH.DaysArray = this.getDaysArray()
                }
            })
            this.totalHoursWorked(id)
        }
    },
    getStaffOcuppations(OccuppationId){
        const occ = this.allOccupations.filter(ocupp => ocupp._id === OccuppationId)
        if (occ.length > 0)
        {
            console.log(occ[0].Name)
            return occ[0].Name
        }
        
        return ''
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
                        name: 'WorkSheet',
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

        if (this.startDate == "")
        {
            return false
        }
        if (this.endDate == "")
        {
            return false
        }
        if (this.selectedStaff.length == 0)
        {
            return false
        }

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
    fetchAllOccupations: function(){
        Api.fetchAll('occupation')
        .then(response => {
            this.allOccupations = response.data
        })
        .catch(e => {
            console.log(e)
        })
    },
    fetchAllStaff: function(){

    this.$ionic.loadingController
    .create({
    cssClass: 'my-custom-class',
    message: this.$t('backoffice.titles.loading'),
    backdropDismiss: true
    })
    .then(loading => {
        loading.present()
        setTimeout(() => {  // Some AJAX call occurs
        Api.fetchAll('Staff')
        .then(response => {    
            this.allStaff = response.data;
            this.allStaff = this.allStaff.filter(staff => !staff.IsSupport)
            this.id = this.$route.params.workSheetId;
                if (this.id){
                    // this.title = 'Edit menu';
                    Api.fetchById(this.modelName, this.id)
                        .then(responseSheet => {
                        this.initData(responseSheet.data);
                        loading.dismiss();
                        return responseSheet;
                        })
                        .catch(e => {
                        console.log(e);
                        loading.dismiss();
                        this.ifErrorOccured(this.fetchAllStaff);
                        })   
                }
                else{
                this.initAvailableStaff();
                loading.dismiss();
                }
            })
            .catch(e => {
            console.log(e);
            loading.dismiss();
            })  
        })
    })
    },
    initData: function(data){
    this.workSheet = data
    console.log("The Work Sheet", this.workSheet)
    this.selectedStaff = this.mapStaff(this.workSheet.StaffHour);
    this.initAvailableStaff();
    this.syncStaffHours('open')
    },
    mapStaff: function(staffHour){
        let selStaff = [];
        staffHour.forEach(sh => {

        let selS = null;
        this.allStaff.forEach(s => {
            if (sh.IdStaff == s._id)
                selS = s;
        });

        if (selS != null)
            selStaff.push(selS);

        });

        return selStaff;
        
    },
    initAvailableStaff: function(){
        if (this.id)
        {
            let avaStaff = [];
            this.allStaff.forEach(staff => {
                let found = false;
                this.selectedStaff.forEach(selectStaff => {
                    if (selectStaff != null && staff != null){
                    if (selectStaff._id == staff._id)
                        found = true;
                    }
                });
                if (!found)
                avaStaff.push(staff);
            });

            this.availableStaff = avaStaff;
        }
        else
        {
            this.availableStaff = this.allStaff;
        } 
    },
    getDaysArray(){

        /*
        
        [
            {
                "day" : "2021-07-22T16:18:31.773Z",
                "hourIn" : ISODate("2021-07-22T12:18:31.773Z"),
                "hourOut" : ISODate("2021-07-22T16:18:31.773Z"),
                "busy" : [],
                "State": 0 | 1,
            }
        ]

        */


        let daysArray = []
        let sd = moment(this.workSheet.StartDate)
        let ed = moment(this.workSheet.EndDate)
        let thisDate = sd
        let inc = 1
        let diff = ed.diff(thisDate, 'days')
        
        console.log(ed.diff(thisDate, "days"))

        let obj = {
            "day" : thisDate,
            "hourIn" : '',
            "hourOut" : '',
            "busy" : [],
            "State": 0,
        }
        daysArray.push(obj)

        while(diff > 0){
            thisDate = moment(this.workSheet.StartDate).add(inc, "days")
            obj = {
                "day" : thisDate,
                "hourIn" : '',
                "hourOut" : '',
                "busy" : [],
                "State": 0,
            }
            daysArray.push(obj)
            inc = inc + 1
            diff--
        }

        return daysArray
    },
    addStaff: function(id){
        let s = this.availableStaff.find(staff => staff._id == id);
        this.selectedStaff.push(s);

        var staffIndex = this.availableStaff.indexOf(s); // get index
        this.availableStaff.splice(staffIndex, 1);

        //Agregar staff al objeto
    //   const sh = {
    //       IdStaff: id,
    //       DaysArray: []
    //   }
    //   this.workSheet.StaffHour.push(sh)
    //   console.log(this.workSheet)

        //Agregar staff a staffHour
        const sh = {
            IdStaff: id,
            TotalHour: 0,
            TotalMinutes: 0,
            DaysArray: this.getDaysArray()
        }
        console.log(sh)
        this.staffHour.push(sh)
    },
    deleteStaff: function(id){
        let s = this.selectedStaff.find(staff => staff._id == id);
        this.availableStaff.push(s);

        var staffIndex = this.selectedStaff.indexOf(s);
        this.selectedStaff.splice(staffIndex, 1);

        //Quitar staff del objeto
    //   let i = 0
    //   let find = false
    //   this.workSheet.StaffHour.forEach(sh => {
    //       // console.log(id, sh.IdStaff)
    //       if (sh.IdStaff == id){
    //           find = true
    //       }
    //       if (!find)
    //         i++
    //   })
    //   if (find){
    //       this.workSheet.StaffHour.splice(i, 1)
    //       // console.log(this.workSheet)
    //   }

    // Quitar staff de staffHour
        let i = 0
        let find = false
        this.staffHour.forEach(sh => {
            if (sh.IdStaff == id){
                find = true
            }
            if (!find)
            i++
        })
        if (find){
            this.staffHour.splice(i, 1)
        }
    },
    totalHoursWorked(IdStaff){
        const staffh = this.staffHour.find(sh => sh.IdStaff == IdStaff)
        console.log(staffh)

        let count = 0
        staffh.DaysArray.forEach(d => {
            if (d.State == 1)
            {
                let hi = moment(d.hourIn)
                let ho = moment(d.hourOut)
                count += ho.diff(hi ,'minutes')
            }
        });

        let hours = Math.floor(count/60)
        let minutes = count % 60 
        this.staffHour.find(sh => sh.IdStaff == IdStaff).TotalHour = hours
        this.staffHour.find(sh => sh.IdStaff == IdStaff).TotalMinutes = minutes
    },
    validityAdd(date){
        if (date.hourIn == '' || date.hourOut == '')
            return false
        return true
    },
    addHour(date, IdStaff){
        if (this.validityAdd(date))
        {
            this.staffHour.find(sh => sh.IdStaff == IdStaff).DaysArray.find(d => d === date).State = 1
            this.totalHoursWorked(IdStaff)
        }
        else
            this.showToastMessage('You must fill the correspond hour fields', 'danger')
    },
    delHour(date, IdStaff){
        this.staffHour.find(sh => sh.IdStaff == IdStaff).DaysArray.find(d => d === date).State = 0
        this.totalHoursWorked(IdStaff)
    },
      // Create or edit a new menu
    syncStaffHours(action='save'){
        //Sujeto a implementación
        if (action == 'save'){
            let staffh = []
            this.staffHour.forEach(sh => {
                let dayArr = []
                sh.DaysArray.forEach(da => {
                    if (da.State == 1){
                        dayArr.push({
                            day: da.day,
                            hourIn: da.hourIn,
                            hourOut: da.hourOut,
                            busy: da.busy
                        })
                    }
                })
                staffh.push({
                    IdStaff: sh.IdStaff,
                    DaysArray: dayArr
                })
            })
            this.workSheet.StaffHour = staffh
        }
        if (action == 'open'){
            this.selectedStaff.forEach(staff => {

                const sh = {
                    IdStaff: staff._id,
                    TotalHour: 0,
                    TotalMinutes: 0,
                    DaysArray: this.getDaysArray()
                }

                this.workSheet.StaffHour.forEach(staffh => {

                    if (staffh.IdStaff == sh.IdStaff){
                        console.log(staffh.IdStaff)
                        staffh.DaysArray.forEach(day => {
                            sh.DaysArray.forEach(mday => {
                                console.log("day",day.day)
                                console.log("mday", mday.day.toISOString())
                                if (day.day === mday.day.toISOString()){
                                    mday.State = 1
                                    mday.hourIn = day.hourIn
                                    mday.hourOut = day.hourOut
                                    mday.busy = day.busy
                                }
                            })
                        });
                    }

                })

                this.staffHour.push(sh)
                this.totalHoursWorked(staff._id)
            })
        }
    },

    saveWorkSheet: function(state=0){

    if (this.isValidForm())
    {
        this.isBackdrop = true;

        this.workSheet.State = state;
        
        this.syncStaffHours();

        console.log(this.workSheet)
        
        //If I am editing
        if (this.id){
            this.spinner = true;
            Api.putIn(this.modelName, this.workSheet)
                .then(response => {
                    this.showToastMessage(this.$t('backoffice.list.messages.messageEditSuccessWorksheet'), "success");
                    this.spinner = false;
                    this.$router.push({
                        name: 'WorkSheet', 
                    });
                    return response;
                })
                .catch(e => {
                    this.isBackdrop = false;
                    console.log(e);
                    this.spinner = false;
                    this.ifErrorOccured(this.saveWorkSheet);
                })
        }
        else{
        //     //Else, I am created a new worksheet
            this.spinner = true;
            Api.postIn(this.modelName, this.workSheet)
                .then(response => {
                    this.showToastMessage(this.$t('backoffice.list.messages.messageCreateSuccessWorksheet'), "success");
                    this.spinner = false;
                    this.$router.push({
                        name: 'WorkSheet', 
                    });
                    return response;
                })
                .catch(e => {
                    this.isBackdrop = false;
                    console.log(e);
                    this.spinner = false;
                    this.ifErrorOccured(this.saveWorkSheet);
                })
        }

    }
    
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

</style>