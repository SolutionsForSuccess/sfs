<template>
  <div id="user" class="page">

    <modal name="clock-modal"  width="80%" height="auto" style="left: 0px;width: auto;height: auto; max-width: 500px !important;">
        <ion-buttons slot="start" @click="hideClock()">
                <ion-back-button default-href="home"></ion-back-button>
        </ion-buttons>
        <ion-header>
            <ion-toolbar>
            <ion-title>ClockIn-ClockOut</ion-title>          
            </ion-toolbar>        
        </ion-header>

       
          <Clock :userId="userClock"/>
       
      </modal>
    
    <listView
      :title="title"
      :filter="filterUsers"
      :elements="users"
      :hasImg="true"
      :showClock="true"
      :viewSelected="'Admin'"
      :add="
        !isForDriversSupervisor
          ? hasPermission('canCreateUser')
          : hasPermission('canCreateDriver')
      "
      :edit="
        !isForDriversSupervisor
          ? hasPermission('canEditUser')
          : hasPermission('canEditDriver')
      "
      :remove="
        !isForDriversSupervisor
          ? hasPermission('canDeleteUser')
          : hasPermission('canDeleteDriver')
      "
      @handleInput="handleInput"
      @handleAddClick="
        !isForDriversSupervisor ? goToUserForm() : goToSupervisorForm()
      "   
      @editElement="editUser"
      @deleteElement="deleteUser"   
    ></listView>
  </div>
</template>

<script>
import { Api } from "../api/api.js";
import listView from "../components/ListView";
import Clock from './ClockInClockOut.vue'

