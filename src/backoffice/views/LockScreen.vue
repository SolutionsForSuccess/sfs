<template>
  <div class="modal">
    <!-- <ion-header>
      <ion-toolbar>
        <ion-title>Change Server Id</ion-title>
      </ion-toolbar>
    </ion-header> -->
    <ion-content class="ion-padding">
          <div style="width: 150px; display:inline-block; ">
            <ion-card>
                <ion-img :src="file"></ion-img>
            </ion-card>
          </div>     
        <ion-item :key="key">
            <ion-label position="floating"><span style="color: red">*</span>{{parent.$t('backoffice.options.serverId')}}</ion-label>
            <ion-input type="number" name="serverId"
            @input="verifyLength($event.target.value)"
            @ionChange="unlock($event.target.value)">
            </ion-input>
            <div v-if="error">
              <span class="iconify" data-icon="codicon:error"></span>
            </div>
        </ion-item>
        <!-- <ion-item></ion-item> -->
        <!-- <ion-button expand="full" color="danger" :disabled="!isValidForm()" @click="unlock()">Change</ion-button> -->
        <ion-button expand="full" color="primary" @click="closeSession()">{{parent.$t('backoffice.options.logout')}}<span class="iconify" data-icon="mdi:logout-variant" data-inline="false"></span></ion-button>
    </ion-content>
  </div>
</template>

<script>


export default {
  name: 'LockModal',
  props: {
    parent: { type: Object, default: null },
  },
  data() {
    return {
      content: 'Content',
      error: false,
      user: null,
      file: null,
      errorNumber: 0,
      key: 0,
    }
  },
  created: function(){

    this.user = this.parent.$store.state.user;   
    this.file = this.parent.$store.state.backConfig.restaurant.ImageUrl;

  },
  methods:{
    ifErrorOccured(action){
      return this.parent.$ionic.alertController.create({
          title: this.parent.$t('backoffice.list.messages.connectionError'),
          message: this.parent.$t('backoffice.list.messages.connectionErrorMessage'),
          buttons: [
            {
              text: this.parent.$t('backoffice.list.messages.buttons.goToAdministration'),
              handler: () => {
                  this.parent.$router.push({
                      name: 'ControlPanel',
                  });
              }
            },
            {
              text: this.parent.$t('backoffice.list.messages.buttons.retry'),
              handler: () => {
                  action();
              }
            }
          ]
        })
        .then(a => a.present());
    },
    unlock(value){     
        if (this.user.ServerId == value)
            this.dismissModal()
    },
    
    closeSession: function(){
        this.parent.logOut()
        this.dismissModal()
    },
    dismissModal() { 
        this.parent.isBackLocked = false;
        this.$ionic.modalController.dismiss(null);
    },
    ShowMessage(type, message, topic='') {
        return this.$ionic.alertController
            .create({
                cssClass: 'my-custom-class',
                header: type,
                subHeader: topic,
                message: message,
                buttons: [this.parent.$t('backoffice.form.messages.buttons.ok')],
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

    verifyLength(value){
      if(this.user.ServerId.toString().length < value.length){
       this.error = true;
       this.errorNumber ++;
       this.key ++;
      //  if(this.errorNumber === 3) this.closeSession();
      }
       this.error= false
    }
}
}
</script>

<style>

.modal{
  padding: 15%;
}

@media only screen and (max-width : 1023px){
    .logo-screen{
        width: 100%;
        margin-left: 0;   
    }
}

@media only screen and (min-width : 1024px){
    .logo-screen{
        width: 30%;
        margin-left: 17%;      
    }
}

</style>