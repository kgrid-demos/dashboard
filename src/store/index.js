import Vue from 'vue'
import Vuex from 'vuex'
import VuexPersistence from 'vuex-persist'

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
    patientlist:      [ { ID:"PA-67034-001", Name:"Larry Lambert", Age:"54", Gender:"male",
                            wlist:[{id:'PRO-01',count:0},{id:'PRO-02',count:0},{id:'PRO-03',count:0},{id:'PRO-04',count:0},{id:'SM-01',count:0},{id:'SM-02',count:0}]},
                        { ID:"PA-67034-002", Name:"Alvin Adams",Age:"27", Gender:"male",
                            wlist:[{id:'PRO-01',count:0},{id:'PRO-02',count:0},{id:'PRO-03',count:0},{id:'PRO-04',count:0},{id:'SM-01',count:0},{id:'SM-02',count:0}]},
                        { ID:"PA-67034-003", Name:"Larry Lambert Jr.", Age:"17", Gender:"male",
                            wlist:[{id:'PRO-01',count:-1},{id:'PRO-02',count:0},{id:'PRO-03',count:-1},{id:'PRO-04',count:-1},{id:'SM-01',count:-1},{id:'SM-02',count:-1}]},
                        { ID:"PA-67034-004", Name:"Marry McMahon", Age:"74", Gender:"female",
                            wlist:[{id:'PRO-01',count:-1},{id:'PRO-02',count:-1},{id:'PRO-03',count:-1},{id:'PRO-04',count:-1},{id:'SM-01',count:-1},{id:'SM-02',count:-1}]},
                      ],
    defaultLayout:    [ { "x":0,"y":0,"w":4,"h":6,"i":"0","c":"PRO-01"},
                        { "x":0,"y":6,"w":4,"h":6,"i":"1","c":"SM-01"},
                        { "x":4,"y":0,"w":4,"h":6,"i":"2","c":"PRO-04"},
                        { "x":0,"y":12,"w":4,"h":6,"i":"3","c":"SM-02"},
                        { "x":8,"y":0,"w":4,"h":6,"i":"4","c":"PRO-02"},
                        { "x":4,"y":6,"w":8,"h":12,"i":"5","c":"PRO-03"},
                        { "x":0,"y":23,"w":4,"h":6,"i":"6","c":""}],

    ptregistrymodel: {patientid:'',providerid:'',regdate:''},

    // Patient Dashboard Layout Configuration
    paconfigs:[ { patientid:"PA-67034-01",
                  layout:[{"x":0,"y":0,"w":4,"h":6,"i":"0","c":""}]},
                { patientid:"PA-67034-02",
                  layout:[{"x":0,"y":0,"w":4,"h":6,"i":"0","c":""}]},
                { patientid:"PA-67034-03",
                  layout:[{"x":0,"y":0,"w":4,"h":6,"i":"0","c":""}]},
                { patientid:"PA-67034-04",
                    layout:[{"x":0,"y":0,"w":4,"h":6,"i":"0","c":""}]},
                ],

    // PRO Configuration
    proregistry : [ {id:'PRO-01', ptlist: [{ptid:'', }]}

    ],
    prostatus : [

    ],
    widgetSettings: [

    ]
          },
  mutations: {
    saveConfig(state, obj){
      var index = state.paconfigs.map(function(e) {return e.patientid}).indexOf(obj.id);
      state.paconfigs[index].layout=JSON.parse(JSON.stringify(obj.layout));
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
    getPatientList: state=>{
        return (state.patientlist) ;
    },
  }
  // plugins: debug ? [createLogger()] : []
})
