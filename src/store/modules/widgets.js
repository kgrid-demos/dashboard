const _widgets= [
  { "id":"PRO-01","label":"Pain", "type":"PRO",     "constraint":{},
    "cancertype":[  {id:0}, {id:1},{id:2}],
    "instruments":[ { name: "GAD-7 Questionnaire", value: 1},
                    { name: "Hilbert-Thad Questionnaire", value: 2},
                    { name: "Penta-PLU Pain Probe", value: 3} ],
    "dataprop":{"a":"b"}, "datasetting":{"a":"b"}},
  { "id":"PRO-02","label":"Anxiety", "type":"PRO",    "constraint":{},
    "cancertype":[  {id:0}, {id:1},{id:2}],
    "dataprop":{"a":"b"}, "datasetting":{"a":"b"}},
  { "id":"PRO-03","label":"Depression", "type":"PRO",    "constraint":{},
    "cancertype":[  {id:0}, {id:1},{id:2}],
    "dataprop":{"a":"b"}, "datasetting":{"a":"b"}},
  { "id":"PRO-04","label":"Nausea/Vomitting",  "type":"PRO",    "constraint":{},
  "cancertype":[  {id:0}, {id:1},{id:2}],
    "dataprop":{"a":"b"}, "datasetting":{"a":"b"}},
  { "id":"PRO-05","label":"Neuropathy", "type":"PRO",    "constraint":{},
  "cancertype":[  {id:0}, {id:1},{id:2}],
    "dataprop":{"a":"b"}, "datasetting":{"a":"b"}},
  { "id":"PRO-06","label":"Palm/Sole Rash", "type":"PRO",    "constraint":{},
  "cancertype":[  {id:0}, {id:1},{id:2}],
    "dataprop":{"a":"b"}, "datasetting":{"a":"b"}},
  { "id":"PRO-07","label":"Fatigue",  "type":"PRO",    "constraint":{},
  "cancertype":[  {id:0}, {id:1},{id:2}],
    "dataprop":{"a":"b"}, "datasetting":{"a":"b"}},
  { "id":"PRO-08","label":"Mouth sore", "type":"PRO",    "constraint":{},
  "cancertype":[  {id:0}, {id:1},{id:2}],
    "dataprop":{"a":"b"}, "datasetting":{"a":"b"}},
  { "id":"PRO-09","label":"Weight", "type":"PRO",    "constraint":{},
  "cancertype":[  {id:0}, {id:1},{id:2}],
    "dataprop":{"a":"b"}, "datasetting":{"a":"b"}},
  { "id":"PRO-10","label":"Fluid Intake",  "type":"PRO",    "constraint":{},
  "cancertype":[  {id:0}, {id:1},{id:2}],
    "dataprop":{"a":"b"}, "datasetting":{"a":"b"}},
  { "id":"PRO-11","label":"Ostomy Output", "type":"PRO",    "constraint":{},
  "cancertype":[ {id:1}],
    "dataprop":{"a":"b"}, "datasetting":{"a":"b"}},
  { "id":"PRO-12","label":"Fever/Infection", "type":"PRO",    "constraint":{},
  "cancertype":[  {id:0}, {id:1},{id:2}],
    "dataprop":{"a":"b"}, "datasetting":{"a":"b"}},
  { "id":"PRO-13","label":"Taste/Appetite",  "type":"PRO",    "constraint":{},
  "cancertype":[  {id:0}, {id:1},{id:2}],
    "dataprop":{"a":"b"}, "datasetting":{"a":"b"}},
  { "id":"PRO-14","label":"Fertility", "type":"PRO",    "constraint":{},
  "cancertype":[  {id:0},{id:2}],
    "dataprop":{"a":"b"}, "datasetting":{"a":"b"}},
  { "id":"PRO-15","label":"Activity for Exercise", "type":"PRO",    "constraint":{},
  "cancertype":[  {id:0}, {id:1},{id:2}],
    "dataprop":{"a":"b"}, "datasetting":{"a":"b"}},
  { "id":"SM-01","label":"Nutrition Support", "type":"SM",    "constraint":{},
  "cancertype":[  {id:0}, {id:1},{id:2}],
    "dataprop":{"a":"b"}, "datasetting":{"a":"b"}},
  { "id":"SM-02","label":"IV Pump Care at Home",  "type":"SM",    "constraint":{},
  "cancertype":[  {id:1},{id:2}],
    "dataprop":{"a":"b"}, "datasetting":{"a":"b"}},
  { "id":"SM-03","label":"Ostomy Care", "type":"SM",    "constraint":{},
  "cancertype":[ {id:1}],
    "dataprop":{"a":"b"}, "datasetting":{"a":"b"}},
  { "id":"SM-04","label":"Self-Image",  "type":"SM",    "constraint":{},
  "cancertype":[  {id:0}, {id:1},{id:2}],
    "dataprop":{"a":"b"}, "datasetting":{"a":"b"}},
  { "id":"SM-05","label":"Familial Risk Discussion", "type":"SM",    "constraint":{},
  "cancertype":[  {id:0}, {id:1},{id:2}],
    "dataprop":{"a":"b"}, "datasetting":{"a":"b"}},
  { "id":"SM-06","label":"Fertility Impact",  "type":"SM",    "constraint":{},
  "cancertype":[  {id:0},{id:2}],
    "dataprop":{"a":"b"}, "datasetting":{"a":"b"}},
  { "id":"SM-07","label":"End of Life Care", "type":"SM",    "constraint":{},
  "cancertype":[  {id:1}],
    "dataprop":{"a":"b"}, "datasetting":{"a":"b"}},
  { "id":"SM-08","label":"Sexual Health",  "type":"SM",    "constraint":{},
  "cancertype":[  {id:0}, {id:1},{id:2}],
    "dataprop":{"a":"b"}, "datasetting":{"a":"b"}}
                        ]
// initial state
const state = {
  widgetslist:[]
}

// getters
const getters = {
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
