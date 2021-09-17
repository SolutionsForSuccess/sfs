
<template>

    <div id="order" class="screen">
        <ion-backdrop v-if="isBackdrop"></ion-backdrop>
    
        <ion-header>
            <ion-toolbar>
                <ion-buttons slot="start">
                <ion-back-button default-href="/controlPanel" @click="goToBack()"></ion-back-button>
                </ion-buttons>
                <ion-label style="padding: 20px 100px;">
                <h1>{{$t('frontend.order.orderDetail')}}</h1>           
                </ion-label>
            </ion-toolbar>
        </ion-header>
        <br/>

        <ion-loading
            v-if="spinner"
            cssClass="my-custom-class"
            :message="$t('frontend.tooltips.loadRestaurant')"
        ></ion-loading>

        
        <div v-if="order != null">

              <p v-if="order.StaffName"> <ion-label class="ion-text-wrap" >
                <h2  style="width: 100%;float: left;font-size: 16px;
                text-align: left; padding-left: 20px;color: black;margin: 5px !important;">
                {{$t('frontend.orderType.worker')}}:<strong>  {{order.StaffName}} </strong> </h2>
            </ion-label></p>   
                
            <p v-if="this.order.CustomerName"> <ion-label class="ion-text-wrap" >
                <h2  style="width: 100%;float: left;font-size: 16px;
                text-align: left; padding-left: 20px;color: black;margin: 5px !important;">
                {{$t('frontend.order.client')}}:<strong>  {{this.order.CustomerName}} </strong> </h2>
            </ion-label></p>
            
            <p v-if="order.OrderForCatering && order.State !== 7"><ion-label class="ion-text-wrap">
                <h2  style="width: 100%;float: left;font-size: 16px;
                text-align: left; padding-left: 20px;color: black;margin: 5px !important;">
                    {{$t('frontend.order.date')}}: <strong>  {{ dateEstimateToPick }} : {{ hourEstimateToPick }}</strong>  </h2>
            </ion-label></p>

            <p v-if="order.OrderForCatering && order.State === 7"><ion-label class="ion-text-wrap">
                <h2  style="width: 100%;float: left;font-size: 16px;
                text-align: left; padding-left: 20px;color: black;margin: 5px !important;">
                    {{$t('frontend.order.dateToPickEstimated')}}: <strong>  {{ dateEstimateToPick }} </strong>  </h2>
            </ion-label></p>

            <p v-if="order.OrderForCatering && order.State === 7"><ion-label class="ion-text-wrap">
                <h2  style="width: 100%;float: left;font-size: 16px;
                text-align: left; padding-left: 20px;color: black;margin: 5px !important;">
                    {{$t('frontend.order.hourToPickEstimated')}}: <strong> {{ hourEstimateToPick }}</strong>  </h2>
            </ion-label></p>

            <p v-if="!order.OrderForCatering && order.OrderType !=='PickUp'"><ion-label class="ion-text-wrap">
                <h2  style="width: 100%;float: left;font-size: 16px;
                text-align: left; padding-left: 20px;color: black;margin: 5px !important;">
                    {{$t('frontend.order.date')}}: <strong>  {{ date }}</strong>  </h2>
            </ion-label></p>

            <p v-if="!order.OrderForCatering"><ion-label class="ion-text-wrap">
                <h2  style="width: 100%;float: left;font-size: 16px;
                text-align: left; padding-left: 20px;color: black;margin: 5px !important;">
                    {{ allTypeOrder[order.OrderType] }}: <strong>  {{ orderInfo}} </strong>  </h2>
            </ion-label></p>

           
            

            <div v-if="order.OrderType ==='Curbside'" style="margin: 25px; 0px" :key="keyCurbside">
                <ion-item-divider />
                
                <ion-item class="ion-text-wrap">
                    <h2 class="titles-order" style="float: left;">{{$t('frontend.home.curbsideDetail')}}</h2>
                    <ion-button 
                    v-if="order.State !=5 && !order.CarArrived"
                    fill="outline"  
                    style="float: left; margin-right: 10px;" 
                    @click="updateCurbsideOrder()" 
                    v-tooltip="$t('frontend.tooltips.editTicket')"> 
                        <ion-spinner v-if="spinnerUpdateCurbside" name="lines"  ></ion-spinner>
                        <span class="iconify" v-if="!spinnerUpdateCurbside" data-icon="ant-design:edit-filled" data-inline="false" style="width: 20px;height: 20px; margin: 0;"></span>                                    
                    </ion-button>                               
                </ion-item>                    
                    <ion-item>
                    <ion-label position="floating">{{$t('frontend.orderType.licencePlate') }}<strong style="color: red">*</strong></ion-label>
                    <ion-input 
                    :readonly="order.State ===5 || order.CarArrived? true : false"
                    :value="order.LicencePlate" 
                    @input="licencePlate = $event.target.value"></ion-input>
                </ion-item>
                <ion-item>
                    <ion-label position="floating">{{$t('frontend.orderType.vehicleModel') }}<strong style="color: red">*</strong></ion-label>
                    <ion-input
                    :readonly="order.State ===5 || order.CarArrived? true : false"
                    :value="order.VehicleModel"
                    @input="vehicleModel = $event.target.value"></ion-input>
                </ion-item>
                <ion-item>
                    <ion-label position="floating">{{$t('frontend.orderType.vehicleColor') }}<strong style="color: red">*</strong></ion-label>
                    <ion-input 
                    :readonly="order.State ===5 || order.CarArrived? true : false"
                    :value="order.VehicleColor" 
                    @input="vehicleColor = $event.target.value"></ion-input>
                </ion-item>
                    <ion-item v-if="order.State !==5 && !order.CarArrived" :key="keyCarArrived">
                    <ion-label style="display: contents;">{{$t('frontend.tooltips.getToRestaurant') }}</ion-label>
                        <ion-button fill="outline"  style="float: left; margin: 15px;" @click="carArrived()" > 
                        <ion-spinner v-if="spinnerCarArrived" name="lines"  ></ion-spinner>
                        <span class="iconify" v-if="!spinnerCarArrived" data-icon="clarity:car-solid" data-inline="false" style="width: 20px;height: 20px; margin: 0;"></span>
                    </ion-button>
                </ion-item>
                <ion-item v-if="order.CarArrived && !spinnerCarArrived && order.State !==5" :key="keyCarArrived+'1'">
                    <ion-label style="display: contents;">{{$t('frontend.tooltips.carInRestaurant') }}</ion-label>     
                    <span class="iconify" data-icon="clarity:car-solid" data-inline="false" style="width: 20px;height: 20px; float: left; margin: 15px;color: #48bc76;"></span>                               
                </ion-item>
                
            </div>

                                                                                        
            <ion-item-divider v-else style="margin-bottom: 15px;"/>

            <div v-if="order.OrderForCatering">

                <ion-label class="ion-text-wrap"  v-if="order.EventName">
                    <h2  style="width: 100%;float: left;font-size: 16px;
                    text-align: left; padding-left: 20px;color: black;margin: 5px !important;">
                    {{$t('frontend.order.eventName')}}: <strong> {{order.EventName}} </strong> </h2>
                    </ion-label>
                    <ion-label class="ion-text-wrap"  v-if="order.CateringEvent">
                    <h2  style="width: 100%;float: left;font-size: 16px;
                    text-align: left; padding-left: 20px;color: black;margin: 5px !important;">
                    {{$t('frontend.home.eventType')}}: <strong> {{order.CateringEvent}} </strong> </h2>
                    </ion-label>
                    <ion-label class="ion-text-wrap"  v-if="order.NumberOfGuess">
                    <h2  style="width: 100%;float: left;font-size: 16px;
                    text-align: left; padding-left: 20px;color: black;margin: 5px !important;">
                    {{$t('frontend.order.guessNumber')}}: <strong> {{order.NumberOfGuess}} </strong> </h2>
                    </ion-label>
                    <ion-label class="ion-text-wrap"  v-if="order.EventDate">
                    <h2  style="width: 100%;float: left;font-size: 16px;
                    text-align: left; padding-left: 20px;color: black;margin: 5px !important;">
                    {{$t('frontend.order.eventDate')}}: <strong> {{order.EventDate}} </strong> </h2>
                    </ion-label>
                    <ion-label class="ion-text-wrap"  v-if="order.EventTimeStart">
                    <h2  style="width: 100%;float: left;font-size: 16px;
                    text-align: left; padding-left: 20px;color: black;margin: 5px !important;">
                    {{$t('frontend.order.eventStartHour')}}: <strong> {{order.EventTimeStart}} </strong> </h2>
                    </ion-label>
                    <ion-label class="ion-text-wrap"  v-if="order.EventTimeEnd">
                    <h2  style="width: 100%;float: left;font-size: 16px;
                    text-align: left; padding-left: 20px;color: black;margin: 5px !important;">
                    {{$t('frontend.order.eventEndHour')}}: <strong> {{order.EventTimeEnd}} </strong> </h2>
                    </ion-label>
                <ion-item-divider style="margin-bottom: 15px;"/>
            </div>


        <ion-item  v-if="order.Cooker">
            <ion-label class="ion-text-wrap" >
                <h2  style="width: 100%;float: left;font-size: 16px;
                text-align: left; padding-left: 20px;color: black;margin: 5px !important;">
                {{$t('frontend.order.cooker')}}: <strong> {{getWorker(order.Cooker)}} </strong> </h2>
            </ion-label>
          </ion-item>

        <ion-item>
            <ion-label class="ion-text-wrap">
                <h2  style="width: 100%;float: left;font-size: 16px;
                text-align: left; padding-left: 20px;color: black;margin: 5px !important;">
                {{$t('backoffice.form.titles.state')}}: <strong> {{getOrderState(order.State)}} </strong> </h2>
            </ion-label>
        </ion-item>

        <ion-item v-if="order.Driver">
            <ion-label class="ion-text-wrap">
                <h2  style="width: 100%;float: left;font-size: 16px;
                text-align: left; padding-left: 20px;color: black;margin: 5px !important;">
                {{$t('backoffice.form.fields.driver')}}: <strong> {{getWorker(order.Driver)}} </strong> </h2>
            </ion-label>
        </ion-item>
           
        
       
           
            <h3 style="text-align: left">{{$t('backoffice.form.titles.products')}}:</h3>
                

            <ion-item-sliding v-for="(product, index2) in order.Products" v-bind:key="index2">

                <ion-item>
                    <div class="ion-text-wrap menu-col-4" >
                        <p> <strong>{{ product.Name }} <span v-if="product.VariantSelected"> {{ product.VariantSelected.name }}</span></strong></p>
                        <p v-if="hasSomeNote(product)" style="background: #f1f1004d;">{{getIngredientNote(product)}} <br> {{product.Note}}</p>
                    </div>
                    <ion-label class="ion-text-wrap menu-col-2">                        
                        <h3>{{ product.Cant }}</h3>                       
                    </ion-label>
                    <ion-label class="ion-text-wrap menu-col-3" >
                        <h3> {{ getFormatPrice(product.Price) }}</h3>
                    </ion-label>
                    <ion-label class="ion-text-wrap menu-col-3" >
                        <h3>{{ getFormatPrice(product.Price * product.Cant) }}</h3>
                            <div v-if="product.State === 1" style="position: absolute;right: 0;top: 30%;">
                            <span class="iconify" data-icon="websymbol:ok" data-inline="false" style="color: green;margin:0;width: 20px; height: 20px;" ></span>
                        </div> 
                    </ion-label>
                </ion-item>

                    <ion-list-header v-if="product.Aggregates.length > 0" style="padding: 20px 35px;">
                    {{$t('frontend.home.aggregateFree')}}: {{product.CantAggr=product.AggregatesCant * product.Cant}}
                </ion-list-header>

                <ion-item v-for="(agg, index1) in product.Aggregates" :key="index1"  >
                                
                    <div class="menu-col-4" style="    text-align: left;padding-left: 30px;">
                        <p>{{agg.Name}} <br> </p>  
                    </div>                                                             
                    <div class="menu-col-2">  
                        <ion-label>{{agg.Cant}} </ion-label>  
                    </div> 
                        <div class="menu-col-3">  
                        <ion-label>{{getFormatPrice(agg.SalePrice)}}</ion-label>  
                    </div>                                      
                        <div class="menu-col-3">  
                        <ion-label>{{getFormatPrice(agg.AllTotal) }} </ion-label>  
                    </div>                                   
                </ion-item>
                
            </ion-item-sliding>     

       
        <ion-grid v-if="haveServices()">
            <ion-row class="left">
                <ion-col>
                    <div><span class="title">{{$t('backoffice.form.titles.services')}}:</span></div>
                </ion-col>
            </ion-row>
            <div v-for="product in order.Products" :key="product._id">              
                  <ion-item v-if="product.isService == true">
                    <div class="ion-text-wrap menu-col-4" >
                        <p> <strong>{{ product.Name }} <span v-if="product.VariantSelected"> {{ product.VariantSelected.name }}</span></strong></p>
                        <p v-if="hasSomeNote(product)" style="background: #f1f1004d;">{{getIngredientNote(product)}} <br> {{product.Note}}</p>
                    </div>
                    <ion-label class="ion-text-wrap menu-col-2">                        
                        <h3>{{ product.Cant }}</h3>                       
                    </ion-label>
                    <ion-label class="ion-text-wrap menu-col-3" >
                        <h3> {{ getFormatPrice(product.Price) }}</h3>
                    </ion-label>
                    <ion-label class="ion-text-wrap menu-col-3" >
                        <h3>{{ getFormatPrice(product.Price * product.Cant) }}</h3>
                            <div v-if="product.State === 1" style="position: absolute;right: 0;top: 30%;">
                            <span class="iconify" data-icon="websymbol:ok" data-inline="false" style="color: green;margin:0;width: 20px; height: 20px;" ></span>
                        </div> 
                    </ion-label>
                </ion-item>
            </div>
        </ion-grid>

        <ion-item-sliding  v-if="order.OtherCharges">
            <ion-label class="ion-text-wrap" v-if="order.OtherCharges.length >0">
                <h2 style="text-align: left">{{$t('frontend.order.otherCharges')}}</h2> 
            </ion-label>
            <ion-item-sliding  v-for="charge in order.OtherCharges" v-bind:key="charge.Id">
                <ion-item>
                    <div class="menu-col-4">
                        <p>{{ charge.Name }} </p>
                    </div>
                    <ion-label  class="menu-col-2"> </ion-label>
                    <ion-label  class="menu-col-3"> </ion-label>
                    <ion-label  class="menu-col-3" >
                        <h3> {{ getFormatPrice(charge.Price) }} </h3>
                    </ion-label>
                    
                </ion-item>
            </ion-item-sliding>
        </ion-item-sliding>


        <div v-if="order.Deadline && order.State != 6">
            <ion-grid v-if="order.Deadline.length > 0 ">
                <ion-row class="left">
                    <ion-col>
                        <div><span class="title">{{$t('backoffice.form.fields.deadlines')}}:</span></div>
                    </ion-col>
                </ion-row>
                <ion-row class="left">
                    <ion-col size="4">
                        {{$t('backoffice.form.fields.percent')}}
                    </ion-col>
                    <ion-col size="4">
                        {{$t('backoffice.form.fields.date')}}
                    </ion-col>
                    <ion-col size="4">
                        {{$t('backoffice.form.fields.states')}}
                    </ion-col>
                </ion-row>
                <ion-row v-for="deadLine in order.Deadline" :key="order.Deadline.indexOf(deadLine)" class="left">
                    <ion-col size="4">
                        <div>{{deadLine.Percent}}%</div>
                    </ion-col>
                    <ion-col size="4">
                        <div>{{getFormatedDate(deadLine.Date)}}</div>
                    </ion-col>
                    <ion-col size="4" v-if="deadLine.State == 1">
                        <div class="end">{{$t('backoffice.form.titles.payed')}} {{ getFormateNumber(deadLine.AmountPayed)}}</div>
                    </ion-col>
                    <ion-col v-else>
                        <div class="end"><ion-button @click="payDeadLine(order.Deadline.indexOf(deadLine))">{{$t('frontend.order.pay')}}</ion-button></div>
                    </ion-col>
                </ion-row>
            </ion-grid>
        </div>
        <br/>

        <ion-item-slidin style="border-top: 1px solid grey;" >

            <ion-item style="font-size: 16px;font-weight: bold;">                         
                <ion-label  class="menu-col-9"  ><p  style="text-align:right">{{$t('frontend.order.subtotal')}} </p></ion-label>
                <ion-label  class="menu-col-3 padding-menu"    style="text-align:right">{{getFormatPrice(order.SubTotal)}}</ion-label>                    
            </ion-item>                               

            <ion-item style="font-size: 16px;font-weight: bold;" v-for="(tax, index) in order.AllTaxes" :key="index"> 
                
                <ion-label class="menu-col-9" ><p class="menu-bold-title" style="text-align:right">{{tax.Name}} ({{tax.Percentage}} %)</p></ion-label>
                <ion-label class="menu-col-3 padding-menu"  style="text-align:right">{{ getFormatPrice(tax.Percentage * order.SubTotal / 100)}} </ion-label>                    
            </ion-item>

            <ion-item v-if="order.OrderType =='Delivery' && order.Shipping" style="font-size: 16px;font-weight: bold;"> 
                
                <ion-label class="menu-col-9"> <p class="menu-bold-title" style="text-align:right">{{$t('frontend.order.deliver')}}  </p></ion-label>
                <ion-label class="menu-col-3 padding-menu"  style="text-align:right">{{getFormatPrice(order.Shipping)}}</ion-label>                    
            </ion-item>

            <ion-item style="font-size: 16px;font-weight: bold;" v-if="order.Tip"> 
                
                <ion-label class="menu-col-9" > <p class="menu-bold-title" style="text-align:right">{{$t('frontend.order.tip')}} {{order.Tip }}%</p></ion-label>
                <ion-label class="menu-col-3 padding-menu"  style="text-align:right" >{{ getFormatPrice(order.Tip * order.SubTotal / 100) }} </ion-label>                    
            </ion-item>

            <ion-item v-if="order.Discount" style="font-size: 16px;font-weight: bold;"> 
                <ion-label  size="4"></ion-label>
                <ion-label class="menu-col-9" ><p  style="text-align:right">{{$t('frontend.reservation.discount')}} </p></ion-label>
                <ion-label class="menu-col-3 padding-menu"  style="text-align:right"> {{getFormatPrice(order.Discount) }}</ion-label>                    
            </ion-item>
            
            <ion-item style="    color: red;    font-size: 16px;    font-weight: bold;    text-transform: uppercase;"> 
                
                <ion-label class="menu-col-9" ><p class="menu-bold-title" style="text-align:right">{{$t('frontend.order.total')}}  </p></ion-label>
                <ion-label class="menu-col-3 bold-title" style="text-align:right">{{getFormatPrice(order.Total)}}</ion-label>                    
            </ion-item>

            <ion-item  v-if="order.QuotationPayment" style="color: #399922;font-size: 16px;font-weight: bold;text-transform: uppercase;"> 
                <ion-label   size="4"> </ion-label>
                <ion-label class="menu-col-9" ><p class="menu-bold-title" style="text-align:right">{{$t('frontend.order.quotationPayment')}}  </p></ion-label>
                <ion-label class="menu-col-3 bold-title" style="text-align:right">{{getFormatPrice(order.QuotationPayment)}}</ion-label>                    
            </ion-item>

            
            <div v-if="order.State !== 8 && order.Deadline">
                    <ion-card-title v-if="order.State !== 8 && order.Deadline.length > 0" >                                         
                    {{$t('frontend.order.parcialPayment')}}  
            </ion-card-title>

            <div v-if="order.State !== 8 && order.Deadline.length > 0" class="subtitles-order" style="display: flex;overflow: auto;">
                                            
                <ion-card v-for="dead in order.Deadline" v-bind:key="dead.Date" 
                    class="menu-col-9 subtitles-order"
                    style="text-align: center;display: inline-block; visibility: visible;">
                                                                                                
                    <ion-label> <p class="percent-payment"> {{dead.Percent}}% </p> 
                                <span class="iconify" data-icon="ic:baseline-update" data-inline="false" style="width: 18px;height: 18px;float: left;"></span>
                                <p style="text-align: left; font-weight: bold"> {{ getFormatDate(dead.Date) }} </p>
                    </ion-label> 
                    <ion-progress-bar color="success" :value="dead.State=== 0 ? 0 : 1" ></ion-progress-bar>
                    <ion-label :color="dead.State=== 1 ?'success': 'danger'">
                        <strong>  {{getFormatPrice(totalWithoutQuotation * dead.Percent / 100)}} </strong>
                        <span v-if="dead.State=== 1" class="iconify" data-icon="emojione-v1:left-check-mark" data-inline="false" style="width: 18px;height: 18px;float: right;"></span>   
                    </ion-label>
                
                </ion-card>
            </div>

            </div>

                <ion-item  v-if="cType != 'order'  && order.QuotationPayment" style="color: #399922;font-size: 16px;font-weight: bold;text-transform: uppercase;"> 
                <ion-label   size="4"> </ion-label>
                <ion-label class="menu-col-9" ><p class="menu-bold-title" style="text-align:right">{{$t('backoffice.form.titles.pendingPay')}}  </p></ion-label>
                <ion-label class="menu-col-3 bold-title" style="text-align:right">{{getFormateNumber(pendingPay)}}</ion-label>                    
            </ion-item>

            <ion-item  v-if="cType != 'order' && order.QuotationPayment" style="color: #399922;font-size: 16px;font-weight: bold;text-transform: uppercase;"> 
                <ion-label   size="4"> </ion-label>
                <ion-label class="menu-col-9" ><p class="menu-bold-title" style="text-align:right">{{$t('backoffice.form.titles.payed')}}  </p></ion-label>
                <ion-label class="menu-col-3 bold-title" style="text-align:right">{{getFormateNumber(payed)}}</ion-label>                    
            </ion-item>

        </ion-item-slidin>


        <ion-grid v-if="order.Payment && order.Payment.length > 0">
            <ion-row class="left">
                <ion-col>
                    <div><span class="title">{{$t('backoffice.titles.payments')}}:</span></div>
                </ion-col>
            </ion-row>
            <ion-row class="left" v-if="0">
                <ion-col size="2">
                    <div><span class="title">{{$t('backoffice.form.fields.amount')}}</span></div>
                </ion-col>
                <ion-col size="3">
                    <div><span class="title">{{$t('frontend.order.transId')}}</span></div>
                </ion-col>
                <ion-col size="3">
                    <div><span class="title">{{$t('frontend.order.paymentMethod')}}</span></div>
                </ion-col>
                
                <ion-col size="4">
                </ion-col>
            </ion-row>
            <div v-for="pay in order.Payment" :key="order.Payment.indexOf(pay)">
                <ion-row class="left" v-if="0">
                    <ion-col size="2">
                        <div class="end" v-if="pay.paymentInfo">{{ getFormateNumber(pay.paymentInfo.total) }}</div>
                    </ion-col>
                    <ion-col size="3">
                        <div v-if="pay.paymentInfo">{{ pay.paymentInfo.transId }}</div>
                    </ion-col>
                    <ion-col size="3">
                        <div v-if="pay.paymentInfo">{{ pay.PaymentMethod }}</div>
                    </ion-col>
                    
                    <ion-col size="4" v-if="pay.paymentInfo">
                        <div v-if="pay.PaymentMethod != 'Credit '">|{{pay.PaymentMethod}}|
                            <div v-if="pay.state == 1" >
                                <div style="float: left; text-align: center;"> <!-- v-if="pay.paymentInfo.method != 'Device'"--> 
                                    <ion-input type="number" :value="count=pay.total" @ionChange="count= $event.target.value"></ion-input>
                                    <ion-button color="danger" @click="setRefund(pay, order.Payment.indexOf(pay), count)">Refund</ion-button>
                                </div>
                                <div style="text-align: center;padding-top: 38.75px;">
                                    <ion-button color="danger" @click="setVoid(pay, order.Payment.indexOf(pay), count)">Void</ion-button>
                                </div>
                            </div>
                            <div v-if="pay.state == 2">
                                <span class="title" v-if="pay.refundValue">{{$t('frontend.home.state')}}: Refund: {{getFormateNumber(pay.refundValue)}}</span> 
                                <span class="title" v-else>{{$t('frontend.home.state')}}: Refund: {{getFormateNumber(pay.total)}}</span> 
                            </div>
                            <div v-if="pay.state == 3">
                                <span class="title" v-if="pay.voidValue">{{$t('frontend.home.state')}}: Void: {{getFormateNumber(pay.voidValue)}}</span>
                                <span class="title" v-else>{{$t('frontend.home.state')}}: Void: {{getFormateNumber(pay.total)}}</span>
                            </div>
                        </div>
                    </ion-col>
                </ion-row>

                <ion-list style="    padding: 0 20px;" v-if="pay.paymentInfo">
                    <div style="display: flex;justify-content: space-between; align-items: center;">
                        <ion-label style="text-align: left">
                          <h2> TOTAL: {{ getFormateNumber(pay.paymentInfo.total)}}  </h2>
                          <h3>{{ pay.paymentInfo.transId }} </h3>
                          <h4>{{ pay.PaymentMethod }}</h4>
                        </ion-label>
                        
                        <ion-label v-if="!['Credit', 'HouseAccount'].includes((pay.PaymentMethod).trim())">
                            <div style="    display: flex;"  v-if="pay.state == 1">
                                <div style="    display: flex;">
                                    <ion-input  type="number" :value="count=pay.total" @ionChange.stop="count= $event.target.value" style="    text-align: right;"></ion-input>
                                    <ion-button                               
                                    fill="outline"  
                                    style="--padding-start: 2px;--padding-end: 2px;" 
                                    @click="setRefund(pay, order.Payment.indexOf(pay), count)"                                
                                    >                               
                                        <ion-tex style="font-size: 12px;">refound</ion-tex>
                                    </ion-button> 
                                </div>
                                <ion-button
                                    fill="outline"   
                                     style="--padding-start: 2px;--padding-end: 2px;"
                                    @click="setVoid(pay, order.Payment.indexOf(pay), count)"                                
                                    >
                                        <ion-tex style="font-size: 12px;">void</ion-tex>
                                </ion-button> 
                            </div>
                            <div v-if="pay.state == 2">
                                <span class="title" v-if="pay.refundValue">{{$t('frontend.home.state')}}: Refund: {{getFormateNumber(pay.refundValue)}}</span> 
                                <span class="title" v-else>{{$t('frontend.home.state')}}: Refund: {{getFormateNumber(pay.total)}}</span> 
                            </div>
                            <div v-if="pay.state == 3">
                                <span class="title" v-if="pay.voidValue">{{$t('frontend.home.state')}}: Void: {{getFormateNumber(pay.voidValue)}}</span>
                                <span class="title" v-else>{{$t('frontend.home.state')}}: Void: {{getFormateNumber(pay.total)}}</span>
                            </div>
                        </ion-label>
                    </div>
                </ion-list> 

            </div>
        </ion-grid>

        <br/>

        <ion-grid>
            <ion-row v-if="order.Note" class="left">
                <ion-col>
                    <span class="title">{{$t('backoffice.form.titles.notes')}}:</span>
                </ion-col>
            </ion-row>
            <ion-row v-if="order.Note" class="left">
                <ion-col>
                    {{order.Note}}
                </ion-col>
            </ion-row>
            <ion-row v-if="order.State == 6" class="left">
                <ion-col>
                    <span class="title">{{$t('backoffice.form.titles.cancelNotes')}}:</span>
                </ion-col>
            </ion-row>
            <ion-row v-if="order.State == 6" class="left">
                <ion-col>
                    {{order.CancelNote}}
                </ion-col>
            </ion-row>           
        </ion-grid>

        <br/>

        <ion-row >
            <ion-col size ="12" size-md="6" v-if="order.State < 5">
                <ion-item>
                    <ion-label>
                        <span style="color: red">*</span>{{$t('backoffice.form.fields.cooker')}}
                    </ion-label>
                    <ion-select  interface="popover"
                        @ionChange="cooker = $event.target.value, order.Cooker=$event.target.value" v-bind:value="cooker">
                        <ion-select-option v-for="user in users" 
                        v-bind:key="user.Id" 
                        v-bind:value="user._id" >
                        {{user.FirstName}} {{user.LastName}} - 
                        {{getOccupationName(user.OccupationId)}}
                    </ion-select-option>
                </ion-select>
                </ion-item>

            </ion-col>

            <ion-col size ="12" size-md="6" v-if="order.State < 5 && order.OrderType == 'Delivery'">
               <ion-item>
                     <ion-label>
                    <!-- <span style="color: red">*</span> -->
                    {{$t('backoffice.form.fields.driver')}}
                </ion-label>
                 <ion-select  interface="popover"
                @ionChange="driver = $event.target.value, order.Driver=$event.target.value" v-bind:value="driver">
                    <ion-select-option v-for="user in drivers" v-bind:key="user.Id" v-bind:value="user._id" >{{user.FirstName}} {{user.LastName}} - {{getOccupationName(user.OccupationId)}}</ion-select-option>
                </ion-select>

               </ion-item>
            </ion-col>

            <ion-col size ="12" size-md="6" v-if="![0,5,6,7,8].includes(order.State)">
              <div style="display: flex;justify-content: space-between; align-items: center;">
                    <ion-label>
                         Next State: 
                    </ion-label>
                <ion-select  interface="popover"
                    @ionChange="stateToChange = $event.target.value" v-bind:value="stateToChange">
                    <ion-select-option 
                    v-for="ps in possibleStates" 
                    v-bind:key="ps" 
                    v-bind:value="ps" >
                    {{ps}}</ion-select-option>
                </ion-select>
                <ion-label>
                    <ion-button                    
                        fill="clear" 
                        @click="changeStatus()"
                        v-tooltip="'Change State'"
                        >
                        <ion-icon slot="icon-only" icon="refresh"></ion-icon>
                    </ion-button> 
                </ion-label>
            </div>

            </ion-col>
        </ion-row>
    

        <ion-button v-if="order.State == 4 && order.IsAccept"  @click="showDeliveringLocation(order)">Show delivering location</ion-button>
        <ion-button v-if="![0,5,6,7,8].includes(order.State)" color="danger" @click="candelOrder()">{{$t('backoffice.form.buttons.cancelOrder')}}</ion-button>
        <ion-button v-if="![0,5,6,7,8].includes(order.State)"  @click="saveOrder()">{{$t('backoffice.form.buttons.save')}}</ion-button>
        </div>

    </div>
