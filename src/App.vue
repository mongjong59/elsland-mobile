<template>
  <div id="app">
    <transition name="fade" mode="out-in">
      <ConnectionStatus v-if="scene === 'CONNECTION_STATUS'" />
      <Onboarding v-if="scene === 'ONBOARDING'" />
      <Train v-if="scene === 'TRAIN'" v-bind="propsTrain" />
    </transition>
  </div>
</template>

<script>
import ConnectionStatus from './components/ConnectionStatus.vue'
import Onboarding from './components/Onboarding.vue'
import Train from './components/Train.vue'

const SCENES = {
  CONNECTION_STATUS: "CONNECTION_STATUS",
  ONBOARDING: "ONBOARDING",
  TRAIN: "TRAIN"
}

export default {
  name: 'app',
  components: {
    ConnectionStatus,
    Onboarding,
    Train
  },
  data: function() {
    return {
      scene: SCENES.CONNECTION_STATUS,
      connected: false,
      propsTrain: {
        top: 0.3,
        bottom: 0.7,
        id: 0,
        segmentIndex: 0
      }
    }
  },
  methods: {
    goToScene(name) {
      this.scene = SCENES[name]
    },
    goToNextScene: function() {
      const i = Object.values(SCENES).indexOf(this.scene)
      const key = Object.keys(SCENES)[i + 1]
      this.goToScene(key)
    }
  },
  mounted() {
    const _this = this
    window.addEventListener('keydown', function(e) {
      e.keyCode === 32 && _this.goToNextScene()
    })
    this.goToScene("TRAIN")
  },
  sockets: {
    intro_scene() {
      this.goToScene("ONBOARDING")
    },
    cut_scene(data) {
      console.log(data)
      this.propsTrain = {
        top: data.cut[2],
        bottom: data.cut[0],
        cutIndex: data.index,
        segmentIndex: data.segment_index
      }
      this.goToScene("TRAIN")
    }
  }
}
</script>

<style>
#app {
  background-size: cover;
  background: black;
  font-family: Ubuntu, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  font-size: 62.5%;
  height: 100%;
}

#content {
  width: 100%;
  height: 100%;
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 1.5s;
}

.fade-enter, .fade-leave-to {
  opacity: 0;
}
</style>
