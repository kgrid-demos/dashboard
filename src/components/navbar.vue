<template id='navbar'>
	<div class='kgl-nav'>
			<a class='navbar-brand kgl-1' @click='stationselector'>
						<span>{{dashboard}}</span>
			</a>
			<nav class='navbar navbar-fixed-top kgl-1 kg-bg-color kg-color'>

						<ul class='nav navbar-nav'>
							<router-link tag='li':class="{'active': $route.fullPath === '/'}" to='/'><a><span>Patients</span></a></router-link>
							<router-link tag='li' :class="{'active': $route.fullPath === '/about'}" to='/about'><a><span>Calendar</span></a></router-link>
							<router-link tag='li' :class="{'active': $route.fullPath === '/about'}" to='/about'><a><span>Notifications</span></a></router-link>
							<router-link tag='li' :class="{'active': $route.fullPath === '/about'}" to='/about'><a><span>User</span></a></router-link>
							<li class='test' @click='resetstore'><a><span>Reset</span></a></li>
							<li class="test" @click="genpatientdata"><a>Generate Patient Data</a></li>
													</ul>

			</nav>
		</div>
</template>

<script>
import eventBus from '../eventBus.js';
import axios from 'axios';
import moment from 'moment';

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
		firstname: function(){
			return (this.$store.state.currentUser.first_name || "")
		},
		isAdmin: function(){
			return this.$store.getters.isAdmin;
		},
		dashboard: function(){
			var d= 'Dashboard';
			if(this.$store.getters.getCurrentStation.label!=""){
						d=this.$store.getters.getCurrentStation.label + ' '+d;
			}

			return d;
			}
  },
  methods: {
		resetstore:function(){
			if (confirm("Datastore will be reset! Are you sure?") == true) {
				var self=this;
				axios.get("./static/json/default.json").then( response=> {
					self.$store.commit('resetState', response.data)
				}).catch(e=>{
					console.log(e)
				});
			} else {

			}
		},
		stationselector:function(){
			var r = this.$route.fullPath;
			if(this.debugging) console.log("Route Path: "+r);
			if(r!='/'){
				this.$router.push({ path: '/' });
			}else{
				this.$store.commit('selstation',{value:-1});
			}
		},
		seeallpatients:function(){
			this.$store.commit('setgroupid',{value:-1});
			this.$router.push({ path: '/' });
		},

		genpatientdata: function(){
			const patientList = this.$store.getters.getPatientMasterList;
			const widgetList = this.$store.getters.getwidgetMaster;
			const basedataurl = 'http://localhost:3001/patients/';
			let that = this;
      let url;
			console.log(patientList);
			patientList.forEach(function(patient) {
			  if(patient.id) {
			    url = basedataurl + patient.id;
          let data = {};
			    widgetList.forEach(function(widget){
            const widgetDataID = widget.id + "-data";
			      if(widget.id.startsWith("PRO")) {
			        const proMaxVal = 10;
			        const proFreq = 14; // Data points per week
			        const weeksToGenerate = 2;
              data = that.genrandomdata(widgetDataID, data, proMaxVal, proFreq, weeksToGenerate);
            } else {
			        const smMaxVal = 2;
			        const smFreq = 4;
			        const weeksToGenerate = 2;
              data = that.genrandomdata(widgetDataID, data, smMaxVal, smFreq, weeksToGenerate);
						}
			  	});
          axios.put(url, data).catch(function (ex) {
            if(ex.response.status === 404) {
            }
          });
				}
			});
		},
		genrandomdata: function(widgetDataID, data, maxVal, freq, weeks){
		  let recordDate = moment().set({'hour': 0, 'minute': 0, 'second': 0}).subtract(7 * weeks, 'd');
      data[widgetDataID] = [];
		  for(let i = 0; i < freq * weeks; i++) {
        recordDate.add(((7.0/freq) * 24), 'h');
        data[widgetDataID].push({"date": moment(recordDate).unix(), "value": this.getRandomValue(maxVal)});
			}
			return data;
		},
		getRandomValue: function(max) {
			return Math.floor(Math.random() * (max)) + 1;
		}
  }
};
</script>

<!-- Add 'scoped' attribute to limit CSS to this component only -->
<style scoped>
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
	background-color:#fff;
	position:fixed;
	margin: 1px 0px;
	padding: 14px 0px;
	z-index:400;
	top:0;
	width:350px;
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
