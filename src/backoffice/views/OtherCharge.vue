<template>
   <div id="user" class="page">
    <listView
      :title="$t('backoffice.titles.otherCharges')"
      :filter="filterOtherCharges"
      :elements="otherCharges"
      :viewSelected="'Admin'"
      :add="hasPermission('canCreateOtherCharge')"
      :edit="hasPermission('canEditOtherCharge')"
      :remove="hasPermission('canDeleteOtherCharge')"
      @handleInput="handleInput"
      @handleAddClick="addOtherCharge"   
      @editElement="editOtherCharge"
      @deleteElement="deleteOtherCharge"   
    ></listView>
  </div>
</template>

<script>

import { Api } from '../api/api.js';
import { Utils } from '../utils/utils.js';
import listView from "../components/ListView";

export default {
   name: 'product',
   created: function(){
       this.products = this.$store.state.backConfig.product;
       this.fetchOtherCharges();
       this.screenWidth = screen.width;
   },
  components: {
    listView,
  },
   data () {
    return {
      modelName: 'OtherCharges',
      /****** Form Data ******/
    //   categoryId: null,
      otherCharges: [],
      filterOtherCharges: [],
      products: [],

      paginate: ['languages'],

      spinner: false,
      screenWidth: 0,
      key: 0,
      keyList: 0,
    }
  },
   methods: {

    async doRefresh() {
      this.spinner = true;
      await Api.fetchAll(this.modelName).then(response => {
        this.$store.state.backConfig.othercharges = response.data;
        this.fetchOtherCharges();  
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
      if(count === 2) return option.Name
      if(count === 3) return  null;
      
         
      if(count === 4) return option.ProductMin +'-'+ option.ProductMax + ' ( '+ this.getFormatPrice(option.Price) +' )';
      if(count === 5)    if(option.Available) return  'Available';
          else  return  'No Available';
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

      this.filterOtherCharges = this.otherCharges
      const query = value.toLowerCase();
      requestAnimationFrame(() => {   
        let cat2 = this.otherCharges.filter(item => item.Name.toLowerCase().indexOf(query) > -1)
        if(cat2.length> 0)
          this.filterOtherCharges = cat2
        else
          this.filterOtherCharges = this.otherCharges
      });
    },
    hasPermission(permission){
        
        let res = false;
        if (this.$store.state.authenticated)
        {
            let roles = this.$store.state.roles;
            for (let index = 0; index < roles.length; index++) {
                switch(permission){                        
                      case 'canCreateOtherCharge':
                          res = roles[index].canCreateOtherCharge;
                          break;
                      case 'canEditOtherCharge':
                          res = roles[index].canEditOtherCharge;
                          break;
                      case 'canDeleteOtherCharge':
                          res = roles[index].canDeleteOtherCharge;
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
    fetchOtherCharges: function(){
      this.otherCharges = this.$store.state.backConfig.othercharges
       this.filterOtherCharges = this.otherCharges
    },
   
     availableOtherCharge:async function(otherCharge, state){
      let item = {
            "_id": otherCharge._id,
            "Name": otherCharge.Name,
            "ProductMin": otherCharge.ProductMin,
            "ProductMax": otherCharge.ProductMax,
            "Price": otherCharge.Price,
            "ProductId": otherCharge.ProductId,
            "Available": state,
        }
        this.spinner = true;
        await Api.putIn(this.modelName, item)
              .then(response => {
                    const index = this.$store.state.backConfig.othercharges.findIndex(o =>o._id ===item._id)
                    if(index !== -1) this.$store.state.backConfig.othercharges[index] = item;
                    this.fetchOtherCharges();
                    this.key ++;
                    this.spinner = false;
                     this.showToastMessage(this.$t('backoffice.list.messages.activeOtherCharge'), "success");
                    return response;
              })
              .catch(e => {
                    e;
                    this.fetchOtherCharges();
                    this.ifErrorOccured(mess => {
                      this.availableOtherCharge(otherCharge, state)
                      this.spinner = false
                      return mess
                    });

              })
    },

    editOtherCharge: function(id){
        this.$router.push({
        name: 'OtherChargeForm', 
        params: { otherChargeId: id }
      });
    },

    addOtherCharge: function(){
        this.$router.push({
        name: 'OtherChargeForm'
      });
    },

    deleteOtherCharge: function(id){

        return this.$ionic.alertController.create({
        title: this.$t('backoffice.list.messages.confirmDelete'),
        message: this.$t('backoffice.list.messages.deleteOtherCharge'),
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
                    
                    const index = this.$store.state.backConfig.othercharges.findIndex(o => o._id === id)
                    if(index !== -1) this.$store.state.backConfig.othercharges.splice(index, 1);
                    this.fetchOtherCharges();
                    this.key ++;
                    this.spinner = false;
                    this.showToastMessage(this.$t('backoffice.list.messages.messageDeleteSuccessOtherCharges'), "success");
                    return response;
                })
                .catch(e => {
                    e;
                    this.ifErrorOccured(mess => {
                      this.deleteOtherCharge(id)
                      this.spinner = false;
                      return mess
                    });
                })

            }
          }
        ]
      })
      .then(a => a.present());  

     },

    getFormatPrice: function(price){
      return Utils.getFormatPrice(price);         
    },
   } 
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