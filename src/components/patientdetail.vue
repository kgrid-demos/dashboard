<template>
<div class='content'>
	<applayout>
		<div slot='banner'>
			<div class='bannercontent' >
				<div class='row'>
					<div class='col-md-1'>
						<router-link  class='float-r' to='/'>
							<i class='fa fa-arrow-left'></i>
						</router-link>
					</div>
					<div class="col-md-11">
						<h1 class='pad-l-20'>{{patient.Name}}<small class='pad-l-20'>Age {{patient.Age}}, {{patient.Gender}}</small></h1>
					</div>
				</div>
			</div>
		</div>
		<div slot='main'>
			<div class='maincontent'>
				<div class='col-md-2 col-sm-2 col-xs-2 kg-bg-custom-0 ht-full'>
					<draggable class='wlist' element="ul" v-model="widgetList" :options="dragOptions">
						<li v-for='(object,index) in widgetList' v-bind:key='index'>
							<kocard :object='object.label' :id='object.label' :cflag="object.type" :tileindex='index' draggable='true'  @dragstart='dragWidget' ></kocard>
						</li>
					</draggable>
				</div>
				<div class='col-md-10 col-sm-10 col-xs-10 kg-bg-custom-1 ht-full pad-0' >
					<div class='row ht-50'>
						<button class='kg-btn-primary' v-if='!isInEdit' @click='toggleEditMode'>Edit</button>
						<button class='kg-btn-primary' v-if='isInEdit' @click='saveconfig'>Save Changes</button>
					</div>
					<grid-layout		:layout.sync="layout"
													:col-num="12"
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
                            @resized="resizedEvent">
														<div v-show='(item.c=="")&&isInEdit' style="text-align: center; vertical-align: middle; font-size: 16px; font-weight: 700;position:relative;top:50%;transform:translateY(-50%)">Add a widget</div>
														<div class='widgetTitle' v-if='item.c!=""'><p v-if='itemWidgetList[item.i].length>0'>{{itemWidgetList[item.i][0].label}}</p>
														<i class='fa fa-close' v-if='isInEdit' @click='removeWidget(item.i)'></i></div>
						<div class='widgetcontainer fill' @dragenter="denter" @dragover="dover" @drop='dropped'>
								<draggable class='wlayout' element="ul" v-model="itemWidgetList[item.i]"  :options="dragOptions"   >
														<li v-for='(object,index) in itemWidgetList[item.i]' v-bind:key='index' v-if='itemWidgetList[item.i].length==1|object.type!="NEW"'>
															<kotile :object='object.label'  :cflag="object.type" :tileindex='index' :containerheight="(item.h)*30" draggable='true' @dragstart='dragWidget' ></kotile>
														</li>
													</draggable></div>
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
import eventBus from '../eventBus.js';
import kotile from './kotile.vue'
import kocard from './kocard.vue'
import widget from "./widget.vue";
export default {
    name: 'patientdetail',
	data : function() {
		return {
			widgetList:[],
			itemWidgetList:[],
			pwidgetlist:[],
			draggedid:"",
			isInEdit:false,
			layout:[
        {"x":0,"y":0,"w":3,"h":4,"i":"0","c":""},
    ],
		dragOptions: {
			animation: 0,
			group: 'description',
			disabled: true,
			ghostClass: 'ghost'
		}

		}
	},
	created : function() {
		var self = this;

	},
	mounted:function(){
		var self = this;
		self.itemWidgetList=[];
		this.layout=JSON.parse(JSON.stringify(this.$store.getters.getlayoutbyid(this.$route.params.id)));
		this.pwidgetlist=this.layout.map(function(e){return e.c})
		this.widgetList = this.widgetMaster.filter(function(e){return (this.indexOf(e.id)<0);},self.pwidgetlist)
		this.layout.forEach(function(item){
			var index= self.widgetMaster.map(function(e){return e.id}).indexOf(item.c);
			if(index>=0){
				var nextwidgetlist=[];
				nextwidgetlist.push(self.widgetMaster[index]);
				self.itemWidgetList.push(nextwidgetlist);
			}else {
				self.itemWidgetList.push([]);
			}
		})
		if(this.pwidgetlist.length==1&&this.pwidgetlist[0]==''){
			this.isInEdit=true;
			this.dragOptions.disabled=false;
		}

	},
	updated: function() {
	  },
	computed : {
		patient: function(){
			console.log(this.$route.params.id);
			return this.$store.getters.getpatientbyid(this.$route.params.id);
		},
		nextitem:function(){
			var item={x:0,y:20,w:3,h:4,i:"0",c:""};
			item.i=this.layout.length+"";
			return item
		},
		widgetMaster: function(){
			return this.$store.getters.getwidgetMaster;
		},

	},
	watch:{
		itemWidgetList:function(){
					this.updateLayoutContent();
		}
	},
	methods : {
    saveconfig:function(){
			this.updateLayoutContent();
	    var pid=this.$route.params.id;
      this.$store.commit('saveConfig',{'id':pid,'layout':this.layout});
			this.isInEdit = false;
    },
		getHeight:function(i){
			console.log(i);
			if(this.$refs.item[i]){
				console.log(this.$refs.item[i].$el.clientHeight)
				return this.$refs.item[i].$el.clientHeight;
				}else {
				return 120;
				}
		},
    dragWidget:function(ev){
      ev.stopPropagation();
			console.log("Start Dragging ");
			console.log(ev.target)
      return true;
    },
    denter: function(e){
        e.preventDefault();
				e.stopPropagation();
        console.log("Drag enter");
        $(e.target).addClass("over");
    },
    dexit: function(e){
        e.preventDefault();
				e.stopPropagation();
        $(e.target).removeClass("over");
    },
    dover:function(e){
      e.preventDefault();
			e.stopPropagation();
      console.log("Drag over");
      console.log(e.target);
    },
    dropped:function(e) {
    	e.preventDefault();
    	console.log(e.target.clientHeight);
    	if(this.widgetList.length>=1){
      	this.layout.push(this.nextitem)
      	this.itemWidgetList.push([])
      }
    },
		removeWidget:function(i){
			var obj = this.itemWidgetList[i][0];
			this.itemWidgetList[i].splice(0);
			this.widgetList.push(obj);
			this.layout[i].c="";
			this.pwidgetlist[i]="";
		},
		toggleEditMode:function(){
			this.isInEdit=true;
			this.dragOptions.disabled=false;
		},
    resizedEvent: function(i, newH, newW, newHPx, newWPx){
      var msg = "RESIZED i=" + i + ", H=" + newH + ", W=" + newW + ", H(px)=" + newHPx + ", W(px)=" + newWPx;
      console.log(msg);
      console.log(this.itemWidgetList[i]);
    },
		updateLayoutContent:function(){
			var self = this;
			this.itemWidgetList.forEach(function(item, index) {
					console.log(index);
					console.log(item);
					if(item.length>0)
						{ self.layout[index].c = item[0].id;}
				}
			)
			this.pwidgetlist=this.layout.map(function(e){return e.c})
		}
	},
	components:{
    widget,
		applayout,
		kotile,
		kocard,
		draggable,
		GridLayout:VueGridLayout.GridLayout,
		GridItem:VueGridLayout.GridItem,
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
	float:right;
	border:1px solid #777777;
	padding:10px 20px;
	margin:10px 25px;
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
.widgetTitle i {
	font-size:12px;
	font-weight:500;
	color: #fff;
	float:right;
	position:absolute;
	top:10px;
	right:10px;
	cursor:pointer;
}

.kg-bg-custom-0 {
	background-color:#f5f5f5;
}
.kg-bg-custom-1 {
	background-color:#e5e5e5;
}
.ht-full{
	height: 100%;
	min-height:550px;
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
}
.vue-grid-item {
	position:relative;
	border:1px dashed transparent;
	background-color:transparent;
	display: flex;
	flex-direction:column;
}

</style>
