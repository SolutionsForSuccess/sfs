<template>
    <div class="screen">
      <ion-backdrop v-if="isBackdrop"></ion-backdrop>

      <modal name="occupation-modal"  width="80%" height="auto" style="left: 0px;width: auto;height: auto; max-width: 500px !important;">
        <ion-buttons slot="start" @click="hideOccupation()">
                <ion-back-button default-href="home"></ion-back-button>
        </ion-buttons>
        <ion-header>
            <ion-toolbar>
            <ion-title>{{$t('backoffice.form.titles.occupationNewTitle')}}</ion-title>          
            </ion-toolbar>        
        </ion-header>

        <ion-card>  
          <Occup 
          :externalProp="true"
          @reloadOccupation="reloadOccupation" />

        </ion-card>
      </modal>

      <modal name="rol-modal"  width="80%" height="auto" style="left: 0px;width: auto;height: auto; max-width: 500px !important;">
        <ion-buttons slot="start" @click="hideRol()">
                <ion-back-button default-href="home"></ion-back-button>
        </ion-buttons>
        <ion-header>
            <ion-toolbar>
            <ion-title>{{$t('backoffice.form.titles.roleNewTitle')}}</ion-title>          
            </ion-toolbar>        
        </ion-header>

        <ion-card>  
          <Roles 
          :externalProp="true"
          @reloadRol="reloadRol" />

        </ion-card>
      </modal>

      <modal name="clock-modal"  width="80%" height="auto" style="left: 0px;width: auto;height: auto; max-width: 500px !important;">
        <ion-buttons slot="start" @click="hideClock()">
                <ion-back-button default-href="home"></ion-back-button>
        </ion-buttons>
        <ion-header>
            <ion-toolbar>
            <ion-title>ClockIn-ClockOut</ion-title>          
            </ion-toolbar>        
        </ion-header>

          <Clock :userId="id"/>
      </modal>
      
      <ion-header>
            <ion-toolbar>
              <ion-buttons slot="start">
                <ion-back-button default-href="/controlPanel" @click="backtoList()"></ion-back-button>
              </ion-buttons>
              <ion-label style="padding: 20px 100px;">
                <h1>{{title}}</h1>            
              </ion-label>
            </ion-toolbar>          
      </ion-header>

      <ion-loading
          v-if="spinner"
          cssClass="my-custom-class"
          :message="$t('frontend.tooltips.loadRestaurant')"
      ></ion-loading>

      <div >

        <ion-row>

          <ion-col size="12" size-md="6">

              <ion-card style="width: 50%;">
                  <label v-if="checkImage()"> 
                      <img   :src="file">
                      <input type="file" accept="image/png, image/jpeg" style="display:none"  @change="handleImage" >
                  </label>
                  <label v-else>  {{ $t('backoffice.form.titles.imageText')}} 
                      <input type="file" accept="image/png, image/jpeg" style="display:block"  @change="handleImage" >
                  </label>
              </ion-card>       
          
            <ion-item>
              <ion-label position="floating"><span style="color: red">*</span>{{$t('backoffice.form.fields.firstName')}}</ion-label>
                <ion-input type="text" autocomplete="name" 
                @input="firstName = $event.target.value" 
                v-bind:value="firstName">
              </ion-input>
            </ion-item>

            <ion-item>
              <ion-label position="floating"><span style="color: red">*</span>{{$t('backoffice.form.fields.lastName')}}</ion-label>
                <ion-input type="text" autocomplete="family-name" 
                @input="lastName = $event.target.value" 
                v-bind:value="lastName">
              </ion-input>
            </ion-item>
          
            <ion-item>
              <ion-label position="floating"><span style="color: red">*</span>{{$t('backoffice.form.fields.email')}}</ion-label>
              <ion-input type="email" autocomplete="email" 
              @input="email = $event.target.value" 
              v-bind:value="email">
              </ion-input>
            </ion-item>

            <ion-item>
              <ion-label position="floating"><span style="color: red">*</span>{{$t('backoffice.form.fields.phone')}}</ion-label>
                <ion-input  type="number" autocomplete="tlf" 
                @input="phone = $event.target.value" 
                v-bind:value="phone">
              </ion-input>
            </ion-item>

            <ion-item>
              <ion-label position="floating">{{$t('backoffice.form.fields.address')}}</ion-label>
              <ion-textarea  autocomplete="address-line1" 
              @input="address = $event.target.value" 
              v-bind:value="address">
              </ion-textarea>
            </ion-item>


          </ion-col>

          <ion-col size="12" size-md="6">

                <!-- isDriver -->
                <div style="display: flex;justify-content: space-between; align-items: center; padding: 0 20px;"  >
                    <ion-label>{{$t('backoffice.form.fields.isDriver')}}</ion-label>
                    <ion-toggle slot="end" name="isDriver" :disabled="isForDriversSupervisor? true: false"
                          @ionChange="isDriver=$event.target.checked" 
                          :checked="isDriver">
                    </ion-toggle>
                </div>            
              
              <!-- occupation -->
                <ion-list style="    padding: 0 20px;">
                    <div style="display: flex;justify-content: space-between; align-items: center;">
                        <ion-label>
                            {{$t('backoffice.form.fields.occupation')}}
                        </ion-label>
                        <ion-select   interface="popover" :disabled="isForDriversSupervisor? true: false"
                            @ionChange="occupationId = $event.target.value" v-bind:value="occupationId">
                            <ion-select-option v-for="occupation in occupations" 
                              v-bind:key="occupation.Id" 
                              v-bind:value="occupation._id" >
                              {{occupation.Name}}
                          </ion-select-option>
                        </ion-select>
                        <ion-label>
                          <ion-button
                              v-if="!isForDriversSupervisor"
                              fill="clear" 
                              @click="showOccupation()"       
                              >
                              <ion-icon slot="icon-only" icon="add"></ion-icon>
                          </ion-button> 
                        </ion-label>
                    </div>
                </ion-list> 

                <!-- rol -->
              
                <ion-list  style="    padding: 0 20px;" :key="key">
                    <div style="display: flex;justify-content: space-between; align-items: center;">
                        <ion-label>
                            {{$t('backoffice.form.fields.roles')}}
                        </ion-label>
                        <ion-select multiple="true"  :disabled="isForDriversSupervisor? true: false"
                          @ionChange="changeRol($event.target.value)">
                            <ion-select-option  
                              v-for="(rol, index) in allRoles" 
                              :key="index" 
                              :selected="hasId(rol._id)"
                              :value="rol._id">
                              {{rol.Name}}                       
                            </ion-select-option>
                        </ion-select>
                        <ion-label>
                          <ion-button
                          v-if="!isForDriversSupervisor"
                              fill="clear" 
                              @click="showRol()"       
                              >
                              <ion-icon slot="icon-only" icon="add"></ion-icon>
                          </ion-button> 
                        </ion-label>
                    </div>
                </ion-list> 


                <!-- password -->
                <ion-list style="    padding: 0 20px;"  v-if="id!==null">
                  <div style="display: flex;justify-content: space-between; align-items: center;">
                    <ion-label> Change password </ion-label>               
                    <ion-label>
                      <ion-button
                          fill="clear" 
                          @click="changePassword()"       
                          >
                          <ion-icon slot="icon-only" icon="create"></ion-icon>
                      </ion-button> 
                    </ion-label>
                  </div>
                </ion-list> 

                <div v-if="id==null">
                    <ion-item>
                      <ion-label position="floating"><span style="color: red">*</span>{{$t('backoffice.form.fields.password')}}</ion-label>
                      <ion-input type="password" name="password"
                      @input="password = $event.target.value" 
                      v-bind:value="password">
                      </ion-input>
                    </ion-item>
                    <ion-item>
                      <ion-label position="floating"><span style="color: red">*</span>{{$t('backoffice.form.fields.confirmPassword')}}</ion-label>
                      <ion-input type="password" name="confirmPassword"
                      @input="confirmPassword = $event.target.value" 
                      v-bind:value="confirmPassword">
                      </ion-input>
                    </ion-item>
                </div>


                <!-- serverId -->
                <ion-list style="    padding: 0 20px;">
                  <div style="display: flex;justify-content: space-between; align-items: center;">
                    <ion-label > Service Id </ion-label>
                      <ion-item v-if="!id">
                        
                        <ion-label><span style="color: red">*</span></ion-label>
                        <ion-input type="number" name="serverId"
                        @input="serverId = $event.target.value"
                        v-bind:value="serverId">
                        </ion-input>
                    </ion-item>
                    <ion-label  v-if="id">
                      <ion-button
                          fill="clear" 
                          @click="changeServerId()"       
                          >
                          <ion-icon slot="icon-only" icon="create"></ion-icon>
                      </ion-button> 
                    </ion-label>
                  </div>
                </ion-list> 

                <!-- clockIn -->
                <ion-list style="    padding: 0 20px;" v-if="id">
                  <div style="display: flex;justify-content: space-between; align-items: center;">
                    <ion-label >ClockIn-ClockOut</ion-label>                 
                    <ion-label >
                      <ion-button
                          fill="clear" 
                          @click="showTime()"       
                          >
                          <ion-icon slot="icon-only" icon="time"></ion-icon>
                      </ion-button> 
                    </ion-label>
                  </div>
                </ion-list> 

                
              

                
          </ion-col>

        </ion-row>

        <ion-button expand="full" color="primary" :disabled="!isValidForm()" @click="saveUser()">{{ $t('backoffice.form.buttons.save') }}</ion-button>
          
      </div>
    </div>
