<template>
    <div id="subscritop" class="page">


    <listView
      :title="$t('backoffice.titles.suscriptor')"
      :filter="filterSuscriptors"
      :elements="suscriptors"
      :hasImg="true"
      :viewSelected="'Admin'"
      :add="hasPermission('canCreateSuscriptor')"
      :edit="hasPermission('canEditSuscriptor')"
      :remove="isSupportUser"
      @handleInput="handleInput"
      @handleAddClick="addSuscriptor"   
      @editElement="editSuscriptor"
      @deleteElement="deleteSuscriptor"   
    ></listView>
  </div>
</template>

<script>

import { Api } from '../api/api.js';
import listView from "../components/ListView";

export default {

  name: 'staff',
  created: function(){
    this.isSupportUser = this.$store.state.user.IsSupport
    this.screenWidth = screen.width;
    this.fetchSuscriptors();
    window.onresize = function() {
      this.screenWidth = screen.width
    }
  },
  components: {
    listView,
  },
  data () {
    return {
      modelName: 'Subscriptor',
      suscriptors: [],
      filterSuscriptors: [],
      isSupportUser: false,
      paginate: ['languages'],
      spinner: false,
      screenWidth: 0,
      keyList: 0,
    }
  }, 
  methods: {

  async doRefresh() {
      this.spinner = true;
      await Api.fetchAll(this.modelName).then(response => {
        this.$store.state.backConfig.subscriptor = response.data;
        this.fetchSuscriptors();   
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
      if(count === 3)  { 
        if(option.State) 
          return 'Active'; 
        else return 'No Active' }
      
      if(count === 4) return option.Email;
      if(count === 5) return null;
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

      this.filterSuscriptors = this.suscriptors
      const query = value.toLowerCase();
      requestAnimationFrame(() => {   
        let cat2 = this.users.filter(item => item.Email.toLowerCase().indexOf(query) > -1)
        if(cat2.length> 0)
          this.filterSuscriptors = cat2
        else
          this.filterSuscriptors = this.suscriptors
      });
    },
    hasPermission(permission){
        
        let res = false;
        if (this.$store.state.authenticated)
        {
            let roles = this.$store.state.roles;
            for (let index = 0; index < roles.length; index++) {
                switch(permission){                        
                      case 'canCreateSuscriptor':
                          res = roles[index].canCreateSuscriptor;
                          break;
                      case 'canEditSuscriptor':
                          res = roles[index].canEditUser;
                          break;
                      case 'canDesactivateSuscriptor':
                          res = roles[index].canDeleteUser;
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

    /****** CRUD category methods ******/
    fetchSuscriptors: function(){
      this.suscriptors = this.$store.state.backConfig.subscriptor
      this.filterSuscriptors = this.suscriptors
    },

    editSuscriptor: function(id){
        this.$router.push({
          name: 'SuscriptorForm', 
          params: { 
            suscriptorId: id,
          }
        });
    },

    
    addSuscriptor: function(){
        this.$router.push({
          name: 'SuscriptorForm'
        });
    },

    async desactivateSuscriptor(suscriptor){
        this.spinner = true
        let State = suscriptor.State
        suscriptor.State = !State
        await Api.putIn(this.modelName, suscriptor)
        .then(() => {
           const index = this.$store.state.backConfig.subscriptor.findIndex( s=> s._id === suscriptor._id)
           if(index !== -1) this.$store.state.backConfig.subscriptor[index] = suscriptor;
            this.fetchSuscriptors()
            if (State)
              //Se ha desactivado
              this.showToastMessage(this.$t('backoffice.list.messages.messageDesactivareSuccessSuscriptor'), 'success')
            else
              //Se ha activado
              this.showToastMessage(this.$t('backoffice.list.messages.messageActivareSuccessSuscriptor'), 'success')
           
            this.spinner = false
        })
        .catch(e => {
            e;
            this.spinner = false
            this.showToastMessage(this.$t('backoffice.list.messages.errorMessage'), 'danger')
            this.ifErrorOccured(this.desactivateSuscriptor)
        })
    },

    deleteSuscriptor: function(id){

        return this.$ionic.alertController.create({
        title: this.$t('backoffice.list.messages.confirmDelete'),
        message: this.$t('backoffice.list.messages.deleteSuscriptor'),
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
                  const index = this.$store.state.backConfig.subscriptor.findIndex( s=> s._id === id)
                  if(index !== -1) this.$store.state.backConfig.subscriptor.splice(index, 1);
                  this.showToastMessage(this.$t('backoffice.list.messages.messageDeleteSuccessSuscriptor'), "success");
                  this.fetchSuscriptors();
                  this.spinner = false;
                  return response;
                })
                .catch(e => {
                  e;
                  this.ifErrorOccured(mess => {
                      this.deleteSuscriptor(id)
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