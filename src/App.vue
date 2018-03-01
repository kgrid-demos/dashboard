<template>
  <div>
    <navbar></navbar>
 	  <router-view></router-view>
  </div>
</template>
<script>
import navbar from './components/navbar.vue';
import { BASE_URL } from '../static/config';

export default {
  name: 'app1',
  data: function () {
    return {};
  },
  created: function () {
    var t = this.$moment().unix()
    this.$store.commit("settoday", t)
    this.$store.commit("setbaseurl",BASE_URL)
    var self=this;
    this.$http.get("./static/json/default.json").then(response=> {
      if(this.debugging) console.log(response.data)
      self.$store.commit('init', response.data)
    }).catch(e=>{
      console.log(e)
    });
  },
  components: {
    navbar
  },
  computed:{
    debugging:function(){
      return this.$store.getters.isDebugging
    }
  },
	mounted:function(){

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
