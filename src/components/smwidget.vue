<template name="smwidget">
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
        datasettings: {},
        selectedinstrname: "",
        custfreq:"",
        sendnotification:false
      }
    },
    created: function() {
      var self = this;
      this.$eventBus.$on('saveSettings', function () {
        self.saveoptions();
      });
      const obj = {"id":this.$route.params.id,"group":this.currentGroup.id,"wid": this.object.id};
      if (this.$store.getters.getDataSettings(obj)) {
        this.datasettings = Object.assign({}, this.$store.getters.getDataSettings(obj).datasettings);
        this.selectedinstrname = this.datasettings.selectedinstrument.name;
      }
      this.custfreq = this.selectedfreq
      this.datasettings.selectedinstrument = this.selectedinstr
      this.datasettings.sendnotification = this.sendnotification
    },
    beforeDestroy() {
      this.$eventBus.$off("saveSettings");
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
          width: `${100 / this.datasettings.weeklyfreq}%`,
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
          obj.value=e.value;
          obj.timestamp=self.$moment().add(e.dateOffset, 'd').unix();
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
          return this.$store.getters.getpatientsmdata(this.object.id)
        }else {
          return []
        }
      }
    },
    watch:{
      maximized:function(){
        var obj={};
        obj.end=this.$moment.unix(this.today).day(6).endOf('day').unix();
        if(this.maximized){
          switch(this.patientid){
            case 'PA-67034-001':
              obj.days=84;
              break;
            case 'PA-67034-007':
              obj.days=56;
              break;
            default:
              obj.days=28;
              break;
          }
        }else {
          obj.days=7
        }
        obj.start= obj.end-obj.days*24*3600;;
        this.$store.commit('setcurrentdaterange',obj)
        this.$nextTick()
      }
    },
    methods: {
      maximizeWidget:function(){
        this.$emit("maximizeme",this.object.id)
      },
      saveoptions :function ()  {
          this.$store.commit('saveWidgetSettings', {'pid': this.$route.params.id, "group":this.currentGroup.id, "wid":this.object.id,'datasettings':this.datasettings});
      },
      generateNotification() {
        let finalDataPoint = this.weeklydata[this.weeklydata.length - 1];
        this.$emit("alert", finalDataPoint, this.datasettings.notifythresh);
      }
    }
  }
</script>

<style scoped>
  .moduleContainer {
    margin: 3em;
    padding-top: 2.5em;
    text-transform: none;
    background-color: #fff;
    text-align: center;
  }
  .moduleList {
    width: 100%;
    display: table;
    margin: 2.5em auto;
    padding: 20px 0px;
  }
  .☑ {
    color: green;
  }
  .☒ {
    color: red;
  }
  .module {
    font-size:24pt;
    line-height: 14pt;
    display: table-cell;
  }
  .module div {
    color: gray;
    font-size: 10pt;
  }
  .moduleLabel {
    font-size: 10pt;
  }
  .options, .optionslabel {
      height: 100%;
      float: left;
  }
  .optionslabel{
      width: 40%;
  }
  .options {
      width:60%;
  }
  .options select {
    width:90%;
  }
  .optrow {
      padding: 12px 10px;
      clear: both;
  }
  .progresscont {
    margin: 10px auto;
    padding: 1px;
    font-size: 11pt;
    border: 1px solid green;
    height: 26px;
    border-radius: 5px;
    width: 90%;
    position: relative;
    top:50%;
    transform: translateY(-80%);
    background-color:#fff
  }
  .barlabel {
    color: aqua;
    position: absolute;
    top: 2px;
    width: 100%;
    text-align: center;
    left: 0;
    font-weight:700;
    mix-blend-mode:difference;
  }

</style>
