import Vue from 'vue'
import Vuex from 'vuex'
import VuexPersistence from 'vuex-persist'

Vue.use(Vuex)

const debug = process.env.NODE_ENV !== 'production'
const vuexLocal = new VuexPersistence ({
    key:"first",
    storage: window.localStorage,
    // reducer: state => ({patientlist: state.patientlist, currentStation: state.currentStation, currentGroup:state.currentGroup}),
})
export default new Vuex.Store({
  strict: process.env.NODE_ENV !== 'production',
  plugins: [vuexLocal.plugin],
  state:{
      init:{},
      debugEnabled:true,
      loggerURL:'http://localhost:3003/dashboardlog',
      currentStation:{id:0,"label":"Colon Cancer"},
      currentGroup:{id:0,"color":"#0075bc"},
      currentPatientIndex: -1,
      patientlist:  [],
    },
  mutations: {
    init(state, obj){
      state.init=JSON.parse(JSON.stringify(obj));
      state.loggerURL=state.init.loggerURL;
      var ptlist=state.init.patientMasterList;
      ptlist.forEach(function(e){
        var pid=e.id;
        var pname=e.name;
        var page=e.age;
        var pgender = e.gender;
        var type=e.type;
        e.group.forEach(function(ee){
          var gid=ee.id;
          var index = state.patientlist.findIndex(function(el) {
            return el.id==pid && el.groupid==gid});
          if(index==-1){
            var temp={};
            temp=JSON.parse(JSON.stringify(state.init.patientstemplate));
            temp.id=pid;
            temp.name=pname;
            temp.age=page;
            temp.gender=pgender;
            temp.groupid=gid;
            temp.type=type;
            state.patientlist.push(temp);
          }
        })
      });
      window.dispatchEvent(new Event('reload'));
    },
    resetState(state,obj){
      state.init=JSON.parse(JSON.stringify(obj));
      state.patientlist.splice(0, state.patientlist.length);
      var ptlist=state.init.patientMasterList;
      ptlist.forEach(function(e){
        var pid=e.id;
        var pname=e.name;
        var page=e.age;
        var pgender = e.gender;
        var type=e.type;
        e.group.forEach(function(ee){
          var gid=ee.id;
          var index = state.patientlist.findIndex(function(el) {
            return el.id==pid && el.groupid==gid});
          if(index==-1){
            var temp={};
            temp=JSON.parse(JSON.stringify(state.init.patientstemplate));
            temp.id=pid;
            temp.name=pname;
            temp.age=page;
            temp.gender=pgender;
            temp.groupid=gid;
            temp.type=type;
            state.patientlist.push(temp);
          }
        })
      });
    },
    saveConfig(state, obj){
      var index = state.currentPatientIndex;
      console.log("SAVE=>"+obj.id+"   "+index);
      state.patientlist[index].layout=JSON.parse(JSON.stringify(obj.layout));
      //Need to remove when the PRO registration is done , for front debug purpose
      var objWlist = obj.layout.map(function(ee) {return ee.c});
      state.patientlist[index].wlist.forEach(function(e){
        var i=objWlist.indexOf(e.id);

        if(i!=-1){
            e.count=0;
        }else {
          e.count=-1;
        }

      })
    },
    updateAlert(state,obj){
      var pindex  = state.patientlist.findIndex(function(el) {
              return el.id==obj.pid && el.groupid==obj.group});
      console.log("UPDATE ALERT"+pindex);

      var windex = state.patientlist[pindex].wlist.map(function(e) {return e.id}).indexOf(obj.wid);
      var value = state.patientlist[pindex].wlist[windex].count;
      if(obj.message==""){  //clear message
          if(value>0) {
            state.patientlist[pindex].wlist[windex].count--;
          }
      }else {  //add message
        state.patientlist[pindex].wlist[windex].count++;
      }
    },
    selstation(state,obj){
      if(obj.value!=-1){
        state.currentStation.id=state.init.cancertypes[obj.value].id;
        state.currentStation.label=state.init.cancertypes[obj.value].label;
      }
      else {
        state.currentStation.id=-1;
        state.currentStation.label="";
      }
      state.currentGroup.id=0;
    },
    setgroupid(state,obj){
      state.currentGroup.id=obj.value;
    },
    saveWidgetSettings(state, obj){
      var index = state.currentPatientIndex;
      var windex = state.patientlist[index].widgetSettings.map(function(e){return e.id}).indexOf(obj.wid);
      console.log("save widget for=>"+"Pt "+index+"wd "+windex)
      if(windex >= 0) {
        state.patientlist[index].widgetSettings[windex].datasettings=JSON.parse(JSON.stringify(obj.datasettings));
      } else {
        state.patientlist[index].widgetSettings.push({id: obj.wid, datasettings:JSON.parse(JSON.stringify(obj.datasettings))});
      }
    },
    setCurrentPatientIndex(state, obj){
      state.currentPatientIndex =  state.patientlist.findIndex(function(el) {
              return el.id==obj.pid && el.groupid==obj.group});
    }
  },
  getters: {
    getLoggerURL: state=> {
      return state.loggerURL
    },
    testResetState: state =>{
      return state.patientlist[7].wlist[1].count
    },
    isDebugging: state => {
      return state.debugEnabled;
    },
    getlayoutbyid:state=>{
        return state.patientlist[state.currentPatientIndex].layout;

    },
    getDefaultLayout:state=>{
        return state.init.defaultLayout;
    },
    getDataSettings:state=>{
      return function(obj){
        var index = state.patientlist.findIndex(function(el) {
          return el.id==obj.id && el.groupid==obj.group});
          var windex = state.patientlist[index].widgetSettings.map(function(e){return e.id}).indexOf(obj.wid);
        return state.patientlist[index].widgetSettings[windex];
      }
    },
    getwidgetMaster: state => {
      var l=[];
      if(state.init.defaultWidgetSetting){
        l=state.init.defaultWidgetSetting.map(function(e){
           return {'id':e.id,'label':e.label, 'type':e.type}
        })
      }
       return l
    },
    getpatientbyid:state => {
      var self=this;
      return function(obj){
        var index = state.patientlist.findIndex(function(el) {
          return el.id==obj.id && el.groupid==obj.group});
        return state.patientlist[index];
      }
    },
    getCurrentStation: state =>{
        return state.currentStation;
    },
    getcurrentGroup:state=>{
      return state.currentGroup;
    },
    getPatientList: state=>{
      var l=[];
      l=JSON.parse(JSON.stringify( state.patientlist));
      if(state.currentStation.id!=-1){
        l=l.filter(function(e) {
          return (e.type==state.currentStation.id)
        })
      }
      var ll=[];
      return l ;
    },
  },
  actions: {
    initStore({commit}){
      commit('init')
    },
  }
  // plugins: debug ? [createLogger()] : []
})
