<template name="datagenerator">
  <applayout>
    <div slot="main" style="margin: 2em">
      <div class="plist">
        <span v-for="(w,index) in widgetLists" v-on:click="selectpatient(index)" class="pbutton">{{w.patientName}}</span>
      </div>
      <div v-for="(wlist, index) in widgetLists" v-if="wlist.patientID === currentpid">
        <hr/>
        <span class="pname">{{wlist.patientName}}</span>
        Days of data: <input v-model.number="numdays" type="number" placeholder="Number of days:" class="dayInput"/>
        <button v-on:click="saveData">Save Data</button>
        <br>
        <div v-for="(widget, index) in wlist.widgets" style='margin:35px 0px; padding-left: 25px;border-left:5px solid #853754' v-if="index === currentWidget">
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
                <vue-slider ref="sliders" v-model="chartdata[currentdataindex][widget.id + '-data'][index].v"
                            v-bind="dataSliders" :min="widget.range[0]" :max="widget.range[1]" :interval="widget.inc" v-on:drag-end="magnetize(wlist.patientID, widget, index)"></vue-slider>
                {{index}}
              </div>
            </div>
        </div>
        <div style='margin:35px 0px; padding-left: 25px;border-left:5px solid #20657e'>
        <div class="smcontainer" v-for="(smwidget,index) in wlist.smWidgets" @click='currentsmindex=index'>
           <h5>{{smwidget.label}}</h5>
          </div>
          <div v-if='currentsmindex!=-1'>
            <ul>
              <li v-for='(m,mindex) in wlist.smWidgets[currentsmindex].modulecount'>
                Module {{m}}: <input type='number' v-model.number="chartdata[currentdataindex][wlist.smWidgets[currentsmindex].id + '-data'][mindex].d" :min='-numdays'/>
              </li>
            </ul>
          </div>
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
        currentpid:"",
        currentWidget:0,
        currentsmindex:-1,
        chartdata: {},
        numdays: 30,
        period: 0,
        initVal: 0,
        variance: 15,
        generateRange: [0, 10],
        trend: "Up",
        bias: 0.25,
        connected: false,
        showAllData: false,
        selectedWidget: "",
        newpatient:true,
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
      let self = this;
			var getprodata = this.$http.get("./static/json/db.json")
			var getsimudata = this.$http.get("./static/json/simudata.json")
			this.$http.all([getprodata, getsimudata]).then(this.$http.spread(function(prodata,simudata) {
        self.chartdata =[]
        self.widgetLists.forEach(function(e){
          var datapack = prodata.data.patients.filter(function(de){return de.id==e.patientID})
          var obj =self.getDataObj(e.patientID)
          if(datapack.length>0){
            obj=JSON.parse(JSON.stringify(datapack[0]))
          }
          self.chartdata.push(obj)
        })
			}));
    },
    computed : {
      basedataurl (){
        return this.$store.getters.getbaseurl+':3001/patients/'
      } ,
      currentdataindex:function(){
        return this.chartdata.map(function(e){return e.id}).indexOf(this.currentpid)
      },
      currentwidgetList:function(){
          var self =this;
          var ws = this.widgetLists.filter(function(e){return e.patientID==self.currentpid})
          console.log(ws)
          return ws[0]
      },
      widgetLists () {
        const patientList = this.$store.getters.getPatientMasterList;
        let widgetList = [];
        let self = this;
        patientList.forEach(function (patient) {
          if(patient.id) {
            let widgets = self.$store.getters.getwidgetlistbypatient(patient);
            let widgetProps = [];
            let smWidgets = [];
            widgets.forEach(function(widget) {
              if(widget.type === "PRO" | widget.type==='TRO') {
                widgetProps.push({
                  "id": widget.id,
                  "label": widget.label,
                  "range": [widget.instruments[0].range.min, widget.instruments[0].range.max],
                  "inc": widget.instruments[0].range.inc,
                  "freq": widget.instruments[0].bwpoints
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
    watch:{
      numdays:function(){
        var self = this;
        var dindex = this.chartdata.map(function(e){return e.id}).indexOf(this.currentpid)
        var dobj = JSON.parse(JSON.stringify(this.chartdata[dindex]))
        var idx = this.widgetLists.map(function(e){return e.patientID}).indexOf(this.currentpid)
        this.widgetLists[idx].widgets.forEach(function(e){
          var wid = e.id+'-data'
          if(dobj[wid].length<self.numdays){
            console.log(wid+"   ===  "+dobj[wid].length)
            for(var j=dobj[wid].length; j<self.numdays; j++){
                  var dtemplate ={v:0,d:0}
                  dtemplate.d=-j
                  console.log(dtemplate)
                  self.chartdata[dindex][wid].push(dtemplate)
            }
          }
        })
      }
    },
    mounted () {
      this.$store.commit('setScreenname','Data Generator')
    },
    methods: {
      getDataObj:function(id){
        var obj = {};
        obj.id=id;
        var idx = this.widgetLists.map(function(e){return e.patientID}).indexOf(id)
        this.widgetLists[idx].widgets.forEach(function(e){
          var wid = e.id+'-data'
          obj[wid]=[]
        })
        this.widgetLists[idx].smWidgets.forEach(function(e){
          var wid = e.id+'-data'
          obj[wid]=[]
        })
        return obj
      },
      selectpatient:function(i){
        var self = this;
        var pid = this.widgetLists[i].patientID
        var dindex = this.chartdata.map(function(e){return e.id}).indexOf(pid)
        var dobj = JSON.parse(JSON.stringify(this.chartdata[dindex]))
        var idx = this.widgetLists.map(function(e){return e.patientID}).indexOf(pid)
        this.widgetLists[idx].widgets.forEach(function(e){
          var wid = e.id+'-data'
          if(dobj[wid].length<self.numdays){
            console.log(wid+"   ===  "+dobj[wid].length)
              for(var j=dobj[wid].length; j<self.numdays; j++){
                  var dtemplate ={v:0,d:0}
                  dtemplate.d=-j
                  self.chartdata[dindex][wid].push(dtemplate)
              }
            }
      })
      this.widgetLists[idx].smWidgets.forEach(function(e){
        var wid = e.id+'-data'
        var count = e.modulecount
        if(dobj[wid].length<count){
          console.log(wid+"   ===  "+dobj[wid].length)
            for(var j=0; j<count; j++){
                var dtemplate ={v:j+1,d:10}
                self.chartdata[dindex][wid].push(dtemplate)
            }
          }
        })
      this.currentpid = this.widgetLists[i].patientID
      this.currentsmindex=-1
      this.currentWidget=0;
      this.$http.get(this.basedataurl+this.currentpid).then(function(resp){
        self.newpatient=false
      }).catch(function(err){
          self.newpatient=true
      })
    },
      prevWidget(widget) {
        this.currentWidget --;
        if(this.currentWidget < 0) {
          this.currentWidget = 0;
        } else {
          this.generateRange = widget.range;
          this.initVal = widget.range[0]
        }
      },
      nextWidget(widget, maxWidgets) {
        this.currentWidget++;
        if(this.currentWidget >= maxWidgets) {
          this.currentWidget = maxWidgets - 1;
        } else {
          this.generateRange = widget.range;
          this.initVal = widget.range[0]
        }
      },
      randomizePROData(patientID, widget) {
        let rand, priorVal;
        let dateOffset = 0;
        const periodNum = this.period;
        for(let i = 0; i <= this.numdays; i++) {
          if(this.chartdata[this.currentdataindex][widget.id + "-data"] === undefined) {
            this.chartdata[this.currentdataindex][widget.id + "-data"] = [];
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
          rand=Math.round(rand/widget.inc)*widget.inc
          if(widget.inc<1){
            rand=Math.round(rand*10)/10
          }else {
            rand=Math.round(rand)
          }
          this.chartdata[this.currentdataindex][widget.id + "-data"][i] = ({
            'v': rand,
            'd': dateOffset
          });
          dateOffset--;
          if(this.$refs.sliders !== undefined && this.$refs.sliders[i]) {
            this.$refs.sliders[i].setValue(rand);
          }
        }
      },
      randomizeAllPROData(patientID, widgets) {
        let self = this;
        widgets.forEach(function(widget) {
          self.generateRange = widget.range;
          self.randomizePROData(patientID, widget);
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
          let sliderVal = (this.chartdata[this.currentdataindex][widget.id + "-data"][index].v ? this.chartdata[this.currentdataindex][widget.id + "-data"][index].v : 0);
          let leftVal = this.chartdata[this.currentdataindex][widget.id + "-data"][index - 1].v;
          let rightVal = this.chartdata[this.currentdataindex][widget.id + "-data"][index + 1].v;
          leftVal = this.chartdata[this.currentdataindex][widget.id + "-data"][index - 1].v = Math.round(((leftVal ? leftVal : 0)
              + sliderVal) / 2);
          rightVal = this.chartdata[this.currentdataindex][widget.id + "-data"][index + 1].v = Math.round(((rightVal ? rightVal : 0)
              + sliderVal) / 2);
          if(this.$refs.sliders[(index - 2)] !== undefined) {
            this.$refs.sliders[(index - 2)].setValue(leftVal);
          }
          if(this.$refs.sliders[(index)] !== undefined) {
            this.$refs.sliders[(index)].setValue(rightVal);
          }
        }
      },
      saveData() {
        let self = this;
        this.currentwidgetList.widgets.forEach(function(e){
          var wid = e.id+'-data'
          self.chartdata[self.currentdataindex][wid].splice(self.numdays)
        })
        if(this.newpatient){
          this.$http.post(this.basedataurl, this.chartdata[this.currentdataindex]).then(function(resp){
            console.log(resp)
          });
        }else {
          this.$http.put(this.basedataurl+this.currentpid, this.chartdata[this.currentdataindex]).then(function(resp){
            console.log(resp)
          });
        }
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
  hr {    margin: 10px auto;  }
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
