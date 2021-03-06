// import '@fortawesome/fontawesome-free/css/all.min.css'
// import 'bootstrap-css-only/css/bootstrap.min.css'
//import 'mdbvue/lib/css/mdb.min.css'
import Vue from "vue";
import Vuex from "vuex";
import VModal from "vue-js-modal";
import { i18n } from "@/plugins/i18n";
import App from "./App.vue";
import VuePaginate from "vue-paginate";
import VTooltip from "v-tooltip";
import Cors from "cors";
import router from "./backoffice/router/index.js";
import VCalendar from "v-calendar";
import "./backoffice/scss/app.scss";

// import VueSocketIO from 'vue-socket.io'

import * as VueGoogleMaps from "vue2-google-maps";

import Ionic from "@ionic/vue";
import "@ionic/core/css/ionic.bundle.css";
import { add } from "ionicons/icons";
import { addCircle } from "ionicons/icons";
import { remove } from "ionicons/icons";
import { trash } from "ionicons/icons";
import { create } from "ionicons/icons";
import { addIcons } from "ionicons";
import { cart } from "ionicons/icons";
import { contact } from "ionicons/icons";
import { hammer } from "ionicons/icons";
import { list } from "ionicons/icons";
import { arrowRoundBack } from "ionicons/icons";
import { arrowBack } from "ionicons/icons";
import { eye } from "ionicons/icons";
import { share } from "ionicons/icons";
import { shareAlt } from "ionicons/icons";
import { call } from "ionicons/icons";
import { mail } from "ionicons/icons";
import { locate } from "ionicons/icons";
import { checkmark } from "ionicons/icons";
import { checkboxOutline } from "ionicons/icons";
import { home } from "ionicons/icons";
import { globe } from "ionicons/icons";
import { pin } from "ionicons/icons";
import { close } from "ionicons/icons";
// import { reader} from "ionicons/icons"
import { refresh } from "ionicons/icons";
import { grid } from "ionicons/icons";
import { print } from "ionicons/icons";
import { checkmarkCircle } from "ionicons/icons";
import { car } from "ionicons/icons";
import { skipBackward } from "ionicons/icons";
import { arrowDropleft } from "ionicons/icons";
import { arrowDropright } from "ionicons/icons";
import { arrowDropdown } from "ionicons/icons";
import { arrowDropup } from "ionicons/icons";
import { arrowRoundUp } from "ionicons/icons";
import { apps } from "ionicons/icons";
import { more } from "ionicons/icons";
import { qrScanner } from "ionicons/icons";
import { navigate } from "ionicons/icons";
import { recording } from "ionicons/icons";
import { image } from "ionicons/icons";
import { time } from "ionicons/icons";
import device from "vue-device-detector";




