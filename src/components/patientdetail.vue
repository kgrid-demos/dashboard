<template>
<div class='content'>
	<modal v-if="showModal">
		<h3 slot="header">Registration in Progress</h3>
		<div slot="body">
			<ul class='modalentry'>
				<li v-for='entry in registrationstatus'>{{entry}}</li>
			</ul>
		</div>
	</modal>
	<applayout>
		<div slot='banner'>
			<div class='bannercontent noselect' >
				<div class='row mar-0'>
					<div class='col-md-1 col-sm-1 col-xs-1  pad-0' v-if='isInEdit'></div>
					<div class='col-md-1 col-sm-1 col-xs-1'>
						<router-link  class='float-r' to='/' v-if='!maximized & !isInEdit' data-toggle="tooltip" title="Click to go back to the patient list">
							<i class='fa fa-arrow-left'></i>
						</router-link>
					</div>
					<div class="col-md-10 col-sm-10 col-xs-10 pad-0">
						<h1 class='pad-l-10'>{{patient.name}}<small class='pad-l-20'>Age {{patient.age}}, {{patient.gender}}</small></h1>
					</div>
				</div>
			</div>
		</div>
		<div slot='main'>
			<div class='maincontent'>
				<div class='col-md-2 col-sm-2 col-xs-2  pad-0 noselect' v-if='isInEdit'>
					<div class='ht-full kg-bg-custom-0' @drop='dropped'>
						<div class='row ft-sz-16 lh-3 txtcenter'> <h3>Widget List</h3></div>
						<div class='wlistctner'>
							<draggable class='wlist' element="ul" :value="widgetInvetoryList" :options="dragOptions"  @start="isDragging=true" @end="isDragging=false">
								<li v-for='(object,index) in widgetInvetoryList' v-bind:key='index'  @dragstart="setdrag(object)" >
									<kocard :object='object.label' :id='object.label' :cflag="object.type" :tileindex='index' draggable='true' ></kocard>
								</li>
							</draggable>
						</div>
					</div>
				</div>
				<div class='col-md-1 col-sm-1 col-xs-1 ht-full  pad-0' v-else></div>
				<div class='col-md-10 col-sm-10 col-xs-10 kg-bg-custom-1 pdd-panel ht-full pad-0' :class='{fading:fading, inedit:isInEdit}'>
					<div class='row ht-50'>
						<div class='col-md-4 col-sm-4 pad-0 noselect' >
							<div class="pad-l-30 pad-t-20 ft-sz-18 ft-italic ft-wt-6">Time Point {{timepoint}} - {{timetitle}}</div>
								<div class="pad-l-15">
						</div>
						</div>
						<div class='col-md-8 col-sm-8 noselect float-r'>
							<div class='float-r' v-if='isInEdit'>
								<button class='kg-btn-primary lg' v-if='isInEdit && pwidgetlist.length==0' @click='loadDefault'> Load Default Layout </button>
								<button class='kg-btn-primary lg' v-if='isInEdit && pwidgetlist.length>0' @click='saveDefault'> Save As Default </button>
								<button class='kg-btn-primary lg' v-if='isInEdit && pwidgetlist.length>0 ' @click='removeAll'> Remove All </button>
								<button class='kg-btn-primary attn lg' v-if='isInEdit' v-show='configready' @click='saveconfig'>Apply Changes</button>
							</div>
							<div style="width:100%;"  v-else>
									<button class='kg-btn-primary lg' v-if='!maximized && !loaddata & pddready' @click='toggleviewmode'> {{timeff}}</button>
									<div class="pad-l-15 inline"  v-if='pwidgetlist.length>=1 && loaddata'>
										<button class='kg-btn-primary ' :disabled="!enablePreArrow" @click='gopreviousweek'> <i class='fa fa-angle-left fa-lg'></i></button>
										<button class='kg-btn-primary labelonly' style='width:360px;'> <span v-if='!maximized'>Week {{weekno}}: </span>{{dateRangeLabel.start}} - {{ dateRangeLabel.end}} </button>
										<button class='kg-btn-primary ' :disabled="!enableNextArrow" @click='gonextweek'> <i class='fa fa-angle-right fa-lg'></i></button>
									</div>
									<button class='kg-btn-primary inline' v-if='!maximized ' @click='toggleEditMode'>Edit</button>
							</div>
						</div>
						</div>
						<div 	ref='gridl' style="min-height:600px;margin-top:10px;">
							<grid-layout :layout.sync="layout"
												:col-num="colnum"
												:row-height="rowheight"
												:is-draggable="isInEdit"
												:is-resizable="isInEdit"
												:vertical-compact="true"
												:margin="[10,10]"
												:use-css-transforms="true"
												@dragenter.native='dragin'
												@dragover.native="hoverin"
												@dragleave.native='dragout'
												@drop.native='dropped'>
								<grid-item v-for="item in layout"
													:x.sync="item.x"
													:y.sync="item.y"
													:w.sync="item.w"
													:h.sync="item.h"
													:maxW=6
													:maxH=3
													:i="item.i"
													ref='item'
													@dragstart.native='dragnative'
													v-bind:key="item.i"	>
														<div class='noselect' v-if='item.c!=""'>
															<div class='row mar-0 widgetTitle' :class='item.c.type' >
																<span class="widgetLabel">{{item.c.label}}</span>
																<i class='fa fa-window-close' style="font-size:15pt; margin-top:-3px;" v-if='isInEdit' @click='removeWidget(item.c.id)'></i>
																<i class='fa fa-window-maximize' v-if='!isInEdit && !maximized && loaddata' title="maximize" style="font-size:11pt" @click='maximizeWidget(item.c.id)'></i>
																<i class='fa fa-window-restore' v-if='!isInEdit && maximized && loaddata' title="restore"  style="font-size:11pt" @click='restoreLayout'></i>
															</div>
														</div>
														<!-- <div class='widgetcontainer'> -->
																	<kotile :object='item.c'  :patientid='$route.params.id' v-on:setinstru='setinstru' v-on:maximizeme="maximizeWidget" :maximized='maximized' :tileindex='item.i' :containerheight="((item.h)*rowheight-10)" :editmode='isInEdit' :viewmode='loaddata' >
																	</kotile>
															<!-- </div> -->
					
												</grid-item>
											</grid-layout>
										</div>
					</div>
			</div>
		</div>
	</applayout>
