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

var alertlist=[
	{"pid":"PA-67034-001",
		"PRO-10-warn":[
			{"alertid":"PRO10W001","text":"Discuss drinking of fluids with patient","checked":false}
		],
		"PRO-13-warn":[
			{"alertid":"PRO13W001","text":"Discuss eating habits with patient","checked":false}
		]
	},
	{"pid":"PA-67034-007",
		"PRO-02-warn":[
			{"alertid":"PRO02W001","text":"Discuss patient's worries and concerns and consider treatment for anxiety if needed.","checked":false}
		],
		"PRO-09-warn":[
			{"alertid":"PRO09W001","text":"Patient's weight has been declining since starting chemotherapy. Discuss with patient","checked":false}
		]
	},

]

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
  },
	getpatientalert:state=>{
    return function(id) {
      var index = alertlist.map(function(e){return e.pid}).indexOf(state.patientid)
			var alist={}
			var wid = id+'-warn'
      if(index!=-1){
	      alist=JSON.parse(JSON.stringify(alertlist[index]))
			}
      if(alist[wid]){
				return alist[wid]
			}else{
				return []
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
