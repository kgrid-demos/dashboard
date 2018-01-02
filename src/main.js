import Vue from 'vue';
import VueRouter from 'vue-router';
import Vuex from 'vuex';
import draggable from 'vuedraggable';
import VueGridLayout from 'vue-grid-layout';
import App from './App';
import store from './store';
import eventBus from './eventBus.js';
import axios from 'axios';
import moment from 'moment';
import $ from 'jquery';
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

require('es6-promise').polyfill();
// Bootstrap 4
require('jquery');
require('tether');
require('bootstrap');
require('lodash');

// debug mode
Vue.config.debug = false;
Vue.prototype.$http = axios
Vue.prototype.$moment = moment
Vue.prototype.$eventBus= eventBus
// install router
Vue.use(VueRouter);

// install Vee-Validate
//Vue.use(VeeValidate);

//install vuex
Vue.use(Vuex);

// create router
const routes = [
                { path : '/', component : require('./components/home.vue')	},
                { path : '/about', component: require('./components/about.vue') },
                { path : '/datagenerator', component: require('./components/datagenerator.vue') },
                { path : '/patient/:id', name : 'patient', component : require('./components/patientdetail.vue'), data: function(){
                	   	console.log("current Patient ID:"+ this.$route.params.id);
                    }	},
                { path : '/notification', component: require('./components/notification.vue') },
                      	    ];

const router = new VueRouter({
	routes : routes,
  history: true,
  hashbang : false,
});

Vue.directive(
  'click-outside', {
    bind: function(el, binding, vNode) {
    if (typeof binding.value !== 'function') {
        const compName = vNode.context.name
        let warn = `[Vue-click-outside:] provided expression '${binding.expression}' is not a function, but has to be`
        if (compName) { warn += `Found in component '${compName}'` }

        console.warn(warn)
      }
      // Define Handler and cache it on the element
      const bubble = binding.modifiers.bubble
      const handler = (e) => {
        if (bubble || (!el.contains(e.target) && el !== e.target)) {
          binding.value(e)
        }
      }
      el.__vueClickOutside__ = handler

      // add Event Listeners
      document.addEventListener('click', handler)
    },

    unbind: function(el, binding) {
      // Remove Event Listeners
      document.removeEventListener('click', el.__vueClickOutside__)
      el.__vueClickOutside__ = null
    }
  }
)

var vm = new Vue({
	router : router,
	el: '#app',
  store,
	data : {},
	components:{	App: App	},
	created: function(){
		var self=this;
    console.log('Dashboard Web Application');
  	this.$eventBus.$on("return", function(){
			router.push({ path: '/' });
		});
		this.$eventBus.$on("patientSelected", function(id){
			router.push({ name:'patient' ,params: { id: id}});
		});
	  this.$eventBus.$on("patientRemoved", function(obj){
			router.push({ path: '/' });
	  });

	}
	}).$mount('#app');
