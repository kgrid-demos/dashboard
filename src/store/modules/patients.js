import widgets from './widgets.js'

const _patients= [	{ "id":"training", "name":"Training", "age":"", "gender":"", "type":99,"group":[{"id":0},{"id":1},{"id":2}]},
			{ "id":"PA-67034-001", "name":"Ms. Green", "age":"38", "gender":"female", "type":0,"group":[{"id":0},{"id":1},{"id":2},{"id":3},{"id":4},{"id":5}]},
			{ "id":"PA-67034-007", "name":"Mr. Brown", "age":"62", "gender":"male", "type":1,"group":[{"id":0},{"id":1},{"id":2},{"id":3},{"id":4},{"id":5}]}
]
const patienttemplate = { "id":"PA-67034-001","name":"Ms. Green", "age":"38", "gender":"female", "type":0, "groupid": -1, "layout":[]}

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

var notelist =[
	{"PRO-05-notes":[
        {
  "value": 0,
  "note": "I am having difficulty buttoning my blouse due to constant tingling pain to my fingertips.",
  "date": -30}
       ],
       "pid": "PA-67034-001"
     },


	{ "PRO-06-notes":[
 {"value": 0,"note": "My itchiness on palms/soles are worsening. There are red peeling rash despite use of Eucerin","date": -20
 }
],"PRO-08-notes":[
 {"value": 0,"note": "There are pain due to mouth sores/ulcerations descpite using Magic Mouthwash; however the sores and pain get better before the start of each new cycle.","date": -31
 }
],
      "pid": "PA-67034-007"
    }

]

var smlist =[{   "SM-01-data": [],
      "SM-02-data": [],
      "SM-03-data": [],
      "SM-04-data": [
{"value": 1,"dateOffset": -63},
{"value": 2,"dateOffset": -48},
{"value": 3,"dateOffset": -38},
{"value": 4,"dateOffset": -28}
      ],
      "SM-05-data": [
{"value": 1,"dateOffset": 10}
      ],
      "SM-06-data": [
{"value": 1,"dateOffset": 10},
{"value": 2,"dateOffset": 10},
{"value": 3,"dateOffset": 10},
{"value": 4,"dateOffset": 10},
{"value": 5,"dateOffset": 10},
{"value": 6,"dateOffset": 10}
      ],
      "SM-07-data": [],
      "SM-08-data": [
{"value": 1,"dateOffset": -58},
{"value": 2,"dateOffset": -48},
{"value": 3,"dateOffset": -26},
{"value": 4,"dateOffset": -18}
      ],
       "PRO-05-notes":[
       {
 "value": 0,
 "note": "I am having difficulty buttoning my blouse due to constant tingling pain to my fingertips.",
 "date": -30}
      ],
      "pid": "PA-67034-001"
    },
	{ "SM-01-data": [
	  {    "value": 1,"dateOffset": 10  },
	  {    "value": 2,"dateOffset": 10  },
	  {    "value": 3,"dateOffset": 10  }
	],"SM-02-data": [
	  {    "value": 1,"dateOffset": 10  },
	  {    "value": 2,"dateOffset": 10  },
	  {    "value": 3,"dateOffset": 10  },
	  {    "value": 4,"dateOffset": 10  }
	],"SM-03-data": [
	  {    "value": 1,"dateOffset": -48  },
	  {    "value": 2,"dateOffset": -40  },
	  {    "value": 3,"dateOffset": 10  },
	  {    "value": 4,"dateOffset": 10  }
	],"SM-04-data": [],"SM-05-data": [
	  {    "value": 1,"dateOffset": -44  }
	],"SM-07-data": [
	  {    "value": 1,"dateOffset": 10  }
	],"SM-08-data": [
	  {    "value": 1,"dateOffset": 10  },
	  {    "value": 2,"dateOffset": 10  },
	  {    "value": 3,"dateOffset": 10  },
	  {    "value": 4,"dateOffset": 10  }
	],
	      "pid": "PA-67034-007"
	    }

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
        return _patients[index]
			}else {
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
  },
	getpatientnotes:state=>{
    return function(id) {
      var index = notelist.map(function(e){return e.pid}).indexOf(state.patientid)
			var alist={}
			var wid = id+'-notes'
      if(index!=-1){
	      alist=JSON.parse(JSON.stringify(notelist[index]))
				}
      if(alist[wid]){
				return alist[wid]
			}else{
				return []
			}
    }
  },
	getpatientsmdata:state=>{
    return function(id) {
      var index = smlist.map(function(e){return e.pid}).indexOf(state.patientid)
			var alist={}
			var wid = id+'-data'
      if(index!=-1){
	      alist=JSON.parse(JSON.stringify(smlist[index]))
				console.log("get sm data " +wid)
				console.log(alist)
			}
      if(alist[wid]){
				console.log(alist[wid])
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
