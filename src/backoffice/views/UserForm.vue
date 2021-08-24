<template>
    <div class="screen">
    <ion-backdrop v-if="isBackdrop"></ion-backdrop>
    <!-- <router-link to="/controlPanel"><ion-button expand="full" color="tertiary"><ion-icon name="hammer"></ion-icon>{{$t('backoffice.list.buttons.goToControlPanel')}}</ion-button></router-link>
    <router-link to="/user"><ion-button expand="full" color="tertiary"><ion-icon name="arrow-round-back"></ion-icon>{{$t('backoffice.form.buttons.backToUsersList')}}</ion-button></router-link> -->

    <ion-header>
          <ion-toolbar>
            <ion-buttons slot="start">
              <ion-back-button default-href="/controlPanel" @click="backtoList()"></ion-back-button>
            </ion-buttons>
            <ion-label style="padding: 20px 100px;">
              <h1>{{title}}</h1>            
            </ion-label>
          </ion-toolbar>

          <ion-segment scrollable id="productSegment" @ionChange="segmentChanged($event.target.value)" :value="segmentValue" >
              <ion-segment-button value="general">
                  <span>{{$t('backoffice.form.titles.genaral')}}</span>
              </ion-segment-button>
              <ion-segment-button value="clock" v-if="$store.state.backConfig.attendance.length > 0">
                  <span>ClockIn-ClockOut</span>
              </ion-segment-button>
              <ion-segment-button value="occupation">
                  <span>{{$t('backoffice.form.fields.occupation')}}</span>
              </ion-segment-button>
              <ion-segment-button value="roles">
                  <span>{{$t('backoffice.form.fields.roles')}}</span>
              </ion-segment-button>
             
          </ion-segment>
    </ion-header>
    <br/>

    <ion-loading
        v-if="spinner"
        cssClass="my-custom-class"
        :message="$t('frontend.tooltips.loadRestaurant')"
      ></ion-loading>
    <div >
      <!-- <ion-card> -->
        <div v-if="segmentValue==='general'">
            <ion-item>
                <ion-card v-if="checkImage()" >
                    <ion-img :src="file"></ion-img>
                </ion-card>
                <ion-card v-else>
                  {{ $t('backoffice.form.titles.imageText')}}
                </ion-card>
                <!-- <ion-label position="floating"><span style="color: red">*</span>{{$t('backoffice.form.fields.image')}}</ion-label>
                <ion-input type="file" accept=".jpg,.png,.gif" name="file"
                @change="handleImage">
                </ion-input> -->
            </ion-item>
            <ion-item>
                <div>
                    <ion-label>{{$t('backoffice.form.fields.image')}}</ion-label>
                </div>
              <input type="file" accept="image/png, image/jpeg" @change="handleImage" />
            </ion-item>
            <ion-item>
              <ion-label position="floating"><span style="color: red">*</span>{{$t('backoffice.form.fields.firstName')}}</ion-label>
                <ion-input type="text" name="firstName"
                @input="firstName = $event.target.value" 
                v-bind:value="firstName">
              </ion-input>
            </ion-item>
            <ion-item>
              <ion-label position="floating"><span style="color: red">*</span>{{$t('backoffice.form.fields.lastName')}}</ion-label>
                <ion-input type="text" name="lastName"
                @input="lastName = $event.target.value" 
                v-bind:value="lastName">
              </ion-input>
            </ion-item>
            <ion-item>
              <ion-label position="floating">{{$t('backoffice.form.fields.address')}}</ion-label>
              <ion-textarea name="address" 
              @input="address = $event.target.value" 
              v-bind:value="address">
              </ion-textarea>
            </ion-item>
            <ion-item>
              <ion-label position="floating">{{$t('backoffice.form.fields.phone')}}</ion-label>
                <ion-input type="text" name="phone"
                @input="phone = $event.target.value" 
                v-bind:value="phone">
              </ion-input>
            </ion-item>
            <ion-item>
              <ion-label position="floating"><span style="color: red">*</span>{{$t('backoffice.form.fields.email')}}</ion-label>
              <ion-input type="email" name="email"
              @input="email = $event.target.value" 
              v-bind:value="email">
              </ion-input>
            </ion-item>
            <ion-item v-if="!id">
                <ion-label position="floating"><span style="color: red">*</span>Service Id</ion-label>
                <ion-input type="number" name="serverId"
                @input="serverId = $event.target.value"
                v-bind:value="serverId">
                </ion-input>
            </ion-item>
            <ion-list v-if="!isForDriversSupervisor">
                <ion-list-header>
                    <ion-label>
                        <span style="color: red">*</span><router-link to="/occupation">{{$t('backoffice.form.fields.occupation')}}</router-link>
                    </ion-label>
                    <ion-label>
                        <ion-button class="" @click="segmentChanged('occupation')"><ion-icon name="add"></ion-icon> {{$t('frontend.order.add')}}</ion-button>
                    </ion-label>
                </ion-list-header>

                <ion-item>
                    <ion-label>{{$t('backoffice.form.titles.selectAnOccupation')}}</ion-label>
                    <ion-select  :ok-text="$t('backoffice.form.messages.buttons.ok')" :cancel-text="$t('backoffice.form.messages.buttons.dismiss')"
                    @ionChange="occupationId = $event.target.value" v-bind:value="occupationId">
                        <ion-select-option v-for="occupation in occupations" v-bind:key="occupation.Id" v-bind:value="occupation._id" >{{occupation.Name}}</ion-select-option>
                    </ion-select>
                </ion-item>

            </ion-list>
            <ion-item v-if="!isForDriversSupervisor">
                <ion-label>{{$t('backoffice.form.fields.isDriver')}}</ion-label>
                <ion-checkbox slot="end" name="isDriver" 
                      @ionChange="isDriver=$event.target.checked" 
                      :checked="isDriver">
                </ion-checkbox>
            </ion-item>

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
            <div v-else>
              <ion-item>
                <ion-button expand="full" color="secondary" @click="changePassword()">Change password</ion-button>
              </ion-item>
            </div>
            <div >
              <ion-item>
                <ion-button expand="full" color="secondary" @click="changeServerId()">{{ $t('backoffice.options.changeServerId') }}</ion-button>
              </ion-item>
            </div>

              

            <div v-if="!isForDriversSupervisor">
                <ion-item>
                    <p><router-link to="/role">{{$t('backoffice.form.fields.roles')}}</router-link></p>
                    <ion-item-group slot="end">
                        <ion-label>
                            <ion-button class="" @click="segmentChanged('roles')"><ion-icon name="add"></ion-icon> {{$t('frontend.order.add')}}</ion-button>
                        </ion-label>    
                    </ion-item-group>
                    
                </ion-item>
                <ion-list>
                    <ion-item v-for="rol in allRoles" v-bind:key="rol._id">
                    <ion-label>{{rol.Name}}</ion-label>
                    <ion-checkbox
                        slot="end"
                        @ionChange="addDeleteRole($event.target.checked, rol._id)"
                        :checked="hasUserRole(rol._id)">
                    </ion-checkbox>
                    </ion-item>
                </ion-list>
            </div>
          <br/>
          <ion-button expand="full" color="primary" :disabled="!isValidForm()" @click="saveUser()">{{ $t('backoffice.form.buttons.save') }}</ion-button>
        </div>
        <div v-if="segmentValue==='occupation'">
             <Occup :externalProp="true"/>
        </div>
        <div v-if="segmentValue==='roles'">
            <Roles :externalProp="true"/>
        </div>
        <div v-if="segmentValue==='clock'">
          <Clock/>
        </div>
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
    }
  },
  created: function(){
      this.isForDriversSupervisor = this.$route.params.isForDriversSupervisor || false;
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
        this.id = this.$route.params.userId;
        this.sameConnected = this.$route.params.sameConnected || false;
        this.isSupport = this.$route.params.isSupport || false;
        if(this.sameConnected){
          console.log('Buscar usuario guardado en store');
          const data = this.$store.state.user;

            this.file = data.ImageUrl;
            this.firstName = data.FirstName;
            this.lastName = data.LastName;
            this.address = data.Address;
            this.phone = data.Phone;
            this.email = data.Email;
            this.serverId = data.ServerId;
            this.occupationId = data.OccupationId;
            this.isDriver = data.IsDriver;                  
            this.userRoles = data.Roles;
            this.user = data;
        }
        if (this.id){
          const data = this.$store.state.backConfig.staff.find( s => s._id === this.id);
          if(data){
            this.file = data.ImageUrl;
            this.firstName = data.FirstName;
            this.lastName = data.LastName;
            this.address = data.Address;
            this.phone = data.Phone;
            this.email = data.Email;
            this.serverId = data.ServerId;
            this.occupationId = data.OccupationId;
            this.isDriver = data.IsDriver;                  
            this.userRoles = data.Roles;
            this.user = data;
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

    
    saveUser: async function(){
        if (this.isValidForm())
        {
            this.isBackdrop = true;
            //console.log(this.occupationId);
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
                  .then(response => {

                        const index = this.$store.state.backConfig.staff.findIndex(s => s._id === this.id);
                        if(index !== -1) this.$store.state.backConfig.staff[index] = item;
                        
                        this.showToastMessage(this.$t('backoffice.list.messages.messageEditSuccessUser'), "success");
                        this.userRoles = [];
                        this.spinner = false;
                        if (this.isSupport)
                            this.$router.push({ name: 'Support', params: { tab: 'user', }  });
                        else
                            this.$router.push({ name: 'Driver', params: { isForDriversSupervisor: this.isForDriversSupervisor }});
                        
                        return response;
                  })
                  .catch(e => {
                        this.isBackdrop = false;
                        console.log("Error");
                        console.log(e);
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
                      this.userRoles = [];
                      this.spinner = false;
                      if (this.isSupport)
                          this.$router.push({name: 'Support',  params: { tab: 'user', }  });
                      else
                          this.$router.push({ name: 'Driver', params: { isForDriversSupervisor: this.isForDriversSupervisor } });
                      return response;
                  })
                  .catch(e => {
                      this.isBackdrop = false;
                      console.log(e);
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