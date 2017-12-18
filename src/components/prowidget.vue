<template name="prowidget">
  <div class="widgetcontainer">
    <div v-if="!editmode" >
    <div class="widgetalert" v-if="!maximized ">
      <div class="ft-sz-12 pad-l-8" >
        <span>{{selectedinstr.unit}}</span>
        <i v-if="hasalert"  @click='maximizeWidget' class="fa fa-exclamation-circle warning pad-l-5"></i>
        <i v-if="hasnotes"  @click='maximizeWidget' class="fa fa-file-text-o notes pad-l-5"></i>
      </div>
    </div>
    <div v-if="maximized" class="widgetalertdisplay">
      <span class="pad-l-15" v-if='hasalert'> ALERT </span>
      <span class='pad-l-15' v-else> No alert. </span>
      <ul>
        <li v-for='alert in allalert'>
          <span class="fa fa-exclamation-circle warning pad-l-5"></span><span class="pad-l-5" style="font-weight:700;"> {{alert.text}}</span></li>
    </ul>
    </div>
  </div>
  <div class="graph">
    <div class='row ' v-if="maximized" >
      <div class="col-md-5 col-sm-5 ft-sz-18">
        <span class='pad-l-35'>{{selectedinstr.unit}}</span>
        <div class=" pad-l-10 ft-sz-12" style="display: inline-block; width:150px;" v-if='selectedinstr'>
          <div v-for='range in selectedinstr.ryg' class="thres" :class="range.color">
            <span v-if='range.min<range.max'>{{range.min}}-{{range.max}}</span>
            <span v-else>{{range.min}}</span>
          </div>
        </div>
      </div>
      <div class="col-md-3 col-sm-3 txtcenter ">
      </div>
      <div class="col-md-4 col-sm-4">
        <div class="float-r inline" >
          <span class= "ft-sz-12 pad-r-10">Patient Report Frequency: {{selectedfreq}}</span>
        </div>
      </div>
    </div>
    <linechartmax v-if="!editmode && maximized " class='max' :chart-data="datacollection" :options="maxchartOption" :styles='myStyles'></linechartmax>
    <linechart v-if="!editmode && !maximized" :chart-data="datacollection" :options="chartOptions" :styles='myStyles'></linechart>
    <div v-if="editmode">
      <div class="optrow">
        <div class="optionslabel">
          Instrument
        </div>
        <div class="options instru">
          <select v-model="selectedinstrname" :class="{attn:!object.sel}">
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
          {{custfreq}}
          <!-- <select v-model="custfreq" disabled>
            <option v-for="freq in freqops" v-bind:value="freq.label">
              {{ freq.label }}
            </option>
          </select> -->
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
    <span class="pad-l-15" v-if='hasnotes'> PATIENT NOTES </span>
    <span class='pad-l-15' v-else> Patient has not posted any notes yet. </span>
    <ul>
      <li v-for='note in allnotes' >
        <span class="fa fa-file-text-o notes pad-l-5"></span><span class="pad-l-5" style="font-style:italic;">{{formatted(note.date*1000)}} - {{note.note}}</span></li>
      </ul>
  </div>
