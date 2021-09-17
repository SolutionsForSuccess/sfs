<template>
   <div id="user" class="page">
    <listView
      :title="$t('frontend.specialsPrice.titles')"
      :filter="filterOrders"
      :elements="orders"
      :viewSelected="'Admin'"
      :add="hasPermission('canCreateSpecialPrices')"
      :edit="hasPermission('canEditSpecialPrices')"
      :remove="hasPermission('canDeleteSpecialPrices')"
      @handleInput="handleInput"
      @handleAddClick="createOrder"   
      @editElement="viewOrder"
      @deleteElement="deleteOrder"   
    ></listView>
  </div>
</template>

<script>

import { Api } from '../api/api.js';
import { Utils } from '../utils/utils.js';
import listView from "../components/ListView";

export default {

  name: 'SpecialsPrice',
  created: function(){  
    this.fetchOrders();
  
  },
   components: {
    listView,
  },
  data () {
    return {
      modelName: 'SpecialsPrice',
      orders: [],

      filterOrders: [],
      resConf: null,

      update: null,
      loading: null,
      paginate: ['languages'],

      spinner: false,
      dateFrom: '',
      dateTo: '',
      key: 0,

      currency: 'USD',
      menuactive:'list',
      showActive: false,
      keyList: 0,
    }
  }, 
  methods: {

    async doRefresh() {
       this.spinner = true;
      await Api.fetchAll(this.modelName).then(async response => {
        this.$store.state.backConfig.specialprice = response.data;
         await this.fetchOrders();
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
      if(count === 4) if(option.Type==='Percent') return option.Repeat +'-'+option.For +' '+ option.Amount + '%';
                     else return option.Repeat +'-'+option.For +' '+ this.getFormatPrice(option.Amount);
      if(count === 5)    if(option.Active) return  'Active';
          else  return  'No Active';
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

    handleInput(value){
       
      const query = value.toLowerCase();
      requestAnimationFrame(() => {   
        let cat2 = this.orders.filter(item => item.Name.toLowerCase().indexOf(query) > -1 ||
                                          item.Type.toLowerCase().indexOf(query) > -1 )
        if(cat2.length> 0)
          this.filterOrders = cat2
        else
          this.fil = this.orders 
      });
    },

    viewOrder: function(id){
       const specialsPrice = this.$store.state.backConfig.specialprice.find( s => s._id === id);
        return this.$router.push({ name: 'SpecialsPriceDetail', params: {specialsPrice: specialsPrice} })
    },

    createOrder: function(){
        return this.$router.push({ name: 'SpecialsPriceDetail'})
    },

    
    async deleteOrder(id){
      try {
        this.spinner = true;
        const response = await Api.deleteById('specialsprice', id);
        if(response.status === 200){
          const index = this.$store.state.backConfig.specialprice.findIndex( s=> s._id === id);
          if(index !== -1) this.$store.state.backConfig.specialprice.splice(index, 1)
           await this.fetchOrders(); 
           this.key ++;
        }          
         this.spinner = false;
        
      } catch (error) {
        error
         this.spinner = false;
      }
    },
   
    getFormatedDate: function(date){
        return Utils.getFormatedDate(date);         
    },

    getFormatPrice: function(price){
      return Utils.getFormatPrice(price);         
    },

    /****** CRUD category methods ******/
    fetchOrders: async function(){
      this.orders = this.$store.state.backConfig.specialprice
      this.filterOrders = this.orders; 
    },

    reverseOrders(){
      this.filterOrders.reverse();
    },

    scrollToTop() {
      document.querySelector('ion-card-content').scrollToTop(500);
    },
 
   getActives(){
     if(this.showActive)
      this.filterOrders = this.filterOrders.filter(p => p.Active === true);
      else
       this.filterOrders = this.orders 
   },

  hasPermission(permission){
            
            let res = false;
            if (this.$store.state.authenticated)
            {
                let roles = this.$store.state.roles;
                for (let index = 0; index < roles.length; index++) {
                    switch(permission){                        
                        case 'canViewSpecialPrices':
                            res = roles[index].canViewSpecialPrices;
                            break;
                        case 'canEditSpecialPrices':
                            res = roles[index].canEditSpecialPrices;
                            break;
                        case 'canCreateSpecialPrices':
                            res = roles[index].canCreateSpecialPrices;
                            break;
                        case 'canDeleteSpecialPrices':
                            res = roles[index].canDeleteSpecialPrices;
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

  .menu-col-4{
    flex: 0 0 calc(calc(4 / var(--ion-grid-columns, 12)) * 100%);
    width: calc(calc(4 / var(--ion-grid-columns, 12)) * 100%);
    max-width: calc(calc(4 / var(--ion-grid-columns, 12)) * 100%);
    text-align: left;
    visibility: visible;
    }

    .menu-col-6{
    flex: 0 0 calc(calc(6 / var(--ion-grid-columns, 12)) * 100%);
    width: calc(calc(6 / var(--ion-grid-columns, 12)) * 100%);
    max-width: calc(calc(6 / var(--ion-grid-columns, 12)) * 100%);
    text-align: left;
    visibility: visible;
    }
    
    .menu-col-5{
    flex: 0 0 calc(calc(5 / var(--ion-grid-columns, 12)) * 100%);
    width: calc(calc(5 / var(--ion-grid-columns, 12)) * 100%);
    max-width: calc(calc(5 / var(--ion-grid-columns, 12)) * 100%);
    text-align: left;
    visibility: visible;
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

  h6 {
    font-size: 16px;
    margin: 5px;
    font-weight: 200;
}

 .elipsis-menu{
        text-overflow: ellipsis !important;
    overflow: hidden !important;
    display: -webkit-box !important;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
  }

@media only screen and (min-width : 1024px){

    .screen{
        /* padding-left: 10%;
        padding-right: 10%;
        border: #edf1ee solid 1px; */
        margin-right: 10%;
        margin-left: 10%;
        /* border-radius: 25px; */
    }

}

</style>