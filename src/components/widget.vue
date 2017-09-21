<template name="widget">
  <div class="graph">
    <painchart :chart-data="datacollection" :options="{maintainAspectRatio: false}" :height="this.correctedheight()"></painchart>
    <button @click="fillData()">Randomize</button>
  </div>
</template>

<script>
  import painchart from './painchart.js'

  export default {
    props: ['chartheight'],
    components: {
      painchart
    },
    data () {
      return {
        datacollection: null
      }
    },
    computed : {
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
      correctedheight: function() {
        console.log("correcting height to " + this.chartheight - 25);
        return this.chartheight - 25;
      },
      getRandomInt () {
        return Math.floor(Math.random() * (50 - 5 + 1)) + 5
      }
    }
  }
</script>

<style scoped>
  .graph {
    width: 100%;
    margin:  3px;
    border: 1px solid black;
  }

  button {
    font-size: 1ex;
    margin: 0 auto  ;
    width: 10em;
    padding: 0.5ex 1ex;
  }

</style>