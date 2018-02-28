<template>
<div>
  <table class='group0'>
    <thead>
      <tr>
        <th v-for="key in columns"
          @click="sortBy(key)"
          :class="{ active: sortKey == key }">
          {{ key | capitalize }}
          <span class="arrow" :class="sortOrders[key] > 0 ? 'asc' : 'dsc'">
          </span>
        </th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(entry, index) in filteredData" @click='selectRow(index)' @mouseover='selrow(index)' @mouseout='selrow(-1)'>
        <td v-for="key in columns">
          {{entry[key]}}
        </td>
      </tr>
    </tbody>
  </table>
  <div class='patientsummary' v-if='hoverrow!=-1'>
    <div class='patientinfo row mar-0 ft-sz-22'>
      <div class='col-md-4 '> <small>NAME:</small> {{filteredData[hoverrow].name}} </div>
      <div class='col-md-4 '>  <small>GENDER:</small> {{filteredData[hoverrow].gender}} </div>
      <div class='col-md-4'> <small> AGE:</small> {{filteredData[hoverrow].age}} </div>
    </div>
    <div class='row interventionlisting mar-0' ><p class='ft-sz-18'>Interventions</p>
     <ul style='margin:0 auto;' v-if='groupid!=-1'><li v-for='widget in wlist'><koicon :object='widget' ></koicon></li></ul></div>
  </div>
</div>
</template>
<script>
import koicon from "./koicon.vue"
export default {
  name: 'kogrid',
  template: '#grid-template',
  props: [
    'data','columns','filterKey','groupid'
  ],
  components:{
    koicon
  },
  data: function () {
    var sortOrders = {}
    this.columns.forEach(function (key) {
      sortOrders[key] = 1
    })
    return {
      sortKey: '',
      sortOrders: sortOrders,
      hoverrow:-1
    }
  },
  computed: {
    groupclass: function(){
      var c="default";
      if(this.groupid!=-1){
        c='group'+this.groupid;
      }
      return c;
    },
    filteredData: function () {
      var sortKey = this.sortKey
      var filterKey = this.filterKey && this.filterKey.toLowerCase()
      var order = this.sortOrders[sortKey] || 1
      var data = this.data
      if (filterKey) {
        data = data.filter(function (row) {
          return Object.keys(row).some(function (key) {
            return String(row[key]).toLowerCase().indexOf(filterKey) > -1
          })
        })
      }
      if (sortKey) {
        data = data.slice().sort(function (a, b) {
          a = a[sortKey]
          b = b[sortKey]
          return (a === b ? 0 : a > b ? 1 : -1) * order
        })
      }
      return data
    },
    wlist:function(){
      var l=[];
      var wl=[];
      var self=this;
      if(this.widgetMasterList.length>0){
        l=JSON.parse(JSON.stringify( this.filteredData[this.hoverrow].layout));
        this.widgetMasterList.forEach(function(e){
          var w = {id:e.id,label:e.label,count:-1,alertText:""}
          var ind = l.map(function(el){return el.c.id}).indexOf(e.id)
          if(ind!=-1){
            w.count=l[ind].c.count
          }
          wl.push(w)
        })
      }
      return wl
    },
    widgetMasterList: function(){
      if(this.hoverrow!=-1){
        return JSON.parse(JSON.stringify(this.$store.getters.getwidgetlistbypatient(this.patient(this.hoverrow))));
      }else {
        return []
      }
    },
    currentGroup: function(){
      return this.$store.getters.getcurrentGroup;
    },
  },
  filters: {
    capitalize: function (str) {
      return str.charAt(0).toUpperCase() + str.slice(1)
    }
  },
  methods: {
    patient: function(i){
			var id = this.filteredData[i].id
			return this.$store.getters.getpatientbyid({"id":id,"group":this.currentGroup.id});
		},
    sortBy: function (key) {
      this.sortKey = key
      this.sortOrders[key] = this.sortOrders[key] * -1
    },
    selectRow: function(key){
      console.log(key)
      if(this.groupid!=-1)
        this.$emit("selected", key)
    },
    selrow: function(index){
      this.hoverrow =index
    }
  }
}
</script>
<style scoped>
small {  font-size:50%; }
ul li {	display: inline-flex; }
table {
  border-radius: 3px;
  background-color: #fff;
  width: 100%;
  border: 2px solid #0075bc;
}
th {
color: #fff;
  cursor: pointer;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}
table.default  th {
background-color: #fff;
color: #0075bc;
}
table.group0  th{
background-color: #0075bc;
}

th, td {
  padding: 15px 15px;
  text-overflow: ellipsis;
}
th:nth-child(1){  width: 20%;}
th:nth-child(2){  width: 20%;}
th:nth-child(3){  width: 20%;}
th:nth-child(4){  width: 25%;}
th:nth-child(5){  width: 25%;}
th.active {
  color: #fff;
}
th.active .arrow {
  opacity: 1;
}
tr:nth-child(even) {
    background-color: #e3e3e3;
}
tr {
    background-color: #fff;
    border:1px solid transparent;
    transition: background-color 0.5s ease, color 0.5s ease;
    cursor:pointer;
    position: relative;
}
tr:hover{
    background:#7d948e;
    color: #fff
}
div.patientsummary {
  display:block;
  position:relative;
  top:80px;
  left:0px;
  min-height:400px;
  width:100%;
  border-top:1px solid #f5f5f5;
}
div.patientinfo {
  padding:10px 0px;
  line-height: 1.35em;
  border-bottom:1px solid #f5f5f5;
}
div.interventionlisting, div.treatmentinfo {
  padding:10px 15px;
  line-height: 1.35em;
  border-bottom:1px solid #f5f5f5;
  min-height:120px;
}
div.interventionlisting ul {
  margin-top:20px;
}
.arrow {
  display: inline-block;
  vertical-align: middle;
  width: 0;
  height: 0;
  margin-left: 5px;
  opacity: 0.66;
}
.arrow.asc {
  border-left: 4px solid transparent;
  border-right: 4px solid transparent;
  border-bottom: 4px solid #fff;
}
.arrow.dsc {
  border-left: 4px solid transparent;
  border-right: 4px solid transparent;
  border-top: 4px solid #fff;
}
</style>
