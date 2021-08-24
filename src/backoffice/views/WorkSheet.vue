<template>

  <div id="worksheet" class="screen" >
   
      <ion-header>
            <ion-toolbar>
              <ion-buttons slot="start">
                <ion-back-button default-href="/controlPanel" @click="$router.push({ name: 'ControlPanel'})"></ion-back-button>
              </ion-buttons>
              <ion-label style="padding: 20px 100px;">
                <h1>{{$t('backoffice.titles.workSheet')}}</h1>                          
              </ion-label> 
              <ion-label slot="end">  
                  <ion-chip style="font-size: 30px" v-if="hasPermission('canCreateWorkSheet')" outline color="primary" @click="createWorkSheet()" >
                      <ion-label><ion-icon name="add"></ion-icon></ion-label>
                  </ion-chip>
              </ion-label> 
              <!-- <ion-label slot="end">  
                  <ion-chip style="font-size: 30px" v-if="hasPermission('canChangeSetting')" outline color="primary" @click="showSettingModal()" >
                      <ion-label><span class="iconify" data-icon="ic:baseline-settings" data-inline="false"></span></ion-label>
                  </ion-chip>
              </ion-label>  -->
            </ion-toolbar>

              <div> 
                  <ion-button @click="menuactive='list'" :style="menuactive==='list'? 'opacity: 1;;border: outset;' : 'opacity: 0.65;border: none;' ">
                    <span class="iconify" data-icon="foundation:list-bullet" data-inline="false" style="width: 20px;height: 20px;margin: 5px;"></span>
                  </ion-button>  
                  <ion-button    @click="menuactive='grid'" :style="menuactive==='grid'? 'opacity: 1;border: outset;' : 'opacity: 0.65;border: none;' ">
                    <span class="iconify" data-icon="clarity:grid-chart-solid" data-inline="false" style="width: 20px;height: 20px;margin: 5px;"></span>
                  </ion-button>  
                  <ion-button style="border: outset;" @click="reverseWorkSheet()">
                    <span class="iconify" data-icon="fluent:chevron-up-down-20-filled" data-inline="false" style="width: 20px;height: 20px;margin: 5px;"></span>
                  </ion-button>
              </div> 

            <!-- <ion-searchbar  
                @input="handleInput($event.target.value)" @ionClear="filterWorkSheet = workSheets"
                  :placeholder="$t('frontend.home.search')">           
            </ion-searchbar> -->
            <div style="width: 100%">
                <ion-segment scrollable color="tertiary" @ionChange="changeFilterStatus($event.target.value)" :value="filterStatus">
                    <ion-segment-button value="all">
                          {{$t('frontend.reservation.all')}}
                    </ion-segment-button>
                    <ion-segment-button value="draft">
                          {{status[0]}}
                    </ion-segment-button>
                    <ion-segment-button value="open">
                          {{status[1]}}
                    </ion-segment-button>
                    <ion-segment-button value="close">
                          {{status[2]}}
                    </ion-segment-button>
                </ion-segment>
            </div>
      </ion-header>

    <div v-if="spinner">
      <ion-progress-bar type="indeterminate"></ion-progress-bar>
    </div>

    <div> 
          <paginate v-if="filterWorkSheet.length > 0 && menuactive==='list'"
            name="languages"
            :list="filterWorkSheet"
            :per="8">
            
              <ion-item-sliding  v-for="workSheet in paginated('languages')" v-bind:key="workSheet._id">
                <ion-item
                    @click="viewWorkSheet(workSheet._id)"
                    :style="workSheet.State == 0 ? '--background:#a3a89d' : workSheet.State == 1 ? '--background:#2f7ca2' : '--background:#2d2c29'">
                    <ion-label>
                        <h4 style="color: white;">{{$t('backoffice.worksheetStatus.fields.responsable')}}</h4>
                        <h3 style="color: white;">{{getStaffName(workSheet.ResponsableId)}}</h3>
                    </ion-label> 
                    <ion-label>
                        <h5 style="color: white;">{{$t('backoffice.worksheetStatus.fields.startDate')}}</h5>
                        <h6><span style="color: white;">{{ getFormatedDate(workSheet.StartDate) }}</span></h6>
                    </ion-label>
                    <ion-label>
                        <h5 style="color: white;">{{$t('backoffice.worksheetStatus.fields.endDate')}}</h5>
                        <h6><span style="color: white;">{{ getFormatedDate(workSheet.EndDate) }}</span></h6>
                    </ion-label>
                    <ion-label>
                        <h5 style="color: white;">{{ status[workSheet.State] }}</h5>
                    </ion-label>             
                </ion-item>
                <ion-item-options side="end"> 
                    <ion-item-option color="primary" v-if="hasPermission('canEditWorkSheet')" @click="viewWorkSheet(workSheet._id)">
                      <ion-icon slot="icon-only" name="list"></ion-icon>
                    </ion-item-option>
                    <ion-item-option v-if="workSheet.State==0 && hasPermission('canEditWorkSheet')" color="success" @click="openWorkSheet(workSheet)">
                      <ion-icon slot="icon-only" name="checkmark"></ion-icon>
                    </ion-item-option>
                    <ion-item-option v-if="workSheet.State==1 && hasPermission('canEditWorkSheet')" color="danger" @click="closeWorkSheet(workSheet)">
                      <ion-icon slot="icon-only" name="close"></ion-icon>
                    </ion-item-option>
                    <ion-item-option color="danger" v-if="hasPermission('canDeleteWorkSheet') && workSheet.State == 0"
                        @click="deleteWorkHour(workSheet._id)" :v-tooltip="$t('backoffice.list.actions.delete')">
                        <ion-icon slot="icon-only" name="trash"></ion-icon>
                    </ion-item-option>
                </ion-item-options >
              </ion-item-sliding>

          </paginate>
          <div v-if="filterWorkSheet.length > 0  && menuactive==='list'">
              <paginate-links for="languages" color="primary" 
                :simple="{
                  next:'»' ,
                  prev: '« ' }"
              ></paginate-links>
          </div>

          <div v-if="menuactive==='grid'"  id="gridView">
              <v-breakpoint>
                <div slot-scope="scope" > 

                  <div style="display: flex;flex-wrap: wrap;flex-direction: row;align-items: flex-start;">    

                    <ion-chip color="primary"
                      @click="scrollToTop()"
                    outline style="position: fixed; right: 0;top: 50%;padding: 0; z-index: 20;">
                      <span class="iconify" data-icon="ant-design:caret-up-filled" data-inline="false" style="margin: 0"></span>
                    </ion-chip>

                    <div  v-for="workSheet in filterWorkSheet" v-bind:key="workSheet._id" 
                        style="text-align: right;"             
                        :class="scope.isLarge || scope.isXlarge ? 'menu-col-3 card-categories' : scope.isMedium? 'menu-col-4 card-categories' : scope.isSmall || scope.noMatch ?'menu-col-12 card-categories': 'menu-col-3 card-categories'">
                            
                          <ion-chip style="margin: 0;bottom: -10px; font-weight: bold;" outline
                              :style="workSheet.State == 0 ? '--background:#a3a89d' : workSheet.State == 1 ? '--background:#2f7ca2' : '--background:#2d2c29'">
                            {{ getFormatedDate(workSheet.StartDate) }} / {{ getFormatedDate(workSheet.EndDate) }}
                          </ion-chip>
                        <ion-card style="text-align: left;"   
                        :style="workSheet.State == 0 ? '--background:#a3a89d' : workSheet.State == 1 ? '--background:#2f7ca2' : '--background:#2d2c29'">
                            <ion-card-header style="margin: 10px 5px 2px; padding: 10px;background:white;color: black;">
                              <ion-card-title  style="color: black;">
                                  {{ status[workSheet.State] }}
                              </ion-card-title>
                              
                              <!-- <ion-card-subtitle style="color: black; display: flex;justify-content: space-between;">
                                <div style="text-align: center;"> 
                                  <span class="iconify" data-icon="bx:bxs-user-circle" data-inline="false" 
                                  style="color: #808080a6;width: 20px;  height: 20px; margin: 0;"></span>
                                </div>
                                <div style="text-align: right;"  >{{ getCustomerById(credit.CustomerId).Name }}</div>
                              </ion-card-subtitle> -->
                                
                              </ion-card-header>

                              <ion-card-content style="margin: 1px 5px; padding: 5px;background:white;color: black;" :key="cartKey + 'C'">
                                  
                                  <ion-card-subtitle  style="color: black; display: flex;justify-content: space-between;">
                                      {{$t('backoffice.worksheetStatus.fields.workers')}}
                                  </ion-card-subtitle>
                                  <div v-for="sh in workSheet.StaffHour" v-bind:key="sh.IdStaff">
                                      <ion-row>
                                          <ion-col>
                                              - {{getStaffName(sh.IdStaff)}}
                                          </ion-col>
                                      </ion-row>
                                  </div>
                              </ion-card-content>
                              
                              <ion-card-content style="margin:5px; background:white;color: black;text-align: center; padding: 0;" :key="stateKey + 'S'">
                                    <ion-button color="primary" v-if="hasPermission('canEditWorkSheet')" @click="viewWorkSheet(workSheet._id)">
                                        <ion-icon slot="icon-only" name="list"></ion-icon>
                                    </ion-button>
                                    <ion-button v-if="workSheet.State==0 && hasPermission('canEditWorkSheet')" color="success" @click="openWorkSheet(workSheet)">
                                        <ion-icon slot="icon-only" name="checkmark"></ion-icon>
                                    </ion-button>
                                    <ion-button v-if="workSheet.State==1 && hasPermission('canEditWorkSheet')" color="danger" @click="closeWorkSheet(workSheet)">
                                        <ion-icon slot="icon-only" name="close"></ion-icon>
                                    </ion-button>
                                    <ion-button color="danger" v-if="hasPermission('canDeleteWorkSheet') && workSheet.State == 0"
                                        @click="deleteWorkSheet(workSheet._id)" :v-tooltip="$t('backoffice.list.actions.delete')">
                                        <ion-icon slot="icon-only" name="trash"></ion-icon>
                                    </ion-button>
                              </ion-card-content>              
                        </ion-card>
                    </div>
                  </div>
                </div>
              </v-breakpoint>
          </div>


          <div class="emptyResult" v-if="filterWorkSheet.length == 0">
              {{$t('backoffice.titles.emptyResult')}}
          </div>
    </div> 

  </div>

