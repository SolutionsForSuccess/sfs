<template>

    <div id="user" class="page">
    <listView
      :title="$t('backoffice.titles.about')"
      :filter="filterAbouts"
      :elements="abouts"
      :hasImg="true"
      :add="hasPermission('canChangeSetting')"
      :edit="hasPermission('canChangeSetting')"
      :remove="hasPermission('canChangeSetting')"
      @handleInput="handleInput"
      @handleAddClick="addAbout"   
      @editElement="editAbout"
      @deleteElement="deleteAbout"   
    ></listView>
  </div>
</template>

<script>

import { Api } from '../api/api.js';
import listView from "../components/ListView";

export default {

  name: 'about',
  created: function(){
   
   this.screenWidth = screen.width;
   this.abouts =  this.$store.state.backConfig.about;
   this.filterAbouts = this.abouts;
  },
  components: {
    listView,
  }, 
  data () {
    return {
      modelName: 'About',
      abouts: [],
      filterAbouts: [],

      spinner: false,
      screenWidth: 0,
    }
  }, 
  methods: {

     async doRefresh() {
     
  },

     ListViewData(option, count){
      if(count === 1) return option.ImageUrl;
      if(count === 2) return option.Title
      if(count === 3) return null;
         
      if(count === 4) return null;
      if(count === 5)  return option.Subtitle
    },

    handleInput(value){

      this.filterAbouts = this.abouts
      const query = value.toLowerCase();
      requestAnimationFrame(() => {   
        let cat2 = this.abouts.filter(item => item.Title.toLowerCase().indexOf(query) > -1)
        if(cat2.length> 0)
          this.filterAbouts = cat2
        else
          this.filterAbouts = this.abouts
      });
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

    hasPermission(permission){
        
        let res = false;
        if (this.$store.state.authenticated)
        {
            let roles = this.$store.state.roles;
            for (let index = 0; index < roles.length; index++) {
                switch(permission){                        
                      case 'canChangeSetting':
                          res = roles[index].canChangeSetting;
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
    /****** CRUD category methods ******/
 
    editAbout: function(id){
        this.$router.push({
        name: 'AboutForm', 
        params: { aboutId: id }
      });
    },

      addAbout: function(){
        this.$router.push({
        name: 'AboutForm'
      });
    },

    deleteAbout: async function(id){

        return this.$ionic.alertController.create({
        title: this.$t('backoffice.list.messages.confirmDelete'),
        message: this.$t('backoffice.list.messages.deleteAbout'),
        buttons: [
          {
            text: this.$t('backoffice.list.messages.buttons.cancel'),
            role: 'cancel',
            handler: () => {}
          },
          {
            text: this.$t('backoffice.list.messages.buttons.delete'),
            handler: async() => {
              
              this.spinner = true
              await Api.deleteById(this.modelName, id)
                .then(response => {                  
                  const index = this.$store.state.backConfig.about.findIndex(a => a._id === id)
                  if(index !==-1) this.$store.state.backConfig.about.splice(index, 1)
                  this.abouts =  this.$store.state.backConfig.about;
                  this.filterAbouts = this.abouts
                  this.ShowMessage(this.$t('backoffice.list.messages.infoDeleteSuccess'), 
                                        this.$t('backoffice.list.messages.messageDeleteSuccessAbout'), 
                                                this.$t('backoffice.list.messages.deleteSubtitleAbout'));
                  this.spinner = false;
                  return response;
                })
                .catch(e => {
                  e;
                   this.ifErrorOccured(mess => {
                      this.deleteAbout(id)
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