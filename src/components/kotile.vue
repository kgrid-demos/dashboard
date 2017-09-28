<template>
		<div class="container kgl-tile" v-bind:id="object">
				<p><widget :chartheight='(containerheight-30)' :editmode="editmode" :title="object" :showoptions="editmode" v-on:sliderdrag="preventDrag"></widget></p>
		</div>
	</template>
	<script>
	import moment from 'moment';
	import eventBus from '../eventBus.js';
	import widget from './widget.vue';
	export default {
  	name:	"kotile",
		props : [ 'object', 'cflag' ,'tileindex', 'containerheight', 'editmode'],
		created: function(){

		},
		computed : {

					},
		methods : {
			preventDrag (e) {
			  this.$emit('preventdrag');
			}
					},
		components : {
		  widget
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
				    border: 1px solid #fff;
				    padding: 0px ;
						text-transform: uppercase;
						transition: all 0.5s ease;
				}

				.kgl-tile:hover {
				   border: 1px solid #0075bc;
					 cursor:pointer;
				}


.kgl-id {
	text-align: right;
	padding-right: 0px;
	right:-10px;
}

				</style>
