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
    paconfigs:[{patientid:"id",widgets:[]}],
    selectedPatient:{ ID:"", Name:"", Age:"", Gender:""}

          },
  mutations: {
    setSelectedPatient(state,patient){
        state.selectedPatient=patient;
    },
    setFilteredCount(state,count){
        state.displayDataCount=count;
    }
  },
  getters: {

    getfirstname: state => {
      return (state.currentUser.first_name || '')
    },
    getuser: state => {
       return state.currentUser
    },
    getPatientList: state=>{
        return (state.patientlist) ;
    },
    getSelectedPatient: state=>{
        return (state.selectedPatient) ;
    }
  }
  // plugins: debug ? [createLogger()] : []
})
