<template>
    
    <div class="screen">

      
        <div style="margin-top: 20px">
            <vue-clock></vue-clock>

            <ion-card style="margin-top: 50px; padding:20px">
                <ion-label>{{$t('backoffice.titles.timesheet')}}</ion-label>
                <ion-list>
                    <ion-item v-for="(assist, index) in this.$store.state.backConfig.attendance" :key="index"
                     :color="assist.Type == 'Clockin' ? 'success' : 'danger'">
                        <ion-label>{{ getFormatDate(assist.DateTime)}}</ion-label>
                        <ion-item-group side="end">
                            <ion-label>{{assist.Type}}</ion-label>
                        </ion-item-group>
                    </ion-item>
                </ion-list>
            </ion-card>

        </div>

    </div>

</template>

<script>

import moment from 'moment';
import Clock from './ClockInOut.vue'

export default {

    data(){

        return{
         
        }
        
    },
    components:{   
        VueClock: Clock,    
    }, 
    created(){
        
    },
    methods:{
        getFormatDate(date){
            return moment(date).format('LLL')
        },
    },
    
}
</script>