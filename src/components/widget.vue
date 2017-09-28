<template name="widget">
  <div class="graph">
    <linechart v-if="!showoptions" :chart-data="datacollection" :options="chartOptions" :styles='myStyles'></linechart>
    <div v-if="showoptions">
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
          <vue-slider ref="slider" @drag-start="dragstart" :min=1 :max=4 tooltip="hover" :piecewise=true v-model="datasettings.dailyfreq"></vue-slider>
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

  export default {
    props: ['chartheight', 'editmode', 'title', 'showoptions'],
    components: {
      linechart,
      vueSlider
    },
    data () {
      return {
        datacollection: null,
        datasettings: null,
        hover: false,
        labels: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
        data: [this.getRandomInt(), this.getRandomInt(), this.getRandomInt(), this.getRandomInt(), this.getRandomInt(), this.getRandomInt(), this.getRandomInt()],
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
          scales: {
            yAxes: [{
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
      eventBus.$on('setdaterange', function (obj) {
        self.getData(obj.startDate, obj.endDate);
        self.fillData();
      });
      eventBus.$on('saveSettings', function () {
        self.saveoptions();
        self.showoptions = false;
      });
      eventBus.$on('edit', function () {
        self.showoptions = true;
      });
      var uid = this.$route.params.id + this.title;
      if (this.$store.getters.getDataSettings(uid)) {
        this.datasettings = this.$store.getters.getDataSettings(uid).datasettings;
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
    myStyles () {
     return {
       height: `${this.chartheight}px`,
       position: 'relative'
     }
   }
    },
    mounted () {
      this.fillData()
    },
    methods: {
      fillData () {
        this.datacollection = {
          labels: this.labels,
          datasets: [
            {
              label: this.title,
              backgroundColor:'rgba(255, 255, 255, 1)',
              data: this.data,
              fill: false,
              lineTension: 0,
              borderColor: '#bfbfbf',
              pointBorderColor: this.determinecolor(),
              pointBorderWidth: 3,
              pointStyle: 'circle',
              pointRadius: 7,
              borderWidth: 2
            }
          ]
        }
      },
      showoptionspane () {
        this.showoptions = !this.showoptions;
      },
      saveoptions () {
        this.showoptions = !this.showoptions;
        this.fillData();
        var uid = this.$route.params.id + this.title;
        this.$store.commit('saveWidgetSettings', {'id':uid, 'datasettings':this.datasettings});
      },
      getRandomInt () {
        return Math.floor(Math.random() * (10)) + 1
      },
      dragstart (ctx) {
        this.$emit('sliderdrag');
      },
      determinecolor() {
        var colors = [];
        var self = this;
        this.data.forEach( function (e) {
          if (e > self.datasettings.notifythresh) {
            colors.push('red');
          } else if (e > self.datasettings.notifythresh / 2 + 1) {
            colors.push('orange')
          }else {
            colors.push('green');
          }
        });
        return colors;
      },
      getData(startDate, endDate) {
        this.fillData([this.getRandomInt(), this.getRandomInt(), this.getRandomInt(), this.getRandomInt(), this.getRandomInt(), this.getRandomInt(), this.getRandomInt()],
            ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]);
      }

    }
  }
</script>

<style scoped>
  .graph {
    width: 96%;
    height: 100%;
    padding-top: 25px;
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
    padding: 1em;
    width: 50%;
    height: 100%;
    float: left;
  }

  .options select {
    width:100%;
  }

  .optrow {
    margin-top: 0.5em;
    clear: both;
  }


</style>
