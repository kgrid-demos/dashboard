<template>
<div class='content'>
	<applayout>

		<div slot='main'>
			<div class='maincontent'>
					<div class='col-md-2 col-sm-2 col-xs-2 kg-bg-custom-1 pad-0 ht-full' ></div>
					<div class='col-md-8 col-sm-8 col-xs-8 kg-bg-custom-1 ht-full pad-0'>
						<div class='row ht-50'>
							<div class='col-md-7 col-sm-5 pad-0'>
								<div class="pad-l-30 pad-t-15"  >
									<p style="font-size:18px; font-weight:600;"> Notifications ({{notifi.length}})</p>
								</div>
							</div>
							<div class='col-md-5 col-sm-5 '>
								<div class='float-r'>
									<button class='kg-btn-primary ' @click='' style='font-size:14px;'>Sort By:  Most Severe <i class='fa fa-angle-down fa-lg'></i></button>
								</div>
							</div>
						</div>
						<div>
						<ul>
							<li v-for='(object,index) in notifi' v-bind:key='index'>
								<notiftile :patient='object.patient'
									:timestamp='object.timestamp' :notifications='object.notes'></notiftile></li>
					</ul>
						</div>
					</div>
					<div class='col-md-2 col-sm-2 col-xs-2  kg-bg-custom-1 pad-0 ht-full' >
					</div>
			</div>
		</div>
	</applayout>
</div>
</template>
<script>
import applayout from './applayout.vue';
import notiftile from './notiftile.vue'

export default {
    name: 'notification',
	data : function() {
		return {

			enableNextArrow:false,
			temp:{},
		dateRange:{starttime:0, endtime: 6},
		}
	},
	created : function() {
		var self = this;
		var lastsunday = this.$moment().day(-7);

	},
	mounted:function(){
		var self = this;


	},
	updated: function() {
	  },
	computed : {
		notifi: function(){
			return this.$store.getters.getNotificationList;
		},
		loggerurl:function(){
			return this.$store.getters.getLoggerURL;
		},
		currentGroup: function(){
			return this.$store.getters.getcurrentGroup;
		},

	},
	watch:{
	},
	methods : {
		getCount:function(t){
			var index= this.patient.wlist.map(function(e){return e.id}).indexOf(t);
			return this.patient.wlist[index].count;
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
			this.dateRange.starttime=this.dateRange.starttime-7;
			this.dateRange.endtime=this.dateRange.endtime-7;
			this.enableNextArrow = true;
		},
		gonextweek:function(){
		  if(this.enableNextArrow) {
        this.dateRange.starttime = this.dateRange.starttime + 7;
        this.dateRange.endtime = this.dateRange.endtime + 7;
        this.enableNextArrow = this.dateRangeLabel.endDate.isBefore(this.$moment());
      }
		},
		cleanupLayout: function(){
			console.log("Cleaning up")
			this.layout = this.layout.filter(function(e){return (e.c!="")}).map(function(e,index){
				var item=e;
				item.i=index+"";
				return item;
				});
			this.itemWidgetList=this.itemWidgetList.filter(function(e){return (e.length!=0)});
			console.log('Item Widget List Length = '+this.itemWidgetList.length)
		},
    saveconfig:function(){
			var self = this;
			this.showModal=true;
			this.updateLayoutContent();
			this.cleanupLayout();
	    var pid=this.$route.params.id;
      this.$eventBus.$emit("saveSettings",{'id':pid,'group':this.currentGroup.id});
			this.$store.commit('saveConfig',{'id':pid,'group':this.currentGroup.id,'layout':this.layout});
			if(false) this.updateLog(this.patient);
			self.isInEdit = false;
			self.registrationstatus =[];

			setTimeout(function(){
				self.registrationstatus.push("Registering "+self.patient.name+ " for the prescribed interventions ...")
			},200)
			setTimeout(function(){
				self.registrationstatus.push("Registration is successful!!! ")
			},1500)
			setTimeout(function(){
				self.registrationstatus.push("A confirmation email has also been sent to the patient.")
			},2000)
			setTimeout(function(){
				self.showModal=false;

				},4000);
    },
		getHeight:function(i){
				if(this.$refs.item[i]){
					return this.$refs.item[i].$el.clientHeight;
				}else {
					return 120;
				}
		},
		updateLog:function(obj){
			var t = this.$moment().format();
			var payload={};
			obj.timestamp=t;
			payload.entry=obj;
			this.$http.post(this.loggerurl, payload)
				.then(function (response) {
    			console.log(response);
  			})
  			.catch(function (error) {
    			console.log(error);
  			});

		},
    dragWidget:function(ev){
      ev.stopPropagation();
			console.log("Start Dragging ");
			console.log(ev.target);
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
      console.log(e.target);
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
		maximizeWidget: function(i){
			this.temp =JSON.parse(JSON.stringify(this.layout));
			this.layout=this.layout.filter(function(e){return e.i==i})
			this.layout[0].x=0;
			this.layout[0].y=0;
			this.layout[0].w=12;
			this.layout[0].h=18;
			this.maximized=true;
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
			)
			this.pwidgetlist=this.layout.map(function(e){return e.c})

		}
	},
	components:{
		applayout,
		notiftile,

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
.kg-btn-primary{
	background-color:#f7f7f7;
	border:1px solid #b3b3b3;
	padding:10px 20px;
	margin:10px 10px;
	display:inline-block;
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
.widgetTitle {
   padding:5px;
	 background-color:#2362b2;
	  border: 2px solid transparent;
		border-bottom:none;
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
	background-color:#bc2526;
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
ul.wlist {
	margin-top:25px;
	height:100%;
}
ul.wlist li {
	margin: 10px auto;
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

	.widgetalertdisplay, .notesdisplay {
			height:150px;
			background-color: #fff;
			margin:10px 0px;
			border: 1px solid #b3b3b3;
			overflow: auto;
			padding:10px 15px;
			text-align: left;
			text-transform: none;
	}
.widgetalertdisplay{

}
</style>
