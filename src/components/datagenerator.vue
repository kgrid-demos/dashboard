10<template name="datagenerator">
  <applayout>
    <div slot="main" style="margin: 2em">
      Days of data: <input v-model.number="numdays" type="number" placeholder="Number of days:" class="dayInput"/>
      <button v-on:click="saveData">Save Data</button>
      <br>
      <div class="plist">
        <span v-for="patientName in patientNameList" v-on:click="currentPatient = patientName" class="pbutton">{{patientName}}</span>
      </div>
      <div v-for="(wlist, index) in widgetLists" v-if="wlist.patientName === currentPatient">
        <hr/>
        <span class="pname">{{wlist.patientName}}</span>
        <div v-for="(widget, index) in wlist.widgets">

          <div v-if="index === currentWidget">
            <button v-on:click="prevWidget(wlist.widgets[index - 1])">◀</button>
            <div style="display:inline-block">
              <select v-model="currentWidget">
                <option v-for="w in wlist.widgets" v-bind:value="wlist.widgets.indexOf(w)">
                  {{w.label}}
                </option>
              </select>
            </div>
            <button v-on:click="nextWidget(wlist.widgets[index + 1], wlist.widgets.length)">▶</button>
            Period length (days):
            <input v-model.number="period" type="number"/>
            Trending:
            <select v-model="trend">
              <option>Up</option>
              <option>Down</option>
            </select>
            Variance:
            <vue-slider ref="variance" v-model="variance" v-bind="varianceSlider"></vue-slider>
            Bias:
            <vue-slider ref="bias" v-model="bias" v-bind="biasSlider"></vue-slider>
            Starting value:
            <input v-model.number="initVal" style="width:4em;" :placeholder="widget.range[0]" :min="widget.range[0]" :max="widget.range[1]" :step="widget.inc" type="number"/>
            Range:
            <vue-slider ref="range" v-model="generateRange" v-bind="rangeSlider" :min="widget.range[0]" :max="widget.range[1]"></vue-slider>

            <button v-on:click="randomizePROData(wlist.patientID, widget)">Randomize This Widget</button>
            <button v-on:click="randomizeAllPROData(wlist.patientID, wlist.widgets)">Randomize All Widgets</button>

            <div style="margin: 1em 0 0 2em; padding: 0;">
              <label>
                Connect neighbors: <input type="checkbox" id="connected" v-model="connected">
              </label>
              <label>
                Show all data points: <input type="checkbox" id="showAllData" v-model="showAllData">
              </label>
            </div>
            <div style="width:1400px; margin-left:2em;">
              <div v-for="(n,index) in numdays" v-if="showpoint(index, widget.freq) || showAllData" style="display:inline-block; width:50px; margin-bottom: 1em; text-align:center;">
                <vue-slider ref="sliders" v-model="chartdata[wlist.patientID][widget.id + '-data'][index].value"
                            v-bind="dataSliders" :min="widget.range[0]" :max="widget.range[1]" :interval="widget.inc" v-on:drag-end="magnetize(wlist.patientID, widget, index)"></vue-slider>
                {{index}}
              </div>
            </div>
          </div>
        </div>
        <div class="smcontainer" v-for="smwidget in wlist.smWidgets">
          <h5>{{smwidget.label}}</h5> <br>
          <span class="smvals" v-for="(dpoint, n) in chartdata[wlist.patientID][smwidget.id + '-data']" @click="toggleSMVal(wlist.patientID, smwidget, dpoint, n)">{{convertSMVal(chartdata[wlist.patientID][smwidget.id + '-data'][n].value)}} </span>
        </div>
      </div>
    </div>
  </applayout>
</template>