</template>

<script>

import { Api } from '../api/api.js';
import { Utils } from '../utils/utils.js';
import Modal from './cancelOrderModal.vue';
import ModalDeadline from './payDeadlineModal.vue';
import { payAuthorizeNet } from '../api/payments.js';
import { Devices } from '../api/devices.js';
 import { Commons } from '../../frontend/commons'
import moment from 'moment-timezone';
export default {
    
  name: 'categoryForm',
   
  data () {
    return {
      modelName: 'order',
      /****** Form Data ******/
      id: null,
      order: null,
      customer: null,
      orderInfo: '',
      cooker: '',
      driver: '',

      users: [],
      drivers: [],
      occupations: [],
      stateToChange: '',

      currency: 'USD',
      allTypeOrder:{'Delivery':this.$t('frontend.app.deliver'), 'PickUp':this.$t('frontend.app.pickup'), 'On Table':this.$t('frontend.app.table'),'Curbside':this.$t('frontend.app.curbside'), },
           
    //   workflowOrderStaus: ['Pending of pay', 'Started', 'In kitchen', 'Cooked', 'Delivering', 'Delivered', 'Canceled'],
      workflowOrderStaus: [this.$t('frontend.order.state0'), this.$t('frontend.order.state1'), this.$t('frontend.order.state2'), this.$t('frontend.order.state3'), this.$t('frontend.order.state4'), this.$t('frontend.order.state5'), this.$t('frontend.order.state6'), this.$t('frontend.order.state7'), this.$t('frontend.order.state8')],
      possibleStates: [],

      cType: 'order',

      isBackdrop: false,

      spinner: false,
      date: ''

      /***** Is editing  *****/
    }
  },
  created: function(){
    this.id = this.$route.params.orderId;
    this.cType = this.$route.params.type || 'order';
    if (this.id){
        const data = this.$store.state.backConfig.order.find(o => o._id === this.id)
        if(data) this.order = data;
        this.date = moment.tz(this.order.Date, moment.tz.guess()).format('MM-DD-YYYY hh:mm A')
        if(this.order.Driver) this.driver = this.order.Driver;
        if(this.order.Cooker) this.cooker = this.order.Cooker;
    }
    this.getOrderInfo();
    this.init();
  },
  computed:{
      nextStatus() {
          if (this.order)
          {
              if (this.order.OrderType != 'Delivery' && this.order.State == 3)
                return this.workflowOrderStaus[this.order.State + 2];
            return this.workflowOrderStaus[this.order.State + 1];
          }
          return '';   
      },
      calcTax(){
          if (this.order)
              return this.order.SubTotal * this.order.Taxe / 100;
          return 0;
      },
      calcTip(){
          if (this.order)
              return this.order.SubTotal * this.order.Tip / 100;
          return 0;
      },
      pay(){
          return payAuthorizeNet.payEvo2()
      
      },
      pendingPay(){
          if (this.cType != 'order')
          {
              let deadlinesPayed = 0
              if(this.order.Deadline){
                  this.order.Deadline.forEach(dl => {
                      if (dl.State == 1)
                        deadlinesPayed += dl.AmountPayed
                  });
              }
              return parseFloat(this.order.Total) - (parseFloat(this.order.QuotationPayment) + deadlinesPayed)
          }
                
          return 0
      },
      payed(){
          if (this.cType != 'order' && this.order.QuotationPayment)
          {
              let payed = parseFloat(this.order.QuotationPayment)
              if(this.order.Deadline){
                  this.order.Deadline.forEach(dl => {
                      if (dl.State == 1)
                        payed += parseFloat(dl.AmountPayed)
                  });
              }
              return payed
          }

          return 0
      }
  },
  methods:{

    getOrderInfo: function(){
        if(this.order.OrderType == 'Delivery'){
            this.orderInfo = this.order.AddressToDeliver ;
            const deliveryAdress = this.orderInfo.split(' ZipCode: ');
            this.zipCode = deliveryAdress[1];        
            this.address = deliveryAdress[0];  
        }
        if(this.order.OrderType == 'PickUp'){           
          this.orderInfo = this.order.HourToPick;
        // this.orderInfo = moment.tz(this.order.Date, moment.tz.guess()).format('hh:mm A')
        }
        if(this.order.OrderType == 'On Table')
            this.orderInfo = this.order.tableService;
         if(this.order.OrderType === 'PickUp' || this.order.OrderType === 'Curbside')
            this.orderInfo =  moment.tz(this.order.DateToPick, moment.tz.guess()).format('MM-DD-YYYY') +
            '  |  '+ moment.tz(this.order.HourToPick, moment.tz.guess()).format('hh:mm A');
    },
      calcAmountTax(percentage)
      {
          return (this.order.SubTotal * percentage / 100).toFixed(2)
      },
      async setRefund(pay, key, count){

          //Obtengo el restaurante
            this.spinner = true
            const restaurantID = this.$store.state.user.RestaurantId
            const restaurant = this.$store.state.backConfig.restaurant;

          if (pay.paymentInfo.method === "Cash" || pay.paymentInfo.method === "Check"){

                this.order.Payment[key]["state"] = 2;
                this.order.Payment[key]["refundValue"] = parseFloat(count).toFixed(2);
                let item = {
                    "_id": this.order._id,
                    "Payment": this.order.Payment,
                };
                Api.putIn('order', item)
                .then(() => {
                    const index = this.$store.state.backConfig.order.findIndex( o => o._id === item._id);
                    if(index !== -1) this.$store.state.backConfig.order[index] = item;
                })
                .catch(e => {
                    e;
                    this.spinner = false;
                })

                const paymeD = await Api.getPaymentByInvoice(pay.paymentInfo.transId, restaurantID);
                if(paymeD){
                  
                    const payUpd = paymeD.data[0];
                    payUpd.Refund = parseFloat(count).toFixed(2);
                    await Api.putIn('Allpayments', payUpd);
                }

                this.spinner = false
                
                return true;

          }
          else if (restaurant.PayMethod == 'SHIFT4')
            {

                //Hay que obtener el token.
                if (pay.paymentInfo){
                    
                    try
                    {
                        const invoiceInformation = await payAuthorizeNet.invoiceInformation(pay.paymentInfo.transId, pay.paymentInfo.moto,
                                                                                                restaurantID, 'SHIFT4')
                        
                        if (invoiceInformation.data.length > 0)
                        {
                                const datas = {
                                    "restaurantId": restaurantID,
                                    "payMethod": 'SHIFT4',
                                    "total": parseFloat(count).toFixed(2),
                                    "token": invoiceInformation.data[0].card.token.value,
                                    "invoiceNumber": pay.paymentInfo.transId
                                }

                            const isDelivery = pay.paymentInfo.isDelivery || false;
                            await payAuthorizeNet.refundOrder(datas, pay.paymentInfo.moto, isDelivery)
                            
                            const paymeD = await Api.getPaymentByInvoice(pay.paymentInfo.transId, restaurantID);
                            if(paymeD){
                                
                                const payUpd = paymeD.data[0];
                                payUpd.Refund = parseFloat(count).toFixed(2);
                                await Api.putIn('Allpayments', payUpd);
                            }

                                this.order.Payment[key]["state"] = 2;
                                this.order.Payment[key]["refundValue"] = parseFloat(count).toFixed(2);
                                let item = {
                                    "_id": this.order._id,
                                    "Payment": this.order.Payment,
                                };
                                Api.putIn('order', item)
                                .then(() => {
                                    const index = this.$store.state.backConfig.order.findIndex( o => o._id === item._id);
                                    if(index !== -1) this.$store.state.backConfig.order[index] = item;
                                })
                                .catch(e => {
                                      e;
                                    this.spinner = false;
                                })

                                this.spinner = false
                        }
                        else{
                            this.showToastMessage('The invoice is not found in payment gateway. The order cant be refund', 'danger')
                            this.spinner = false
                        }
                    }
                    catch(e){
                        e
                        this.showToastMessage(e, 'danger')
                        this.spinner = false
                    }

                }
                
            }
            else if (restaurant.PayMethod == 'TSYS'){
                try{
                    const datas = {
                                    "restaurantId": restaurantID,
                                    "payMethod": 'TSYS',
                                    "total": parseFloat(count).toFixed(2),
                                    "invoiceNumber": pay.paymentInfo.transId
                                }
    
                    const isDelivery = pay.paymentInfo.isDelivery || false;
                    await payAuthorizeNet.refundOrder(datas, pay.paymentInfo.moto, isDelivery)
                    
                    const paymeD = await Api.getPaymentByInvoice(pay.paymentInfo.transId, restaurantID);
                    if(paymeD){
                     
                        const payUpd = paymeD.data[0];
                        payUpd.Refund = parseFloat(count).toFixed(2);
                        await Api.putIn('Allpayments', payUpd);
                    }

                    this.order.Payment[key]["state"] = 2;
                    this.order.Payment[key]["refundValue"] = parseFloat(count).toFixed(2);
                    let item = {
                        "_id": this.order._id,
                        "Payment": this.order.Payment,
                    };
                    Api.putIn('order', item)
                    .then(() => {
                        const index = this.$store.state.backConfig.order.findIndex( o => o._id === item._id);
                        if(index !== -1) this.$store.state.backConfig.order[index] = item;
                    })
                    .catch(e => {
                          e;
                        this.spinner = false;
                    })

                    this.spinner = false
                }
                catch(e){
                    e
                    this.showToastMessage(e, 'danger')
                    this.spinner = false
                }
            }
            else if (restaurant.PayMethod == 'PayFabric'){
                try{
                    const datas = {
                                    "restaurantId": restaurantID,
                                    "payMethod": 'PayFabric',
                                    "total": parseFloat(count).toFixed(2),                                  
                                    "invoiceNumber": pay.paymentInfo.transId
                                }
    
                    await payAuthorizeNet.refundOrder(datas, pay.paymentInfo.moto, false)
                    
                    const paymeD = await Api.getPaymentByInvoice(pay.paymentInfo.transId, restaurantID);
                    if(paymeD){                        
                        const payUpd = paymeD.data[0];
                        payUpd.Refund = parseFloat(count).toFixed(2);
                        await Api.putIn('Allpayments', payUpd);
                    }

                    this.order.Payment[key]["state"] = 2;
                    this.order.Payment[key]["refundValue"] = parseFloat(count).toFixed(2);
                    let item = {
                        "_id": this.order._id,
                        "Payment": this.order.Payment,
                    };
                    Api.putIn('order', item)
                    .then(() => {
                       const index = this.$store.state.backConfig.order.findIndex( o => o._id === item._id);
                        if(index !== -1) this.$store.state.backConfig.order[index] = item;
                    })
                    .catch(e => {
                          e;
                         this.spinner = false;
                    })

                    this.spinner = false
                }
                catch(e){
                    e
                    this.showToastMessage(e, 'danger')
                    this.spinner = false
                }
            }
            else if (restaurant.PayMethod == 'NAB'){
                try{
                    const datas = {
                                    "restaurantId": restaurantID,
                                    "payMethod": 'NAB',
                                    "total": parseFloat(count).toFixed(2),                                  
                                    "invoiceNumber": pay.paymentInfo.transId
                                }
    
                    await payAuthorizeNet.refundOrder(datas, pay.paymentInfo.moto, false)
                    
                    const paymeD = await Api.getPaymentByInvoice(pay.paymentInfo.transId, restaurantID);
                    if(paymeD){                        
                        const payUpd = paymeD.data[0];
                        payUpd.Refund = parseFloat(count).toFixed(2);
                        await Api.putIn('Allpayments', payUpd);
                    }
                   

                    this.order.Payment[key]["state"] = 2;
                    this.order.Payment[key]["refundValue"] = parseFloat(count).toFixed(2);
                    let item = {
                        "_id": this.order._id,
                        "Payment": this.order.Payment,
                    };
                    Api.putIn('order', item)
                    .then(() => {
                       const index = this.$store.state.backConfig.order.findIndex( o => o._id === item._id);
                        if(index !== -1) this.$store.state.backConfig.order[index] = item;
                    })
                    .catch(e => {
                         e;
                    this.spinner = false;
                    })

                    this.spinner = false
                }
                catch(e){
                    e
                    this.showToastMessage(e, 'danger')
                    this.spinner = false
                }
            }
            
      },
      async setVoid(pay, key){
          //Obtengo el restaurante
            this.spinner = true
            const restaurantID = this.$store.state.user.RestaurantId
            const restaurant = this.$store.state.backConfig.restaurant;

            if (pay.paymentInfo.method === "Cash" || pay.paymentInfo.method === "Check"){

                this.order.Payment[key]["state"] = 2;
                this.order.Payment[key]["voidValue"] = pay.paymentInfo.total;
                let item = {
                    "_id": this.order._id,
                    "Payment": this.order.Payment,
                };
                Api.putIn('order', item)
                .then(() => {
                     const index = this.$store.state.backConfig.order.findIndex( o => o._id === item._id);
                    if(index !== -1) this.$store.state.backConfig.order[index] = item;
                })
                .catch(e => {
                      e;
                    this.spinner = false;
                })

                const paymeD = await Api.getPaymentByInvoice(pay.paymentInfo.transId, restaurantID);
                if(paymeD){
                 
                    const payUpd = paymeD.data[0];
                    payUpd.Void = pay.paymentInfo.total;
                    await Api.putIn('Allpayments', payUpd);
                }

                this.spinner = false
                 
                return;

            }
         
            else if( ['SHIFT4', 'Device', 'PayFabric', 'NAB'].includes(restaurant.PayMethod) ) {
                
                try
                {
                    const isDelivery = pay.paymentInfo.isDelivery || false;
                    await payAuthorizeNet.void(pay.paymentInfo.transId, pay.paymentInfo.moto, restaurantID, restaurant.PayMethod, isDelivery)
                    
                    const paymeD = await Api.getPaymentByInvoice(pay.paymentInfo.transId, restaurantID);
                    if(paymeD){
                       
                        const payUpd = paymeD.data[0];
                        payUpd.Void = pay.paymentInfo.total;
                        await Api.putIn('Allpayments', payUpd);
                    }

                    this.order.Payment[key]["state"] = 3
                    this.order.Payment[key]["voidValue"] = pay.paymentInfo.total;
                    let item = {
                    "_id": this.order._id,
                    "Payment": this.order.Payment,
                    };
                    Api.putIn('order', item)
                    .then(() => {
                        const index = this.$store.state.backConfig.order.findIndex( o => o._id === item._id);
                        if(index !== -1) this.$store.state.backConfig.order[index] = item;
                    })
                    .catch(e => {
                          e;
                    this.spinner = false;
                    })

                    this.spinner = false
                }
                catch(e)
                {
                    e
                    this.showToastMessage(e, 'danger')
                    this.spinner = false

                }
            }
            else if (restaurant.PayMethod == 'TSYS'){

                try
                {
                    const isDelivery = pay.paymentInfo.isDelivery || false;
                    await payAuthorizeNet.void(pay.paymentInfo.transId, pay.paymentInfo.moto, restaurantID, restaurant.PayMethod, isDelivery)
                 
                    const paymeD = await Api.getPaymentByInvoice(pay.paymentInfo.transId, restaurantID);
                    if(paymeD){
                       
                        const payUpd = paymeD.data[0];
                        payUpd.Void = pay.paymentInfo.total;
                        await Api.putIn('Allpayments', payUpd);
                    }

                    this.order.Payment[key]["state"] = 3
                    this.order.Payment[key]["voidValue"] = pay.paymentInfo.total;
                    let item = {
                        "_id": this.order._id,
                        "Payment": this.order.Payment,
                    };
                    Api.putIn('order', item)
                    .then(() => {
                        const index = this.$store.state.backConfig.order.findIndex( o => o._id === item._id);
                        if(index !== -1) this.$store.state.backConfig.order[index] = item;
                    })
                    .catch(e => {
                          e;
                    this.spinner = false;
                    })

                    this.spinner = false
                }
                catch(e)
                {
                    e
                    this.showToastMessage(e, 'danger')
                    this.spinner = false

                }

            }
      },
      callbackVoid(res){
           
            if (res[5] == 'OK')
            {
                this.showToastMessage('La devolución se realizó exitosamente', 'success')
            }
            else{
                this.showToastMessage('Algo no fue bien', 'danger')
            }
            
            this.dismissModal()
      },

      payExample(){

       
        Devices.a930.Initialize()
        .then(() => {
         
        })
        .catch(e => {
            e
        })

     
      },
    
      payDeadLine(index){
          return this.$ionic.modalController
                .create({
                component: ModalDeadline,
                cssClass: 'my-custom-class',
                componentProps: {
                    data: {
                        content: this.order._id,
                    },
                    propsData: {
                        title: 'Pay deadline',
                        button: this.$t('backoffice.list.messages.buttons.close'),
                        button2: this.$t('backoffice.form.buttons.cancelOrder'),
                        order: this.order,
                        deadline: index,
                        customer: this.customer,
                        parent: this
                    },
                },
                })
                .then(m => m.present())
      },
      haveServices(){
         
        if(!this.order.Products) return
          let services = this.order.Products.find(prod => prod.isService)
          if (services)
                return true;
          return false;

      },
      init(){
        this.currency =this.$store.state.backConfig.restaurant.Currency
        this.fetchOccupations();
        this.fetchUsers();     
         return  this.fillPossibleStates();
      },

      goToBack(){
        this.$router.push({ path: '/order'})
      },
      ifErrorOccured(action){
        return this.$ionic.alertController.create({
            title: this.$t('backoffice.list.messages.connectionError'),
            message: this.$t('backoffice.list.messages.connectionErrorMessage'),
            buttons: [
                {
                text: this.$t('backoffice.list.messages.buttons.goToList'),
                handler: () => {
                    this.$router.push({
                        name: 'Order',
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
      getWorker(workerId){
        const worker = this.users.find(item => item._id == workerId)
        return worker.FirstName + ' ' + worker.LastName
      },
      fillPossibleStates: function(){
          for (let i = this.order.State + 1; i < this.workflowOrderStaus.length - 1; i++) {
              const element = this.workflowOrderStaus[i];
              if (this.order.OrderType != "Delivery" && this.workflowOrderStaus[i] == "On the way")
                    continue;
              if (!this.possibleStates.includes(element))
                    this.possibleStates.push(element);
          }
          this.stateToChange = this.nextStatus;
      },

      fetchUsers: function(){
        this.users = this.$store.state.backConfig.staff
        this.drivers = this.users.filter(urs => urs.IsDriver);
      },

      fetchOccupations: function(){
         this.occupations = this.$store.state.backConfig.occupation;
      },

      getOccupationName(id){
         let occupation = null;
         occupation = this.occupations.filter(item => item._id.indexOf(id) > 1);
         if (occupation)
         {
             return occupation.Name;
         }
         return '';
      },   

      getOrderState(state){
          return this.workflowOrderStaus[state];
      },
      getFormatedDate: function(date){
          return Utils.getFormatedDate(date);         
      },
      getFormateNumber: function(number){
          return new Intl.NumberFormat('en', {style: "currency", currency: this.currency} ).format(number).toString()
      },
      showDeliveringLocation(orderP){
        this.$router.push({
            name: 'Localization',
            params: {
              order: orderP,
              fun: 'read'
            }
        });
      },
      async changeStatus(){
        //   this.changeOrder(this.stateToChange);

          let newStatus = this.workflowOrderStaus.indexOf(this.stateToChange);

          if (newStatus == 2 && this.cooker == '')
          {
                this.showToastMessage(this.$t('backoffice.form.validate.cooker'), "danger");
                return;
          }
        
          let item = {
              "_id": this.order._id,
              "State": newStatus,
            };
          if (newStatus == 2){
             item['Cooker'] = this.cooker;
          }
          if (newStatus == 4)
          {
              item['Driver'] = this.driver;
              item['IsAccept'] = false;
              item['Lat'] = 0;
              item['Lng'] = 0;
          }
          this.isBackdrop = true;
          this.spinner = true;
          await Api.putIn(this.modelName, item)
            .then(response => {
                const index = this.$store.state.backConfig.order.findIndex( o => o._id === item._id);
                if(index !== -1) this.$store.state.backConfig.order[index] = item;

                let orderInfo = ''
                if (newStatus == 2){
                    if(this.order.CustomerName)
                        orderInfo = this.order.CustomerName + this.$t('backoffice.form.marketingMessages.inKitchen')
                } 
                if (newStatus == 3) //Cocinada
                    orderInfo = this.$t('backoffice.form.marketingMessages.cooked')
                if (newStatus == 4) //Entregándose
                    orderInfo = this.$t('backoffice.form.marketingMessages.delivering')
                if (newStatus == 5) //Entregada
                    orderInfo = this.$t('backoffice.form.marketingMessages.delivered')

                //Enviar email
                if (this.order.CustomerEmail){
                        this.sendEmail(this.order.CustomerEmail, orderInfo);
                }
                this.showToastMessage(this.$t('backoffice.list.messages.changeOrderStateSuccess'), "success");

              
                this.init();
                this.isBackdrop = false;
                this.spinner = false;
                return response;
            })
            .catch(e => {
                this.isBackdrop = false;
                e;
                this.spinner = false;
                this.ifErrorOccured(this.changeStatus)
            })
      },
      async saveOrder(){
        this.spinner = true;
        await Api.putIn(this.modelName, this.order)
        .then(response => {
            const index = this.$store.state.backConfig.order.findIndex( o => o._id === this.order._id);
            if(index !== -1) this.$store.state.backConfig.order[index] = this.order;
            
            this.init();
            this.spinner = false;
            return response;
        })
        .catch(e => {
            e;
            this.spinner = false;
        })

      },
      candelOrder(){
           return this.$ionic.modalController
                .create({
                component: Modal,
                cssClass: 'my-custom-class',
                componentProps: {
                    data: {
                        content: this.order._id,
                    },
                    propsData: {
                        title: this.$t('backoffice.form.titles.cancelOrder'),
                        button: this.$t('backoffice.list.messages.buttons.close'),
                        button2: this.$t('backoffice.form.buttons.cancelOrder'),
                        order: this.order,
                        customer: this.customer,
                        parent: this,
                    },
                },
                })
                .then(m => m.present())
      },
      async sendEmail(email, mess){
        
           let items = {
              "email": email,
              "mess": mess,
              "subject": this.$t('backoffice.form.marketingMessages.orderInfo')
            };
          
            await Api.sendEmail(items)
                .then(() => {
                })
                .catch(e => {
                    e;
                    this.spinner = false;
                })
      },
      async sendSms(phone, mess){
         
            let items = {
              "phone": phone,
              "mess": mess
            };
            // let item = {
            //   "phone": "+1 973-832-3170",
            //   "mess": "message"
            // };
            await Api.sendSms(items)
                .then(() => {
                })
                .catch(e => {
                    e;
                    this.spinner = false;
                })
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
     
    hasSomeNote(car){
      return Commons.hasSomeNote(car);
    },

     getIngredientNote(car){
      return Commons.getIngredientNote(car);      
    },

     getFormatPrice(price){
        const result = new Intl.NumberFormat('en', {style: "currency", currency: this.$store.state.restaurantActive.currency} ).format(price)
        return result;
    },
     
  },

}
</script>
<style>

ion-col{

    border: 1px solid lightgray;

}

span.title{
    font-weight: bolder;
}

div.end{
    text-align: end;
}

ion-row.left{
    text-align: left;
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