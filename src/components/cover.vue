<template>
<div class='content'>
	<modal v-if="settingShow">
		<h3 slot="header">Set up the test station</h3>
		<div slot="body">
			<div class='row' style="margin:10px 0px;">
				<div class='col-md-1 col-sm-1 col-xs-1'></div>
				<div class='col-md-4 col-sm-4 col-xs-4 ' style="padding:0px;"><div class='ft-wt-6 ft-sz-16 mar-top10'><p class='ft-wt-6 ft-sz-16'>Test Station ID</p></div></div>

				<div class='col-md-6 col-sm-6 col-xs-6' style="padding:0px;">
					<div class='inline' v-for='(item, index) in stations' @click='selectstation(index)' style="padding:0px;margin-left:-1px;width:25%;"><div class='station' :class='{active:tstation==item}'><p>{{item}}</p></div></div>
				</div>
				<div class='col-md-1 col-sm-1 col-xs-1' style="padding:0px;"></div>
			</div>
			<div class='row' style="margin:10px 0px;">
				<div class='col-md-1 col-sm-1 col-xs-1'></div>
				<div class='col-md-4 col-sm-4 col-xs-4 ' @click='selectcancertype(-1)' style="padding:0px;"><div class='ft-wt-6 ft-sz-16 mar-top10'><p class='ft-wt-6 ft-sz-16'>Cancer Type</p></div></div>
				<div class='col-md-2 col-sm-2 col-xs-2 ' v-for='(op,index) in options' @click='selectcancertype(index)' style="padding:0px;"><div class='station' style="padding:4px;margin-left:-1px;" :class='{active:cancertypeselection==index}'><p>{{op}}</p></div></div>
				<div class='col-md-1 col-sm-1 col-xs-1'></div>
			</div>
			<div class='row' style="margin:10px 0px;">
				<div class='col-md-1 col-sm-1 col-xs-1'></div>
				<div class='col-md-4 col-sm-4 col-xs-4 ' style="padding:0px;"><div class='ft-wt-6 ft-sz-16 mar-top10'><p class='ft-wt-6 ft-sz-16'>Session</p></div></div>
				<div class='col-md-6 col-sm-6 col-xs-6' style="padding:0px;"><input id='sid' type='number' v-model='groupid' :min='groupidmin' :max='groupidmax'/></div>
				<div class='col-md-1 col-sm-1 col-xs-1' style="padding:0px;"></div>
			</div>
				<div class='row' style="margin:10px 0px;">
				<div class='col-md-1 col-sm-1 col-xs-1'></div>
				<div class='col-md-4 col-sm-4 col-xs-4 ' style="padding:0px;"><div class='ft-wt-6 ft-sz-16 mar-top10'><p class='ft-wt-6 ft-sz-16'>Start with Training Mode</p></div></div>
				<div class='col-md-6 col-sm-6 col-xs-6' style="padding:0px;">
					<toggle-button id='changed-font' v-model='trainstart' :labels="{checked: 'YES', unchecked: 'NO'}" :color="{checked: '#0075BC', unchecked: '#B3B3B3'}" :width='80' :height='30'/></div>
				<div class='col-md-1 col-sm-1 col-xs-1' style="padding:0px;"></div>
			</div>
		</div>
		<div slot='footer'>
		 <div class='row' style='text-align:right; padding-right:30px;'>
				 <button class='kg-btn' @click='savesettings(true)'>Apply</button>
				 <button class='kg-btn-secondary' @click='savesettings(false)'>Cancel</button>
			</div>
		</div>
	</modal>
	<applayout>
		<div slot='banner'>			<p style='height:60px;'></p>		</div>
		<div slot='main'>
			<div class='row'>
				<div class='hgroupselector'>
					<p style='text-align:center;' class='ft-sz-20'>TEST STATION  <span class='ft-sz-32 ft-wt-6 pad-l-20'> {{tstation}}</span></p>
					<p style='text-align:center;' class='ft-sz-16 mar-top30'>Patient Case Type: <span class='ft-sz-32 ft-wt-6 pad-l-20'> {{options[cancertypeselection]}}</span></p>
					<p style='text-align:center;' class='ft-sz-16 mar-top30'>SESSION ID:  <span class='ft-sz-32 ft-wt-6 pad-l-20'> {{groupiddisp}}</span></p>
				</div>
			</div>
			<div class='row' style='text-align:center;color:#0075bc;'>
				<button class='kg-btn-primary' style='margin-top:120px;' @click='clickstart'>START</button>
			</div>
		</div>
	</applayout>
