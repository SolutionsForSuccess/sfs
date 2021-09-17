<template>
    <div class="screen">
    <ion-backdrop v-if="isBackdrop"></ion-backdrop>
    <!-- <router-link to="/controlPanel"><ion-button expand="full" color="tertiary"><ion-icon name="hammer"></ion-icon>{{$t('backoffice.list.buttons.goToControlPanel')}}</ion-button></router-link>
    <router-link to="/table"><ion-button expand="full" color="tertiary"><ion-icon name="arrow-round-back"></ion-icon>{{$t('backoffice.form.buttons.backToTablesList')}}</ion-button></router-link> -->

    <ion-header>
          <ion-toolbar>
            <ion-buttons slot="start">
              <ion-back-button default-href="/controlPanel" @click="$router.push({ name: 'Table'})"></ion-back-button>
            </ion-buttons>
            <ion-label style="padding: 20px 100px;">
              <h1>{{title}}</h1>            
            </ion-label>
          </ion-toolbar>
    </ion-header>
    <br/>

      <!-- <ion-card> -->
    <ion-loading
        v-if="spinner"
        cssClass="my-custom-class"
        :message="$t('frontend.tooltips.loadRestaurant')"
    ></ion-loading>

    <div >   

        <ion-row>

          <ion-col size="12" size-md="6">

              <ion-item>
                  <ion-label>{{$t('backoffice.form.fields.name')}}: <strong style="text-transform: uppercase;">{{name}}</strong></ion-label>            
              </ion-item> 

               <ion-item v-if="1">
                <ion-label ><span style="color: red">*</span>{{$t('backoffice.form.fields.tableNumber')}}</ion-label>
                  <ion-input type="number" name="tableNumber"
                  @input="changeNumber($event.target.value)" 
                  v-bind:value="tableNumber">
                </ion-input>
              </ion-item>

              <ion-item>
                  <ion-label position="floating">{{$t('backoffice.form.fields.description')}}</ion-label>
                  <strong>
                    <ion-textarea name="description" 
                  @input="description = $event.target.value" 
                  v-bind:value="description">
                  </ion-textarea>
                  </strong>
              </ion-item>

              <div v-if="!id">
                      <p style="text-align: left;padding: 0 20px;">Seat type</p>
                  <ion-radio-group :value="type"  @ionChange="changeType($event.target.value)" style="    display: flex;justify-content: space-evenly;">
                  
                    <div>
                      <ion-label>Table</ion-label>
                      <ion-radio slot="end" :value="tablePrefix"></ion-radio>
                    </div>
                    <div>
                      <ion-label>Bar</ion-label>
                      <ion-radio slot="end" :value="barPrefix"></ion-radio>
                    </div>
                    <div>
                      <ion-label>Room</ion-label>
                      <ion-radio slot="end" :value="roomPrefix"></ion-radio>
                    </div>
                  </ion-radio-group>
              </div>
                
              <ion-list>
                  <ion-item>
                    <ion-label>Forma</ion-label>
                      <ion-select interface="popover" :ok-text="$t('backoffice.form.messages.buttons.ok')" :cancel-text="$t('backoffice.form.messages.buttons.dismiss')" style="padding: 0"
                      @ionChange="shape = $event.target.value" v-bind:value="shape">
                          <ion-select-option key="Square" value="Square">{{$t('backoffice.form.tableShape.square')}}</ion-select-option>
                          <ion-select-option key="Rectangular" value="Rectangular">{{$t('backoffice.form.tableShape.rectangular')}}</ion-select-option>
                          <ion-select-option key="Circle" value="Circle">{{$t('backoffice.form.tableShape.circle')}}</ion-select-option>
                          <ion-select-option key="Oval" value="Oval">{{$t('backoffice.form.tableShape.oval')}}</ion-select-option>
                      </ion-select>
                  </ion-item>
              </ion-list>

              <ion-item>
                <ion-label>{{$t('backoffice.form.fields.available')}}</ion-label>
                <ion-toggle slot="end" name="available" 
                      @ionChange="available=$event.target.checked" 
                      :checked="available">
                </ion-toggle>
              </ion-item>

          </ion-col>

          <ion-col size="12" size-md="6">
         
            <div v-if="id">
                <ion-item>
                    <ion-label> Manage seats</ion-label>
                   
                     <ion-button
                        fill="clear"
                        shape="round"
                        class="list-gourp-btn"
                        side="end"                       
                        @click="addSeat()"
                        >
                        <ion-icon  slot="icon-only"  icon="add"  class="more-grid" ></ion-icon>
                    </ion-button>
                     <ion-button
                        fill="clear"
                        shape="round"
                        class="list-gourp-btn"
                        side="end"
                        :disabled="seats.length > 0? false: true"
                        @click="deleteSeat()"
                        >
                        <ion-icon  slot="icon-only"  icon="trash"  class="more-grid" ></ion-icon>
                    </ion-button>
                </ion-item>

                   <ion-list class="content-list" style="margin: 0 15px;">
                            
                            <ion-item
                                v-for="(seat, index) in seats"
                                v-bind:key="index"                               
                            >
                               

                                <ion-label> 
                                    <h2> <span style="padding: 0 10px;text-transform: uppercase;    font-weight: 400;">  {{ formatSeat(seat) }} </span>     </h2>    
                                    <h4 style="padding: 0 10px;font-weight: 200;">  {{ showStatus(seat) }} </h4>
                                </ion-label>

                                <ion-button
                                    fill="clear"
                                    shape="round"
                                    class="list-gourp-btn"
                                    side="end"
                                    @click.stop="seeQrCode(seat)"
                                    >
                                        <ion-icon  slot="icon-only"  icon="md-qr-scanner"  class="more-grid" ></ion-icon>
                                </ion-button>
                                 <ion-button
                                    fill="clear"
                                    shape="round"
                                    class="list-gourp-btn"
                                    side="end"
                                   v-if="!seat.available"
                                   @click="setAvailable(seat)"
                                    >
                                        <ion-icon  slot="icon-only"  icon="close"  class="more-grid" ></ion-icon>
                                </ion-button>
                                  <ion-button
                                    fill="clear"
                                    shape="round"
                                    class="list-gourp-btn"
                                    side="end"
                                   v-else
                                   @click="setDisable(seat)"
                                    >
                                        <ion-icon  slot="icon-only"  icon="checkmark"  class="more-grid" ></ion-icon>
                                </ion-button>
                            </ion-item>
                        </ion-list>

            </div>

            <ion-item>
                <ion-segment v-bind:value="state" @ionChange="changeState($event.detail.value)">
                    <ion-segment-button value="Free">
                        <ion-label>{{$t('backoffice.form.fields.free')}}</ion-label>
                    </ion-segment-button>
                    <ion-segment-button value="Busy">
                        <ion-label>{{$t('backoffice.form.fields.busy')}}</ion-label>
                    </ion-segment-button>
                    <ion-segment-button value="Dirty">
                        <ion-label>{{$t('backoffice.form.fields.dirty')}}</ion-label>
                    </ion-segment-button>
                </ion-segment>
            </ion-item>

          </ion-col>

        </ion-row>

       
     
      
        
       

      
        

      
      
      
      <!-- </ion-card>  -->

     

      <br/>
      <ion-button expand="full" color="primary" :disabled="!isValidForm()" @click="saveTable()">{{ $t('backoffice.form.buttons.save') }}</ion-button>

    </div>
    </div>