// import AppMenu from './Menu';
addIcons({
  "ios-add": add.ios,
  "md-add": add.md,
  "ios-add-circle-outline": addCircle.ios,
  "md-add-circle": addCircle.md,
  "ios-remove": remove.ios,
  "md-remove": remove.md,
  "ios-trash": trash.ios,
  "md-trash": trash.md,
  "ios-create": create.ios,
  "md-create": create.md,
  "md-cart": cart.md,
  "ios-cart": cart.ios,
  "md-contact": contact.md,
  "ios-contact": contact.ios,
  "md-hammer": hammer.md,
  "ios-hammer": hammer.ios,
  "md-list": list.md,
  "ios-list": list.ios,
  "md-arrow-round-back": arrowRoundBack.md,
  "ios-arrow-round-back": arrowRoundBack.ios,
  "ios-arrow-back": arrowBack.ios,
  "md-eye": eye.md,
  "ios-eye": eye.ios,
  "md-share": share.md,
  "ios-share": share.ios,
  "md-share-alt": shareAlt.md,
  "ios-share-alt": shareAlt.ios,
  "md-call": call.md,
  "ios-call": call.ios,
  "md-mail": mail.md,
  "ios-mail": mail.ios,
  "md-locate": locate.md,
  "ios-locate": locate.ios,
  "md-checkmark": checkmark.md,
  "ios-checkmark": checkmark.ios,
  "md-checkboxOutline": checkboxOutline.md,
  "ios-checkboxOutline": checkboxOutline.ios,
  "md-home": home.md,
  "ios-home": home.ios,
  "md-globe": globe.md,
  "ios-globe": globe.ios,
  "md-pin": pin.md,
  "ios-pin": pin.ios,
  "md-close": close.md,
  "ios-close": close.ios,
  "md-refresh": refresh.md,
  "ios-refresh": refresh.ios,
  "md-grid": grid.md,
  "ios-grid": grid.ios,
  "md-print": print.md,
  "ios-print": print.ios,
  "md-checkmarkCircle": checkmarkCircle.md,
  "ios-checkmarkCircle": checkmarkCircle.ios,
  "md-car": car.md,
  "ios-car": car.ios,
  "md-arrowDropleft": arrowDropleft.md,
  "ios-arrowDropleft": arrowDropleft.ios,
  "md-arrow-drop-down": arrowDropdown.md,
  "ios-arrow-drop-down": arrowDropdown.ios,
  "md-arrowDropup": arrowDropup.md,
  "ios-arrowDropup": arrowDropup.ios,
  "md-arrow-round-up": arrowRoundUp.md,
  "ios-arrow-round-up": arrowRoundUp.ios,
  "md-arrow-drop-right": arrowDropright.md,
  "ios-arrow-drop-right": arrowDropright.ios,
  "md-arrow-drop-left": arrowDropleft.md,
  "ios-arrow-drop-left": arrowDropleft.ios,
  "md-skipBackward": skipBackward.md,
  "ios-skipBackward": skipBackward.ios,
  "md-apps": apps.md,
  "ios-apps": apps.ios,
  "md-more": more.md,
  "ios-more": more.ios,
  "md-qr-scanner": qrScanner.md,
  "ios-qr-scanner": qrScanner.ios,
  "md-navigate": navigate.md,
  "ios-navigate": navigate.ios,
  "md-recording": recording.md,
  "ios-recording": recording.ios,
  "md-image": image.md,
  "ios-image": image.ios,
  "md-time": time.md,
  "ios-time": time.ios,
});

Vue.use(Ionic);
Vue.use(device);
Vue.use(Vuex);
Vue.use(VModal);
Vue.use(Cors);
// Vue.use(Cors({ maxAge: 604800000, origin: true }));
Vue.use(VTooltip);
Vue.use(VuePaginate);
Vue.use(VCalendar);
Vue.use(VueGoogleMaps, {
  load: {
    // key: 'AIzaSyATqn9NEXjO84wIQKcw4i6_1fgb18Bz4TM'
    // key: 'AIzaSyDYCBGdIbp7XptHUOP2fDJogYvFTbmh5qw'
    key: "AIzaSyBawocz2WyVtKJaJx58SBKZewY1JRONmjk",
  },
});



