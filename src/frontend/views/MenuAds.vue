<template >

    <div padding >  
     
      <ion-loading
          v-if="spinner"
          showBackdrop="false"
          cssClass="my-custom-class"
          :message="$t('frontend.tooltips.loadRestaurant')"
        >
      </ion-loading>  

        <div v-if="1">      
          
    </div>    
       
      <div >  

    
      

 
            <vue-marquee        
            style="height:400px" 
            :key="key">
              <vue-marquee-slide v-for="(category, index) in categoryMenuList" :key="index" class="menu-col-12">
                <ion-card  v-if="productsByCategory(category._id).length > 0" >
                        <ion-card-header>                           
                                <h1  style="    font-weight: bolder;text-align: left">
                                  {{category.Name}}</h1>                                                                                                             
                        </ion-card-header>    
                         <ion-row>
                            <ion-col   v-for="(product, index) in productsByCategory(category._id)" :key="index" 
                              size="12" size-md="6"> 
                              <div style="display: flex;align-items: center;justify-content: space-between;width: 100%;">
                                  <div style="    display: flex; align-items: center;">
                                    <ion-thumbnail>
                                    <img :src="product.ImageUrl">
                                    </ion-thumbnail>
                                    <h2  style="margin: 5px; font-weight: 500;">{{product.Name}}</h2>   
                                  </div>
                                  <h2 style="margin: 5px; font-weight: 500;">{{getPrice(product.SalePrice)}}</h2>                                
                                </div>                                                                                                          
                            </ion-col> 
                         </ion-row>                   
                    </ion-card> 
              </vue-marquee-slide>
            </vue-marquee>


          
      </div>

    </div>
</template>

<script>

  
import { Marquee, Slide } from "vue-marquee-component"
import { add } from "ionicons/icons";
import { addIcons } from "ionicons";

addIcons({
  "ios-add": add.ios,
  "md-add": add.md,
  
});
import { Api } from '../../backoffice/api/api';





export default {
  name: "HomeGrid",
  props: {
    menuId: {type: String, default: "" } , 
  }, 
  created: async function(){ 

    this.products = this.$store.state.products|| [];
    this.currency = this.$store.state.restaurantActive.currency;
    
    if(this.menuId !=='')
      this.changeMenu();
  },  
  data () {
    return {
      products: [],
      categoryMenuList:[],
      spinner: false,
      currency: 'USD',
      slideOpts:{ initialSlide: 0, slidesPerView: 1, autoplay:"5000", loop:"true", speed:"300"},
      key: 0
    }
  }, 
  components:{
     [Marquee.name]: Marquee,
    [Slide.name]: Slide
  }, 
  methods: {
    
    async changeMenu(){ 
      this.spinner = true;

      try {
        const response =  await Api.categoryByMenuId(this.menuId);
        if(response.status === 200){
           this.categoryMenuList = response.data
           this.key ++;
        }
        this.spinner = false;
      } catch (error) {
        error
        this.spinner = false;
      }
    },

    productsByCategory(categoryId){ 
      
      const prod = this.products.filter(p => p.CategoryId === categoryId && p.Available === true);
      return prod;
    },

    getPrice(price){
    
      const result = new Intl.NumberFormat('en', {style: "currency", currency: this.currency} ).format(price)
      return result;      
      
    }

   

  },
};

</script>


<style scoped>
#sideBarMovil{
  display: block;
}
#sideBarOpenMovil{
  display: none;
}
.disable-hover:hover{
    --background-hover: red;
    --background-hover-opacity: 1;
    --color-hover: grey;
}

.button-disabled-menu{
    --opacity: 0.6;
    /* pointer-events: none; */
    --ion-color-base: grey !important;
    --box-shadow: -2px -3px -1px 2px rgba(0,0,0,0.2),0 -2px -2px 0 rgba(0,0,0,0.14),0 -1px -5px 0 rgba(0,0,0,0.12) !important;
}

  .menu-col-2{
        flex: 0 0 calc(calc(2 / var(--ion-grid-columns, 12)) * 100%);
        width: calc(calc(2 / var(--ion-grid-columns, 12)) * 100%);
        max-width: calc(calc(2 / var(--ion-grid-columns, 12)) * 100%);
    }
      .menu-col-5{
        flex: 0 0 calc(calc(5 / var(--ion-grid-columns, 12)) * 100%);
        width: calc(calc(5 / var(--ion-grid-columns, 12)) * 100%);
        max-width: calc(calc(5 / var(--ion-grid-columns, 12)) * 100%);
        padding: 0 5px;
    }
    .menu-col-6{
        flex: 0 0 calc(calc(6 / var(--ion-grid-columns, 12)) * 100%);
        width: calc(calc(6 / var(--ion-grid-columns, 12)) * 100%);
        max-width: calc(calc(6 / var(--ion-grid-columns, 12)) * 100%);
        padding: 0 5px;
    }
    .menu-col-4{
    flex: 0 0 calc(calc(4 / var(--ion-grid-columns, 12)) * 100%);
    width: calc(calc(4 / var(--ion-grid-columns, 12)) * 100%);
    max-width: calc(calc(4 / var(--ion-grid-columns, 12)) * 100%);
    padding: 0 5px;
    }
    .menu-col-12{
        flex: 0 0 calc(calc(12 / var(--ion-grid-columns, 12)) * 100%);
        width: calc(calc(12 / var(--ion-grid-columns, 12)) * 100%);
        max-width: calc(calc(12 / var(--ion-grid-columns, 12)) * 100%);
        padding: 0 5px;
    }
    .card-categories{
      float: left;
      margin: 0;    
      padding: 5px;
    }
    .card-categories .sc-ion-card-md-s img {
   
    width: 140px;
    }
    .card-categories ion-card{
    max-width: 420px !important;
    margin: 0 auto !important;
  }
    .card-categories .sc-ion-card-md-h:hover{
      box-shadow: 0 4px 1px 6px rgba(0,0,0,.2), 0 2px 2px 0 rgb(61 58 55 / 14%), 0 1px 5px 0 rgba(0,0,0,.12);
    }
    .card-categories .item-native{
          padding-inline-start: 0 !important;
    }
    .elipsy-center{
      text-overflow: ellipsis;
      overflow: hidden;
      display: -webkit-box; 
      -webkit-line-clamp: 1;
      -webkit-box-orient: vertical;  
      text-align: center;
    }
    .opacity-active{
      opacity: 1;
      border: outset;
    }
    .opacacity-inactive{
     opacity: 0.65;
     border: none;
    }
    .swiper-pagination-bullet {
    width: 12px !important;
    height: 12px !important;
    opacity: 1 !important;
}
.button-ordertype{
  display: flex;
  flex-direction: column;
  align-items: center;
}
.button-ordertype-parent{
  width: 23%;
    height: 55px;
}
</style>