<template>
   <div id="shipping" class="page">


    <listView
      :title="$t('backoffice.titles.shippings')"
      :filter="filterShippings"
      :elements="shippings"
      :viewSelected="'Admin'"
      :add="hasPermission('canCreateShipping')"
      :edit="hasPermission('canEditShipping')"
      :remove="hasPermission('canDeleteShipping')"
      @handleInput="handleInput"
      @handleAddClick="createShipping"   
      @editElement="editShipping"
      @deleteElement="deleteShipping"   
    ></listView>
  </div>
</template>

<script>

import { Api } from '../api/api.js';
import listView from "../components/ListView";
import { Utils } from '../utils/utils.js';

export default {

  name: 'tax',
  created: function(){
    this.screenWidth = screen.width;
    this.fetchShipping();
  },
  components: {
    listView,
  },
  data () {
    return {
      modelName: 'Shipping',
      shippings: [],
      filterShippings: [],

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
        this.$store.state.backConfig.shipping = response.data;
        this.fetchShipping(); 
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
      if(count === 4) return this.getFormatPrice(option.Price);
      if(count === 5){ 
        if(option.Available) 
          return 'Available'; 
        else return 'No Available' }

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

      this.filterShippings = this.shippings
      const query = value.toLowerCase();
      requestAnimationFrame(() => {   
        let cat2 = this.shippings.filter(item => item.Name.toLowerCase().indexOf(query) > -1)
        if(cat2.length> 0)
          this.filterShippings = cat2
        else
          this.filterShippings = this.shippings
      });
    },

    hasPermission(permission){
        
        let res = false;
        if (this.$store.state.authenticated)
        {
            let roles = this.$store.state.roles;
            for (let index = 0; index < roles.length; index++) {
                switch(permission){                        
                      case 'canCreateShipping':
                          res = roles[index].canCreateShipping;
                          break;
                      case 'canEditShipping':
                          res = roles[index].canEditShipping;
                          break;
                      case 'canDeleteShipping':
                          res = roles[index].canDeleteShipping;
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
    fetchShipping: function(){
      this.shippings = this.$store.state.backConfig.shipping
      this.filterShippings = this.shippings
        },

    availableShipping: async function(shipping, state){
      let item = {
            "_id": shipping._id,
            "Name": shipping.Name,
            "Available": state,
            "Price": shipping.Price,
        }
        this.spinner = true;
        await Api.putIn(this.modelName, item)
              .then(response => {
                  const index = this.$store.state.backConfig.shipping.findIndex( s => s._id === shipping._id)
                  if(index !== -1) this.$store.state.backConfig.shipping[index] = item;
                  this.showToastMessage(this.$t('backoffice.list.messages.shippingChangeState'), "success");
                  this.fetchShipping();
                  this.spinner = false;
                  return response;
              })
              .catch(e => {
                    e;
                    this.fetchShipping();
                    this.ifErrorOccured(mess => {
                      this.availableShipping(shipping, state)
                      this.spinner = false;
                      return mess
                    });

              })
    },

    editShipping: function(id){
        this.$router.push({
        name: 'ShippingForm', 
        params: { shippingId: id }
      });
    },

    createShipping: function(){
        this.$router.push({
        name: 'ShippingForm'
      });
    },

    deleteShipping: async function(id){

        return this.$ionic.alertController.create({
        title: this.$t('backoffice.list.messages.confirmDelete'),
        message: this.$t('backoffice.list.messages.deleteShipping'),
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
                  const index = this.$store.state.backConfig.shipping.findIndex( s => s._id === id)
                  if(index !== -1) this.$store.state.backConfig.shipping.splice(index, 1);
                  this.fetchShipping();                  
                  this.showToastMessage(this.$t('backoffice.list.messages.messageDeleteSuccessShipping'), "success");
                  this.spinner = false;
                  return response;
                })
                .catch(e => {
                  e;
                  this.ifErrorOccured(mess => {
                      this.deleteShipping(id)
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

    getFormatPrice: function(price){
      return Utils.getFormatPrice(price);         
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