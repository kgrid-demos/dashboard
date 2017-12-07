<template name="prowidget">
  <div class="widgetcontainer">
    <div v-if="!editmode" >
    <div class="widgetalert" v-if="!maximized ">
      <div class="ft-sz-12 pad-l-8" >
        <span>{{selectedinstr.unit}}</span>
        <span v-if="hasalert" class="fa fa-exclamation-circle warning pad-l-5"></span>
        <span v-if="hasnotes" class="fa fa-file-text-o notes pad-l-5"></span>
      </div>
    </div>
    <div v-else class="widgetalertdisplay">
      <span class=""> ALERT </span>
      <ul>
        <li v-for='alert in allalert'>
          <span style="font-weight:700;"> {{alert.text}}</span></li>
    </ul>
    </div>
  </div>
  <div class="graph">
    <span v-if="maximized" class='pad-l-10'>{{selectedinstr.unit}}</span>
    <span v-if="maximized" class='float-r pad-r-10'>Patient Report Frequency: {{selectedfreq}}</span>
    <linechart v-if="!editmode" :chart-data="datacollection" :options="chartOptions" :styles='myStyles'></linechart>
    <div v-if="editmode">
      <div class="optrow">
        <div class="optionslabel">
          Instrument
        </div>
        <div class="options">
          <select v-model="selectedinstrname">
          <option disabled value="">(Please select one)</option>
            <option v-for="instrument in instruments" v-bind:value="instrument.name">
              {{ instrument.name }}
            </option>
          </select>
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
          Range
        </div>
        <div class="options pad-l-20"  v-if='selectedinstr'>
          {{selectedinstr.range.min}} to {{ selectedinstr.range.max}} with increment of {{selectedinstr.range.inc}}
        </div>
      </div>
      <div class="optrow">
        <div class="optionslabel pad-l-20">
          Indicators
        </div>
        <div class="options pad-l-20"  v-if='selectedinstr'>
          <div v-for='range in selectedinstr.ryg' class="thres" :class="range.color">
            <span v-if='range.min<range.max'>{{range.min}}-{{range.max}}</span>
            <span v-else>{{range.min}}</span>
          </div>
        </div>
      </div>
      <div class="optrow">
        <div class="optionslabel">
          Send Notification?
        </div>
        <div class="options">
              <input type="checkbox" id="checkbox" v-model="sendnotification">
        </div>
      </div>
    </div>
  </div>
  <div class='notesdisplay' v-if='maximized'>
    <span> PATIENT NOTES </span>
  <ul>
    <li v-for='note in allnotes' >
      <span style="font-style:italic;">{{formatted(note.date*1000)}} - {{note.note}}</span></li>
</ul>
  </div>
</div>
</template>

