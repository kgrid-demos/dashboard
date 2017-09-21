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
					<draggable class='wlist' element="ul" v-model="widgetList" :options="dragOptions"   >
						<li v-for='(object,index) in widgetList' v-bind:key='index'>
							<kocard :object='object.label' :id='object.label' :cflag="object.type" :tileindex='index' draggable='true'  @dragstart='dragWidget' ></kocard>
						</li>
					</draggable>
				</div>
				<div class='col-md-10 col-sm-10 col-xs-10 kg-bg-custom-1 ht-full pad-0' >
					<div class='row ht-50'>
						<button class='kg-btn-primary' @click='saveconfig'>Save Changes</button>
					</div>
					<grid-layout		:layout.sync="layout"
													:col-num="12"
													:row-height="30"
													:is-draggable="true"
													:is-resizable="true"
													:vertical-compact="true"
													:margin="[10, 10]"
													:use-css-transforms="true">
						<grid-item v-for="item in layout"
													 	:x.sync="item.x"
														:y.sync="item.y"
														:w.sync="item.w"
														:h.sync="item.h"
														:i="item.i"
														v-bind:key="item.i">
							<div class='widgetcontainer'  @dragenter='denter' @dragleave='dexit' @dragover='dover' @drop='dropped'>
								<div class=''>{{item.i}}		Drag a widget and drop here			</div>


								<draggable class='wlayout' element="ul" v-model="widgetList2[item.i]" :options="dragOptions"   >
														<li v-for='(object,index) in widgetList2[item.i]' v-bind:key='index' v-if='widgetList2[item.i].length==1|object.type!="NEW"'>
															<kotile :object='object.label' :id='object.label' :cflag="object.type" :tileindex='index' draggable='true'  @dragstart='dragWidget' ></kotile>
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
export default {
    name: 'patientdetail',
	data : function() {
		return {
			widgetList:[{"label":"Pain","type":"PRO"},
			{"label":"Anxiety","type":"PRO"},
			{"label":"Depression","type":"PRO"},
			{"label":"Nausea","type":"PRO"},
			{"label":"Smoking CESSATION","type":"SM"},
			{"label":"NUTRITION","type":"SM"}],
			widgetList2:[],
			draggedid:"",
			layout:[
        {"x":0,"y":0,"w":3,"h":4,"i":"0"},
    ],
		dragOptions: {
			animation: 0,
			group: 'description',
			disabled: false,
			ghostClass: 'ghost'
		}

		}
	},
	created : function() {
		var self = this;

	},
	mounted:function(){
		this.widgetList=JSON.parse(JSON.stringify(this.$store.getters.getwidgetbypid(this.$route.params.id)));
		this.layout=JSON.parse(JSON.stringify(this.$store.getters.getlayoutbypid(this.$route.params.id)));
	},
	updated: function() {
	  },
	computed : {

		patient: function(){
			console.log(this.$route.params.id);
			return this.$store.getters.getpatientbyid(this.$route.params.id);
		},
		nextitem:function(){
			var item={x:9,y:20,w:3,h:4,i:0};
			item.i=this.layout.length+"";

			return item
		}

	},
	methods : {
	saveconfig:function(){
		var pid=this.$route.params.id;
		this.$store.commit('saveConfig',{'id':pid,'list':this.widgetList,'layout':this.layout});
	},
		dropWidget:function(e){
			e.preventDefault();
			console.log("Dropped"+this.draggedid);
		},
		allowDrop:function(e){
			e.preventDefault();
		},
		dragWidget:function(ev){
			ev.stopPropagation();
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
				console.log("Drag exit");
				$(e.target).removeClass("over");
		},
		dover:function(e){
			e.preventDefault();
			e.stopPropagation();
			console.log("Drag over");
			$(e.target).css("font-size","20px;");
		},
		dropped:function(e) {
		e.preventDefault();
		e.stopPropagation();
		console.log('Something is dropped ');
		console.log(e.target);
		if(this.widgetList.length>1){
			this.layout.push(this.nextitem)
			this.widgetList2.push([])
		}
		},

	},
	components:{
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
	height:100%;
	background-color:#e9e9e9;
}
.widgetcontainer.over {
		background-color:yellow;
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
	opacity:0.9;
	position:absolute;
	top:0;
	margin:0px;
	width:100%;
	height:100%;
}
ul.wlayout li {
	margin: 0px;
	height:100%;
}
.vue-grid-item {
position:relative;
border:1px dashed #999999;
background-color:#f7f7f7;
}
</style>
