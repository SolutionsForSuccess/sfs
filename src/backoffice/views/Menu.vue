<template>
    <div id="user" class="page">

    <modal name="my-first-modal" height="80%">
        <ion-header>
          <ion-toolbar >
            <div style="display: flex">
                <ion-title>Menu Qr</ion-title>
                <ion-button @click="hide()"> X </ion-button>
            </div>
          </ion-toolbar>
        </ion-header>

        <div style="    margin-top: 50px;    display: flex;flex-direction: column;align-items: center;">            
        <qrcode-vue :value="qrMenu" :size=280 level="H"></qrcode-vue>
          <ion-button style="text-align: center; padding: 5px 20px;" @click="printQr()"  >
          <span class="iconify" data-icon="ic:round-local-printshop" data-inline="false"></span>
          <ion-spinner v-if="spinnerPrint" name="dots"></ion-spinner></ion-button>
          <a :href="qrMenu">{{qrMenu}}</a>
        </div>
    </modal>

    <listView
      :title="$t('backoffice.titles.menus')"
      :filter="filterMenu"
      :elements="menus"
      :add="hasPermission('canCreateMenu')"
      :edit="hasPermission('canEditMenu')"
      :remove="hasPermission('canDeleteMenu')"
      :hasQr="true"
      :viewSelected="'Admin'"
      @handleInput="handleInput"
      @handleAddClick="addMenu"   
      @editElement="editMenu"
      @deleteElement="deleteMenu"   
      @showQr="show"   
    ></listView>
    
  </div>
</template>

<script>

import { Api } from '../api/api.js';
import { Utils } from '../utils/utils.js'
import QrcodeVue from 'qrcode.vue';
import listView from "../components/ListView";

export default {

  name: 'menus',
  created: function(){
   this.fetchMenus();
   this.screenWidth = screen.width;
  },
  data () {
    return {
      modelName: 'Menu',
      menus: [],

      filterMenu: [],

      paginate: ['languages'],

      spinner: false,
      screenWidth : 0,
      // qrMenu: `http://localhost:8080/?menu=${this.$store.state.user.RestaurantId}`,    
      qrMenu: `https://imenuapps.net/?menu=${this.$store.state.user.RestaurantId}`,    
      spinnerPrint: false,
      key: 0,
      keyList: 0,
    }
  }, 
  components: {
      QrcodeVue,listView,
  },
  methods: {

    async doRefresh() {
      this.spinner = true;
      await Api.fetchAll(this.modelName).then(response => {
        this.$store.state.backConfig.menu = response.data;
        this.fetchMenus(); 
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
    if(count === 4) { 
        if(option.Active) 
          return 'Active'; 
        else return 'No Active' 
    }
    if(count === 5) null;

  },
    
    show () {     
      this.$modal.show('my-first-modal');
    },
    
    hide () {
      this.$modal.hide('my-first-modal');
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

      this.filterMenu = this.menus
      const query = value.toLowerCase();
      requestAnimationFrame(() => {   
        let cat2 = this.menus.filter(item => item.Name.toLowerCase().indexOf(query) > -1)
        if(cat2.length> 0)
          this.filterMenu = cat2
        else
          this.filterMenu = this.menus
      });
    },

    hasPermission(permission){
        
        let res = false;
        if (this.$store.state.authenticated)
        {
            let roles = this.$store.state.roles;
            for (let index = 0; index < roles.length; index++) {
                switch(permission){                        
                      case 'canCreateMenu':
                          res = roles[index].canCreateMenu;
                          break;
                      case 'canEditMenu':
                          res = roles[index].canEditMenu;
                          break;
                      case 'canDeleteMenu':
                          res = roles[index].canDeleteMenu;
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
    fetchMenus: function(){
         this.menus = this.$store.state.backConfig.menu;
         this.filterMenu = this.menus;    
    },
    getFormatedDate: function(date){
        return Utils.getFormatedDate(date);         
    },
    activeMenu: function(value, state){
        const menu = value
        menu.Active = state;
        this.spinner = true;
        Api.putIn(this.modelName, menu)
              .then(response => {                 
                   
                    const index = this.$store.state.backConfig.menu.findIndex(men => men._id === menu._id)
                    if(index !== -1) this.$store.state.backConfig.menu[index] = menu;
                    this.fetchMenus();
                    this.spinner = false;
                     this.showToastMessage(this.$t('backoffice.list.messages.menuChangeState'), "success");
                     this.key ++;
                    return response;
              })
              .catch(e => {
                    e;
                    this.fetchMenus();
                    this.ifErrorOccured(mess => {
                      this.activeMenu(value, state)
                      this.spinner = false
                      return mess
                    });
              })
    },
    addMenu: function(){
        this.$router.push({
        name: 'MenuForm'
      });
    },
    editMenu: function(id){
        this.$router.push({
        name: 'MenuForm', 
        params: { menuId: id }
      });
    },
    deleteMenu: function(id){

      return this.$ionic.alertController.create({
        title: this.$t('backoffice.list.messages.confirmDelete'),
        message: this.$t('backoffice.list.messages.deleteMenu'),
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
              
              this.spinner = true;
              Api.deleteById(this.modelName, id)
                .then(response => {
                 
                  const index = this.$store.state.backConfig.menu.findIndex(men => men._id === id)
                  if(index !== -1) this.$store.state.backConfig.menu.splice(index, 1);
                  this.fetchMenus();
                  this.spinner = false;
                  this.key ++;
                  this.showToastMessage(this.$t('backoffice.list.messages.messageDeleteSuccessMenu'), "success");
                  return response;
                })
                .catch(e => {
                  e;
                  this.ifErrorOccured(mess => {
                      this.deleteMenu(id)
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

    async printQr(){

      try {
        this.spinnerPrint = true;
        const response = await Api.fetchById("Restaurant", this.$store.state.user.RestaurantId)         
        if(response.status === 200){
          const name = response.data.Name;
          let qrList = document.getElementsByTagName('canvas')
          let dataUrl = qrList[0].toDataURL();

          var html =' <html><head>';    
          html +='<style> .progressBar { width: 100%;  border-bottom: 1px solid black;display: list-item;list-style: unset; padding: 0}';
          html += '.progressBar li {list-style-type: none; float: left; position: relative; text-align: center; margin:0}';
          html += '.progressBar li .before {content: " "; line-height: 30px; border-radius: 50%; width: 30px; height: 30px; border: 1px solid #ddd;';
          html += 'display: block;text-align: center;margin: 0 auto 10px;background-color: white}';
          html += '.progressBar li .after { content: "";position: absolute;width: 100%;height: 4px;background-color: #ddd;top: 15px;left: -50%;z-index: -1;}';
          html += '.progressBar li .one .after {content: none;}.progressBar li.active {color: black;}';
          html += '.progressBar li.active .before { border-color: #63ee68; background-color: #63ee68}.progressBar .active:after {background-color: #4ca44f;} </style>';
          
          html += '</head><body><div >';
          html += '<table  align=center style="width: 90%;">';
          html += `<div style="text-align:center"><h4 >Menu Qr "${name}"</h4>`;
          html += `<img src="${dataUrl}" style="width: 50%; margin: 0px auto"></img> <div>`;  
            html += `</table></div></body></html>`;
          
          var winimp = window.open('/print', 'popimpr');
          winimp.document.open();
          winimp.document.write( html );
          winimp.document.close();
          winimp.focus();
          winimp.print();
          winimp.close();
          this.spinnerPrint = false;

        }
         this.spinnerPrint = false;
      } catch (error) {
        error; 
         this.spinnerPrint = false;       
      }

     

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