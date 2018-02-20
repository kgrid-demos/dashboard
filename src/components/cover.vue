<template>
<div class='content'>
	<modal v-if="settingShow">
		<h3 slot="header">Set up the test station</h3>
		<div slot="body">
			<div class='row' style="margin:10px 0px;">
				<div class='col-md-1 col-sm-1 col-xs-1'></div>
				<div class='col-md-4 col-sm-4 col-xs-4 ' @click='selectStation(-1)' style="padding:0px;"><div class='ft-wt-6 ft-sz-16 mar-top10'><p class='ft-wt-6 ft-sz-16'>Cancer Type</p></div></div>
				<div class='col-md-2 col-sm-2 col-xs-2 ' @click='selectStation(0)' style="padding:0px;"><div class='station' :class='{active:cancertypeselection==0}'><p>Breast Cancer</p></div></div>
				<div class='col-md-2 col-sm-2 col-xs-2 ' @click='selectStation(1)' style="padding:0px;"><div class='station' :class='{active:cancertypeselection==1}'><p>GI Cancer</p></div></div>
				<div class='col-md-2 col-sm-2 col-xs-2 ' @click='selectStation(2)' style="padding:0px;"><div class='station' :class='{active:cancertypeselection==2}'><p>Lung Cancer</p></div></div>
				<div class='col-md-1 col-sm-1 col-xs-1'></div>
			</div>
			<div class='row' style="margin:10px 0px;">
				<div class='col-md-1 col-sm-1 col-xs-1'></div>
				<div class='col-md-4 col-sm-4 col-xs-4 ' style="padding:0px;"><div class='ft-wt-6 ft-sz-16 mar-top10'><p class='ft-wt-6 ft-sz-16'>Test Station ID</p></div></div>
				<div class='col-md-6 col-sm-6 col-xs-6' style="padding:0px;"><input type='number' v-model='groupid' /></div>
				<div class='col-md-1 col-sm-1 col-xs-1' style="padding:0px;"></div>
			</div>
			<div class='row' style="margin:10px 0px;">
				<div class='col-md-1 col-sm-1 col-xs-1'></div>
				<div class='col-md-4 col-sm-4 col-xs-4 ' style="padding:0px;"><div class='ft-wt-6 ft-sz-16 mar-top10'><p class='ft-wt-6 ft-sz-16'>Start with Training Mode</p></div></div>
				<div class='col-md-6 col-sm-6 col-xs-6' style="padding:0px;"><input type='checkbox' v-model='trainstart'/></div>
				<div class='col-md-1 col-sm-1 col-xs-1' style="padding:0px;"></div>
			</div>
		 <div class='row' style='text-align:center;'>
				 <button @click='modalhide'>Apply</button>
			</div>
		</div>
	</modal>
	<applayout>
		<div slot='banner'>
			<div class='row'>
				<div class='hgroupselector'>
					<p style='text-align:center'></p>
				</div>
			</div>
			<div class='row' style='text-align:center;'>
				<button class='knowledgeButton' @click='clickstart'>START</button>
			</div>
		</div>
		<div slot='main'>
		</div>
	</applayout>
</div>
</template>
<script>
import applayout from './applayout.vue';
import modal from './modal.vue';
export default {
  name: 'cover',
	data : function() {
		return {
			settingShow:false,
			searchQuery: '',
			cancertypeselection:0,
			groupid:0,
			trainstart:true,
			startwithtrain:true,
			gridColumns: ['id','name', 'age','gender','type'],
			options:['Breast Cancer', "GI Cancer", "Lung Cancer"]
		}
	},
	created : function() {
		var self=this;
		var lastsunday = this.$moment().day(-7);
		var obj={start:0, end:0, days:7};
		obj.end=this.$moment().day(6).endOf('day').unix();   //next Saturday
		obj.start=this.$moment().day(obj.days-7).startOf('day').unix() //last Sunday
		console.log("Start at: "+obj.start+"  End at:"+obj.end)
		console.log("Start at: "+this.$moment.unix(obj.start).format()+"  End at:"+this.$moment.unix(obj.end).format())
		this.$store.commit("setcurrentdaterange",obj)
		this.$eventBus.$on("config",function(){
			self.settingShow=true;
		})
	},
	beforeDestroy:function(){
		this.$eventBus.$off("config");
	},
	mounted:function(){
		this.$store.commit('setScreenname','Start Page')
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

		stationSelected: function(){
				if(this.filterEnabled){
					var t=this.$store.getters.getCurrentStation.id
					console.log(t)
					return (t!=-1)
				}else{
					return true
				}
		},
		currentGroup: function(){
		  return this.$store.getters.getcurrentGroup;
		},
	},
	methods : {
		savesetting:function(){
			this.settingShow=false;
			this.$store.commit('selstation',{value:i});
		},
		modalhide:function(){
			this.$store.commit('selstation',{'value':this.cancertypeselection})
			this.$store.commit('setgroupid',{'value':this.groupid});
			this.$store.commit('setcurrentgroupid',{'value':this.groupid});
			this.$store.commit('settrainingmode',this.trainstart)
			this.settingShow=false
		},
		selectStation: function(i){
			this.cancertypeselection=i;
			// this.$store.commit('selstation',{value:i});
		},
		selectgroup: function(index){
			this.$store.commit('setgroupid',{value:index});
			this.$store.commit('setcurrentgroupid',{value:index});
		},
		clickstart:function(){
			var trainmode=this.$store.getters.gettrainmode
			if(trainmode){
				this.$store.commit('setCurrentPatientIndex',{'pid':'training','group':this.currentGroup});
				this.$store.commit('setcurrentpatientid',{id:'training'});
				this.$router.push({ 'name':'patient' ,'params': { 'id': 'training'}});
			}else {
				this.this.$router.push({path:"/picker"})
			}
		}
	},
	components:{
		applayout,
		modal
	}
};
</script>
<style scoped>
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
.station {
	text-align: center;
	vertical-align: middle;
	padding:2px;
 	position:relative;
	width:100%;
 	background-color:#fff;
 	border: 1px solid #0075bc;
	cursor:pointer;
}
.station p{
	font-size: 14px;
	font-weight: 700;
	line-height:1.5em;
	color:#0075bc;
	margin:0;
}
.station.active {
	background:#0075bc;
}
.station.active p{
	color:#fff;
}
.station:hover {
	 background-color:#0075bc;
	 opacity:0.7;
}
.station:hover p{
		color: #fff;
	}
h1 small {
	font-size:50%;
}
</style>
