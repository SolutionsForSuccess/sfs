<template>
  <div>
    <ion-header>
      <ion-toolbar>
        <ion-title>{{parent.$t('backoffice.titles.changePassword')}}</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding">
        <ion-item>
              <ion-label position="floating"><span style="color: red">*</span>{{parent.$t('backoffice.form.fields.password')}}</ion-label>
              <ion-input type="password" name="password"
              @input="password = $event.target.value" 
              v-bind:value="password">
              </ion-input>
            </ion-item>
            <ion-item>
              <ion-label position="floating"><span style="color: red">*</span>{{parent.$t('backoffice.form.fields.confirmPassword')}}</ion-label>
              <ion-input type="password" name="confirmPassword"
              @input="confirmPassword = $event.target.value" 
              v-bind:value="confirmPassword">
              </ion-input>
        </ion-item>
        <br/>
        <ion-button expand="full" color="primary" @click="save()">{{parent.$t('backoffice.form.buttons.save')}}</ion-button>
        <ion-button expand="full" color="danger" @click="dismissModal()">{{parent.$t('backoffice.list.messages.buttons.close')}} </ion-button>
    </ion-content>
  </div>
</template>

<script>
import { Api } from '../api/api.js';

export default {
  name: 'ChangePasswordModal',
  props: {
    user: { type: Object, default: null },  
    parent: { type: Object, default: null },
  },
  data() {
    return {
        password: '',
        confirmPassword: '',
    }
  },
  created: function(){ 
  },
  methods:{

    dismissModal() { 
        this.$ionic.modalController.dismiss(null);
    },

    isValidForm(){
        if (this.password == "") return false
        if (this.password != this.confirmPassword) return false

        return true;     
    },

    showToastMessage(message, tColor){
        return this.parent.$ionic.toastController.create({
        color: tColor,
        position: 'top',
        duration: 3000,
        message: message,
        showCloseButton: false
        }).then(a => a.present())
    },

    async save(){
      if (this.isValidForm()){
        let item = {
        "_id": this.user._id,            
        "Email": this.user.Email,
        "Password": this.password,
        }
        await Api.changePassword(item)
            .then(response => {
                  this.showToastMessage(this.parent.$t('backoffice.list.messages.messageEditSuccessUser'), "success");
                  // this.$router.push({
                  //   name: 'UserForm',
                  //   params: {
                  //       userId: this.user._id
                  //   }
                  // });
                  this.dismissModal();
                  return response;
            })
            .catch(e => {
                  console.log(e);
                  this.showToastMessage(this.parent.$t('backoffice.list.messages.errorMessage'), "danger");
            })
      } 
    },
  },
}
</script>