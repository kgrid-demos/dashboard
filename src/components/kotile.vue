<template>
		<div class="container kgl-tile" v-bind:id="object">
				<p><widget :chartheight='this.containerheight'></widget></p>
		</div>
	</template>
	<script>
	import moment from 'moment';
	import eventBus from '../eventBus.js';
	import widget from './widget.vue';
	export default {
  		name:	"kotile",
		props : [ 'object', 'cflag' ,'tileindex', 'containerheight'],
		created: function(){

		},
		computed : {

					},
		methods : {

					},
		components : {
		  widget
		}
				};
				</script>
				<style scoped>

				.kgl-tile::before,
				.kgl-tile::after {
				    content: '';
				    position: absolute;
				    bottom: 0;
				    right: 0;
				    border-color: transparent;
				    border-style: solid;
						z-index:10;
				}

				.kgl-tile::before {
				    border-width: 1px;
				    border-right-color: #ccc;
				    border-bottom-color: #ccc;
				}

				.kgl-tile::after {
			    	border-width: 0.5em;
				    border-right-color: #bbbbbb;
				    border-bottom-color: #bbbbbb;
				}

				.cornerflag p {
					postion:relative;
					text-align:center;
					transform: rotate(-45deg);
					color:#fff;

				}

				.kgl-tile {
						position: relative;
				    text-align: center;
				    width: 100%;
						height: 100%;
				    background-color: #fff;
			    	color: #696969;

				    font-weight: 400;
				    border: 2px solid #e5e5e5;
				    padding: 0px ;
						text-transform: uppercase;
						transition: all 0.5s ease;
				}
				.kgl-tile>p {
					position:relative;
					top: 50%;
					-webkit-transform: translateY(-50%);
					-ms-transform: translateY(-50%);
					transform: translateY(-50%);

				}
				.kgl-tile:hover {
				   border: 2px solid #0075bc;
					 cursor:pointer;
				}


.kgl-id {
	text-align: right;
	padding-right: 0px;
	right:-10px;
}

				</style>
