const _widgets= [
  { "id":"PRO-01","label":"Pain", "type":"PRO",  "constraint":{}, "sel":false, "selindex":-1,
    "cancertype":[  {id:0}, {id:1},{id:2}],
    "instruments":[ { name: "Wong-Baker Faces 10-point Pain Scale", value: 1, "bwpoints":14,
                      "dow":["Su","Mo","Tu","We","Th","Fr","Sa"], "range":{min:0,max:10,inc:2,step:2},
                      "unit":"Wong-Baker Faces Pain Scale (0-10)", "ryg":[{min:0,max:2,color:"green"}, {min:4,max:6, color:"orange"}, {min:8,max:10,color:"red"}]},
                    { name: "Stanford 10-point Pain Scale", value: 2,"bwpoints":14,
                      "dow":["Su","Mo","Tu","We","Th","Fr","Sa"], "range":{min:0,max:10,inc:1,step:2},
                      "unit":"Stanford Pain Scale (0-10)","ryg":[{min:0,max:3,color:"green"}, {min:4,max:6, color:"orange"}, {min:7,max:10,color:"red"}]}
                    ]},
  { "id":"PRO-02","label":"Anxiety", "type":"PRO",    "constraint":{}, "sel":false,"selindex":-1,
    "cancertype":[  {id:0}, {id:1},{id:2}],
    "instruments":[ { name: "GAD-7 Questionnaire", value: 1, "bwpoints":1,
                      "dow":["Su","Mo","Tu","We","Th","Fr","Sa"], "range":{min:0,max:21,inc:1,step:7},
                      "unit":"GAD-7 Scale (0-21)", "ryg":[{min:0,max:6,color:"green"}, {min:7,max:13, color:"orange"}, {min:14,max:21,color:"red"}]}
                     ]},
  { "id":"PRO-03","label":"Depression", "type":"PRO",    "constraint":{}, "sel":false,"selindex":-1,
    "cancertype":[  {id:0}, {id:1},{id:2}],
    "instruments":[ { name: "PHQ-2 Questionnaire", value: 1, "bwpoints":1,
                      "dow":["Su","Mo","Tu","We","Th","Fr","Sa"], "range":{min:0,max:6,inc:1,step:2},
                      "unit":"PHQ-2 Scale (0-6)", "ryg":[{min:0,max:0,color:"green"}, {min:1,max:5, color:"orange"}, {min:6,max:6,color:"red"}]}
                  ]},
  { "id":"PRO-04","label":"Nausea & Vomiting",  "type":"PRO",    "constraint":{}, "sel":false,"selindex":-1,
  "cancertype":[  {id:0}, {id:1},{id:2}],
  "instruments":[{ name: "Episodes of Nausea/Vomiting", value: 1, "bwpoints":2,
                    "dow":["Su","Mo","Tu","We","Th","Fr","Sa"], "range":{min:0,max:10,inc:1,step:2},
                    "unit":"Episode (times)", "ryg":[{min:0,max:1,color:"green"}, {min:2,max:4, color:"orange"}, {min:5,max:10,color:"red"}]}]},
  { "id":"PRO-05","label":"Nerve Pain & Tingling", "type":"PRO",    "constraint":{}, "sel":false,"selindex":-1,
  "cancertype":[  {id:0}, {id:1},{id:2}],
  "instruments":[ { name: "FACT-Taxane Neurotoxicity (Ntx) Subscale", value: 1, "bwpoints":2,
                    "dow":["Su","Mo","Tu","We","Th","Fr","Sa"], "range":{min:0,max:44,inc:1,step:11},
                    "unit":"FACT-Taxane Ntx Subscale (0-44)", "ryg":[{min:0,max:20,color:"green"}, {min:21,max:32, color:"orange"}, {min:33,max:44,color:"red"}]},
                  ]
    },
  { "id":"PRO-06","label":"Palm & Sole Rash", "type":"PRO",    "constraint":{}, "sel":false,"selindex":-1,
  "cancertype":[  {id:0}, {id:1},{id:2}],
  "instruments":[ { name: "5-D Itch Scale", value: 1, "bwpoints":1,
                    "dow":["Su","Mo","Tu","We","Th","Fr","Sa"], "range":{min:4,max:35,inc:1,step:9},
                    "unit":"5-D Itch Scale (4-35)", "ryg":[{min:4,max:10,color:"green"}, {min:11,max:24, color:"orange"}, {min:25,max:35,color:"red"}]}
                 ]},
  { "id":"PRO-07","label":"Fatigue",  "type":"PRO",    "constraint":{}, "sel":false,"selindex":-1,
  "cancertype":[  {id:0}, {id:1},{id:2}],
  "instruments":[ { name: "Schwartz Cancer Fatigue Scale", value: 1, "bwpoints":4,
                    "dow":["Su","Mo","Tu","We","Th","Fr","Sa"], "range":{min:6,max:30,inc:1,step:6},
                    "unit":"Schwartz Cancer Fatigue Scale (6-30)", "ryg":[{min:6,max:9,color:"green"}, {min:10,max:22, color:"orange"}, {min:23,max:30,color:"red"}]}
                  ]
  },
  { "id":"PRO-08","label":"Mouth Sores", "type":"PRO",    "constraint":{}, "sel":false,"selindex":-1,
  "cancertype":[  {id:0}, {id:1},{id:2}],
  "instruments":[ { name: "WHO Stomatitis Toxicity Scale", value: 1, "bwpoints":2,
                    "dow":["Su","Mo","Tu","We","Th","Fr","Sa"], "range":{min:0,max:4,inc:1,step:1},
                    "unit":" WHO Stomatitis Toxicity Scale", "ryg":[{min:0,max:1,color:"green"}, {min:2,max:2, color:"orange"}, {min:3,max:4,color:"red"}]}

                ]},
  { "id":"PRO-09","label":"Body Weight", "type":"PRO",    "constraint":{}, "sel":false,"selindex":-1,
  "cancertype":[  {id:0}, {id:1},{id:2}],
  "instruments":[ { name: "Body weight in pounds", value: 1, "bwpoints":2,
                    "dow":["Su","Mo","Tu","We","Th","Fr","Sa"], "range":{min:50,max:300,inc:0.5,step:50},
                    "unit":"Body Weight (Pounds)", "ryg":[{min:50,max:300,color:"green"}]} ],
    "dataprop":{"a":"b"}, "datasetting":{"a":"b"}},
  { "id":"PRO-10","label":"Drinking Fluids",  "type":"PRO",    "constraint":{}, "sel":false,"selindex":-1,
  "cancertype":[  {id:0}, {id:1},{id:2}],
  "instruments":[ { name: "Number of 8-oz glasses of fluid per day", value: 1, "bwpoints":14,
                    "dow":["Su","Mo","Tu","We","Th","Fr","Sa"], "range":{min:0,max:10,inc:1,step:2},
                    "unit":"Fluid Intake (8-oz Glasses)", "ryg":[{min:7,max:10,color:"green"}, {min:4,max:6, color:"orange"}, {min:0,max:3,color:"red"}]},
                  ]},
  { "id":"PRO-11","label":"Ostomy Output", "type":"PRO",    "constraint":{}, "sel":false,"selindex":-1,
  "cancertype":[ {id:1}],
  "instruments":[ { name: "Number of bags per day", value: 1, "bwpoints":14,
                    "dow":["Su","Mo","Tu","We","Th","Fr","Sa"], "range":{min:0,max:5,inc:0.5,step:1},
                    "unit":"Ostomy Output (Bags)", "ryg":[{min:0,max:5,color:"green"}]} ]},
  { "id":"PRO-12","label":"Temperature & Fever", "type":"PRO",    "constraint":{}, "sel":false,"selindex":-1,
  "cancertype":[  {id:0}, {id:1},{id:2}],
  "instruments":[{ name: "Body temperature in Fahrenheit", value: 1, "bwpoints":14,
                    "dow":["Su","Mo","Tu","We","Th","Fr","Sa"], "range":{min:97,max:106,inc:0.1,step:3},
                    "unit":"Body Temperature (Fahrenheit)", "ryg":[{min:97,max:99.9,color:"green"}, {min:100,max:106,color:"red"}]} ]},
  { "id":"PRO-13","label":"Appetite",  "type":"PRO",    "constraint":{}, "sel":false, "selindex":-1,
  "cancertype":[  {id:0}, {id:1},{id:2}],
  "instruments":[ { name: "Visual Analog Scale (VAS)", value: 1, "bwpoints":14,
                    "dow":["Su","Mo","Tu","We","Th","Fr","Sa"], "range":{min:0,max:100,inc:1,step:20},
                    "unit":"Visual Analog Scale (0-100)", "ryg":[{min:80,max:100,color:"green"},{min:21,max:79,color:"orange"}, {min:0,max:20,color:"red"}]} ]},
  { "id":"PRO-14","label":"Fertility", "type":"PRO",    "constraint":{}, "sel":false,"selindex":-1,
    "cancertype": [ {id:0},{id:2}],
    "instruments":[ { name: "Visual Analog Scale (VAS)", value: 1, "bwpoints":14,
                      "dow":["Su","Mo","Tu","We","Th","Fr","Sa"], "range":{min:0,max:100,inc:1,step:20},
                      "unit":"(0-100)", "ryg":[{min:80,max:100,color:"green"},{min:21,max:79,color:"orange"}, {min:0,max:20,color:"red"}]},
                    { name: "Body temperature in Celsius", value: 2,"bwpoints":14,
                      "dow":["Su","Mo","Tu","We","Th","Fr","Sa"], "range":{min:36,max:42,inc:1},
                      "unit":"(Celsius)","ryg":[{min:36,max:37.3,color:"green"}, {min:37.4,max:42,color:"red"}]}
                    ]
    },
  { "id":"PRO-15","label":"Exercise", "type":"PRO",    "constraint":{}, "sel":false,"selindex":-1,
  "cancertype":[  {id:0}, {id:1},{id:2}],
  "instruments":[ { name: "Exercise time in minutes per day", value: 1, "bwpoints":14,
                    "dow":["Su","Mo","Tu","We","Th","Fr","Sa"], "range":{min:0,max:30,inc:1,step:10},
                    "unit":"Exercise Time (Minutes)", "ryg":[{min:11,max:30,color:"green"},{min:1,max:10,color:"orange"}, {min:0,max:0,color:"red"}]}]},
  { "id":"SM-01","label":"Colon Cancer Nutrition & Fluids", "type":"SM",    "constraint":{}, "sel":false,"selindex":-1,
  "cancertype":[ {id:1}],
  "instruments":[ { name:"Colon Cancer Nutrition & Fluids",description: "Nutrition support and oral hydration", value: 1, "modulecount": 3, "bwpoints": 1}]},
  { "id":"SM-02","label":"Colon Cancer & Self Image",  "type":"SM",    "constraint":{}, "sel":false,"selindex":-1,
  "cancertype":[  {id:1}],
  "instruments":[  { name:"Colon Cancer & Self Image",description: "Self-image self management", value: 1, "modulecount": 4, "bwpoints": 1}]},
  { "id":"SM-03","label":"Ostomy Care", "type":"SM",    "constraint":{}, "sel":false,"selindex":-1,
  "cancertype":[ {id:1}],
  "instruments":[  { name:"Ostomy Care",description: "Ostomy Care", value: 1, "modulecount": 4, "bwpoints": 2}]},
  { "id":"SM-04","label":"Body Image",  "type":"SM",    "constraint":{}, "sel":false,"selindex":-1,
  "cancertype":[  {id:0},{id:2}],
  "instruments":[   { name:"Body Image",description: "Self Image / Body Image", value: 1, "modulecount": 4, "bwpoints": 2}]},
  { "id":"SM-05","label":"Family Talk About Cancer Risk", "type":"SM",    "constraint":{}, "sel":false,"selindex":-1,
  "cancertype":[  {id:0}, {id:1},{id:2}],
  "instruments":[  { name:"Family talk about cancer risk",description: "Familial risk discussions with adult and children", value: 1, "modulecount": 1, "bwpoints": 0}]},
  { "id":"SM-06","label":"Chemo and Fertility",  "type":"SM",    "constraint":{}, "sel":false,"selindex":-1,
  "cancertype":[  {id:0},{id:2}],
  "instruments":[   { name:"Chemo and Fertility",description: "Fertility Impact", value: 1, "modulecount": 6, "bwpoints": 2}]},
  { "id":"SM-07","label":"Advance Directive", "type":"SM",    "constraint":{}, "sel":false,"selindex":-1,
  "cancertype":[  {id:1}],
  "instruments":[  { name:"Advance Directive",description: "End of Life/Advance Directive", value: 1, "modulecount": 1, "bwpoints": 0} ]},
  { "id":"SM-08","label":"Sexual Health",  "type":"SM",    "constraint":{}, "sel":false,"selindex":-1,
  "cancertype":[  {id:0}, {id:1},{id:2}],
  "instruments":[  { name:"Sexual Health",description: "Sexual Health", value: 1, "modulecount": 4, "bwpoints": 1} ]},
  { "id":"TRO-01","label":"Temperature", "type":"TRO",    "constraint":{}, "sel":false, "selindex":-1,
  "cancertype":[  {id:99}], "instruments":[ { name: "Temperature in Fahrenheit", value: 1, "bwpoints":14,
                    "dow":["Su","Mo","Tu","We","Th","Fr","Sa"], "range":{min:-20,max:130,inc:1,step:1},
                    "unit":" Fahrenheit", "ryg":[{min:-20,max:40,color:"blue"}, {min:40,max:80, color:"green"}, {min:80,max:130,color:"red"}]} ]},
  { "id":"TRS-01","label":"Tornado Safety",  "type":"TRS",    "constraint":{}, "sel":false,"selindex":-1,
  "cancertype":[  {id:99}],
  "instruments":[  { name:"Tornado Safety",description: "Tornado Safety training video", value: 1, "modulecount": 1, "bwpoints": 1} ]}
  ]

