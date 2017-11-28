<template>
<div class='content'>
	<applayout>
		<div slot='banner'>
			<div class='row' v-show='stationSelected && !filterEnabled'>
				<div class='col-md-2 col-sm-2 col-xs-2 '></div>
				<div class='col-md-8 col-sm-8 col-xs-8 '>
					<form id="search">
						<i class='fa fa-search'></i>
						<input name="query" spellcheck=false v-model="searchQuery">
					</form>
				</div>
				<div class='col-md-1 col-sm-1 col-xs-1 '></div>
			</div>
		</div>
		<div slot='main'>
			<div class='row' v-if="stationSelected && !filterEnabled">
				<div class='col-md-2 col-sm-2 col-xs-2  ht-full'>
					<div>
										<p style='text-align:center'></p>
						<ul class='groupids'><li v-for='(num,index) in groups' @click='selectgroup(index)' :class="{'active': currentGroup.id==num}">{{num}}</li></ul>
					</div>

				</div>
				<div class='col-md-8 col-sm-8 col-xs-8  ht-full'>
					<kogrid
	    			:data="patients"
	    			:columns="gridColumns"
	    			:filter-key="searchQuery"
						:groupid="currentGroup.id"
						v-on:selected='selected'>
	  			</kogrid>
				</div>
				<div class='col-md-2 col-sm-2 col-xs-2 ht-full'></div>
			</div>
			<div class='row' v-else>
				<div class='col-md-2 col-sm-2 col-xs-2  ht-full pad-0'></div>
				<div class='col-md-2 col-sm-2 col-xs-2  ht-full pad-0' @click='selectStation(-1)'><div class='station'><p class='ht-full '>All Patient</p></div></div>
				<div class='col-md-2 col-sm-2 col-xs-2  ht-full pad-0' @click='selectStation(0)'><div class='station'><p class='ht-full '>Breast Cancer</p></div></div>
				<div class='col-md-2 col-sm-2 col-xs-2  ht-full pad-0' @click='selectStation(1)'><div class='station'><p class='ht-full '>GI Cancer</p></div></div>
				<div class='col-md-2 col-sm-2 col-xs-2  ht-full pad-0' @click='selectStation(2)'><div class='station'><p class='ht-full '>Lung Cancer</p></div></div>
				<div class='col-md-2 col-sm-2 col-xs-2  ht-full pad-0'></div>
			</div>
		</div>
	</applayout>
</div>
</template>
<script>

import applayout from './applayout.vue';
import kogrid from './kogrid.vue';

export default {
    name: 'home',
	data : function() {
		return {
			searchQuery: '',
			gridColumns: ['id','name', 'age','gender','type'],
		}
	},

	created : function() {
		var self=this;
		this.loadPatientDataIntoStorage();

	},
	mounted:function(){

	},
	updated: function() {

	  },
	computed : {
		filterEnabled : function(){
			return this.$store.getters.getfilterEnable
		},
		groups:function(){
				var n = this.$store.getters.getmaxgroupinuse;
				var arr=[];
				for(var i=0; i<n; i++){
					arr.push(i);
				}
				return arr
		},
		currentGroup: function(){
			return this.$store.getters.getcurrentGroup;
		},
		patients: function() {
			var self =this;
			var ptlist = this.$store.getters.getPatientList;
			var plist =[];
			if(self.currentGroup.id==-1){
				return ptlist.filter(function(e, pos){
  				return ptlist.map(function(e) {return e.id}).indexOf(e.id)== pos ;
					});
			}else {
				return ptlist.filter(function(e){
				  return (e.groupid==self.currentGroup.id)});
			}

		},
		datalength:function(){
			return this.$store.getters.getDataLength;
			},
		stationSelected: function(){
			return true
		},
		currentGroup: function(){
		  return this.$store.getters.getcurrentGroup;
		},
	},
	methods : {
		selected: function(t){
			console.log(this.patients[t].id+this.patients[t].groupid);
			this.$store.commit('setCurrentPatientIndex',{'pid':this.patients[t].id,'group':this.patients[t].groupid});
			this.$eventBus.$emit("patientSelected",this.patients[t]);
		},
		selectStation: function(i){
			this.$store.commit('selstation',{value:i});
		},
		selectgroup: function(index){
			this.$store.commit('setgroupid',{value:index});
		},
    loadPatientDataIntoStorage: function() {
		  if(!this.$store.getters.hasLoadedPatientData) {
        const baseDataUrl = 'http://localhost:3001/patients/';
        let that = this;
        this.$http.get(baseDataUrl).then(response => {
          that.$store.commit("loadPatientData", response.data);
        });
      }
    }
	},
	components:{
		applayout,
		kogrid
	}
};
</script>
<style scoped>
form#search {
	width:100%;
		padding:10px 20px 10px 20px;
		line-height:1.5em;
		border:1px solid#e5e5e5;
		margin-bottom: 20px;
}
form#search input {
	width: 96%;
	line-height:1.5em;
	padding:10px 10px;
}

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
.station {
text-align: center;
vertical-align: middle;
padding:20px;
 position:relative;
 top:50%;
 background-color:#0075bc;
 border: 2px solid #0075bc;
 margin:20px;
	cursor:pointer;
	border-radius: 15px;
}


.station p{
font-size: 28px;
font-weight: 700;
color:#fff;
    transform: translateY(35%);
		}


		.station:hover {
		 background-color:#fff;
		}
		.station:hover p{
			color: #0075bc;
			}
h1 small {
	font-size:50%;
}
ul.groupids li {
position:relative;
 text-align: center;
 cursor: pointer;
 font-size: 18px;
 font-weight: 400;
 color:#eeeeee;
 margin: 0px 200px 10px 0px;
 border: 1px dashed #e5e5e5;

	padding: 10px;
	background-color: #f7f7f7;
	transition: all 0.3s ease;
}
ul.groupids li:hover {
	color:#555555;
}

ul.groupids li.active {
 font-weight: 800;
 color:#333333;
  border-right: none;
 margin: 0px 140px 10px 0px;
}

ul.groupids li.active:after {
  content: '';
  position: absolute;
  top: -1px; right: -50px;
	border: 1px dashed #e5e5e5;
  width: 100%; height: 100%;
  background: #f7f7f7;
  -webkit-transform-origin: 100% 0;
  -ms-transform-origin: 100% 0;
  transform-origin: 100% 0;
  -webkit-transform: skew(-45deg);
  -ms-transform: skew(-45deg);
  transform: skew(-45deg);
	z-index:-1;
}




</style>
