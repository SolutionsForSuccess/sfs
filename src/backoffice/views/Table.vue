<template>
  <div id="mesa" class="screen">

    <ion-segment id="reservationSegment" scrollable
      @ionChange="segmentChanged($event.target.value)"
      :value="segmentValue"
        @input="value=segmentValue"
        style="widht: 100%">
        <ion-segment-button value="table">
            <span class="iconify" data-icon="vs:table"></span>                  
        </ion-segment-button>
      
        <ion-segment-button value="maket">
            <span class="iconify" data-icon="ri:paint-brush-line"></span>        
        </ion-segment-button>
    </ion-segment>

      
    <div v-if="table">
   
      <div id="user" class="page">
        <listView
          :title="$t('backoffice.titles.tables')"
          :filter="filterTables"
          :elements="tables"
          :showQrTable="true"
          :showOrderTable="true"
          :viewSelected="'Admin'"
          :add="hasPermission('canCreateTable')"
          :edit="hasPermission('canEditTable')"
          :remove="hasPermission('canDeleteTable')"
          @handleInput="handleInput"
          @handleAddClick="addTableForm"   
          @editElement="editTable"
          @deleteElement="deleteTable"   
        ></listView>
      </div>

    </div>

   

    <div v-if="maket">
        <div style="display: flex;justify-content: flex-end;" :key="editMaket+keyRow">
           <div  v-if="editMaket" style="display: flex;align-items: center;"> 
                <ion-label> {{$t('frontend.order.culumnNumber')}}    </ion-label>            
                  <ion-input type="number" value="1" style="    width: 80px;" @input.stop="rowC=$event.target.value"></ion-input>
                  <ion-button @click="addRowColumn(rowC)" :disabled="keyEdit?'true': 'false'">                    
                    Add Fila ff</ion-button>
            </div>
          <ion-button v-if="editMaket" @click="saveSetting()" :disabled="keyEdit?'true': 'false'">
              <ion-spinner v-if="keyEdit" ></ion-spinner>
             <div v-if="!keyEdit"> <span class="iconify" data-icon="ant-design:save-outlined" data-inline="false" style="margin: 0;"></span></div>
          </ion-button>
           <ion-button v-if="!editMaket" @click="editMaket=true">
              <span class="iconify" data-icon="ant-design:edit-outlined" data-inline="false" style="margin: 0;"></span>
          </ion-button>
        </div>
        <div class="menu-col-12">            
            <ion-reorder-group disabled="false" @ionItemReorder="doReorder($event)" class="menu-col-12" style="float: left;" :key="keyRow+'R'">
              <div 
                v-for="(r, index ) in restaurantSetting.TableDesign" :key="index" 
                class="menu-col-12" style="display: flex;position: relative;"
                >
              
                <div v-for="(r1, index1 ) in r.length" :key="index1" 
                  :style="' display: flex; flex-direction: column; align-items: center;justify-content: center;width:'+100/r.length+'%;'" 
                  :class="!editMaket? 'menu-grid':'menu-grid-edit' "
                  >  

                    <ion-select interface="popover" icon="add"
                    v-if="editMaket"
                      :key="index1+'J'"
                      style="    position: absolute;margin-top: -55px;"
                      :ok-text="$t('backoffice.form.messages.buttons.ok')"
                      :value="restaurantSetting.TableDesign[index][index1].table"
                      :cancel-text="$t('backoffice.form.messages.buttons.dismiss')"                       
                      :placeholder="'Select table'"
                      @ionChange="addTable(index, index1, $event.target.value)">
                          <ion-select-option v-for="t in filterTables"                    
                            :key="t._id" 
                            :value="t._id" > {{t.Name}}
                          </ion-select-option>                          
                    </ion-select>

                    <ion-select interface="popover" icon="add"
                    v-if="editMaket && restaurantSetting.TableDesign[index][index1].table!=='' && findTable(restaurantSetting.TableDesign[index][index1].table)"
                        style="    position: absolute;margin-top: -10px;"
                      :ok-text="$t('backoffice.form.messages.buttons.ok')"
                      :value="findTable(restaurantSetting.TableDesign[index][index1].table).Shape"
                      :cancel-text="$t('backoffice.form.messages.buttons.dismiss')" 
                        @ionChange="setTableShape(findTable(restaurantSetting.TableDesign[index][index1].table) , $event.target.value)">
                          <ion-select-option v-for="t in ['Square','Rectangular', 'Circle', 'Oval' ]"                    
                            :key="t" 
                            :value="t" > {{t}}
                          </ion-select-option>                          
                    </ion-select>
                      
                    <ion-chip v-if="editMaket" :disabled="keyEdit?'true': 'false'" @click.stop="deleteColRow(index, index1)" style="position: absolute;margin-top: 50px;z-index: 10;padding:0">
                      <span class="iconify" data-icon="fluent:delete-24-regular" data-inline="false" style="margin: 0;"></span>
                    </ion-chip>

                  

                    <div v-if="!editMaket && restaurantSetting.TableDesign[index][index1].table!=='' && findTable(restaurantSetting.TableDesign[index][index1].table)" style="position: absolute;font-weight: 700;">
                        {{findTable(restaurantSetting.TableDesign[index][index1].table).Name}}</div>
                    <div v-if="!editMaket && restaurantSetting.TableDesign[index][index1].table!=='' && findTable(restaurantSetting.TableDesign[index][index1].table)" style="position: absolute;margin-top: 50px;">
                      Total: {{ getAmoutByTable(findTable(restaurantSetting.TableDesign[index][index1].table).Name) }}</div>
                    
                          
                    <ion-card :key="keyShape" v-if="restaurantSetting.TableDesign[index][index1].table !=='' && findTable(restaurantSetting.TableDesign[index][index1].table)"
                      :class="findTable(restaurantSetting.TableDesign[index][index1].table).Shape==='Square'?'square':
                      findTable(restaurantSetting.TableDesign[index][index1].table).Shape==='Circle'?'circle' :
                      findTable(restaurantSetting.TableDesign[index][index1].table).Shape==='Rectangular'? 'rectangle':
                      'oval'"
                      :style="findTable(restaurantSetting.TableDesign[index][index1].table).State=='Free' ?
                      '--background:#76fb3838;font-size: 18px;font-weight: 600;border: 1px solid grey;overflow: visible' :
                      '--background:#ff00001f;font-size: 18px;font-weight: 600;border: 1px solid grey;overflow: visible'"
                      
                    > 
                      <div v-if="!editMaket" style="position: absolute;">                      
                          <ion-badge slot="start" style="padding: 10px; margin: 10px;position: absolute;left: 0;" 
                          @click="getOrdersDetails(findTable(restaurantSetting.TableDesign[index][index1].table).Name)"
                              color="light">
                              {{getListOrder(findTable(restaurantSetting.TableDesign[index][index1].table).Name).length}} / 
                              {{findTable(restaurantSetting.TableDesign[index][index1].table).Seats.length}}
                          </ion-badge> 
                      </div>     
                        
                    </ion-card> 

                  <!-- </span> -->
                  
                    
                
                </div>

                <ion-chip v-if="editMaket" :disabled="keyEdit?'true': 'false'" @click.stop="deleteRow(index)" style="    top: -0;position: absolute;right: -28px;padding: 0;">
                  <span class="iconify" data-icon="fluent:delete-24-regular" data-inline="false" style="margin: 0;"></span>
                </ion-chip>
                <ion-chip v-if="editMaket" :disabled="keyEdit?'true': 'false'" @click.stop="addColRow(index)" style="    top: 40px;position: absolute;right: -28px;padding: 0;">
                  <span class="iconify" data-icon="carbon:add-alt" data-inline="false"  style="margin: 0;"></span>
                </ion-chip>

                <ion-reorder v-if="editMaket" :disabled="keyEdit?'true': 'false'" style="    top:80px;position: absolute;right: -28px;padding: 0;">
                  <ion-chip  style="padding: 0;">
                    <span class="iconify" data-icon="ion:reorder-three-outline" data-inline="false" style="margin: 0;"></span>
                  </ion-chip>               
               </ion-reorder>

              </div>
             
             
            </ion-reorder-group>
        </div>
          
   

    </div>
  </div>
