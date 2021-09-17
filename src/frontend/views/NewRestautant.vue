<template>
    <div>
        <ion-loading
          v-if="spinner"
          cssClass="my-custom-class"
          :message="$t('frontend.createNew.saving')"
        ></ion-loading>

         <modal v-if="restaurantType.length > 0 && restaurantTypeSelected !==-1" name="restaurant-type-modal"  width="80%" height="auto" style="left: 0px;width: auto;height: auto; max-width: 500px !important;">
               
                <ion-header>
                <ion-toolbar>
                     <ion-buttons slot="start" @click="hideRestaurantType()">
                        <ion-back-button default-href="home"></ion-back-button>
                    </ion-buttons>
                    <ion-title>{{$t('frontend.createNew.template')}}: {{restaurantType[restaurantTypeSelected].Type}}</ion-title>
                </ion-toolbar>
                </ion-header>

               <restaurant-type-show  :restaurantType="restaurantType[restaurantTypeSelected]"></restaurant-type-show>
        </modal>

         <modal name="terms-and-condition"  width="80%" height="auto" >               
                <ion-header>
                <ion-toolbar>
                     <ion-buttons slot="start" @click="hideTerms()">
                        <ion-back-button default-href="home"></ion-back-button>
                    </ion-buttons>
                    <ion-title>Software Terms and Conditions of Use</ion-title>
                </ion-toolbar>
                </ion-header>

                <div>
                     <TermAndConditions/>
                </div>

             <ion-button @click="hideTerms()">{{$t('frontend.home.cancel')}}</ion-button>
             <ion-button @click="termAndCondition=true,hideTerms()">{{$t('frontend.home.acept')}}</ion-button>
        </modal>


        <div >

            <ion-header>
                <ion-toolbar>
                    <div style="display: flex;     justify-content: space-between;">
                        <ion-buttons slot="start" @click="goInit()" >
                        <ion-back-button default-href="/"></ion-back-button>
                    </ion-buttons>
                      <h3 >{{$t('frontend.createNew.createTitle')}}</h3>                     
                    
                    <Language />
                    </div>
                </ion-toolbar>
            </ion-header> 

            <div > 
                <ion-button @click="restaurantBussines=true,serviceBussines=false,businessType='Hospitality'" :disabled="restaurantBussines? true: false">{{$t('frontend.createNew.business')}}</ion-button>
                <ion-button @click="serviceBussines=true,restaurantBussines=false,businessType='Reservations'" :disabled="serviceBussines? true: false">{{$t('frontend.createNew.reservation')}}</ion-button>
            </div>

                <div  v-if="restaurantBussines || serviceBussines" :key="key">

                 

                    <ion-card >
                            <ion-card-title style="text-align: left;padding: 15px;">
                            {{$t('frontend.createNew.dataRestaurant')}}
                        </ion-card-title>
                        <ion-card-content :key="restaurantKey">
                             <div style="display: flex;justify-content: flex-start;align-items: center;padding: 0 20px;font-weight: bold;" >
                                <h2 ><ion-label>{{$t('frontend.createNew.restaurantType')}}</ion-label><strong style="color: red">*</strong></h2>                                          
                              
                                 <ion-select interface="popover" icon="add" 
                                    style=""
                                    :ok-text="$t('backoffice.form.messages.buttons.ok')"
                                    :cancel-text="$t('backoffice.form.messages.buttons.dismiss')"                                    
                                    :placeholder="$t('frontend.createNew.select')"
                                    :value="businessType"
                                    :disabled="serviceBussines?true:false"
                                    @ionChange="businessType=$event.target.value"                          
                                    >
                                        <ion-select-option v-for="(res) in businessTypeList" :key="res"
                                        :value="res" >{{res}}
                                        </ion-select-option>  
                                </ion-select>
                            </div>
                            <div  style="display: flex;justify-content: flex-start;align-items: center;;padding: 0 20px;font-weight: bold;" v-if="!serviceBussines">  
                                
                                <h2>{{$t('frontend.createNew.template')}}<strong style="color: red">*</strong></h2>
                                <ion-select interface="popover" icon="add" v-if="restaurantType.length > 0"
                                style=""
                                :ok-text="$t('backoffice.form.messages.buttons.ok')"
                                :cancel-text="$t('backoffice.form.messages.buttons.dismiss')"                                    
                                :placeholder="$t('frontend.createNew.select')"
                                :value="restaurantTypeSelected"
                                @ionChange="restaurantTypeSelected=$event.target.value"                          
                                >
                                    <ion-select-option v-for="(res, index) in restaurantType"                    
                                    :key="index" 
                                    :value="index" >{{res.Type}}
                                    </ion-select-option>  
                                </ion-select>
                                <div v-if="restaurantTypeSelected !==-1" style="display: flex;">
                                    <div  v-if="restaurantType[restaurantTypeSelected].Datas.length > 0" @click="showRestaurantType()">
                                        <span  class="iconify" data-icon="ic:baseline-remove-red-eye" data-inline="false"></span>
                                    </div>
                                </div>
                                        
                            </div>  
                        </ion-card-content>
                        <ion-row>
                             <ion-col size="12" size-md="6" size-lg="4"   >
                                <ion-label position="floating">{{$t('frontend.createNew.restaurantName')}}<strong style="color: red">*</strong></ion-label>                                          
                                <ion-input type="text" required=true  autocomplete="organization"
                                    :value="restaurantName" @input="restaurantName = $event.target.value"
                                ></ion-input>
                            </ion-col>
                            <ion-col size="12" size-md="6" size-lg="4" >
                                <ion-label position="floating">{{$t('frontend.createNew.restaurantAddres')}}<strong style="color: red">*</strong></ion-label>                                          
                                <ion-input type="text" required=true autocomplete="address-line1"
                                    :value="restaurantAddres" @input="restaurantAddres = $event.target.value"
                                ></ion-input>
                            </ion-col>
                            <ion-col size="12" size-md="6" size-lg="4" >
                                <ion-label position="floating">{{$t('frontend.createNew.restaurantZipcode')}} <strong style="color: red">*</strong></ion-label>                                          
                                <ion-input type="text" required=true autocomplete="postal-code"
                                    :value="restaurantZipcode" @change="restaurantZipcode=ValidateZipcode($event.target.value, 'restaurant')"
                                ></ion-input>
                            </ion-col>
                            <ion-col size="12" size-md="6" size-lg="4" >
                                <ion-label position="floating">{{$t('frontend.home.city')}} <strong style="color: red">*</strong></ion-label>                                          
                                <ion-input type="text" readonly=true 
                                    :value="restaurantCity" 
                                ></ion-input>
                            </ion-col>
                                <ion-col size="12" size-md="6" size-lg="4" >
                                <ion-label position="floating">{{$t('frontend.home.state')}} <strong style="color: red">*</strong></ion-label>                                          
                                <ion-input type="text" readonly=true
                                    :value="restaurantState" 
                                ></ion-input>
                            </ion-col>
                            <ion-col size="12" size-md="6" size-lg="4" >
                                <ion-label position="floating">{{$t('frontend.createNew.restaurantPhone')}}<strong style="color: red">*</strong></ion-label>                                          
                                <ion-input type="text" required=true   autocomplete="tel"                              
                                    :value="restaurantPhone" @input="restaurantPhone = $event.target.value"
                                    @change=" validatePhone($event.target.value, 'rest')"
                                ></ion-input>
                            </ion-col>
                            <ion-col size="12" size-md="6" size-lg="4"  >
                                <ion-label position="floating">{{$t('frontend.createNew.restaurantEmail')}}<strong style="color: red">*</strong></ion-label>                                          
                                <ion-input type="text" required=true autocomplete="email"                                  
                                    :value="restaurantEmail" @input="restaurantEmail = $event.target.value"  @change="validateEmail($event.target.value, 'rest')"
                                ></ion-input>
                            </ion-col>
                            <ion-col size="12" size-md="6" size-lg="4" >
                                <ion-label position="floating">{{$t('frontend.createNew.restaurantWeb')}}</ion-label>                                          
                                <ion-input type="text" required=true                                 
                                    :value="restaurantWeb" @input="restaurantWeb = $event.target.value"
                                ></ion-input>
                            </ion-col>
                            <ion-col size="12" size-md="6" size-lg="4" >
                                <ion-label position="floating">{{$t('frontend.createNew.restaurantFax')}}</ion-label>                                          
                                <ion-input type="text" required=true                                 
                                    :value="restaurantFax" @input="restaurantFax = $event.target.value"
                                ></ion-input>
                            </ion-col>
                        </ion-row>
                    </ion-card>    

                    <ion-card >
                            <ion-card-title style="text-align: left;padding: 15px;">
                            {{$t('frontend.createNew.dataMercahnt')}}
                        </ion-card-title>                            
                        
                        <ion-row :key="merchantKey">
                            <ion-col size="12" size-md="6" size-lg="4" >
                            <ion-label position="floating">{{$t('frontend.createNew.merchantName')}}<strong style="color: red">*</strong></ion-label>                                          
                            <ion-input type="text" required=true   autocomplete="name"                                  
                                :value="merchantName" @input="merchantName = $event.target.value"
                            ></ion-input>
                            </ion-col>
                            <ion-col size="12" size-md="6" size-lg="4" >
                                <ion-label position="floating">{{$t('frontend.createNew.merchantLastName')}}<strong style="color: red">*</strong></ion-label>                                          
                                <ion-input type="text" required=true  autocomplete="family-name"                                  
                                    :value="merchantLastName" @input="merchantLastName = $event.target.value"
                                ></ion-input>
                            </ion-col>
                            <ion-col size="12" size-md="6" size-lg="4" >
                                <ion-label position="floating">{{$t('frontend.createNew.merchantAddres')}}<strong style="color: red">*</strong></ion-label>                                          
                                <ion-input type="text" required=true autocomplete="address-line1"
                                    :value="merchantAddres" @input="merchantAddres = $event.target.value"
                                ></ion-input>
                            </ion-col>
                            <ion-col size="12" size-md="6" size-lg="4">
                                <ion-label position="floating">{{$t('frontend.createNew.merchantZipcode')}}<strong style="color: red">*</strong></ion-label>                                          
                                <ion-input type="text" required=true autocomplete="postal-code"
                                    :value="merchantZipcode" @change="merchantZipcode=ValidateZipcode($event.target.value, 'merchant')"
                                ></ion-input>
                            </ion-col>
                            <ion-col size="12" size-md="6" size-lg="4" >
                                <ion-label position="floating">{{$t('frontend.home.city')}} <strong style="color: red">*</strong></ion-label>                                          
                                <ion-input type="text" readonly=true 
                                    :value="merchantCity" 
                                ></ion-input>
                            </ion-col>
                            <ion-col size="12" size-md="6" size-lg="4">
                                <ion-label position="floating">{{$t('frontend.home.state')}} <strong style="color: red">*</strong></ion-label>                                          
                                <ion-input type="text" readonly=true
                                    :value="merchantState" 
                                ></ion-input>
                            </ion-col>
                            <ion-col size="12" size-md="6" size-lg="4" >
                                <ion-label position="floating">{{$t('frontend.createNew.merchantPhone')}}<strong style="color: red">*</strong></ion-label>                                          
                                <ion-input type="text" required=true   autocomplete="tel"                              
                                    :value="merchantPhone" @input="merchantPhone = $event.target.value"
                                    @change=" validatePhone($event.target.value, 'merchant')"
                                ></ion-input>
                            </ion-col>
                            <ion-col size="12" size-md="6" size-lg="4" >
                                <ion-label position="floating">{{$t('frontend.createNew.merchantEmail')}}<strong style="color: red">*</strong></ion-label>                                          
                                <ion-input type="text" required=true    autocomplete="email"                              
                                    :value="merchantEmail" @input="merchantEmail = $event.target.value"  @change="validateEmail($event.target.value, 'merchant')"
                                ></ion-input>
                            </ion-col>
                            <ion-col size="12" size-md="6" size-lg="4" >
                                <ion-label position="floating">{{$t('frontend.createNew.merchantClerk')}}<strong style="color: red">*</strong></ion-label>                                          
                                <ion-input type="number" required=true                                 
                                    :value="merchantClerk" @input="merchantClerk = $event.target.value"  @change="validateClerk($event.target.value)"
                                ></ion-input>
                            </ion-col>

                        </ion-row>
                    </ion-card> 

                </div> 
        </div>
        <ion-input @ionChange="paymentRes=$event.target.value" id="newRestaurantPayment" ref="abc" style="display:none"></ion-input>

         <div style="margin: 10px;display: flex;justify-content: center;align-items: center">
             <ion-checkbox 
             :checked="termAndCondition" 
             @ionChange="termAndCondition=$event.target.checked" 
             style="margin: 0 10px;"></ion-checkbox>
            <a @click="showTerms()">{{$t('frontend.createNew.temrsAndCondition')}}</a>                                          
        </div>

        

            <ion-button 
                :disabled="spinner? true: false" 
                @click="goInit()">
                {{$t('frontend.home.cancel')}}
            </ion-button>
             <ion-button 
                 :disabled="spinner || !isValidForm()? true: false"
                @click="showTrialDate()">
                 {{$t('frontend.createNew.trialDate')}}
                <ion-spinner v-if="spinnerDate"></ion-spinner>
               
            </ion-button>
           <ion-button 
                :disabled="spinner || !isValidForm()? true: false"                
                @click="paySpinner = true"
                :api_access_id="api_access_id"
                :location_id="location_id"
                version_number= "2.0"                        
                save_token= "true"
                method="schedule"
                :total_amount="getFinalAmount().toString()"
                schedule_frequency="monthly"              
                schedule_continuous="true"
                :utc_time="utc"                      
                :signature="getSingleHash()" 
                order_number= "A030"
                callback="oncallback" 
                collect_shipping_address="false"
                :billing_company_name="restaurantName"
                :billing_name="merchantName +' ' +merchantLastName"
                :name_last="merchantLastName"  
            >
           {{$t('frontend.payment.splitToPay')}}
            <ion-spinner name="crescent" v-if="paySpinner"> </ion-spinner>
        </ion-button>
           

    </div>

    
