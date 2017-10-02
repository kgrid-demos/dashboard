<template>

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
        <th>Interventions</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="entry, key in filteredData" @click='selectRow(key)'>
        <td v-for="key in columns">
          {{entry[key]}}
        </td>
        <td>
          <ul><li v-for='widget in entry.wlist'><koicon :object='widget' ></koicon></li></ul>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script>
import koicon from "./koicon.vue"
export default {
  name: 'kogrid',
  template: '#grid-template',
  props: {
    data: Array,
    columns: Array,
    filterKey: String,
    groupid:-1
  },
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
      sortOrders: sortOrders
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
      this.$emit("selected", key)
    }
  }
}
</script>
<style scoped>
ul li {
  display: table-cell;
}
table {
  border-radius: 3px;
  background-color: #fff;
}

table.default {
  border: 2px solid #0075bc;
}
table.group0 {
  border: 2px solid #0075bc;
}
table.group1 {
  border: 2px solid blue;
}
table.group2 {
  border: 2px solid green;
}
table.group3 {
  border: 2px solid #0075bc;
}
table.group4 {
  border: 2px solid #0075bc;
}
table.group5 {
  border: 2px solid #0075bc;
}
table.group6 {
  border: 2px solid #0075bc;
}
table.group7 {
  border: 2px solid #0075bc;
}
table.group8 {
  border: 2px solid #0075bc;
}
table.group9 {
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
  table.group1  th{
    background-color: blue;
}
table.group2  th{
  background-color: green;
}
table.group3  th{
  border: 2px solid #0075bc;
}
table.group4  th{
  border: 2px solid #0075bc;
}
table.group5  th {
  border: 2px solid #0075bc;
}
table.group6  th{
  border: 2px solid #0075bc;
}
table.group7  th{
  border: 2px solid #0075bc;
}
table.group8  th{
  border: 2px solid #0075bc;
}
table.group9 th {
  border: 2px solid #0075bc;
}
th, td {
  padding: 15px 15px;
  text-overflow: ellipsis;
}

th:nth-child(1){  width: 300px;}
th:nth-child(2){  width: 400px;}
th:nth-child(3){  width: 200px;}
th:nth-child(4){  width: 200px;}

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
    transition: background 0.5s ease, color 0.5s ease;
    cursor:pointer;
}
tr:hover{
    background:#7d948e;
    color: #fff
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
