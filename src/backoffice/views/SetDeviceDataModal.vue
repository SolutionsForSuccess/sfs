<template>
    <!-- <div class="modal"> -->
        <!-- <ion-header>
            <ion-toolbar>
                <ion-title>Set Device Data</ion-title>
            </ion-toolbar>
        </ion-header> -->
        <!-- <div class="ion-padding"> -->
                <!-- <div style="width: 150px; display:inline-block; ">
                    <ion-card>
                        <ion-img :src="require('../assets/a930.jpg')"></ion-img>
                    </ion-card>
                </div>     -->

                <ion-item>
                    <ion-label>Server device</ion-label>
                    <ion-select  interface="popover" icon="add"
                    :ok-text="'ok'" 
                    :cancel-text="'cancel'"
                    @ionChange="device=$event.target.value,save()" v-bind:value="device">
                        <ion-select-option v-for="dev in devices" v-bind:key="dev.Name" v-bind:value="dev.Name" >{{dev.Name}} | {{dev.Company}}</ion-select-option>
                    </ion-select>
                </ion-item>
                <!-- <br/> -->

                <!-- <ion-button fill="outline" @click="dismissModal()">Cancel</ion-button>
                <ion-button :disabled="device == ''"  fill="outline" @click="save()"> Save</ion-button> -->
        <!-- </div> -->
    <!-- </div> -->
</template>

<script>
import store from '../../main'

    export default {
        
    name: 'setDeviceDataModal',
    
    data () {

        return { 
            devices: [],
            device: '',
        }
        
    },

    created(){      

        this.devices = store.state.backConfig.setting.Devices;
        const dev = store.state.device;
        if(dev.name) this.device = dev.name;
    },

    props: {
        parent: { type: Object, default: null },
    },

    methods: {
       
        findDevice(name){
            return this.devices.find(dev => dev.Name == name)
        },

        async save(){
            const dev = this.findDevice(this.device);
            const obj = {
                'name': dev.Name,
                'company': dev.Company,
                'ip': dev.Ip,
                'port': dev.Port,
            }
            store.commit("setDevice", obj);
            // this.$ionic.modalController.dismiss(null);
        },

        dismissModal() {
            this.$ionic.modalController.dismiss(null);
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

    }

}

</script>