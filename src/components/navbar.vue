<template id='navbar'>
	<div class='kgl-nav'>
			<router-link class='navbar-brand kgl-1' to='/'>
						<span>Dashboard</span>
			</router-link>
			<nav class='navbar navbar-fixed-top kgl-1 kg-bg-color kg-color'>
				<div class='wrapper'>
						<ul class='nav navbar-nav'>
							<router-link tag='li' :class="{'active': $route.fullPath === '/about'}" to='/about'><a><span>Patient</span></a></router-link>
							<router-link tag='li' :class="{'active': $route.fullPath === '/about'}" to='/about'><a><span>Calendar</span></a></router-link>
							<router-link tag='li' :class="{'active': $route.fullPath === '/about'}" to='/about'><a><span>Notifications</span></a></router-link>
							<router-link tag='li' :class="{'active': $route.fullPath === '/about'}" to='/about'><a><span>Dr.</span></a></router-link>
						</ul>
				</div>
			</nav>
		</div>
</template>

<script>
import eventBus from '../eventBus.js'

export default {
  name: 'navbar',
  data: function () {
    return {
 			showDropdown : false
    };
  },
  created: function() {
	  this.showDropdown=false;
  },
  computed: {
		firstname: function(){
			return (this.$store.state.currentUser.first_name || "")
		},
	isAdmin: function(){
			return this.$store.getters.isAdmin;
		}
  },
  methods: {

  }
};
</script>

<!-- Add 'scoped' attribute to limit CSS to this component only -->
<style scoped>
.navbar-nav {
	float:right;
	margin: 0px 40px 0px 0px;
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
	background-color:#fff;
	position:fixed;
	margin: 1px 0px;
	padding: 14px 0px;
	z-index:400;
	top:0;
	width:200px;
	left:40px;
	height:56px;
	border:none;
}



.kgl-1 .navbar-right {
	margin-right: 0px;
}

#signupBtn {
	border: 1px solid #e3e3e3;
    border-radius: 10px;
    color: #fff;
	width: 125px;
	text-align: center;
}

i#dropdowniconimg {
	transition: transform 0.5s linear;
}
i#dropdowniconimg.up {
-moz-transform: scaleY(-1);
-o-transform: scaleY(-1);
-webkit-transform: scaleY(-1);
transform: scaleY(-1);
}

i#dropdowniconimg.down {
-moz-transform: scaleY(1);
-o-transform: scaleY(1);
-webkit-transform: scaleY(1);
transform: scaleY(1);
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
#adduserBtn, #logoutBtn {
    line-height: 2.5em;
    text-decoration: none;
    border: none;
    cursor: pointer;
    font-size: 14px;
    font-style: normal;
    font-weight: 400;
min-width: 200px;
}


.login-link {
		cursor:pointer;
		padding:5px 25px;
		border:1px solid #0075bc;
		background-color:#fff;
		color: #0075bc;
		transition:all 0.8s ease;
		list-style:none;
		margin: 15px 0px;
	}
.login-link span{
	background-color:#fff;
	color: #0075bc;
	transition:all 0.8s ease;
}
.login-link:hover,  .login-link:hover span{
		background-color:#0075bc;
		color: #fff;
}
</style>
