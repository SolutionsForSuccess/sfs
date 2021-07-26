<template>
  <div id="menu" class="menu">

    <ion-card>
    
      <!-- <ion-back-button default-href="" @click="$router.go(-1)"></ion-back-button> -->
           
      <ion-card-title>
      {{$t('frontend.credit.yourCredit')}}
        <ion-label class="ion-text-wrap">           
            <ion-button fill="outline" v-if="!spinner" style="float: right; margin-right: 10px;" @click="addCredit()" v-tooltip="$t('frontend.tooltips.addOrder')"> +  </ion-button>
        </ion-label>
         <ion-searchbar 
                @ionClear="handleInput('')"
                @input="$event.target.value?handleInput($event.target.value):handleInput('')"
                :placeholder="$t('frontend.home.search')">           
            </ion-searchbar>
      </ion-card-title>
    </ion-card>

     <ion-refresher 
        style="position: relative"
        slot="fixed"
        @ionRefresh="doRefresh($event)">
          <ion-refresher-content 
            refreshing-spinner="crescent"
          ></ion-refresher-content>
      </ion-refresher>
      
<!--     
     <ion-item-divider/> -->

     <div v-if="spinner">
        <ion-spinner  name="lines" class="spinner"></ion-spinner>
      </div>

  
      <ion-item-sliding>
        <v-breakpoint >
            <div  slot-scope="scope">

              <ion-item    v-if="!scope.isSmall && !scope.noMatch">
                  <ion-label class="ion-text-wrap menu-col-3"><h2 style="font-size: 16px;font-weight: bold;">{{$t('frontend.order.type')}}</h2> </ion-label>
                  <ion-label class="ion-text-wrap menu-col-3"> <h3  style="font-size: 16px;font-weight: bold;">{{$t('frontend.order.state')}}</h3></ion-label>
                  <ion-label class="ion-text-wrap menu-col-3"><h3  style="font-size: 16px;font-weight: bold;">{{$t('frontend.order.total')}}</h3></ion-label>
                  <ion-label class="ion-text-wrap menu-col-3"><h3  style="font-size: 16px;font-weight: bold;">{{$t('frontend.order.date')}}</h3></ion-label>            
              </ion-item>
              <ion-item    v-if="scope.isSmall || scope.noMatch">
                  <ion-label class="ion-text-wrap menu-col-4"><h2 style="font-size: 16px;font-weight: bold;">{{$t('frontend.order.type')}}</h2> </ion-label>
                  <ion-label class="ion-text-wrap menu-col-4"><h3  style="font-size: 16px;font-weight: bold;">{{$t('frontend.order.total')}}</h3></ion-label>
                  <ion-label class="ion-text-wrap menu-col-4"><h3  style="font-size: 16px;font-weight: bold;">{{$t('frontend.order.date')}}</h3></ion-label>            
              </ion-item>

            </div>
        </v-breakpoint>

        <ion-item-options side="end">
          <ion-item-option color="primary" >
            <span class="iconify" data-icon="teenyicons:pdf-outline" data-inline="false"></span>
          </ion-item-option>     
        </ion-item-options>

      </ion-item-sliding>

      <ion-label class="ion-text-wrap menu-col-12" v-if="clientId ===''">
        <p style="display: inline-block; text-align: center; font-style: italic;color: red;font-weight: 500;" color="danger" v-if="clientId ===''" class="ion-text-wrap menu-col-12">
            <span class="iconify" data-icon="el:error-alt" data-inline="false" style="color: red; margin: 5px 0 0 15px; width: 18px;height: 18px;"></span>
            {{$t('frontend.home.clientRequired')}}</p>
      </ion-label>

       <paginate name="languages"
          v-if="!spinner && clientId !=='' &&  allCredit.length > 0 "
          ref="paginator"         
          :list="credits"
          :per="8"
        >
          <ion-item-sliding v-for="(cred, index) in paginated('languages')" :key="index">

             <v-breakpoint >
               <div   :key="refreshKey">

                  <ion-item
                  
                  
                   style="width: 100%;"
                   @click="addCredit(cred, index)"
                   :style="cred.State===3 ? '--background:#ff00001f' : cred.State===2 ? '--background: #71676738': cred.State===1 ? '--background: #30ed5338' : '--background: #14eb1412'">
                    <ion-label 
                     class="ion-text-wrap menu-col-3 elipsis-menu"> 
                        <h2>{{cred.Name}}</h2>                
                    </ion-label>
                    <ion-label 
                    class="ion-text-wrap menu-col-3 elipsis-menu">     
                        <h2>{{allStates[cred.State] }}</h2>               
                    </ion-label >
                    <ion-label 
                     class="ion-text-wrap menu-col-3 elipsis-menu"> 
                        <h2>{{ getFormatPrice(cred.CreditAmount) }}</h2>               
                    </ion-label>
                    
                   <ion-label 
                      class="ion-text-wrap menu-col-3 elipsis-menu"> 
                        <h2 style="display: contents"> {{getDate(cred.CreateDate)}}</h2>     
                        <div style="position: absolute; right: 0px; top: 30%;">
                           <span class="iconify" data-icon="mdi:backburger" style="color: grey;margin:0;width: 20px; height: 20px;" data-inline="false"></span>
                        </div>          
                    </ion-label>
                    
                  </ion-item>

                

                  <ion-item-options side="end">

                   

                       <ion-item-option                      
                      color="primary"  @click="sendEmail(cred)" v-tooltip="$t('frontend.tooltips.forward')" >
                          <span  class="iconify" data-icon="carbon:mail-all" data-inline="false"></span>
                          <ion-spinner v-if="spinnerEmail"></ion-spinner>
                      </ion-item-option>                          

                       <ion-item-option 
                      color="primary" @click="printCredit(cred)"  v-tooltip="$t('frontend.tooltips.printOrder')" >
                          <span class="iconify" data-icon="ic:round-local-printshop" data-inline="false"></span>
                      </ion-item-option> 

                  </ion-item-options>

               </div>
                 
                  


                 

             </v-breakpoint>

          </ion-item-sliding>
        </paginate>

        <paginate-links for="languages" color="primary" 
        @change="onLangsPageChange()"
        :async="true"
         v-if="clientId !==''"
          :simple="{
            next:'»' ,
            prev: '« ' }"
        ></paginate-links>
  

  </div>
