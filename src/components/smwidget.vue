<template name="smwidget">
  <div>
    <div v-if='!editmode'>
      <div class="moduleContainer" v-if='maximized'>
        <p>Progress on Self Management Modules </p>
        <ul class="moduleList">
          <li class="module" :class="module.status" v-bind:style="widgetStyle" v-for="module in weeklymodules" v-bind:key="module.id">
            {{module.status}} <br> <span class="moduleLabel">Module {{module.value}}</span> <br>
            <div v-if="module.status==='☑'"><br>{{module.datecompleted}}</div>
          </li>
        </ul>
      </div>
      <div class="progresscont" v-if='!maximized'>
        <div class="progress" v-bind:style="progressStyle"> </div>
        <div class="barlabel">Modules completed: {{numcomplete}} / {{selectedinstr.modulecount}}</div>
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
          Frequency
        </div>
        <div class="options pad-l-20" v-if='selectedinstr'>
          <select v-model="custfreq">
            <option v-for="freq in freqops" v-bind:value="freq.label">
              {{ freq.label }}
            </option>
          </select>
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
    props: ['chartheight', 'patientid', 'editmode', 'object','title', 'startdate', 'totalminutes', 'minutescompleted', 'maximized'],
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
          var freq = this.selectedinstr.bwfreq
          var index = this.freqops.map(function(e){return e.bwdatapt}).indexOf(freq)
          console.log("Freq="+freq)
          console.log(" Index="+index)
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
      starttimestamp:function(){
        return this.$moment(this.startdate).unix()
      },
      weeklymodules:function(){
        var self = this;
        var arr=[];
        self.alldata.forEach(function(e){
          var obj={value:1, status:"", timestamp:-1}
          obj.value=e.value;
          obj.timestamp=e.date;
          obj.status="☐"
          if((obj.timestamp!=-1) && (obj.timestamp<self.starttimestamp)){
              obj.status="☑"
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
        return this.$store.getters.getPatientData(this.patientid)[this.object.id + "-data"].slice()
      }
    },
    methods: {
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
    text-transform: none;
    background-color: #fff;
    text-align: center;
  }
  .moduleList {
  width: 100%;
  display: table;
      margin: 2.5em auto;
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
  }
  .barlabel {
    color: green;
    position: absolute;
    top: 12px;
    width: 100%;
    text-align: center;
    left: 0;
    text-shadow:
    -1px -1px 0 #fff,
    1px -1px 0 #fff,
    -1px 1px 0 #fff,
    1px 1px 0 #fff;
  }
</style>
