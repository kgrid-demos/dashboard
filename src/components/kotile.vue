<template>
		<div class="container kgl-tile" :class="{max:maximized}" v-bind:id="object.label">
			<div class="title">

			</div>
				<slot name="alerts"></slot>
				<p>
          <prowidget v-if="cflag === 'PRO' && dataLoaded" v-on:alert='showAlert' v-on:warning='showWarning' ref="widget" :alldata='chartdata' :patientid='patientid' :chartheight='cHeight' :editmode="editmode" :object="object" :title="object.label" :startdate="startdate"></prowidget>
          <smwidget v-if="cflag === 'SM'  && dataLoaded" :patientid='patientid' :chartheight='cHeight' :editmode="editmode" :object="object" :title="object.label" ></smwidget>
        </p>
				<div class='notesdisplay' v-if='maximized'>
				<ul>
					<li v-for='(object,index) in weeklynotes' v-bind:key='index'>
						<span v-if='object.note!=""'>{{formatted(object.date*1000)}} - {{object.note}}</span></li>
			</ul>
				</div>
		</div>
	</template>
	<script>
	import moment from 'moment';
  import axios from 'axios';
	import eventBus from '../eventBus.js';
	import prowidget from './prowidget.vue';
	import smwidget from './smwidget.vue';
	export default {
  	name:	"kotile",
		data() {
  	  return {
  	    notificationDatapoint: -1,
				chartdata: [],
				dataLoaded: false,
				hasAlert: false
			}
		},
		props : [ 'object', 'patientid','cflag' ,'maximized','tileindex', 'containerheight', 'editmode', 'startdate'],
		created: function(){

		},
		computed : {
			cHeight: function(){
				var h = (this.containerheight-30)
				if (this.maximized) {
					h=h*0.5;
				}
				return h
			},
			displayNotification: function () {
				if (this.notificationDatapoint > 0) {
				  console.log("block style!")
				  return 'block';
				}
				return 'none';
      },
			weeklynotes:function(){
				var starttime = moment(this.startdate).valueOf()/1000;
				console.log(starttime);
				var l = this.chartdata.filter(function(e){ return(e.date>=starttime && e.date<=(starttime+604800))});
				console.log(l);
				return l;
			}
		},
		mounted () {
      this.getPatientDataForWidget();
		},
		methods : {
			formatted:function(t){
				return moment(t).format("dddd, MMMM Do YYYY, h:mm:ss a");

			},
      getPatientDataForWidget() {
        this.chartdata = this.$store.getters.getPatientData(this.patientid)[this.object.id + "-data"];
        this.dataLoaded = true;

      },
      showAlert: function(datapoint, threshold) {
			  this.hasAlert = true;
			  this.$emit("alert", datapoint, threshold, this.tileindex);
			},
			showWarning: function(peakValue) {
			  this.hasAlert = true;
			  this.$emit("warning", peakValue)
			}
		},
		components : {
		  prowidget,
      smwidget
		}
				};
				</script>
				<style scoped>

				.kgl-tile {
						position: relative;
				    width: 100%;
						height: 100%;
				    background-color: #fff;
			    	color: #696969;
				    font-weight: 400;
				    border: 1px solid #e5e5e5;
				    padding: 0px ;
						transition: all 0.5s ease;
				}
				.kgl-tile.max{
						background-color: #e5e5e5;
					}

				.kgl-tile:hover {
				   border: 1px solid #0075bc;
					 cursor:pointer;
				}

				.kgl-tile.max:hover {
					border: 1px solid transparent;
					cursor: initial;
				}
				.kgl-tile.max p {
					border:1px solid #b3b3b3;
					background-color:#fff;
					min-height:200px;
				}

				.kgl-id {
					text-align: right;
					padding-right: 0px;
					right:-10px;
				}
				.notesdisplay {
						height:150px;
						background-color: #fff;
						margin:10px 0px;
						border: 1px solid #b3b3b3;
						overflow: auto;
						padding:10px 15px;
						text-align: left;
						text-transform: none;
				}
				.alert {
					color:red;
					margin:14px 0 0 20px;
					padding:0 0 0 0;
					font-size:14px;
				}
				.label {
					padding:100px 0 0 3px;
					font:bold 11pt 'Open Sans', sans-serif;
					text-transform: uppercase;
					color:black;
				}
				.alert-text {
					color: black;
					font: 11pt 'Open Sans', sans-serif;
					text-transform: none;
				}
				.title {
					margin: 0px;
				}
				</style>