export default {
  name: "staff",
  components: {
    listView,
    Clock
  },
  created() {
    this.spinner = true;
    this.isForDriversSupervisor =
      this.$route.params.isForDriversSupervisor || false;
    this.screenWidth = screen.width;
    this.staffOcuppations = this.$store.state.backConfig.occupation;
    this.fetchUsers();
    window.onresize = function() {
      this.screenWidth = screen.width;
    };
  },
  data() {
    return {
      modelName: "Staff",
      keyList: 0,
      users: [],
      filterUsers: [],
      paginate: ["languages"],
      staffOcuppations: [],
      spinner: false,
      screenWidth: 0,
      isForDriversSupervisor: false,
      userClock: ''
    };
  },
  computed: {
    title() {
      return !this.isForDriversSupervisor
        ? this.$t("backoffice.titles.users")
        : this.$t("backoffice.form.titles.drivers");
    },
  },
  methods: {

    async doRefresh() {
      this.spinner = true;
      await Api.fetchAll(this.modelName).then(async response => {
      this.$store.state.backConfig.staff = response.data;
        await this.fetchUsers();  
      this.spinner = false;
      this.keyList ++;
      })
      .catch(e => {
        e;
        this.spinner = false;
    });   
    return;
  },

  ListViewData(option, count){
    if(count === 1) return option.ImageUrl;
    if(count === 2) return option.FirstName;
    if(count === 3) return option.LastName;
    if(count === 4) return option.Email;
    if(count === 5) return this.getStaffOcuppations(option.OccupationId[0].Occupation)

  },
 
    goToUserForm() {
      this.$router.push({
        name: "UserForm",
      });
    },

    goToSupervisorForm() {
      this.$router.push({
        name: "UserForm",
        params: {
          isForDriversSupervisor: this.isForDriversSupervisor,
        },
      });
    },

    showTime(id){
      this.userClock = id;
      this.$modal.show('clock-modal');    
    },

     hideClock () {
    this.$modal.hide('clock-modal');
      },

    ifErrorOccured(action) {
      return this.$ionic.alertController
        .create({
          title: this.$t("backoffice.list.messages.connectionError"),
          message: this.$t("backoffice.list.messages.connectionErrorMessage"),
          buttons: [
            {
              text: this.$t(
                "backoffice.list.messages.buttons.goToAdministration"
              ),
              handler: () => {
                this.$router.push({
                  name: "ControlPanel",
                });
              },
            },
            {
              text: this.$t("backoffice.list.messages.buttons.retry"),
              handler: () => {
                action();
              },
            },
          ],
        })
        .then((a) => a.present());
    },

    handleInput(value) {
      this.filterUsers = this.users;
      const query = value.toLowerCase();
      requestAnimationFrame(() => {
        let cat2 = this.users.filter(
          (item) => item.Email.toLowerCase().indexOf(query) > -1 ||
           item.FirstName.toLowerCase().indexOf(query) > -1 ||
           item.LastName.toLowerCase().indexOf(query) > -1
        );
        if (cat2.length > 0) this.filterUsers = cat2;
        else this.filterUsers = this.users;
      });
    },

    hasPermission(permission) {
      let res = false;
      if (this.$store.state.authenticated) {
        let roles = this.$store.state.roles;
        for (let index = 0; index < roles.length; index++) {
          switch (permission) {
            case "canCreateUser":
              res = roles[index].canCreateUser;
              break;
            case "canEditUser":
              res = roles[index].canEditUser;
              break;
            case "canDeleteUser":
              res = roles[index].canDeleteUser;
              break;
            case "canCreateDriver":
              res = roles[index].canCreateDriver;
              break;
            case "canEditDriver":
              res = roles[index].canEditDriver;
              break;
            case "canDeleteDriver":
              res = roles[index].canDeleteDriver;
              break;
            default:
              break;
          }
          if (res) {
            return res;
          }
        }
      }
      return res;
    },

    ShowMessage(type, message, topic = "") {
      return this.$ionic.alertController
        .create({
          cssClass: "my-custom-class",
          header: type,
          subHeader: topic,
          message: message,
          buttons: [this.$t("backoffice.form.messages.buttons.ok")],
        })
        .then((a) => a.present());
    },

    showToastMessage(message, tColor) {
      return this.$ionic.toastController
        .create({
          color: tColor,
          position: "top",
          duration: 3000,
          message: message,
          showCloseButton: false,
        })
        .then((a) => a.present());
    },

    /****** CRUD category methods ******/
    fetchUsers: function() {
      this.users = this.$store.state.backConfig.staff;
      this.users = this.users.filter(
        (usr) => usr.IsSupport == false || !usr.IsSupport
      );
      if (this.isForDriversSupervisor)
        this.users = this.users.filter(
          (usr) => usr.IsDriver && usr.IsExternalDriver
        );
      else this.users = this.users.filter((usr) => !usr.IsExternalDriver);
      this.filterUsers = this.users;
      
    },

    getStaffOcuppations(OccuppationId) {
      const occ = this.staffOcuppations.filter(
        (ocupp) => ocupp._id === OccuppationId
      );
      if (occ.length > 0) {
        return `${occ[0].Name}`;
      }
      return "";
    },

  

    editUser: function(id) {
      this.$router.push({
        name: "UserForm",
        params: {
          userId: id,
          isForDriversSupervisor: this.isForDriversSupervisor,
        },
      });
    },

    deleteUser: async function(id) {
      return this.$ionic.alertController
        .create({
          title: this.$t("backoffice.list.messages.confirmDelete"),
          message: this.$t("backoffice.list.messages.deleteUser"),
          buttons: [
            {
              text: this.$t("backoffice.list.messages.buttons.cancel"),
              role: "cancel",
              handler: () => {},
            },
            {
              text: this.$t("backoffice.list.messages.buttons.delete"),
              handler: async () => {
                this.spinner = true;
                await Api.deleteById(this.modelName, id)
                  .then((response) => {
                    this.showToastMessage(
                      this.$t(
                        "backoffice.list.messages.messageDeleteSuccessUser"
                      ),
                      "success"
                    );
                    const index = this.$store.state.backConfig.staff.findIndex(
                      (s) => s._id === id
                    );
                    if (index !== -1)
                      this.$store.state.backConfig.staff.splice(index, 1);
                    this.key++;
                    this.fetchUsers();
                    this.spinner = false;
                    return response;
                  })
                  .catch((e) => {
                    e;
                    this.ifErrorOccured((mess) => {
                      this.deleteUser(id);
                      this.spinner = false;
                      return mess;
                    });
                  });
              },
            },
          ],
        })
        .then((a) => a.present());
    },
  },
};
</script>
