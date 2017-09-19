<template>
<div class='content'>
	<applayout>
		<div slot='banner'>
			<div class='bannercontent' >
				<h1 class='pad-l-20'>{{patient.firstname}} {{patient.lastname}} <small class='pad-l-20'>Age {{patient.age}}, {{patient.gender}}</small></h1>
			</div>
		</div>
		<div slot='main'>
			<div class='maincontent'>
			<div class='col-md-2 col-sm-2 col-xs-2 kg-bg-custom-0 ht-full'></div>
			<div class='col-md-10 col-sm-10 col-xs-10 kg-bg-custom-1 ht-full'></div>
			</div>
		</div>
	</applayout>
</div>
</template>
<script>

import applayout from './applayout.vue';
import eventBus from '../eventBus.js';

export default {
    name: 'home',
	data : function() {
		return {
			patient:{firstname:"Bridget",lastname:"Kearns",age:67,gender:"Female"}
		    }},

	created : function() {

	},
	mounted:function(){

	},
	updated: function() {

	  },
	computed : {

	},
	methods : {

	},
	components:{
		'applayout':applayout,

		}
};
</script>
<style scoped>
.bannercontent {
    margin-top: 75px;
    text-align: left;
    margin-bottom: 20px;
    margin: 0 auto;
    line-height: 2em;
		letter-spacing: 0.1em;
    padding-top: 65px;
    background: transparent;
}
.bannercontent h1 {
	line-height:1.3em;
}
.maincontent{
	min-height:200px;
}
.kg-bg-custom-0 {
	background-color:#f5f5f5;
}
.kg-bg-custom-1 {
	background-color:#e5e5e5;
}
.ht-full{
	height: 100%;
	min-height:450px;
}
h1 small {
	font-size:50%;
}
</style>
