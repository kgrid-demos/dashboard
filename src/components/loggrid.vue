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
</div>
</template>
<script>
export default {
  name: 'loggrid',
  template: '#grid-template',
  props: [
    'data','columns','filterKey'
  ],
  components:{},
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
  },
  filters: {
    capitalize: function (str) {
      return str.charAt(0).toUpperCase() + str.slice(1)
    }
  },
  methods: {
    sortBy: function (key) {
      this.sortKey = key
      this.sortOrders[key] = this.sortOrders[key] * -1
    },
    selectRow: function(key){
      console.log(key)
      if(this.group_id!=-1)
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
  padding: 5px 5px;
  font-size:11px;
  text-overflow: ellipsis;
}
th:nth-child(1){  width: 10%;}
th:nth-child(2){  width: 10%;}
th:nth-child(3){  width: 10%;}
th:nth-child(4){  width: 15%;}
th:nth-child(5){  width: 15%;}
th:nth-child(6){  width: 20%;}
th:nth-child(7){  width: 20%;}
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
