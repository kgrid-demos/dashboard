<template>
  <div>
    <navbar></navbar>
 	  <router-view></router-view>
  </div>
</template>
<script>
import navbar from './components/navbar.vue';
import eventBus from './eventBus.js';

export default {
  name: 'app1',
  data: function () {
    return {

    };
  },
  created: function () {

  },
  components: {
    navbar
  },
	computed:{
    ifDebug: function(){
      return this.store.state.debugEnabled;
    }
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
