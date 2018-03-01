// initial state
const state = {
  patientid:'',
	notelist:[],
	alertlist:[]
}
// getters
const getters = {
	getpatientalert:state=>{
    return function(id) {
      var index = state.alertlist.map(function(e){return e.pid}).indexOf(state.patientid)
			var alist={}
			var wid = id+'-warn'
      if(index!=-1){
	      alist=JSON.parse(JSON.stringify(state.alertlist[index]))
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
      var index = state.notelist.map(function(e){return e.pid}).indexOf(state.patientid)
			var alist={}
			var wid = id+'-notes'
      if(index!=-1){
	      alist=JSON.parse(JSON.stringify(state.notelist[index]))
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
	loadsimudata (state, data){
		state.alertlist=data.alertlist
		state.notelist=data.notelist
	}
}
export default {
  state,
  getters,
  actions,
  mutations
}
