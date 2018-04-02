const _layouttemplate= [
			{ "x":0,"y":0,"w":4,"h":6,"i":"0","c":"PRO-01"},
			{ "x":0,"y":6,"w":4,"h":6,"i":"1","c":"SM-01"},
			{ "x":4,"y":0,"w":4,"h":6,"i":"2","c":"PRO-04"},
			{ "x":0,"y":12,"w":4,"h":6,"i":"3","c":"SM-04"},
			{ "x":8,"y":0,"w":4,"h":6,"i":"4","c":"PRO-02"},
			{ "x":4,"y":6,"w":8,"h":12,"i":"5","c":"PRO-03"}
 		]
// initial state
const state = {
  defaultlayoutlist: [{"cancertype":0,"layout":[
			{ "x":3,"y":0,"w":3,"h":3,"i":"0","c":{"id": "PRO-04", "label": "Nausea & Vomiting","type": "PRO", "constraint": {}, "count": 0, "pnotecount": 0, "sel": true, "selindex": 0}},
			{ "x":6,"y":0,"w":3,"h":3,"i":"1","c":{"id": "PRO-05", "label": "Nerve Pain & Tingling","type": "PRO", "constraint": {}, "count": 0, "pnotecount": 0, "sel": true, "selindex": 0}},
			{ "x":9,"y":0,"w":3,"h":3,"i":"2","c":{"id": "PRO-06", "label": "Palm & Sole Rash","type": "PRO", "constraint": {}, "count": 0, "pnotecount": 0, "sel": true, "selindex": 0}},
			{ "x":0,"y":0,"w":3,"h":3,"i":"3","c":{"id": "PRO-07", "label": "Fatigue","type": "PRO", "constraint": {}, "count": 0, "pnotecount": 0, "sel": true, "selindex": 0}},
			{ "x":0,"y":8,"w":3,"h":3,"i":"4","c":{"id": "PRO-08", "label": "Mouth Sores","type": "PRO", "constraint": {}, "count": 0, "pnotecount": 0, "sel": true, "selindex": 0}},
			{ "x":3,"y":8,"w":3,"h":3,"i":"5","c":{"id": "PRO-10", "label": "Drinking Fluids","type": "PRO", "constraint": {}, "count": 0, "pnotecount": 0, "sel": true, "selindex": 0}},
			{ "x":6,"y":8,"w":3,"h":3,"i":"6","c":{"id": "PRO-12", "label": "Temperature & Fever","type": "PRO", "constraint": {}, "count": 0, "pnotecount": 0, "sel": true, "selindex": 0}},
			{ "x":3,"y":16,"w":3,"h":2,"i":"7","c":{"id": "SM-05", "label": "Family Talk About Cancer Risk","type": "SM", "constraint": {}, "count": 0, "pnotecount": 0, "sel": true, "selindex": 0}},
			{ "x":0,"y":16,"w":3,"h":2,"i":"8","c":{"id": "SM-06", "label": "Chemo and Fertility","type": "SM", "constraint": {}, "count": 0, "pnotecount": 0, "sel": true, "selindex": 0}},
			{ "x":9,"y":8,"w":3,"h":2,"i":"9","c":{"id": "SM-04", "label": "Body Image","type": "SM", "constraint": {}, "count": 0, "pnotecount": 0, "sel": true, "selindex": 0}},
			{ "x":6,"y":16,"w":3,"h":2,"i":"10","c":{"id": "SM-07", "label": "Advance Directive","type": "SM", "constraint": {}, "count": 0, "pnotecount": 0, "sel": true, "selindex": 0}}
		]},
		{"cancertype":1,"layout":[
				{ "x":3,"y":0,"w":3,"h":3,"i":"0","c":{"id": "PRO-04", "label": "Nausea & Vomiting","type": "PRO", "constraint": {}, "count": 0, "pnotecount": 0, "sel": true, "selindex": 0}},
				{ "x":6,"y":0,"w":3,"h":3,"i":"1","c":{"id": "PRO-05", "label": "Nerve Pain & Tingling","type": "PRO", "constraint": {}, "count": 0, "pnotecount": 0, "sel": true, "selindex": 0}},
				{ "x":9,"y":0,"w":3,"h":3,"i":"2","c":{"id": "PRO-06", "label": "Palm & Sole Rash","type": "PRO", "constraint": {}, "count": 0, "pnotecount": 0, "sel": true, "selindex": 0}},
				{ "x":0,"y":0,"w":3,"h":3,"i":"3","c":{"id": "PRO-07", "label": "Fatigue","type": "PRO", "constraint": {}, "count": 0, "pnotecount": 0, "sel": true, "selindex": 0}},
				{ "x":0,"y":8,"w":3,"h":3,"i":"4","c":{"id": "PRO-08", "label": "Mouth Sores","type": "PRO", "constraint": {}, "count": 0, "pnotecount": 0, "sel": true, "selindex": 0}},
				{ "x":3,"y":8,"w":3,"h":3,"i":"5","c":{"id": "PRO-10", "label": "Drinking Fluids","type": "PRO", "constraint": {}, "count": 0, "pnotecount": 0, "sel": true, "selindex": 0}},
				{ "x":6,"y":8,"w":3,"h":3,"i":"6","c":{"id": "PRO-12", "label": "Temperature & Fever","type": "PRO", "constraint": {}, "count": 0, "pnotecount": 0, "sel": true, "selindex": 0}},
				{ "x":3,"y":16,"w":3,"h":2,"i":"7","c":{"id": "SM-05", "label": "Family Talk About Cancer Risk","type": "SM", "constraint": {}, "count": 0, "pnotecount": 0, "sel": true, "selindex": 0}},
				{ "x":0,"y":16,"w":3,"h":2,"i":"8","c":{"id": "SM-06", "label": "Chemo and Fertility","type": "SM", "constraint": {}, "count": 0, "pnotecount": 0, "sel": true, "selindex": 0}},
				{ "x":9,"y":8,"w":3,"h":2,"i":"9","c":{"id": "SM-04", "label": "Body Image","type": "SM", "constraint": {}, "count": 0, "pnotecount": 0, "sel": true, "selindex": 0}},
				{ "x":6,"y":16,"w":3,"h":2,"i":"10","c":{"id": "SM-07", "label": "Advance Directive","type": "SM", "constraint": {}, "count": 0, "pnotecount": 0, "sel": true, "selindex": 0}}
			]},
			{"cancertype":2,"layout":[
					{ "x":3,"y":0,"w":3,"h":3,"i":"0","c":{"id": "PRO-04", "label": "Nausea & Vomiting","type": "PRO", "constraint": {}, "count": 0, "pnotecount": 0, "sel": true, "selindex": 0}},
					{ "x":6,"y":0,"w":3,"h":3,"i":"1","c":{"id": "PRO-05", "label": "Nerve Pain & Tingling","type": "PRO", "constraint": {}, "count": 0, "pnotecount": 0, "sel": true, "selindex": 0}},
					{ "x":9,"y":0,"w":3,"h":3,"i":"2","c":{"id": "PRO-06", "label": "Palm & Sole Rash","type": "PRO", "constraint": {}, "count": 0, "pnotecount": 0, "sel": true, "selindex": 0}},
					{ "x":0,"y":0,"w":3,"h":3,"i":"3","c":{"id": "PRO-07", "label": "Fatigue","type": "PRO", "constraint": {}, "count": 0, "pnotecount": 0, "sel": true, "selindex": 0}},
					{ "x":0,"y":8,"w":3,"h":3,"i":"4","c":{"id": "PRO-08", "label": "Mouth Sores","type": "PRO", "constraint": {}, "count": 0, "pnotecount": 0, "sel": true, "selindex": 0}},
					{ "x":3,"y":8,"w":3,"h":3,"i":"5","c":{"id": "PRO-10", "label": "Drinking Fluids","type": "PRO", "constraint": {}, "count": 0, "pnotecount": 0, "sel": true, "selindex": 0}},
					{ "x":6,"y":8,"w":3,"h":3,"i":"6","c":{"id": "PRO-12", "label": "Temperature & Fever","type": "PRO", "constraint": {}, "count": 0, "pnotecount": 0, "sel": true, "selindex": 0}},
					{ "x":3,"y":16,"w":3,"h":2,"i":"7","c":{"id": "SM-05", "label": "Family Talk About Cancer Risk","type": "SM", "constraint": {}, "count": 0, "pnotecount": 0, "sel": true, "selindex": 0}},
					{ "x":0,"y":16,"w":3,"h":2,"i":"8","c":{"id": "SM-06", "label": "Chemo and Fertility","type": "SM", "constraint": {}, "count": 0, "pnotecount": 0, "sel": true, "selindex": 0}},
					{ "x":9,"y":8,"w":3,"h":2,"i":"9","c":{"id": "SM-04", "label": "Body Image","type": "SM", "constraint": {}, "count": 0, "pnotecount": 0, "sel": true, "selindex": 0}},
					{ "x":6,"y":16,"w":3,"h":2,"i":"10","c":{"id": "SM-07", "label": "Advance Directive","type": "SM", "constraint": {}, "count": 0, "pnotecount": 0, "sel": true, "selindex": 0}}
				]}
		]
}
// getters
const getters = {
  getdefaultlayoutbycancerid:state=>{
    return function(id){
      var index = state.defaultlayoutlist.map(function(e){return e.cancertype}).indexOf(id)
      if(index!=-1){
        return state.defaultlayoutlist[index].layout
      }else {
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
	savedefaultlayout(state,obj) {
		var id=obj.cancerid;
		var index = state.defaultlayoutlist.map(function(e){return e.cancertype}).indexOf(id)
		if(index!=-1){
			state.defaultlayoutlist[index].layout=JSON.parse(JSON.stringify(obj.layout))
		}
	}
}
export default {
  state,
  getters,
  actions,
  mutations
}
