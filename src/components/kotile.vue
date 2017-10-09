<template>
		<div class="container kgl-tile" :class="{max:maximized}" v-bind:id="object.label">
				<slot name='alerts' ></slot>
				<p>
          <prowidget v-if="cflag === 'PRO'" :patientid='patientid' :chartheight='cHeight' :editmode="editmode" :object="object" :title="object.label" :startdate="startdate"></prowidget>
          <smwidget v-if="cflag === 'SM'" :patientid='patientid' :chartheight='cHeight' :editmode="editmode" :object="object" :title="object.label" ></smwidget>
        </p>
				<slot name='notes'></slot>
		</div>
	</template>
	<script>
	import moment from 'moment';
	import eventBus from '../eventBus.js';
	import prowidget from './prowidget.vue';
	import smwidget from './smwidget.vue';
	export default {
  	name:	"kotile",
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
				}
				},
		methods : {
		  sliderdrag () {
		    this.$emit("sliderdrag");
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

				</style>