</div>
</template>
<script>
import VueGridLayout from 'vue-grid-layout';
import draggable from 'vuedraggable'
import applayout from './applayout.vue';
import kotile from './kotile.vue'
import kocard from './kocard.vue'
import modal from './modal.vue'

export default {
    name: 'patientdetail',
	data : function() {
		return {
			colnum:12,
			registrationstatus:[],
			pwidgetlist:[],
			draggedid:"",
			timepoint:1,
			isInEdit:false,
			loaddata:false,
			pddready:false,
			defaultw:3,
			defaulth:6,
			layout:[],
			layoutdim:{x0:0,y0:0,x1:0,y1:0},
			temp:{},
			dragOptions: {
				animation: 0,
				group: 'description',
				disabled: true,
				ghostClass: 'ghost',
			},
			rowheight:100,
			maximized:false,
			showModal:false,
			fading:false,
			contentindrag:'',
		}
	},
	created : function() {
		var self = this;
		var lastsunday = this.$moment().day(-7);
		this.pddready=false;
	  this.$store.commit('setCurrentPatientIndex',{'pid':this.patient.id,'group':this.patient.groupid});
	},
	mounted:function(){
		var self = this;
		var l = this.$refs.gridl
		this.layout=JSON.parse(JSON.stringify(this.patient.layout));
		this.pwidgetlist=this.layout.map(function(e){return e.c.id})
		if(this.pwidgetlist.length==0){
		 	this.pddready=false;
		} else {
			this.pddready=true;
		}
		this.$store.commit('setScreenname','Data View')
	 	window.addEventListener('resize', this.checkGriddim)
	},
	beforeDestroy: function () {
  	window.removeEventListener('resize', this.checkGriddim)
	},
	updated: function() {
	  },
	computed : {

		widgetInuseList:function(){
			var self=this;
			return JSON.parse(JSON.stringify(this.widgetMasterList.filter(function(e){return (this.indexOf(e.id)>=0);},self.pwidgetlist)))
		},
		widgetInvetoryList:function(){
			var self=this;
			return JSON.parse(JSON.stringify(this.widgetMasterList.filter(function(e){return (this.indexOf(e.id)<0);},self.pwidgetlist)))
		},
		simuweekcount:function(){
			switch(this.patient.id){
				case 'PA-67034-001':
					return 12
				case 'PA-67034-007':
					return 8
				default:
					return 24
			}
		},
		simuweeks:function(){
			var arr=[]
			for(var i=1; i<=this.simuweekcount;i++){
				arr.push(i)
			}
			return arr
		},
		simuweekrange:function(){
			var arr=[]
			for(var i=1; i<=this.simuweekcount;i++){
				var obj={}
				obj.start=this.initdate+(i-1)*7*24*3600
				obj.end=this.initdate+i*7*24*3600-1
				arr.push(obj)
			}
			return arr
		},
		timetitle: function(){
			switch (this.timepoint){
				case 1:
					return 'Initialization of PRO-SM tools'
				case 2:
					switch(this.patient.id){
						case 'PA-67034-001':
							return 'Twelve weeks into the treatment'
						default:
							return 'Eight weeks into the treatment'

					}
			}
		},
		wktracker: function(){
			var x= (this.weekno-1)*54
			var w=this.simuweekcount*54
			if(this.maximized){
				x=0
			}else{
				w=54
			}
			return {
	        // transform: `translateX(${x}px)`,
					left: `${x}px`,
					width:`${w}px`
	      }
		},
		timeff:function(){
			return this.simuweekcount+' weeks later...'
		},
		today:function(){
			return this.$store.getters.gettoday
		},
		initdate:function(){
			if(this.$route.params.id=='PA-67034-007'){
				return	this.$moment.unix(this.today).day(-7*7).startOf('day').unix()
			}else {
				return	this.$moment.unix(this.today).day(-11*7).startOf('day').unix()
			}
		},
		datatimestamp:function(){
			return this.$store.getters.getPatientDataTimestamp(this.patient.id)
		},
		timeoffset:function(){
			return this.$moment.unix(this.today).startOf('day').unix()-this.datatimestamp
		},
		loggerurl:function(){
			return this.$store.getters.getLoggerURL;
		},
		currentGroup: function(){
			return this.$store.getters.getcurrentGroup;
		},
		daterange:function(){
			return this.$store.getters.getcurrentdaterange
		},
		dateRangeLabel: function(){
			var obj ={};
			obj.start=this.$moment.unix(this.daterange.starttime).format("MMM. D, YYYY")
			obj.end=this.$moment.unix(this.daterange.endtime).format("MMM. D, YYYY")
			obj.startDate=this.$moment.unix(this.daterange.starttime)
			obj.endDate=this.$moment.unix(this.daterange.endtime)
			obj.week='Week '+this.weekno
			return obj
		},
		weekno:function(){
			var wk = this.simuweekcount;
			var dt=this.today-this.daterange.starttime
			while(dt>604800){
				dt=dt-604800
				wk=wk-1
			}
			return wk
		},
		patient: function(){
			// console.log(this.$route.params.id);
			return this.$store.getters.getpatientbyid({"id":this.$route.params.id,"group":this.currentGroup.id});
		},
		nextitem:function(){
			var item={x:0,y:20,w:3,h:6,i:"0",c:""};
			var x = 0;
			var y = 0;
			var self=this;
			var temp = JSON.parse(JSON.stringify(this.layout))
			var layout = temp.sort(function(a,b){return (a.y+a.h)-(b.y+b.h)})
			layout.forEach(function(e){
				var w0 = x-e.x;
				var h0= y-e.y;
				if( w0<self.defaultw | h0<self.defaulth )	{
					x = e.x+e.w;
					if((x+self.defaultw)>self.colnum){
						x=0;
						y=e.y+e.h;
					}
				}
				})
				item.x=x;
			item.y=y;
			item.w=this.defaultw;
			item.h=this.defaulth;
			item.i=this.layout.length+"";
			return item
		},
		widgetMasterList: function(){
			return JSON.parse(JSON.stringify(this.$store.getters.getwidgetlistbypatient(this.patient)));
		},
		configready:function(){
			var b = true;
			var self=this;
			if(this.layout.length==0){
				b=false;
			}else{
			this.layout.forEach(function(e){
				var obj = JSON.parse(JSON.stringify(e.c))
				if(obj.type=="PRO"){
						b=obj.sel && b
				}
			})
		}
			return b
		},
		enableNextArrow:function(){
			return this.dateRangeLabel.endDate.isBefore(this.$moment())
		},
		enablePreArrow:function(){
			return ((this.daterange.starttime-3600)>this.initdate)
		},
		colwidth:function(){
			return (this.layoutdim.x1-this.layoutdim.x0)/this.colnum
		},

	},
	watch:{
		isInEdit:function(){
			if(this.isInEdit){
				this.$store.commit('setScreenname','Dashboard Configuration')
			}else {
				this.$store.commit('setScreenname','Data View')
			}
			this.checkGriddim()
		}
	},
	methods : {
		cleanuplayout:function(){
			var self=this;
			this.layout.forEach(function(e){
				var index=self.pwidgetlist.indexOf(e.c.id)
				e.i=index+""
			})
		},
		checkGriddim:function(){
			this.layoutdim.x0=this.$refs.gridl.getBoundingClientRect().left
			this.layoutdim.y0=this.$refs.gridl.getBoundingClientRect().top
			this.layoutdim.x1=this.$refs.gridl.getBoundingClientRect().right
			this.layoutdim.y1=this.$refs.gridl.getBoundingClientRect().bottom
		},
		setinstru:function(obj){
			var self = this;
			var index= this.layout.map(function(e){
				return e.c.id
			}).indexOf(obj.id)
			self.layout[index].c.sel =obj.sel;
			self.layout[index].c.selindex =obj.selindex

		},
		gopreviousweek:function(){
			var obj= {}
			obj.days=this.daterange.days;
			obj.start= this.daterange.starttime-7*24*3600;
			obj.end=this.daterange.endtime-7*24*3600;
			this.$store.commit('setcurrentdaterange',obj);
		},

		gonextweek:function(){
				var obj={}
				obj.days=this.daterange.days;
				obj.start= this.daterange.starttime+7*24*3600;
				obj.end=this.daterange.endtime+7*24*3600;
				this.$store.commit('setcurrentdaterange',obj);
			},
			toggleviewmode:function(){
			var self=this;
			this.fading=true
			setTimeout(function(){
				self.loaddata=true;
				self.timepoint=2;
				self.fading=false;
			},1800)
		},
		parseobj:function(s){
			var obj={}
			try {
				obj=JSON.parse(s)
			}catch(e) {
				console.log("JSON Input Error")
			}
			return obj
		},
    saveconfig:function(){
			var self = this;
			this.showModal=true;
			this.loaddata=false;
			this.pddready=true;
	    var pid=this.$route.params.id;
			this.$store.commit('saveConfig',{'id':pid,'group':this.currentGroup.id,'layout':this.layout});
			if(true) this.updateLog(this.patient);
			self.isInEdit = false;
			self.registrationstatus =[];
			if(this.showModal){
			setTimeout(function(){
				self.registrationstatus.push("Saving registerations of prescribed interventions for "+self.patient.name+ " ... ")
			},200)
			setTimeout(function(){
				self.registrationstatus.push("Registration is successful! ")
			},500)
		 	setTimeout(function(){
			 	self.registrationstatus.push("You are ready for the next step." )
			},1000)
			setTimeout(function(){
				self.showModal=false;
			},3000);
				}
    },
		getHeight:function(i){
				if(this.$refs.item[i]){
					return this.$refs.item[i].$el.clientHeight;
				}else {
					return 120;
				}
		},
		loadDefault:function(){
			var self = this;
			this.layout.splice(0,1);
			var obj = JSON.parse(JSON.stringify(this.$store.getters.getdefaultlayoutbycancerid(this.patient.type)));
			this.pwidgetlist=obj.map(function(e){return e.c.id})
			obj.forEach(function(e){
				self.layout.push(e)
			})
		},
		saveDefault:function() {
			var obj={}
			obj.cancerid=this.patient.type;
			obj.layout=this.layout;
			this.$store.commit('savedefaultlayout', obj )
		},
		updateLog:function(obj){
			var t = this.$moment().format();
			var payload={};
			payload.timestamp=t;
			payload.entry=obj;
			this.$http.post(this.loggerurl, payload)
				.then(function (response) {
    			// console.log(response);
  			})
  			.catch(function (error) {
    			// console.log(error);
  			});

		},
		removeWidget:function(id){
			var i =this.pwidgetlist.indexOf(id)
			this.layout.splice(i,1);
			this.pwidgetlist.splice(i,1);
			this.cleanuplayout()
		},
		removeAll:function(){
			var n=this.pwidgetlist.length;
			this.layout.splice(0,n);
			this.pwidgetlist.splice(0,n);
		},
		maximizeWidget: function(id){
			this.temp =JSON.parse(JSON.stringify(this.layout));
			this.layout=this.layout.filter(function(e){return e.c.id==id})
			this.layout[0].x=0;
			this.layout[0].y=0;
			this.layout[0].w=12;
			this.layout[0].h=7;
			this.maximized=true;
		},

		restoreLayout: function(){
			this.layout=JSON.parse(JSON.stringify(this.temp));
			this.maximized=false;
		},
		toggleEditMode:function(){
			this.isInEdit=true;
			this.timepoint=1;
			this.dragOptions.disabled=false;
			this.$nextTick(() => {
				this.checkGriddim()
      });
		},
	  resizedEvent: function(i, newH, newW, newHPx, newWPx){
      var msg = "RESIZED i=" + i + ", H=" + newH + ", W=" + newW + ", H(px)=" + newHPx + ", W(px)=" + newWPx;
			window.dispatchEvent(new Event('resize'));
    },
		dragin () {
			// console.log("in")
		},
		dragout () {
			// console.log("out")
		},
		endingdrag () {
			console.log(this.contentindrag)
			console.log("Drag ending")
			this.contentindrag={}

		},
		dragnative (e) {
			e.preventDefault();
		},
		setdrag(element){
			this.contentindrag=JSON.parse(JSON.stringify(element))
		},
		dropped (e) {
			e.preventDefault();
			var x =e.clientX-this.layoutdim.x0
			var y= e.clientY-this.layoutdim.y0
			var nx = Math.floor(x/(this.colwidth))
			var ny = Math.floor(y/30)
			console.log("dropped @ "+e.clientX + " , "+e.clientY+" Grid coord: "+x + " , "+y)
			console.log("Drop in the grid:"+nx+" "+ny)
			var idcheck = (this.pwidgetlist.indexOf(this.contentindrag.id)==-1)
			if((nx>=0)&&(ny>=0)&&idcheck){
				var item={x:0,y:1,w:3,h:3,i:"0",c:""};
				if(nx>9){nx=9}
				item.x=nx;
				item.y=ny;
				var obj = {}
				// JSON.parse(JSON.stringify(this.contentindrag))
				obj.id=this.contentindrag.id;
				obj.label=this.contentindrag.label;
				obj.type=this.contentindrag.type;
				obj.constraint=this.contentindrag.constraint
				obj.count=0
				obj.pnotecount=0
				obj.sel=true;
				obj.selindex=0; //default to select the first instrument
				console.log(obj)
				item.c = JSON.parse(JSON.stringify(obj));
				item.i=this.layout.length+"";
				this.layout.push(item)
				this.pwidgetlist.push(obj.id)
			}
		},
		hoverin (e) {
			e.preventDefault();
		},
		onMove ({relatedContext, draggedContext}) {
			const relatedElement = relatedContext.element;
			const draggedElement = draggedContext.element;
			return (!relatedElement || !relatedElement.fixed) && !draggedElement.fixed
		},
	},
	components:{
		applayout,
		kotile,
		kocard,
		draggable,
		GridLayout:VueGridLayout.GridLayout,
		GridItem:VueGridLayout.GridItem,
		modal
	}
};
</script>
<style scoped>
.bannercontent {
    margin-top: 60px;
    text-align: left;
    margin-bottom: 20px;
    margin: 0 auto;
    line-height: 2em;
		letter-spacing: 0.1em;
    padding-top: 0px;
    background: transparent;
}
.bannercontent h1 {
	line-height:1.3em;
}
.kg-btn-primary{
	background-color:#f7f7f7;
	border:1px solid #0075bc;
	padding:10px 20px;
	margin:10px 10px;
	display:inline-block;
	color:#0075bc;
	transition:all 0.5s ease;
	font-weight:600;
}
.kg-btn-primary:hover{
	background-color:#0075bc;
	color:#fff;
	border:1px solid #fff;
}
.kg-btn-wk {
	background-color:#e7e7e7;
	border:none;
	color:#0075bc;
	padding:10px 5px;
	margin:10px 5px;
	display:inline-block;
}
.kg-btn-wk:disabled {
	color:#e7e7e7;
}
.kg-btn-primary.lg{
	width: 180px;
}
.kg-btn-primary:disabled  {
		border:1px solid #c7c7c7;
		color:#c7c7c7
}
.kg-btn-primary.attn:disabled {
		border:1px dashed red;
		color:#c7c7c7
}
.kg-btn-primary.labelonly {
	cursor:default;
	border:1px solid #f7f7f7;
	color:#666666;
}
.kg-btn-primary.labelonly:hover {
	background-color:#f7f7f7;
	border:1px solid #f7f7f7;
	color:#666666;
}
.weektrack {
	display: inline-block;
	position:relative;
	border-bottom:1px solid #0075bc;
	margin: 20px 0px;
}
.wkcursorfg {
	position:absolute;
	height:25px;
	background-color: transparent;
	z-index:400;
	transition:left 0.5s ease, width 0.5s ease;
}
.wkcursorbg {
	position:absolute;
	height:25px;
	background-color: #0075bc;
	z-index:300;
	transition:left 0.5s ease, width 0.5s ease;
}

