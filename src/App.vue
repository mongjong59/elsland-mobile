<template>
  <div id="app">
    <transition name="fade" mode="out-in">
      <ConnectionStatus v-if="isScene('CONNECTION_STATUS')"
        :goToNextScene="goToNextScene"
        :development="development"
      />

      <Onboarding v-if="isScene('ONBOARDING')"
        :goToWaiting="goToWaiting"
        :stopCountdown="stopCountdown"
      />

      <Train v-if="isScene('TRAIN')"
        v-bind="propsTrain"
        :goToWaiting="goToWaiting"
        :stopCountdown="stopCountdown"
        :development="development"
      />

      <Screens v-if="isScene('SCREENS')"
        :goToWaiting="goToWaiting"
        :stopCountdown="stopCountdown"
        :development="development"
      />

      <Shadows v-if="isScene('SHADOWS')"
        :shadowIndex="shadowIndex"
        :goToWaiting="goToWaiting"
        :stopCountdown="stopCountdown"
        :development="development"
      />

      <Staircase v-if="isScene('STAIRCASE')"
        v-bind="propsStaircase"
        :goToWaiting="goToWaiting"
        :stopCountdown="stopCountdown"
        :development="development"
      />
    </transition>
    <transition name="fade">
      <Waiting v-if="waiting" />
    </transition>

    <div v-if="countdown < 16 && countdown > 0"
      class="countdown"
    >{{ countdown }}</div>
    <button v-if="development"
      class="debug-button"
      @touchstart="goToNextScene"
      @click="goToNextScene"
    >Jump to Next Scene</button>
    <Blink v-if="blinking" />
  </div>
</template>

<script>
import Waiting from './components/Waiting.vue'
import Blink from './components/Blink.vue'
import ConnectionStatus from './components/ConnectionStatus.vue'
import Onboarding from './components/Onboarding.vue'
import Train from './components/Train.vue'
import Screens from './components/Screens.vue'
import Shadows from './components/Shadows.vue'
import Staircase from './components/Staircase.vue'

const SCENES = [
  "CONNECTION_STATUS",
  "ONBOARDING",
  "TRAIN",
  "SCREENS",
  "SHADOWS",
  "STAIRCASE"
]

export default {
  name: 'App',
  components: {
    Waiting,
    Blink,
    ConnectionStatus,
    Onboarding,
    Train,
    Screens,
    Shadows,
    Staircase
  },
  data() {
    return {
      scene: SCENES[0],
      countdown: 0,
      connected: false,
      propsTrain: {
        top: 0.3,
        bottom: 0.7,
        id: 0,
        segmentIndex: 0
      },
      shadowIndex: 0,
      propsStaircase: {
        screenIndex: 0,
        lightIndex: 0
      },
      waiting: false,
      blinking: false,
      development: true
      // development: process.env.NODE_ENV === 'production'
    }
  },
  methods: {
    goToScene(name) {
      console.log("going to " + name)
      this.scene = name
      if (name !== "ONBOARDING") return
      setTimeout(() => { this.blink() }, 1500)
    },
    goToNextScene() {
      const i = SCENES.indexOf(this.scene)
      this.goToScene(SCENES[i + 1])
    },
    goToWaiting() {
      if (this.waiting) return
      this.waiting = true
      this.stopCountdown()
      this.goToNextScene()
      if (this.development) {
        setTimeout(() => { this.stopWaiting() }, 3000)
      }
    },
    switchToScene(name) {
      this.goToScene(name)
      this.stopWaiting()
    },
    stopCountdown() {
      this.countdown = -1
    },
    stopWaiting() {
      this.waiting = false
      setTimeout(() => { this.blink() }, 700)
      this.countdown = 50
    },
    isScene(name) {
      return name === this.scene
    },
    notWaiting() {
      return !this.waiting
    },
    blink() {
      this.blinking = true
      setTimeout(() => { this.blinking = false }, 1000)
    }
  },
  watch: {
    countdown(val) {
      val === 0 && this.goToWaiting()
    }
  },
  mounted() {
    const _this = this
    window.addEventListener('keydown', function(e) {
      e.keyCode === 32 && _this.goToNextScene()
    })
    setInterval(() => {
      if (this.countdown > 0) this.countdown -= 1
    }, 1000)
    // this.goToScene("STAIRCASE")
  },
  sockets: {
    cut_scene(data) {
      this.propsTrain = {
        top: data.cut[2],
        bottom: data.cut[0],
        cutIndex: data.index,
        segmentIndex: data.segment_index
      }
      this.switchToScene("TRAIN")
    },
    screen_city_scene() {
      this.switchToScene("SCREENS")
    },
    shadow_scene(data) {
      this.switchToScene("SHADOWS")
      if (!data.index) return
      this.shadowIndex = data.index
    },
    staircase_scene(data) {
      this.switchToScene("STAIRCASE")
      const screenIndex = data.screen_index
      const lightIndex = data.light_index
      this.propsStaircase = { screenIndex, lightIndex }
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
  position: relative;
}

.countdown {
  transform: translateX(-50%);
  left: 50%;
  bottom: 0;
  font-size: 1.6rem;
  z-index: 999;
  position: absolute;
}

.debug-button {
  right: 0;
  bottom: 0;
  position: absolute;
  z-index: 99;
}
</style>
