<template>
    <div id="tax" class="page">
      <listView
        :title="$t('backoffice.titles.taxes')"
        :filter="filterTaxes"
        :elements="taxes"
        :viewSelected="'Admin'"
        :add="hasPermission('canCreateTax')"
        :edit="hasPermission('canEditTax')"
        :remove="hasPermission('canDeleteTax')"
        @handleInput="handleInput"
        @handleAddClick="createTax"   
        @editElement="editTax"
        @deleteElement="deleteTax"   
      ></listView>
  </div>
</template>

<script>

import { Api } from '../api/api.js';
import listView from "../components/ListView";

export default {

  name: 'tax',
  created: function(){
      this.screenWidth = screen.width;
      this.fetchTaxes();
  },
  components: {
    listView,
  },
  data () {
    return {
      modelName: 'Tax',
      taxes: [],
      filterTaxes: [],

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
        this.$store.state.backConfig.tax = response.data;
         this.fetchTaxes();    
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
      if(count === 4) return option.Percentage + '%';
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

      this.filterTaxes = this.taxes
      const query = value.toLowerCase();
      requestAnimationFrame(() => {   
        let cat2 = this.taxes.filter(item => item.Name.toLowerCase().indexOf(query) > -1)
        if(cat2.length> 0)
          this.filterTaxes = cat2
        else
          this.filterTaxes = this.taxes
      });
    },

    hasPermission(permission){
        
        let res = false;
        if (this.$store.state.authenticated)
        {
            let roles = this.$store.state.roles;
            for (let index = 0; index < roles.length; index++) {
                switch(permission){                        
                      case 'canCreateTax':
                          res = roles[index].canCreateTax;
                          break;
                      case 'canEditTax':
                          res = roles[index].canEditTax;
                          break;
                      case 'canDeleteTax':
                          res = roles[index].canDeleteTax;
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
    fetchTaxes: function(){
       this.taxes = this.$store.state.backConfig.tax;      
       this.filterTaxes = this.taxes
        },

    activeTax: async function(tax, state){
      let item = {
            "_id": tax._id,
            "Name": tax.Name,
            "Available": state,
            "Percentage": tax.Percentage,
        }
        if (tax.EposId){
            item['EposId'] = tax.EposId
        }
        this.spinner = true
        await Api.putIn(this.modelName, item)
              .then(response => {                    
                    const index = this.$store.state.backConfig.tax.findIndex(t => t._id === tax._id)
                    if(index !== 1) this.$store.state.backConfig.tax[index] = item;                 
                     this.fetchTaxes();
                    
                    this.showToastMessage(this.$t('backoffice.list.messages.taxChangeState'), "success");
                   
                    this.spinner = false;
                    return response;
              })
              .catch(e => {
                    e;
                    this.fetchTaxes();
                    this.ifErrorOccured(mess => {
                      this.activeTax(tax, state)
                      this.spinner = false
                      return mess
                    });
              })
    },

    editTax: function(id){
        this.$router.push({
        name: 'TaxForm', 
        params: { taxId: id }
      });
    },

    createTax: function(){
        this.$router.push({
        name: 'TaxForm'
      });
    },


    deleteTax: async function(id){

        return this.$ionic.alertController.create({
        title: this.$t('backoffice.list.messages.confirmDelete'),
        message: this.$t('backoffice.list.messages.deleteTax'),
        buttons: [
          {
            text: this.$t('backoffice.list.messages.buttons.cancel'),
            role: 'cancel',
            handler: () => {
              
            }
          },
          {
            text: this.$t('backoffice.list.messages.buttons.delete'),
            handler: async() => {
              
              this.spinner = true
              await Api.deleteById(this.modelName, id)
                .then(response => {
                  
                    const index = this.$store.state.backConfig.tax.findIndex(t=> t._id === id)
                    if(index !== 1) this.$store.state.backConfig.tax.splice(index, 1);
                    this.fetchTaxes();                   
                  this.showToastMessage(this.$t('backoffice.list.messages.messageDeleteSuccessTax'), "success");                 
                  this.spinner = false;
                  return response;
                })
                .catch(e => {
                  e
                  this.ifErrorOccured(mess => {
                     this.spinner = false
                    this.deleteTax(id)                   
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