.wklabel {
	position:relative;
	cursor:default;
	background-color:transparent;
	border:none;
	padding:3px;
	text-align:center;
	margin:0px ;
	width:54px;
	height: 25px;
	z-index:350;
	color: #fff;
	font-size:14px;
	font-weight:600;
	/* mix-blend-mode: darken; */
}
.wlistctner {
	overflow:auto;
	min-height:752px;
	max-height:752px;
	border:1px solid #b5b5b5;
}
.btnDisabled {
	background-color:#eeeeee;
	border:1px solid #aaaaaa;
	color:#aaaaaa;
	cursor: not-allowed;
}
.maincontent{
	min-height:500px;
}
.widgetcontainer {
	position:relative;
	width:100%;
	flex: auto;
}
.pdd-panel {
	opacity: 1;
	transition: opacity 1s ease;
}
.pdd-panel.inedit{
	background-image: linear-gradient(45deg,#f5f5f5 25%,transparent 0,transparent 75%,#f5f5f5 0),linear-gradient(45deg,#f5f5f5 25%,transparent 0,transparent 75%,#f5f5f5 0);
  background-position: 0 0,15px 15px;
  background-size: 30px 30px;
}
.pdd-panel.fading {
	opacity:0.05;
}
.widgetTitle {
	width:100%;
	margin: 0 auto;
  padding:5px 8px;
	color: #fff;
}
.widgetTitle.PRO {
	background-color: #853754;
}
.widgetTitle.SM {
	background-color: #20657e;
}
.widgetTitle p {
	font-size:12px;
	font-weight:700;
	color: #fff;
	text-align: center;
}
.widgetTitle i, .widgetTitle .badge {
	font-size:12px;
	font-weight:500;
	color: #fff;
	float:right;
	position:absolute;
	top:10px;
	right:10px;
	cursor:pointer;
}
.widgetTitle .badge {
	top:5px;
	right:45px;
	background-color:#fc1526;
}
.widgetTitle .fa-arrow-up {
	color:red;
}
.widgetTitle .widgetLabel {
	color:#fff;
	font:bold 12pt 'Open Sans', sans-serif;
}
.draggablehandle {
	cursor: pointer;
}
.kg-bg-custom-0 {
	background-color:#f5f5f5;
}
.kg-bg-custom-1 {
	background-color:#e5e5e5;
}
.ht-full{
	height: 100%;
	min-height:800px;
}
h1 small {
	font-size:50%;
}
ul.modalentry li {
	line-height:2.5em;
	font-size:18px;
}
ul.wlist {
	margin:10px;
	height:100%;
}
ul.wlist li {
	margin: 2px;
	display: inline-flex;
}
ul.wlayout {
	opacity:1;
	position:absolute;
	top:0;
	margin:0px;
	width:100%;
	height:100%;
}
ul.wlayout li {
	margin: 0px;
	height:100%;
	flex:auto;
}
.vue-grid-layout {
	min-height: 600px;
}
.vue-grid-item.vue-resizable {
	position:relative;
	border:1px dashed #999999;
	background-color:#f7f7f7;
	box-shadow: none;
}
.vue-grid-item {
	position:relative;
	border:1px dashed transparent;
	background-color:transparent;
	display: flex;
	flex-direction:column;
}
</style>
