<template>
		<div class="container kgl-tile" :class="{max:maximized}" v-bind:id="object.label">
          <prowidget v-if="cflag === 'PRO' " ref="widget" :patientid='patientid' :viewmode='viewmode' v-on:instrselected='instrselected' :chartheight='cHeight' v-on:maximizeme='maximizeme' :editmode="editmode" :object="object" :maximized="maximized" :title="object.label" ></prowidget>
          <smwidget v-if="cflag === 'SM'  " :patientid='patientid' :chartheight='cHeight' :viewmode='viewmode' :editmode="editmode" :object="object" :title="object.label" v-on:maximizeme='maximizeme' :maximized="maximized" ></smwidget>
		</div>
	</template>
	<script>
	import prowidget from './prowidget.vue';
	import smwidget from './smwidget.vue';
	export default {
  	name:	"kotile",
		data() {
  	  return {}
		},
		props : [ 'object', 'patientid','cflag', 'viewmode', 'maximized','tileindex', 'containerheight', 'editmode'],
		computed : {
			cHeight: function(){
				var h = (this.containerheight-30)
				if (this.maximized) {
					h=h*0.5;
				}
				return h
			}
		},
		components : {
		  prowidget,
      smwidget
		},
		methods: {
			instrselected:function(obj){
				this.$emit('setinstru',obj)
			},
			maximizeme:function(id){
				this.$emit("maximizeme",id)
			}

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
				    border: none;
				    padding: 0px ;
						transition: all 0.5s ease;
				}
				.kgl-tile.max{
						background-color: #e5e5e5;
					}

				/*.kgl-tile:hover {
					 cursor:pointer;
				}*/

				.kgl-tile.max:hover {
					border: none;
					cursor: initial;
				}
				.kgl-tile.max p {
					border:none;
					background-color:#fff;
					min-height:200px;
				}

				.kgl-id {
					text-align: right;
					padding-right: 0px;
					right:-10px;
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