</template>

<script>

import { EventBus } from '../event-bus';
import moment from 'moment-timezone';
// import { Api } from '../../backoffice/api/api.js';
//  import Moment from 'moment';
   import { VBreakpoint } from 'vue-breakpoint-component'
 import { Commons } from '../commons'



export default {

  name: 'ListCredit',

  created: async function(){  

   
     if(this.$store.state.customer._id){
         this.clientId= this.$store.state.customer._id;   
         this.name = this.$store.state.customer.Name;     
       }
      // await this.getCredits();  
  
    this.allCredit = this.$store.state.allCustomerCredit;
    this.configuration = this.$store.state.configuration;
    this.restaurantActive = this.$store.state.restaurantActive

     
    for(var i=0; i< this.allCredit.length; i++){
       this.allCredit[i].iState = this.allStates[this.allCredit[i].State];
    }

    this.credits = JSON.parse(JSON.stringify(this.allCredit));

    console.log(JSON.parse(JSON.stringify(this.allCredit)))

    
     EventBus.$on('sendPrint', (value) => {           
      this.printCredit(value);
    });

  },
    mounted: function(){
        if(this.$route.params.currentPage > 1){
          this.currentPage = this.$route.params.currentPage; 
           this.$refs.paginator.goToPage(this.currentPage);
       }
      },
   components:{
      VBreakpoint: VBreakpoint,
  },
   props:{  
    fromMyAccount:  {type: String, default:"" },
  },
  data () {
    return { 
      credits: [],
      products:  [],
      name: '',
      spinner: false,
      allStates: [
        this.$t('frontend.credit.state0'),
        this.$t('frontend.credit.state1'), 
        this.$t('frontend.credit.state2'),
        this.$t('frontend.credit.state3')
        ],
      paginate: ['languages'],
      dots: false, 
     
      producstNotAvailables: '',
      currentPage: 1,
      showCooker:  false,
      allCredit: [],
      configuration: {},
      restaurantActive: {},
      refreshKey: 1,
      spinnerEmail: false,
      
      
    }
  }, 

  methods: {

     async doRefresh(event) {    
      await this.getCredits();      
      event.target.complete();
    },

    handleInput(value){

       this.credits = this.allCredit
      const query = value.toLowerCase();
      requestAnimationFrame(() => {   
        let cat2 = this.allCredit.filter(item => item.Name.toLowerCase().indexOf(query) > -1 ||
                                          item.iState.toLowerCase().indexOf(query) > -1 )
        if(cat2.length> 0)
          this.credits = cat2
        else
          this.credits = this.allCredit 
      });
    },
   
    addCredit: function(credit, index){
      console.log(JSON.parse(JSON.stringify(credit)))  
      return this.$router.push({ name: 'ListCreditDetail', params: {credit: credit, index: index} })  
    },

    onLangsPageChange () { 
        this.currentPage = this.$refs.paginator.currentPage + 1;        
    },

    getDate(date){
      var formatDate = moment.tz(date, moment.tz.guess()).format('LL');
      return formatDate;

    },
   
    async printCredit(credit){
        
        var html = credit._id
        
          var winimp = window.open('/print', 'popimpr');
          winimp.document.open();
          winimp.document.write( html );
          winimp.document.close();
          winimp.focus();
          winimp.print();
          winimp.close();

   },

    async sendEmail(cred){
      console.log(cred);
      // Commons.sendOrderEmail(cred);
    },  

    async openToast(message) {
      return this.$ionic.toastController
      
        .create({
          message: message,
          duration: 2000,
          position: 'top',
          color:'success'
        })
      .then(a => a.present())
    },

     getFormatPrice(price){
       let result = price
       if (this.restaurantActive.currency)
          result = new Intl.NumberFormat('en', {style: "currency", currency: this.restaurantActive.currency} ).format(price)
      return result;
    },

     async getCredits(){
       await Commons.getAllCredit();       
       this.allCredit = this.$store.state.allCustomerCredit;
       for(var i=0; i< this.allCredit.length; i++){
          this.allCredit[i].iState = this.allStates[this.allCredit[i].State];
        }
      this.credits = JSON.parse(JSON.stringify(this.allCredit));
     
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
        visibility: visible;
    }

  .menu-col-4{
    flex: 0 0 calc(calc(4 / var(--ion-grid-columns, 12)) * 100%);
    width: calc(calc(4 / var(--ion-grid-columns, 12)) * 100%);
    max-width: calc(calc(4 / var(--ion-grid-columns, 12)) * 100%);
    text-align: left;
    visibility: visible;
    }

    .menu-col-4 h2,  .menu-col-3 h2{
          margin-left: 0;
    margin-right: 0;
    margin-top: 2px;
    margin-bottom: 2px;
    font-size: 16px;
    font-weight: 400;
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

  .not-display{
    display: none;
  }


</style>