</template>

<script>

import { Api } from '../api/api.js';
import Modal from './QrModal.vue';
import TableOrderModal from './TableOrderModal';
import listView from "../components/ListView";


export default {

  name: 'mesa',
  created: function(){
    this.screenWidth = screen.width;
    this.fetchTables();
    this.restaurantSetting = this.$store.state.backConfig.setting;    
    if(!this.restaurantSetting.TableDesign)     
      this.restaurantSetting.TableDesign = [];  

  },
   components:{   
    listView,
  },
 
  data () {
    return {
      modelName: 'Table',
      tables: [],
      filterTables: [],

      paginate: ['languages'],

      spinner: false,
      spinnerState: false,
      screenWidth: 0,
      table: true,
      maket: false,
      segmentValue: 'table',
      orders: [],
      key: 0,
      keyShape: 0,
      keyRow: 0,
      restaurantSetting: {},
      rowC:1,
      editMaket: false,
      keyEdit: false,
      keyList: 0,
    }
  }, 
  methods: {

    async doRefresh() {
      this.spinner = true;
      await Api.fetchAll(this.modelName).then(response => {
        this.$store.state.backConfig.tables = response.data;
        this.fetchTables();
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
      if(count === 2) return option.Name;
      if(count === 3) return null
      if(count === 4) return option.Seats.length + ' Seats'
      if(count === 5) return option.State
    },

    async segmentChanged(value){  
       this.orders = this.$store.state.backConfig.order.filter(order => order.State < 5 && order.OrderType === 'On Table');       
            if(value === 'table'){
                this.table = true;
                this.maket = false;              
            }          
            if(value === 'maket')   {
              this.table = false;
              this.maket = true;
            }          
            this.segmentValue = value;

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

    handleInput(value){

      this.filterTables = this.tables
      const query = value.toLowerCase();
      requestAnimationFrame(() => {   
        let cat2 = this.tables.filter(item => item.Name.toLowerCase().indexOf(query) > -1 || 
                                      item.State.toLowerCase().indexOf(query))
        if(cat2.length> 0)
          this.filterTables = cat2
        else
          this.filterTables = this.categories
      });
    },

    hasPermission(permission){
        
        let res = false;
        if (this.$store.state.authenticated)
        {
            let roles = this.$store.state.roles;
            for (let index = 0; index < roles.length; index++) {
                switch(permission){                        
                      case 'canCreateTable':
                          res = roles[index].canCreateTable;
                          break;
                      case 'canEditTable':
                          res = roles[index].canEditTable;
                          break;
                      case 'canDeleteTable':
                          res = roles[index].canDeleteTable;
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

    seeQrCode(seats){     
        return this.$ionic.modalController
        .create({
          component: Modal,
          cssClass: 'my-custom-class',
          componentProps: {
            data: {
              content: seats,
              type: 'Multiple'
            },
            propsData: {
              title: this.$t('backoffice.form.fields.qrCode'),
              button: this.$t('backoffice.list.messages.buttons.close'),
            },
          },
        })
        .then(m => m.present())
    },

    async setAvailable(table){
        this.spinner = true;
        table.State = 'Free';
       this.keyShape ++;
        table.Seats.forEach(seat => {
            seat.available = true
        });
        await Api.putIn('table', table).then(response => {
            const index = this.$store.state.backConfig.tables.findIndex(t => t._id === table._id)
            if(index !== -1) this.$store.state.backConfig.tables[index] = table;
             this.key ++;
            this.showToastMessage('La mesa está hora disponible.', 'success')
            this.spinner = false
            return response
        })
        .catch(e => {
            e;
            this.spinnerState = false
        })
    },

    async setBusy(table){
        this.spinner = true;
        table.State = 'Busy';
        this.keyShape ++;
        table.Seats.forEach(seat => {
            seat.available = false
        });
        await Api.putIn('table', table).then(response => {
           const index = this.$store.state.backConfig.tables.findIndex(t => t._id === table._id)
            if(index !== -1) this.$store.state.backConfig.tables[index] = table;
            this.key ++;
            this.showToastMessage('Se ha ocupado la mesa.', 'success')
            this.spinner = false
            return response
        })
        .catch(e => {
            e
            this.spinner = false
        })
    },

    /****** CRUD category methods ******/
    fetchTables: function(){
      this.tables = this.$store.state.backConfig.tables;
      this.filterTables = this.tables;

    },

    editTable: function(id){
        this.$router.push({
        name: 'TableForm',
        params: { tableId: id }
      });
    },

    addTableForm: function(){
        this.$router.push({
        name: 'TableForm'
      });
    },

    deleteTable: async function(id){

      return this.$ionic.alertController.create({
        title: this.$t('backoffice.list.messages.confirmDelete'),
        message: this.$t('backoffice.list.messages.deleteTable'),
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

                this.spinner = true
                Api.deleteById(this.modelName, id)
                  .then(response => {
                    const index = this.$store.state.backConfig.tables.findIndex(t => t._id === id)
                    if(index !== -1) this.$store.state.backConfig.tables.splice(index, 1);
                    this.showToastMessage(this.$t('backoffice.list.messages.messageDeleteSuccessTable'), "success");
                    this.fetchTables();
                    this.spinner = false;
                    return response;
                  })
                  .catch(e => {
                    e;
                    this.ifErrorOccured(mess => {
                      this.deleteTable(id)
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

     getAmoutByTable(value){
       const listO = this.getListOrder(value);
       let total = 0;
       listO.forEach( o => { total+= parseFloat(o.Total) })
       return total.toFixed(2);
    },

     async getOrdersDetails(value){
       const listO = this.getListOrder(value);
       if(listO.length > 0){
         return this.$ionic.modalController
        .create({
          component: TableOrderModal,
          cssClass: 'my-custom-class',
          componentProps: {
            data: {
              content: listO,             
            },
            propsData: {  
              allStates: [this.$t('frontend.order.state0'),this.$t('frontend.order.state1'), this.$t('frontend.order.state2'),
      this.$t('frontend.order.state3'), this.$t('frontend.order.state4'), this.$t('frontend.order.state5'), this.$t('frontend.order.state6'), this.$t('frontend.order.state7'), this.$t('frontend.order.state8')],
                 
            },
          },
        })
        .then(m => m.present())
       }
       return null;
       
     },

     getListOrder(value){
       const listO = [];
       for (const order of  this.orders) {
         const name = order.tableService;
         if(name.match(value)){
           listO.push(order);
         }         
       }
       return listO;
     },

     setTableShape(table, shape){
        
        table.Shape = shape;  
        this.keyShape ++;      
        Api.putIn('table', table).then(response => {
            response
        })
        .catch(e => {
            e            
        })
    },

     addRowColumn(rowC){
      const array = [];
      const data = { table: ''  }
      for(var i=0; i< parseInt(rowC); i++) {
        array.push(data);
      }
      this.restaurantSetting.TableDesign.push(array)
       this.rowC = 1;
      this.keyRow ++;
      this.keyShape ++;  
    },

   async saveSetting(){ 
      this.keyEdit = true;
        await Api.putIn('Setting', this.restaurantSetting).then(response => {
            response
            this.$store.state.backConfig.setting = this.restaurantSetting;
            this.keyEdit = false;
            this.editMaket = false;
        })
        .catch(e => {
            e    
            this.keyEdit = false;        
        })
    },  

    addTable(index, index1, value){ 
      
      const UJ = JSON.parse(JSON.stringify( this.restaurantSetting.TableDesign))

      for (const tb of UJ) {
        for (const element of tb) {
          if(element.table === value){
            element.table = ''
          }                
        }        
      }   
     
      UJ[index][index1].table=value
      this.restaurantSetting.TableDesign = UJ;      
        
      this.keyShape ++;        
    },

    findTable(id){
      const index = this.filterTables.findIndex( t => t._id === id)
      if (index !== -1)
        return this.filterTables[index];
      return null  ;
    },

    deleteRow(index){
      this.restaurantSetting.TableDesign.splice(index, 1);
      this.keyShape ++; 
      this.keyRow ++;  
    },

    deleteColRow(index, index1){
      this.restaurantSetting.TableDesign[index].splice(index1, 1);
       this.keyShape ++; 
        this.keyRow ++;  
    },

    addColRow(index){
      const data = { table: ''  }
      this.restaurantSetting.TableDesign[index].push(data);
      this.keyShape ++; 
      this.keyRow ++;  
    },

    doReorder(event){

      const value = this.restaurantSetting.TableDesign[event.detail.from]
      if(event.detail.from > event.detail.to){
          this.restaurantSetting.TableDesign.splice(event.detail.to, 0, value);
          this.restaurantSetting.TableDesign.splice(event.detail.from+1, 1);
      }
      else{
          this.restaurantSetting.TableDesign.splice(event.detail.to+1, 0, value);
          this.restaurantSetting.TableDesign.splice(event.detail.from, 1);
      }
      event.detail.complete();
      this.keyShape ++; 
      this.keyRow ++;  
    }

  },

}


</script>

<style>
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
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
  }


  .menu-col-4{
    flex: 0 0 calc(calc(4 / var(--ion-grid-columns, 12)) * 100%);
    width: calc(calc(4 / var(--ion-grid-columns, 12)) * 100%);
    max-width: calc(calc(4 / var(--ion-grid-columns, 12)) * 100%);
    text-align: left;
    visibility: visible;
    }
 
.content {
  position: absolute;
  width: 100%;
  height: 100%;
}
.square {
  /* width: inherit; */
  max-height: 200px;
    max-width: 200px;
  width: 100%;
}

.square:after {
  content: "";
  display: block;
  padding-bottom: 100%;
}

.circle{
   width: 100%;
   max-height: 200px;
    max-width: 200px;
  border-radius: 50%;
}
.circle:after {
  content: "";
  display: block;
  padding-bottom: 100%;
}
.rectangle{
    width: 100%; 
    /* width: inherit; */
    max-height: 200px;
    max-width: 200px;
}
.rectangle:after {
  content: "";
  display: block;
  padding-bottom: 60%;
}
.oval{
  /* width: inherit; */
  max-height: 200px;
    max-width: 200px;
    width: 100%; 
    border-radius: 50%;
}
.oval:after {
  content: "";
  display: block;
  padding-bottom: 60%;
}

.menu-grid{
  float: left;
  height: 220px;
  border: none;
  padding: 5px;
}
.menu-grid-edit{
  float: left;
  height: 220px;
  border: 1px solid grey;
  padding: 5px;
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