const _freqOptions = [
  {"label":"At Will", "bwdatapt":0},
  {"label":"Biweekly", "bwdatapt":1},
  {"label":"Weekly", "bwdatapt":2},
  {"label":"Every Monday and Friday", "bwdatapt":4},
  {"label":"Daily", "bwdatapt":14},
  {"label":"Twice a day", "bwdatapt":28}
]
// initial state
const state = {

}

// getters
const getters = {
  getfrequencyops:state=>{
    return _freqOptions
  },
  getwidgetinstruments:state=>{
    return function(id){
      var index = _widgets.map(function(e){return e.id}).indexOf(id)
      if(index!=-1 && _widgets[index].instruments){
        return _widgets[index].instruments
      }else {
        return []
      }
    }
  },
  getwidgetlistbycancerid:state=>{
    return function(id){
      var arr=[]
      _widgets.forEach(function(el){
        if(el.cancertype){
          if((el.cancertype.map(function(e){return e.id}).indexOf(id))!=-1){
            arr.push(el)
          }
      }
      })
      return arr
    }
  },
  getwidgetlistbypatient:state=>{
    return function(pt){
      var id = pt.type
      var arr=[]
      _widgets.forEach(function(el){
        var bool = true
        if(el.cancertype){
          bool= bool && (el.cancertype.map(function(e){return e.id}).indexOf(id)!=-1)
        }
        if(el.constraint.maxage){
          bool= bool && (pt.age<=el.constraint.maxage)
        }
        if(el.constraint.minage){
          bool= bool && (pt.age>=el.constraint.minage)
        }
        if(el.constraint.femaleonly){
          bool= bool && (pt.gender=='female')
        }
        if(el.constraint.maleonly){
          bool= bool && (pt.gender=='male')
        }
        if(bool)  arr.push(el)
      })
      return arr
    }
  }
}

// actions
const actions = {
}

// mutations
const mutations = {
}

export default {
  state,
  getters,
  actions,
  mutations
}
