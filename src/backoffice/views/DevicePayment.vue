<template>
    <div>
        <ion-header>
            <ion-toolbar>
                <ion-title>Payment order</ion-title>
            </ion-toolbar>
        </ion-header>
        <div class="ion-padding">
                <ion-item>
                    <ion-label>Device type</ion-label>
                    <ion-select interface="popover" ok-text="Ok" cancel-text="Cancel"
                    @ionChange="deviceType = $event.target.value" v-bind:value="deviceType">
                        <ion-select-option key="shift4" value="shift4" >Shift4</ion-select-option>
                        <ion-select-option key="tsys" value="tsys" >Tsys</ion-select-option>
                    </ion-select>
                </ion-item>
                <ion-item>
                    <ion-label>Communication modeff</ion-label>
                    <ion-select interface="popover" ok-text="Ok" cancel-text="Cancel"
                    @ionChange="modeId = $event.target.value" v-bind:value="modeId">
                        <ion-select-option key="ipaddress" value="ipaddress" >Ip address</ion-select-option>
                        <ion-select-option key="serial" value="serial" >Serial number</ion-select-option>
                    </ion-select>
                </ion-item>
                <ion-item v-if="modeId === 'serial'">
                    <ion-label position="floating"><span style="color: red">*</span>DeviceSN</ion-label>
                    <ion-input type="text" name="name"
                    @input="sn = $event.target.value" 
                    v-bind:value="sn">
                    </ion-input>
                </ion-item>
                <br/>
                <ion-item v-if="modeId === 'ipaddress'">
                    <ion-label position="floating"><span style="color: red">*</span>Ip</ion-label>
                    <ion-input type="text" name="name"
                    @input="ip = $event.target.value" 
                    v-bind:value="ip">
                    </ion-input>
                </ion-item>
                <br/>
                <ion-item v-if="modeId === 'ipaddress'">
                    <ion-label position="floating"><span style="color: red">*</span>Port</ion-label>
                    <ion-input type="text" name="name"
                    @input="port = $event.target.value" 
                    v-bind:value="port">
                    </ion-input>
                </ion-item>
                <br/>
                <ion-item>
                    <p>SSL</p>
                    <ion-checkbox
                        slot="end"
                        @ionChange="ssl=$event.target.checked"
                        :checked="ssl"
                        >
                    </ion-checkbox>
                </ion-item>
                <br/>

                <ion-button fill="outline" @click="dismissModal()">CLOSE</ion-button>
                <ion-button :disabled="(sn === '' && ip === '' && port ==='') || (sn === '' && ip === '' && port !== '') || (sn === '' && ip !== '' && port === '')"  fill="outline" @click="doCredit()"><span class="iconify" data-icon="ic:twotone-payments" data-inline="false"></span> PAY</ion-button>

                <div v-if="spinner" style="margin: 10px; padding: 30px 0;">
                    <ion-progress-bar  color="primary" type="indeterminate" reversed="true"></ion-progress-bar>
                </div>
               
        </div>
    </div>
</template>