</template>

<script>

import { Api } from '../api/api.js';
import { Utils } from '../utils/utils.js';
// import { payAuthorizeNet } from '../api/payments.js';
// import Modal from './cancelOrderModal.vue';
// import { EventBus } from '../../frontend/event-bus';
 import { VBreakpoint } from 'vue-breakpoint-component'
//  import CreditSetting from './creditSetting.vue'
//  import CreditApprove from './CustomerCreditApprove.vue'
export default {

  name: 'sheethour',
  components:{   
    VBreakpoint: VBreakpoint 
  },  
  data () {
    return {
      modelName: 'sheethour',
      workSheets: [],
      filterWorkSheet: [],

      allStaff: [],

      resConf: null,
      homeOrders: false,
      restaurantCustomer: null,

      update: null,
      loading: null,

      status: [this.$t('backoffice.worksheetStatus.draft'), this.$t('backoffice.worksheetStatus.opened'), this.$t('backoffice.worksheetStatus.closed')],

      paginate: ['languages'],

      spinner: false,
      screenWidth: 0,

      filterStatus: "all",
      menuactive: 'list',
      
      cartKey: 0,
      stateKey: 0,          
    }
  },
  async created(){
  this.screenWidth = screen.width;
  this.allStaff = this.$store.state.backConfig.staff;
  this.workSheets = this.$store.state.backConfig.shestHour;
  // this.workSheets.reverse();
  this.filterWorkSheet = this.workSheets; 
  this.changeFilterStatus('all');
     
  }, 
  methods: {
   
    async openWorkSheet(workSheet){
        this.spinner = true
        workSheet.State = 1
        await Api.putIn(this.modelName, workSheet)
        .then(() => {
            this.spinner = false
            const index = this.$store.state.backConfig.shestHour.findIndex( w=> w._id === workSheet._id);
            if(index !== -1){ 
              this.$store.state.backConfig.shestHour[index]= workSheet;
              this.workSheets = this.$store.state.backConfig.shestHour;
              // this.workSheets.reverse();
              this.filterWorkSheet = this.workSheets; 
            }
            this.showToastMessage('The worksheet was opened successfully.', 'success')
        })
        .catch(e => {
            this.showToastMessage(e, 'danger')
            console.log(e)
            this.spinner = false
        })
    },

    async closeWorkSheet(workSheet){
        this.spinner = true
        workSheet.State = 2
        await Api.putIn(this.modelName, workSheet)
        .then(() => {
            this.spinner = false
            const index = this.$store.state.backConfig.shestHour.findIndex( w=> w._id === workSheet._id);
            if(index !== -1){ 
              this.$store.state.backConfig.shestHour[index]= workSheet;
              this.workSheets = this.$store.state.backConfig.shestHour;
              // this.workSheets.reverse();
              this.filterWorkSheet = this.workSheets; 
            }
            this.showToastMessage('The worksheet was closed successfully.', 'success')
        })
        .catch(e => {
            this.showToastMessage(e, 'danger')
            console.log(e)
            this.spinner = false
        })
    },

    getStaffName(staffId){
        const s = this.allStaff.find(staff => staff._id == staffId)
        console.log(staffId, s)
        if (s){
          console.log(s.FirstName + ' ' + s.LastName)
          return s.FirstName + ' ' + s.LastName
        }
        return ''
    },

    changeFilterStatus(value){

        //console.log(value)
        this.filterStatus = value
        let status = -1
        if (value == 'all')
        {
            this.filterWorkSheet = this.workSheets
            return
        }
        if (value == 'draft')
        {
            status = 0
        }
        if (value == 'open')
        {
            status = 1
        }
        if (value == 'close')
        {
            status = 2
        }
        requestAnimationFrame(() => {
          let cat2 = this.workSheets.filter(item => item.State == status)
          this.filterWorkSheet = cat2
        })
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

    showToastMessage(message, tColor){
      return this.$ionic.toastController.create({
        color: tColor,
        position: 'top',
        duration: 3000,
        message: message,
        showCloseButton: false
      }).then(a => a.present())
    },

    deleteWorkHour: function(id){

        this.$ionic.alertController.create({
        title: this.$t('backoffice.list.messages.confirmDelete'),
        message: this.$t('backoffice.list.messages.deleteWorkSheet'),
        buttons: [
          {
            text: this.$t('backoffice.list.messages.buttons.cancel'),
            role: 'cancel',
            handler: () => {}
          },
          {
            text: this.$t('backoffice.list.messages.buttons.delete'),
            handler: () => {
              
              this.spinner = true;
              Api.deleteById(this.modelName, id)
                .then(response => {
                  const index = this.$store.state.backConfig.shestHour.findIndex( w=> w._id === id);
                  if(index !== -1){ 
                    this.$store.state.backConfig.shestHour.splice(index, 1)
                    this.workSheets = this.$store.state.backConfig.shestHour;
                    // this.workSheets.reverse();
                    this.filterWorkSheet = this.workSheets; 
                   }
                  this.showToastMessage(this.$t('backoffice.list.messages.messageDeleteSuccessWorkSheet'), "success");
                  this.spinner = false;
                  return response;
                })
                .catch(e => {
                  console.log(e);
                  this.ifErrorOccured(mess => {
                      this.deleteWorkHour(id)
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
    // handleInput(value){
    //   this.filterWorkSheet = this.workSheets
    //   console.log(value)
    //   const query = value.toLowerCase();
    //   requestAnimationFrame(() => {   
    //     let cat2 = this.workSheet.filter(item => 
    //                                       item.StartDate.indexOf(query) > new Date() || 
    //                                            this.getOrderState(item.State).toLowerCase().indexOf(query) > -1)
    //     if(cat2.length> 0)
    //       this.filterCredits = cat2
    //     else
    //       this.filterCredits = this.credits
    //   });
    // },
    viewWorkSheet: function(id){
        if (this.hasPermission('canEditWorkSheet'))
        {
            this.$router.push({
              name: 'WorkSheet-Form', 
              params: { workSheetId: id }
            });
        }
    },

    getFormatedDate: function(date){
        return Utils.getFormatedDate(date);
    },

  
    createWorkSheet: function(){
        this.$router.push({
            name: 'WorkSheet-Form', 
        });
    },

    hasPermission(permission){
        
        let res = false;
        if (this.$store.state.authenticated)
        {
            let roles = this.$store.state.roles;
            for (let index = 0; index < roles.length; index++) {
                switch(permission){                        
                      case 'canCreateWorkSheet':
                          res = roles[index].canCreateWorkSheet;
                          break;
                      case 'canEditWorkSheet':
                          res = roles[index].canEditWorkSheet;
                          break;
                      case 'canDeleteWorkSheet':
                          res = roles[index].canDeleteWorkSheet;
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
    reverseWorkSheet(){
      this.filterWorkSheet.reverse();
    },
    scrollToTop() {
      document.querySelector('ion-card-content').scrollToTop(500);
    },

  },

}

</script>

<style>

html {
  scroll-behavior: smooth;
}

.emptyResult{
    padding: 20px;
}

.card-categories{
  float: left;
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
        padding-left: 10%;
        padding-right: 10%;
        border: #edf1ee solid 1px;
        margin-right: 10%;
        margin-left: 10%;
        /* border-radius: 25px; */
    }

}

</style>