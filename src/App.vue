<template>
  <div id="app">
    <transition name="fade" mode="out-in">
      <ConnectionStatus v-if="isCurrentScene('CONNECTION_STATUS')" :goToNextScene="goToNextScene" :development="development" />
      <Onboarding v-if="isCurrentScene('ONBOARDING')" :goToWaiting="goToWaiting" />
      <Train v-if="isCurrentScene('TRAIN')" v-bind="propsTrain" :goToWaiting="goToWaiting" :development="development" />
      <Waiting v-if="waiting" />
      <Screens v-if="isCurrentScene('SCREENS')" :goToWaiting="goToWaiting" :development="development" />
    </transition>
    <button v-if="development" class="debug-button" @touchstart="goToNextScene">Jump to Next Scene</button>
  </div>
</template>

<script>
import Waiting from './components/Waiting.vue'
import ConnectionStatus from './components/ConnectionStatus.vue'
import Onboarding from './components/Onboarding.vue'
import Train from './components/Train.vue'
import Screens from './components/Screens.vue'

const SCENES = [
  "CONNECTION_STATUS",
  "ONBOARDING",
  "TRAIN",
  "SCREENS"
]

export default {
  name: 'App',
  components: {
    Waiting,
    ConnectionStatus,
    Onboarding,
    Train,
    Screens
  },
  data: function() {
    return {
      scene: SCENES[0],
      connected: false,
      propsTrain: {
        top: 0.3,
        bottom: 0.7,
        id: 0,
        segmentIndex: 0
      },
      development: process.env.NODE_ENV !== 'production',
      waiting: false
    }
  },
  methods: {
    goToScene(name) {
      this.waiting = false
      this.scene = name
    },
    goToNextScene() {
      const i = SCENES.indexOf(this.scene)
      this.goToScene(SCENES[i + 1])
    },
    goToWaiting() {
      this.waiting = true
      if (this.development) {
        setTimeout(() => { this.goToNextScene() }, 3000)
      }
    },
    isCurrentScene(name) {
      let currentScene = this.scene
      if (this.waiting) currentScene = "WAITING"
      return name === currentScene
    }
  },
  mounted() {
    const _this = this
    window.addEventListener('keydown', function(e) {
      e.keyCode === 32 && _this.goToNextScene()
    })

    // this.goToScene("SCREENS")
  },
  sockets: {
    cut_scene(data) {
      this.propsTrain = {
        top: data.cut[2],
        bottom: data.cut[0],
        cutIndex: data.index,
        segmentIndex: data.segment_index
      }
      this.goToScene("TRAIN")
    },
    screen_city_scene() {
      this.goToScene("SCREENS")
    },
    waiting_page() {
      if (this.development) return
      this.goToWaiting()
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

.debug-button {
  right: 0;
  bottom: 0;
  position: absolute;
  z-index: 99;
}
</style>
