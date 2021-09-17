<template>
    
    <div class="screen">

      
        <div style="margin-top: 20px">
            <vue-clock v-if="userId===defaultUser"></vue-clock>        

            <ion-card style="margin-top: 50px; padding:20px">
                <ion-label>{{$t('backoffice.titles.timesheet')}}</ion-label>
                <ion-list>
                    <ion-item v-for="(assist, index) in allAtendance" :key="index"
                        v-show="assist.StaffId === userId"
                     :color="assist.Type == 'Clockin' ? 'success' : 'danger'">
                        <ion-label>{{ getFormatDate(assist.DateTime)}}</ion-label>
                        <ion-item-group side="end">
                            <ion-label>{{assist.Type}} </ion-label>
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
         allAtendance: [],
        }
        
    },
    components:{   
        VueClock: Clock,    
    }, 
    props: {
      userId: {type: String, default: ''}
  },
    created(){
        this.allAtendance = this.$store.state.backConfig.attendance;
        this.defaultUser = this.$store.state.user._id
        // this.allAtendance.reverse();
    },
    methods:{
        getFormatDate(date){
            return moment(date).format('LLL')
        },
    },
    
}
</script>