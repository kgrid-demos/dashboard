<template>
<div class='content'>
	<applayout>
		<div slot='banner'>
			<div class='row mar-0'>
				<div class='col-md-2 col-sm-2 col-xs-2 '></div>
				<div class='col-md-8 col-sm-8 col-xs-8 '>
					<form id="logsearch">
						<i class='fa fa-search'></i>
						<input name="query" spellcheck=false v-model="logsearchQuery" @keypress.enter="enterPressed">
					</form>
				</div>
				<div class='col-md-1 col-sm-1 col-xs-1 '></div>
			</div>
		</div>
		<div slot='main'>
			<div class='row mar-0'>
				<div class='col-md-2 col-sm-2 col-xs-2  ht-full'>				</div>
				<div class='col-md-8 col-sm-8 col-xs-8  ht-full'>
					<loggrid
	    			:data="data"
	    			:columns="gridColumns"
	    			:filter-key="logsearchQuery"
						v-on:selected='selected'>
	  			</loggrid>
				</div>
				<div class='col-md-2 col-sm-2 col-xs-2 ht-full'></div>
			</div>
		</div>
	</applayout>
</div>
</template>
<script>
import applayout from './applayout.vue';
import loggrid from './loggrid.vue';
export default {
  name: 'logview',
	data : function() {
		return {
			logsearchQuery: '',
			filteron:false,
			data:[]
		}
	},
	created : function() {
		var self = this
		this.$http.post('http://localhost:3601/processedlog',
				{"query":"SELECT B.station, A.* FROM logentrypair A INNER JOIN teststation B ON B.groupid = A.group_id"})
				.then(function(response){
					self.data=response.data
					console.log(self.data)
				})
	},
	mounted:function(){
		this.$store.commit('setScreenname','Log View')
	},
	computed : {
		gridColumns: function(){
			if(this.filteron){
				return ['id','name', 'age','gender']
			}else {
				return ['station','patient_id','group_id','start', 'end','layoutbefore','layoutafter']
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
		currentGroup: function(){
		  return this.$store.getters.getcurrentGroup;
		},
	},
	methods : {
		enterPressed: function(e){
				e.preventDefault();
		},
		selected: function(t){
			console.log(this.data[t].patient_id+this.data[t].group_id);

			this.$store.commit('setgroupid',{value:this.data[t].group_id})
			this.$store.commit('setCurrentPatientIndex',{'pid':this.data[t].patient_id,'group':this.data[t].group_id});
			this.$store.commit('setpatientlayoutfromlog', this.data[t])
			this.$eventBus.$emit("patientSelected",this.data[t].patient_id);
		}
	},
	components:{
		applayout,
		loggrid
	}
};
</script>
<style scoped>
.mar-0 {
	margin:0px;
}
form#logsearch {
	width:100%;
		padding:10px 20px 10px 20px;
		line-height:1.5em;
		border:1px solid#e5e5e5;
		margin-bottom: 20px;
}
form#logsearch input {
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
