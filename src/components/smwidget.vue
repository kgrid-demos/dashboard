<template name="smwidget">
  <div>
    <div class="moduleContainer" v-if="!editmode">
      {{getMinutesCompleted()}} / {{datasettings.minutespermodule * datasettings.weeklyfreq}} minutes completed
      <ul class="moduleList">
        <li class="module" :class="module.status" v-bind:style="widgetStyle" v-for="module in weeklymodules" v-bind:key="module.id">
          {{module.status}} <br> <span class="moduleLabel">Module {{module.id}}</span> <br>
          <div v-if="module.status==='☑'">{{datasettings.minutespermodule}} min.<br>{{module.datecompleted}}</div>
        </li>
      </ul>
    </div>
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
          Weekly Frequency:
        </div>
        <div class="options">
          <vue-slider ref="slider" :min=1 :max=7 tooltip="hover" :piecewise=true v-model="datasettings.weeklyfreq"></vue-slider>
        </div>
      </div>
      <div class="optrow">
        <div class="options">
          Minutes Per Module:
        </div>
        <div class="options">
          <vue-slider ref="slider" :min=15 :max=60 tooltip="hover" :interval=15 :piecewise=true v-model="datasettings.minutespermodule"></vue-slider>
        </div>
      </div>
      <div class="optrow">
        <div class="options">
          Notification Threshold:
        </div>
        <div class="options">
          <vue-slider ref="slider" :min="datasettings.notifymin" :max="datasettings.weeklyfreq" tooltip="hover" :piecewise=true v-model="datasettings.notifythresh"></vue-slider>
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

  export default {
    props: ['chartheight', 'editmode', 'title', 'startdate', 'totalminutes', 'minutescompleted'],
    components: {
      linechart,
      vueSlider
    },
    data () {
      return {
        weeklymodules: [],
        datasettings: null
      }
    },
    created: function() {
      var self = this;
      eventBus.$on('setdaterange', function (obj) {
        self.getweeklymodules(obj.startDate);
      });
      eventBus.$on('saveSettings', function () {
        self.saveoptions();
      });
      var uid = this.$route.params.id + this.title;
      if (this.$store.getters.getDataSettings(uid)) {
        this.datasettings = Object.assign({}, this.$store.getters.getDataSettings(uid).datasettings);
      } else {
        this.datasettings = {
          instruments: [
            { name: "SPLN Course", value: 1},
            { name: "Pheen Questionnaire", value: 2},
            { name: "Norbert-Ralph SM", value: 3}
          ],
          selectedinstrument: {name: "SPLN Course", value: 1},
          weeklyfreq: 4,
          minutespermodule: 15,
          notifythresh: 1,
          notifymin: 1
        };
      }
      this.getweeklymodules(this.startdate);
    },
    computed : {
      myStyles () {
        return {
          height: `${this.chartheight}px`,
          position: 'relative'
        }
      },
      widgetStyle() {
        return {
          width: `${100 / this.datasettings.weeklyfreq}%`,
        }
      }
    },
    mounted () {
      this.getweeklymodules(moment())
    },
    methods: {
      getweeklymodules (startDate) {
        this.weeklymodules = [];
        let modStatus;
        let moduleCompleteDate = moment(startDate);
        for (let i = 1; i <= this.datasettings.weeklyfreq; i++) {
          if (startDate < moment().subtract(1, 'w')) {
            modStatus = this.getRandomStatus(2);
          } else if(startDate > moment() || modStatus === "☐"){
            modStatus = "☐";
          } else {
            modStatus = this.getRandomStatus(3);
          }
          if(modStatus === "☑") {
            moduleCompleteDate = moduleCompleteDate.add(Math.floor(Math.random() * 3), 'd');
          }
          this.weeklymodules.push({id: i, status: modStatus, datecompleted: moduleCompleteDate.format('MMM. D')});
        }
      },
      saveoptions () {
        var uid = this.$route.params.id + this.title;
        this.$store.commit('saveWidgetSettings', {'id':uid, 'datasettings':this.datasettings});
        //this.getweeklymodules();
      },
      getRandomStatus (availableStatuses) {
        const statusint = Math.floor(Math.random() * (availableStatuses ? availableStatuses : 3));
        switch (statusint) {
          case 0:
            return "☒";
          case 1:
            return "☑";
          case 2:
            return "☐";
        }
      },
      getMinutesCompleted() {
        let minutescompleted = 0;
        let that = this;
        this.weeklymodules.forEach( function(module) {
          if(module.status === '☑') {
            minutescompleted += that.datasettings.minutespermodule;
          }
        });
        return minutescompleted;
      }
    }
  }
</script>

<style scoped>

  .moduleContainer {
    margin: 3em;
    text-transform: none;
  }
  .moduleList {
  }

  .☑ {
    color: green;
  }

  .☒ {
    color: red;
  }

  .module {
    font-size:24pt;
    float: left;
    margin: 0.7em auto 0;
    line-height: 14pt;
  }
  .module div {
    color: gray;
    font-size: 10pt;
  }
  .moduleLabel {
    font-size: 10pt;
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
