<template>
<div class='content'>
	<applayout>
		<div slot='banner'>
			<div class='row'>
			<div class='col-md-2 col-sm-2 col-xs-2 '></div>
			<div class='col-md-8 col-sm-8 col-xs-8 '>
				<form id="search">
					<i class='fa fa-search'></i> <input name="query" v-model="searchQuery">
				</form>
			</div>
			<div class='col-md-1 col-sm-1 col-xs-1 '></div>
			</div>
			</div>
			<div slot='main'>
<div class='row'>
			<div class='col-md-2 col-sm-2 col-xs-2  ht-full'></div>
			<div class='col-md-8 col-sm-8 col-xs-8  ht-full'>

			<kogrid
	    :data="patients"
	    :columns="gridColumns"
	    :filter-key="searchQuery"
			v-on:selected='selected'>
	  </kogrid>


			</div>
			<div class='col-md-2 col-sm-2 col-xs-2 ht-full'></div>

</div>
		</div>
	</applayout>
</div>
</template>
<script>

import applayout from './applayout.vue';
import eventBus from '../eventBus.js';
import kogrid from './kogrid.vue';
export default {
    name: 'home',
	data : function() {
		return {
			searchQuery: '',
			gridColumns: ['ID','Name', 'Age','Gender'],
			gridData: []
		}
	},

	created : function() {
		var self=this;
		self.gridData=[];

	},
	mounted:function(){

	},
	updated: function() {

	  },
	computed : {
		patients: function() {
			return this.$store.getters.getPatientList
		},
		datalength:function(){
			return this.$store.getters.getDataLength;
			}
	},
	methods : {
		selected: function(t){
			console.log(this.patients[t].ID);
			this.$store.commit("setSelectedPatient", this.patients[t]);
			eventBus.$emit("patientSelected",this.patients[t]);

		}
	},
	components:{
		applayout,
		kogrid
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
		height: 40px;
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