</template>

<script>

import { Api } from '../api/api.js';
// import QrcodeVue from 'qrcode.vue';
import Modal from './QrModal.vue';

export default {

  name: 'tableForm',
   
  data () {
    return {
      modelName: 'Table',
      /****** Form Data ******/
      id: null,
      name: '',
      description: '',
      tableNumber: 0,
      barcode: '',
      state: '',
      available: true,
      shape: 'Square',
      
      qr: '',

      type: '',
      seats: [],
      allTables: [],

      tablePrefix: 'table_',
      barPrefix: 'bar_',
      roomPrefix: 'room_',

      possiblesStates: ['Libre', 'Ocupada', 'Sucia'],

      isBackdrop: false,
      spinner: false,

    }
  },
  // components: {
  //     QrcodeVue,
  // },
  created: function(){

      this.allTables = this.$store.state.backConfig.tables
      let number = this.setTableNumber(this.allTables) 
      this.tableNumber = number
      this.changeNumber(this.tableNumber);
    
      this.init();
  },
  computed: {
        title() {
            return this.id ? this.$t('backoffice.form.titles.tableEditTitle') :  this.$t('backoffice.form.titles.tableNewTitle');
        }
  },
  methods: {

    init(){
        this.id = this.$route.params.tableId;
        
        this.type = 'table_';
        this.state = 'Free';
        this.changeType(this.type);
        if (this.id){
          const data = this.$store.state.backConfig.tables.find(t =>t._id === this.id);
          if(data){
            this.name = data.Name;
            this.description = data.Description;
            this.tableNumber = data.TableNumber;
            this.shape = data.Shape;
            this.type = data.Type;
            this.seats = data.Seats;
            this.available = data.Available;
            this.state = data.State;
          }
        }
        else{
            const funSettings = this.$store.state.backConfig.setting;
            if (funSettings.TablePrefix && funSettings.TablePrefix != '') {
              this.tablePrefix = funSettings.TablePrefix + "_" 
              this.type = this.tablePrefix;
              this.changeType(this.type);
              }
            if (funSettings.BarPrefix && funSettings.BarPrefix != '') 
                this.barPrefix = funSettings.BarPrefix + "_"
            if (funSettings.RoomPrefix && funSettings.RoomPrefix != '')
                this.roomPrefix = funSettings.RoomPrefix + "_"
        }
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
                      name: 'Table',
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
      
        if (this.name == "") return false
        if (!this.validateUniqueName(this.name)) return false
        if (isNaN(this.tableNumber)) return false
        if (this.tableNumber == 0) return false

        return true;
       
    },

  
    setTableNumber(allTables){
        let tableNumber = []
        allTables.forEach(table => {
            tableNumber.push(table.TableNumber)
        });

        let number = 1
    
        while (tableNumber.includes(number)) {
            number++
        }

        return number

    },

    changeState(state){
        this.state = state
          if (this.state == "Free")
          {
              this.seats.forEach(seat => {
              seat.available = true
          });
        }
    },

    addSeat(){  
        const name = this.id + '-' + this.name + '_' + (this.seats.length + 1)
        const seat = {
            'name': name,
            'available': true
        }

        this.seats.push(seat);
    },

    deleteSeat(){
        this.seats.splice(this.seats.length - 1, 1);
    },

    setAvailable(seat){
        seat.available = true
        let av = true
        this.seats.forEach(seat => {
            if (!seat.available)
              av = false
        });

        if (av)
          this.state = 'Free'
    },

    setDisable(seat){
        seat.available = false
        let av = false
        this.seats.forEach(seat => {
            if (seat.available)
              av = true
        });

        if (!av)
          this.state = 'Busy'
    },

    formatSeat(seat){
       let name = seat.name.split('-')
       return name[1] 
    },

    showStatus(seat){
        return seat.available ? 'Disponible' : 'No disponible'
    },

    changeType(eventVal){
        this.type = eventVal;
        let provisionalName = this.type + this.tableNumber;
        if (this.validateUniqueName(provisionalName))
        {
          this.name = provisionalName;
          this.changeAllSeatName();
        }
        else
        {
          this.ShowMessage(this.$t('backoffice.form.validate.validate'), 
          this.$t('backoffice.form.validate.nameDuplicate'),
          this.$t('backoffice.form.validate.validateTable'));
          this.name = provisionalName;
          this.changeAllSeatName();
        }
    },

    changeAllSeatName(){
        this.name + 'seat_' + (this.seats.length + 1)
        for (let i = 0; i < this.seats.length; i++) {
          const name = this.id + "-" + this.name + "_" + (i + 1)
          this.seats[i].name = name
        }
    },

    seeQrCode(seat){
        return this.$ionic.modalController
        .create({
          component: Modal,
          cssClass: 'my-custom-class',
          componentProps: {
            data: {
              content: [seat],
              type: 'unique',
            },
            propsData: {
              title: this.$t('backoffice.form.fields.qrCode'),
              button: this.$t('backoffice.list.messages.buttons.close')
            },
          },
        })
        .then(m => m.present())
    },

    changeNumber(val){
       this.tableNumber = val;
       this.changeType(this.type);
    },

    validateUniqueName(name){
        for (let index = 0; index < this.allTables.length; index++) {
          const element = this.allTables[index];
          if (element.Name == name && element._id != this.id)
              return false;
        }
        return true;
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

    saveTable: async function(){

        if (this.isValidForm())
        {
              // this.isBackdrop = true;
              let item = {
              "Name": this.name,
              "Description": this.description,
              "State": this.state,
              "Available": this.available,
              "TableNumber": this.tableNumber,
              "Shape": this.shape,
              "Seats": this.seats,
              "Type": this.type,
            }
            //If I am editing
            if (this.id){
              item['_id'] = this.id;
              this.spinner = true;
              await Api.putIn(this.modelName, item)
                  .then(response => {
                        const index = this.$store.state.backConfig.tables.findIndex(t => t._id === this.id)
                        if(index !== -1) this.$store.state.backConfig.tables[index] = item;
                        this.showToastMessage(this.$t('backoffice.list.messages.messageEditSuccessTable'), "success");
                        this.spinner = false;
                        this.$router.push({
                          name: 'Table', 
                        });
                        return response;
                  })
                  .catch(e => {
                        this.isBackdrop = false;
                        e;
                        this.spinner = false;
                        this.ShowMessage(this.$t('backoffice.list.messages.errorTitle'),
                               this.$t('backoffice.list.messages.errorMessage'),
                                   this.$t('backoffice.list.messages.titleEditTable'));
                  })
            }
            else{
              //Else, I am created a new category
              this.spinner = true;
              await Api.postIn(this.modelName, item)
                  .then(response => {
                        this.$store.state.backConfig.tables.push(response.data);
                        this.showToastMessage(this.$t('backoffice.list.messages.messageCreateSuccessTable'), "success");
                        this.id = response.data._id
                        this.spinner = false
                        this.$router.push({
                          name: 'TableForm',
                          params: {
                              'tableId': response.data._id
                          } 
                        });
                      return response;
                  })
                  .catch(e => {
                      this.isBackdrop = false;
                      e;
                      this.spinner = false;
                      this.ShowMessage(this.$t('backoffice.list.messages.errorTitle'),
                          this.$t('backoffice.list.messages.errorMessage'),
                              this.$t('backoffice.list.messages.titleCreateTable'));
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