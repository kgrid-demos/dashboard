<template>
<div class='content'>
	<applayout>
		<div slot='banner'>
			<div class='row mar-0'>
				<div class='col-md-2 col-sm-2 col-xs-2 '></div>
				<div class='col-md-8 col-sm-8 col-xs-8 '>
					<form id="search">
						<i class='fa fa-search'></i>
						<input name="query" spellcheck=false v-model="searchQuery" @keypress.enter="enterPressed">
					</form>
				</div>
				<div class='col-md-1 col-sm-1 col-xs-1 '></div>
			</div>
		</div>
		<div slot='main'>
			<div class='row mar-0'>
				<div class='col-md-2 col-sm-2 col-xs-2  ht-full'>				</div>
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
			filteron:true,
		}
	},
	created : function() {
	},
	mounted:function(){
		this.$store.commit('setScreenname','Patient List')
	},
	computed : {
		gridColumns: function(){
			if(this.filteron){
				return ['id','name', 'age','gender']
			}else {
				return ['id','groupid','name', 'age','gender']
			}
		},
		trainmode:function(){
			return this.$store.getters.gettrainmode
		},
		cancertype:function(){
			if(this.trainmode){
				return {id:'99',label:'training'}
			} else {
				return this.$store.getters.getCurrentCancerType
			}
		},
		patients: function() {
			var self =this;
			var ptlist = this.$store.getters.getPatientList(this.filteron);
			var plist =[];
			if(self.currentGroup.id==-1){
				return ptlist.filter(function(e, pos){
  				return ptlist.map(function(e) {return e.id}).indexOf(e.id)== pos ;
					});
			}else {
				return ptlist.filter(function(e){
					if(self.filteron){
				  	return (e.groupid==self.currentGroup.id)
					}else {
						return (e.id!=='training')
					}
				});
			}
		},
		currentGroup: function(){
		  return this.$store.getters.getcurrentGroup;
		},
	},
	methods : {
		enterPressed: function(e){
				e.preventDefault();
		},
		selected: function(t){
			console.log(this.patients[t].id+this.patients[t].groupid);
			this.$store.commit('setCurrentPatientIndex',{'pid':this.patients[t].id,'group':this.patients[t].groupid});
			this.$store.commit('setcurrentpatientid',this.patients[t]);
			this.$eventBus.$emit("patientSelected",this.patients[t].id);
		}
	},
	components:{
		applayout,
		kogrid
	}
};
</script>
<style scoped>
.mar-0 {
	margin:0px;
}
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
    text-align: left;
    margin-bottom: 20px;
    margin: 0 auto;
    line-height: 2em;
		letter-spacing: 0.1em;
    padding-top: 5px;
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
