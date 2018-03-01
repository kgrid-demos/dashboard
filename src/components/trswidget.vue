<template name="trswidget">
  <div class='noselect'>
    <div v-if='!editmode' :style='myStyles'>
      <div class="moduleContainer" v-if='maximized'>
        <p>Progress on Self Management Modules </p>
        <ul class="moduleList">
          <li class="module" :class="module.status" v-bind:style="widgetStyle" v-for="module in weeklymodules" v-bind:key="module.id">
            {{module.status}} <br> <span class="moduleLabel">Module {{module.value}}</span> <br>
            <div class='pad-b-20' v-if="module.status==='☑'"><br>Completed on:<br>{{module.date}}</div>
          </li>
        </ul>
      </div>
      <div class="progresscont" v-if='!maximized'>
        <div class="progress" v-bind:style="progressStyle"> </div>
        <div class="barlabel" ref="thelabel">Modules completed: {{numcomplete}} / {{selectedinstr.modulecount}}</div>
      </div>
    </div>
    <div v-if="editmode">
      <div class="optrow">
        <div class="optionslabel pad-l-20">
          Description
        </div>
        <div class="options pad-l-20">
          <span>{{selectedinstr.description}}</span>
        </div>
      </div>
      <div class="optrow">
        <div class="optionslabel pad-l-20">
          Number of Modules
        </div>
        <div class="options pad-l-20">
          <span>{{selectedinstr.modulecount}}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import vueSlider from 'vue-slider-component';

  export default {
    props: ['chartheight', 'patientid', 'editmode', 'viewmode','object','title', 'totalminutes', 'minutescompleted', 'maximized'],
    components: {
      vueSlider
    },
    data () {
      return {
        selectedinstrname: "",
        custfreq:"",
        sendnotification:false
      }
    },
    created: function() {
      var self = this;
      const obj = {"id":this.$route.params.id,"group":this.currentGroup.id,"wid": this.object.id};
      this.selectedinstrname = this.instruments[this.object.selindex].name;
      this.custfreq = this.selectedfreq
    },
    computed : {
      today:function(){
        return this.$store.getters.gettoday
      },
      labelmargin:function(){
        var el = this.$refs.thelabel
        return el.style.length
      },
      daterange:function(){
        return this.$store.getters.getcurrentdaterange
      },
      instruments: function(){
        return this.$store.getters.getwidgetinstruments(this.object.id)
        },
      currentGroup:function(){
        return this.$store.getters.getcurrentGroup;
      },
      freqops:function(){
        return this.$store.getters.getfrequencyops
      },
      selectedfreq:function(){
          var freq = this.selectedinstr.bwpoints
          var index = this.freqops.map(function(e){return e.bwdatapt}).indexOf(freq)
          if(index!=-1){
            return this.freqops[index].label
            }else {
              return ""
              }
      },
      selectedinstr: function(){
        return this.instruments[0]
      },
      myStyles () {
        return {
          height: `${this.chartheight}px`,
          position: 'relative'
        }
      },
      widgetStyle() {
        return {
          width: `${100 / this.selectedinstr.modulecount}%`,
          position: 'relative'
        }
      },
      progressStyle() {
        return {
          width: `${(this.numcomplete / this.selectedinstr.modulecount) * 100}%`,
          height: '22px',
          backgroundColor: '#00aa00'
        }
      },
      wlabel(){
        return {
          width: `${(this.numcomplete / this.selectedinstr.modulecount) * 100}%`,
          marginLeft: `10%`
        }
      },
      weeklymodules:function(){
        var self = this;
        var arr=[];
        self.alldata.forEach(function(e){
          var obj={value:1, status:"", timestamp:-1,date:null}
          obj.value=e.v;
          obj.timestamp=self.$moment().add(e.d, 'd').unix();
          obj.date=self.$moment.unix(obj.timestamp).format('MMMM DD, YYYY')
          obj.status="☐"
          if(obj.timestamp<self.daterange.endtime){
            obj.status="☑";
          }
          arr.push(obj)
        })
        return arr
      },
      numcomplete: function(){
        var self =this;
        var count = 0;
        this.weeklymodules.forEach(function(e){
          if(e.status=="☑"){
            count=count + 1;
          }
        })
        return count
      },
      alldata:function(){
        if(this.viewmode){
          return this.$store.getters.getWidgetData(this.object.id)
        }else {
          return []
        }
      }
    },
    methods: {
    }
  }
</script>
