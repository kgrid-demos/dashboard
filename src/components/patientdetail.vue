<template>
	<div class='content'>
		<applayout :nothelper='true'>
		<div slot='banner'>
		<div class='row ht-30'>
		</div>
		<div class='row kgl-detail-titlerow'>
				<div id='ko-title' class='col-md-12 col-sm-12'>
					<div id= 'type-status' >
						<i v-if="objModel.object.metadata.published" class='fa fa-circle kg-fg-color ft-sz-12 '></i>
					</div>
					<h1>
						{{objModel.object.metadata.title}}
					</h1>
				</div>
		</div>
		<div class='row ht-40 pad-0'>
		<div class='col-md-8 col-sm-8 col-xs-8'></div>
		<div class="col-md-4 col-sm-4 col-xs-4 pad-0" >
			<div class='float-r'>
				<ul class="actioniconlist" v-if='true'>
					<li v-show='isLoggedIn'  v-on:click='editObj'>
					<div>
						<a>
						<div class='actionicon'  v-on:click='editObj'>
								<i class="fa fa-edit" aria-hidden="false"></i>
						</div>
						</a>
						<div class='actioniconcap'>
						<span >EDIT</span>
						</div>
						</div>
					</li>
					<li>
					<div>
						<a v-bind:href='downloadLink' :download='downloadFile'>
							<div class='actionicon'><i class="fa fa-download" aria-hidden="true"></i></div>
						</a>
						<div class='actioniconcap'>
							<span>DOWNLOAD</span></div>
							</div>
					</li>
					<li v-if='isLoggedIn'>
					<div>
						<a>
						<div class='actionicon'  v-on:click='deleteObject'><i class="fa fa-trash" aria-hidden="true"></i></div>
						</a>
						<div class='actioniconcap'>
								<span>DELETE</span></div>
												</div>
					</li>
				</ul>
			</div>
		</div>
		</div>
		<div class='row kgl-detail-daterow'>
				<div class='col-md-3 col-sm-3 col-xs-3'>
					<p class='kg-label'>Object ID</p>
					<p class='date-data'>
						<span>{{objModel.object.uri}}</span>
					</p>
				</div>
				<div class='col-md-2 col-sm-2 col-xs-2'>
					<p class='kg-label'>Last Updated</p>
					<p class='date-data'>
						<span v-text='formattedUpdateDate'></span>
					</p>
				</div>
				<div class='col-md-2 col-sm-2 col-xs-2'>
					<p class='kg-label'>Created On</p>
					<p class='date-data'>
						<span v-text='formattedCreateDate'></span>
					</p>
				</div>
				<div class='col-md-5 col-sm-5 col-xs-5'>
					<div class='float-r wd-70'>
						<p class='kg-label'>View Type</p>
							<div v-if='isAdmin'>
								<div class="spinner" v-if="settingPubPri">
									<i class="fa fa-circle-o-notch fa-spin fa-fw kg-fg-color"></i>
									<span class="sr-only">Loading...</span>
								</div>
								<div class='dropdown' id="pubDropdown" v-else style='height:15px;' v-click-outside='outside'>
									<a data-target='#' v-on:click='togglePubDropdown'>
										<div class='row float-r mar-r-12 pad-t-2 lh-1'>
											<span class=' ft-sz-14 kg-fg-color'>{{pubState}}</span>
											<i id='pubdropdowniconimg' class='fa fa-caret-down kg-fg-color down'></i>
										</div>
									</a>
									<ul class='dropdown-menu mar-top20' id='pubdropdown' v-if='showPubDropdown'>
										<li><a v-on:click='setPublic'><span>Public</span></a></li>
										<li><a v-on:click='setPrivate'><span>Private</span></a></li>
									</ul>
								</div>
							</div>
							<div v-else>
								<div class='row float-r mar-r-12 pad-t-2 lh-1'>
									<span class=' ft-sz-14 kg-fg-color'>{{pubState}}</span>
								</div>
							</div>
					</div>
				</div>
			</div>
		</div>
		<div slot='header'>
		<ul class='nav nav-tabs view' role='tablist' id='tabs'>
		<li v-for='section in sections' v-bind:id='section.name' v-bind:class="{ active: activeTab === section.label }" v-on:click="selectTab(section)"><a >{{section.label}}</a></li>
		<li role='presentation' class='labels'><a>
				<i class='fa fa-ellipsis-h'></i>
		</a></li>
	</ul>

		</div>
			<div slot='main'>
					<ul class='tab-content view' id='tab'>
						<li v-for='section in sections' v-bind:id='section.name'
								 v-bind:class="{ active: activeTab === section.label }">
								<tabpane v-bind:section='section.name' v-bind:object='objModel.object' ></tabpane>
						</li>
					</ul>
				</div>
			</applayout>
	</div>
	</template>
	<script>
	var $ = require('jquery');
	import applayout from './applayout.vue';
	import eventBus from '../eventBus.js';
		export default {
		name:'ko-detail',
		data : function() {
			return {
				objModel : objModel,
				sections : sections,
				isDisabled: 1,
				showPubDropdown:false,
				pubpriwidth: '50px',
				isPublic:false,
				settingPubPri:false,
				publishState: 'Unpublished',
				userModel:{user:{username:'',password:''}},
				activeTab: 'METADATA',
				confirmrequest:{name:"deleteObject",statement:"This Object will be deleted!"},
			}
		},
		components:{
			'applayout':applayout,

		},
		created : function() {
			var self = this;
			eventBus.$on("objSaved",function(obj){
				self.objModel.object.metadata.citations.splice(0,self.objModel.object.metadata.citations.length);
				$.extend(true, self.objModel.object, obj);
			});
			eventBus.$on('objectSelected',function(obj){
				$.extend(true, self.objModel.object, obj);
				otScroll();
			});
			eventBus.$on('userloggedin',function(obj){
				self.isLoggedIn=true;
				$.extend(true, self.userModel.user,obj);
				//self.isAdmin = (self.userModel.user.role=='ADMIN');

			});
			eventBus.$on('confirm', function (data) {
				console.log(data);
				if(data.name=="deleteObject"){
				if(data.val==true){
					var uri = self.objModel.object.uri;
					var txt;
					if (uri != "") {
							$.ajax({
									type : 'DELETE',
									url : "knowledgeObject/"
											+ uri,
									success : function(
											response) {
										eventBus.$emit('objDeleted', self.objModel.object);
									}
								});
					}
				}
				}
			});
			eventBus.$on('logout', function(){
				if(!self.isPublic){
					eventBus.$emit('return');
				}
			});
			},
		mounted:function() {
			var self = this;
			retrieveObject(this.$store.state.baseurl, this.$route.params.uri, "complete", function(response) {
				self.objModel.object = response;
				self.isPublic = self.objModel.object.metadata.published;

			}, function(response){
				console.log("Error:");
				console.log(response);
				eventBus.$emit('404');
			});
	    	$('ul#tabs li.active').addClass('middleout');
	    	$("html, body").animate({
	        	scrollTop: 0
	    	}, 200);

	    	$('.kgl-banner').addClass('detail');
				$(".header").wrap('<div class="theadwrapper"></div>');
				$(".theadwrapper").height($(".header").outerHeight(false));
	    	otScroll();
		},
		computed : {
		isAdmin: function() {
			return this.$store.getters.isAdmin;
		},
			isLoggedIn:function(){
				return this.$store.getters.isLoggedIn;
		},
			pubState: function(){
				return this.isPublic ? 'Public' : 'Private'
			},
			formattedUpdateDate : function() {
				if(!this.objModel.object.metadata.lastModified || this.objModel.object.metadata.lastModified=="" ){
					return ""
				}
				else
					{return new Date(this.objModel.object.metadata.lastModified)
						.format("mediumDate")}
				},
			formattedCreateDate : function() {
					if(!this.objModel.object.metadata.createdOn || this.objModel.object.metadata.createdOn=="" ){
						return ""
					}
					else
						{return new Date(this.objModel.object.metadata.createdOn)
							.format("mediumDate")}
					},


			downloadLink : function() {
				return 'knowledgeObject/'
					+ this.objModel.object.uri+'.json'
			},
			downloadFile : function() {
				return this.objModel.object.uri + '.json'
			}
		},
		updated : function() {
			otScroll();
		},
		methods:{
		outside: function(){
			if(this.showPubDropdown){
				this.togglePubDropdown();
			}
		},
		togglePubDropdown: function () {
			this.showPubDropdown=!this.showPubDropdown;
			if(this.showPubDropdown){
						$('#pubdropdowniconimg').removeClass('down');  // eslint-disable-line
						$('#pubdropdowniconimg').addClass('up');  // eslint-disable-line
			}else
			{
						$('#pubdropdowniconimg').removeClass('up');  // eslint-disable-line
						$('#pubdropdowniconimg').addClass('down');  // eslint-disable-line
			}
			},
		setPublic: function(){
			this.toggleObject(true);
		},
		setPrivate: function(){
			this.toggleObject(false);
		},
		selectTab: function(section){
				console.log("Clicked on "+section.label);
				this.activeTab=section.label;
				if(section.label!='LOG DATA'){
				this.$store.commit('setactivetab',section.label);
				}
		},
			editObj:function(){
				$.extend(true, editObjModel.object, this.objModel.object);
				if(editObjModel.object.metadata.citations.length==1 && editObjModel.object.metadata.citations[0].title=="" ){
					editObjModel.object.metadata.citations=[];
				}
				if(editObjModel.object.outputMessage==null){
					editObjModel.object.outputMessage="";
				}
				if(editObjModel.object.inputMessage==null){
					editObjModel.object.inputMessage="";
				}
				eventBus.$emit('editObj', {'object':this.objModel.obj,'atab':this.activeTab});
			},
			toggleObject:function(pub){
				var uri=this.objModel.object.uri;
				var published='';
				var self=this;
				if(pub){
					published='published';
				}else{
					published='unpublished';
				}
				self.settingPubPri=true;
				self.showPubDropdown=false;
				$.ajax({
					beforeSend : function(xhrObj) {
						xhrObj.setRequestHeader("Content-Type", "application/json");
					},
					type : 'PUT',
					url : "knowledgeObject/" + uri + "/" + published,
					success : function(response) {
						self.isPublic=pub;
						objModel.object.metadata.published=pub;
						self.settingPubPri=false;
					},
					error : function(response, tStatus, xhr) {
						console.log(response);
						if(response.status=='500'){
							self.isPublic=pub;
							objModel.object.metadata.published=pub;
						}
						self.settingPubPri=false;
					}
				});
			},
			deleteObject : function() {
					eventBus.$emit("confirmRequest",this.confirmrequest);
			}
		}
};
	</script>