<script>
  import vueSlider from 'vue-slider-component';
  import applayout from "./applayout.vue";
  import Vue from 'vue';

  export default {
    components: {
      applayout,
      vueSlider
    },
    data () {
      return {
        currentPatient: "",
        currentWidget:0,
        chartdata: {},
        numdays: 90,
        period: 0,
        initVal: 0,
        variance: 15,
        generateRange: [0, 10],
        trend: "Up",
        bias: 0.25,
        connected: false,
        showAllData: false,
        selectedWidget: "",
        dataSliders: {
          eventType: "auto",
          width: 6,
          height: 200,
          direction: "vertical",
          disabled: false,
          show: true,
          piecewise: false,
          tooltip: "hover",
          tooltipDir: "top",
          style: {
            "display": "block",
            "margin-left": "14px",
            "width":"50px"
          }
        },
        varianceSlider: {
          width: 100,
          height: 6,
          min: 1,
          max: 50,
          style: {
            "display": "inline-block",
            "top": "4px"
          }
        },
        rangeSlider: {
          width: 100,
          height: 6,
          style: {
            "display": "inline-block",
            "top": "4px"
          }
        },
        biasSlider: {
          width: 100,
          height: 6,
          min: 0,
          max: 0.5,
          interval: 0.05,
          style: {
            "display": "inline-block",
            "top": "4px"
          }
        },
      }
    },
    created: function() {
      let that = this;
      this.widgetLists.forEach(function(widgetList) {
        that.chartdata[widgetList.patientID] = {};
        widgetList.widgets.forEach(function (widget){
          that.chartdata[widgetList.patientID][widget.id + "-data"] =
              JSON.parse(JSON.stringify(that.$store.getters.getPatientData(widgetList.patientID)[widget.id + "-data"]));
        });

//        that.randomizeAllPROData(widgetList.patientID, widgetList.widgets);
//        that.randomizeAllSMData(widgetList.patientID, widgetList.smWidgets);
      });
    },
    computed : {
      patientNameList () {
        let patientNames = [];
        const patients = this.$store.getters.getPatientMasterList;
        patients.forEach(function (patient) {
          if(patient.id !== "PA-67034-004") {
            patientNames.push(patient.name)
          }
        });

        return patientNames;
      },
      widgetLists () {
        const patientList = this.$store.getters.getPatientMasterList;
        let widgetList = [];
        let that = this;
        patientList.forEach(function (patient) {
          if(patient.id) {
            let widgets = that.$store.getters.getwidgetlistbypatient(patient);
            let widgetProps = [];
            let smWidgets = [];
            widgets.forEach(function(widget) {
              if(widget.type === "PRO") {
                widgetProps.push({
                  "id": widget.id,
                  "label": widget.label,
                  "range": [widget.instruments[0].range.min, widget.instruments[0].range.max],
                  "inc": widget.instruments[0].range.inc,
                  "freq": widget.instruments[0].bwfreq
                })
              } else {
                smWidgets.push({
                  id: widget.id,
                  label: widget.label,
                  modulecount: widget.instruments[0].modulecount,
                  inc: widget.instruments[0].inc
                });
              }
            });
            widgetList.push({"patientName":patient.name,
                            "patientID": patient.id,
                            "widgets": widgetProps,
                            "smWidgets": smWidgets});
          }
        });
        return widgetList;
      }
    },
    mounted () {
    },
    methods: {
      prevWidget(widget) {
        this.currentWidget --;
        if(this.currentWidget < 0) {
          this.currentWidget = 0;
        } else {
          this.generateRange = widget.range;
        }
      },
      nextWidget(widget, maxWidgets) {
        this.currentWidget++;
        if(this.currentWidget >= maxWidgets) {
          this.currentWidget = maxWidgets - 1;
        } else {
          this.generateRange = widget.range;
        }
      },
      randomizePROData(patientID, widget) {
        let rand, priorVal;
        let dateOffset = 0;

        const periodNum = this.period;
        for(let i = 0; i <= this.numdays; i++) {
          if(this.chartdata[patientID][widget.id + "-data"] === undefined) {
            this.chartdata[patientID][widget.id + "-data"] = [];
          }

          if(periodNum > 0) {
            if(this.trend === "Up") {
              priorVal = this.generateRange[0] + (Math.round((i % periodNum)/(periodNum/this.generateRange[1])));
            } else {
              priorVal = this.generateRange[1] - (Math.round((i % periodNum) / (periodNum
                  / this.generateRange[1])));
            }
            rand = this.getRandomPeriodicValue(priorVal, widget.inc);

          } else {
            if(i === 0) {
              priorVal = this.initVal;
            }
            rand = this.getRandomPROValue(priorVal, widget.inc);
            priorVal = rand;
          }
          this.chartdata[patientID][widget.id + "-data"][i] = ({
            'value': rand,
            'dateOffset': dateOffset
          });

          dateOffset--;
          if(this.$refs.sliders !== undefined && this.$refs.sliders[i]) {
            this.$refs.sliders[i].setValue(rand);
          }
        }
      },
      randomizeAllPROData(patientID, widgets) {
        let that = this;
        widgets.forEach(function(widget) {
          that.generateRange = widget.range;
          that.randomizePROData(patientID, widget);
        });
      },
      getRandomPROValue(priorVal, inc) {

        // Wiener process-style random walk from the prior value biased towards either the top or bottom the scale
        let val = Math.round(((Math.random() * Math.random() - (0.5 - this.bias)) * this.variance)/inc) * inc + priorVal;
        if(val > this.generateRange[1]) {
          return this.generateRange[1];
        }
        if(val < this.generateRange[0]) {
          return this.generateRange[0];
        }
        return val;
      },
      getRandomPeriodicValue(periodFactor, inc) {
        let val = Math.round((Math.random() * Math.random() - (0.5 - this.bias)) * this.variance) + periodFactor;
        if(val > this.generateRange[1]) {
          return this.generateRange[1];
        }
        if(val < this.generateRange[0]) {
          return this.generateRange[0];
        }
        return val;
      },
      magnetize(patientID, widget, index) {
        if(this.connected) {
          let sliderVal = (this.chartdata[patientID][widget.id + "-data"][index].value ? this.chartdata[patientID][widget.id + "-data"][index].value : 0);
          let leftVal = this.chartdata[patientID][widget.id + "-data"][index - 1].value;
          let rightVal = this.chartdata[patientID][widget.id + "-data"][index + 1].value;
          leftVal = this.chartdata[patientID][widget.id + "-data"][index - 1].value = Math.round(((leftVal ? leftVal : 0)
              + sliderVal) / 2);
          rightVal = this.chartdata[patientID][widget.id + "-data"][index + 1].value = Math.round(((rightVal ? rightVal : 0)
              + sliderVal) / 2);
          if(this.$refs.sliders[(index - 2)] !== undefined) {
            this.$refs.sliders[(index - 2)].setValue(leftVal);
          }

          if(this.$refs.sliders[(index)] !== undefined) {
            this.$refs.sliders[(index)].setValue(rightVal);
          }
        }
      },
      randomizeAllSMData(patientID, smWidgets) {
        let that = this;
        smWidgets.forEach(function(widget){
          let dateOffset = 0;
          let value = 1;
          that.chartdata[patientID][widget.id + "-data"] = [];
          for(let i = 0; i < widget.modulecount; i++) {
            let completed =  Math.floor(Math.random() * 2 + 1);
            if(completed === 2) {
              value = 0;
            }
            dateOffset = dateOffset - (Math.floor(Math.random() * that.numdays + 1) + dateOffset - (widget.modulecount - i));
            that.chartdata[patientID][widget.id + "-data"][i] = {'value': value, 'dateOffset': dateOffset};

          }
        });
      },
      convertSMVal(value) {
        if(value === 0) {
          return '☐';
        }
        return '☑';
      },
      saveData() {
        const basedataurl = 'http://localhost:3001/patients/';
        let that = this;
        this.widgetLists.forEach(function(wlist){
          that.$http.put(basedataurl + wlist.patientID, that.chartdata[wlist.patientID]);
        });

      },
      showpoint (index, freq) {
        let dp = 14/freq;
        return Math.round(index/dp)*dp-index === 0;
      }

    }
  }
</script>

<style scoped>
  button {
    border: 1px solid #373a3c;
    padding: 2px;
  }

  hr {
    margin: 0;
  }

  input {
    border:1px solid black;
    width: 3em;
    padding-left:2px;
  }

  .pname {
    font-weight: bold;
    font-size: 16pt;
  }

  .plist{
    margin: 10px;
    padding: 2px;
    font-size: 12pt;

  }
  .pbutton {
    border:1px solid black;
    margin:3px;
    padding:2px;
    cursor: pointer;
  }
  .smvals {
    font-size: 16pt;
    padding: 0 0 0 2px;
  }
  .smcontainer {
    display: inline-block;
    margin: 4px;
    padding: 1px 6px;
    border: 1px solid gray;
  }
  h5 {
    margin:0;
    padding: 0;
  }
</style>
