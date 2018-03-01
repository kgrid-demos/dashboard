<template name="prowidget">
  <div class="widgetcontainer noselect">
    <div v-if="!editmode" >
    <div class="widgetalert" v-if="!maximized ">
      <div class="ft-sz-11 ft-wt-6 pad-l-8" >
        <span>{{selectedinstr.unit}}</span>
        <i v-if="hasalert"  @click='maximizeWidget' title="Click to view alert" class="fa fa-exclamation-circle warning pad-l-5"></i>
        <i v-if="hasnotes"  @click='maximizeWidget' title="Click to view patient note" class="fa fa-file-alt notes pad-l-5"></i>
        <span class= "float-r pad-r-10">{{selectedfreq}}</span>
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
    <div class='notesdisplay' v-if='maximized'>
      <span class="pad-l-15" v-if='hasnotes'> PATIENT NOTES </span>
      <span class='pad-l-15' v-else> Patient has not posted any notes yet. </span>
      <ul>
        <li v-for='note in allnotes' >
          <span class="fa fa-file-alt notes pad-l-5"></span><span class="pad-l-5" style="font-style:italic;">{{formatted(note.date*1000)}} - {{note.note}}</span></li>
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
      <div class="optrow" data-toggle="tooltip" title="If checked, notifications of every alert will be sent." style='padding:2px 10px; border-top:1px solid #e7e7e7; margin-top:25px;'>
        <div class="optionslabel" style='padding:10px 0px;'>
          Send Notification?
        </div>
        <div class="options">
          <toggle-button id='changed-font' v-model='sendnotification' :labels="{checked: 'YES', unchecked: 'NO'}" :color="{checked: '#853754', unchecked: '#B3B3B3'}" :width='60' :height='20'/>
              <!-- <input type="checkbox" id="checkbox" v-model="sendnotification"> -->
        </div>
      </div>
    </div>
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
                  day: 'MM/DD/YY'
                },
                stepSize:1,
                tooltipFormat: 'MMMM Do YYYY'
              },
              ticks: {
                maxTicksLimit: 8,
                display:true
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
      const obj = {"id":this.$route.params.id,"group":this.currentGroup.id,"wid": this.object.id};
      if(this.object.selindex!=-1){
          this.selectedinstrname = this.instruments[this.object.selindex].name;
      }else {
            this.selectedinstrname = this.instruments[0].name;
      }
      if(this.selectedinstrname!=""){
          this.initChartOption()
        }
    },
    watch: {
      selectedinstrname: function(){
        var stat={id:this.object.id,sel:false,selindex:-1}
        if(this.selectedinstrname!=""){
          this.initChartOption()
          stat.sel=true
          stat.selindex=this.selectedinstrindex
        }
        this.$emit('instrselected',stat)
      },
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
      hasnotes: function(){
        return this.allnotes.length>0
      },
      daterange:function(){
        return this.$store.getters.getcurrentdaterange
      },
      alldata:function(){
        var self=this;
        var data = JSON.parse(JSON.stringify(this.$store.getters.getWidgetData(this.object.id)));
        if(data){
          data.forEach(function(e){
            e.date=self.$moment().add(e.d+7-self.todaysdow, 'd').unix();
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
          data = JSON.parse(JSON.stringify(this.$store.getters.getpatientnotes(this.object.id)))
          if(data){
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
          var freq = this.selectedinstr.bwpoints
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
      var dp = 14/self.selectedinstr.bwpoints;              // If all data frequency is daily
      if(this.alldata.length>0){
        this.alldata.forEach(function (el,index) {
          var nth=Math.round(Math.round(index/dp)*dp)-index;           // If all data frequency is daily
          if(el.date > self.daterange.starttime && el.date <= self.daterange.endtime ) {
            var v = {};
            v.x=self.$moment.unix(el.date);
            var val = false;
            if(el.date<=(self.today+3500)) {
              if(self.object.id=='PRO-07'){
                var dow =self.$moment.unix(el.date).day()
                if(dow==1|dow==5){
                  val=true;
                }
            }else {
              if(nth==0){
                val=true;
              }
            }
          }
          if(val){                                    // If all data frequency is daily
              v.y=el.v;
              obj.values.unshift(v);
              obj.colors.unshift(self.getcolorfordata(v.y));
            } else {
              v.y=null;
              obj.values.unshift(v);
              obj.colors.unshift(null);
            }
          }
        }
      );
      if(this.maximized){
        var v={};
        v.x=this.$moment.unix(this.alldata[0].date + 86400);
        v.y=null
        obj.values.push(v);
        obj.colors.push(null);
      }
    }
        return obj
      }
    },
    methods: {
      initChartOption:function(){
        this.custfreq = this.selectedfreq
        this.chartOptions.scales.yAxes[0].ticks.min = this.selectedinstr.range.min
        this.chartOptions.scales.yAxes[0].ticks.max = this.selectedinstr.range.max
        this.chartOptions.scales.yAxes[0].ticks.stepSize = this.selectedinstr.range.step
        this.chartOptions.scales.yAxes[0].scaleLabel.labelString = this.selectedinstr.unit
      },
      maximizeWidget:function(){
        this.$emit("maximizeme",this.object.id)
      },
      formatted:function(t){
				return this.$moment(t).format("dddd, MMMM Do YYYY, h:mm:ss a");
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
.vue-js-switch#changed-font {
  font-size: 14px;
}
</style>
