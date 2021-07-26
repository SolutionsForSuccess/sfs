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
                    <div>
                        <ion-datetime style="border-bottom: 1px solid darkred" name="startdate" @ionChange="workSheet.StartDate = $event.target.value" 
                            v-bind:value="workSheet.StartDate" :placeholder="$t('backoffice.form.titles.startDate')">
                        </ion-datetime>
                    </div>
                </ion-col>
                <ion-col>
                    <div>
                        <ion-datetime style="border-bottom: 1px solid darkred" name="enddate" @ionChange="workSheet.EndDate = $event.target.value" 
                            v-bind:value="workSheet.EndDate" :placeholder="$t('backoffice.form.titles.endDate')">
                        </ion-datetime>
                    </div>
                </ion-col>
            </ion-row>
            <!-- <ion-button @click="getDatesOfSheet()">Dates</ion-button> -->
        </ion-grid>

        <ion-grid v-if="workSheet.StartDate !== '' && workSheet.EndDate !== ''">

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
                            <ion-item-option color="primary" >
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
                                <ion-button color="primary" @click="addStaff(staff._id)">
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
                                <span class="iconify" data-icon="mdi-light:chevron-double-up" data-inline="false"></span>
                            </ion-item-option>

                            <ion-item-option color="primary" v-if="detail != staff._id" @click="detail=staff._id">
                                <span class="iconify" data-icon="mdi-light:chevron-double-down" data-inline="false"></span>
                            </ion-item-option>

                            <ion-item-option color="danger" >
                                <ion-icon slot="icon-only" name="trash" @click="deleteStaff(staff._id)"></ion-icon>
                            </ion-item-option>
                        </ion-item-options>
                        </ion-item-sliding>
                        <ion-item style="margin-left:2px" v-if="detail == staff._id">
                          <div v-for="sh in workSheet.StaffHour" v-bind:key="workSheet.StaffHour.indexOf(sh)">
                              <div v-if="sh.IdStaff == staff._id">
                                      <ion-row v-for="date in getDatesOfSheet()" v-bind:key="getDatesOfSheet().indexOf(date)">
                                          <ion-col>  
                                              <ion-checkbox></ion-checkbox>
                                          </ion-col>
                                          <ion-col style="margin-top: 18px">
                                              {{date.format('YYYY-DD-MM')}}
                                          </ion-col>
                                          <ion-col style="margin-top: 7px"> 
                                              <ion-datetime 
                                                placeholder="From" display-format="HH:mm">
                                              </ion-datetime>
                                          </ion-col>
                                          <ion-col style="margin-top: 7px"> 
                                              <ion-datetime
                                                  placeholder="To" display-format="HH:mm">
                                              </ion-datetime>
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

                                <ion-button color="primary" v-if="detail == staff._id" @click="detail=''">
                                    <span class="iconify" data-icon="mdi-light:chevron-double-up" data-inline="false"></span>
                                </ion-button>
                                <ion-button color="primary" v-if="detail != staff._id" @click="detail=staff._id">
                                    <span class="iconify" data-icon="mdi-light:chevron-double-down" data-inline="false"></span>
                                </ion-button>

                                <ion-button color="danger" @click="deleteStaff(staff._id)">
                                    <ion-icon slot="icon-only" name="trash"></ion-icon>
                                </ion-button>
                            </ion-item-group>

                        </ion-item>
                        <ion-item style="margin-left:75px" v-if="detail == staff._id">
                           <div v-for="sh in workSheet.StaffHour" v-bind:key="workSheet.StaffHour.indexOf(sh)">
                              <div v-if="sh.IdStaff == staff._id">
                                  <ion-row v-for="date in getDatesOfSheet()" v-bind:key="getDatesOfSheet().indexOf(date)">
                                      <ion-col>  
                                          <ion-checkbox></ion-checkbox>
                                      </ion-col>
                                      <ion-col style="margin: 18px">
                                          {{date.format('YYYY-DD-MM')}}
                                      </ion-col>
                                      <ion-col style="margin: 7px"> 
                                          <ion-datetime 
                                            :placeholder="$t('backoffice.form.titles.pickFromSelect')" display-format="HH:mm">
                                          </ion-datetime>
                                      </ion-col>
                                      <ion-col style="margin: 7px"> 
                                          <ion-datetime
                                              :placeholder="$t('backoffice.form.titles.pickToSelect')" display-format="HH:mm">
                                          </ion-datetime>
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
        <ion-button expand="full" color="primary" :disabled="!isValidForm()" @click="saveWorkSheet()">{{ $t('backoffice.form.buttons.save') }}</ion-button>
    </div>
    </div>
</template>
<script>

import { Api } from '../api/api.js';
import moment from 'moment'

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

      allStaff: [],
      availableStaff: [],
      selectedStaff: [],

      allOccupations: [],

      initialLoading: true,

      isBackdrop: false,
      spinner: false,

      screenWidth : 0,

      detail: '',
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
        getDatesOfSheet(){
            let dates = []
            let sd = moment(this.workSheet.StartDate)
            let ed = moment(this.workSheet.EndDate)

            let thisDate = sd

            console.log(ed.diff(thisDate, "days"))
            let inc = 1
            let diff = ed.diff(thisDate, 'days')
            
            dates.push(thisDate)

            while(diff > 0){
                thisDate = moment(this.workSheet.StartDate).add(inc, "days")
                dates.push(thisDate)
                inc = inc + 1
                diff--
            }

            dates.forEach(d => {
              console.log(d.format('YYYY-MM-DD'))
            });
            return dates

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
        this.selectedStaff = this.mapStaff(this.workSheet.StaffHour);
        this.initAvailableStaff();
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
      addStaff: function(id){
          let s = this.availableStaff.find(staff => staff._id == id);
          this.selectedStaff.push(s);

          var staffIndex = this.availableStaff.indexOf(s); // get index
          this.availableStaff.splice(staffIndex, 1);

          //Agregar staff al objeto
          const sh = {
              IdStaff: id,
              DaysArray: []
          }
          this.workSheet.StaffHour.push(sh)
          console.log(this.workSheet)
      },
      deleteStaff: function(id){
          let s = this.selectedStaff.find(staff => staff._id == id);
          this.availableStaff.push(s);

          var staffIndex = this.selectedStaff.indexOf(s);
          this.selectedStaff.splice(staffIndex, 1);

          //Quitar staff del objeto
          let i = 0
          let find = false
          this.workSheet.StaffHour.forEach(sh => {
              // console.log(id, sh.IdStaff)
              if (sh.IdStaff == id){
                  find = true
              }
              if (!find)
                i++
          })
          if (find){
              this.workSheet.StaffHour.splice(i, 1)
              // console.log(this.workSheet)
          }
      },
      // Create or edit a new menu
    createStaffHourObject: function(){

        // let sCategories = [];
        // // let productItem = null;
        // this.selectedCategories.forEach(categorySelected => {
        //     if (categorySelected != null)
        //         sCategories.push(categorySelected._id);
        // });
        //  return sCategories;

        //Sujeto a implementación
      },
     saveWorkSheet: function(){

        if (this.isValidForm())
        {
            this.isBackdrop = true;
            let staffHour = this.createStaffHourObject();
            let item = {
                "ResponsableId": this.$store.state.user._id,
                "StartDate": this.startDate,
                "EndDate": this.endDate,
                "StaffHour": staffHour,
                "State": 0,
            }

            //If I am editing
            if (this.id){
              item['_id'] = this.id;
              this.spinner = true;
              Api.putIn(this.modelName, item)
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
              //Else, I am created a new worksheet
              this.spinner = true;
              Api.postIn(this.modelName, item)
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