</template>

<script>

import { Api } from '../api/api.js';
import Modal from './ChangePasswordModal.vue';
import ChangeModal from './changeServerId.vue';
import Roles from './RoleForm.vue';
import Occup from './OccupationForm.vue';
import Clock from './ClockInClockOut.vue'

export default {

  name: 'userForm',
   
  data () {
    return {
      modelName: 'Staff',
      /****** Form Data ******/
      id: null,
      user: null,

      firstName: '',
      lastName: '',
      address: '',
      phone: '',
      email: '',
      password: '',
      confirmPassword: '',
      occupations: [],
      occupationId: '',
      serverId: '',

      allRoles: [],
      userRoles: [],

      isBackdrop: false,
     
      file: null,
      fileName: '',

      spinner: false,

      //user support
      isSupport: false,

      isForDriversSupervisor: false,
      isDriver: false,

      //Segments
      segmentValue: 'general',
      general: true,
      occupation: false,
      roles: false,
      sameConnected: false,
      key: 0,
    }
  },
  created: function(){
      this.isForDriversSupervisor = this.$route.params.isForDriversSupervisor || false;
      if(this.isForDriversSupervisor) this.isDriver = true;
      this.init();
     
  },
  components: {
      Occup, Roles, Clock,
  },
  computed: {
        title() {
            let title = this.$t('backoffice.form.titles.userNewTitle');
            if (this.id){
                title = this.$t('backoffice.form.titles.userEditTitle')
                if (this.isForDriversSupervisor)
                    title = this.$t('backoffice.form.titles.driversEditTitle')
            }
            else{
                title = this.$t('backoffice.form.titles.userNewTitle')
                if (this.isForDriversSupervisor)
                    title = this.$t('backoffice.form.titles.driversNewTitle')
            }

            return title;
        }
  },
  methods: {
    segmentChanged(value){
         this.segmentValue = value; 
    },
    init(){
        this.allRoles = this.$store.state.backConfig.rol;
        this.occupations = this.$store.state.backConfig.occupation;
        if(this.$route.params.userId) this.id = this.$route.params.userId;
        this.sameConnected = this.$route.params.sameConnected || false;
        this.isSupport = this.$route.params.isSupport || false;
        if(this.sameConnected || this.id){
          // const data = this.$store.state.user; this.sameConnected
          const data = this.$store.state.backConfig.staff.find( s => s._id === this.id);
          if(data){
            this.file = data.ImageUrl;
            this.firstName = data.FirstName;
            this.lastName = data.LastName;
            this.address = data.Address;
            this.phone = data.Phone;
            this.email = data.Email;
            this.serverId = data.ServerId;
            
            this.isDriver = data.IsDriver;                  
            this.user = data;

            if(Array.isArray(data.OccupationId)) this.occupationId = data.OccupationId[0].Occupation
            else this.occupationId = data.OccupationId;
           
            // const listRR =[];
            data.Roles.forEach(element => {
             if(element.RolId) this.userRoles.push(element.RolId.toString());
             else this.userRoles.push(element);              
            });
          
          }

        }
        else{
            if (this.isForDriversSupervisor){
                //Search External Driver Occupation and External Driver Role.
                const ED = this.$store.state.backConfig.occupation.filter(occ => occ.Name == 'External Driver')
                if (ED.length > 0)
                  this.occupationId = ED[0]._id
                else
                    this.showToastMessage('The default occupation External Driver was deleted', 'danger')

                const EDr = this.$store.state.backConfig.rol.filter(rol => rol.Name == 'External Driver')
                if (EDr.length > 0)
                  this.userRoles.push(EDr[0]._id)
                else
                    this.showToastMessage('The default rol External Driver was deleted', 'danger')

            }
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
                      name: 'User',
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

    ShowMessage(type, message, topic=''){
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

    changeRol(value){
      if (!Array.isArray(value)) return;     
      this.userRoles = JSON.parse(JSON.stringify(value))
    },

    hasId(id){   
      return this.userRoles.includes(id)
    },


    addDeleteRole(isChecked, rol_id){
      if (isChecked){
        if (!this.userRoles.includes(rol_id))
          this.userRoles.push(rol_id)
      }
      else
        this.userRoles.splice(this.userRoles.indexOf(rol_id), 1)
    },

    backtoList(){

        if(this.sameConnected)
          this.$router.push({ name: 'ControlPanel'})
        else if (this.isSupport)
            this.$router.push({ name: 'Support', params: { 'tab': 'user' } } )
        else
            this.$router.push({  name: 'User', params:{ isForDriversSupervisor: this.isForDriversSupervisor }})
    },

    hasUserRole(rol_id){
      return this.userRoles.includes(rol_id);
    },

    isValidForm(){

        if (this.firstName == "") return false

        if (this.lastName == "") return false;

        if (this.email == "") return false;

        if (this.occupationId == "" && !this.isForDriversSupervisor)    return false
       
        if (this.id == null){
              if (this.password == "") return false              
              if (this.password != this.confirmPassword) return false
        }

        if (this.email != ""){
            let emailRegex = /^[-\w.%+]{1,64}@(?:[A-Z0-9-]{1,63}\.){1,125}[A-Z]{2,63}$/i;
            if (emailRegex.test(this.email) == false)   return false
        }

        if (this.serverId.toString().length > 4 && this.serverId.toString().length < 4)  return false

        return true
    },
    /****** Load image use base64 encode esto debería ir en un componente******/
    checkImage: function(){
      return  this.file != null && this.file !='';
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

    
    saveUser: async function(){
        if (this.isValidForm())
        {
            this.isBackdrop = true;
            let item = {
              "ImageUrl": "",
              "FirstName": this.firstName,
              "LastName": this.lastName,
              "Address": this.address,
              "Phone": this.phone,
              "Email": this.email,
              "OccupationId": this.occupationId,
              "Password": this.password,
              "Roles": this.userRoles,
              "IsDriver": this.isDriver,
              "IsExternalDriver": false,
            }
            if (this.isSupport) item["IsSupport"] = true;
           
            if (this.isForDriversSupervisor){
               item.IsDriver = true;
               item.IsExternalDriver = true;
               item.ParentStaffId = this.$store.state.user._id;
            }

            if (this.file != null){
              item["ImageUrl"] = this.file;
              item["ImageName"] = this.fileName;
            }
            if (this.serverId != '') item["ServerId"] = this.serverId;

            //If I am editing
            if (this.id){
              item['_id'] = this.id;
              
              this.spinner = true;
              await Api.putIn(this.modelName, item)
                  .then(async response => {

                        const index = this.$store.state.backConfig.staff.findIndex(s => s._id === this.id);
                        if(index !== -1) this.$store.state.backConfig.staff[index] = item;                       
                        this.showToastMessage(this.$t('backoffice.list.messages.messageEditSuccessUser'), "success");
                        this.spinner = false;
                        if (this.isSupport)
                            this.$router.push({ name: 'Support', params: { tab: 'user', }  });
                        else
                            this.$router.push({ name: 'Driver', params: { isForDriversSupervisor: this.isForDriversSupervisor }});
                        
                        return response;
                  })
                  .catch(e => {
                        this.isBackdrop = false;                       
                        e;
                        this.spinner = false;
                        this.ifErrorOccured(this.saveUser);
                  })
            }
            else{
              //Else, I am created a new category
              this.spinner = true;
              Api.postIn(this.modelName, item)
                  .then(response => {
                      this.$store.state.backConfig.staff.push(response.data);
                      this.showToastMessage(this.$t('backoffice.list.messages.messageCreateSuccessUser'), "success");
                      this.spinner = false;
                      if (this.isSupport)
                          this.$router.push({name: 'Support',  params: { tab: 'user', }  });
                      else
                          this.$router.push({ name: 'Driver', params: { isForDriversSupervisor: this.isForDriversSupervisor } });
                      return response;
                  })
                  .catch(e => {
                      this.isBackdrop = false;
                      e;
                      this.spinner = false;
                      this.ifErrorOccured(this.saveUser)
                  })
            }
        } 
    },

    changePassword(){
        return this.$ionic.modalController
            .create({
            component: Modal,
            cssClass: 'my-custom-class',
            componentProps: {               
                propsData: {
                    user: this.user,                   
                    parent: this,
                },
            },
            })
            .then(m => m.present())
    },
      changeServerId(){
        
        return this.$ionic.modalController
                .create({
                component: ChangeModal,
                cssClass: 'my-custom-class',
                componentProps: {
                    data: {
                        content: false,
                    },
                    propsData: {
                        parent: this,
                    },
                },
                })
                .then(m => m.present())
    },

    reloadOccupation(value){    
      this.occupations =  this.$store.state.backConfig.occupation;
      this.occupationId = value;
      this.hideOccupation();
    },

    showOccupation () {
      this.$modal.show('occupation-modal');
    },
    
    hideOccupation () {
      this.$modal.hide('occupation-modal');
        },

    reloadRol(value){    
      this.allRoles =  this.$store.state.backConfig.rol;
      this.userRoles.push(value);
      this.key ++;
      this.hideRol();
    },

    showRol () {
      this.$modal.show('rol-modal');
    },
    
    hideRol () {
    this.$modal.hide('rol-modal');
      },
        
    showTime () {
      this.$modal.show('clock-modal');
    },
    
    hideClock () {
    this.$modal.hide('clock-modal');
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