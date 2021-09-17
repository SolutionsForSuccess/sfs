<template>
    <div class="screen">
    <ion-backdrop v-if="isBackdrop"></ion-backdrop>

    <ion-header>
          <ion-toolbar>
            <ion-buttons slot="start">
              <ion-back-button default-href="/controlPanel" @click="$router.push({ name: 'ControlPanel', params: {viewSelected: 'Config'}})"></ion-back-button>
            </ion-buttons>
            <ion-label style="padding: 20px 100px;">
              <h1>{{$t('backoffice.titles.supportPanel')}} </h1>            
            </ion-label>

           
          </ion-toolbar>
    </ion-header>
        
       
        <ion-progress-bar v-if="spinner" type="indeterminate"></ion-progress-bar>
        

        <div >

             <ion-segment scrollable id="productSegment" @ionChange="segmentValueGeneral=$event.target.value,segmentValueBusiness=''" :value="segmentValueGeneral">
               
                <ion-segment-button value="Config">
                    <div>
                         <span class="iconify" data-icon="icon-park-outline:config"></span>
                          Config
                    </div>
                </ion-segment-button> 
                <ion-segment-button value="thisBusiness">
                    <div>
                        <span class="iconify" data-icon="dashicons:pressthis"></span>
                          {{businessName}}
                    </div>
                </ion-segment-button>  
                 <ion-segment-button value="User">
                  <span class="iconify" data-icon="dashicons:businessperson"></span>
                  {{$t('backoffice.form.titles.supportUsers')}}
                </ion-segment-button>      
                 <ion-segment-button value="Business">
                  <span class="iconify" data-icon="bx:bxs-business"></span>
                  {{$t('frontend.createNew.business')}}
                </ion-segment-button>  
            </ion-segment>

            

                <div v-if="segmentValueGeneral==='Config'">

                    <!-- email -->
                    <ion-card>
                        <div style="display: flex; justify-content: space-between;">
                            <ion-item>
                            <h5> {{$t('backoffice.form.titles.emailConfiguration')}}</h5>                           
                            </ion-item>
                                <ion-button
                                    fill="clear"
                                    shape="round"                             
                                    class="list-gourp-btn"
                                    side="end"   
                                        @click="mmsShow=='email'?mmsShow='' :mmsShow='email'"                      
                                    >
                                    <ion-icon v-if="mmsShow==='email'" slot="icon-only"  icon="md-arrow-drop-down"  class="more-grid" ></ion-icon>
                                    <ion-icon v-else slot="icon-only"  icon="md-arrow-drop-right"  class="more-grid" ></ion-icon>
                                </ion-button>
                        </div>
                        <div v-if="mmsShow==='email'">
                            <ion-row>
                                <ion-col size="12" size-md="6">
                                    <ion-item>
                                        <ion-label position="floating"><span style="color: red">*</span>{{$t('backoffice.form.fields.smtpHost')}}</ion-label>
                                        <ion-input type="text" name="SmtpHost"
                                        @input="SmtpHost = $event.target.value" 
                                        v-bind:value="SmtpHost">
                                        </ion-input>
                                    </ion-item>
                                    <ion-item>
                                        <ion-label position="floating"><span style="color: red">*</span>{{$t('backoffice.form.fields.port')}}</ion-label>
                                        <ion-input type="number" name="Port"
                                        @input="Port = $event.target.value" 
                                        v-bind:value="Port">
                                        </ion-input>
                                    </ion-item>
                                    <ion-item>
                                        <ion-label>{{$t('backoffice.form.fields.secure')}}</ion-label>
                                        <ion-checkbox slot="end" name="Secure" 
                                                @ionChange="Secure=$event.target.checked" 
                                                :checked="Secure">
                                        </ion-checkbox>
                                    </ion-item>

                                </ion-col>
                                <ion-col size="12" size-md="6">
                                     <ion-item>
                                        <ion-label position="floating"><span style="color: red">*</span>{{$t('backoffice.form.fields.email')}}</ion-label>
                                        <ion-input type="email" name="EmailHost"
                                        @input="EmailHost = $event.target.value" 
                                        v-bind:value="EmailHost">
                                        </ion-input>
                                    </ion-item>
                                    <ion-item>
                                        <ion-label position="floating"><span style="color: red">*</span>{{$t('backoffice.form.fields.password')}}</ion-label>
                                        <ion-input type="password" name="Password"
                                        @input="Password = $event.target.value" 
                                        v-bind:value="Password">
                                        </ion-input>
                                    </ion-item>
                                    
                                    <ion-item>
                                        <ion-item-group side="start">
                                            <ion-label position="floating"><span style="color: red">*</span>{{$t('backoffice.emailTest.sendTest')}}</ion-label>
                                            <ion-input type="email" name="EmailTest"
                                            @input="EmailTest = $event.target.value" 
                                            v-bind:value="EmailTest">
                                            </ion-input>
                                             <ion-button color="primary" :disabled="checkEmailTest()" @click="emailTest()">Send <ion-spinner v-if="emailspinner" name="crescent"></ion-spinner></ion-button>
                                       
                                        </ion-item-group>
                                       
                                    </ion-item>

                                </ion-col>
                            </ion-row>
                                    
                   
                        </div>
                        
                    </ion-card>

                    <!-- twilio -->
                    <ion-card>
                        <div style="display: flex; justify-content: space-between;">
                            <ion-item>
                            <h5> {{$t('backoffice.form.titles.twilioSMS')}}</h5>
                            <ion-toggle color="primary" 
                                @ionChange="setActivate($event.target.checked, 'twilio')" 
                                :checked ="activateTwilio"
                            ></ion-toggle>
                            </ion-item>
                                <ion-button
                                    fill="clear"
                                    shape="round"                             
                                    class="list-gourp-btn"
                                    side="end"   
                                        @click="mmsShow=='twilio'?mmsShow='' :mmsShow='twilio'"                      
                                    >
                                    <ion-icon v-if="mmsShow==='twilio'" slot="icon-only"  icon="md-arrow-drop-down"  class="more-grid" ></ion-icon>
                                    <ion-icon v-else slot="icon-only"  icon="md-arrow-drop-right"  class="more-grid" ></ion-icon>
                                </ion-button>
                        </div>
                        <div v-if="mmsShow==='twilio'">
                            <ion-item>
                                    <ion-label position="floating"><span style="color: red">*</span>{{$t('backoffice.form.fields.twFromNumber')}}</ion-label>
                                    <ion-input type="text" name="TwFromNumber"
                                        @input="TwFromNumber = $event.target.value" 
                                        v-bind:value="TwFromNumber">
                                    </ion-input>
                                </ion-item>
                                <ion-item>
                                    <ion-label position="floating"><span style="color: red">*</span>{{$t('backoffice.form.fields.twAccountSID')}}</ion-label>
                                    <ion-input :type="showTwAccountSid" name="TwAccountSid"
                                    @input="TwAccountSid = $event.target.value" 
                                    v-bind:value="TwAccountSid">
                                    </ion-input>
                                    <ion-chip slot="end" color="primary" outline="true" @click="changeTwAccountSid()"><ion-icon name="eye"></ion-icon></ion-chip>
                                </ion-item>
                                <ion-item>
                                    <ion-label position="floating"><span style="color: red">*</span>{{$t('backoffice.form.fields.twToken')}}</ion-label>
                                    <ion-input :type="showTwToken" name="TwToken"
                                    @input="TwToken = $event.target.value" 
                                    v-bind:value="TwToken">
                                    </ion-input>
                                    <ion-chip slot="end" color="primary" outline="true" @click="changeTwToken()"><ion-icon name="eye"></ion-icon></ion-chip>
                                </ion-item>
                        </div>
                        
                    </ion-card>

                    <!-- sinch -->
                    <ion-card>
                        <div style="display: flex; justify-content: space-between;">
                            <ion-item>
                            <h5>{{$t('backoffice.form.titles.sinchSMS')}}</h5>
                            <ion-toggle color="primary" 
                                @ionChange="setActivate($event.target.checked, 'sinch')" 
                                        :checked ="activateSinch"
                            ></ion-toggle>
                            </ion-item>
                                <ion-button
                                    fill="clear"
                                    shape="round"                             
                                    class="list-gourp-btn"
                                    side="end"   
                                        @click="mmsShow=='sinch'?mmsShow='' :mmsShow='sinch'"                      
                                    >
                                    <ion-icon v-if="mmsShow==='sinch'" slot="icon-only"  icon="md-arrow-drop-down"  class="more-grid" ></ion-icon>
                                    <ion-icon v-else slot="icon-only"  icon="md-arrow-drop-right"  class="more-grid" ></ion-icon>
                                </ion-button>
                        </div>
                        <div v-if="mmsShow==='sinch'">
                            <ion-item>
                                    <ion-label position="floating"><span style="color: red">*</span>{{$t('backoffice.form.fields.sinchFromNumber')}}</ion-label>
                                    <ion-input type="text" name="SinchFromNumber"
                                        @input="SinchFromNumber = $event.target.value" 
                                        v-bind:value="SinchFromNumber">
                                    </ion-input>
                                </ion-item>
                                <ion-item>
                                    <ion-label position="floating"><span style="color: red">*</span>{{$t('backoffice.form.fields.sinchAccountSID')}}</ion-label>
                                    <ion-input :type="showSinchAccountSid" name="SinchAccountSid"
                                    @input="SinchAccountSid = $event.target.value" 
                                    v-bind:value="SinchAccountSid">
                                    </ion-input>
                                    <ion-chip slot="end" color="primary" outline="true" @click="changeSinchAccountSid()"><ion-icon name="eye"></ion-icon></ion-chip>
                                </ion-item>
                                <ion-item>
                                    <ion-label position="floating"><span style="color: red">*</span>{{$t('backoffice.form.fields.sinchToken')}}</ion-label>
                                    <ion-input :type="showSinchToken" name="SinchToken"
                                    @input="SinchToken = $event.target.value" 
                                    v-bind:value="SinchToken">
                                    </ion-input>
                                    <ion-chip slot="end" color="primary" outline="true" @click="changeSinchToken()"><ion-icon name="eye"></ion-icon></ion-chip>
                                </ion-item>
                        </div>
                        
                    </ion-card>

                      <!-- shift4 -->
                    <ion-card>
                        <div style="display: flex; justify-content: space-between;">
                            <ion-item>
                            <h5> CONFIG SHIF4</h5>                           
                            </ion-item>
                                <ion-button
                                    fill="clear"
                                    shape="round"                             
                                    class="list-gourp-btn"
                                    side="end"   
                                        @click="mmsShow=='shift4'?mmsShow='' :mmsShow='shift4'"                      
                                    >
                                    <ion-icon v-if="mmsShow==='shift4'" slot="icon-only"  icon="md-arrow-drop-down"  class="more-grid" ></ion-icon>
                                    <ion-icon v-else slot="icon-only"  icon="md-arrow-drop-right"  class="more-grid" ></ion-icon>
                                </ion-button>
                        </div>
                        <div v-if="mmsShow==='shift4'">
                            <ion-row>
                                <ion-col size="12" size-md="6">
                                    <ion-item>
                                        <ion-label position="floating"><span style="color: red">*</span>EndPoint URL Shift4 </ion-label>
                                        <ion-input type="text" name="EndPointURLShift4"
                                        @input="EndPointURLShift4 = $event.target.value" 
                                        v-bind:value="EndPointURLShift4">
                                        </ion-input>
                                    </ion-item>
                                    <ion-item>
                                        <ion-label position="floating"><span style="color: red">*</span>Client GUID Shift4 </ion-label>
                                        <ion-input  name="ClientGUIDShift4"
                                        @input="ClientGUIDShift4 = $event.target.value" 
                                        v-bind:value="ClientGUIDShift4">
                                        </ion-input>
                                    </ion-item>
                                 

                                </ion-col>
                                <ion-col size="12" size-md="6">
                                    <ion-item>
                                        <ion-label position="floating"><span style="color: red">*</span>Interface Version Shift4</ion-label>
                                        <ion-input  name="InterfaceVersionShift4"
                                            @input="InterfaceVersionShift4 = $event.target.value" 
                                            v-bind:value="InterfaceVersionShift4">
                                        </ion-input>
                                    </ion-item>
                                    <ion-item>
                                        <ion-label position="floating"><span style="color: red">*</span>Interface Name Shift4</ion-label>
                                        <ion-input  name="InterfaceNameShift4"
                                            @input="InterfaceNameShift4 = $event.target.value" 
                                            v-bind:value="InterfaceNameShift4">
                                        </ion-input>
                                    </ion-item>
                                    <ion-item>
                                        <ion-label position="floating"><span style="color: red">*</span>Company Name Shift4</ion-label>
                                        <ion-input  name="CompanyNameShift4"
                                            @input="CompanyNameShift4 = $event.target.value" 
                                            v-bind:value="CompanyNameShift4">
                                        </ion-input>
                                    </ion-item>

                                </ion-col>
                            </ion-row>
                                    
                   
                        </div>
                        
                    </ion-card>

                      <!-- ads -->
                    <ion-card>
                        <div style="display: flex; justify-content: space-between;">
                            <ion-item>
                                <h5> {{$t('frontend.menu.ads')}}</h5>
                            </ion-item>
                                <ion-button
                                    fill="clear"
                                    shape="round"                             
                                    class="list-gourp-btn"
                                    side="end"   
                                        @click="mmsShow=='ads'?mmsShow='' :mmsShow='ads'"                      
                                    >
                                    <ion-icon v-if="mmsShow==='ads'" slot="icon-only"  icon="md-arrow-drop-down"  class="more-grid" ></ion-icon>
                                    <ion-icon v-else slot="icon-only"  icon="md-arrow-drop-right"  class="more-grid" ></ion-icon>
                                </ion-button>
                        </div>
                        <div v-if="mmsShow==='ads'">
                            <ManageAds :typeProp="'app'"/>
                        </div>
                        
                    </ion-card>

                     <!-- captcha -->
                    <ion-card>
                        <div style="display: flex; justify-content: space-between;">
                            <ion-item>
                                <h5> {{$t('backoffice.form.titles.capcha')}}</h5>
                            </ion-item>
                                <ion-button
                                    fill="clear"
                                    shape="round"                             
                                    class="list-gourp-btn"
                                    side="end"   
                                        @click="mmsShow=='capcha'?mmsShow='' :mmsShow='capcha'"                      
                                    >
                                    <ion-icon v-if="mmsShow==='capcha'" slot="icon-only"  icon="md-arrow-drop-down"  class="more-grid" ></ion-icon>
                                    <ion-icon v-else slot="icon-only"  icon="md-arrow-drop-right"  class="more-grid" ></ion-icon>
                                </ion-button>
                        </div>
                        <div v-if="mmsShow==='capcha'">
                            <ion-item>
                                    <ion-label position="floating"><span style="color: red">*</span>{{$t('backoffice.form.fields.capchaKey')}}</ion-label>
                                    <ion-input type="text" name="capchaKey"
                                    @input="capchaKey = $event.target.value" 
                                    v-bind:value="capchaKey">
                                    </ion-input>
                                </ion-item>
                        </div>
                        
                    </ion-card>


                   
                    <ion-button 
                        expand="full" 
                        color="primary" 
                        v-if="mmsShow!=='ads'"
                        :disabled="!isValidForm()" @click="save()">{{ $t('backoffice.form.buttons.save') }}
                    </ion-button>
                </div>

                <div v-if="segmentValueGeneral==='thisBusiness'">
                   
                    <ion-row >
                        <ion-col size="12"> <h3 style="text-align: left">                            
                             {{$t('backoffice.form.titles.generalConfiguration')}}
                        </h3>
                           </ion-col>

                       <ion-col size="12" size-md="6">
                           <ion-item>
                               <ion-label>{{$t('frontend.createNew.restaurantType')}}</ion-label>
                                <ion-select interface="popover" icon="add" 
                                    style=""
                                    :ok-text="$t('backoffice.form.messages.buttons.ok')"
                                    :cancel-text="$t('backoffice.form.messages.buttons.dismiss')"                                    
                                    :placeholder="$t('frontend.createNew.select')"
                                    :value="businessType"
                                    @ionChange="changeBusinessType($event.target.value)"                          
                                    >
                                        <ion-select-option v-for="(res) in businessTypeList" :key="res"
                                        :value="res" >{{res}}
                                        </ion-select-option>  
                                </ion-select>
                           </ion-item>
                            <ion-item>
                                <ion-label >View Catering</ion-label>
                                <ion-toggle name="ViewCatering" style="top: 12px;" Key="other"
                                    @ionChange="restaurantS.ViewCatering=$event.target.checked" 
                                    :checked ="restaurantS.ViewCatering || 0">
                                </ion-toggle>
                                
                            </ion-item>
                      
                            <ion-item>
                                <ion-label >View Reservation  </ion-label>
                                <ion-toggle name="ViewReservation" style="top: 12px;" Key="other"
                                    @ionChange="restaurantS.ViewReservation=$event.target.checked" 
                                    :checked ="restaurantS.ViewReservation">
                                </ion-toggle>
                            </ion-item>
                        
                            <ion-item>
                                <ion-label >View Digital Signed </ion-label>
                                <ion-toggle name="ViewDigitalSigned" style="top: 12px;" Key="other"
                                    @ionChange="restaurantS.ViewDigitalSigned=$event.target.checked" 
                                    :checked ="restaurantS.ViewDigitalSigned">
                                </ion-toggle>
                                
                            </ion-item>
                       
                            
                        </ion-col>

                         <ion-col size="12" size-md="6">
                             <ion-item>
                                    <ion-label >View Loyalty Program</ion-label>
                                    <ion-toggle name="ViewLoyalty" style="top: 12px;" Key="other"
                                        @ionChange="restaurantS.ViewLoyalty=$event.target.checked" 
                                        :checked ="restaurantS.ViewLoyalty">
                                    </ion-toggle>
                            </ion-item>

                            <ion-item>
                                <ion-label >View Special Prices</ion-label>
                                <ion-toggle name="ViewSpecialPrice" style="top: 12px;" Key="other"
                                    @ionChange="restaurantS.ViewSpecialPrice=$event.target.checked" 
                                    :checked ="restaurantS.ViewSpecialPrice">
                                </ion-toggle>
                            </ion-item>
                       
                            <ion-item>
                                <ion-label >View Drivers </ion-label>
                                <ion-toggle name="ViewDrivers" style="top: 12px;" Key="other"
                                    @ionChange="restaurantS.ViewDrivers=$event.target.checked" 
                                    :checked ="restaurantS.ViewDrivers">
                                </ion-toggle>
                            </ion-item>
                        
                            <ion-item>
                                <ion-label >View Suscriptors </ion-label>
                                <ion-toggle name="ViewSuscriptors" style="top: 12px;" Key="other"
                                    @ionChange="restaurantS.ViewSuscriptors=$event.target.checked" 
                                    :checked ="restaurantS.ViewSuscriptors">
                                </ion-toggle>
                            </ion-item>
                       </ion-col>
                       
                       

                        <br/>
                    </ion-row>

                    <h3 style="text-align: left">
                            {{$t('backoffice.form.titles.paymentConfiguration')}}
                        </h3>
                     <Payments/>
                    <ion-button expand="full" color="primary"  @click="saveRestaurantData()">{{ $t('backoffice.form.buttons.save') }}</ion-button>
                </div>

                <div v-if="segmentValueGeneral==='User'">
                    <div id="user" class="page">
                        <listView
                        :title="$t('backoffice.form.titles.supportUsers')"
                        :filter="filterUsers"
                        :elements="users"
                        :hasImg="true"
                        :add="true"
                        :edit="true"
                        :remove="true"
                        @handleInput="handleInput"
                        @handleAddClick="newUser"   
                        @editElement="editUser"
                        @deleteElement="deleteUser"   
                        ></listView>
                    </div>
                </div>

                <div v-if="segmentValueGeneral==='Business'">
                    <ion-segment :value="restaurantSegmentValue" @input="value=restaurantSegmentValue">
                        <ion-segment-button value="create" @click="restaurantSegmentValue='create'">
                            <span>{{$t('frontend.createNew.restaurantType')}}</span>
                        </ion-segment-button>
                        <ion-segment-button value="deleter" @click="restaurantSegmentValue='deleter'">
                            <span>Delete</span>
                        </ion-segment-button>
                    </ion-segment>
                    <!-- Crear -->
                    <div v-if="restaurantSegmentValue==='create'">
                        <RestaurantType/>
                    </div>
                    <!-- Delete -->
                    <div v-if="restaurantSegmentValue==='deleter'" >
                        
                        
                        <div v-if="allRestaurant.length > 0"  style="display: flex;justify-content: center;padding: 40px 0;">
                            <ion-thumbnail >
                                    <img  :src="imgRestaurant">
                            </ion-thumbnail> 
                                    <ion-select interface="popover" icon="add"
                                    style="padding: 10px 50px;"
                                    :ok-text="$t('backoffice.form.messages.buttons.ok')"
                                    :cancel-text="$t('backoffice.form.messages.buttons.dismiss')"
                                    :value="allRestaurant[0]._id"
                                    :placeholder="$t('frontend.menu.menu')"
                                        @ionChange="idDeleteRestaurant=$event.target.value,getRestaurantImg()" >
                                        <ion-select-option v-for="res in allRestaurant"                    
                                            :key="res._id" 
                                            :value="res._id" > {{res.Name}}
                                        </ion-select-option>                                
                                    </ion-select>

                                    <ion-button :disabled="idDeleteRestaurant ===''? true : false" color="light"
                                        v-if="!spinnerDelete"
                                        @click="deleteRestaurant()">
                                        <span  class="iconify" data-icon="fluent:delete-16-regular" data-inline="false" style="color: red;margin:0"></span>
                                    </ion-button>
                                    <ion-spinner v-if="spinnerDelete" color="danger"></ion-spinner>
                            </div>
                    </div>
                </div>
            
            
   

        </div>
   
    
  
    </div>
