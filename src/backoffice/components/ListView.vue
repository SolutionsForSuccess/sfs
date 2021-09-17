<template>
  <div class="page">
     
    <ion-header translucent>
      <ion-row class="ion-align-items-center">
        <ion-col size="12" size-md="12" class="btn-title" >
          <div @click="goControlView()">
            <div class="back-btn">
                <ion-icon name="ios-arrow-back" color="#9D9D9D"></ion-icon>
                <!-- <span>{{ $t("backoffice.form.buttons.back") }}</span> -->
                <h1> {{ title }} </h1> 
            </div>
         
            
          </div>

         <div>
            <ion-button  
              class="header-btn"  
              size="small"
              fill="clear"
              @click.stop="doRefresh()"
            >
            <ion-icon name="refresh" slot="icon-only"></ion-icon> 
          </ion-button>   
        
            <ion-button
              v-if="hasQr"
              class="header-btn"  
              size="small"
              fill="clear"
              @click.stop="showQr()"
            >
            <ion-icon name="ios-qr-scanner" slot="icon-only"></ion-icon> 
          </ion-button>

          <ion-button
              v-if="hasConfig"
              class="header-btn"  
              size="small"
              fill="clear"
              @click.stop="showConfig()"
            >
            <ion-icon name="ios-hammer" slot="icon-only"></ion-icon> 
          </ion-button>
         </div>
        </ion-col>
       
      </ion-row>

      <ion-row class="ion-padding-vertical header-row" style="align-items: center;">
        <ion-col size="4" size-md="2" class="header-col" v-if="selectOptions">
          <ion-item>
            <ion-select
              :value="filterType"
              interface="popover"
              style="max-width: 100%; width: 100%; padding-left: 0;"
               @ionChange="changeFilterType($event.target.value)"
            >
              <ion-select-option
                v-for="option in selectOptions"
                v-bind:key="option.state"
                :value="option.state"
                >{{ option.value }}</ion-select-option
              >
            </ion-select>
          </ion-item>
        </ion-col>
        <ion-col
          :size="selectOptions ? '8' : '7'"
          size-md="7"
          class="ion-align-items-center header-col"
        >  
          <ion-searchbar
            class="header-searchbar"
            @input="handleInput($event.target.value)"
            @ionClear="filter = elements"
            :placeholder="$t('frontend.home.search')"
          ></ion-searchbar>
        </ion-col>
        <ion-col
          size="5"
          :offset-md="!selectOptions ? '2' : '0'"
          size-md="3"
          class="ion-padding-vertical ion-text-right right-container"
        >
          <ion-button
            class="header-btn"
            @click="listActive = false,isOpenRef=false,optionSelected=''"
            :style="
              !listActive
                ? 'color: var(--ion-color-primary);'
                : 'color: #9d9d9d;'
            "
            size="small"
            fill="clear"
          >
            <ion-icon slot="icon-only" icon="md-apps"></ion-icon>
          </ion-button>
          <ion-button
            class="header-btn"
            @click="listActive = true,isOpenRef=false,optionSelected=''"
            :style="
              listActive
                ? 'color: var(--ion-color-primary);'
                : 'color: #9d9d9d;'
            "
            size="small"
            fill="clear"
          >
            <ion-icon slot="icon-only" icon="md-list"></ion-icon>
          </ion-button>
          <ion-chip outline color="primary" @click="handleAddClick" v-if="add">
            <ion-icon name="md-add" color="primary" class="add-icon"></ion-icon>
            <ion-label color="primary" class="hide-md">{{
              $t("backoffice.form.buttons.add")
            }}</ion-label>
          </ion-chip>
        </ion-col>
      </ion-row>
    </ion-header>

   <div >
      <ion-progress-bar v-if="spinner" type="indeterminate"></ion-progress-bar>       
    </div>


    <div class="content-container">
      <paginate name="languages" :list="filter" :per="isOrder? 50: 8">
        <ion-list class="content-list" v-if="listActive">
          <ion-item
            v-for="option in paginated('languages')"
            v-bind:key="option._id"
             @click.stop="isOpenRef=false"
          >
            <ion-avatar slot="start" v-if="hasImg">
              <img
                :src="
                  option.ImageUrl
                    ? option.ImageUrl
                    : require('../assets/user.png')
                "
              />
            </ion-avatar>
            <ion-label> 
              <h2>{{ listViewData(option,2) }} {{ listViewData(option,3) }}</h2>
              <h3>
                {{ listViewData(option,4) }} <br v-if="listViewData(option,4)!==null && listViewData(option,5)!==null">  {{ listViewData(option, 5) }}
              </h3>
            </ion-label>
                <ion-button
                  fill="clear"
                  shape="round"
                  class="list-gourp-btn"
                  side="end"
                  v-if="hasAction && (!isOpenRef || optionSelected!==option._id)"
                   @click.stop="isOpenRef=true,optionSelected=option._id"
                >
                  <ion-icon
                    slot="icon-only"
                    icon="md-more"
                    class="more-grid"                   
                  ></ion-icon>
                </ion-button>

                  <div v-if="isOpenRef && optionSelected==option._id" >
                     <PopOver :isOrder="isOrder" 
                              :delivery="delivery"
                              :notAccepted="notAccepted"
                              :showClock="showClock"
                              :add="add"  
                              :see="see"                       
                              :edit="isSupportUserLogin || (edit && option.CanEdit !== false)"                                
                              :remove="isSupportUserLogin || (remove && option.CanDelete !== false)" 
                              :showQrTable="showQrTable"
                              :showOrderTable="showOrderTable"
                              :element="option"
                              :id="option._id" 
                              @showOrderTableM="showOrderTableM"
                              @reOrder="reOrder"
                              @curbsideDetail="curbsideDetail"
                              @cancelOrder="cancelOrder"
                              @acceptOrder="acceptOrder"
                              @notAcceptOrder="notAcceptOrder"
                              @writeLocalization="writeLocalization"
                              @showDeliveringLocation="showDeliveringLocation"
                              @showTravel="showTravel"
                              @showTime="showTime"
                              @showQrTableM="showQrTableM"
                              @editElement="editElement"
                              @deleteElement="deleteElement" />
                  </div>
           
            
          </ion-item>
        </ion-list>

        <ion-row v-else>
          <ion-col
            size="12"
            size-md="3"
            class="ion-align-items-center header-col"
            v-for="option in paginated('languages')"
            v-bind:key="option._id"
          >
            <ion-card v-if="!isOrder" @click.stop="isOpenRef=false">
              <ion-card-header class="card-header">
                <ion-avatar v-if="hasImg">
                  <img
                    :src="
                     listViewData(option,1)
                        ? listViewData(option,1)
                        : require('../assets/user.png')
                    "
                  />
                </ion-avatar>
                <ion-card-title color="white" class="card-title"
                  >{{ listViewData(option,2) }} {{ listViewData(option,3) }}</ion-card-title
                >
                <ion-button
                  fill="clear"
                  shape="round"
                  class="list-gourp-btn"
                  side="end"
                  v-if="hasAction && (!isOpenRef || optionSelected!==option._id)"
                   @click.stop="isOpenRef=true,optionSelected=option._id"
                >
                  <ion-icon
                    slot="icon-only"
                    icon="md-more"
                    class="more-grid"                   
                  ></ion-icon>
                </ion-button>

                  <div v-if="isOpenRef && optionSelected==option._id" > 
                     <PopOver :list="false"                             
                              :isOrder="isOrder"
                              :delivery="delivery"
                              :notAccepted="notAccepted"
                              :showClock="showClock"
                              :add="add"    
                              :see="see" 
                              :edit="isSupportUserLogin || (edit && option.CanEdit !== false)"
                              :remove="isSupportUserLogin || (remove && option.CanDelete !== false)" 
                              :showQrTable="showQrTable"
                              :showOrderTable="showOrderTable"
                              :element="option"
                              :id="option._id" 
                              @showOrderTableM="showOrderTableM"
                              @reOrder="reOrder"
                              @curbsideDetail="curbsideDetail"
                              @cancelOrder="cancelOrder"
                              @acceptOrder="acceptOrder"
                              @notAcceptOrder="notAcceptOrder"
                              @writeLocalization="writeLocalization"
                              @showDeliveringLocation="showDeliveringLocation"
                              @showTravel="showTravel"
                              @showTime="showTime"
                              @showQrTableM="showQrTableM"
                              @editElement="editElement"
                              @deleteElement="deleteElement" />
                  </div>
                 

              </ion-card-header>
              <ion-card-content class="ion-padding-vertical">
                {{ listViewData(option,4) }} <br v-if="listViewData(option,4)!==null && listViewData(option,5)!==null"> {{ listViewData(option, 5) }}
              </ion-card-content>
            </ion-card>

            <div v-else>

              <ion-chip 
                style="margin: 0;bottom: -10px; font-weight: bold;" 
                outline
              >
                {{getFormateHour(option.Date)}}

              </ion-chip>

                <ion-card 
                  style="text-align: left;"   
                  color="primary"
                >
                
                  <ion-card-header class="card-header">
                    <ion-button
                      fill="clear"
                      shape="round"
                      class="list-gourp-btn"
                      side="end"
                      v-if="hasAction && (!isOpenRef || optionSelected!==option._id)"
                      @click.stop="isOpenRef=true,optionSelected=option._id"
                    >
                      <ion-icon
                        slot="icon-only"
                        icon="md-more"
                        class="more-grid"                   
                      ></ion-icon>
                    </ion-button>

                      <div v-if="isOpenRef && optionSelected==option._id" > 
                        <PopOver :list="false"                             
                                  :isOrder="isOrder"
                                  :delivery="delivery"
                                  :notAccepted="notAccepted"
                                  :showClock="showClock"
                                  :add="add"    
                                  :edit="isSupportUserLogin || (edit && option.CanEdit !== false)"
                                  :remove="isSupportUserLogin || (remove && option.CanDelete !== false)" 
                                  :showQrTable="showQrTable"
                                  :showOrderTable="showOrderTable"
                                  :element="option"
                                  :id="option._id" 
                                  @showOrderTableM="showOrderTableM"
                                  @reOrder="reOrder"
                                  @curbsideDetail="curbsideDetail"
                                  @cancelOrder="cancelOrder"
                                  @acceptOrder="acceptOrder"
                                  @notAcceptOrder="notAcceptOrder"
                                  @writeLocalization="writeLocalization"
                                  @showDeliveringLocation="showDeliveringLocation"
                                  @showTravel="showTravel"
                                  @showTime="showTime"
                                  @showQrTableM="showQrTableM"
                                  @editElement="editElement"
                                  @deleteElement="deleteElement" />
                      </div>
                  </ion-card-header>
                    
                  <ion-card-header style="margin: 10px 5px 2px; padding: 10px;background:white;color: black;">
                    <ion-card-title  style="color: black;">{{ option.OrderType }} - 
                      <span style="text-transform: uppercase;"> {{option._id.slice(-4)}} </span>
                      <span v-if="option.CarArrived && option.State !==5"                      
                        class="iconify" data-icon="clarity:car-solid" data-inline="false" 
                        style="float: right; color: #48bc76; margin:0"></span> 
                    </ion-card-title>
                    
                    <ion-card-subtitle v-if="option.CustomerName"
                      style="color: black; display: flex;justify-content: space-between;">
                      <div style="text-align: center;"> 
                        <span class="iconify" data-icon="bx:bxs-user-circle" data-inline="false" 
                        style="color: #808080a6;width: 20px;  height: 20px; margin: 0;"></span>
                      </div>
                      <div style="text-align: right;"  >{{ option.CustomerName }}</div>
                    </ion-card-subtitle>

                    <ion-card-subtitle v-if="option.StaffName"
                      style="color: black; display: flex;justify-content: space-between;">
                      <div style="text-align: center;"> 
                        <span class="iconify" data-icon="grommet-icons:restaurant"
                        style="color: #808080a6; width: 20px;  height: 20px; margin: 0;" data-inline="false"></span>
                      </div>
                      <span style="text-align: right;"  > {{ option.StaffName }}</span>
                    </ion-card-subtitle>

                 
                      
                  </ion-card-header>

                  <ion-card-content style="margin: 1px 5px; padding: 5px;background:white;color: black;" :key="cartKey + 'C'">
                      <div v-for="(prod, index) in option.Products" :key="index" >
                        <div style="display: flex;justify-content: space-between; padding: 2px;margin:5px 0">
                          <span :style="prod.State===1? 'text-decoration: line-through;':'text-decoration: none'">{{prod.Cant}} X {{prod.Name}} </span> 
                          <ion-checkbox v-if="prod.State === 0 && edit" color="secondary" @click="changeProductState(option, index)"></ion-checkbox>
                          <ion-checkbox v-if="prod.State ===1 && edit"  checked disabled color="secondary"></ion-checkbox>
                        </div>

                        <div v-if="prod.Aggregates.length > 0" style="padding-left: 5px;">
                          <div v-for="(agg, index1) in prod.Aggregates" :key="index1"  style="padding-left: 2px; display: list-item; list-style: inside" >                                                          
                          {{agg.Cant}} X {{agg.Name}} 
                          </div>
                        </div>

                        <div v-if="prod.Note" style="padding-left: 15px;">                                                                                          
                            <span style="background: #ffff0047;" >{{$t('frontend.order.notes')}}: {{prod.Note}}</span>                                 
                        </div>                              
                      </div>
                      <div v-if="option.OtherCharges">
                          <div v-if="option.OtherCharges.length > 0">
                              <ion-label class="ion-text-wrap" >
                                  <strong class="titles-order" >
                                    {{$t('frontend.order.otherCharges')}}
                                  </strong> 
                              </ion-label>
                                              
                            <div v-for="charge in option.OtherCharges" v-bind:key="charge.Id">                              
                                <div style="padding-left: 2px; display: list-item; list-style: inside;">
                                    {{ charge.Name }}
                                </div>                                
                            </div>

                        </div>
                      </div>
                  </ion-card-content>
                                  
                  <ion-card-content style="margin:5px; background:white;color: black;text-align: center; padding: 0;" >
                    <p style="font-size: 18px;font-weight: 500;padding: 5px;">{{statesAll[option.State].name}}</p>
                  </ion-card-content>
                            
                              <div v-if="edit" style="display: flex;justify-content: space-between;align-items: center;"> 
                                <div v-tooltip="$t('frontend.order.notes')" @click="showOrderNote(option)" >
                                  <span  class="iconify" data-icon="bi:info-circle-fill" data-inline="false" style="width: 20px;height: 20px;"></span>
                                </div>
                                  <h3 style="text-align: center;">{{ getFormatPrice(option.Total) }}</h3>
                                  <div v-tooltip="$t('frontend.tooltips.editTicket')" @click="editElement(option._id)">
                                    <span   class="iconify" data-icon="el:file-edit-alt" data-inline="false" style="width: 20px;height: 20px;"></span>
                                  </div>
                              </div>                
                 </ion-card>

            </div>


          </ion-col>
        </ion-row>
      </paginate>

     <div 
      style="text-align: right;font-weight: 700;" 
      class="card-title" 
     
      >
       {{listViewData({},6)}}
     </div>

      <paginate-links
        for="languages"
        color="primary"
        :simple="{
          next: '»',
          prev: '« ',
        }"
      ></paginate-links>
    </div>
  </div>
