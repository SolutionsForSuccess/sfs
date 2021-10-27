<template>
  <div :class="list || isOrder? 'horizontal-pop' : 'vertical-pop'">
    <!-- class="hide-md" -->
   
    
              <ion-button
                fill="clear"
                :color="list? 'primary': 'light'"  
                :class="list? '' : 'pop-btn'"
                v-if="edit" 
                v-tooltip="'Edit'"
                @click="editElement()"          
              >
                  <ion-icon slot="icon-only" icon="create"></ion-icon>
              </ion-button>

              <ion-button
                fill="clear"
                :color="list? 'primary': 'light'"  
                :class="list? '' : 'pop-btn'"
                v-if="see" 
                v-tooltip="'See'"
                @click="editElement()"          
              >
                  <ion-icon slot="icon-only" icon="eye"></ion-icon>
              </ion-button>

              <ion-button
                fill="clear"
               :color="list? 'primary': 'light'"  
                :class="list? '' : 'pop-btn'"
                v-tooltip="'Delete'"
                v-if="(remove && !isOrder) || (remove && isOrder && element.State === 0 && !element.isTicket )"
                @click="deleteElement()"          
              >
                 <ion-icon slot="icon-only" icon="trash"></ion-icon>
              </ion-button>

              <ion-button
                fill="clear"
               :color="list? 'primary': 'light'"  
                :class="list? '' : 'pop-btn'"
                v-if="showQrTable"
                @click="showQrTableM()"          
              >              
                  <ion-icon slot="icon-only" icon="ios-qr-scanner"></ion-icon>
              </ion-button>

             <ion-button
                fill="clear"
               :color="list? 'primary': 'light'"  
                :class="list? '' : 'pop-btn'"
                v-if="showOrderTable "
                @click="showOrderTableM()"          
              >              
               <ion-icon slot="icon-only" icon="cart"></ion-icon>
              </ion-button>
             

              <div v-if="isOrder">

                 <ion-button
                    fill="clear"
                  :color="list? 'primary': 'light'"  
                    :class="list? '' : 'pop-btn'"
                    v-if="add"
                    v-tooltip="'Reorder'"
                    @click="reOrder()"          
                  >              
                  <ion-icon slot="icon-only" icon="cart"></ion-icon>
                </ion-button>

                <ion-button
                    fill="clear"
                    :color="list? 'primary': 'light'"  
                    :class="list? '' : 'pop-btn'"
                    v-if="element.OrderType==='Curbside'"
                    v-tooltip="'Curbside Details'"
                    @click="curbsideDetail()"          
                  >              
                  <ion-icon slot="icon-only" icon="car"></ion-icon>
                </ion-button>

                 <ion-button
                    fill="clear"
                    :color="list? 'primary': 'light'"  
                    :class="list? '' : 'pop-btn'"
                    v-if="element.State === 0 && element.OrderQrCode"
                    v-tooltip="'Qr Payment'"
                  >              
                  <ion-icon slot="icon-only" icon="md-qr-scanner"></ion-icon>
                </ion-button>

                <ion-button
                    fill="clear"
                  :color="list? 'primary': 'light'"  
                    :class="list? '' : 'pop-btn'"
                    v-if="![0,6,5].includes(element.States) && !$store.state.user.IsDriver"
                    v-tooltip="'Cancel Order'"
                    @click="cancelOrder()"          
                  >              
                  <ion-icon slot="icon-only" icon="close"></ion-icon>
                </ion-button>

                
                
                <div v-if="element.OrderType==='Delivery'" style="    display: contents;">
                  <div v-if="delivery  && $store.state.user.IsDriver">

                     <ion-button
                      fill="clear"
                      :color="list? 'primary': 'light'"  
                      :class="list? '' : 'pop-btn'"
                      v-if=" !element.IsAccept && notAccepted"
                      v-tooltip="'Acept for Delivery'"
                      @click="acceptOrder()"          
                      >              
                      <ion-icon slot="icon-only" icon="checkmark"></ion-icon>
                    </ion-button>

                     <ion-button
                      fill="clear"
                      :color="list? 'primary': 'light'"  
                      :class="list? '' : 'pop-btn'"
                      v-if=" element.IsAccept "
                      v-tooltip="'Not Acept for Delivery'"
                      @click="notAcceptOrder()"          
                      >              
                      <ion-icon slot="icon-only" icon="close"></ion-icon>
                    </ion-button>

                     <ion-button
                      fill="clear"
                      :color="list? 'primary': 'light'"  
                        :class="list? '' : 'pop-btn'"
                        v-if="element.IsAccept"
                        @click="writeLocalization()"          
                      >              
                      <ion-icon slot="icon-only" icon="navigate"></ion-icon>
                    </ion-button>

                  </div>

                  <ion-button
                    fill="clear"
                    :color="list? 'primary': 'light'"  
                      :class="list? '' : 'pop-btn'"
                      v-if="!$store.state.user.IsDriver && element.State == 4 && element.IsAccept"
                      v-tooltip="'Show Driver Location'"
                      @click="showDeliveringLocation()"          
                    >              
                    <ion-icon slot="icon-only" icon="locate"></ion-icon>
                  </ion-button>
  
                  <ion-button
                    fill="clear"
                    :color="list? 'primary': 'light'"  
                      :class="list? '' : 'pop-btn'"
                      v-if="element.State === 5 "
                      v-tooltip="'Show Travel'"
                      @click="showTravel()"          
                    >              
                    <ion-icon slot="icon-only" icon="recording"></ion-icon>
                  </ion-button>
                 

                </div>

              </div>

              <ion-button
                fill="clear"
                :color="list? 'primary': 'light'"  
                :class="list? '' : 'pop-btn'"
                v-if="showClock"
                @click="showTime()"          
                >              
                <ion-icon slot="icon-only" icon="time"></ion-icon>
              </ion-button>

           
  </div>
