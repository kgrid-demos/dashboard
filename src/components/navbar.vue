<template id='navbar'>
	<div class='kgl-nav noselect'>
		<div class='navbar-brand kgl-1'>
			<span>{{dashboard}}</span>
		</div>
		<span class='navbar-label kgl-1' v-if='screenname!=""'>{{screenname}}</span>
		<nav class='navbar kgl-1 kg-bg-color kg-color'>
			<ul class='nav navbar-nav'>
				<li class='test' >
					<div class='dropdown' id="userDropdown" v-if='fullpath=="/"'>
						<a><span v-on:mouseenter='trigDropdown' v-on:mouseleave='checkDropdown'>Administrator</span></a>
						<ul class='dropdown-menu' v-if='showDropdown' v-on:mouseleave='leaveDropdown'>
							<li class='test' @click='setupstation'><a><span>Setup</span></a></li>
							<li class='test' @click='resetstore'><a><span>Reset</span></a></li>
              <router-link tag='li' :class="{'active': $route.fullPath === '/datagenerator'}" to='/datagenerator'><a><span>Generate Data</span></a></router-link>
						</ul>
					</div>
				</li>
			</ul>
		</nav>
	</div>
</template>
<script>
import resetState from '../store/index.js'
export default {
  name: 'navbar',
  data: function () {
    return {
 			showDropdown : false,
    };
  },
  created: function() {
	  this.showDropdown=false;
  },
  computed: {
		debugging: function(){
			return this.$store.getters.isDebugging;
		},
		dashboard: function(){
			return 'Patient Data Dashboard';
		},
		screenname: function(){
			return this.$store.getters.getScreenname;
		},
		training:function(){
			return this.$store.getters.gettrainmode;
		},
		fullpath:function(){
			return this.$route.fullPath;
		}
  },
  methods: {
		trigDropdown: function(){
			this.showDropdown=true;
			},
		checkDropdown: function(){
			this.showDropdown=true;
			},
		leaveDropdown:function(){
			this.showDropdown=false;
			},
		resetstore:function(){
			if (confirm("Data store will be reset! Are you sure?") == true) {
				var self=this;
				window.localStorage.removeItem("first")
				window.location.reload(true)
				resetState()
			}
		},
		stationselector:function(){
			if(!this.training){
				if(this.path!='/picker'){
					this.$router.push({ path: '/picker' });
				}
			}
		},
		setupstation:function(){
			this.$eventBus.$emit("config",this.fullpath);
		},
  }
};
</script>
<style scoped>
.navbar {
	margin-bottom:0px;
}
.navbar-nav {
	float:right;
	margin: 0px 40px 0px 0px;
}
.kgl-1 .navbar-nav>li.test {
	opacity:0;
}
.kgl-1 .navbar-nav>li.test:hover {
	opacity:1;
}
.kgl-1 .navbar-nav>li a {
	font-size:14px;
	font-weight: 400;
	line-height: 2.7em;
  letter-spacing: 0.05em;
	background-color: transparent;
  background-image: none;
	position: relative;
  display: block;
  padding: 4px 0px 4px 0px;
  margin: 7px 0px;
}
.kgl-nav {
	z-index:50;
}
.kgl-1 {
	z-index: 250;
}
.kgl-1 .navbar-nav>li{
    margin: 0px 15px;
}
.navbar-brand{
	background-color:#0075bc;
	position:absolute;
	margin: 14px 0px 0px 0px;
	padding: 2px 5px 2px 5px;
	z-index:400;
	top:0;
	width:250px;
	left:20px;
	height:26px;
	border:none;
	font-weight: 700;
	border:1px solid #0075bc;
	text-align:center;
	color:#fff;
}
.navbar-label {
	font-size:14px;
	margin-left:270px;
	margin-top:19px;
	position:absolute;
	cursor:auto;
	padding: 0px 18px;
	text-align: left;
	border-bottom:1px solid #0075bc;
	background-color:#fff;
	color:#0075bc;
}
#userDropdown.dropdown ul{
	border-bottom-left-radius: 10px;
	border-bottom-right-radius: 10px;
	transition: all .5s ease;
	padding: 0px;
	left: initial;
	right: -18px;
	margin-top: 10px;
	box-shadow: none;
	border-radius: 0px;
	display:block;
	min-width:200px;
}
#userDropdown.dropdown ul li {
    height: 2.7em;
    line-height: 2.8em;
    text-align: left;
		display: list-item;
		margin:0;
		transition: all 0.5s ease;
		background-color:#fff;
}
#userDropdown.dropdown ul li > a {
    padding: 0px 20px;
		height: 2.5em;
		text-decoration: none;
    cursor: pointer;
		background-color:transparent;
		margin:0;
	}
#userDropdown.dropdown ul li:hover {
	background-color:#e5e5e5;
}
.dropdown-menu > li > a:hover, .dropdown-menu > li > a:focus {
    background-color: #e8e8e8;
}
</style>
