import Vue from 'vue';
import VueRouter from 'vue-router';
import Vuex from 'vuex';
import App from './App';
import store from './store';
import eventBus from './eventBus.js';
import axios from 'axios';
import moment from 'moment';
import ToggleButton from 'vue-js-toggle-button';
require('es6-promise').polyfill();

Vue.config.debug = false;
Vue.prototype.$http = axios
Vue.prototype.$moment = moment
Vue.prototype.$eventBus= eventBus
Vue.use(VueRouter);
Vue.use(Vuex);
Vue.use(ToggleButton);

if(process.env.NODE_ENV == 'production'){
 if ('serviceWorker' in navigator) {
   window.addEventListener('load', () => {
     navigator.serviceWorker.register('/sw.js').then(registration => {
       console.log('SW registered: ', registration);
     }).catch(registrationError => {
       console.log('SW registration failed: ', registrationError);
     });
   });
 }
}

const routes = [{ path : '/', component : require('./components/cover.vue')	},
                { path : '/list', component : require('./components/home.vue')	},
                { path : '/datagenerator', component: require('./components/datagenerator.vue') },
                { path : '/logview', component: require('./components/logview.vue') },
                { path : '/dashboard/:id', name : 'patient', component : require('./components/patientdetail.vue'), data: function(){
                	   	console.log("current Patient ID:"+ this.$route.params.id);   }	}
                ];
const router = new VueRouter({
  mode:'history',
	routes : routes,
  history: true,
  hashbang : false,
});
var vm = new Vue({
	router : router,
	el: '#app',
  store,
	data : {},
	components:{	App: App	},
	created: function(){
    console.log('Dashboard Web Application');
  	this.$eventBus.$on("return", function(){
			router.push({ path: '/list' });
		});
		this.$eventBus.$on("patientSelected", function(id){
			router.push({ name:'patient' ,params: { id: id}});
		});
	}
}).$mount('#app');
