<template>
    <div class="screen">
    <!-- <ion-backdrop v-if="isBackdrop"></ion-backdrop> -->

    <ion-header>
          <ion-toolbar>
            <ion-buttons slot="start">
              <ion-back-button default-href="/controlPanel" @click="$router.push({ name: 'ControlPanel', params: {viewSelected: 'Config'} })"></ion-back-button>
            </ion-buttons>
            <ion-label style="padding: 20px 100px;">
              <h1>{{title}}</h1>            
            </ion-label>

            
          </ion-toolbar>
    </ion-header>

    <ion-segment scrollable id="productSegment" @ionChange="segmentValue=$event.target.value" :value="segmentValue" >
        
        <ion-segment-button value="general">
            <span>{{$t('backoffice.form.titles.genaral')}}</span>
        </ion-segment-button>   

        <ion-segment-button value="functionalities">
            <span>{{$t('backoffice.options.manageFunSettings')}}</span>
        </ion-segment-button>     

        <ion-segment-button value="design">
            <span>{{ $t('backoffice.options.manageDesign') }}</span>
        </ion-segment-button>

        <ion-segment-button value="more">
            <span>{{$t('backoffice.options.manageMore')}}</span>
        </ion-segment-button>

        
    </ion-segment>

    <br/>

     <ion-loading
        v-if="spinner"
        cssClass="my-custom-class"
        :message="$t('frontend.tooltips.loadRestaurant')"
    ></ion-loading>
    <div :key="key">
      <!-- <ion-card> -->
        <div v-if="segmentValue==='general'">
           <Basic/>
        </div>

        <div v-if="segmentValue==='functionalities'">

            
            <ion-segment scrollable  @ionChange="functionalitySegment=$event.target.value" :value="functionalitySegment" >
                <ion-segment-button value="general">
                    <span>{{$t('backoffice.form.titles.genaral')}}</span>
                </ion-segment-button>   

                <ion-segment-button value="catering" v-if="viewCatering">
                    <span>{{$t('backoffice.options.viewCateringOrders')}}</span>
                </ion-segment-button>     

                <ion-segment-button value="reservation" v-if="viewReservation">
                    <span>{{ $t('backoffice.options.manageReservation') }}</span>
                </ion-segment-button>
            </ion-segment>

            <div v-if="functionalitySegment==='general'">
                <ion-item>
                    <h1>General</h1>
                </ion-item>

                <ion-row>
                    <ion-col  size="12"   size-md="6" >
                        <ion-list>
                            
                            <ion-item>
                                <ion-label>{{$t('backoffice.form.fields.SelectPickHour')}}</ion-label>
                                <ion-toggle slot="end" name="selectPickHour" 
                                        @ionChange="selectPickHour=$event.target.checked" 
                                        :checked="selectPickHour">
                                </ion-toggle>
                            </ion-item>

                            <div v-if="selectPickHour">
                                <ion-item>
                                    <ion-label>{{$t('backoffice.form.fields.PickFrom')}}(HH:mm)</ion-label>
                                    <ion-datetime name="pickFrom" @ionChange="pickFrom = $event.target.value" 
                                                    v-bind:value="pickFrom"
                                                    :placeholder="$t('backoffice.form.titles.pickFromSelect')" display-format="HH:mm">
                                    </ion-datetime>
                                </ion-item>
                                <ion-item>
                                    <ion-label>{{$t('backoffice.form.fields.PickTo')}}(HH:mm)</ion-label>
                                    <ion-datetime name="pickTo" @ionChange="pickTo = $event.target.value" 
                                                    v-bind:value="pickTo"
                                                    :placeholder="$t('backoffice.form.titles.pickToSelect')" display-format="HH:mm">
                                    </ion-datetime>
                                </ion-item>
                                <ion-item>
                                    <ion-label position="floating">{{$t('backoffice.form.fields.MinTimeToCook')}}</ion-label>
                                    <ion-input type="number" name="minTimeToCook"
                                    @input="minTimeToCook = $event.target.value" 
                                    v-bind:value="minTimeToCook">
                                    </ion-input>
                                </ion-item>
                            </div>

                            <ion-item>
                            <ion-label>{{$t('backoffice.form.fields.ShowCooker')}}</ion-label>
                            <ion-toggle slot="end" name="showCooker" 
                                    @ionChange="showCooker=$event.target.checked" 
                                    :checked="showCooker">
                            </ion-toggle>
                            </ion-item>

                            <ion-item>
                                <ion-label >{{$t('backoffice.form.fields.showOtherRestaurant')}}</ion-label>
                                <ion-toggle name="showOthersRestaurant" style="top: 12px;"
                                @ionChange="showOthersRestaurant=$event.target.checked" 
                                :checked ="showOthersRestaurant">
                                </ion-toggle>
                            </ion-item>

                            <ion-item>
                                <ion-label >Has Delivery Payment </ion-label>
                                <ion-toggle name="HasDeliveryPayment" style="top: 12px;" Key="other"
                                    @ionChange="HasDeliveryPayment=$event.target.checked" 
                                    :checked ="HasDeliveryPayment">
                                </ion-toggle>
                            
                            </ion-item>

                            <ion-item>
                                <ion-label>{{$t('backoffice.form.fields.canViewGeoposition')}}</ion-label>
                                <ion-toggle slot="end" name="canViewGeoposition" 
                                        @ionChange="canViewGeoposition=$event.target.checked" 
                                        :checked="canViewGeoposition">
                                </ion-toggle>
                            </ion-item>

                            <ion-item>
                                <ion-label>{{$t('backoffice.form.fields.canViewRating')}}</ion-label>
                                <ion-toggle slot="end" name="canViewRating" 
                                        @ionChange="canViewRating=$event.target.checked" 
                                        :checked="canViewRating">
                                </ion-toggle>
                            </ion-item>

                            <ion-item>
                                <ion-label>{{$t('backoffice.form.fields.viewDelivery')}}</ion-label>
                                <ion-toggle slot="end" name="viewDelivery" 
                                        @ionChange="viewDelivery=$event.target.checked" 
                                        :checked="viewDelivery">
                                </ion-toggle>
                            </ion-item>

                            <ion-item>
                                <ion-label>{{$t('backoffice.form.fields.viewOnTable')}}</ion-label>
                                <ion-toggle slot="end" name="viewOnTable" 
                                        @ionChange="viewOnTable=$event.target.checked" 
                                        :checked="viewOnTable">
                                </ion-toggle>
                            </ion-item>

                            <ion-item>
                                <ion-label>{{$t('backoffice.form.fields.viewCurbside')}}</ion-label>
                                <ion-toggle slot="end" name="viewCurbside" 
                                        @ionChange="viewCurbside=$event.target.checked" 
                                        :checked="viewCurbside">
                                </ion-toggle>
                            </ion-item>

                    
                        </ion-list>

                    </ion-col>

                    <ion-col  size="12"   size-md="6" >
                        <ion-list>

                            <ion-item>
                                <ion-label position="floating">{{$t('backoffice.form.fields.tablePrefix')}}</ion-label>
                                <ion-input type="text" name="tablePrefix"
                                @input="tablePrefix = $event.target.value" 
                                v-bind:value="tablePrefix">
                                </ion-input>
                            </ion-item>

                            <ion-item>
                                <ion-label position="floating">{{$t('backoffice.form.fields.barPrefix')}}</ion-label>
                                <ion-input type="text" name="barPrefix"
                                @input="barPrefix = $event.target.value" 
                                v-bind:value="barPrefix">
                                </ion-input>
                            </ion-item>

                            <ion-item>
                                <ion-label position="floating">{{$t('backoffice.form.fields.roomPrefix')}}</ion-label>
                                <ion-input type="text" name="roomPrefix"
                                @input="roomPrefix = $event.target.value" 
                                v-bind:value="roomPrefix">
                                </ion-input>
                            </ion-item>

                            <ion-item>
                                <h1>{{$t('backoffice.form.fields.tips')}}</h1>
                            </ion-item>

                            <ion-item>
                                <ion-label>{{$t('backoffice.form.fields.TipRequire')}}</ion-label>
                                <ion-toggle slot="end" name="tipRequire" 
                                        @ionChange="tipRequire=$event.target.checked" 
                                        :checked="tipRequire">
                                </ion-toggle>
                            </ion-item>

                            <ion-item>
                                <ion-label position="floating">{{$t('backoffice.form.fields.typeTip')}} (%)</ion-label>
                                <ion-input id="newTip" type="number" @input="newTip = $event.target.value"></ion-input>
                                <ion-button expand="full" color="primary" v-bind:value="newTip" @click="addTip(newTip)"><ion-icon slot="icon-only" name="add"></ion-icon></ion-button>
                            </ion-item>

                            <ion-item style="margin-left: 30px" v-for="tip in tips" v-bind:key="tip._id">
                                <ion-label>{{tip}} %</ion-label>
                                <ion-button expand="full" color="danger" @click="delTip(tip)"><ion-icon slot="icon-only" name="trash"></ion-icon></ion-button>
                            </ion-item>

                            <ion-item>
                                <h1>{{$t('backoffice.form.fields.zipCodes')}}</h1>
                            </ion-item>

                            <ion-item>
                                <ion-label position="floating">{{$t('backoffice.form.fields.deliveryZone')}}</ion-label>
                                <ion-textarea name="deliveryZone" 
                                @input="deliveryZone = $event.target.value" 
                                v-bind:value="deliveryZone">
                                </ion-textarea>
                            </ion-item>

                            <ion-item>
                                <ion-label>{{$t('backoffice.form.fields.typeZipCode')}}</ion-label>
                                <ion-input type="number" @input="newCode = $event.target.value"></ion-input>
                                <ion-button expand="full" color="primary" v-bind:value="newCode" @click="addCode(newCode, IsCatering, cateringPrice)"><ion-icon slot="icon-only" name="add"></ion-icon></ion-button>
                            </ion-item>
                            
                            <ion-item style="margin-left: 30px" v-for="zipCode in zipCodes" v-bind:key="zipCode._id">
                                <ion-label>{{zipCode.ZipCode}} - {{getCityAndState(zipCode.ZipCode)}}</ion-label>
                                <ion-button expand="full" color="danger" @click="delCode(zipCode)"><ion-icon slot="icon-only" name="trash"></ion-icon></ion-button>
                            </ion-item>
            
                        </ion-list>     

                    </ion-col>
                </ion-row>
            </div>

            <!--catering -->
            <div v-if="functionalitySegment==='catering' && viewCatering"> 

                    <ion-item>
                        <h1>{{$t('backoffice.form.fields.catering')}}</h1>
                    </ion-item>

                    <ion-item>
                        <ion-label position="floating">{{$t('backoffice.form.fields.minAmoutCatering')}}</ion-label>
                        <ion-input type="number" name="minAmoutCatering"
                            @input="minAmoutCatering = $event.target.value" 
                            v-bind:value="minAmoutCatering">
                        </ion-input>
                    </ion-item>

                    <ion-item>
                        <ion-label position="floating">{{$t('backoffice.form.fields.minAmountCateringDelivery')}}</ion-label>
                        <ion-input type="number" name="minAmountCateringDelivery"
                            @input="minAmountCateringDelivery = $event.target.value" 
                            v-bind:value="minAmountCateringDelivery">
                        </ion-input>
                    </ion-item>

                    <ion-item>
                        <ion-label position="floating">{{$t('backoffice.form.fields.marginDays')}}</ion-label>
                        <ion-input type="number" name="cateringMarginDays"
                            @input="cateringMarginDays = $event.target.value" 
                            v-bind:value="cateringMarginDays">
                        </ion-input>
                    </ion-item>

                    <ion-item>
                        <ion-label>{{$t('backoffice.form.fields.partialPay')}}</ion-label>
                        <ion-toggle slot="end" name="partialPay" 
                                @ionChange="partialPay=$event.target.checked" 
                                :checked="partialPay">
                        </ion-toggle>
                    </ion-item>

                    <ion-item>
                        <ion-label>{{$t('backoffice.form.fields.payForQuotation')}}</ion-label>
                        <ion-toggle slot="end" name="payForQuotation" 
                                @ionChange="payForQuotation=$event.target.checked" 
                                :checked="payForQuotation">
                        </ion-toggle>
                    </ion-item>

                    <ion-item v-if="payForQuotation">
                        <ion-label position="floating">{{$t('backoffice.form.fields.percentPayForQuotation')}}</ion-label>
                        <ion-input type="number" name="percentPayForQuotation"
                            @input="percentPayForQuotation = $event.target.value" 
                            v-bind:value="percentPayForQuotation">
                        </ion-input>
                    </ion-item>

                    <div style="margin-left: 30px">
                        <ion-list>
                            <ion-item>
                                <h1>{{$t('backoffice.form.fields.cateringStates')}}</h1>
                            </ion-item>
                            <ion-item>
                                <ion-label>{{$t('backoffice.form.fields.typeState')}}</ion-label>
                                <ion-input id='newState' type="text" @input="newState = $event.target.value"></ion-input>
                                <ion-button expand="full" color="primary" v-bind:value="newState" @click="addState(newState)"><ion-icon slot="icon-only" name="add"></ion-icon></ion-button>
                            </ion-item>
                            <ion-item style="margin-left: 30px" v-for="state in states" v-bind:key="state._id">
                                <ion-label>{{state}}</ion-label>
                                <ion-button expand="full" color="danger" @click="delState(state)"><ion-icon slot="icon-only" name="trash"></ion-icon></ion-button>
                            </ion-item>
                        </ion-list>
                    </div>

                    <div style="margin-left: 30px">
                        <ion-list>
                            <ion-item>
                                <h1>{{$t('backoffice.form.fields.zipCodesExclude')}}</h1>
                            </ion-item>
                            <ion-item>
                                <ion-label>{{$t('backoffice.form.fields.typeZipCode')}}</ion-label>
                                <ion-input id='newZipcodeExclude' type="number" @input="newZipcodeState = $event.target.value"></ion-input>
                                <ion-button expand="full" color="primary" v-bind:value="newZipcodeState" @click="addZipcodeExclude(newZipcodeState)"><ion-icon slot="icon-only" name="add"></ion-icon></ion-button>
                            </ion-item>
                            <ion-item style="margin-left: 30px" v-for="zipcode in zipcodesExcludes" v-bind:key="zipcodesExcludes.indexOf(zipcode)">
                                <ion-label>{{zipcode}} - {{getCityAndState(zipcode)}}</ion-label>
                                <ion-button expand="full" color="danger" @click="delZipcodeExclude(zipcode)"><ion-icon slot="icon-only" name="trash"></ion-icon></ion-button>
                            </ion-item>
                        </ion-list>
                    </div>

                    <div style="margin-left: 30px">
                        <ion-list>
                            <ion-item>
                                <h1>{{$t('backoffice.form.fields.cateringEvents')}}</h1>
                            </ion-item>
                            <ion-item>
                                <ion-label>{{$t('backoffice.form.fields.typeEventName')}}</ion-label>
                                <ion-input id='newEvent' type="text" @input="newEvent = $event.target.value"></ion-input>
                                <ion-button expand="full" color="primary" v-bind:value="newEvent" @click="addEvent(newEvent)"><ion-icon slot="icon-only" name="add"></ion-icon></ion-button>
                            </ion-item>
                            <ion-item style="margin-left: 30px" v-for="event in events" v-bind:key="events.indexOf(event)">
                                <ion-label>{{event}}</ion-label>
                                <ion-button expand="full" color="danger" @click="delEvent(event)"><ion-icon slot="icon-only" name="trash"></ion-icon></ion-button>
                            </ion-item>
                        </ion-list>
                    </div>

            </div>

            <!-- Reservation -->
            <div v-if="functionalitySegment==='reservation' && viewReservation">
            
                <ion-item>
                    <h1>{{$t('backoffice.form.fields.reservation')}}</h1>
                </ion-item>

                <ion-item v-if="$store.state.restaurantActive.RestaurantBussines">
                    <ion-label >{{$t('backoffice.form.fields.reservationByTable')}}</ion-label>
                    <ion-toggle name="reservationByTable" style="top: 12px;"
                    @ionChange="reservationByTable=$event.target.checked" 
                    :checked ="reservationByTable">
                    </ion-toggle>
                </ion-item>

                <ion-item v-if="$store.state.restaurantActive.ServiceBussines">
                    <ion-label >{{$t('backoffice.form.fields.reservationByStaff')}}</ion-label>
                    <ion-toggle name="reservationByStaff" style="top: 12px;"
                    @ionChange="reservationByStaff=$event.target.checked" 
                    :checked ="reservationByStaff">
                    </ion-toggle>
                </ion-item>

                <ion-item>
                    <ion-label >{{$t('backoffice.form.fields.tablesChoose')}}</ion-label>
                    <ion-toggle name="tablesChoose" style="top: 12px;"
                    @ionChange="tablesChoose=$event.target.checked" 
                    :checked ="tablesChoose">
                    </ion-toggle>
                </ion-item>

                <ion-item>
                    <ion-label position="floating">{{$t('backoffice.form.fields.minDayToReservation')}}</ion-label>
                    <ion-input type="number" name="minDayToReservation"
                    @input="minDayToReservation = $event.target.value" 
                    v-bind:value="minDayToReservation">
                    </ion-input>
                </ion-item>

                <ion-item>
                    <ion-label>{{$t('backoffice.form.fields.viewCustomerReservation')}}</ion-label>
                    <ion-toggle slot="end" name="viewCustomerReservation: " 
                        @ionChange="viewCustomerReservation = $event.target.checked"
                        :checked="viewCustomerReservation">
                    </ion-toggle>
                </ion-item>

                <ion-item>
                    <ion-label>{{$t('backoffice.form.fields.payForQuotation')}}</ion-label>
                    <ion-toggle slot="end" name="payForReservarionQuotation: " 
                        @ionChange="payForReservarionQuotation=$event.target.checked" 
                        :checked="payForReservarionQuotation">
                    </ion-toggle>
                </ion-item>

                <ion-item v-if="payForReservarionQuotation">
                    <ion-label position="floating"><span style="color: red">*</span>{{$t('backoffice.form.fields.percentPayForQuotation')}}</ion-label>
                    <ion-input type="number" name="amountPayForReservarionQuotation"
                    @input="amountPayForReservarionQuotation = $event.target.value" 
                    v-bind:value="amountPayForReservarionQuotation">
                    </ion-input>
                </ion-item>

                <ion-item>
                    <ion-label>{{$t('backoffice.form.fields.sameHourForAllDays')}}</ion-label>
                    <ion-toggle slot="end" name="sameHourForAllDays: " 
                        @ionChange="sameHourForAllDays = $event.target.checked; activeMonday = true"
                        :checked="sameHourForAllDays">
                    </ion-toggle>
                </ion-item>
                
                <div style="display: inherit">
                    <ion-item>
                        <ion-toggle v-if="!sameHourForAllDays" style="border-bottom: 1px solid lightgray; margin:5px" name="activeMonday" 
                                @ionChange="activeMonday = $event.target.checked"
                                :checked="activeMonday">
                        </ion-toggle>
                        <ion-label v-if="!sameHourForAllDays">{{$t('backoffice.form.fields.monday')}}</ion-label>
                        <ion-label v-else>{{$t('backoffice.form.fields.allDays')}}</ion-label>
                        <ion-datetime style="border-bottom: 1px solid lightgray; margin:5px" name="mondayOpenHour" @ionChange="mondayOpenHour = $event.target.value" 
                                        v-bind:value="mondayOpenHour"
                                        placeholder="Select" display-format="h:mm a" picker-format="h:mm a"
                                        :disabled="!activeMonday">
                        </ion-datetime>
                        -
                        <ion-datetime style="border-bottom: 1px solid lightgray; margin:5px" name="mondayCloseHour" @ionChange="mondayCloseHour = $event.target.value" 
                                        v-bind:value="mondayCloseHour"
                                        placeholder="Select" display-format="h:mm a" picker-format="h:mm a"
                                        :disabled="!activeMonday">
                        </ion-datetime>
                    </ion-item>
                    <ion-item v-if="!sameHourForAllDays">
                        <ion-toggle style="border-bottom: 1px solid lightgray; margin:5px" name="activeTuesday" 
                                @ionChange="activeTuesday = $event.target.checked"
                                :checked="activeTuesday">
                        </ion-toggle>
                        <ion-label>{{$t('backoffice.form.fields.tuesday')}}</ion-label>
                        <ion-datetime style="border-bottom: 1px solid lightgray; margin:5px" name="tuesdayOpenHour" @ionChange="tuesdayOpenHour = $event.target.value" 
                                        v-bind:value="tuesdayOpenHour"
                                        placeholder="Select" display-format="h:mm a" picker-format="h:mm a"
                                        :disabled="!activeTuesday">
                        </ion-datetime>
                        -
                        <ion-datetime style="border-bottom: 1px solid lightgray; margin:5px" name="tuesdayCloseHour" @ionChange="tuesdayCloseHour = $event.target.value" 
                                        v-bind:value="tuesdayCloseHour"
                                        placeholder="Select" display-format="h:mm a" picker-format="h:mm a"
                                        :disabled="!activeTuesday">
                        </ion-datetime>
                    </ion-item>
                    <ion-item v-if="!sameHourForAllDays">
                        <ion-toggle style="border-bottom: 1px solid lightgray; margin:5px" name="activeWednesday" 
                                @ionChange="activeWednesday = $event.target.checked"
                                :checked="activeWednesday">
                        </ion-toggle>
                        <ion-label>{{$t('backoffice.form.fields.wednesday')}}</ion-label>
                        <ion-datetime style="border-bottom: 1px solid lightgray; margin:5px" name="wednesdayOpenHour" @ionChange="wednesdayOpenHour = $event.target.value" 
                                        v-bind:value="wednesdayOpenHour"
                                        placeholder="Select" display-format="h:mm a" picker-format="h:mm a"
                                        :disabled="!activeWednesday">
                        </ion-datetime>
                        -
                        <ion-datetime style="border-bottom: 1px solid lightgray; margin:5px" name="wednesdayCloseHour" @ionChange="wednesdayCloseHour = $event.target.value" 
                                        v-bind:value="wednesdayCloseHour"
                                        placeholder="Select" display-format="h:mm a" picker-format="h:mm a"
                                        :disabled="!activeWednesday">
                        </ion-datetime>
                    </ion-item>
                    <ion-item v-if="!sameHourForAllDays">
                        <ion-toggle style="border-bottom: 1px solid lightgray; margin:5px" name="activeThursday" 
                                @ionChange="activeThursday = $event.target.checked"
                                :checked="activeThursday">
                        </ion-toggle>
                        <ion-label>{{$t('backoffice.form.fields.thursday')}}</ion-label>
                        <ion-datetime style="border-bottom: 1px solid lightgray; margin:5px" name="thursdayOpenHour" @ionChange="thursdayOpenHour = $event.target.value" 
                                        v-bind:value="thursdayOpenHour"
                                        placeholder="Select" display-format="h:mm a" picker-format="h:mm a"
                                        :disabled="!activeThursday">
                        </ion-datetime>
                        -
                        <ion-datetime style="border-bottom: 1px solid lightgray; margin:5px" name="thursdayCloseHour" @ionChange="thursdayCloseHour = $event.target.value" 
                                        v-bind:value="thursdayCloseHour"
                                        placeholder="Select" display-format="h:mm a" picker-format="h:mm a"
                                        :disabled="!activeThursday">
                        </ion-datetime>
                    </ion-item>
                    <ion-item v-if="!sameHourForAllDays">
                        <ion-toggle style="border-bottom: 1px solid lightgray; margin:5px" name="activeFriday" 
                                @ionChange="activeFriday = $event.target.checked"
                                :checked="activeFriday">
                        </ion-toggle>
                        <ion-label>{{$t('backoffice.form.fields.friday')}}</ion-label>
                        <ion-datetime style="border-bottom: 1px solid lightgray; margin:5px" name="fridayOpenHour" @ionChange="fridayOpenHour = $event.target.value" 
                                        v-bind:value="fridayOpenHour"
                                        placeholder="Select" display-format="h:mm a" picker-format="h:mm a" :disabled="!activeFriday">
                        </ion-datetime>
                        -
                        <ion-datetime style="border-bottom: 1px solid lightgray; margin:5px" name="fridayCloseHour" @ionChange="fridayCloseHour = $event.target.value" 
                                        v-bind:value="fridayCloseHour"
                                        placeholder="Select" display-format="h:mm a" picker-format="h:mm a" :disabled="!activeFriday">
                        </ion-datetime>
                    </ion-item>
                    <ion-item v-if="!sameHourForAllDays">
                        <ion-toggle style="border-bottom: 1px solid lightgray; margin:5px" name="activeSaturday" 
                                @ionChange="activeSaturday = $event.target.checked"
                                :checked="activeSaturday">
                        </ion-toggle>
                        <ion-label>{{$t('backoffice.form.fields.saturday')}}</ion-label>
                        <ion-datetime style="border-bottom: 1px solid lightgray; margin:5px" name="saturdayOpenHour" @ionChange="saturdayOpenHour = $event.target.value" 
                                        v-bind:value="saturdayOpenHour"
                                        placeholder="Select" display-format="h:mm a" picker-format="h:mm a"
                                        :disabled="!activeSaturday">
                        </ion-datetime>
                        -
                        <ion-datetime style="border-bottom: 1px solid lightgray; margin:5px" name="saturdayCloseHour" @ionChange="saturdayCloseHour = $event.target.value" 
                                        v-bind:value="saturdayCloseHour"
                                        placeholder="Select" display-format="h:mm a" picker-format="h:mm a"
                                        :disabled="!activeSaturday">
                        </ion-datetime>
                    </ion-item>
                    <ion-item v-if="!sameHourForAllDays">
                        <ion-toggle style="border-bottom: 1px solid lightgray; margin:5px" name="activeSunday" 
                                @ionChange="activeSunday = $event.target.checked"
                                :checked="activeSunday">
                        </ion-toggle>
                        <ion-label>{{$t('backoffice.form.fields.sunday')}}</ion-label>
                        <ion-datetime style="border-bottom: 1px solid lightgray; margin:5px" name="sundayOpenHour" @ionChange="sundayOpenHour = $event.target.value" 
                                        v-bind:value="sundayOpenHour"
                                        placeholder="Select" display-format="h:mm a" picker-format="h:mm a"
                                        :disabled="!activeSunday">
                        </ion-datetime>
                        -
                        <ion-datetime style="border-bottom: 1px solid lightgray; margin:5px" name="sundayCloseHour" @ionChange="sundayCloseHour = $event.target.value" 
                                        v-bind:value="sundayCloseHour"
                                        placeholder="Select" display-format="h:mm a" picker-format="h:mm a"
                                        :disabled="!activeSunday">
                        </ion-datetime>
                    </ion-item>
                </div>
            </div>

            <!-- Loyalty Program -->
            <div v-if="0">
                <!-- <ion-item>
                    <ion-label>{{$t('backoffice.form.fields.viewLoyalty')}}</ion-label>
                    <ion-checkbox slot="end" name="viewLoyalty" 
                            @ionChange="viewLoyalty=$event.target.checked"
                            :checked="viewLoyalty">
                    </ion-checkbox>
                </ion-item> -->
                <div v-if="viewLoyalty">
                    <ion-item>
                        <ion-label position="floating">{{$t('backoffice.form.fields.loyaltyMinPointToBuy')}}</ion-label>
                        <ion-input type="number" name="loyaltyMinPointToBuy"
                            @input="loyaltyMinPointToBuy = $event.target.value" 
                            v-bind:value="loyaltyMinPointToBuy">
                        </ion-input>
                    </ion-item>
                    <ion-item>
                        <ion-label position="floating">{{$t('backoffice.form.fields.loyaltyExpirationMonths')}}</ion-label>
                        <ion-input type="number" name="loyaltyExpirationMonths"
                            @input="loyaltyExpirationMonths = $event.target.value" 
                            v-bind:value="loyaltyExpirationMonths">
                        </ion-input>
                    </ion-item>
                    <ion-item>
                        <ion-label position="floating">{{$t('backoffice.form.fields.loyaltyPointMoney')}}</ion-label>
                        <ion-input type="number" name="loyaltyPointMoney"
                            @input="loyaltyPointMoney = $event.target.value" 
                            v-bind:value="loyaltyPointMoney">
                        </ion-input>
                    </ion-item>
                </div>
            </div>
       
        </div>

         <div v-if="segmentValue==='design'">
              <ion-segment scrollable  @ionChange="designSegment=$event.target.value" :value="designSegment" >
                <ion-segment-button value="colors">
                    <span>{{$t('backoffice.options.manageColourSettings')}}</span>
                </ion-segment-button>   

                <ion-segment-button value="sliders">
                    <span>{{$t('backoffice.options.manageAboutSettings')}}</span>
                </ion-segment-button>     

                <ion-segment-button value="ads">
                    <span>{{ $t('frontend.menu.ads') }}</span>
                </ion-segment-button>
            </ion-segment>
            
            <About v-if="designSegment==='sliders'"/>
            <ManageAds v-if="designSegment==='ads'"/>
            <Colores v-if="designSegment==='colors'"/>
        </div>

        <div v-if="segmentValue==='more'">
              <!-- Devices -->
            <div v-if="1">
               <ion-item>
                    <h1>Devices</h1>
                    <ion-button @click="showMoreDevice=!showMoreDevice"><ion-icon name="add"></ion-icon></ion-button>
                </ion-item>
                    <div>

                        <div  v-if="showMoreDevice">
                            <ion-row  >
                                <ion-col size="6" >                      
                                    <!-- <ion-label>Device Company</ion-label> -->
                                    <ion-item>
                                        <ion-label position="floating">Compañía<strong style="color: red">*</strong></ion-label> 
                                    <ion-select  interface="popover" icon="add"                           
                                        :value="newDevCompany"                           
                                        @ionChange.stop="newDevCompany = $event.target.value">
                                            <ion-select-option key="pax" value="pax">PAX</ion-select-option>
                                            <ion-select-option key="teamsable" value="teamsable">Teamable</ion-select-option>
                                    </ion-select>
                                    </ion-item>
                                    

                                    <ion-item>
                                        <ion-label position="floating">Device name<strong style="color: red">*</strong></ion-label> 
                                        <ion-input   type="text" @input="newDevName = $event.target.value" :value="newDevName"></ion-input>
                                    </ion-item>

                                    <ion-item>
                                        <ion-label >SSL</ion-label> 
                                        <ion-toggle slot="end"   @ionChange="sslDev=$event.target.checked"   :checked="sslDev"  ></ion-toggle> 
                                    </ion-item>
                                
                                </ion-col>

                                <ion-col size="6">
                                        
                                    <ion-item>
                                        <ion-label position="floating">Ip Address<strong style="color: red">*</strong></ion-label> 
                                        <ion-input   type="text" @input="newDevIpAddress = $event.target.value"  :value="newDevIpAddress"></ion-input>
                                    </ion-item>

                                    <ion-item>
                                        <ion-label position="floating">Port<strong style="color: red">*</strong></ion-label> 
                                        <ion-input  type="number" @input="newDevPort = $event.target.value" placeholder="90001" :value="newDevPort"></ion-input>
                                    </ion-item>

                                
                                </ion-col>

                            </ion-row >
                            <ion-button expand="full"  color="primary" :disabled="newDevName === '' || newDevCompany === '' || newDevIpAddress === '' || newDevPort === ''" @click="addDevice(),showMoreDevice=false">Add</ion-button>

                        </div>

                         <ion-col size="12" v-if="DeviceList.length > 0"> 
                            <ion-item style="margin-left: 30px" v-for="device in DeviceList" v-bind:key="DeviceList.indexOf(device)">
                                <ion-label>{{device.Name}} - {{device.Company}} | {{device.Ip}}:{{device.Port}}</ion-label>
                                <ion-button expand="full" color="danger" @click="delDevice(device)"><ion-icon slot="icon-only" name="trash"></ion-icon></ion-button>
                            </ion-item>
                        </ion-col>
                    
                    </div>
            </div>

            <div v-if="0"> 
                <PosKey/>
            </div>

            <hr>

            <!-- Backups -->
            <div v-if="1">
               <ion-item>
                    <h1>Backups</h1>
                </ion-item>

                    <ion-list>                     
                        <ion-item>
                            <ion-label>Make backup and download</ion-label>
                            <ion-label slot="end"><ion-button color="primary" @click="doBackup()">Backup</ion-button></ion-label>
                        </ion-item>
                        <ion-item>
                            <ion-label>Restore backup from Portal</ion-label>
                            <ion-label slot="end"><ion-button color="danger" @click="doRestoreFromPortal()">Restore</ion-button></ion-label>
                        </ion-item>
                        <ion-item>
                            <div>
                                <ion-label>Restore backup from file</ion-label>
                            </div>
                            <input type="file" accept=".csv" @change="handleFile" />
                            <ion-label slot="end"><ion-button color="danger" @click="doRestoreFromFile()">Restore</ion-button></ion-label>
                        </ion-item>
                    </ion-list>
               
            </div>
            
        </div>

      
        <ion-button 
            v-if="!['general','design'].includes(segmentValue)"
            expand="full" 
            color="primary" 
            :disabled="!isValidForm()" 
            @click="saveSetting()">{{ $t('backoffice.form.buttons.save') }}
        </ion-button>

    </div>
    </div>
