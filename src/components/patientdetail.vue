<template>
<div class='content'>
	<applayout>
		<div slot='banner'>
			<div class='bannercontent' >
				<div class='row'>
				<div class='col-md-1'>
				<router-link  class='float-r' to='/'><i class='fa fa-arrow-left'></i>
				</router-link>
				</div>
				<div class="col-md-11"><h1 class='pad-l-20'>{{patient.Name}}<small class='pad-l-20'>Age {{patient.Age}}, {{patient.Gender}}</small></h1>
				</div>
				</div>
			</div>
		</div>
		<div slot='main'>
			<div class='maincontent'>
			<div class='col-md-2 col-sm-2 col-xs-2 kg-bg-custom-0 ht-full'>
				<draggable class='wlist' element="ul" v-model="widgetList" :options="dragOptions"  :move="onMove" >
				<li v-for='(object,index) in widgetList' v-bind:key='index'>
					<kotile :object='object.label' :id='object.label' :cflag="object.type" :tileindex='index' draggable='true'  @dragstart='dragWidget' ></kotile></li>
					</draggable>
					</div>
					<div class='col-md-2 col-sm-2 col-xs-2 kg-bg-custom-0 ht-full'>
						<draggable class='wlist' element="ul" v-model="widgetList2" :options="dragOptions"  :move="onMove" >
						<li v-for='(object,index) in widgetList2' v-bind:key='index'>
							<kotile :object='object.type' :id='object.label' :cflag="object.label" :tileindex='index' draggable='true'  @dragstart='dragWidget' ></kotile></li>
							</draggable>
							</div>
			<div class='col-md-8 col-sm-8 col-xs-8 kg-bg-custom-1 ht-full pad-0' >
			<div class='row ht-50'>
			<button class='kg-btn-primary' >Save Changes</button></div>
			<grid-layout
													:layout.sync="layout"
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
													{{item.i}}
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
			widgetList2:[{"label":"Other","type":"PRO"}],
			draggedid:"",
			layout:[
        {"x":0,"y":0,"w":3,"h":4,"i":"0"},
        {"x":3,"y":0,"w":3,"h":4,"i":"1"},
        {"x":6,"y":0,"w":3,"h":4,"i":"2"},
        {"x":9,"y":0,"w":3,"h":4,"i":"3"},
				{"x":0,"y":4,"w":3,"h":4,"i":"4"},
				{"x":3,"y":4,"w":3,"h":4,"i":"5"},
				{"x":6,"y":4,"w":3,"h":4,"i":"6"},
				{"x":9,"y":4,"w":3,"h":4,"i":"7"},
				{"x":0,"y":8,"w":3,"h":4,"i":"8"},
				{"x":3,"y":8,"w":3,"h":4,"i":"9"},
				{"x":6,"y":8,"w":3,"h":4,"i":"10"},
				{"x":9,"y":8,"w":3,"h":4,"i":"11"},
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

	},
	updated: function() {
	  },
	computed : {
		patient: function(){
			return this.$store.getters.getSelectedPatient;
		}

	},
	methods : {
		dropWidget:function(e){
			e.preventDefault();
			console.log("Dropped"+this.draggedid);
		},
		allowDrop:function(e){
			e.preventDefault();
		},
		dragWidget:function(e){
				console.log("Drag started");

		},
		onMove ({relatedContext, draggedContext}) {
		const relatedElement = relatedContext.element;
		const draggedElement = draggedContext.element;
		return (!relatedElement || !relatedElement.fixed) && !draggedElement.fixed
	}







	},
	components:{
		applayout,
		kotile,
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
}
ul.wlist li {
	margin: 10px auto;
}

.vue-grid-item {
border:1px dashed #999999;
background-color:#f7f7f7;
}
</style>
