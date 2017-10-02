import Vue from 'vue'
import Vuex from 'vuex'
import VuexPersistence from 'vuex-persist'
import { initialState } from './modules/state.js'

Vue.use(Vuex)

const debug = process.env.NODE_ENV !== 'production'
const vuexLocal = new VuexPersistence ({
    storage: window.localStorage
})
export default new Vuex.Store({
  strict: debug,
  plugins: [vuexLocal.plugin],
  state:{
    debugEnabled:true,
    currentUser: {username:"chad",first_name:"",last_name:""},
    widgetMasterList: [ { "id":"PRO-01","label":"Pain","type":"PRO"},
                        { "id":"PRO-02","label":"Anxiety","type":"PRO"},
                        { "id":"PRO-03","label":"Depression","type":"PRO"},
                        { "id":"PRO-04","label":"Nausea","type":"PRO"},
                        { "id":"SM-01","label":"Smoking CESSATION","type":"SM"},
                        { "id":"SM-02","label":"NUTRITION","type":"SM"}],
    patientlist:      [ { ID:"PA-67034-001", Name:"Larry Lambert", Age:"54", Gender:"male", type:0,group:[0,1,2,3,4],
                            wlist:[{id:'PRO-01',"label":"Pain",count:-1},{id:'PRO-02',"label":"Anxiety",count:-1},{id:'PRO-03',"label":"Depression",count:-1},{id:'PRO-04',"label":"Nausea",count:-1},{id:'SM-01',"label":"Smoking CESSATION",count:-1},{id:'SM-02',"label":"NUTRITION",count:-1}]},
                                            { ID:"PA-67034-002", Name:"Alvin Adams",Age:"27", Gender:"male", type:0,group:[0,1,2,3,4],
                                                wlist:[{id:'PRO-01',"label":"Pain",count:-1},{id:'PRO-02',"label":"Anxiety",count:-1},{id:'PRO-03',"label":"Depression",count:-1},{id:'PRO-04',"label":"Nausea",count:-1},{id:'SM-01',"label":"Smoking CESSATION",count:-1},{id:'SM-02',"label":"NUTRITION",count:-1}]},
                                            { ID:"PA-67034-003", Name:"Larry Lambert Jr.", Age:"17", Gender:"male",type:0,group:[0,1,3,4,5],
                                                wlist:[{id:'PRO-01',"label":"Pain",count:-1},{id:'PRO-02',"label":"Anxiety",count:-1},{id:'PRO-03',"label":"Depression",count:-1},{id:'PRO-04',"label":"Nausea",count:-1},{id:'SM-01',"label":"Smoking CESSATION",count:-1},{id:'SM-02',"label":"NUTRITION",count:-1}]},
                                            { ID:"PA-67034-004", Name:"Marry McMahon", Age:"74", Gender:"female",type:0,group:[1,2,3,4,5],
                                                wlist:[{id:'PRO-01',"label":"Pain",count:-1},{id:'PRO-02',"label":"Anxiety",count:-1},{id:'PRO-03',"label":"Depression",count:-1},{id:'PRO-04',"label":"Nausea",count:-1},{id:'SM-01',"label":"Smoking CESSATION",count:-1},{id:'SM-02',"label":"NUTRITION",count:-1}]},
                                          ],
    defaultLayout:    [ { "x":0,"y":0,"w":4,"h":6,"i":"0","c":"PRO-01"},
                        { "x":0,"y":6,"w":4,"h":6,"i":"1","c":"SM-01"},
                        { "x":4,"y":0,"w":4,"h":6,"i":"2","c":"PRO-04"},
                        { "x":0,"y":12,"w":4,"h":6,"i":"3","c":"SM-02"},
                        { "x":8,"y":0,"w":4,"h":6,"i":"4","c":"PRO-02"},
                        { "x":4,"y":6,"w":8,"h":12,"i":"5","c":"PRO-03"}],

    ptregistrymodel: {patientid:'',providerid:'',regdate:''},

    // Patient Dashboard Layout Configuration
    paconfigs:[ { patientid:"PA-67034-001",
                  layout:[]},
                { patientid:"PA-67034-002",
                  layout:[]},
                { patientid:"PA-67034-003",
                  layout:[]},
                { patientid:"PA-67034-004",
                    layout:[]},
                ],

    // PRO Configuration
    proregistry : [ {id:'PRO-01', ptlist: [{ptid:'', }]}

    ],
    prostatus : [

    ],
    widgetSettings: [

    ],
    currentStation:{id:0,"label":"Colon Cancer"},
    currentGroupid:{id:0,"color":"#0075bc"},
    cancertypes:[{id:0,"label":"Colon Cancer"},{id:1,"label":"Liver Cancer"},{id:2,"label":"Prostate Cancer"},{id:3,"label":"Lung Cancer"}],

          },
  mutations: {
    saveConfig(state, obj){
      var index = state.paconfigs.map(function(e) {return e.patientid}).indexOf(obj.id);
      state.paconfigs[index].layout=JSON.parse(JSON.stringify(obj.layout));
      //Need to remove when the PRO registration is done , for front debug purpose
      state.patientlist[index].wlist.forEach(function(e){
        var i=obj.layout.map(function(e) {return e.c}).indexOf(e.id);
        console.log(i)
        if(i>=0){
          if(e.count==-1){
            e.count=0;
          }
        }else {
          e.count=-1;
        }
      })
    },
    resetState(state) {
      Object.assign(state, initialState);
    },
    updateAlert(state,obj){
      var pindex = state.patientlist.map(function(e) {return e.ID}).indexOf(obj.pid);
      console.log(obj.pid+" "+pindex);
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
      state.currentStation.id=state.cancertypes[obj.value].id;
      state.currentStation.label=state.cancertypes[obj.value].label;
    }
    else {
      state.currentStation.id=-1;
      state.currentStation.label="";
    }
    },

    setgroupid(state,obj){
          state.currentGroupid.id=obj.value;

        },
    saveWidgetSettings(state, obj){
      var index = state.widgetSettings.map(function(e) {return e.id}).indexOf(obj.id);
      if(index >= 0) {
        state.widgetSettings[index].datasettings=JSON.parse(JSON.stringify(obj.datasettings));
      } else {
        state.widgetSettings.push({id: obj.id, datasettings:JSON.parse(JSON.stringify(obj.datasettings))});
      }

    }
  },
  getters: {
    getlayoutbyid:state=>{
      var self=this;
      return function(id){
        var index = state.paconfigs.map(function(e) {return e.patientid}).indexOf(id);
        return state.paconfigs[index].layout;
      }
    },
    getDefaultLayout:state=>{
        return state.defaultLayout;
    },
    getDataSettings:state=>{
      return function(id) {
        var index = state.widgetSettings.map(function (e) {return e.id}).indexOf(id);
        return state.widgetSettings[index];
      }
    },
    getwidgetMaster: state => {
       return state.widgetMasterList;
    },
    getpatientbyid:state => {
      var self=this;
      return function(id){
        var index = state.patientlist.map(function(e) {return e.ID}).indexOf(id);
        return state.patientlist[index];
      }
    },
    getpatientsbywidgetid:state=>{
      var self =this;
      return function(id){

        var index = state.paconfigs.map(function(e) {return e.ID}).indexOf(id);
      }
    },
    getfirstname: state => {
      return (state.currentUser.first_name || '')
    },
    getuser: state => {
       return state.currentUser
    },
    getCurrentStation: state =>{
        return state.currentStation;
    },
    getCurrentGroupid:state=>{
      return state.currentGroupid;
    },
    getPatientList: state=>{
      var l=[];
      Object.assign(l, state.patientlist);

      if(state.currentStation.id!=-1){
        l=l.filter(function(e) {
          return (e.type==state.currentStation.id)
        })
      }
      return l ;
    },
  }
  // plugins: debug ? [createLogger()] : []
})