<script>

    import { Devices } from '../api/devices.js';
    // import { EventBus } from '../../frontend/event-bus';

    export default {
        
    name: 'demo',
    
    data () {

        return {
            sn: '',
            serverId: '',
            modeId: 'ipaddress',
            transactionType: this.deviceTransactionType,
            ip: '',
            port: '',
            ssl: false,
            spinner: false,
            deviceType: 'shift4',
            taxesName: '',
            payData: {},
        }
        
    },
    created(){
        // this.getDeviceInfoBySerialNo('1170174939')
        this.serverId = this.grandfather.$store.state.user.ServerId.toString()
        this.payData = this.datas;
        this.payData.ClerkID = this.serverId
        this.payData.transactionType = this.transactionType
        this.payData.destinationZipCode = this.grandfather.$store.state.restaurantActive.restaurantZipCode
        // this.getTax()

        //loading device
        const device = this.grandfather.$store.state.device
        this.ip = device.ip
        this.port = device.port
        this.sn = device.sn
    },
    props: {
        datas: { type: Object, default:() => {} },
        parent: { type: Object, default: null },
        grandfather: { type: Object, default: null },
        deviceTransactionType: { type: String, default: '01' },
    },
    methods: {
      
        changeModeId(val){
            this.modeId = val
        },
        async getDeviceInfoBySerialNo(number){
            const res = await Devices.a930.getDeviceInfoBySN(number)

            if (res.data){
                if (window.DOMParser)
                {
                    let parser = new DOMParser();
                    let xmlDoc = parser.parseFromString(res.data, "text/xml");
                    const code = xmlDoc.getElementsByTagName("ResultCode")[0].childNodes[0].nodeValue
                    if (code == 0)
                    {
                        const ipaddres = xmlDoc.getElementsByTagName("IPaddress")[0].childNodes[0].nodeValue
                        const port = xmlDoc.getElementsByTagName("Port")[0].childNodes[0].nodeValue
                        this.ip = ipaddres
                        this.port = port
                        return true
                    }
                    else{
                        return false
                    }
                }
                else // Internet Explorer
                {
                    let xmlDoc = new window.ActiveXObject("Microsoft.XMLDOM");
                    xmlDoc.async = false;
                    xmlDoc.loadXML(res.data);
                    const code = xmlDoc.getElementsByTagName("ResultCode")[0].childNodes[0].nodeValue
                    if (code == 0)
                    {
                        const ipaddres = xmlDoc.getElementsByTagName("IPaddress")[0].childNodes[0].nodeValue
                        const port = xmlDoc.getElementsByTagName("Port")[0].childNodes[0].nodeValue
                        this.ip = ipaddres
                        this.port = port
                        return true
                    }
                    else{
                        return false
                    }

                    
                }   
            }
            else{
                return false
            }
        },
        callback(res){
            
            if (res[4] == '000000')
            {
                const resData = {
                        "total": parseInt(res[8][0])/100,
                        "transId": res[6][3],
                        "transIdDevice": res[10][0],
                        "accountNumber": res[9][0],
                        "expirationCard": res[9][2],
                        "accountType": res[9][7],
                        "method": 'Device',
                        "moto": 'fb',
                }
            
                this.parent.responseDevicePay(resData)
                this.showToastMessage('El pago se realizó exitosamente', 'success')
                this.spinner = false
            }
            else if (res[4] == '100001')
            {
                this.showToastMessage('Time out', 'danger')
                this.spinner = false
            }
            else if (res[4] == '000100')
            {
                this.showToastMessage('Decline', 'danger')
                this.spinner = false
            }
            else{
                this.showToastMessage('Other errer', 'danger')
                this.spinner = false
            }
            
            this.dismissModal()
        },
        initialize(){
            try{
                Devices.a930.Initialize(this.ip, this.port, this.ssl, this.callback)
            }
            catch(e){
                e
                this.showToastMessage('Ha ocurrido un error. El pago no se ha podido realizar', 'danger')
                this.dismissModal()
            }
        },
        async doCredit(){

            if (this.modeId == 'serial'){

                if (this.deviceType == 'shift4')
                {

                    const val = await this.getDeviceInfoBySerialNo(this.sn) 

                    if (val){
                      
                        try{
                            
                            this.spinner = true
                            await Devices.a930.DoCredit(this.ip, this.port, this.ssl, this.payData, this.callback);
                        }
                        catch(e){
                            e
                            this.showToastMessage(e, 'danger')
                            this.spinner = false;
                        }
                    }
                    else{
                        this.showToastMessage('ERROR: There was an error get IP address and port of the device.', 'danger')
                    }

                }

              

                
            }
            else{

                if (this.deviceType == 'shift4')
                {

                    try{    
                        this.spinner = true
                        await Devices.a930.DoCredit(this.ip, this.port, this.ssl, this.payData, this.callback);
                    }
                    catch(e){
                        e
                        this.showToastMessage(e, 'danger')
                        this.spinner = false;
                    }

                }

            }   
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