<style>
.kgl-banner.detail {
	height: 220px;
padding: 0px 32px 0px 48px;
margin:0 auto;
}
.kgl-detail-smallrow {
	height: 20px;
	margin-left: -40px;
}
.kgl-detail-spacer {
	height: 25px;
}
.kgl-detail-titlerow {
	height: 80px;
	margin-left: -40px;
}
.kgl-detail-daterow {
	height: 60px;
	margin-top: 0px;
}
.kgl-detail-daterow div {
	padding-right: 0px;
}

#type-status {
	width: 10px;
	height: 42px;
	display: inline-block;

}
#type-status i {
	position: absolute;
	top: 9px;
left: 0px;
}
#ko-title {
	position:relative;
	display: block;
	margin-left:16px;
}

#ko-title h1{
	position: absolute;
  display: inline-block;
  left: 24px;
  margin: 0;
  text-align: left;
  padding: 0;
}

.nav-tabs>li.active>a, .nav-tabs>li.active>a:focus, .nav-tabs>li.active>a:hover {
color:#0075bc;
    cursor: pointer;
    background-color: #fff;
    border: 1px solid #fff;
    border-bottom-color: transparent;
}
ul#tabs li.active:after, ul#tabs li:hover:after {
    width: 100%;
    background: #0075bc;
}
ul#tabs li:after {
    content: '';
    display: block;
    margin: auto;
    height: 2px;
    width: 0px;
    background: transparent;
    transition: width .5s ease, background-color .5s ease;
}

