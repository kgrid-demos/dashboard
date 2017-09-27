<template name="widget">
  <div class="graph">
    <painchart v-if="!showoptions" :chart-data="datacollection" :options="chartOptions" :styles='myStyles'></painchart>
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
          <vue-slider ref="slider" :min=5 :max=7 tooltip="hover" :piecewise=true v-model="datasettings.notifythresh"></vue-slider>
        </div>
      </div>
    </div>
    <button class="edit" v-if="!showoptions && editmode" @click="showoptionspane" @mouseenter="hover = true" @mouseleave="hover = false">
      <img v-if="!hover" src="../../static/images/black_gear.png">
      <img v-if="hover" src="../../static/images/red_gear.png">
    </button>
    <button class="save" v-if="showoptions" @click="saveoptions">Save Settings</button>
  </div>
</template>

<script>
  import painchart from './painchart.js';
  import vueSlider from 'vue-slider-component';
  import eventBus from '../eventBus.js';

  export default {
    props: ['chartheight', 'editmode', 'title'],
    components: {
      painchart,
      vueSlider
    },
    data () {
      return {
        datacollection: null,
        datasettings: null,
        showoptions: false,
        hover: false,
        labels: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
        data: [3, 4, 5, 6, 7, 8, 9],//[this.getRandomInt(), this.getRandomInt(), this.getRandomInt(), this.getRandomInt(), this.getRandomInt(), this.getRandomInt(), this.getRandomInt()],
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
              gridlines: {
                display: true,
                color: 'gray',
                lineWidth: 2
              }
            }]
          },
        }
      }
    },
    created: function() {
      var self = this;
      eventBus.$on('previousWeek', function (obj) {
        self.getData(obj.startDate, obj.endDate);
        self.fillData();
      });
      eventBus.$on('nextWeek', function (obj) {
        self.getData(obj.startDate, obj.endDate);
        self.fillData();
      });
      var uid = this.$route.params.id + this.title;
      if (this.$store.getters.getDataSettings(uid)) {
        this.datasettings = this.$store.getters.getDataSettings(uid).datasettings;
      } else {
        this.datasettings = {
          instruments: [
            { name: "GAD-7 Questionnaire", value: 1 },
            { name: "Hilbert-Thad Questionnaire", value: 2},
            { name: "Penta-PLU Pain Probe", value: 3}
          ],
          selectedinstrument: {name: "GAD-7 Questionnaire", value: 1},
          dailyfreq: 1,
          notifythresh: 5
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
              label: 'Pain',
              backgroundColor:'rgba(255, 255, 255, 1)',
              data: this.data,
              fill: false,
              lineTension: 0,
              pointBorderColor: this.determinecolor(),
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
        return Math.floor(Math.random() * (10 - 5 + 1)) + 5
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
    width: 100%;
    height: 100%;
    padding-top: 12px;
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
