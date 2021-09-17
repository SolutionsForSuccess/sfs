<template>

    <div id="user" class="page">
            <listView v-if="1"
              :title="$t('backoffice.titles.workSheet')"
              :filter="filterWorkSheet"
              :elements="workSheets"      
              :viewSelected="'Admin'"     
              :add="hasPermission('canCreateWorkSheet')"
              :edit="hasPermission('canEditWorkSheet')"
              :remove="hasPermission('canDeleteWorkSheet')"
              @handleInput="handleInput"
              @handleAddClick="createWorkSheet"   
              @editElement="viewWorkSheet"
              @deleteElement="deleteWorkHour"   
            ></listView>
          </div>

</template>

<script>

import { Api } from '../api/api.js';
import { Utils } from '../utils/utils.js';
import listView from "../components/ListView";
export default {

  name: 'sheethour',
  components:{   
    listView,
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
      statesAll: [{state: 0,
                name: this.$t('backoffice.worksheetStatus.draft')}, 
                {state: 1,
                name:this.$t('backoffice.worksheetStatus.opened')}, 
                {state: 2,
                name:this.$t('backoffice.worksheetStatus.closed')}],

      paginate: ['languages'],

      spinner: false,
      screenWidth: 0,

      filterStatus: "all",
      menuactive: 'list',
      
      cartKey: 0,
      stateKey: 0,  
      keyList: 0,        
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

  async doRefresh() {
      this.spinner = true;
      await Api.fetchAll(this.modelName).then(response => {
      this.$store.state.backConfig.shestHour = response.data
      this.workSheets = this.$store.state.backConfig.shestHour;
      this.filterWorkSheet = this.workSheets;  
      this.spinner = false;
       this.keyList ++;
      })
      .catch(e => {
        e;
        this.spinner = false;
      });
        
  },

    ListViewData(option, count){
      if(count === 1) return null;
      if(count === 2) return this.status[option.State]
      if(count === 3) return null
      if(count === 4) return null
      if(count === 5) return this.getFormatedDate(option.StartDate) +' - ' +this.getFormatedDate(option.EndDate);

    },

    handleInput(value) {
       this.filterWorkSheet = this.workSheets
      const query = value.toLowerCase();
      requestAnimationFrame(() => {
        let cat2 = this.workSheets.filter( (item) =>
          this.statesAll[item.State].name.toLowerCase().indexOf(query) > -1
        );
        if (cat2.length > 0) this.filterWorkSheet = cat2;
        else this.filterWorkSheet = this.workSheets;
      });
    },
   
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
            e
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
            e
            this.spinner = false
        })
    },

    async getStaffName(staffId){
        const s = this.allStaff.find(staff => staff._id == staffId)        
        if (s){
          return s.FirstName + ' ' + s.LastName
        }
        else{
          const staff =await Api.fetchById('staff', staffId);
          if(staff.status === 200)
            if(staff.data.FirstName && staff.data.LastName) 
              return staff.data.FirstName +' '+ staff.data.LastName;
        }
        return ''
    },

    changeFilterStatus(value){

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
                  e;
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