</template>

<script>

import { Api } from '../api/api.js';
import LibCodes from 'zipcodes';
import Moment from 'moment';
import Cripto from "crypto-js";
import About from './AboutDataSetting.vue'
import Basic from './BasicDataSettingsForm.vue'
import Colores from './ColourDataSettingForm.vue'
import PosKey from './KeySettingForm.vue'
import ManageAds from './manageAds.vue'

export default {

  name: 'funDataSettingForm',
   
  data () {
    return {
      modelName: 'Setting',
      /****** Form Data ******/
      newCode: 0,
      newState: '',
      newZipcodeState: 0,
      newEvent: '',
      IsCatering: false,
      cateringPrice: 0,
      key: 0,

      id: null,
      selectPickHour: false,
      minTimeToCook: 0,
      pickFrom: '00:00',
      pickTo: '23:59',
      showCooker: false,
      canViewGeoposition: false,
      canViewRating: false,
      showOthersRestaurant: false,
      viewDelivery: false,
      viewOnTable: false,
      viewCurbside: false,
      reservationByTable: false,
      reservationByStaff: false,
      tablesChoose: false,

      zipCodes: [],
      states: [],
      events: [],
      zipcodesExcludes: [],
      deliveryZone: "",

      tipRequire: false,
      newTip: 0,
      tips: [],

      tablePrefix: '',
      barPrefix: '',
      roomPrefix: '',

      //Catering *****************/
      viewCatering: false,
      minAmoutCatering: 0,
      minAmountCateringDelivery: 0,
      partialPay: false,
      payForQuotation: false,
      percentPayForQuotation: 0,
      cateringMarginDays: 0,
      //**************************/

      /**Loyalty Program *****************/

      viewLoyalty: false,
      loyaltyExpirationMonths: 0, //0 is no expiration
      loyaltyMinPointToBuy: 0,
      loyaltyPointMoney: 0,
    
      /**********************************/

      //Reservation **************/
      viewReservation: false,
      viewCustomerReservation: false,
      minDayToReservation: 2,
      reservationDaysAndTime: [],

      payForReservarionQuotation: false,
      amountPayForReservarionQuotation: 0,

      sameHourForAllDays: false,

      activeMonday: false,
      mondayOpenHour: '',
      mondayCloseHour: '',

      activeTuesday: false,
      tuesdayOpenHour: '',
      tuesdayCloseHour: '',
      
      activeWednesday: false,
      wednesdayOpenHour: '',
      wednesdayCloseHour: '',

      activeThursday: false,
      thursdayOpenHour: '',
      thursdayCloseHour: '',

      activefriday: false,
      fridayOpenHour: '',
      fridayCloseHour: '',

      activeSaturday: false,
      saturdayOpenHour: '',
      saturdayCloseHour: '',

      activeSunday: false,
      sundayOpenHour: '',
      sundayCloseHour: '',
      //**************************/
      
      isBackdrop: false,

      spinner: false,

      //Segment
      segmentValue: 'general',
      functionalitySegment:'general',
      designSegment:'colors',
      about: false,
      basic:true,
      general: false,
      catering: false,
      reservation: false,
      loyalty: false,
      tip: false,
      zipCode: false,
      devices: false,
      backup: false,
      payments: false,
      colors: false  , 
      poskey: false,
      ads: false,

      //Backup file
      backupFile: null,

      //Devices
      newDevName: '',
      newDevCompany: 'shift4',
      newDevIpAddress: '127.0.0.1',
      newDevPort: '90001', 
      sslDev: true, 
      DeviceList: [],

      //HasDeliveryPayment
      HasDeliveryPayment: false,
      showMoreDevice: false,
    }
  },
  created: function(){
      this.init();
  },
  components:{
      About, Basic, Colores,  PosKey, ManageAds,
  },
  computed: {
        title() {
            return this.id ? this.$t('backoffice.form.titles.funSettingEditTitle') :  this.$t('backoffice.form.titles.funSettingNewTitle');
        }
  },
  methods: {
   
    init(){
        this.id = this.$route.params.settingId;
        this.reservationByTable = this.$store.state.backConfig.setting.ReservationByTable;
        this.reservationByStaff = this.$store.state.backConfig.setting.ReservationByStaff;
        this.tablesChoose = this.$store.state.backConfig.setting.TablesChoose;
        this.selectPickHour = this.$store.state.backConfig.setting.SelectPickHour;
        this.minTimeToCook = this.$store.state.backConfig.setting.MinTimeToCook;
        this.pickFrom = this.$store.state.backConfig.setting.PickFrom;
        this.pickTo = this.$store.state.backConfig.setting.PickTo;
        this.showCooker = this.$store.state.backConfig.setting.ShowCooker;
        this.showOthersRestaurant = this.$store.state.backConfig.setting.ShowOtherRestaurant;
        this.canViewGeoposition = this.$store.state.backConfig.setting.CanViewGeolocation;
        this.canViewRating = this.$store.state.backConfig.setting.ViewRating;
        this.viewDelivery = this.$store.state.backConfig.setting.ViewDelivery;
        this.viewOnTable = this.$store.state.backConfig.setting.ViewOnTable;
        this.viewCurbside = this.$store.state.backConfig.setting.ViewCurbside;                    
        this.tablePrefix = this.$store.state.backConfig.setting.TablePrefix;
        this.barPrefix = this.$store.state.backConfig.setting.BarPrefix;
        this.roomPrefix = this.$store.state.backConfig.setting.RoomPrefix;
        this.zipCodes = this.$store.state.backConfig.setting.ZipCodes;
        this.deliveryZone = this.$store.state.backConfig.setting.DeliveryZone;
        this.tipRequire = this.$store.state.backConfig.setting.TipRequire;
        this.DeviceList = this.$store.state.backConfig.setting.Devices || [];
        this.tips = this.$store.state.backConfig.setting.Tips;
        this.HasDeliveryPayment = this.$store.state.backConfig.setting.HasDeliveryPayment;
        this.tips.sort();
        // Catering
        this.viewCatering = this.$store.state.backConfig.setting.ViewCatering;
        if (this.viewCatering)
        {
            this.minAmoutCatering = this.$store.state.backConfig.setting.MinAmoutCatering;
            this.minAmountCateringDelivery = this.$store.state.backConfig.setting.MinAmountCateringDelivery;
            this.partialPay = this.$store.state.backConfig.setting.PartialPay;
            this.payForQuotation = this.$store.state.backConfig.setting.PayForQuotation;
            this.percentPayForQuotation = this.$store.state.backConfig.setting.PercentPayForQuotation;
            this.cateringMarginDays = this.$store.state.backConfig.setting.CateringMarginDays;
            this.states = this.$store.state.backConfig.setting.CateringStates;
            this.zipcodesExcludes = this.$store.state.backConfig.setting.ZipCodesExcludes;
            this.events = this.$store.state.backConfig.setting.CateringEvents;
        }                  
        //Reservation
        this.viewReservation = this.$store.state.backConfig.setting.ViewReservation;
        if (this.viewReservation){
            this.viewCustomerReservation = this.$store.state.backConfig.setting.ViewCustomerReservation;
            this.minDayToReservation = this.$store.state.backConfig.setting.MinDayToReservation;
            this.payForReservarionQuotation = this.$store.state.backConfig.setting.HasReservationQuotation;
            this.amountPayForReservarionQuotation  = this.$store.state.backConfig.setting.PayForReservationQuotation || 0; 
            this.setReservationDateAndTime(this.$store.state.backConfig.setting.ReservationDaysAndTime);
        }

        //Loyalty Program
        this.viewLoyalty = this.$store.state.backConfig.setting.ViewLoyalty
        if (this.viewLoyalty){
            this.loyaltyExpirationMonths = this.$store.state.backConfig.setting.LoyaltyExpirationMonths
            this.loyaltyMinPointToBuy = this.$store.state.backConfig.setting.LoyaltyMinPointToBuy
            this.loyaltyPointMoney = this.$store.state.backConfig.setting.LoyaltyPointMoney
        }
        this.key ++;
    },
    
    setReservationDateAndTime(data){
        data.forEach(element => {
            if (element.Day == 'Monday')
            {
                this.activeMonday = true
                this.mondayOpenHour = Moment.tz(element.OpenHour, Moment.tz.guess()).format('HH:mm')
                this.mondayCloseHour = Moment.tz(element.CloseHour, Moment.tz.guess()).format('HH:mm')
            }
            if (element.Day == 'Tuesday')
            {
                this.activeTuesday = true
                this.tuesdayOpenHour = Moment.tz(element.OpenHour, Moment.tz.guess()).format('HH:mm')
                this.tuesdayCloseHour = Moment.tz(element.CloseHour, Moment.tz.guess()).format('HH:mm')
            }
            if (element.Day == 'Wednesday')
            {
                this.activeWednesday = true
                this.wednesdayOpenHour = Moment.tz(element.OpenHour, Moment.tz.guess()).format('HH:mm')
                this.wednesdayCloseHour = Moment.tz(element.CloseHour, Moment.tz.guess()).format('HH:mm')
            }
            if (element.Day == 'Thursday')
            {
                this.activeThursday = true
                this.thursdayOpenHour = Moment.tz(element.OpenHour, Moment.tz.guess()).format('HH:mm')
                this.thursdayCloseHour = Moment.tz(element.CloseHour, Moment.tz.guess()).format('HH:mm')
            }
            if (element.Day == 'Friday')
            {
                this.activeFriday = true
                this.fridayOpenHour = Moment.tz(element.OpenHour, Moment.tz.guess()).format('HH:mm')
                this.fridayCloseHour = Moment.tz(element.CloseHour, Moment.tz.guess()).format('HH:mm')
            }
            if (element.Day == 'Saturday')
            {
                this.activeSaturday = true
                this.saturdayOpenHour = Moment.tz(element.OpenHour, Moment.tz.guess()).format('HH:mm')
                this.saturdayCloseHour = Moment.tz(element.CloseHour, Moment.tz.guess()).format('HH:mm')
            }
            if (element.Day == 'Sunday')
            {
                this.activeSunday = true
                this.sundayOpenHour = Moment.tz(element.OpenHour, Moment.tz.guess()).format('HH:mm')
                this.sundayCloseHour = Moment.tz(element.CloseHour, Moment.tz.guess()).format('HH:mm')
            }
        });
        this.reservationDaysAndTime = data
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
    isValidForm(){
        
        if (this.payForReservarionQuotation == true){
            if (this.amountPayForReservarionQuotation == '' || this.amountPayForReservarionQuotation <= 0)
            {
                return false
            }
            return true
        }

        return true
    },
    addCode(newVal){
        var hills = LibCodes.lookup(newVal);
        const value = {
          "ZipCode": newVal,
          "IsCatering": this.IsCatering,
          "CateringPrice": this.cateringPrice
        };
        if (!hills)
        {
            this.ShowMessage(this.$t('backoffice.form.validate.validate'), this.$t('backoffice.form.validate.zipCode'), this.$t('backoffice.form.validate.validateSetting'));
            return;
        }
        if (this.zipCodes.includes(zc => zc.ZipCode == newVal))
        {
            this.ShowMessage(this.$t('backoffice.form.validate.validate'), this.$t('backoffice.form.validate.duplicateZipCode'), this.$t('backoffice.form.validate.validateSetting'));
        }
        if (this.IsCatering)
        {
            if (this.cateringPrice == 0)
            {
                this.ShowMessage(this.$t('backoffice.form.validate.validate'), this.$t('backoffice.form.validate.cateringPriceZero'), this.$t('backoffice.form.validate.validateSetting'));
            }
            else{
                // this.zipCodes.push(newVal);
                this.zipCodes.push(value);
                this.cateringPrice = 0;
            }
        }
        else
        {
          //  this.zipCodes.push(newVal);
           this.zipCodes.push(value);
           this.newCode = 0;
        }
    },
    addState(state){
        var validZip = LibCodes.lookupByState(state);
        if (validZip.length == 0){
            this.ShowMessage(this.$t('backoffice.form.validate.validate'), this.$t('backoffice.form.validate.state'), this.$t('backoffice.form.validate.validateSetting'));
            return;
        }
        if (this.states.includes(state))
        {
            this.ShowMessage(this.$t('backoffice.form.validate.validate'), this.$t('backoffice.form.validate.duplicateState'), this.$t('backoffice.form.validate.validateSetting'));
            return
        }
        this.states.push(state.toUpperCase());
        this.newState = '';
        document.getElementById('newState').value = '';
        
    },
    addZipcodeExclude(newVal){
        var hills = LibCodes.lookup(newVal);
        if (!hills)
        {
            this.ShowMessage(this.$t('backoffice.form.validate.validate'), this.$t('backoffice.form.validate.zipCode'), this.$t('backoffice.form.validate.validateSetting'));
            return;
        }
        if (this.zipcodesExcludes.includes(newVal))
        {
            this.ShowMessage(this.$t('backoffice.form.validate.validate'), this.$t('backoffice.form.validate.duplicateZipCode'), this.$t('backoffice.form.validate.validateSetting'));
            return;
        }
        this.zipcodesExcludes.push(newVal);
        this.newZipcodeState = 0;
        document.getElementById('newZipcodeExclude').value = '';
    },
    addEvent(event){
        if (event == '')
        {
            this.ShowMessage(this.$t('backoffice.form.validate.validate'), this.$t('backoffice.form.validate.eventRequire'), this.$t('backoffice.form.validate.validateSetting'));
            return;
        }
        if (this.events.includes(event))
        {
            this.ShowMessage(this.$t('backoffice.form.validate.validate'), this.$t('backoffice.form.validate.duplicateEvent'), this.$t('backoffice.form.validate.validateSetting'));
            return;
        }
        this.events.push(event);
        this.newEvent = 0;
        document.getElementById('newEvent').value = '';
    },
    delZipcodeExclude(val){
       this.zipcodesExcludes.splice(this.zipcodesExcludes.indexOf(val), 1);
    },
    delState(val){
       this.states.splice(this.states.indexOf(val), 1);
    },
    delEvent(event){
        this.events.splice(this.events.indexOf(event), 1);
    },
    addTip(value){
        
        if (value == 0)
        {
            this.ShowMessage(this.$t('backoffice.form.validate.validate'), this.$t('backoffice.form.validate.tip'), this.$t('backoffice.form.validate.validateSetting'));
            return;
        }
        if (this.tips.includes(value))
        {
            this.ShowMessage(this.$t('backoffice.form.validate.validate'), this.$t('backoffice.form.validate.tip'), this.$t('backoffice.form.validate.validateSetting'));
            return;
        }
        this.tips.push(value);
        this.tips.sort();
        document.getElementById('newTip').value = "";
        this.newTip = 0;
    },
    delTip(val){
        this.tips.splice(this.tips.indexOf(val), 1)
    },
    getCityAndState(zipCode){
        var hills = LibCodes.lookup(zipCode);
        if(hills){
            return hills.state + ' | ' + hills.city
        }
        return ''
    },
    delCode(val){
       this.zipCodes.splice(this.zipCodes.indexOf(val), 1);
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
    saveReservationDateAndTime(){
        let reservation = [] 
        if (!this.sameHourForAllDays){
            if (this.activeMonday){
                reservation.push({
                    "Day": 'Monday',
                    "OpenHour": Moment(this.mondayOpenHour, 'HH:mm').toISOString(),
                    "CloseHour": Moment(this.mondayCloseHour, 'HH:mm').toISOString(),
                })
            }
            if (this.activeTuesday){
                reservation.push({
                    "Day": 'Tuesday',
                    "OpenHour": Moment(this.tuesdayOpenHour, 'HH:mm').toISOString(),
                    "CloseHour": Moment(this.tuesdayCloseHour, 'HH:mm').toISOString(),
                })
            }
            if (this.activeWednesday){
                reservation.push({
                    "Day": 'Wednesday',
                    "OpenHour": Moment(this.wednesdayOpenHour, 'HH:mm').toISOString(),
                    "CloseHour": Moment(this.wednesdayCloseHour, 'HH:mm').toISOString(),
                })
            }
            if (this.activeThursday){
                reservation.push({
                    "Day": 'Thursday',
                    "OpenHour": Moment(this.thursdayOpenHour, 'HH:mm').toISOString(),
                    "CloseHour": Moment(this.thursdayCloseHour, 'HH:mm').toISOString(),
                })
            }
            if (this.activeFriday){
                reservation.push({
                    "Day": 'Friday',
                    "OpenHour": Moment(this.fridayOpenHour, 'HH:mm').toISOString(),
                    "CloseHour": Moment(this.fridayCloseHour, 'HH:mm').toISOString(),
                })
            }
            if (this.activeSaturday){
                reservation.push({
                    "Day": 'Saturday',
                    "OpenHour": Moment(this.saturdayOpenHour, 'HH:mm').toISOString(),
                    "CloseHour": Moment(this.saturdayCloseHour, 'HH:mm').toISOString(),
                })
            }
            if (this.activeSunday){
                reservation.push({
                    "Day": 'Sunday',
                    "OpenHour": Moment(this.sundayOpenHour, 'HH:mm').toISOString(),
                    "CloseHour": Moment(this.sundayCloseHour, 'HH:mm').toISOString(),
                })
            }
        }
        else{
            reservation = [
                {
                  "Day": 'Monday',
                  "OpenHour": Moment(this.mondayOpenHour, 'HH:mm').toISOString(),
                  "CloseHour": Moment(this.mondayCloseHour, 'HH:mm').toISOString(),
                },
                {
                  "Day": 'Tuesday',
                  "OpenHour": Moment(this.mondayOpenHour, 'HH:mm').toISOString(),
                  "CloseHour": Moment(this.mondayCloseHour, 'HH:mm').toISOString(),
                },
                {
                  "Day": 'Wednesday',
                  "OpenHour": Moment(this.mondayOpenHour, 'HH:mm').toISOString(),
                  "CloseHour": Moment(this.mondayCloseHour, 'HH:mm').toISOString(),
                },
                {
                  "Day": 'Thursday',
                  "OpenHour": Moment(this.mondayOpenHour, 'HH:mm').toISOString(),
                  "CloseHour": Moment(this.mondayCloseHour, 'HH:mm').toISOString(),
                },
                {
                  "Day": 'Friday',
                  "OpenHour": Moment(this.mondayOpenHour, 'HH:mm').toISOString(),
                  "CloseHour": Moment(this.mondayCloseHour, 'HH:mm').toISOString(),
                },
                {
                  "Day": 'Saturday',
                  "OpenHour": Moment(this.mondayOpenHour, 'HH:mm').toISOString(),
                  "CloseHour": Moment(this.mondayCloseHour, 'HH:mm').toISOString(),
                },
                {
                  "Day": 'Sunday',
                  "OpenHour": Moment(this.mondayOpenHour, 'HH:mm').toISOString(),
                  "CloseHour": Moment(this.mondayCloseHour, 'HH:mm').toISOString(),
                },
            ]
        }
        return reservation
    },

    saveSetting: async function(){

        if (this.isValidForm()){

            this.isBackdrop = true;
            let item = this.$store.state.backConfig.setting;

            item = {
              "SelectPickHour": this.selectPickHour,
              "MinTimeToCook": this.minTimeToCook,
              "PickFrom": this.pickFrom,
              "PickTo": this.pickTo,
              "ShowCooker": this.showCooker,
              "ZipCodes": this.zipCodes,
              "DeliveryZone": this.deliveryZone,
              "CanViewGeolocation": this.canViewGeoposition,
              "ShowOtherRestaurant": this.showOthersRestaurant,
              "ViewRating": this.canViewRating,
              "ViewDelivery": this.viewDelivery,
              "ViewOnTable": this.viewOnTable,
              "ViewCurbside": this.viewCurbside,
              "TablePrefix": this.tablePrefix,
              "BarPrefix": this.barPrefix,
              "RoomPrefix": this.roomPrefix,
              "TipRequire": this.tipRequire,
              "Devices": this.DeviceList,
              "Tips": this.tips,
              "HasDeliveryPayment": this.HasDeliveryPayment,
            }

            if (this.viewCatering){

              item["ViewCatering"] = this.viewCatering
              item["MinAmoutCatering"] = this.minAmoutCatering
              item["MinAmountCateringDelivery"] = this.minAmountCateringDelivery
              item["PartialPay"] = this.partialPay
              item["PayForQuotation"] = this.payForQuotation
              item["PercentPayForQuotation"] = this.percentPayForQuotation
              item["CateringMarginDays"] = this.cateringMarginDays
              item["CateringStates"] = this.states
              item["ZipCodesExcludes"] = this.zipcodesExcludes
              item["CateringEvents"] = this.events
            }

            if (this.viewReservation){
              item["ReservationByTable"] = this.reservationByTable
              item["ReservationByStaff"] = this.reservationByStaff
              item["TablesChoose"] = this.tablesChoose
              item["ViewReservation"] = this.viewReservation
              item["ViewCustomerReservation"] = this.viewCustomerReservation
              item["MinDayToReservation"] = this.minDayToReservation
              item["HasReservationQuotation"] = this.payForReservarionQuotation
              item["PayForReservationQuotation"] = this.amountPayForReservarionQuotation
              item["ReservationDaysAndTime"] = this.saveReservationDateAndTime()
            }

            if (this.viewLoyalty)
            {
                item["ViewLoyalty"] = this.viewLoyalty
                item["LoyaltyExpirationMonths"] = this.loyaltyExpirationMonths
                item["LoyaltyMinPointToBuy"] = this.loyaltyMinPointToBuy
                item["LoyaltyPointMoney"] = this.loyaltyPointMoney
            }

            //If I am editing
            if (this.id){
              item['_id'] = this.id;
              this.spinner = true;
              await Api.putIn(this.modelName, item)
                  .then(response => {
                        this.$store.state.backConfig.setting = item;
                        this.init();
                        this.showToastMessage(this.$t('backoffice.list.messages.messageEditSuccessSetting'), "success");
                        this.spinner = false;                       
                        return response;
                  })
                  .catch(e => {
                        e;
                        this.spinner = false
                        this.ifErrorOccured(this.saveSetting);
                  })
            }
           
        }
    },

    async doBackup(){
        this.$ionic.alertController.create({
        title: "Backup",
        message: "Do you want to save a backup? This action replace the old backup saved.",
        buttons: [
        {
            text: this.$t('backoffice.list.messages.buttons.cancel'),
            role: 'cancel',
            handler: () => {
            
            }
        },
        {
            text: "Ok",
            handler: async () => {
                this.spinner = true
                await Api.backUpToPortal()
                .then(response => {
                    if (response.data.msg != "")
                        location.href = response.data.msg;
                    this.spinner = false
                    this.showToastMessage('The backup was save successfully', 'success')
                })
                .catch(e => {
                    e
                    this.spinner = false
                    this.showToastMessage('An error was occur', 'danger')
                })                
            }
        }
        ]
    })
    .then(a => a.present());

    },

    addDevice()
    {
        if (!this.DeviceList.find(dev => dev.Name == this.newDevName))
        {
            const dev = {
            "Name": this.newDevName,
            "Company": this.newDevCompany,
            "Ip": this.newDevIpAddress,
            "Port": this.newDevPort ,
            "SSL": this.sslDev
            }
            this.DeviceList.push(dev)

            this.newDevName = ''
            this.newDevCompany = 'shift4',
            this.newDevIpAddress = '127.0.0.1',
            this.newDevPort = '90001',
            this.sslDev = true
        }
        else{
            this.showToastMessage('The device name already exist.', 'danger')
        }
        
    },

    delDevice(device){
        this.DeviceList.splice(this.DeviceList.indexOf(device), 1);
    },

    handleFile: function(event)
    {
                this.createFile(event.target.files[0])
     
    },

    createFile: function(fileObject){
        const reader = new FileReader();

        reader.onload = (e) => {
            this.backupFile = e.target.result;
        };
        reader.readAsText(fileObject);
    },

    async doRestoreFromFile(){

        try{

            const backObj = JSON.parse(this.backupFile)
           
          
            const bytes  = Cripto.AES.decrypt(backObj.criptoInfo, 'M3nuSuc3ss*2020S0lut1onsF0rBackupR3st0r3');
            const decryptedData = JSON.parse(bytes.toString(Cripto.enc.Utf8));          

            this.$ionic.alertController.create({
            title: "Backup",
            message: "Do you want to restore a backup? This backup file was generated: " + decryptedData.date + ". All changes you do will lose.",
            buttons: [
            {
                text: this.$t('backoffice.list.messages.buttons.cancel'),
                role: 'cancel',
                handler: () => {
                    
                }
            },
            {
                text: "Ok",
                handler: async () => {

                    if (typeof backObj.restaurant === 'object' && 
                        typeof backObj.setting === 'object' && Array.isArray(backObj.occupation)
                            && Array.isArray(backObj.staff) && Array.isArray(backObj.rol) 
                                && backObj.occupation.length > 0 && backObj.rol.length > 0)
                                {
                                    const restaurantID = this.$store.state.user.RestaurantId
                                    if (restaurantID === decryptedData.restaurantId)
                                    {
                                        this.spinner = true
                                        const item = JSON.stringify(backObj)
                                        await Api.restoreBackUpFromFile(item)
                                        .then(() => {
                                            this.spinner = false
                                            this.showToastMessage('The backup was save successfully', 'success')
                                        })
                                        .catch(e => {
                                            e
                                            this.spinner = false
                                            this.showToastMessage('An error was occur', 'danger')
                                        })
                                    }
                                    else{
                                        this.showToastMessage('This backup is not from this restaurant.', 'danger')
                                    }
                                    
                                }
                
                }
            }
            ]
            })
            .then(a => a.present());

        }
        catch(e){
            this.showToastMessage("This is not a valid backupfile.", "danger")
            e
        }
        
    },

    async doRestoreFromPortal(){
        
        this.$ionic.alertController.create({
        title: "Backup",
        message: "Do you want to restore a backup? All changes you do will lose.",
        buttons: [
        {
            text: this.$t('backoffice.list.messages.buttons.cancel'),
            role: 'cancel',
            handler: () => {
            
            }
        },
        {
            text: "Ok",
            handler: async() => {
                this.spinner = true
                await Api.restoreBackUpFromPortal()
                .then(() => {
                    this.spinner = false
                    this.showToastMessage('The backup was save successfully', 'success')
                })
                .catch(e => {
                    e
                    this.spinner = false
                    this.showToastMessage('An error was occur', 'danger')
                })                
            }
        }
        ]
    })
    .then(a => a.present());
    }

  },

    

}
    
</script>

<style>

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