ul#tab>li {
	display:none;
}
ul#tab>li.active {
	display:block;
	padding: 36px 36px;
}

.date-title {
	font-size: 11px;
margin-bottom: 0px;
}
.date-data {
	font-size: 14px;
}

#objBtns{
	top: 10px;
    right: 68px;
    position: absolute;
}

i#pubdropdowniconimg {
	transition: transform 0.5s linear;
}
i#pubdropdowniconimg.up {
-moz-transform: scaleY(-1);
-o-transform: scaleY(-1);
-webkit-transform: scaleY(-1);
transform: scaleY(-1);
}

i#pubdropdowniconimg.down {
-moz-transform: scaleY(1);
-o-transform: scaleY(1);
-webkit-transform: scaleY(1);
transform: scaleY(1);
}


.kgl-download{
	width: 40px;
	height: 40px;
	position:absolute;
  bottom:-13px;
  margin:0 auto;
  z-index:500;
}
.kgl-download .btnContent {
    position: relative;
    top: -29px;
    left: 16px;
    opacity: 0.5;
    transition: opacity 0.5s ease;
}
.kgl-back{
	width: 40px;
	height: 40px;
	position:absolute;
    bottom:-17px;
    right:200px;
    margin:0 auto;
    z-index:500;
}

.kgl-back .btnContent {
	position: relative;
    top: -22px;
    left:18px;
}

.dropdown-menu {
position: absolute;
top:auto;
right: 0;
left: auto;
z-index: 10000;
float: left;
min-width: 80px;
display: block;
padding: 0;
font-size: 14px;
text-align: left;
list-style: none;
background-color: #fff;
-webkit-background-clip: padding-box;
background-clip: padding-box;
border: 1px solid #ccc;
border: 1px solid rgba(0,0,0,.15);
border-radius: 4px;
-webkit-box-shadow: 0 6px 12px rgba(0,0,0,.175);
box-shadow: 0 6px 12px rgba(0,0,0,.175);
z-index:99999;
}
.dropdown ul {
	background-color: #fff;
	color: #333;
}
.dropdown-menu > li > a {
    padding: 0px 10px;
    line-height: 2.5em;
		text-decoration: none;
    cursor: pointer;
    transition: color 0.5s ease;
		background-color:transparent;
	}

.nav-tabs>li>a, .nav-tabs>li>a:focus, .nav-tabs>li>a:hover {
    cursor: pointer;
    background-color: #fff;
    border: 1px solid #fff;
    border-bottom-color: transparent;
}
ul.dropdown-menu#pubdropdown {
	width: 50px;
}
div.spinner {
text-align:center;
}
</style>