<script>
  import linechart from './linechart.js';
  export default {
    props: ['chartheight', 'editmode', 'object', 'title','patientid', 'maximized'],
    components: {
      linechart,
  },
    data () {
      return {
        datasettings: {},
        selectedinstrname: "",
        custfreq:"",
        sendnotification:false,
        chartOptions: {
          maintainAspectRatio: false,
          legend: {
            display: false
          },
          layout: {
            padding: {
              top: 15
            }
          },
          animation: {
            duration: 500,
            easing: 'easeOutSine'
          },
          scales: {
            yAxes: [{
              scaleLabel: {
                display: false,
                labelString: 'probability'
                },
              ticks: {
                min: 0,
                max: 10
              },
              gridLines: {
                display: true,
                color: '#f2f2f2',
                lineWidth: 2,
                drawBorder: false
              }
            }]
          },
        }
      }
    },
    created: function() {
      var self = this;
      this.$eventBus.$on('saveSettings', function (obj) {
        self.saveoptions(obj);
      });
      const obj = {"id":this.$route.params.id,"group":this.currentGroup.id,"wid": this.object.id};
      if (this.$store.getters.getDataSettings(obj)) {
        this.datasettings = Object.assign({}, this.$store.getters.getDataSettings(obj).datasettings);
        this.selectedinstrname = this.datasettings.selectedinstrument.name;
        this.custfreq = this.selectedfreq
        this.chartOptions.scales.yAxes[0].ticks.min = this.selectedinstr.range.min
        this.chartOptions.scales.yAxes[0].ticks.max = this.selectedinstr.range.max
        this.chartOptions.scales.yAxes[0].scaleLabel.labelString = this.selectedinstr.unit
      }
    },
    beforeDestroy() {
  	 this.$eventBus.$off("saveSettings");
     },
    watch: {
      selectedfreq: function(){
      if(this.selectedfreq!=""){
        this.custfreq = this.selectedfreq
        this.chartOptions.scales.yAxes[0].ticks.min = this.selectedinstr.range.min
        this.chartOptions.scales.yAxes[0].ticks.max = this.selectedinstr.range.max
        this.chartOptions.scales.yAxes[0].scaleLabel.labelString = this.selectedinstr.unit
        this.datasettings.selectedinstrument = this.selectedinstr
        this.datasettings.sendnotification = this.sendnotification
        }
      },
      maximized:function(){
        var obj={};
        obj.end=this.daterange.endtime;
        console.log("Max watch")
        console.log(obj)
        if(this.maximized){
          if(this.selectedinstr.bwfreq<5){
              obj.days=56
          }else {
            obj.days=28
          }
        }else {
          obj.days=7
        }
        obj.start= this.daterange.endtime-obj.days*24*3600;;
        this.$store.commit('setcurrentdaterange',obj)
      }
    },
    computed : {
      hasalert:function(){
        var b= false;
        this.allalert.forEach(function(e){
          b = b || (e.checked==false)
        })
        return b
      },
      hasnotes: function(){
        return this.allnotes.length>0
      },
      daterange:function(){
        return this.$store.getters.getcurrentdaterange
      },
      alldata:function(){
        return this.$store.getters.getPatientData(this.patientid)[this.object.id + "-data"].slice()
      },
      allnotes:function(){
        var data = this.$store.getters.getPatientData(this.patientid)
        if(data[this.object.id + "-notes"]){
          return data[this.object.id + "-notes"]
        } else {
          return []
        }
      },
      allalert:function(){
        return this.$store.getters.getpatientalert(this.object.id).slice()
      },
      instruments: function(){
        return this.$store.getters.getwidgetinstruments(this.object.id)
      },
      freqops:function(){
        return this.$store.getters.getfrequencyops
      },
      selectedfreq:function(){
        if(this.selectedinstr){
          var freq = this.selectedinstr.bwfreq
          var index = this.freqops.map(function(e){return e.bwdatapt}).indexOf(freq)
          if(index!=-1){
            return this.freqops[index].label
            }else {
              return ""
              }
          }else{
              return "none"
          }
      },
      selectedinstr: function(){
        if(this.selectedinstrname!=""){
          var index = this.instruments.map(function(e){return e.name}).indexOf(this.selectedinstrname)
          if(index!=-1){
            return this.instruments[index]
          }else {
            return null
          }
        } else {
          return null
        }
      },
    currentGroup:function(){
      return this.$store.getters.getcurrentGroup;
    },
    myStyles () {
      return {
        height: `${this.chartheight}px`,
        position: 'relative'
      }
    },
    datacollection: function(){
      var obj = {
        labels: this.displaydata.labels,
        datasets: [
          {
            label: this.title,
            data: this.displaydata.values,
            backgroundColor:'rgba(255, 255, 255, 1)',
            fill: false,
            lineTension: 0,
            borderColor: '#bfbfbf',
            pointBorderColor: this.displaydata.colors,
            pointBorderWidth: 3,
            pointStyle: 'circle',
            pointRadius: 6,
            borderWidth: 2
          }
        ]
      }
      return obj
    },
    displaydata: function(){
      var obj={values:[],labels:[],colors:[]};
      var self = this;
      var dp = 14/self.selectedinstr.bwfreq;              // If all data frequency is daily
      this.alldata.forEach(function (el,index) {
        var nth=Math.round(index/dp)*dp-index;           // If all data frequency is daily
        if(el.date > self.daterange.starttime && el.date < self.daterange.endtime) {
          if(nth==0){                                    // If all data frequency is daily
            obj.values.unshift(el.value);
            obj.labels.unshift(self.$moment.unix(el.date).format('MM/D'));
            obj.colors.unshift(self.getcolorfordata(el.value))
          }
        }
      });
      return obj
    }
    },
    methods: {
      formatted:function(t){
				return this.$moment(t).format("dddd, MMMM Do YYYY, h:mm:ss a");
			},
      saveoptions:function (obj) {
        var payload  = {'pid': obj.id, "group":obj.group, "wid":this.object.id,'datasettings':this.datasettings}
        console.log("PRO Widget : "+this.title)
        console.log(payload)
        this.$store.commit('saveWidgetSettings', payload);
      },
      getcolorfordata: function(value){
        var thresholds = this.selectedinstr.ryg
        var check= thresholds.filter(function(e){
          return (value>=e.min & value<=e.max)})
        if(check.length==1){
          return check[0].color
        }else {
          return "white"
        }
      },
      // generateNotification() {
      //   let finalDataPoint = this.weeklydata[this.weeklydata.length - 1];
      //   let note = "";
      //   let peakValue = 0;
      //   if(finalDataPoint > this.datasettings.notifythresh) {
      //     note = " was reported at " + finalDataPoint + " in the last 24 hours.";
      //     this.$emit("alert", note);
      //     return;
      //   }
      //
      //   for(let i = 1; i <= 4; i++) {
      //     let currentValue = this.weeklydata[this.weeklydata.length - i];
      //     if(currentValue < this.datasettings.notifythresh / 2 + 1) {
      //       return;
      //     }
      //     if(currentValue > peakValue) {
      //       peakValue = currentValue;
      //     }
      //   }
      //   console.log("the final data point is " + finalDataPoint);
      //   note = " has been elevated in the last 24 hours.";
      //   this.$emit("alert", note);
      // }
    },
  }
</script>

<style scoped>
  .widgetcontainer{
    width:100%;
    height:100%;
    background-color: #e5e5e5;
  }
  .widgetalert{
    height: 20px;
    background-color: white;
  }
  .graph {
    padding-top: 5px;
    margin:0 auto;
    background-color: white;
  }

  .graph .edit {
    width: 25px;
    height: 25px;
    margin: 0;
    padding: 0;
    position: absolute;
    top: 0;
    right: 8px;
    background: none;
  }

  .edit img {
    height: 25px;
    width: 25px;
  }

  .graph .save {
    font-size: 1em;
    margin: 1em auto;
    width: 10em;
    padding: 0.5ex 1ex;
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
    width:100%;
  }

  .optrow {
    padding: 12px 10px;
    clear: both;
  }
  .widgetalertdisplay {
      height:130px;
      background-color: #fff;
      margin:15px 0px;
      overflow: auto;
      padding:10px 15px;
      text-align: left;
      text-transform: none;
  }
  .notesdisplay {
      height:150px;
      background-color: #fff;
      margin:15px 0px 0px 0px;
      border: none;
      overflow: auto;
      padding:10px 15px;
      text-align: left;
      text-transform: none;
  }
.thres {
  display:inline-block;
  min-width:33%;
  text-align: center;
  color: #fff;
}
.thres.green {
  background-color: green
}
.thres.orange {
  background-color: orange
}
.thres.red {
  background-color: red
}
</style>