</template>

<script>
export default {
  name: "Popover",
   props: {
    list: {
      type: Boolean,
      default: true,
    } ,
    edit: {
      type: Boolean,
      default: false,
    },
    add: {
      type: Boolean,
      default: false,
    },
    see: {
      type: Boolean,
      default: false,
    },
    remove: {
      type: Boolean,
      default: false,
    },
    id: {
      type: String,
      default: 'xx',
    },
    showQrTable: {
      type: Boolean,
      default: false,
    },
    element: {
      type: Object,
      default: ()=> {}
    },
    showOrderTable:{
      type: Boolean,
      default: false,
    },
    isOrder:{
      type: Boolean,
      default: false
    },
    delivery: {
      type: Boolean,
      default: false,
    },
     notAccepted: {
      type: Boolean,
      default: false,
    },
    showClock: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    editElement() {
      this.$emit("editElement", this.id);
    },
    deleteElement() {
      this.$emit("deleteElement", this.id);
    },
    showOrderTableM() {
      this.$emit("showOrderTableM", this.element.Name);
    },
    showQrTableM(){
       this.$emit("showQrTableM", this.element.Seats);
    },
    reOrder(){     
      this.$emit("reOrder", this.element);
    },

    curbsideDetail(){
       this.$emit('curbsideDetail', this.element);
    },

    cancelOrder(){
      this.$emit('cancelOrder', this.element);
    },

    acceptOrder() {
      this.$emit('acceptOrder', this.element);
    },

    notAcceptOrder() {
      this.$emit('notAcceptOrder', this.element);
    },

    writeLocalization() {
      this.$emit('writeLocalization', this.element);
    },

    showDeliveringLocation() {
      this.$emit('showDeliveringLocation', this.element);
    },

    showTravel() {
      this.$emit('showTravel', this.element);
    },

     showTime() {
      this.$emit("showTime", this.element._id);
    },

  

  },
}
</script>

<style >
  .pop-btn{
    --padding-start: 0;
    --padding-end: 0;
  }
  .vertical-pop{
        position: relative;
    top: -5px;
    right: -5px;
    display: flex;
    flex-direction: column;
  }
  .horizontal-pop{
    position: absolute;
    top: 5px;
    right: 5px;
    display: flex;
    flex-direction: row;
  }
</style>
