<template>
  <div>

      <div v-if="restaurantType.Datas.length > 0">  
        
          <ion-item  >
             <h3 style="padding: 0 5px 5px;">{{$t('frontend.menu.menu')}}</h3>  
             <ion-select interface="popover" icon="add" v-if="restaurantType.Datas.length > 0"
            style="padding: 20px;font-size: 20px;font-weight: bold;"
            :ok-text="$t('backoffice.form.messages.buttons.ok')"
            :cancel-text="$t('backoffice.form.messages.buttons.dismiss')"
            :value="0"
            :placeholder="$t('frontend.menu.menu')"
              @ionChange="indexMenu=$event.target.value,categorySelected=''" >
                <ion-select-option v-for="(res, index) in restaurantType.Datas"                    
                  :key="index" 
                  :value="index" >{{res.Name}}
                </ion-select-option>                                
            </ion-select> 
          </ion-item>

         
                  <div v-if="indexMenu !== -1" >
                    <h3 style="    text-align: left;">{{$t('backoffice.options.manageCategories')}}</h3>                 
                      <ion-row >
                              <ion-col  v-for="(category, indexC) in restaurantType.Datas[indexMenu].Categories" :key="indexC"              
                                 size="12" size-md="6" size-lg="3">                  
                                <ion-card                         
                                  color="primary"                          
                                  :style="categorySelected===indexC? 'opacity: 1;text-align: center;': 'opacity: 0.75;text-align: center;'"
                                  @click="categorySelected !==indexC? categorySelected=indexC: categorySelected=''"
                                >                         
                                  <ion-avatar style="margin-inline: auto; margin-top: 25px;" >
                                    <img :src="category.ImageUrl">
                                  </ion-avatar>
                                  <h1 class="elipsy-center" v-tooltip="category.Name" style="margin: 5px;">{{category.Name}}</h1>                                                                                                               
                                </ion-card>
                              </ion-col>

                                
                      </ion-row>

                      <div  v-if="categorySelected !==''">
                        <h3 style="    text-align: left;">{{$t('backoffice.options.manageProducts')}}</h3>   
                                  <ion-label v-if="categorySelected !==''">{{restaurantType.Datas[indexMenu].Categories[categorySelected].Description}}</ion-label>
                                  <ion-row v-if="categorySelected !==''" style="display: flex;flex-direction: row;flex-wrap: wrap;">                
                                    <ion-col  v-for="(product, indexP) in restaurantType.Datas[indexMenu].Categories[categorySelected].Product" :key="indexP"              
                                           size="12" size-md="6" size-lg="3">                  
                                          <ion-card  color="primary" style="    text-align: center;" >                                             
                                            <ion-avatar style="margin-inline: auto; margin-top: 25px;" >
                                              <img :src="product.ImageUrl">
                                            </ion-avatar>
                                            <h1 class="elipsy-center" v-tooltip="product.Name" style="margin: 5px;">{{product.Name}}</h1> 
                                            {{getFormatPrice(product.SalePrice) }}                                                                                                             
                                          </ion-card>
                                        </ion-col>
                                  </ion-row>        
                      </div>
                  </div>

           
      </div>
  </div>
</template>

<script>

export default {

  name: 'restaurantType',
  created: function(){  
    },
  components:{   
    
  },  
  props: {  
       restaurantType: {type: Object, default: () => {} },
     },
  data () {
    return {
      modelName: 'restauranttype',     
      currency: 'USD',
      indexMenu: 0,    
      categorySelected:0,

     
    }
  }, 
  methods: {
   getFormatPrice(price){
       let result = price           
          if (this.currency)
            result = new Intl.NumberFormat('en', {style: "currency", currency: this.currency} ).format(price)      
         return result;
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