</template>


  
<script>




import LibCodes from 'zipcodes'
import { parsePhoneNumber } from 'libphonenumber-js'
import { Api } from '../../backoffice/api/api.js';
import md5 from "crypto-js/hmac-md5";
import RestaurantTypeShow from './RestaurantTypeShow.vue'
import TermAndConditions from './TermsAndCondition.vue'
import Language from '../../backoffice/views/Locale.vue'
import Moment from 'moment'

export default {
    name: 'NewRestaurant',
    created: async function(){
        await this.getUTC(); 
        setInterval(() => {
               this.getUTC(); 
            }, 480000);
        await this.fetchRestaurantType();     
    }, 
    components:{
        RestaurantTypeShow,
         TermAndConditions,
         Language
    },
    props: {  
       parent: {type: Object, default: () => {} },
     },
     watch:{
         paymentRes(value) {
            this.paySpinner = false;
            const response = JSON.parse(value);
            if(response.event === 'success'){
                this.makePayment(response.trace_number, null);
            }
            if(response.event === 'failure'){
                this.openMs(response.response_description, 'danger');
            }


         }
     },
    data() {
        return {  
        //    parent: {} ,
           appLoginId: 'hfIU9scKMj',
           amount: 39.00,
           amountReservation: 20.00,
           spinner: false,
           restaurantName: '',
           restaurantAddres: '',
           restaurantPhone: '',
           restaurantZipcode: '',
           restaurantEmail: '',
           restaurantWeb: '',
           restaurantFax: '',
           restaurantCity: '',
           restaurantState: '',
           merchantName: '',
           merchantLastName: '',
           merchantAddres: '',
           merchantZipcode: '',
           merchantPhone: '',
           merchantEmail: '',
           merchantClerk: '',
           key: 0,
           restaurantKey:1,
           merchantKey: 2,
           merchantCity: '',
           merchantState: '',
           utc: '',
        //    api_access_id: '11d6e10cec7e239aa76e7f456b8e9e5d', // Prod',
        //     api_secure_key: '08ad49c5c0c4fa9e33d98103ac77ca7b', //  Prod,
        //     location_id: '186209', // Prod,
            api_access_id:  '442f701ee5d25cf1b4ab6592d0b670a5', // Sandbox,          
            api_secure_key: 'c477ce46b6fcbad91bb30ebd5f69488f', // SandBobx           
            location_id: "277674", // Sandbox,
           paymentRes: '',
           paySpinner: false,
           restaurantType: [],
           restaurantTypeSelected: -1,
           termAndCondition: false,
           spinnerDate: false,
           restaurantBussines: true,
           serviceBussines: false,
           businessType: '',
           businessTypeList: ['Hospitality','Reservations','Service','Entertainment','Retail']
        }
    },  
    methods:{
        goInit(){
            this.$parent.newRestaurant = false; 
            this.$parent.showNew = false; 
            this.$parent.getAllRestaurant();  
            this.$router.push({name: 'AppVue' });
        },
        isValidForm(){
            if(this.restaurantName === '' || this.restaurantAddres ==='' || this.restaurantPhone === '' ||
                this.restaurantZipcode === '' || this.restaurantEmail === '' || this.merchantName === '' ||
                this.merchantLastName === '' || this.merchantAddres === '' || this.merchantPhone === '' || 
                this.merchantEmail === '' || this.merchantClerk === '' || !this.termAndCondition || this.restaurantTypeSelected ===-1)
                return false;
            return true;
        },
        async showTrialDate(){
          try {
            this.spinnerDate = true;
            const date = await Api.getServerDate();
            this.spinnerDate = false;
            const dateIn = Moment(date.data)
            const dateOut = Moment(date.data).add(14, 'days')
            const dateInSave = dateIn.toISOString();
            const dateOutSave = dateOut.toISOString();         
            return  this.$ionic.alertController
            .create({
                cssClass: 'my-custom-class',
                header: this.$t('frontend.createNew.trialMss'),
                message: dateIn.format('LL LT') + ' - ' +  dateOut.format('LL LT'),
                buttons: [                   
                    {
                        text: this.$t('frontend.home.cancel'),
                        handler: () => {                                                            
                        },
                    },
                    {
                        text: this.$t('frontend.home.acept'),
                        handler: () => {
                            const tryNew = {                           
                                isForTest : true,
                                dateTestFrom : dateInSave,
                                dateTestTo : dateOutSave,
                            }                        
                        return this.makePayment(null, tryNew); 
                        },
                    },
                ],
            })
            .then(a => a.present())
                  
  

          } catch (error) {
              error;
              this.spinnerDate = false;
              
          }
        },

        async makePayment(traceNumber, tryNew){
           
            if(!this.isValidForm())
              return this.openMs(this.$t('frontend.home.errorRequired'), 'danger');
            this.spinner = true;

            const res = {
                "Name": this.restaurantName,
                "Address": this.restaurantAddres,
                "Phone": this.restaurantPhone,
                "Email": this.restaurantEmail,               
                "ZipCode": this.restaurantZipcode,    
                "BusinessType": this.businessType,         
                "UserSettings": {
                    "FirstName": this.merchantName,
                    "LastName": this.merchantLastName,
                    "Address": this.merchantAddres,
                    "Phone": this.merchantPhone,
                    "Email": this.merchantEmail,
                    "ServerId": this.merchantClerk
                    }
                }

            if(this.restaurantBussines) res.RestaurantBussines = true;
            if(this.serviceBussines) res.ServiceBussines = true;
            if(traceNumber) res.TraceNumber = traceNumber;
            if(this.restaurantFax !== '') res.Fax = this.restaurantFax;
            if(this.restaurantWeb !== '') res.Web = this.restaurantWeb;
            if(this.restaurantTypeSelected !==-1)
                res.defaultData = this.restaurantType[this.restaurantTypeSelected]._id;
            if(tryNew){
              res.isForTest = tryNew.isForTest;
              res.dateTestFrom = tryNew.dateTestFrom
              res.dateTestTo = tryNew.dateTestTo
            }

            // AQUI ENLAZAR EL PAGO CON FORTE Y AL OBTENER LA RESPUESTA QUE SE GUARDE EL RESTAURANTE.

           try {
                await Api.newRestaurant(res);
            this.spinner = false;
            this.openMs(this.$t('frontend.createNew.createdMessage'), 'success'); 
            this.$parent.newRestaurant = false; 
            this.$parent.createdRestaurantEmail = this.merchantEmail;
            this.$parent.newRestaurantKey ++;
            this.$parent.openEnd();
            return this.$router.push({name: 'AppVue' });
               
           } catch (error) {
               error;
               this.spinner = false;
               
           }
        },

        validateEmail(value, model){
         let emailRegex = /^[-\w.%+]{1,64}@(?:[A-Z0-9-]{1,63}\.){1,125}[A-Z]{2,63}$/i;
            if (emailRegex.test(value) == false){
                if(model === 'merchant'){
                     this.merchantEmail = ''; 
                     this.merchantKey++
                }
                else{ 
                    this.restaurantEmail = '';
                    this.restaurantKey ++
                }
              
                return this.openMs(this.$t('frontend.home.notValidEmail'), 'danger');
            }               
        },

        ValidateZipcode(event, merchant){
            
         
        var hills = LibCodes.lookup(event);   
        if(!hills){ 
            if(merchant==='merchant') {
                this.merchantZipcode = ''   
                this.merchantCity = ''
                this.merchantState = ''
                this.merchantKey ++;
             }   
            else {
                this.restaurantZipcode = '';  
                this.restaurantCity =''  
                this.restaurantState = ''
                 this.restaurantKey ++;
            }  
            this.openMs(this.$t('frontend.home.zipCodeNotValid'), 'danger') ;
            return '';     
        }     
        else{
            if(merchant==='merchant') {
                this.merchantZipcode = event 
                 this.merchantCity = hills.city
                this.merchantState = hills.state;
                this.merchantKey ++;
            }
            else {
                this.restaurantZipcode = event;  
                this.restaurantCity = hills.city
                this.restaurantState = hills.state;     
                this.restaurantKey ++;
            }
            return event;
        }      
        },  

        validatePhone(value, model){     
            if (!value) return true;        
            try {
                const number = parsePhoneNumber(`+1${value}`);
        
                if (!number.isValid())  return false;         
                    
                if(model === 'merchant')   this.merchantPhone = parsePhoneNumber(`+1${value}`).formatNational();
                else   this.restaurantPhone = parsePhoneNumber(`+1${value}`).formatNational();
                return true;
            } 
            catch (err) {     
                return false;
            } 
        },    

        validateClerk(value){ 
            this.merchantKey ++;
            if(value <= 0) {
                this.merchantClerk = '';               
                return this.openMs(this.$t('frontend.createNew.clerkNotValid'), 'danger');
            }
            if(value.toString().length > 5){
                this.merchantClerk = '';                
                return this.openMs(this.$t('frontend.createNew.clerkToLong'), 'danger');
            }
        },

        async openMs(mss, color) {
            return this.$ionic.toastController      
            .create({
                header: '',
                message: mss,           
                position: 'middle',
                color: color,
                buttons: [
                {
                text: 'Done',
                role: 'cancel',
                handler: () => {
                }
                }
            ]
                })
            .then(a => a.present())
        },

        getSingleHash(){            
            var finalAmount = this.getFinalAmount();
            if(this.utc !== ''){
                let md5String = `${this.api_access_id}|schedule|2.0|${finalAmount}|${this.utc}|A030||`
                const signature = md5(md5String, this.api_secure_key); 
                return signature
            }
            return ''
        },

        getFinalAmount(){                     
            var finalAmount = this.amount;
            if(this.serviceBussines) finalAmount = this.amountReservation;          
            return finalAmount;
        },


       
        async getUTC(){
            try {                             
                const response = await Api.getUtc();
                let resp = response.data.replace('(', '');
                resp = resp.replace(')', '');
                resp = resp.replace(';', '');
                this.utc = resp
            } catch (error) {
              error
            }
        }, 

        fetchRestaurantType: async function(){
           
            try {
                const response = await Api.fetchAll('restauranttype')
                this.restaurantType = response.data;        
                
                const index = this.restaurantType.findIndex( r => r.Type === 'Blank Restaurant')  
                if(index !== -1){
                    this.restaurantTypeSelected = index;
                }
                
            } catch (error) {
                error;
                
            }   
        },

        showRestaurantType () {
            this.$modal.show('restaurant-type-modal');
        },
        
        hideRestaurantType () {
         this.$modal.hide('restaurant-type-modal');
        },

        showTerms() {
         this.$modal.show('terms-and-condition');
        },

        hideTerms() {
         this.$modal.hide('terms-and-condition');
        },



      
    },

    
        
}   
</script>



<style >

.fortebtn {
  background-color: transparent !important;
    border: none !important;
    padding: 0 !important;
}
  .card-categories{
      float: left;
      margin: 0;
      /* height: 150px; */
      padding: 10px 2px;
    }

</style>