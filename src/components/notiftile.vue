<template>
		<div class="container kgl-tile" v-bind:id="patient.id">
				<div class="row kgl-2">
					<div class="col-md-6 col-sm-6 col-xs-6  kg-fg-color"
							data-placement="top" style='font-size:22px;font-weight:600;'>
							<h2>{{patient.name}}<small class='pad-l-20'>Age {{patient.age}}, {{patient.gender}}</small></h2>
					</div>
					<div class="col-md-3 col-sm-3 col-xs-3  kg-fg-color">
					</div>
					<div class="col-md-3 col-sm-3 col-xs-3  kg-fg-color">
						<p class="float-r">{{formattedtime}}</p>
					</div>
				</div>
				<div class="notifdisp pad-l-15 pad-b-15">
				<ul>
					<li class='mar-bot-5' v-for='entry in notifications'>
						<i class='fa fa-arrow-up' v-if='entry.type>0' style='color:red;'></i>
						<i class='fa fa-arrow-right' v-if='entry.type==0' style='color:orange;'></i>
						<i class='fa fa-arrow-down' v-if='entry.type<0' style='color:green;'></i>
						{{entry.text}}
					</li>
				</ul>
				</div>
			</div>
	</template>
	<script>
	export default {
  		name:	"notiftile",
		props : [ 'patient', 'timestamp' ,'notifications'],
		created: function(){
		},
		computed : {
			formattedtime: function(){
				var t=this.$moment(this.timestamp).format("MMM Do YYYY, h:mm:ss a");
				return t
			}
		},
		methods : {

					}
				};
</script>
<style scoped>
	.kgl-tile {
	    text-align: left;
	    width: 99%;
	    background-color: #fff;
	   	color: #696969;
	    font-weight: 400;
	    padding: 10px ;
			transition: all 0.8s ease;
			border: 1px solid #b3b3b3;
			border-left: 3px solid #bc2526;
			margin:20px 30px 0px 10px;
		}
	.kgl-tile:hover {
	  	cursor:pointer;
	}
	.kgl-tile>.row {
			margin: 10px 0px;
	}
</style>
