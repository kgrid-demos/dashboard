import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const debug = process.env.NODE_ENV !== 'production'

export default new Vuex.Store({
  strict: debug,
  state:{
    debugEnabled:true,
    libpaths:[{name:'Library',url:'http://kgrid.med.umich.edu/library/knowledgeObject',count:0},
      {name:'Library2',url:'http://kgrid.med.umich.edu/library2/knowledgeObject',count:0},
      {name:'Stack',url:'http://kgrid.med.umich.edu/stack/shelf',count:0},
      {name:'Stack2',url:'http://kgrid.med.umich.edu/stack2/shelf',count:0},
      {name:'Dev-a',url:'http://dlhs-fedora-dev.med.umich.edu/ExecutionStack/shelf',count:0},

    ],
    baseurl:'',
    currentUser: {username:"",password:"",admin:false},
    currentObject: { metadata:{title:"",keywords:"",contributors:"",published:"",citations:[],license:{licenseName:"",licenseLink:""}}, payload:{functionName:"",engineType:"",content:""},inputMessage:"", outputMessage:"", uri:"",published:false,lastModified:0,createdOn:0} ,
    activeTab:'METADATA',
    libraryEnv: {git:{commit:{time:0,id:''}},build:{version:'',artifact:'',name:'',group:'',time:0},'library.name':''},
    libraryname: '',
    displayDataCount:0
  },
  mutations: {
    seturl(state, url) {
      state.baseurl = url;
    },
    setuser(state, user){
      state.currentUser =user;
    },
    setactivetab(state, tab){
      state.activeTab = tab;
    },
    setobject(state, obj) {
      state.currentObject = obj;
    },
    setenv(state, env){

      state.libraryEnv = env;
      state.libraryname= env["library.name"];
    },
    setcount(state, obj){

      var index=  state.libpaths.findIndex(function(element){
        return element.url==obj.url
      });
      state.libpaths[index].count=obj.count;

    },
    setFilteredCount(state,count){
        state.displayDataCount=count;
    }
  },
  getters: {
    isLoggedIn: state => {
     return (state.currentUser.username!='')
    },
    isAdmin: state => {
     return (state.currentUser.admin)
    },
    getfirstname: state => {
      return (state.currentUser.first_name || '')
    },
    getuser: state => {
       return state.currentUser
    },
    getactivetab: state => {
      return state.activeTab
    },
    getobject: state =>{
      return state.currentObject
    },
    getLibraryName: state =>{
        return (state.libraryname || '')
    },
    getGitID: state=>{
        return (state.libraryEnv.git.commit.id ||'')
    },
    getLibPath: state=>{
        return state.libpaths;
    },
    getBuildTime: state=>{

        return (state.libraryEnv.build.time || 0)
    },
    getVersion: state=>{
        return (state.libraryEnv.build.version ||'')
    },
    getDataLength: state=>{
        return state.displayDataCount;
    }
  }
  // plugins: debug ? [createLogger()] : []
})
