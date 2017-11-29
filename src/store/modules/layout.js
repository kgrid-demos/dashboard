const _layouttemplate= [
			{ "x":0,"y":0,"w":4,"h":6,"i":"0","c":"PRO-01"},
			{ "x":0,"y":6,"w":4,"h":6,"i":"1","c":"SM-01"},
			{ "x":4,"y":0,"w":4,"h":6,"i":"2","c":"PRO-04"},
			{ "x":0,"y":12,"w":4,"h":6,"i":"3","c":"SM-04"},
			{ "x":8,"y":0,"w":4,"h":6,"i":"4","c":"PRO-02"},
			{ "x":4,"y":6,"w":8,"h":12,"i":"5","c":"PRO-03"}
 		],

// initial state
const state = {
  defaultlayoutlist: [{"cancertype":0,"layout":[]}, {"cancertype":1,"layout":[]}]
}

// getters
const getters = {
  getdefaultlayoutbycancerid:state=>{
    return function(id){
      var index = state.defaultlayoutlist.map(function(e){return e.cancertype}).indexOf(id)
      if(index!=-1){
        return state.defaultlayoutlist[index]
      }else {
        return {}
      }
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
