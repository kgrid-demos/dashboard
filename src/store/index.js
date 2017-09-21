import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const debug = process.env.NODE_ENV !== 'production'

export default new Vuex.Store({
  strict: debug,
  state:{
    debugEnabled:true,
    currentUser:{username:"",first_name:"",last_name:""},
    patients:[{ id:"PA-67034-01",
                name:{given:"Larry", family:"Lambert"},
                gender:"male",
                birthDate:"1935-12-16",
                telecom: { "system": "phone", "value": "227.044.2468", "use": "home" },
                email:{value:"larryl@pa.kgrid.org", "use":"personal"}
              },
              { id:"PA-67034-02",
                          name:{given:"Alvin", family:"Adams"},
                          gender:"male",
                          birthDate:"1998-02-11",
                          telecom: { "system": "phone", "value": "734.201.0091", "use": "home" },
                          email:{value:"alvina@pa.kgrid.org", "use":"personal"}
                        }],
    patientlist:[{ ID:"PA-67034-01", Name:"Larry Lambert", Age:"54", Gender:"male"},
                  { ID:"PA-67034-02", Name:"Alvin Adams",Age:"27", Gender:"male"},
                { ID:"PA-67034-03", Name:"Larry Lambert Jr.", Age:"17", Gender:"male"},
              { ID:"PA-67034-04", Name:"Marry McMahon", Age:"74", Gender:"female"}],
    paconfigs:[ { patientid:"PA-67034-01",
                  widgetlist:[  {"label":"Pain","type":"PRO","inuse":false},
                                {"label":"Anxiety","type":"PRO","inuse":false},
                                {"label":"Depression","type":"PRO","inuse":false},
                                {"label":"Nausea","type":"PRO","inuse":false},
                                {"label":"Smoking CESSATION","type":"SM","inuse":false},
                                {"label":"NUTRITION","type":"SM","inuse":false}], layout:[{"x":0,"y":0,"w":3,"h":4,"i":"0","c":""}]},
                { patientid:"PA-67034-02",
                  widgetlist:[{"label":"Pain","type":"PRO","inuse":false},
                                {"label":"Anxiety","type":"PRO","inuse":false},
                                {"label":"Depression","type":"PRO","inuse":false},
                                {"label":"Nausea","type":"PRO","inuse":false},
                                {"label":"Smoking CESSATION","type":"SM","inuse":false},
                                {"label":"NUTRITION","type":"SM","inuse":false}], layout:[{"x":0,"y":0,"w":3,"h":4,"i":"0","c":""}]},
                { patientid:"PA-67034-03",
                  widgetlist:[  {"label":"Pain","type":"PRO","inuse":false},
                                {"label":"Anxiety","type":"PRO","inuse":false},
                                {"label":"Depression","type":"PRO","inuse":false},
                                {"label":"Nausea","type":"PRO","inuse":false},
                                {"label":"Smoking CESSATION","type":"SM","inuse":false},
                                {"label":"NUTRITION","type":"SM","inuse":false}], layout:[{"x":0,"y":0,"w":3,"h":4,"i":"0","c":""}]}]

          },
  mutations: {
    setFilteredCount(state,count){
        state.displayDataCount=count;
    },
    saveConfig(state, obj){
      var index = state.paconfigs.map(function(e) {return e.patientid}).indexOf(obj.id);
      console.log(obj.list);
      state.paconfigs[index].widgetlist=JSON.parse(JSON.stringify(obj.list));
      console.log(obj.layout);
      state.paconfigs[index].layout=JSON.parse(JSON.stringify(obj.layout));
    }
  },
  getters: {
    getwidgetbypid:state=>{
      var self=this;
      return function(id){
        var index = state.paconfigs.map(function(e) {return e.patientid}).indexOf(id);
        return state.paconfigs[index].widgetlist;
      }
    },
    getlayoutbypid:state=>{
      var self=this;
      return function(id){
        var index = state.paconfigs.map(function(e) {return e.patientid}).indexOf(id);
        return state.paconfigs[index].layout;
      }
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
