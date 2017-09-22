import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const debug = process.env.NODE_ENV !== 'production'

export default new Vuex.Store({
  strict: debug,
  state:{
    debugEnabled:true,
    currentUser:{username:"chad",first_name:"",last_name:""},
    patientlist:[{ ID:"PA-67034-01", Name:"Larry Lambert", Age:"54", Gender:"male"},
                  { ID:"PA-67034-02", Name:"Alvin Adams",Age:"27", Gender:"male"},
                { ID:"PA-67034-03", Name:"Larry Lambert Jr.", Age:"17", Gender:"male"},
              { ID:"PA-67034-04", Name:"Marry McMahon", Age:"74", Gender:"female"}],
    widgetMasterList:[{"id":"PRO-01","label":"Pain","type":"PRO"},
                  {"id":"PRO-02","label":"Anxiety","type":"PRO"},
                  {"id":"PRO-03","label":"Depression","type":"PRO"},
                  {"id":"PRO-04","label":"Nausea","type":"PRO"},
                  {"id":"SM-01","label":"Smoking CESSATION","type":"SM"},
                  {"id":"SM-02","label":"NUTRITION","type":"SM"}],
    paconfigs:[ { patientid:"PA-67034-01",
                  layout:[{"x":0,"y":0,"w":3,"h":4,"i":"0","c":""}]},
                { patientid:"PA-67034-02",
                  layout:[{"x":0,"y":0,"w":3,"h":4,"i":"0","c":""}]},
                { patientid:"PA-67034-03",
                  layout:[{"x":0,"y":0,"w":3,"h":4,"i":"0","c":""}]},
                { patientid:"PA-67034-04",
                    layout:[{"x":0,"y":0,"w":3,"h":4,"i":"0","c":""}]},
                ]

          },
  mutations: {
    setFilteredCount(state,count){
        state.displayDataCount=count;
    },
    saveConfig(state, obj){
      var index = state.paconfigs.map(function(e) {return e.patientid}).indexOf(obj.id);
      console.log(obj.layout);
      state.paconfigs[index].layout=JSON.parse(JSON.stringify(obj.layout));
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
