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
            <button v-on:click="prevWidget">◀</button>
            <div style="display:inline-block">
              <select v-model="currentWidget">
                <option v-for="w in wlist.widgets" v-bind:value="wlist.widgets.indexOf(w)">
                  {{w.label}}
                </option>
              </select>
            </div>
            <button v-on:click="nextWidget(wlist.widgets.length)">▶</button>
            Period length (days):
            <input v-model.number="period" type="number"/>
            Trending:
            <select v-model="trend">
              <option>Up</option>
              <option>Down</option>
            </select>
            Variance:
            <vue-slider ref="variance" v-model="variance" v-bind="varianceSlider"></vue-slider>
            Range:
            <vue-slider ref="range" v-model="range" v-bind="rangeSlider"></vue-slider>
            <button v-on:click="randomizePROData(wlist.patientID, widget)">Randomize This Widget</button>
            <button v-on:click="randomizeAllPROData(wlist.patientID, wlist.widgets)">Randomize All Widgets</button>
            <label style="margin: 1em 0 0 2em; padding: 0; display: block;">
              Connect neighbors: <input type="checkbox" id="connected" v-model="connected">
            </label>

            <div style="width:1120px; margin-left:2em;">
              <div v-for="n in numdays" style="display:inline-block; width:40px; margin-bottom: 1em; text-align:center;">
                <vue-slider ref="sliders" v-model="chartdata[wlist.patientID][widget.id + '-data'][n - 1].value" v-bind="dataSliders" v-on:drag-end="magnetize(wlist.patientID, widget, n - 1)"></vue-slider>
                {{n}}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </applayout>
</template>

<script>
  import vueSlider from 'vue-slider-component';
  import applayout from "./applayout.vue";

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
        variance: 15,
        range: [0, 10],
        trend: "Up",
        connected: false,
        selectedWidget: "",
        dataSliders: {
          eventType: "auto",
          width: 6,
          height: 200,
          direction: "vertical",
          min: -1,
          max: 10,
          interval: 1,
          disabled: false,
          show: true,
          piecewise: false,
          tooltip: "hover",
          tooltipDir: "right",
          style: {
            "display": "block",
            "margin": "auto",
            "width":"20px"
          }
        },
        varianceSlider: {
          width: 100,
          height: 6,
          min: 1,
          max: 30,
          style: {
            "display": "inline-block",
            "top": "4px"
          }
        },
        rangeSlider: {
          width: 100,
          height: 6,
          min: -1,
          max: 10,
          style: {
            "display": "inline-block",
            "top": "4px"
          }
        }

      }
    },
    created: function() {
      let that = this;
      this.widgetLists.forEach(function(widgetList) {
        that.chartdata[widgetList.patientID] = {};
        that.randomizeAllPROData(widgetList.patientID, widgetList.widgets);
        that.randomizeAllSMData(widgetList.patientID, widgetList.smWidgets);
      });
    },
    computed : {
      patientNameList () {
        let patientNames = [];
        const patients = this.$store.getters.getPatientMasterList;
        patients.forEach(function (patient) {patientNames.push(patient.name)});
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
                widgetProps.push({"id": widget.id, "label": widget.label})
              } else {
                smWidgets.push({"id": widget.id, "label": widget.label})
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
      prevWidget() {
        this.currentWidget --;
        if(this.currentWidget < 0) {
          this.currentWidget = 0;
        }
      },
      nextWidget(maxWidgets) {
        this.currentWidget++;
        if(this.currentWidget >= maxWidgets) {
          this.currentWidget = maxWidgets - 1;
        }
      },
      randomizePROData(patientID, widget) {
        let rand, priorVal;
        let recordDate = this.$moment();
        const periodNum = this.period;
        for(let i = 0; i < this.numdays; i++) {
          if(this.chartdata[patientID][widget.id + "-data"] === undefined) {
            this.chartdata[patientID][widget.id + "-data"] = [];
          }

          if(periodNum > 0) {
            if(this.trend === "Up") {
              priorVal = this.range[0] + (Math.round((i % periodNum)/(periodNum/this.range[1])));
            } else {
              priorVal = this.range[1] - (Math.round((i % periodNum) / (periodNum
                  / this.range[1])));
            }
            rand = this.getRandomPeriodicValue(priorVal);

          } else {
            if(i === 0) {
              priorVal = 0;
            }
            rand = this.getRandomPROValue(priorVal);
            priorVal = rand;
          }

          // Add note generation here
          this.chartdata[patientID][widget.id + "-data"][i] = ({'value': rand, 'note': '', 'date':recordDate.unix()});
          recordDate = this.$moment(recordDate.subtract(1, 'd'));
          if(this.$refs.sliders !== undefined && this.$refs.sliders[i]) {
            this.$refs.sliders[i].setValue(rand);
          }
        }
      },
      randomizeAllPROData(patientID, widgets) {
        let that = this;
        widgets.forEach(function(widget) {
          that.randomizePROData(patientID, widget);
        });
      },
      getRandomPROValue(priorVal) {
        // Wiener process-style random walk from the prior value biased towards the bottom of the scale
        let val = Math.round((Math.random() * Math.random() - 0.3) * this.variance) + priorVal;
        if(val > this.range[1]) {
          return this.range[1];
        }
        if(val < this.range[0]) {
          return this.range[0];
        }
        return val;
      },
      getRandomPeriodicValue(periodFactor) {
        let val = Math.round((Math.random() * Math.random() - 0.3) * this.variance) + periodFactor;
        if(val > this.range[1]) {
          return this.range[1];
        }
        if(val < this.range[0]) {
          return this.range[0];
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
          this.$refs.sliders[(index - 1)].setValue(leftVal);
          this.$refs.sliders[(index + 1)].setValue(rightVal);
        }
      },
      randomizeAllSMData(patientID, smWidgets) {
        let that = this;
        smWidgets.forEach(function(widget){
          let recordDate = that.$moment();
          that.chartdata[patientID][widget.id + "-data"] = [];
          for(let i = 0; i < that.numdays; i++) {
            that.chartdata[patientID][widget.id + "-data"][i] ={'value' :Math.floor(Math.random() * 2 + 1), 'note': '', 'date':recordDate.unix()}
            recordDate = that.$moment(recordDate.subtract(1, 'd'));
          }
        });
      },
      saveData() {
        const basedataurl = 'http://localhost:3001/patients/';
        let that = this;
        this.widgetLists.forEach(function(wlist){
          that.$http.put(basedataurl + wlist.patientID, that.chartdata[wlist.patientID]);
        });

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
</style>
