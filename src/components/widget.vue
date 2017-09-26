<template name="widget">
  <div class="graph">
    <painchart v-if="!showoptions" :chart-data="datacollection" :options="{maintainAspectRatio: false}" :styles='myStyles'></painchart>
    <div v-if="showoptions" style="height:100%;">
      <div style="width:50%; height:100%; float: left;">
        Measurement Instrument:
        <br><br>
        Daily Frequency:
        <br><br>
        Notification Threshold:
      </div>
      <div style="width:50%; height:100%; float: left;">
        <select v-model="selectedinstrument">
          <option v-for="instrument in instruments" v-bind:value="instrument.name">
            {{ instrument.name }}
          </option>
        </select>
        <br><br>

        <vue-slider ref="slider" @drag-start="dragstart" :min=1 :max=4 :piecewise=true v-model="dailyfreq"></vue-slider>
        <br>
        <vue-slider ref="slider" :min=5 :max=7 :piecewise=true v-model="notifythresh"></vue-slider>
      </div>
    </div>
    <button v-if="!showoptions" @click="toggleoptions">Chart Options</button>
    <button v-if="showoptions" @click="toggleoptions">Save Settings</button>
  </div>
</template>

<script>
  import painchart from './painchart.js';
  import vueSlider from 'vue-slider-component';
  import eventBus from '../eventBus.js';

  export default {
    props: ['chartheight'],
    components: {
      painchart,
      vueSlider
    },
    data () {
      return {
        datacollection: null,
        showoptions: false,
        instruments: [
          { name: "GAD-7 Questionnaire", value: 1 },
          { name: "Hilbert-Thad Questionnaire", value: 2},
          { name: "Penta-PLU Pain Probe", value: 3}
        ],
        selectedinstrument: "GAD-7 Questionnaire",
        dailyfreq: 1,
        notifythresh: 5
      }
    },
    created: function(){
      var self=this;
      eventBus.$on('previousWeek', function(obj){
        self.fillData();
      });
      eventBus.$on('nextWeek', function(obj){
        self.fillData();
      });
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
          labels: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
          datasets: [
            {
              label: 'Pain',
              backgroundColor: '#ff8b46',
              data: [this.getRandomInt(), this.getRandomInt(), this.getRandomInt(), this.getRandomInt(), this.getRandomInt(), this.getRandomInt(), this.getRandomInt()],
              fill: false,
              lineTension: 0,
              pointBorderColor: ['red', 'yellow', 'green', 'blue', 'orange', 'purple', 'gray'],
              pointStyle: 'circle',
              pointRadius: 6,
              borderWidth: 2,
              borderDash: [4, 8]

            }, {
              label: 'Nausea',
              backgroundColor: '#bac84b',
              data: [this.getRandomInt(), this.getRandomInt(), this.getRandomInt(), this.getRandomInt(), this.getRandomInt(), this.getRandomInt(), this.getRandomInt()],
              fill: false
            }
          ]
        }
      },
      correctedheight () {
        console.log("correcting height to " + this.chartheight/2);
        return chartheight/2;
      },
      toggleoptions () {
        this.showoptions = !this.showoptions;
        console.log("Showing options")
      },
      getRandomInt () {
        return Math.floor(Math.random() * (50 - 5 + 1)) + 5
      },
      dragstart (ctx) {

        console.log("Dragging slider " + ctx);
      }
    }
  }
</script>

<style scoped>
  .graph {
    width: 100%;
    height: 100%;
    margin: 0;
    border: 1px solid black;
  }

  button {
    font-size: 1em;
    margin: 0 auto;
    width: 10em;
    padding: 0.5ex 1ex;
  }

</style>
