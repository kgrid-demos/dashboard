<template>
  <div>
    <navbar></navbar>
 	  <router-view></router-view>
  </div>
</template>
<script>
import navbar from './components/navbar.vue';
import eventBus from './eventBus.js';
import axios from 'axios';

export default {
  name: 'app1',
  data: function () {
    return {

    };
  },
  created: function () {
    var self=this;
    axios.get("./static/json/default.json").then( response=> {
      self.$store.commit('init', response.data)
      }).catch(e=>{
        console.log(e)
      });
  },
  components: {
    navbar
  },
	computed:{

	},
	mounted:function(){

	},
  methods:{

	}
};
</script>
<style>
#app {
  font-family: 'Open Sans', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #777;
  margin-top: 0px;
}
</style>
