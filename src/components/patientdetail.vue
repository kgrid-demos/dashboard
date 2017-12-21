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
			<div class='bannercontent' >
				<div class='row mar-0'>
					<div class='col-md-1 col-sm-1 col-xs-1  pad-0' v-if='isInEdit'></div>
					<div class='col-md-1 col-sm-1 col-xs-1'>
						<router-link  class='float-r' to='/' v-if='!maximized & !isInEdit'>
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
				<div class='col-md-2 col-sm-2 col-xs-2  pad-0' v-if='isInEdit'>
					<div class='ht-full kg-bg-custom-0' @drop='dropped'>
						<div class='row ft-sz-16 lh-3 txtcenter'> <h3>Widget List</h3></div>
						<div class='wlistctner'>
							<draggable class='wlist' element="ul" v-model="widgetList" :options="dragOptions">
								<li v-for='(object,index) in widgetList' v-bind:key='index'>
									<kocard :object='object.label' :id='object.label' :cflag="object.type" :tileindex='index' draggable='true'  @dragstart='dragWidget' ></kocard>
								</li>
							</draggable>
						</div>
					</div>
				</div>
				<div class='col-md-1 col-sm-1 col-xs-1 ht-full  pad-0' v-else></div>
				<div class='col-md-10 col-sm-10 col-xs-10 kg-bg-custom-1 pdd-panel ht-full pad-0' :class='{fading:fading}'>
					<div class='row ht-50'>
						<div class='col-md-4 col-sm-4 pad-0'>
							<div class="pad-l-30 pad-t-20 ft-sz-18 ft-italic ft-wt-6">Time Point {{timepoint}} - {{timetitle}}</div>
								<div class="pad-l-15">
						</div>
						</div>
						<div class='col-md-8 col-sm-8 '>
							<div class='float-r' v-if='isInEdit'>
								<button class='kg-btn-primary lg' v-if='isInEdit && pwidgetlist.length==1&&this.pwidgetlist[0]=="" ' @click='loadDefault'> Load Default Layout </button>
								<button class='kg-btn-primary lg' v-if='isInEdit && pwidgetlist.length>1' @click='saveDefault'> Save As Default </button>
								<button class='kg-btn-primary lg' v-if='isInEdit && pwidgetlist.length>1 ' @click='removeAll'> Remove All </button>
								<button class='kg-btn-primary attn lg' v-if='isInEdit' :disabled='!configready' @click='saveconfig'>Done</button>
							</div>
							<div class='float-r' v-else>
								<button class='kg-btn-primary lg' v-if='!maximized && !loaddata & pddready' @click='toggleviewmode'> {{timeff}}</button>
								<div class="pad-r-15 ht-60 inline"  v-if=' pwidgetlist.length>=1 && loaddata'>
									<button class='kg-btn-wk '  :disabled="!enablePreArrow" @click='gopreviousweek'> <i v-show="!maximized" class='fa fa-angle-left fa-lg'></i></button>
									<div class='weektrack' ref='wktrack'>
										<button class='wkcursorbg ft-sz-12' :style='wktracker'></button>
										<button class='wkcursorfg ft-sz-12' ref='wkcursor' :style='wktracker' ></button>

										<button class='wklabel ft-sz-12' v-for='wk in simuweeks'>Week {{wk}}</button>
									</div>
									<!-- <button class='kg-btn-primary labelonly' style='width:140px;'> {{dateRangeLabel.week}} </button> -->
									<button class='kg-btn-wk ' :disabled="!enableNextArrow" @click='gonextweek'> <i v-show="!maximized" class='fa fa-angle-right fa-lg'></i></button>
								</div>
								<button class='kg-btn-primary inline' v-if='!maximized ' @click='toggleEditMode'>Edit</button>
							</div>
						</div>
						</div>

						<grid-layout	:layout.sync="layout"
													:col-num="colnum"
													:row-height="30"
													:is-draggable="isInEdit"
													:is-resizable="isInEdit"
													:vertical-compact="true"
													:margin="[10, 10]"
													:use-css-transforms="true">
							<grid-item v-for="item in layout"
													 	:x.sync="item.x"
														:y.sync="item.y"
														:w.sync="item.w"
														:h.sync="item.h"
														:i="item.i"
														ref='item'
														v-bind:key="item.i"
                            @resized="resizedEvent"
											 			drag-allow-from=".draggablehandle"
											 			drag-ignore-from=".no-drag"
														>
															<div class="draggable-handle" v-show='(item.c=="")&&isInEdit' style="text-align: center; line-height: 2em; vertical-align: middle; font-size: 16px; font-weight: 700;position:relative;top:50%;transform:translateY(-50%)">To add a widget, <br>drag one from the list <br> and drop here.
															</div>
																<div class='' v-bind:class="{draggablehandle: isInEdit}" v-if='item.c!=""'>
																	<div class='row mar-0 widgetTitle' :class='itemWidgetList[item.i][0].type' >
																		<span class="widgetLabel">{{itemWidgetList[item.i][0].label}}</span>
																		<i class='fa fa-close' v-if='isInEdit' style="font-size:11pt" @click='removeWidget(item.i)'></i>
																		<i class='fa fa-window-maximize' v-if='!isInEdit && !maximized' title="maximize" style="font-size:11pt" @click='maximizeWidget(item.i)'></i>
																		<i class='fa fa-window-restore' v-if='!isInEdit && maximized' title="maximize"  style="font-size:11pt" @click='restoreLayout'></i>
																	</div>
																</div>
																<div class='widgetcontainer fill no-drag' @drop='dropped'>
																	<draggable class='wlayout' element="ul" v-model="itemWidgetList[item.i]" :options="customDragOptions(item.i)" >
																		<li v-for='(object,index) in itemWidgetList[item.i]' v-bind:key='index' v-if='itemWidgetList[item.i].length==1|object.type!="NEW"'>
																			<kotile :object='object'  :patientid='$route.params.id' v-on:setinstru='setinstru' v-on:maximizeme="maxthis" :maximized='maximized' :cflag="object.type" :tileindex='item.i' :containerheight="((item.h-1)*40)" :editmode='isInEdit' :viewmode='loaddata' draggable='true'  @dragstart='dragWidget'>
																			</kotile>
																		</li>
																	</draggable>
																</div>
							</grid-item>
						</grid-layout>
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
			widgetList:[],
			alertText:[],
			itemWidgetList:[],
			pwidgetlist:[],
			draggedid:"",
			timepoint:1,
			isInEdit:false,
			loaddata:false,
			pddready:false,
			defaultw:3,
			defaulth:6,
			layout:[],
			temp:{},
			dragOptions: {
				animation: 0,
				group: 'description',
				disabled: true,
				ghostClass: 'ghost',
			},
			maximized:false,
			showModal:false,
			fading:false,
			weekselector:{
				currentweek:8,
				clicked:false,
				currentoffset:0
			}
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
		this.itemWidgetList=[];
		this.layout=JSON.parse(JSON.stringify(this.patient.layout));
		this.pwidgetlist=this.layout.map(function(e){return e.c})
		this.widgetList = this.widgetMasterList.filter(function(e){return (this.indexOf(e.id)<0);},self.pwidgetlist)
		if(this.layout.length>0){
		this.layout.forEach(function(item){
			var index= self.widgetMasterList.map(function(e){return e.id}).indexOf(item.c);
			if(index>=0){
				var nextwidgetlist=[];
				nextwidgetlist.push(self.widgetMasterList[index]);
				self.itemWidgetList.push(nextwidgetlist);
			}else {
				self.itemWidgetList.push([]);
			}
		})
		}
		if(this.pwidgetlist.length==0){
		 	this.pddready=false;
		} else {
			this.pddready=true;
		}
	},
	updated: function() {
	  },
	computed : {
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
		count:function(){
			var self=this;
			var c =[];
			this.itemWidgetList.forEach(function(item){
				if(item.length>0){
					var index = self.patient.wlist.map(function(e){return e.id}).indexOf(item[0].id);
					c.push(self.patient.wlist[index].count);
				}
			});
			return c;
		},
		configready:function(){
			var b = true;
			this.itemWidgetList.forEach(function(e){
				if(e.length>0){
					if(e[0].type=="PRO")
						b=e[0].sel && b
				}
			})
			return b
		},
		enableNextArrow:function(){
			return this.dateRangeLabel.endDate.isBefore(this.$moment())
		},
		enablePreArrow:function(){
			return ((this.daterange.starttime-3600)>this.initdate)
		}
	},
	watch:{
		itemWidgetList:function(){
			this.updateLayoutContent();
			if(this.isInEdit) {
				this.addEmptySlot();
			}
		}
	},
	methods : {
		setinstru:function(obj){
			var index= this.itemWidgetList.map(function(e){
				if(e.length>0){
				return e[0].id}
				else{
					return ""
				}
			}).indexOf(obj.id)
			this.itemWidgetList[index][0].sel =obj.sel;
			this.itemWidgetList[index][0].selindex =obj.selindex
		},
		getCount:function(t){
			var index= this.patient.wlist.map(function(e){return e.id}).indexOf(t);
			return this.patient.wlist[index].count;
		},
		setAlerts:function(widget) {
		  var obj = {};
		  obj.pid = this.patient.id;
		  obj.group = this.patient.group;
		  obj.widget = widget.object.id;
		  obj.count = widget.redevents.length;
		  obj.message="Alert!";
      this.$store.commit("setAlerts",obj);
		},
		addAlert:function(id){
			var obj={};
			obj.pid=this.patient.id;
			obj.group=this.patient.groupid;
			obj.wid=id;
			obj.message="Alert!";
		  this.$store.commit("updateAlert",obj);
		},
		removeAlert: function(id){
			var obj={};
			obj.pid=this.patient.id;
			obj.group=this.patient.groupid;
			obj.wid=id;
			obj.message="";
		 	this.$store.commit("updateAlert",obj);
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
		cleanupLayout: function(){
			console.log("Starting cleaning up the layout... ")
			this.layout = this.layout.filter(function(e){return (e.c!="")}).map(function(e,index){
				// console.log("index"+index)
				var item=e;
				item.i=index+"";
				return item;
				});
			this.itemWidgetList=this.itemWidgetList.filter(function(e){return (e.length!=0)});
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
    saveconfig:function(){
			var self = this;
			this.showModal=true;
			this.loaddata=false;
			this.pddready=true;
			this.updateLayoutContent();
			this.cleanupLayout();
	    var pid=this.$route.params.id;
      this.$eventBus.$emit("saveSettings",{'id':pid,'group':this.currentGroup.id});
			this.$store.commit('saveConfig',{'id':pid,'group':this.currentGroup.id,'layout':this.layout});
			if(true) this.updateLog(this.patient);
			self.isInEdit = false;
			self.registrationstatus =[];

			if(this.showModal){
			setTimeout(function(){
				self.registrationstatus.push("Saving registerations of prescribed interventions for "+self.patient.name+ " ... ")
			},200)
			setTimeout(function(){
				self.registrationstatus.push("Registration is successful!!! ")
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
			this.itemWidgetList.splice(0,1);
			this.layout=JSON.parse(JSON.stringify(this.$store.getters.getdefaultlayoutbycancerid(this.patient.type)));
			this.pwidgetlist=this.layout.map(function(e){return e.c})
			this.widgetList = this.widgetMasterList.filter(function(e){return (this.indexOf(e.id)<0);},self.pwidgetlist)
			this.layout.forEach(function(item){
				var index= self.widgetMasterList.map(function(e){return e.id}).indexOf(item.c);
			if(index>=0){
					var nextwidgetlist=[];
					nextwidgetlist.push(self.widgetMasterList[index]);
					self.itemWidgetList.push(nextwidgetlist);
				}else {
					self.itemWidgetList.push([]);
				}
			})
			this.cleanupLayout();
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
    dragWidget:function(ev){
      ev.stopPropagation();
			 ev.preventDefault();
			console.log("Start Dragging ");
			// console.log(ev.target);
      return true;
    },
    denter: function(e){
        e.preventDefault();
				e.stopPropagation();
        console.log("Drag enter");
    },
    dexit: function(e){
        e.preventDefault();
				e.stopPropagation();
    },
    dover:function(e){
      e.preventDefault();
			e.stopPropagation();
      console.log("Drag over");
      // console.log(e.target);
    },
    dropped:function(e) {
			e.preventDefault();
			console.log("dropped");
			this.cleanupLayout();
    },
		removeWidget:function(i){
			var obj = this.itemWidgetList[i][0];
			this.itemWidgetList[i].splice(0);
			this.widgetList.push(obj);
			this.layout[i].c="";
			this.pwidgetlist[i]="";
			this.cleanupLayout();

		},
		removeAll:function(){
			var n=this.pwidgetlist.length;
			do{
				n=n-1;
				this.removeWidget(0)
			}while(n>1)
		},
		maximizeWidget: function(i){
			this.temp =JSON.parse(JSON.stringify(this.layout));
			this.layout=this.layout.filter(function(e){return e.i==i})
			this.layout[0].x=0;
			this.layout[0].y=0;
			this.layout[0].w=12;
			this.layout[0].h=18;
			this.maximized=true;
		},
		maxthis:function(id){
			var index=this.itemWidgetList.map(function(e){return e[0].id}).indexOf(id)
			this.maximizeWidget(index)
		},
		restoreLayout: function(){
			this.layout=JSON.parse(JSON.stringify(this.temp));
			this.maximized=false;
		},
		customDragOptions: function(i){
			var op = JSON.parse(JSON.stringify(this.dragOptions));
			op.disabled=this.itemWidgetList[i].length>0
			return op;

		},
		toggleEditMode:function(){
			this.isInEdit=true;
			this.timepoint=1;
			this.dragOptions.disabled=false;
			this.addEmptySlot();
		},
		addEmptySlot: function(){

			var zeroitem=this.itemWidgetList.filter(function(e){return (e.length==0)});
			if(zeroitem.length==0 && this.widgetList.length>=1){
				this.layout.push(this.nextitem)
				this.itemWidgetList.push([])
				}

		},
    resizedEvent: function(i, newH, newW, newHPx, newWPx){
      var msg = "RESIZED i=" + i + ", H=" + newH + ", W=" + newW + ", H(px)=" + newHPx + ", W(px)=" + newWPx;
			window.dispatchEvent(new Event('resize'));
    },
		updateLayoutContent:function(){
			var self = this;
			this.itemWidgetList.forEach(function(item, index) {
					if(item.length>0)
						{ self.layout[index].c = item[0].id;}
					else {
						 self.layout[index].c = "";
						}
				}
			);
			this.pwidgetlist=this.layout.map(function(e){return e.c})
			}
	},
	components:{
		applayout,
		kotile,
		kocard,
		draggable,
		GridLayout:VueGridLayout.GridLayout,
		GridItem:VueGridLayout.GridItem,
		modal,
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
.kg-btn-primary:disabled {
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
.widgetcontainer.over {
		background-color:yellow;
}
.pdd-panel {
	opacity: 1;
	transition: opacity 1s ease;
}
.pdd-panel.fading {
	opacity:0.05;
}
.widgetTitle {
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
