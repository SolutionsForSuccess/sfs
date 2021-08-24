<template>
    
    <div >
        <div>
            <ion-item 
                    color="success" 
                    expand="block"
                    v-if="nextAction==='Clockin'" 
                    :disabled="spinner"
                    @click="clockin()">
                   <span class="iconify" data-icon="bi:clock"></span>
                     <!-- <ion-icon slot="start" name="cart"></ion-icon> -->
                    {{$t('backoffice.titles.clockin')}}
                           
            </ion-item>
            
            <ion-item 
                color="danger" 
                expand="block"
                v-if="nextAction === 'Clockout'" 
                :disabled="spinner"
                @click="clockout()">
                <span class="iconify" data-icon="bi:clock-fill"></span>
                {{$t('backoffice.titles.clockout')}}                     
            </ion-item>

        </div>  
               
    </div>

</template>

<script>
import { Api } from '../api/api.js';
import moment from 'moment';
import { EventBus } from '../../frontend/event-bus';

export default {

    data(){
        return{
            StaffId: this.$store.state.user._id,
            nextAction: 'Clockin',
            attendanceDay: [],
            spinner: false,
        }
    },

    created(){

        console.log('Aqdvdgui');
        
        this.getNextAction()
    },

    methods:{

        getFormatDate(date){
            return moment(date).format('LLL')
        },     
        async getNextAction(){
            this.attendanceDay = this.$store.state.backConfig.attendance;

            if (this.attendanceDay.length > 0){
                if (this.attendanceDay[this.attendanceDay.length - 1].Type == 'Clockin'){
                    console.log("CLOCKOUT")
                    return this.nextAction = 'Clockout'
                }   
                else{
                    console.log("CLOCKIN")
                    return this.nextAction = 'Clockin'
                }
            }
            else{
                return this.nextAction = 'Clockin'
            }  
        },

        async clockin(){
            let item = {
                "StaffId": this.StaffId,
                "Type": "Clockin"
            }
            this.spinner = true;
            await Api.postIn('Attendance', item)
            .then(() => {                
                this.$store.state.backConfig.attendance.push(item);
                 this.spinner = false;
                this.getNextAction();               
                EventBus.$emit('clockIn', true);
            })
            .catch(e => {
                console.log(e)
                this.spinner = false;
            })
        },

        async clockout(){
            let item = {
                "StaffId": this.StaffId,
                "Type": "Clockout"
            }
            this.spinner = true;
            await Api.postIn('Attendance', item)
            .then(() => {                
                this.$store.state.backConfig.attendance.push(item);
                 this.spinner = false;
                this.getNextAction();               
            })
            .catch(e => {
                console.log(e);
                this.spinner = false;
            })
        }
    },
    
}
</script>