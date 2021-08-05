<template>

    <div>
        <div v-if="typeProp == 'setting'">
            <div style="display: flex;">
                <ion-select style="border: 1px solid darkred; margin-left:5px; border-radius: 3px" interface="popover" icon="add"
                    :ok-text="$t('backoffice.form.messages.buttons.ok')"
                    :cancel-text="$t('backoffice.form.messages.buttons.dismiss')" 
                    :value="adsType"
                    placeholder="Select an Ads type"
                    @ionChange="adsType = $event.target.value">
                        <ion-select-option key="menu" value="menu">Menu</ion-select-option>
                        <ion-select-option key="image" value="image">Image</ion-select-option>
                        <ion-select-option key="video" value="video">Video</ion-select-option>
                        <ion-select-option key="map" value="map">Map</ion-select-option>
                        <ion-select-option key="url" value="url">Url</ion-select-option>
                </ion-select>
                <ion-input v-if="adsType == 'video' || adsType == 'menu' || adsType == 'image' || adsType == 'map' || adsType == 'url'" style="border: 1px solid darkred; margin-left:5px; border-radius: 3px" placeholder="Name" type="text" @input="adsname = $event.target.value" :value="adsname"></ion-input>
                <ion-select v-if="adsType == 'menu'" style="border: 1px solid darkred; margin-left:5px; border-radius: 3px" interface="popover" icon="add"
                    :ok-text="$t('backoffice.form.messages.buttons.ok')"
                    :cancel-text="$t('backoffice.form.messages.buttons.dismiss')" 
                    :value="adsMenu"
                    placeholder="Select an Ads type"
                    @ionChange="adsMenu = $event.target.value; adsname = getMenuNameFromId(val)">
                        <ion-select-option v-for="menu in menus" v-bind:key="menu.Id" v-bind:value="menu._id" >{{menu.Name}}</ion-select-option>
                </ion-select>
                <ion-input v-if="adsType == 'video'" style="border: 1px solid darkred; margin-left:5px; border-radius: 3px" placeholder="Video link" type="text" @input="adsVideo = $event.target.value" :value="adsVideo"></ion-input>
                <ion-input v-if="adsType == 'map'" style="border: 1px solid darkred; margin-left:5px; border-radius: 3px" placeholder="Map link" type="text" @input="adsMap = $event.target.value" :value="adsMap"></ion-input>
                <ion-input v-if="adsType == 'url'" style="border: 1px solid darkred; margin-left:5px; border-radius: 3px" placeholder="Url link" type="text" @input="adsUrl = $event.target.value" :value="adsUrl"></ion-input>
            
                <ion-item-group side="end">
                    <ion-button color="primary" @click="addAds()">
                        <ion-icon slot="icon-only" name="add"></ion-icon>
                    </ion-button>
                </ion-item-group>
            </div>
            <div v-if="adsType == 'image'" style="margin-left:15px; margin-top: 20px">
                <div>
                    <input type="file" accept="image/png, image/jpeg" @change="handleImage" />
                </div>
            </div>
            <div v-if="adsType == 'image'">                            
                <ion-card v-if="checkImage()" >
                    <ion-img :src="adsImage"></ion-img>
                </ion-card>
                <ion-card v-else>
                    {{ $t('backoffice.form.titles.imageText')}}
                </ion-card>
            </div>
            <br />
            <ion-list>
                <ion-item v-for="ads in adsList" v-bind:key="adsList.indexOf(ads)">
                    <ion-label>{{ads.Type}}</ion-label>
                    <ion-label>{{ads.Name}}</ion-label>
                    <ion-label v-if="ads.Type != 'menu' && ads.Type != 'image'">{{ads.Value}}</ion-label>
                    <ion-label v-if="ads.Type == 'menu'">{{ads.Name}}</ion-label>
                    <ion-label v-if="ads.Type == 'image'">
                        <ion-thumbnail>
                            <ion-img :src="ads.Value"></ion-img>
                        </ion-thumbnail>
                    </ion-label>
                    <ion-item-group side="end">
                        <ion-button color="danger" @click="deleteAds(ads)">
                            <ion-icon slot="icon-only" name="trash"></ion-icon>
                        </ion-button>
                    </ion-item-group>
                </ion-item>
            </ion-list>
            
        </div>

        <div v-if="typeProp == 'app'">
            <ion-card>
                <div>
                    <ion-input  style="border: 1px solid darkred; margin:10px; border-radius: 3px; width: 94%" placeholder="Text" type="text" @input="marq_text = $event.target.value" :value="marq_text"></ion-input>
                    <ion-input  style="border: 1px solid darkred; margin:10px; border-radius: 3px; width: 94%" placeholder="Url" type="text" @input="marq_url = $event.target.value" :value="marq_url"></ion-input>
                    <input type="file" accept="image/png, image/jpeg" @change="handleImageMarq" />
                </div>
                <div>
                    <ion-card v-if="checkImageMarq()" >
                         <ion-img :src="marq_img"></ion-img>
                    </ion-card>
                    <ion-card v-else>
                        {{ $t('backoffice.form.titles.imageText')}}
                    </ion-card>
                </div>
            </ion-card>

            <ion-card>
                <div>
                    <ion-input  style="border: 1px solid darkred; margin:10px; border-radius: 3px; width: 94%" placeholder="Text" type="text" @input="card_text = $event.target.value" :value="card_text"></ion-input>
                    <ion-input  style="border: 1px solid darkred; margin:10px; border-radius: 3px; width: 94%" placeholder="Url" type="text" @input="card_url = $event.target.value" :value="card_url"></ion-input>
                    <input type="file" accept="image/png, image/jpeg" @change="handleImageCard" />
                </div>
                
                <div>
                    <ion-card v-if="checkImageCard()" >
                         <ion-img :src="card_img"></ion-img>
                    </ion-card>
                    <ion-card v-else>
                        {{ $t('backoffice.form.titles.imageText')}}
                    </ion-card>
                </div>
            </ion-card>
        </div>

        <br />
        <ion-button expand="full" color="primary" :disabled="!isValidForm()" @click="save()">{{ $t('backoffice.form.buttons.save') }}</ion-button>
    </div>
    