const store = new Vuex.Store({
  state: {
    authenticated: false,
    user: null,
    roles: [],
    backConfig: {},
    // FRONTEND STATE

    customer: {},
    guess: {},
    allRestaurant: [],
    restaurantActive: {},
    allReservations: [],
    menuSinCatering: [],
    categoryMenuListSinCatering: [],
    categoryMenuConCatering: [],
    menuConCatering: [],
    products: [],
    variants: [],
    categories: [],
    tax: {},
    allTaxes: [],
    shipping: {},
    cart: [],
    order: {},
    allOrders: [],
    allTickets: [],
    configuration: {},
    hasRating: false,
    device: {},
    staffName: "",
    staffId: "",
    restaurantId: "",
    walletConfig: {},
    subscriptors: [],
    customerCredit: {},
    allCustomerCredit: [],
    staffHouseAccount: false,
    restaurantCustomers: [],
    allStaff: [],
  },
  mutations: {
    setAuthentication(state, status) {
      state.authenticated = status;
    },
    setUser(state, userl) {
      state.user = userl;
    },
    setRoles(state, roles) {
      state.roles = roles;
    },
    setBackConfig(state, backConfig) {
      state.backConfig = backConfig;
    },
    // FRONTEND MUTATION
    setCustomer(state, customer) {
      state.customer = customer;
      state.guess = customer;
    },
    setGuess(state, guess) {
      state.guess = guess;
    },
    setAllRestaurant(state, allRestaurant) {
      state.allRestaurant = allRestaurant;
    },
    setAllReservations(state, allReservations) {
      state.allReservations = allReservations;
    },
    setMenuSinCatering(state, menuSinCatering) {
      state.menuSinCatering = menuSinCatering;
    },
    setCategoryMenuListSinCatering(state, categoryMenuListSinCatering) {
      state.categoryMenuListSinCatering = categoryMenuListSinCatering;
    },
    setCategoryMenuConCatering(state, categoryMenuConCatering) {
      state.categoryMenuConCatering = categoryMenuConCatering;
    },
    setMenuConCatering(state, menuConCatering) {
      state.menuConCatering = menuConCatering;
    },
    setProducts(state, producst) {
      state.products = producst;
    },
    setVariants(state, variants) {
      state.variants = variants;
    },
    setCategories(state, categories) {
      state.categories = categories;
    },
    setTax(state, tax) {
      state.tax = tax;
    },
    setShipping(state, shipping) {
      state.shipping = shipping;
    },
    setRestaurantActive(state, restaurantActive) {
      state.restaurantActive = restaurantActive;
    },
    setCart(state, cart) {
      state.cart = cart;
    },
    setOrder(state, order) {
      state.order = order;
    },
    setAllOrder(state, allOrders) {
      state.allOrders = allOrders;
    },
    setAllTickets(state, allTickets) {
      state.allTickets = allTickets;
    },
    setConfiguration(state, configuration) {
      state.configuration = configuration;
    },
    setHasRating(state, hasRating) {
      state.hasRating = hasRating;
    },
    setDevice(state, device) {
      state.device = device;
    },
    setStaffId(state, staffId) {
      state.staffId = staffId;
    },
    setStaffName(state, staffName) {
      state.staffName = staffName;
    },
    setRestaurantId(state, restaurantId) {
      state.restaurantId = restaurantId;
    },
    setWalletConfig(state, walletConfig) {
      state.walletConfig = walletConfig;
    },
    setSubscriptors(state, subscriptors) {
      state.subscriptors = subscriptors;
    },
    setAllTaxes(state, allTaxes) {
      state.allTaxes = allTaxes;
    },
    setCustomerCredit(state, customerCredit) {
      state.customerCredit = customerCredit;
    },
    setAllCustomerCredit(state, allCustomerCredit) {
      state.allCustomerCredit = allCustomerCredit;
    },
    setStaffHouseAccount(state, staffHouseAccount) {
      state.staffHouseAccount = staffHouseAccount;
    },
    setRestaurantCustomers(state, restaurantCustomers) {
      state.restaurantCustomers = restaurantCustomers;
    },
    setAllStaff(state, allStaff) {
      state.allStaff = allStaff;
    },
  },
});


// Vue.use(new VueSocketIO({
//   debug: true,
//   connection: 'http://192.168.50.254:8765',
//   vuex: {
//       store,
//       actionPrefix: 'SOCKET_',
//       mutationPrefix: 'SOCKET_'
//   },
//   // options: { path: "/my-app/" } //Optional options
// }))

export default store;

Vue.config.productionTip = false;

new Vue({
  router: router,
  i18n,
  store: store,
  render: (h) => h(App),
}).$mount("#app");
