<template id='navbar'>
	<div class='kgl-nav'>
		<a class='navbar-brand kgl-1' @click='stationselector'>
			<span>{{dashboard}}</span>
		</a>
		<nav class='navbar navbar-fixed-top kgl-1 kg-bg-color kg-color'>
			<ul class='nav navbar-nav'>
				<router-link tag='li':class="{'active': $route.fullPath === '/'}" to='/' v-show='false'><a><span>Patients</span></a></router-link>
				<router-link tag='li' :class="{'active': $route.fullPath === '/notification'}" to='/notification' v-show='false'><a><span>Notifications</span><div style='color:#bc2526;top:0px;right:-10px;position:absolute;font-size:10px;'><i class='fa fa-circle' v-if='notifCount>0'></i></div></a></router-link>
				<li class='test'>	<div class='dropdown' id="userDropdown" >
					<a><span v-on:mouseenter='trigDropdown' v-on:mouseleave='checkDropdown'>Administrator</span></a>
							<ul class='dropdown-menu' v-if='showDropdown' v-on:mouseleave='leaveDropdown'>
				<li class='test' @click='resetstore'><a><span>Reset</span></a></li>
                <router-link tag='li' :class="{'active': $route.fullPath === '/datagenerator'}" to='/datagenerator'><a><span>Generate Data</span></a></router-link>
				</ul>
							</div></li>
			</ul>
		</nav>
	</div>
</template>

<script>
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
			var d= 'Dashboard';
			if(this.$store.getters.getCurrentStation.label!=""){
						d=this.$store.getters.getCurrentStation.label + ' '+d;
			}
			return d;
		},
		notifCount: function() {
				return this.$store.getters.getNotificationList.length;
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
			if (confirm("Datastore will be reset! Are you sure?") == true) {
				var self=this;
				this.$http.get("./static/json/default.json").then( response=> {
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
		genpatientdata: function(){
			const patientList = this.$store.getters.getPatientMasterList;
			var widgetList = [];
			const basedataurl = 'http://localhost:3001/patients/';
			let that = this;
      let url;
			console.log(patientList);
			patientList.forEach(function(patient) {
			  if(patient.id) {
				 	widgetList=that.$store.getters.getwidgetlistbypatient(patient)
			    url = basedataurl + patient.id;
          let data = {};
			    widgetList.forEach(function(widget){
            const widgetDataID = widget.id + "-data";
			      if(widget.id.startsWith("PRO")) {
			        const proMaxVal = 10;
			        const proFreq = 14; // Data points per week
			        const weeksToGenerate = 2;
              data = that.genrandomprodata(widgetDataID, data, proMaxVal, weeksToGenerate);
            } else {
			        const smMaxVal = 2; // Only allow completed and skipped data
			        const smFreq = 7; // Self-evals per week
			        const weeksToGenerate = 2;
              data = that.genrandomsmdata(widgetDataID, data, smMaxVal, smFreq, weeksToGenerate);
						}
			  	});
          that.$http.put(url, data).catch(function (ex) {
            if(ex.response.status === 404) {
            }
          });
				}
			});
			this.$store.commit("resetPatientData");
		},
    genrandomsmdata: function(widgetDataID, data, maxVal, freq, weeks){
		  let recordDate = this.$moment().set({'hour': 12, 'minute': 0, 'second': 0}).subtract(7 * weeks, 'd');
      data[widgetDataID] = [];
		  for(let i = 0; i < freq * weeks; i++) {
		    // Once per day
        recordDate.add(1, 'd');
        data[widgetDataID].push({"date": this.$moment(recordDate).unix(), "value": this.getRandomSMValue(maxVal)});
			}
			return data;
		},
    genrandomprodata: function(widgetDataID, data, maxVal, weeks){
      let recordDate = this.$moment().set({'hour': 0, 'minute': 0, 'second': 0}).subtract(7 * weeks, 'd');
      let priorVal = 3;
      let note = "";
      data[widgetDataID] = [];
      for(let i = 0; i < 28 * weeks; i++) {

        recordDate.add(360, 'm');
        priorVal = this.getRandomPROValue(maxVal, priorVal);
        note = this.genNote(priorVal, maxVal);

        let randomTime = this.getRandomMinutes();
        data[widgetDataID].push({"date": this.$moment(recordDate).add(randomTime, 'm').unix(), "value": priorVal, "note": note});

      }
      return data;
    },
		getRandomSMValue: function(max) {
      // Bias the data slightly towards completions
			let val =  Math.floor(Math.random() * (max) * 2) + 1;
			if (val > 2) {
			  val = 2;
      }
      return val;
		},
		getRandomMinutes: function() {
      // A random number of minutes between -2.5 hrs and + 2.5 hrs to add from the usual 6-hour increments
      return Math.floor(Math.random() * 300) - 150;
    },
    getRandomPROValue: function(max, priorVal) {

      // Wiener process-style random walk from the prior value biased towards the bottom of the scale
      let val = Math.round((Math.random() * Math.random() - 0.4) * 15.25 + 0.5) + priorVal;
      if(val > max) {
        return max;
			}
			if(val < 0) {
        return 0;
			}
			return val;
    },
		genNote: function(value, maxVal) {
      if(value < maxVal/3) {
        return "";
			}
			if(value < (maxVal/3)*2) {
        return "I'm feeling a little distressed";
			}
			return "I'm not feeling well at all";
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
	width:110px;
	left:20px;
	height:56px;
	border:none;
	font-weight: 800;
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
nav .alertbadge{
	position: absolute;
	right: -15px;
	top: 5px;
	color: #fff;
	background-color:#bc2526;
	border-radius:100%;
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
