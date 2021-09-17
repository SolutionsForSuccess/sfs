<template>
  <div id="user" class="page">
    <!-- <router-link to="/controlPanel"><ion-button expand="full" color="tertiary"><ion-icon name="hammer"></ion-icon>{{$t('backoffice.list.buttons.goToControlPanel')}}</ion-button></router-link>
    <router-link to="/user-form"><ion-button v-if="hasPermission('canCreateUser')" expand="full" color="primary"><ion-icon name="add"></ion-icon>{{$t('backoffice.list.actions.addANew')}} {{$t('backoffice.list.entitiesName.user')}}</ion-button></router-link> -->

    <listView
      :title="$t('backoffice.titles.occupation')"
      :filter="filterOccupation"
      :elements="occupations"
      :viewSelected="'Admin'"
      :add="hasPermission('canCreateOccupation')"
      :edit="(hasPermission('canEditOccupation'))"
      :remove="hasPermission('canDeleteOccupation')"
      :isSupportUserLogin="isSupportUserLogin()"
      @handleInput="handleInput"
      @handleAddClick="addOccupation"     
      @editElement="editOccupation"
      @deleteElement="deleteOccupation" 
    ></listView>
  </div>
</template>

<script>

import { Api } from '../api/api.js';
import listView from "../components/ListView";
export default {

  name: 'category',
  created: function(){
   this.fetchOccupations();
   this.screenWidth = screen.width;
  },
  data () {
    return {
      modelName: 'Occupation',
      occupations: [],
      filterOccupation: [],

      paginate: ['languages'],

      spinner: false,
      screenWidth: 0,
      keyList: 0,
    }
  }, 
  components: {
    listView,
  },
  methods: {

    async doRefresh() {
      this.spinner = true;
      await Api.fetchAll(this.modelName).then(response => {
        this.$store.state.backConfig.occupation = response.data
        this.fetchOccupations();    
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
      if(count === 3) return null;
      if(count === 4) return null;
      if(count === 5) return null;

    },
    
    isSupportUserLogin(){
        return this.$store.state.user.IsSupport
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

      this.filterOccupation = this.occupations
      const query = value.toLowerCase();
      requestAnimationFrame(() => {   
        let cat2 = this.occupations.filter(item => item.Name.toLowerCase().indexOf(query) > -1)
        if(cat2.length> 0)
          this.filterOccupation = cat2
        else
          this.filterOccupation = this.categories
      });
    },

    hasPermission(permission){
        
        let res = false;
        if (this.$store.state.authenticated)
        {
            let roles = this.$store.state.roles;
            for (let index = 0; index < roles.length; index++) {
                switch(permission){                        
                      case 'canCreateOccupation':
                          res = roles[index].canCreateOccupation;
                          break;
                      case 'canEditOccupation':
                          res = roles[index].canEditOccupation;
                          break;
                      case 'canDeleteOccupation':
                          res = roles[index].canDeleteOccupation;
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
    fetchOccupations: function(){

      this.occupations = this.$store.state.backConfig.occupation;
      this.filterOccupation = this.occupations;
  },

    addOccupation: function(){
        this.$router.push({
        name: 'OccupationForm'
      });
    },

    editOccupation: function(id){
        this.$router.push({
        name: 'OccupationForm', 
        params: { occupationId: id }
      });
    },

    deleteOccupation: async function(id){

        return this.$ionic.alertController.create({
        title: this.$t('backoffice.list.messages.confirmDelete'),
        message: this.$t('backoffice.list.messages.deleteOccupation'),
        buttons: [
          {
            text: this.$t('backoffice.list.messages.buttons.cancel'),
            role: 'cancel',
            handler: () => {
              
            }
          },
          {
            text: this.$t('backoffice.list.messages.buttons.delete'),
            handler: async () => {
              
              this.spinner = true
              await Api.deleteById(this.modelName, id)
                .then(response => {
                  const index = this.$store.state.backConfig.occupation.findIndex( o => o._id === id);
                  if(index !== -1) this.$store.state.backConfig.occupation.splice(index, 1);
                  this.showToastMessage(this.$t('backoffice.list.messages.messageDeleteSuccessOccupation'), "success");
                  this.fetchOccupations();
                  this.spinner = false;
                  return response;
                })
                .catch(e => {
                  e;
                  this.ifErrorOccured(mess => {
                      this.deleteOccupation(id)
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