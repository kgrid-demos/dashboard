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
				<div class='col-md-2 col-sm-2 col-xs-2 ' @click='selectcancertype(0)' style="padding:0px;"><div class='station' style="padding:4px;margin-left:-1px;" :class='{active:cancertypeselection==0}'><p>Breast Cancer</p></div></div>
				<div class='col-md-2 col-sm-2 col-xs-2 ' @click='selectcancertype(1)' style="padding:0px;"><div class='station' style="padding:4px;margin-left:-1px;" :class='{active:cancertypeselection==1}'><p>GI Cancer</p></div></div>
				<div class='col-md-2 col-sm-2 col-xs-2 ' @click='selectcancertype(2)' style="padding:0px;"><div class='station' style="padding:4px;margin-left:-1px;" :class='{active:cancertypeselection==2}'><p>Lung Cancer</p></div></div>
				<div class='col-md-1 col-sm-1 col-xs-1'></div>
			</div>
			<div class='row' style="margin:10px 0px;">
				<div class='col-md-1 col-sm-1 col-xs-1'></div>
				<div class='col-md-4 col-sm-4 col-xs-4 ' style="padding:0px;"><div class='ft-wt-6 ft-sz-16 mar-top10'><p class='ft-wt-6 ft-sz-16'>Group ID</p></div></div>
				<div class='col-md-6 col-sm-6 col-xs-6' style="padding:0px;"><input type='number' v-model='groupid' :min='groupidmin' :max='groupidmax'/></div>
				<div class='col-md-1 col-sm-1 col-xs-1' style="padding:0px;"></div>
			</div>
			<div class='row' style="margin:10px 0px;">
				<div class='col-md-1 col-sm-1 col-xs-1'></div>
				<div class='col-md-4 col-sm-4 col-xs-4 ' style="padding:0px;"><div class='ft-wt-6 ft-sz-16 mar-top10'><p class='ft-wt-6 ft-sz-16'>Start with Training Mode</p></div></div>
				<div class='col-md-6 col-sm-6 col-xs-6' style="padding:0px;"><input type='checkbox' v-model='trainstart'/></div>
				<div class='col-md-1 col-sm-1 col-xs-1' style="padding:0px;"></div>
			</div>
		 <div class='row' style='text-align:center;'>
				 <button @click='savesettings'>Apply</button>
			</div>
		</div>
	</modal>
	<applayout>
		<div slot='banner'>
			<p style='height:60px;'></p>
		</div>
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
export default {
  name: 'cover',
	data : function() {
		return {
			tstation:0,
			settingShow:false,
			searchQuery: '',
			cancertypeselection:0,
			groupid:1,
			trainstart:true,
			startwithtrain:true,
			gridColumns: ['id','name', 'age','gender','type'],
			options:['Breast Cancer', "GI Cancer", "Lung Cancer"],
			stations:['A','B','C','D']
		}
	},
	created : function() {
		var self=this;
		var lastsunday = this.$moment().day(-7);
		var obj={start:0, end:0, days:7};
		this.loadPatientDataIntoStorage();
		obj.end=this.$moment().day(6).endOf('day').unix();   //next Saturday
		obj.start=this.$moment().day(obj.days-7).startOf('day').unix() //last Sunday
		console.log("Start at: "+obj.start+"  End at:"+obj.end)
		console.log("Start at: "+this.$moment.unix(obj.start).format()+"  End at:"+this.$moment.unix(obj.end).format())
		this.$store.commit("setcurrentdaterange",obj)
		this.$eventBus.$on("config",function(){
			self.settingShow=true;
		})
		this.tstation=this.$store.getters.getStationID;
		this.groupid=this.$store.getters.getcurrentGroup.id
		this.cancertypeselection=this.$store.getters.getCurrentCancerType.id
	},
	beforeDestroy:function(){
		this.$eventBus.$off("config");
	},
	mounted:function(){
		this.$store.commit('setScreenname','Start Page')
	},
	computed : {
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
		loadPatientDataIntoStorage: function() {
		  if(!this.$store.getters.hasLoadedPatientData) {

        var self = this;
				var getprodata = this.$http.get("./static/json/db.json")
				var getsimudata = this.$http.get("./static/json/simudata.json")

        this.$http.all([getprodata, getsimudata]).then(this.$http.spread(function(prodata,simudata) {
					console.log("loading pro data...")
					console.log(prodata.data)
					console.log(simudata.data)
          self.$store.commit("loadPatientData", prodata.data.patients);
					self.$store.commit("loadsimudata", simudata.data);
        }));
      }
    },
		selectstation:function(i){
			this.tstation=this.stations[i]
		},
		savesettings:function(){
			this.$store.commit('selcancertype',{'value':this.cancertypeselection})
			this.$store.commit('setgroupid',{'value':this.groupid});
			this.$store.commit('settrainingmode',this.trainstart)
			if(this.trainstart) this.$store.commit('resettraininglayout')
			this.$store.commit('setteststationid', this.tstation);
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
.kg-btn-primary{
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
.kg-btn-primary:hover{
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