</template>

<script>

import { Api } from '../api/api.js';
import { EventBus } from '../../frontend/event-bus';

import RestaurantType from './RestaurantType.vue'
import ManageAds from './manageAds.vue'
import Payments from './PaymentSettingsForm.vue'
import listView from "../components/ListView";

export default {

  name: 'funDataSettingForm',
   
  data () {
    return {
      modelName: 'imenusupport',
        businessName: '',
      emailspinner: false,

      SmtpHost: '',
      EmailHost: '',
      Port: 0,
      Secure: false,
      Password: '',

   

      //SMS
      TwFromNumber: '',
      TwAccountSid: '',
      TwToken: '',
      FreeTwilioMessage: 0,
      activateTwilio: false,

      showTwAccountSid: "password",
      showTwToken: "password",

      SinchFromNumber: '',
      SinchAccountSid: '',
      SinchToken: '',
      activateSinch: false,

      showSinchAccountSid: "password",
      showSinchToken: "password",

      //Authorize.net
      endPointUrl : '',
      apiLoginId: '',
      transactionKey:'',

      showApiLoginId: "password",
      showTransactionKey: "password",

      //Shift4
      EndPointURLShift4: '',
      ClientGUIDShift4: '',
      InterfaceVersionShift4: '',
      InterfaceNameShift4: '',
      CompanyNameShift4: '',

      //Shift4 Access Token
      showShift4AccessToken: "password",
      Shift4AccessToken: '',

      //Shift4 Moto Access Token
      showShift4MotoAccessToken: "password",
      Shift4MotoAccessToken: '',

      //Shift4 FB Access Token
      showShift4FBAccessToken: "password",
      Shift4FBAccessToken: '',

      HasDeliveryPayment: false,
      Setting_id: null,

      //Shift4 Delivery Access Token
      showShift4DeliveryAccessToken: "password",
      Shift4DeliveryAccessToken: '',

      //Shift4 Delivery Moto Access Token
      showShift4DeliveryMotoAccessToken: "password",
      Shift4DeliveryMotoAccessToken: '',

      //Shift4 Delivery FB Access Token
      showShift4DeliveryFBAccessToken: "password",
      Shift4DeliveryFBAccessToken: '',

      //Capcha
      capchaKey: '',

      id: null,
      methodPayment_id: null,
      isBackdrop: false,
      spinner: false,

      //Segment
      segmentValue: 'thisBusiness',
      paySegmentValue: 'shift4',
      email: true,
      sms: false,
      payments: false,
      capcha: false,
      user: false,
      restaurantSetting: false,
      ads: false,

      //Payments segments
      shift4: true,
      auth: false,

      //Users
      users: [],
      filterUsers: [],

      //Restaurants Data
    //   settings: [],
    //   restaurants: [],
    //   restaurantId: null,
      restaurantS: null,

      paginate: ['languages'],

      screenWidth: 0,

      restaurantSegmentValue: 'create',
      allRestaurant: [],
      idDeleteRestaurant: '',
      imgRestaurant: '',
      key: 0,
      spinnerDelete: false,

      //Email Test
      EmailTest: '',
      segmentValueBusiness:'Config',
      segmentValueGeneral:'Config',

      mmsShow: '',
      businessTypeList: ['Hospitality','Reservations','Service','Entertainment','Retail'],
      businessType: ''
    }
  },
  components:{
    RestaurantType, ManageAds, Payments, listView
  },
  created: async function(){
     
     this.businessName = this.$store.state.backConfig.restaurant.Name ;      
     this.businessType = this.$store.state.backConfig.restaurant.BusinessType ;      
     this.restaurantS = this.$store.state.backConfig.setting ;      
    await this.getAllRestaurant();
 
    this.imgRestaurant = this.allRestaurant[0].ImageUrl;
      this.init();
  },
  methods: {

    doRefresh() {
     
    },

     ListViewData(option, count){
      if(count === 1) return option.ImageUrl;
      if(count === 2) return option.FirstName
      if(count === 3) return option.LastName;
      if(count === 4) return option.Email;
      if(count === 5) return null;
    },

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

    async emailTest(){
        this.emailspinner = true
        const test = {
            "Email": this.EmailTest,
            "mss": this.$t('backoffice.emailTest.message'),
            "subject": this.$t('backoffice.emailTest.subject')
        }
        await Api.testSupportEmail(test)
        .then(() => {
            this.showToastMessage(this.$t('backoffice.emailTest.success'), 'success')
            this.emailspinner = false
        })
        .catch(e => {
            this.showToastMessage(e, 'danger')
            e
            this.emailspinner = false
        })
    },

    changeApiLoginId(){
        if (this.showApiLoginId == "password")
            this.showApiLoginId = "text"
        else
            this.showApiLoginId = "password"
    },

    changeTransactionKey(){
        if (this.showTransactionKey == "password")
            this.showTransactionKey = "text"
        else
            this.showTransactionKey = "password"
    },

    changeTwAccountSid(){
        if (this.showTwAccountSid == "password")
            this.showTwAccountSid = "text"
        else
            this.showTwAccountSid = "password"
    },

    changeTwToken(){
        if (this.showTwToken == "password")
            this.showTwToken = "text"
        else
            this.showTwToken = "password"
    },

    changeSinchAccountSid(){
        if (this.showSinchAccountSid == "password")
            this.showSinchAccountSid = "text"
        else
            this.showSinchAccountSid = "password"
    },

    changeSinchToken(){
        if (this.showSinchToken == "password")
            this.showSinchToken = "text"
        else
            this.showSinchToken = "password"
    },

    changeShift4AccessToken(){
        if (this.showShift4AccessToken == "password")
            this.showShift4AccessToken = "text"
        else
            this.showShift4AccessToken = "password"
    },

    changeShift4MotoAccessToken(){
        if (this.showShift4MotoAccessToken == "password")
            this.showShift4MotoAccessToken = "text"
        else
            this.showShift4MotoAccessToken = "password"
    },

    changeShift4FBAccessToken(){
        if (this.showShift4FBAccessToken == "password")
            this.showShift4FBAccessToken = "text"
        else
            this.showShift4FBAccessToken = "password"
    },

    changeShift4DeliveryAccessToken(){
        if (this.showShift4DeliveryAccessToken == "password")
            this.showShift4DeliveryAccessToken = "text"
        else
            this.showShift4DeliveryAccessToken = "password"
    },

    changeShift4DeliveryMotoAccessToken(){
        if (this.showShift4DeliveryMotoAccessToken == "password")
            this.showShift4DeliveryMotoAccessToken = "text"
        else
            this.showShift4DeliveryMotoAccessToken = "password"
    },

    changeShift4DeliveryFBAccessToken(){
        if (this.showShift4DeliveryFBAccessToken == "password")
            this.showShift4DeliveryFBAccessToken = "text"
        else
            this.showShift4DeliveryFBAccessToken = "password"
    },

    setActivate(val, system){
        if (system === 'twilio'){
            this.activateTwilio = val
            if (val)
                this.activateSinch = !val
        }
        if(system === 'sinch'){
            if (val)
                this.activateTwilio = !val
            this.activateSinch = val
        }
    },


    paySegmentChanged(value){
        if(value === 'shift4'){
            this.shift4 = true
            this.auth = false
        }
        if(value === 'auth'){
            this.shift4 = false
            this.auth = true
        }
    },

    handleInput(value){
      this.filterUsers = this.users
      const query = value.toLowerCase();
      requestAnimationFrame(() => {   
        let cat2 = this.users.filter(item => item.Email.toLowerCase().indexOf(query) > -1)
        if(cat2.length> 0)
          this.filterUsers = cat2
        else
          this.filterUsers = this.users
      });
    },

    fetchUsers: function(){
        this.$ionic.loadingController
        .create({
          cssClass: 'my-custom-class',
          message: this.$t('backoffice.titles.loading'),
          backdropDismiss: true
        })
        .then(loading => {
            loading.present()
            setTimeout(() => {
                //llamada ajax						
                Api.fetchAll('Staff').then(response => {
                  this.users = response.data
                  this.users = this.users.filter(usr => usr.IsSupport == true)
                  this.filterUsers = this.users
                  loading.dismiss()
                })
                .catch(e => {
                  e
                  loading.dismiss()
                  this.ifErrorOccured(this.fetchUsers)
                });
            })
        })
    },

    fetchRestaurant: async function(){
        try{
            let response = await Api.fetchAll('Restaurant')
            return response.data;
        }
        catch(e){
            e
        }
    },

    
    async saveRestaurantData(){
        try{
            this.spinner = true
            await Api.putIn('Setting', this.restaurantS)
            this.$store.state.backConfig.setting = this.restaurantS;
            this.showToastMessage('The setting was change successfully', 'success')
            this.spinner = false
        }
        catch(e){
            e
            this.spinner = false
            this.showToastMessage('There was an error saved settings.', 'danger')
        }
    },

    newUser: function(){
        this.$router.push({
        name: 'UserForm', 
        params: { 
            userId: null,
            isSupport: true
        }
      });
    },

    editUser: function(id){
        this.$router.push({
        name: 'UserForm', 
        params: { 
            userId: id,
            isSupport: true
        }
      });
    },

    deleteUser: function(id){

        return this.$ionic.alertController.create({
        title: this.$t('backoffice.list.messages.confirmDelete'),
        message: this.$t('backoffice.list.messages.deleteUser'),
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
                    // this.ShowMessage(this.$t('backoffice.list.messages.infoDeleteSuccess'),
                    //   this.$t('backoffice.list.messages.messageDeleteSuccessUser'),
                    //       this.$t('backoffice.list.messages.deleteSubtitleUser'));
                  this.showToastMessage(this.$t('backoffice.list.messages.messageDeleteSuccessUser'), "success");
                  this.fetchUsers();
                  this.spinner = false;
                  return response;
                })
                .catch(e => {
                  e;
                  this.ifErrorOccured(mess => {
                      this.deleteUser(id)
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

    async init(){
        this.screenWidth = screen.width;
        this.id = this.$route.params.settingId;       
        this.fetchUsers();
     
       const response = await Api.fetchAll(this.modelName);  
        if(response.status === 200)             
        if (response.data.length > 0)
        {
            this.id = response.data[0]._id
            this.SmtpHost = response.data[0].SmtpHost
            this.EmailHost = response.data[0].EmailHost
            this.Port = response.data[0].Port
            this.Secure = response.data[0].Secure
            this.Password = response.data[0].Password
            this.TwFromNumber = response.data[0].TwFromNumber
            this.TwAccountSid = response.data[0].TwAccountSid
            this.TwToken = response.data[0].TwToken

            if (response.data[0].smsSystem === 'twilio')
            this.activateTwilio = true
            if (response.data[0].smsSystem === 'sinch')
            this.activateSinch = true

            this.SinchFromNumber = response.data[0].SinchFromNumber
            this.SinchAccountSid = response.data[0].SinchAccountSid
            this.SinchToken = response.data[0].SinchToken

            this.FreeTwilioMessage = response.data[0].FreeTwilioMessage
            this.EndPointURLShift4 = response.data[0].EndPointURLShift4
            this.ClientGUIDShift4 = response.data[0].ClientGUIDShift4
            this.InterfaceVersionShift4 = response.data[0].InterfaceVersionShift4
            this.InterfaceNameShift4 = response.data[0].InterfaceNameShift4
            this.CompanyNameShift4 = response.data[0].CompanyNameShift4
            this.capchaKey = response.data[0].CaptchaKey
        }

        //Has Delivery Payment
        this.Setting_id = this.$store.state.backConfig.setting._id
        this.HasDeliveryPayment = this.$store.state.backConfig.setting.HasDeliveryPayment || false;
            

        
        //Payment Methods
        const dataMethod = this.$store.state.backConfig.methodspay
        if (dataMethod.length > 0){
            this.methodPayment_id = dataMethod[0]._id
            this.Shift4AccessToken = dataMethod[0].AccessTokenShift4
            this.Shift4MotoAccessToken = dataMethod[0].MotoAccessTokenShift4
            this.Shift4FBAccessToken = dataMethod[0].FBAccessTokenShift4
            this.Shift4DeliveryAccessToken = dataMethod[0].DeliveryAccessTokenShift4
            this.Shift4DeliveryMotoAccessToken = dataMethod[0].DeliveryMotoAccessTokenShift4
            this.Shift4DeliveryFBAccessToken = dataMethod[0].DeliveryFBAccessTokenShift4
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

    save: function(){

        if (this.isValidForm()){

          this.isBackdrop = true;

            let smsSystem = ''
            if (this.activateTwilio)
                smsSystem = 'twilio'
            if (this.activateSinch)
                smsSystem = 'sinch'
            
            let item = {
                "SmtpHost": this.SmtpHost,
                "EmailHost": this.EmailHost,
                "Port": this.Port,
                "Secure": this.Secure,
                "Password": this.Password,
                "TwFromNumber": this.TwFromNumber,
                "TwAccountSid": this.TwAccountSid,
                "TwToken": this.TwToken,
                "SinchFromNumber": this.SinchFromNumber,
                "SinchAccountSid": this.SinchAccountSid,
                "SinchToken": this.SinchToken,
                "smsSystem": smsSystem,
                "FreeTwilioMessage": this.FreeTwilioMessage,
                "EndPointURLShift4": this.EndPointURLShift4,
                "ClientGUIDShift4": this.ClientGUIDShift4,
                "InterfaceVersionShift4": this.InterfaceVersionShift4,
                "InterfaceNameShift4": this.InterfaceNameShift4,
                "CompanyNameShift4": this.CompanyNameShift4,
                "CaptchaKey": this.captchaKey,
            }

            let methodPaymentItem = {
                "AccessTokenShift4": this.Shift4AccessToken,
                "MotoAccessTokenShift4": this.Shift4MotoAccessToken,
                "FBAccessTokenShift4": this.Shift4FBAccessToken,
                "DeliveryAccessTokenShift4": this.Shift4DeliveryAccessToken,
                "DeliveryMotoAccessTokenShift4": this.Shift4DeliveryMotoAccessToken,
                "DeliveryFBAccessTokenShift4": this.Shift4DeliveryFBAccessToken
            }

            let settingItem = {
                "HasDeliveryPayment": this.HasDeliveryPayment
            }

            //If I am editing
            if (this.id){
              item['_id'] = this.id;
              this.spinner = true;
              Api.putIn(this.modelName, item)
                  .then(response => {
                        this.showToastMessage(this.$t('backoffice.list.messages.messageEditSuccessSetting'), "success");
                        this.spinner = false;
                        if (this.methodPayment_id){
                            methodPaymentItem["_id"] = this.methodPayment_id
                            Api.putIn("methodpay", methodPaymentItem)
                            .catch(error => {
                                error
                            })
                        }
                        

                        if (this.Setting_id){
                            settingItem["_id"] = this.Setting_id
                            Api.putIn("setting", settingItem)
                            .catch(error => {
                                error
                            })
                        }
                        // else{
                        //     Api.postIn("setting", settingItem)
                        //     .catch(error => {
                        //         error
                        //     })
                        // }
                        
                        return response;
                  })
                  .catch(e => {
                        e;
                        this.spinner = false
                        this.ifErrorOccured(this.save);
                  })


            }
           
        }
    },
    
    async getAllRestaurant(){
         const all = await this.fetchRestaurant();

        for(var i =0; i < this.$store.state.user.AllRestaurant.length; i++){
            try{
                const rest =  all.find( r => r._id === this.$store.state.user.AllRestaurant[i]);
                if(rest)
                    this.allRestaurant.push(rest);
            }
            catch(e){
                e
            }   
        }
    },

    async deleteRestaurant(){

        this.$ionic.alertController.create({
        title: this.$t('backoffice.list.messages.confirmDelete'),
        message: this.$t('backoffice.list.messages.deleteRestaurant'),
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

                if(this.idDeleteRestaurant !== ''){
                    this.spinnerDelete = true;
                    await Api.deleteRestaurant(this.idDeleteRestaurant);

                    //DELETE RESTAURANT FROM STORAGE
                    let resIndex = this.$store.state.user.AllRestaurant.indexOf(this.idDeleteRestaurant);
                    if (resIndex){
                        this.$store.state.user.AllRestaurant.splice(resIndex, 1);
                        
                        this.allRestaurant = []
                        await this.getAllRestaurant()
                        EventBus.$emit('userRestaurant', this.allRestaurant)
                        this.showToastMessage(this.$t('backoffice.list.messages.messageDeleteSuccessRestaurant'), 'success')
                    }
                    
                    this.spinnerDelete = false;
                }

            }
          }
        ]
      })
      .then(a => a.present());

        
    },

    getRestaurantImg(){ 
       //  this.key ++;      
        const index = this.allRestaurant.findIndex(r => r._id === this.idDeleteRestaurant)
            if(index !== -1){
                if(this.allRestaurant[index].ImageUrl){
                     this.imgRestaurant = this.allRestaurant[index].ImageUrl;
                     return;
                }
            }
                           
       
        this.imgRestaurant = '';
    },

    async changeBusinessType(value){
       
        const item = this.$store.state.backConfig.restaurant;
        item.BusinessType = value;
        if(value !== 'Reservations') item.RestaurantBussines = true
        else item.RestaurantBussines = false
        try {
            this.spinner = true
            await Api.putIn('Restaurant', item);
            this.$store.state.backConfig.restaurant = item;
            this.spinner = false
        } catch (error) {
            this.spinner = false
        }
    }
  },
  
}
</script>

<style>

.menu-col-3{
    flex: 0 0 calc(calc(3 / var(--ion-grid-columns, 12)) * 100%);
    width: calc(calc(3 / var(--ion-grid-columns, 12)) * 100%);
    max-width: calc(calc(3 / var(--ion-grid-columns, 12)) * 100%);
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