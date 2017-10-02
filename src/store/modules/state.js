export var initialState = {
  debugEnabled:true,
  currentUser: {username:"chad",first_name:"",last_name:""},
  widgetMasterList: [ { "id":"PRO-01","label":"Pain","type":"PRO"},
                      { "id":"PRO-02","label":"Anxiety","type":"PRO"},
                      { "id":"PRO-03","label":"Depression","type":"PRO"},
                      { "id":"PRO-04","label":"Nausea","type":"PRO"},
                      { "id":"SM-01","label":"Smoking CESSATION","type":"SM"},
                      { "id":"SM-02","label":"NUTRITION","type":"SM"}],
  patientlist:      [ { ID:"PA-67034-001", Name:"Larry Lambert", Age:"54", Gender:"male", type:0,group:[0,1,2,3,4],
                          wlist:[{id:'PRO-01',"label":"Pain",count:-1},{id:'PRO-02',"label":"Anxiety",count:-1},{id:'PRO-03',"label":"Depression",count:-1},{id:'PRO-04',"label":"Nausea",count:-1},{id:'SM-01',"label":"Smoking CESSATION",count:-1},{id:'SM-02',"label":"NUTRITION",count:-1}]},
                      { ID:"PA-67034-002", Name:"Alvin Adams",Age:"27", Gender:"male", type:0,group:[0,1,2,3,4],
                          wlist:[{id:'PRO-01',"label":"Pain",count:-1},{id:'PRO-02',"label":"Anxiety",count:-1},{id:'PRO-03',"label":"Depression",count:-1},{id:'PRO-04',"label":"Nausea",count:-1},{id:'SM-01',"label":"Smoking CESSATION",count:-1},{id:'SM-02',"label":"NUTRITION",count:-1}]},
                      { ID:"PA-67034-003", Name:"Larry Lambert Jr.", Age:"17", Gender:"male",type:0,group:[0,1,3,4,5],
                          wlist:[{id:'PRO-01',"label":"Pain",count:-1},{id:'PRO-02',"label":"Anxiety",count:-1},{id:'PRO-03',"label":"Depression",count:-1},{id:'PRO-04',"label":"Nausea",count:-1},{id:'SM-01',"label":"Smoking CESSATION",count:-1},{id:'SM-02',"label":"NUTRITION",count:-1}]},
                      { ID:"PA-67034-004", Name:"Marry McMahon", Age:"74", Gender:"female",type:0,group:[1,2,3,4,5],
                          wlist:[{id:'PRO-01',"label":"Pain",count:-1},{id:'PRO-02',"label":"Anxiety",count:-1},{id:'PRO-03',"label":"Depression",count:-1},{id:'PRO-04',"label":"Nausea",count:-1},{id:'SM-01',"label":"Smoking CESSATION",count:-1},{id:'SM-02',"label":"NUTRITION",count:-1}]},
                    ],
  defaultLayout:    [ { "x":0,"y":0,"w":4,"h":6,"i":"0","c":"PRO-01"},
                      { "x":0,"y":6,"w":4,"h":6,"i":"1","c":"SM-01"},
                      { "x":4,"y":0,"w":4,"h":6,"i":"2","c":"PRO-04"},
                      { "x":0,"y":12,"w":4,"h":6,"i":"3","c":"SM-02"},
                      { "x":8,"y":0,"w":4,"h":6,"i":"4","c":"PRO-02"},
                      { "x":4,"y":6,"w":8,"h":12,"i":"5","c":"PRO-03"}],

  ptregistrymodel: {patientid:'',providerid:'',regdate:''},

  // Patient Dashboard Layout Configuration
  paconfigs:[ { patientid:"PA-67034-001",
                layout:[]},
              { patientid:"PA-67034-002",
                layout:[]},
              { patientid:"PA-67034-003",
                layout:[]},
              { patientid:"PA-67034-004",
                  layout:[]},
              ],

  // PRO Configuration
  proregistry : [ {id:'PRO-01', ptlist: [{ptid:'', }]}

  ],
  prostatus : [

  ],
  widgetSettings: [

  ],
  currentStation:{id:0,"label":"Colon Cancer"},
  cancertypes:[{id:0,"label":"Colon Cancer"},{id:1,"label":"Liver Cancer"},{id:2,"label":"Prostate Cancer"},{id:3,"label":"Lung Cancer"}],
        }
