import Vue from 'vue'
import Vuex from 'vuex'
import widgets from './modules/widgets'
import patients from './modules/patients'
import layouts from './modules/layouts'
import VuexPersistence from 'vuex-persist'

Vue.use(Vuex)

const debug = process.env.NODE_ENV !== 'production'
const vuexLocal = new VuexPersistence ({
    key:"first",
    storage: window.localStorage,
    // reducer: state => ({patientlist: state.patientlist, currentCancerType: state.currentCancerType, currentGroup:state.currentGroup}),
})

const store = new Vuex.Store({
  strict: process.env.NODE_ENV !== 'production',
  plugins: [vuexLocal.plugin],
  modules: {
    widgets,
    patients,
    layouts
  },
  state:{

      init:{},
      debugEnabled:true,
      filterEnabled:true,
      testStation:'A',
      loggerURL:'http://localhost:3003/dashboardlog',
      currentCancerType:{id:0,"label":"Breast Caner"},
      currentGroup:{id:0,"color":"#0075bc"},
      currentPatientIndex: -1,
      currentdaterange:{starttime:0,endtime:0,days:7},
      patientlist:  [],
      maxgroupinuse:6,
      patientData:[],
      today:0,
      screenname:'Patient List',
      trainingmode:true
    },
  mutations: {
    settoday(state,timestamp){
      state.today=timestamp
    },
    init(state, obj){
      state.init=obj;
      state.filterEnabled=state.init.filterenable;
      if(state.filterEnabled){
        state.currentCancerType.id=0;
        state.currentCancerType.label="Breast Cancer"
      }
      state.loggerURL=state.init.loggerURL;
      state.maxgroupinuse=state.init.maxgroupinuse;
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
    },
    selcancertype(state,obj){
      if(obj.value!=-1){
        state.currentCancerType.id=state.init.cancertypes[obj.value].id;
        state.currentCancerType.label=state.init.cancertypes[obj.value].label;
      }
      else {
        state.currentCancerType.id=-1;
        state.currentCancerType.label="";
      }
      state.currentGroup.id=0;
    },
    setgroupid(state,obj){
      state.currentGroup.id=obj.value;
    },
    setCurrentPatientIndex(state, obj){
      if(false){
        console.log("Set Current Patient Index =>")
        console.log(obj)
      }
      state.currentPatientIndex =  state.patientlist.findIndex(function(el) {
              return el.id==obj.pid && el.groupid==obj.group});
    },
    loadPatientData(state, obj) {
      state.patientData = obj;
    },
    resetPatientData(state) {
      state.patientData = [];
    },
    setcurrentdaterange(state,obj){
      state.currentdaterange.starttime=obj.start
      state.currentdaterange.endtime=obj.end
      state.currentdaterange.days=obj.days
    },
    setScreenname(state,s){
      state.screenname=s
    },
    settrainingmode(state,b){
      state.trainingmode=b

    },
    resettraininglayout(state){
      var index = state.patientlist.findIndex(function(e){
        return e.id=='training' && e.groupid==state.currentGroup.id
      })
      var n = state.patientlist[index].layout.length
      state.patientlist[index].layout.splice(0,n )
    },
    setteststationid(state,id){
      state.testStation=id
    }
  },
  getters: {
    getStationID:state=>{
      return state.testStation
    },
    getScreenname:state=>{
      return state.screenname
    },
    gettrainmode:state=>{
      return state.trainingmode;
    },
    gettoday:state=>{
      return state.today
    },
    getfilterEnable: state=>{
      return state.filterEnabled
    },
    getmaxgroupinuse: state=>{
      return state.maxgroupinuse
    },
    getLoggerURL: state=> {
      return state.loggerURL
    },
    isDebugging: state => {
      return state.debugEnabled;
    },
    getlayoutbyid:state=>{
      if(state.currentPatientIndex!=-1){
        return state.patientlist[state.currentPatientIndex].layout;
      }else {
        return []
      }
    },
    getpatientbyid:state => {
      var self=this;
      return function(obj){
        var index = state.patientlist.findIndex(function(el) {
          return el.id==obj.id && el.groupid==obj.group});
        return state.patientlist[index];
      }
    },
    getCurrentCancerType: state =>{
        return state.currentCancerType;
    },
    getcurrentGroup:state=>{
      return state.currentGroup;
    },
    getPatientList: state=>{
      var l=[];
      l=JSON.parse(JSON.stringify( state.patientlist));
      if(state.currentCancerType.id!=-1){
        l=l.filter(function(e) {
          return (e.type==state.currentCancerType.id)
        })
      }
      return l ;
    },
    getPatientMasterList: state=>{
      return state.init.patientMasterList;
    },
    getPatientData: state=>{
      return function(patientId) {
        let index = state.patientData.findIndex(function(patient) {
          return patient.id===patientId
        });
        return state.patientData[index];
      }
    },
    getPatientDataTimestamp: state=>{
      return function(patientId) {
        let index = state.patientData.findIndex(function(patient) {
          return patient.id===patientId
        });
        return state.patientData[index].timestamp;
      }
    },
    hasLoadedPatientData: state=>{
      return  (state.patientData.length > 0);
    },
    getcurrentdaterange: state =>{
      return state.currentdaterange
    }
  },
  actions: {
    initStore({commit}){
      commit('init')
    },
  }
  // plugins: debug ? [createLogger()] : []
})

export default store

const initialStateCopy = JSON.parse(JSON.stringify(store.state))

export function resetState () {
  store.replaceState(JSON.parse(JSON.stringify(initialStateCopy)))
}
// export default store