</div>
</template>
<script>
import applayout from './applayout.vue';
import modal from './modal.vue';
import ToggleButton from 'vue-js-toggle-button';

export default {
  name: 'cover',
	data : function() {
		return {
			tstation:0,
			settingShow:false,
			cancertypeselection:0,
			groupid:1,
			trainstart:true,
			stations:['A','B','C','D']
		}
	},
	created : function() {
		var self=this;
		this.$eventBus.$on("config",function(){
			self.settingShow=true;
		})
		this.init()
	},
	mounted:function(){
		this.$store.commit('setScreenname','Start Page')
	},
	computed : {
		options:function(){
			return this.$store.getters.getcancertypes
		},
		groupidmin:function(){
			return this.cancertypeselection*12+1
		},
		groupidmax:function(){
			return (this.cancertypeselection+1)*12
		},
		groupiddisp:function(){
			var t=this.groupid+''
			if(this.groupid<10) t='0'+t
			return this.tstation+t
		},
		currentGroup: function(){
			return this.$store.getters.getcurrentGroup;
		}
	},
	methods : {
		init:function(){
			this.tstation=this.$store.getters.getStationID;
			this.groupid=this.$store.getters.getcurrentGroup.id
			this.cancertypeselection=this.$store.getters.getCurrentCancerType.id
		},
		selectstation:function(i){
			this.tstation=this.stations[i]
		},
		savesettings:function(b){
			if(b){
				this.$store.commit('selcancertype',{'value':this.cancertypeselection})
				this.$store.commit('setgroupid',{'value':this.groupid});
				this.$store.commit('settrainingmode',this.trainstart)
				if(this.trainstart) this.$store.commit('resettraininglayout')
				this.$store.commit('setteststationid', this.tstation);
			}else {
				this.init()
			}
			this.settingShow=false
		},
		selectcancertype: function(i){
			this.cancertypeselection=i;
			this.groupid=this.groupidmin;
		},
		clickstart:function(){
			var trainmode=this.$store.getters.gettrainmode
			if(trainmode){
				this.$store.commit('setCurrentPatientIndex',{'pid':'training','group':this.currentGroup});
				this.$store.commit('setcurrentpatientid',{id:'training'});
				this.$router.push({ 'name':'patient' ,'params': { 'id': 'training'}});
			}else {
				this.$router.push({path:"/list"})
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
.kg-btn-primary, .kg-btn, .kg-btn-secondary {
	background-color:#fff;
	border:1px solid #0075bc;
	padding:5px 10px;
	margin:10px 10px;
	display:inline-block;
	color:#0075bc;
	transition:all 0.5s ease;
	font-weight:600;
	font-size:24px;
}
.kg-btn, .kg-btn-secondary {
	font-size: 18px;
}
.kg-btn-secondary {
	color: #666;
	border:none;
}
.kg-btn-primary:hover, .kg-btn:hover{
	background-color:#0075bc;
	color:#fff;
	border:1px solid #fff;
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
input#sid {
	font-size:20px;
	margin: 10px auto;
	border: 1px solid #e7e7e7;
	text-align:center;
	min-width: 160px;
}
input#chek {
	width: 25px;
	height:25px;
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
.vue-js-switch#changed-font {
  font-size: 16px;
}
</style>
