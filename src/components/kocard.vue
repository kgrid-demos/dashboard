<template>
		<div class="container kgl-tile" :class="cflag" v-bind:id="object">
				<p class='ft-sz-12'>{{object}}</p>
				<div class="cornerflag" ><p class='ft-sz-10'>{{cflag}}</p></div>

			</div>
	</template>
	<script>

	export default {
  		name:	"kocard",
		props : [ 'object', 'cflag' ,'tileindex'],
		created: function(){
		},
		computed : {
		},
		methods : {
		}
	};
	</script>
				<style scoped>
				.cornerflag {
					position:absolute;
					top:1px;
					left:-3px;
					text-align:center;
					width:25px;
					height:25px;
					border:1px solid transparent;
					color:#fff;
					z-index:20;
				}

				.kgl-tile::before,
				.kgl-tile::after {
				    content: '';
				    position: absolute;
				    top: 0;
				    left: 0;
				    border-color: transparent;
				    border-style: solid;
						z-index:10;
				}

				.kgl-tile::before {
				    border-width: 1px;
				    border-left-color: #ccc;
				    border-top-color: #ccc;
				}

				.kgl-tile.PRO::after {
			    	border-width: 1em;
				    border-left-color: #853754;
				    border-top-color: #853754;
				}

				.kgl-tile.SM::after {
						border-width: 1em;
						border-left-color: #20657e;
						border-top-color: #20657e;
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
				    width: 110px;
						height: 80px;
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
