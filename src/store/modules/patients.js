import widgets from './widgets.js'

const _patients= [	{ "id":"PA-67034-004", "name":"Larry Lambert", "age":"38", "gender":"male", "type":2,"group":[{"id":6},{"id":7},{"id":8}],"diagnosis":'A high-grade invasive ductal breast carcinoma with ER negative, PR negative, HER2 negative.',"treatment":'Chemotherapy after mastectomy: Dose-dense doxorubicin and cyclophosphamide (ddAC) every 14 days for 4 cycles, followed by weekly paclitaxel ("T") for 12 weeks.'},
			{ "id":"PA-67034-001", "name":"Ms. Green", "age":"38", "gender":"female", "type":0,"group":[{"id":0},{"id":1},{"id":2},{"id":3},{"id":4},{"id":5}]},
			{ "id":"PA-67034-007", "name":"Mr. Brown", "age":"62", "gender":"male", "type":1,"group":[{"id":0},{"id":1},{"id":2},{"id":3},{"id":4},{"id":5}]}
]
const patienttemplate = { "id":"PA-67034-001","name":"Ms. Green", "age":"38", "gender":"female", "type":0, "groupid": -1,
    "wlist":[{"id":"","label":"","count":-1,"alertText":""}],
    "layout":[],
    "widgetSettings": []
}

var ptdatalist=[]

// initial state
const state = {
  groupid:0,
  patientid:'',
  ptconfiglist:[]
}

// getters
const getters = {
  getpatientlist: state=>{
    return _patients
  },
  getpatientsummary:state=>{
    return function() {
      var index = _patients.map(function(e){return e.id}).indexOf(state.patientid)
      if(index!=-1){
        return _patients[index] }
      else {
        return {}
      }
    }
  }
}

// actions
const actions = {
}

// mutations
const mutations = {
  setcurrentpatientid(state,pt){
    state.patientid = pt.id
  },
  setcurrentgroupid(state,idobj){
    state.groupid = idobj.value
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