</template>

<script>
import { Api } from '../api/api';
export default {
    name: 'ManageAds',
    data(){
        return{
            setting: null,
            adsType: 'select',
            adsname: '',
            adsMenu: '',
            menus: [],
            adsImage: null,
            adsVideo: '',
            adsMap: '',
            adsUrl: '',
            adsList: [],
            fileName: '',

            // Application
            // Marquesina
            marq_text: '',
            marq_url: '',
            marq_img: null,
            marq_filename: '',

            // Cuadro prieto
            card_text: '',
            card_url: '',
            card_img: null,
            card_filename: '',
        }
    },
    created(){
        Api.fetchAll('Menu')
        .then(response => {
            this.menus = response.data
        })
        .catch(e => {
            console.log(e)
        })
        this.init()
    },
    props:{
        typeProp: {type: String, default: 'setting'}
    },
    methods:{
        init(){
            if (this.typeProp == 'setting'){
                Api.fetchAll('Setting')
                .then(response => {
                    if (response.data.length > 0)
                    {
                        this.setting = response.data[0]
                        this.adsList = this.setting.Ads
                    }
                })
                .catch(e => {
                    console.log(e)
                })
            }
            
            // if (this.typeProp == 'app'){

            // }
        },
        checkImage(){
            return this.adsImage != null;
        },
        checkImageMarq(){
            return this.marq_img != null;
        },
        checkImageCard(){
            return this.card_img != null;
        },
        handleImage: function(event)
        {
            const selectedImage = event.target.files[0];
            this.fileName = selectedImage.name;
            this.createBase64Img(selectedImage);
        },
        handleImageMarq: function(event)
        {
            const selectedImage = event.target.files[0];
            this.marq_filename = selectedImage.name;
            this.createBase64ImgMarq(selectedImage);
        },
        handleImageCard: function(event)
        {
            const selectedImage = event.target.files[0];
            this.card_filename = selectedImage.name;
            this.createBase64ImgCard(selectedImage);
        },
        createBase64Img: function(fileObject){
            const reader = new FileReader();

            reader.onload = (e) => {
                this.adsImage = e.target.result;
            };
            reader.readAsDataURL(fileObject);
        },
        createBase64ImgMarq: function(fileObject){
            const reader = new FileReader();

            reader.onload = (e) => {
                this.marq_img = e.target.result;
            };
            reader.readAsDataURL(fileObject);
        },
        createBase64ImgCard: function(fileObject){
            const reader = new FileReader();

            reader.onload = (e) => {
                this.card_img = e.target.result;
            };
            reader.readAsDataURL(fileObject);
        },
        clearFields(){
            this.adsMenu = ''
            this.adsImage = null
            this.adsVideo = ''
            this.adsMap = ''
            this.adsUrl = ''
        },
        addAds(){
            let val = ''
            if (this.adsType == 'menu'){
                val = this.adsMenu
            }
            if (this.adsType == 'image'){
                val = this.adsImage
            }
            if (this.adsType == 'video'){
                val = this.adsVideo
            }
            if (this.adsType == 'map'){
                val = this.adsMap
            }
            if (this.adsType == 'url'){
                val = this.adsUrl
            }
            let ads = {
                "Type": this.adsType,
                "Value": val,
                "Name": this.adsname
            }
            this.adsList.push(ads)
            this.clearFields()
        },
        deleteAds(ads){
            console.log(ads)
            const index = this.adsList.indexOf(ads)
            this.adsList.splice(index, 1)
        },
        isValidForm(){
            return true;
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
        async save(){
            if (this.typeProp == 'setting'){
                this.setting.Ads = this.adsList
                Api.putIn('Setting', this.setting)
                .then(() => {
                    this.showToastMessage(this.$t('backoffice.list.messages.messageEditSuccessSetting'), "success");
                })  
                .catch(e => {
                    console.log(e)
                })
            }

            if (this.typeProp == 'app'){
                alert('Guardar App Ads')
            }
            
        },
    }

}
</script>