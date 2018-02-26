import widgets from './widgets.js'

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
	{"pid":"training",
		"TRO-03-warn":[
			{"alertid":"TRO03W001","text":"Area Flood is possible overnight.","checked":false}
		],
		"TRO-04-warn":[
			{"alertid":"TRO04W001","text":"Dense fog with limited visibility","checked":false}
		]
	}
]

var notelist =[
	{"PRO-05-notes":[
        {  "v": 0,
  "note": "I am having difficulty buttoning my blouse due to constant tingling pain to my fingertips.",
  "date": -30}
       ],
       "pid": "PA-67034-001"
     },
	{ "PRO-06-notes":[
 {"v": 0,"note": "My itchiness on palms/soles are worsening. There are red peeling rash despite use of Eucerin","date": -20
 }],"PRO-08-notes":[
 {"v": 0,"note": "There are pain due to mouth sores/ulcerations descpite using Magic Mouthwash; however the sores and pain get better before the start of each new cycle.","date": -31
 }],
      "pid": "PA-67034-007"
    },
		{"TRO-01-notes":[
	        {  "v": 0,
	  "note": "Temperature is way above the avarage for this day.",
	  "date": -10}
	       ],
	       "pid": "training"
	     },
]

var smlist =[{   "SM-01-data": [],
      "SM-02-data": [],
      "SM-03-data": [],
      "SM-04-data": [
{"v": 1,"d": -63},
{"v": 2,"d": -48},
{"v": 3,"d": -38},
{"v": 4,"d": -28}
      ],
      "SM-05-data": [
{"v": 1,"d": 10}
      ],
      "SM-06-data": [
{"v": 1,"d": 10},
{"v": 2,"d": 10},
{"v": 3,"d": 10},
{"v": 4,"d": 10},
{"v": 5,"d": 10},
{"v": 6,"d": 10}
      ],
      "SM-07-data": [],
      "SM-08-data": [
{"v": 1,"d": -58},
{"v": 2,"d": -48},
{"v": 3,"d": -26},
{"v": 4,"d": -18}
      ],
       "PRO-05-notes":[
       {
 "v": 0,
 "note": "I am having difficulty buttoning my blouse due to constant tingling pain to my fingertips.",
 "date": -30}
      ],
      "pid": "PA-67034-001"
    },
	{ "SM-01-data": [
	  {    "v": 1,"d": 10  },
	  {    "v": 2,"d": 10  },
	  {    "v": 3,"d": 10  }
	],"SM-02-data": [
	  {    "v": 1,"d": 10  },
	  {    "v": 2,"d": 10  },
	  {    "v": 3,"d": 10  },
	  {    "v": 4,"d": 10  }
	],"SM-03-data": [
	  {    "v": 1,"d": -48  },
	  {    "v": 2,"d": -40  },
	  {    "v": 3,"d": 10  },
	  {    "v": 4,"d": 10  }
	],"SM-04-data": [],"SM-05-data": [
	  {    "v": 1,"d": -44  }
	],"SM-01-data": [
	  {    "v": 1,"d": 10  }
	],"SM-08-data": [
	  {    "v": 1,"d": 10  },
	  {    "v": 2,"d": 10  },
	  {    "v": 3,"d": 10  },
	  {    "v": 4,"d": 10  }
	],
	      "pid": "PA-67034-007"
	    },
			{ "TRS-01-data": [
			  {    "v": 1,"d": -10  }
			],
			      "pid": "training"
			    }



]

// initial state
const state = {
  patientid:''
}

// getters
const getters = {
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
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
