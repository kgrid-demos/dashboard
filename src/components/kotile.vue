<template>
		<div class="container kgl-tile" :class="{max:maximized}" v-bind:id="object.label">
				<slot name='alerts' ></slot>
				<p>
          <prowidget v-if="cflag === 'PRO'" :alldata='chartdata' :patientid='patientid' :chartheight='cHeight' :editmode="editmode" :object="object" :title="object.label" :startdate="startdate"></prowidget>
          <smwidget v-if="cflag === 'SM'" :allmodules='chartdata' :patientid='patientid' :chartheight='cHeight' :editmode="editmode" :object="object" :title="object.label" ></smwidget>
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
		data () {
  	  return {
  	    chartdata: []
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

				weeklynotes:function(){
					var starttime = moment(this.startdate).valueOf()/1000;
					console.log(starttime);
					var l = this.chartdata.filter(function(e){ return(e.date>=starttime && e.date<=(starttime+604800))});
					console.log(l);
					return l;
				}
							},
		mounted () {
		  this.getChartDataFromJSONServer();
		},
		methods : {
      getChartDataFromJSONServer() {
        const baseDataUrl = 'http://localhost:3001/patients/';
        this.chartdata = [];
        let that = this;
        const objectURL = baseDataUrl + this.patientid;
        axios.get(objectURL).then(response => {
          response.data[that.object.id + "-data"].forEach(function(dataEl) {
            that.chartdata.push(dataEl);
            eventBus.$emit("chartDataReady");
          });
        });
      },
			formatted:function(t){
				return moment(t).format("dddd, MMMM Do YYYY, h:mm:ss a");

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
				    text-align: center;
				    width: 100%;
						height: 100%;
				    background-color: #fff;
			    	color: #696969;
				    font-weight: 400;
				    border: 1px solid #e5e5e5;
				    padding: 0px ;
						text-transform: uppercase;
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
				</style>
