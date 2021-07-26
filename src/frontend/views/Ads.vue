<template>
<div>
   
      <ion-toolbar>
      <ion-segment   @ionChange="segmentValue=$event.target.value" :value="segmentValue" >
        <ion-segment-button value="-1">
          <span class="iconify" data-icon="bx:bx-slider" data-inline="false"></span>
        </ion-segment-button>   
        <ion-segment-button v-for="(ads, index) in adsList" :key="index" :value="index">
          {{ads.Name}}
        </ion-segment-button>    
      </ion-segment>   
    </ion-toolbar>

    <div v-if="segmentValue==-1">   '

         <vue-marquee        
            style="height:400px"  
            :key="key">
              <vue-marquee-slide v-for="(ads, index) in adsList" :key="index" class="menu-col-12">
                  <ion-card>
                    <ion-card-header>                           
                        <ion-card-title>{{ads.Name}}</ion-card-title>
                    </ion-card-header>
                     <ion-card-content>
                             <iframe v-if="['url','map'].includes(ads.Type)" :src="ads.Value" autoplay  style="    width: 90%;height: auto;"></iframe>
        
                              <video v-if="ads.Type=='video'" :src="ads.Value" controls autoplay  style="    width: 90%;height: auto;"></video>

                              <img v-if="ads.Type=='image'" :src="ads.Value"  style="    width: 90%;height: auto;"/>

                              <div v-if="ads.Type=='menu'"  style="    width: 90%;height: auto;">
                                 <menu-ads
                                    :menuId="ads.Value"
                                  ></menu-ads>
                              </div>
                        </ion-card-content>
                  </ion-card>
              </vue-marquee-slide>
         </vue-marquee>   


    </div>

    <div v-for="(ads, index) in adsList" :key="index">
      <div v-if="index==segmentValue">
      
        <iframe v-if="['url','map'].includes(ads.Type)" :src="ads.Value"   style="    width: 90%;height: auto;"></iframe>
        
        <video v-if="ads.Type=='video'" :src="ads.Value" controls allow="autoplay"  style="    width: 90%;height: auto;"></video>

        <img v-if="ads.Type=='image'" :src="ads.Value"  style="    width: 90%;height: auto;"/>

        <div v-if="ads.Type=='menu'" style="    width: 90%;height: auto;">         
          <menu-ads
            :menuId="ads.Value"
          ></menu-ads>
        </div>
      </div>
    </div>
 

</div>
</template>
<script>
import { Marquee, Slide } from "vue-marquee-component"
import MenuAds from './MenuAds.vue'

export default {
    name: 'Reservation',
     components: { 
       MenuAds,  
      [Marquee.name]: Marquee,
      [Slide.name]: Slide
  },
     data () {
      return {
         ads1: true,
         ads2: false,
         ads3: false,
         spinner: false,   
         segmentValue: -1,    
         adsList: [],
         slideOpts:{ initialSlide: 0, slidesPerView: 1, autoplay:"5000", loop:"true", speed:"300"},
         key: 1
      }
     },     
     created: function(){

       this.adsList = this.$store.state.configuration.ads;
     },
    methods: {       
   
         
      segmentChanged(value){            
             if(value === 'ads1'){
                 this.ads1 = true;
                 this.ads2 = false;
                 this.ads3 = false;
             }
             if(value === 'ads2'){
                 this.ads1 = false;
                 this.ads2 = true;
                 this.ads3 = false;
             }  
              if(value === 'ads3'){
                 this.ads1 = false;
                 this.ads2 = false;
                 this.ads3 = true;                
             }
             this.segmentValue = value;

         },

     }
}

</script>

<style scoped>
iframe body{
  text-align: center;
}

#front-login{
    display: none !important;
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
  .elipsis-menu{
        text-overflow: ellipsis !important;
    overflow: hidden !important;
    display: -webkit-box !important;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
  }
    
</style>