</template>

<script>
import PopOver from './Popover.vue'
import { Utils } from '../utils/utils.js';
export default {
  name: "listView",
  props: {
    title: {
      type: String,
    },
    selectOptions: {
      type: Array,
      required: false,
    },
    filter: {
      type: Array,
    },
    elements: {
      type: Array,
    },
    add: {
      type: Boolean,
      default: false,
    },
    edit: {
      type: Boolean,
      default: false,
    },
    see: {
      type: Boolean,
      default: false,
    },
    remove: {
      type: Boolean,
      default: false,
    },
    delivery: {
      type: Boolean,
      default: false,
    },
    isSupportUserLogin: {
      type: Boolean,
      default: false,
    },
    hasAction: {
      type: Boolean,
      default: true,
    },
    hasImg: {
      type: Boolean,
      default: false,
    },
    hasQr: {
      type: Boolean,
      default: false,
    },
    hasConfig: {
      type: Boolean,
      default: false,
    },
    showQrTable: {
      type: Boolean,
      default: false,
    },
    showOrderTable: {
      type: Boolean,
      default: false,
    },
    isOrder: {
      type: Boolean,
      default: false,
    },
    filterType:{
      type: String,
      default: ''
    },
    cartKey: {
      type: Number,
      default: 0,
    },
    notAccepted: {
      type: Boolean,
      default: false,
    },
    showClock:{
      type: Boolean,
      default: false,
    },
    viewSelected:{
      type: String,
      default: '',
    },

  },
  components:{
   PopOver
  },
  data() {
    return {
      listActive: false,
      paginate: ["languages"],
      spinner: false,
      isOpenRef: false,
      event: {},
      optionSelected:'',
      statesAll: [
        { state: 0,
          name: this.$t('frontend.order.state0')},
        { state: 1,
          name: this.$t('frontend.order.state1')},
        { state: 2,
          name: this.$t('frontend.order.state2')},
        { state: 3,
          name: this.$t('frontend.order.state3')},
        { state: 4,
          name: this.$t('frontend.order.state4')},
        { state: 5,
          name: this.$t('frontend.order.state5')},
        { state: 6,
          name: this.$t('frontend.order.state6')},
        { state: 7,
          name: this.$t('frontend.order.state7')},
        { state: 8,
          name: this.$t('frontend.order.state8')} ],  
   
     
    };
  },
  created: function(){
 
     
  },
  methods: {
  
    handleInput(e) {
      this.$emit("handleInput", e);
    },
    handleAddClick() {
      this.$emit("handleAddClick");
    },
    listViewData(option, count) {

      const data = this.$parent.ListViewData(option, count)
      return data;
    },
    editElement(id) {
      this.$emit("editElement", id);
    },
    deleteElement(id) {
      this.$emit("deleteElement", id);
    },
    async doRefresh() {
      this.spinner = true;
      await this.$parent.doRefresh()
      this.spinner = false;
    },    
    showQr(){
       this.$parent.show();
    },
    showConfig(){
      this.$parent.showSettingModal();
    },
    showOrderTableM(optionName){
      return this.$parent.getOrdersDetails(optionName);
    },
     showQrTableM(seats){
      return this.$parent.seeQrCode(seats);
    },

    changeFilterType(value){
      this.$parent.changeFilterType(value);
    },

    changeProductState(order, index){
      this.$parent.changeProductState(order, index);
    },

    showOrderNote(order){
      this.$parent.showOrderNote(order);
    },

    getFormatPrice: function(price){
        return Utils.getFormatPrice(price);         
    },

     getFormateHour: function(date){
        return Utils.getFormatHour(date);         
    },

    reOrder(order){
       this.$parent.reOrder(order);
    },

    curbsideDetail(order){
      this.$parent.curbsideDetail(order);
    },

    cancelOrder(order){
      this.$parent.cancelOrder(order);
    },

    acceptOrder(order){
      this.$parent.acceptOrder(order);
    },

    notAcceptOrder(order){
      this.$parent.notAcceptOrder(order);
    },

    writeLocalization(order){
      this.$parent.writeLocalization(order);
    },

    showDeliveringLocation(order){
      this.$parent.showDeliveringLocation(order);
    },

    showTravel(order){
      this.$parent.showTravel(order);
    },

    showTime(id){
      this.$parent.showTime(id);
    },

    goControlView: function(){
        return this.$router.push({ name: 'ControlPanel', params: {viewSelected: this.viewSelected}  })
    },

    


    // TEST



  },
};
</script>

<style >
.pop-card{
      position: absolute;
    z-index: 20076;
    display: flex;
    align-items: flex-start;
    flex-direction: row;
    align-content: space-around;
    justify-content: flex-end;
    flex-wrap: nowrap;
}
.icon-pop{
  width: 20px;
    height: 20px;
    margin: 5px;
}
.content-icon{
  display: flex;
    flex-direction: column;
    
}
.btn-title{
    display: flex;
    justify-content: space-between;
}
  
</style>