</div>
</template>
<script>
  import linechart from './linechart.js';
  import linechartmax from './linechart.js';
  export default {
    props: ['chartheight', 'editmode', 'viewmode', 'object', 'title','patientid', 'maximized'],
    components: {
      linechart,
      linechartmax
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
                },
              ticks: {
                min: 0,
                max: 10,
                stepSize:1,
                maxTicksLimit: 6
              },
              gridLines: {
                display: true,
                color: '#f2f2f2',
                lineWidth: 2,
                drawBorder: false,
                drawTicks:false,
                tickMarkLength:8
              }
            }],
            xAxes: [{
              type:'time',
              display: true,
              offset: true,
              scaleLabel: {
                display: false,
              },
              time: {
                unit: 'day',
                round: 'day',
                displayFormats: {
                  day: 'ddd'
                },
                stepSize:1,
                tooltipFormat: 'MMMM Do YYYY'
              },
              ticks: {
                maxTicksLimit: 8,
                // source:'labels'
              },
              gridLines: {
                display: true,
                color: '#f2f2f2',
                lineWidth: 1,
                drawBorder: false,
                drawTicks:true,
                tickMarkLength:5
              }
            }]
          }
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
        this.chartOptions.scales.yAxes[0].ticks.stepSize = this.selectedinstr.range.step
        this.chartOptions.scales.yAxes[0].scaleLabel.labelString = this.selectedinstr.unit
      }else{
        if(this.object.selindex!=-1){
          this.selectedinstrname = this.object.instruments[this.object.selindex].name;
        }else {
          if(this.object.instruments.length==1){
            this.selectedinstrname = this.object.instruments[0].name;
          }
        }
        if(this.selectedinstrname!=""){
          this.custfreq = this.selectedfreq
          this.chartOptions.scales.yAxes[0].ticks.min = this.selectedinstr.range.min
          this.chartOptions.scales.yAxes[0].ticks.max = this.selectedinstr.range.max
          this.chartOptions.scales.yAxes[0].ticks.stepSize = this.selectedinstr.range.step
          this.chartOptions.scales.yAxes[0].scaleLabel.labelString = this.selectedinstr.unit
        }
      }
    },
    updated:function(){
      if(this.$route.params.id){
      const obj = {"id":this.$route.params.id,"group":this.currentGroup.id,"wid": this.object.id};
      if (this.$store.getters.getDataSettings(obj)) {
        this.datasettings = Object.assign({}, this.$store.getters.getDataSettings(obj).datasettings);
        this.selectedinstrname = this.datasettings.selectedinstrument.name;
        this.custfreq = this.selectedfreq
        this.chartOptions.scales.yAxes[0].ticks.min = this.selectedinstr.range.min
        this.chartOptions.scales.yAxes[0].ticks.max = this.selectedinstr.range.max
        this.chartOptions.scales.yAxes[0].ticks.stepSize = this.selectedinstr.range.step
        this.chartOptions.scales.yAxes[0].scaleLabel.labelString = this.selectedinstr.unit
      }else{
        if(this.object.selindex!=-1){
          this.selectedinstrname = this.object.instruments[this.object.selindex].name;
        }else {
          if(this.object.instruments.length==1){
            this.selectedinstrname = this.object.instruments[0].name;
          }else {
            this.selectedinstrname=""
          }
        }
        if(this.selectedinstrname!=""){
          this.custfreq = this.selectedfreq
          this.chartOptions.scales.yAxes[0].ticks.min = this.selectedinstr.range.min
          this.chartOptions.scales.yAxes[0].ticks.max = this.selectedinstr.range.max
          this.chartOptions.scales.yAxes[0].ticks.stepSize = this.selectedinstr.range.step
          this.chartOptions.scales.yAxes[0].scaleLabel.labelString = this.selectedinstr.unit
        }
      }
    }
    },
    beforeDestroy() {
  	 this.$eventBus.$off("saveSettings");
     },
    watch: {
      selectedinstrname: function(){
        var stat={id:this.object.id,sel:false,selindex:-1}
        if(this.selectedinstrname!=""){
          this.custfreq = this.selectedfreq
          this.chartOptions.scales.yAxes[0].ticks.min = this.selectedinstr.range.min
          this.chartOptions.scales.yAxes[0].ticks.max = this.selectedinstr.range.max
          this.chartOptions.scales.yAxes[0].ticks.stepSize = this.selectedinstr.range.step
          this.chartOptions.scales.yAxes[0].scaleLabel.labelString = this.selectedinstr.unit
          this.datasettings.selectedinstrument = this.selectedinstr
          this.datasettings.sendnotification = this.sendnotification
          stat.sel=true
          stat.selindex=this.selectedinstrindex
        }
        this.$emit('instrselected',stat)
      },
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
    computed : {
      todaysdow:function(){
        return this.$moment.unix(this.today).day()
      },
      maxchartOption:function(){
        var op = JSON.parse(JSON.stringify(this.chartOptions))
        op.scales.xAxes[0].time.stepSize=7;
        return op
      },
      hasalert:function(){
        var b= false;
        this.allalert.forEach(function(e){
          b = b || (e.checked==false)
        })
        return b
      },
      today:function(){
        return this.$store.getters.gettoday
      },
      thisweek:function(){
        return this.$store.getters.gettoday
      },
      hasnotes: function(){
        return this.allnotes.length>0
      },
      daterange:function(){
        return this.$store.getters.getcurrentdaterange
      },
      initdate:function(){
  			if(this.$route.params.id=='PA-67034-007'){
  				return	this.$moment.unix(this.today).day(-7*7).startOf('day').unix()
  			}else {
  				return	this.$moment.unix(this.today).day(-11*7).startOf('day').unix()
  			}
  		},
      alldata:function(){
        var self=this;
        var data = JSON.parse(JSON.stringify(this.$store.getters.getPatientData(this.patientid)[this.object.id + "-data"]));
        // console.log(data)
        if(data){
          data.forEach(function(e){
            e.date=self.$moment().add(e.dateOffset, 'd').unix();
          })
          if(this.viewmode){
            return data
          }else {
            return []
          }
        }else {
          return []
        }
      },
      allnotes:function(){
        var self=this;
        var data = [];
        if(this.object && this.viewmode){
          var d = JSON.parse(JSON.stringify(this.$store.getters.getPatientData(this.patientid)))
          if(d[this.object.id + "-notes"]){
            data = d[this.object.id + "-notes"]
            data.forEach(function(e){
              e.date=self.$moment().add(e.date, 'd').unix();
           })
         }
       }
       return data
      },
      allalert:function(){
        var self=this;
        var data = [];
        if(this.object && this.viewmode){
          data = JSON.parse(JSON.stringify(this.$store.getters.getpatientalert(this.object.id)))
          if(data){
            data.forEach(function(e){
              e.date=self.$moment().add(e.date, 'd').unix();
           })
         }
       }
       return data
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
      selectedinstrindex: function(){
        if(this.selectedinstrname!=""){
          var index = this.instruments.map(function(e){return e.name}).indexOf(this.selectedinstrname)
          if(index!=-1){
            return index
          }else {
            return -1
          }
        } else {
          return -1
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
        datasets: [
          {
            data: this.displaydata.values,
            backgroundColor:'rgba(255, 255, 255, 1)',
            fill: false,
            lineTension: 0,
            borderColor: '#bfbfbf',
            pointBorderColor: this.displaydata.colors,
            pointBorderWidth: 3,
            pointStyle: 'circle',
            pointRadius: 4,
            pointHitRadius: 4,
            borderWidth: 2,
            spanGaps: true
          }
        ]
      };
      return obj
    },
    displaydata: function(){
      var obj={values:[],labels:[],colors:[]};
      var self = this;
      var dp = 14/self.selectedinstr.bwfreq;              // If all data frequency is daily
      if(this.alldata.length>0){
        this.alldata.forEach(function (el,index) {
          var nth=Math.round(Math.round(index/dp)*dp)-index;           // If all data frequency is daily
          if(el.date > self.daterange.starttime && el.date < self.daterange.endtime) {
            var v = {};
            v.x=self.$moment.unix(el.date);
            if(nth==0){                                    // If all data frequency is daily
              v.y=el.value;
              obj.values.unshift(v);
              obj.colors.unshift(self.getcolorfordata(v.y));
            } else {
              v.y=null;
              obj.values.unshift(v);
              obj.colors.unshift(null);
            }
          }
        });
        let i = obj.values.length % 7;
        let numlabels = 8;
        if( this.maximized | (!this.maximized && obj.values.length<7)) {
          for(let j = i; j < numlabels; j++) {
            var v={};
            v.x=this.$moment.unix(this.alldata[0].date + 86400 * (j-i));
            v.y=null
            obj.values.push(v);
            obj.colors.push(null);
          }
        }
    }
        return obj
      }
    },
    methods: {
      maximizeWidget:function(){
        this.$emit("maximizeme",this.object.id)
      },
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
  .widgetalert i{
    cursor:pointer;
  }
  .graph {
    padding-top: 5px;
    margin:0 auto;
    background-color: white;
  }
  .graph.max{
    margin-top:15px;
  }
  .instru select.attn{
    border: 1px dashed red;
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
      height:120px;
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
div.min {
  min-width:240px;
  max-width:300px;
  display:inline-block;
}
.thres.green {  background-color: green }
.thres.orange {  background-color: orange }
.thres.red {  background-color: red }
</style>
