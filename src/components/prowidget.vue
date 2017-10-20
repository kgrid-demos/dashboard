<template name="prowidget">
  <div class="graph">
    <linechart v-if="!editmode" :chart-data="datacollection" :options="chartOptions" :styles='myStyles'></linechart>
    <div v-if="editmode">
      <div class="optrow">
        <div class="options">
          Measurement Instrument:
        </div>
        <div class="options">
          <select v-model="datasettings.selectedinstrument.name">
            <option v-for="instrument in datasettings.instruments" v-bind:value="instrument.name">
              {{ instrument.name }}
            </option>
          </select>
        </div>
      </div>
      <div class="optrow">
        <div class="options">
          Daily Frequency:
        </div>
        <div class="options">
          <vue-slider ref="slider" :min=1 :max=4 tooltip="hover" :piecewise=true v-model="datasettings.dailyfreq"></vue-slider>
        </div>
      </div>
      <div class="optrow">
        <div class="options">
          Notification Threshold:
        </div>
        <div class="options">
          <vue-slider ref="slider" :min="datasettings.notifymin" :max="datasettings.notifymax" tooltip="hover" :piecewise=true v-model="datasettings.notifythresh"></vue-slider>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import linechart from './linechart.js';
  import vueSlider from 'vue-slider-component';
  import eventBus from '../eventBus.js';
  import moment from 'moment';
  import axios from 'axios';

  export default {
    props: ['chartheight', 'alldata', 'editmode', 'object', 'title', 'startdate', 'patientid'],
    components: {
      linechart,
      vueSlider
    },
    data () {
      return {
        weeklydata: [],
        weeklylabels: [],
        pointColors: [],
        datacollection: null,
        datasettings: null,
        date: null,
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
      this.date = this.startdate;
      eventBus.$on('setdaterange', function (obj) {
        self.date = obj.startDate;
        self.changeWeek(obj.startDate);
      });
      eventBus.$on('saveSettings', function (obj) {
        self.saveoptions(obj);
      });
      const obj = {"id":this.$route.params.id,"group":this.currentGroup.id,"wid": this.object.id};
      if (this.$store.getters.getDataSettings(obj)) {
        this.datasettings = Object.assign({}, this.$store.getters.getDataSettings(obj).datasettings);
      } else {
        this.datasettings = {
          instruments: [
            { name: "GAD-7 Questionnaire", value: 1},
            { name: "Hilbert-Thad Questionnaire", value: 2},
            { name: "Penta-PLU Pain Probe", value: 3}
          ],
          selectedinstrument: {name: "GAD-7 Questionnaire", value: 1},
          dailyfreq: 1,
          notifythresh: 6,
          notifymin: 6,
          notifymax: 9
        };
      }
    },
    computed : {
    currentGroup:function(){
      return this.$store.getters.getcurrentGroup;
    },
    myStyles () {
     return {
       height: `${this.chartheight}px`,
       position: 'relative'
     }
   }
    },
    mounted () {
      this.changeWeek(null);
    },
    methods: {
      fillData () {
        this.datacollection = {
          labels: this.weeklylabels,
          datasets: [
            {
              label: this.title,
              data: this.weeklydata,
              backgroundColor:'rgba(255, 255, 255, 1)',
              fill: false,
              lineTension: 0,
              borderColor: '#bfbfbf',
              pointBorderColor: this.pointColors,
              pointBorderWidth: 3,
              pointStyle: 'circle',
              pointRadius: 7,
              borderWidth: 2
            }
          ]
        }
      },
      saveoptions:function (obj) {
        var payload  = {'pid': obj.id, "group":obj.group, "wid":this.object.id,'datasettings':this.datasettings}
        this.$store.commit('saveWidgetSettings', payload);
        this.changeWeek(this.date);
      },
      determinecolor() {
        var colors = [];
        var self = this;
        this.weeklydata.forEach( function (e) {
          if (e >= self.datasettings.notifythresh) {
            colors.push('red');
          } else if (e >= self.datasettings.notifythresh / 2 + 1) {
            colors.push('orange')
          }else {
            colors.push('green');
          }
        });
        return colors;
      },
      changeWeek(startdate) {
        this.weeklydata = [];
        this.weeklylabels = [];
        let that = this;
        if (!startdate) {
          startdate = moment().day(0);
        }
        let i = 1;
        this.alldata.forEach(function (el) {

          if(el.date > moment(startdate).subtract(24, 'h').unix() && el.date < moment(startdate).add(154, 'h').unix()) {
            // Inserts only data of the selected frequency into the chart given that the stored data has 4 points per day
            if( (that.datasettings.dailyfreq === 1 && i % 4 === 0) || // Once a day is
                (that.datasettings.dailyfreq === 2 && i % 2 === 0) || // Twice a day
                (that.datasettings.dailyfreq === 3 && i % 4 !== 0) || // Three times per day
                (that.datasettings.dailyfreq === 4)) {                // All four times per day
              that.weeklydata.push(el.value);
              that.weeklylabels.push(moment.unix(el.date).format('MMM. D'));
            }
            i++;
          }
        });
        this.pointColors = this.determinecolor();
        this.fillData();
        this.generateNotification();
      },
      generateNotification() {
        let finalDataPoint = this.weeklydata[this.weeklydata.length - 1];
        let note = "";
        let peakValue = 0;
        if(finalDataPoint > this.datasettings.notifythresh) {
          note = " was reported at " + finalDataPoint + " in the last 24 hours.";
          this.$emit("alert", note);
          return;
        }

        for(let i = 1; i <= 4; i++) {
          let currentValue = this.weeklydata[this.weeklydata.length - i];
          if(currentValue < this.datasettings.notifythresh / 2 + 1) {
            return;
          }
          if(currentValue > peakValue) {
            peakValue = currentValue;
          }
        }
        note = " has been elevated in the last 24 hours.";
        this.$emit("alert", note);
      }
    },
  }
</script>

<style scoped>
  .graph {
    width: 100%;
    height: 100%;
    padding-top: 10px;
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

  .options {
    padding: 0.7em;
    width: 50%;
    height: 100%;
    float: left;
  }

  .options select {
    width:100%;
  }

  .optrow {
    margin-top: 0.7em;
    clear: both;
  }


</style>
