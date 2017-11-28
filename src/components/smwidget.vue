<template name="smwidget">
  <div>
    <div v-if='!editmode'>
      <div class="moduleContainer" v-if='maximized'>
        {{getMinutesCompleted()}} / {{datasettings.minutespermodule * datasettings.weeklyfreq}} minutes completed
        <ul class="moduleList">
          <li class="module" :class="module.status" v-bind:style="widgetStyle" v-for="module in weeklymodules" v-bind:key="module.id">
            {{module.status}} <br> <span class="moduleLabel">Module {{module.id}}</span> <br>
            <div v-if="module.status==='☑'">{{datasettings.minutespermodule}} min.<br>{{module.datecompleted}}</div>
          </li>
        </ul>
      </div>
      <div class="progresscont" v-if='!maximized'>
        <div class="progress" v-bind:style="progressStyle"> </div>
        <div class="barlabel">Modules completed this week: {{this.numcomplete}} / {{this.weeklymodules.length}}</div>
      </div>
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
  import vueSlider from 'vue-slider-component';

  export default {
    props: ['chartheight', 'patientid', 'editmode', 'object','title', 'startdate', 'totalminutes', 'minutescompleted', 'maximized'],
    components: {
      vueSlider
    },
    data () {
      return {
        weeklymodules: [],
        numcomplete: 0,
        datasettings: null,
        alldata: []
      }
    },
    created: function() {
      var self = this;
      this.$eventBus.$on('setdaterange', function (obj) {
        self.getweeklymodules(obj.startDate);
      });
      this.$eventBus.$on('saveSettings', function () {
        self.saveoptions();
      });
      const obj = {"id":this.$route.params.id,"group":this.currentGroup.id,"wid": this.object.id};
      if (this.$store.getters.getDataSettings(obj)) {
        this.datasettings = Object.assign({}, this.$store.getters.getDataSettings(obj).datasettings);
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
      },
      widgetStyle() {
        return {
          width: `${100 / this.datasettings.weeklyfreq}%`,
          position: 'relative'
        }
      },
      progressStyle() {
        return {
          width: `${(this.numcomplete / this.weeklymodules.length) * 100}%`,
          height: '22px',
          backgroundColor: '#00aa00'
        }
      }
    },
    mounted () {
      this.getPatientDataForWidget();
      this.getweeklymodules(null);
    },
    methods: {
      getweeklymodules (startDate) {
        this.weeklymodules = [];
        this.numcomplete = 0;
        let i = 1;
        let that = this;
        if(startDate === null) {
          startDate = this.$moment().startOf('week');
        }
        this.alldata.sort(function(a, b) {
          return a.date - b.date;
        });
        this.alldata.forEach( function (module) {
          if(module.date > startDate.unix() && module.date < that.$moment(startDate).add(7, 'd').unix()) {
            if(i <= that.datasettings.weeklyfreq) {
              if (module.value === 2) {
                that.numcomplete ++;
              }
              let mod = {
                id: i,
                status: that.convertNumToStatus(module.value),
                datecompleted: that.$moment.unix(module.date).format('MMM. D')
              };
              that.weeklymodules.push(mod);
            }
            i++;
          }
        });
        while(i <= this.datasettings.weeklyfreq) {
          let status = 1;
          if(startDate.unix() > that.$moment().subtract(6, 'd').unix()) {
            status = 3;
          }
          this.weeklymodules.push({id: i, status: this.convertNumToStatus(status), datecompleted: null});
          i++;
        }
      },
      convertNumToStatus: function(statusint) {
        switch (statusint) {
          case 1:

            return "☒";
          case 2:
            return "☑";
          case 3:
            return "☐";
        }
      },
      saveoptions :function ()  {
          this.$store.commit('saveWidgetSettings', {'pid': this.$route.params.id, "group":this.currentGroup.id, "wid":this.object.id,'datasettings':this.datasettings});
      },
      getMinutesCompleted() {
        let minutescompleted = 0;
        let that = this;
        this.weeklymodules.forEach(function (module) {
          if (module.status === '☑') {
            minutescompleted += that.datasettings.minutespermodule;
          }
        });
        return minutescompleted;
      },
      getPatientDataForWidget() {
        // Use slice to copy the values so we're not changing data in local storage
        this.alldata = this.$store.getters.getPatientData(this.patientid)[this.object.id + "-data"].slice();
      },
      generateNotification() {
        let finalDataPoint = this.weeklydata[this.weeklydata.length - 1];
        this.$emit("alert", finalDataPoint, this.datasettings.notifythresh);
      }
    }
  }
</script>

<style scoped>

  .moduleContainer {
    margin: 3em;
    text-transform: none;
    background-color: #fff;
    text-align: center;
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

  .progresscont {
    margin: 10px 5px 0 5px;
    padding: 1px;
    font-size: 11pt;
    border: 1px solid black;
    height: 26px;
    border-radius: 5px;
  }

  .barlabel {
    color: #000;
    position: absolute;
    top: 12px;
    width: 100%;
    text-align: center;
    text-shadow:
    -1px -1px 0 #fff,
    1px -1px 0 #fff,
    -1px 1px 0 #fff,
    1px 1px 0 #fff;
  }


</style>
