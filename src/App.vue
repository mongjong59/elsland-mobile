<template>
  <div id="app">
    <transition name="fade" mode="out-in">
      <ConnectionStatus v-if="isScene('CONNECTION_STATUS')"
        :goToScene="goToScene"
        :development="development"
      />

      <Onboarding
        v-if="isScene('ONBOARDING')"
        :goToWaiting="goToWaiting"
        :stopCountdown="stopCountdown"
        :development="development"
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

      <Staircase v-if="isScene('STAIRCASE')"
        v-bind="propsStaircase"
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

      <Elsland v-if="isScene('ELSLAND')"
        :development="development"
        :goToScene="goToScene"
      />
    </transition>
    <transition name="fade">
      <Waiting v-if="waiting" :showText="this.scene != 'ELSLAND'" />
    </transition>

    <div v-if="countdown < 16 && countdown > 0"
      class="countdown"
    >{{ countdown }}</div>
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
import Staircase from './components/Staircase.vue'
import Shadows from './components/Shadows.vue'
import Elsland from './components/Elsland.vue'

const SCENES = [
  "CONNECTION_STATUS",
  "ONBOARDING",
  "TRAIN",
  "SCREENS",
  "STAIRCASE",
  "SHADOWS",
  "ELSLAND"
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
    Staircase,
    Shadows,
    Elsland
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
        screenIndex: -1,
        lightIndex: -1
      },
      waiting: false,
      blinking: false,
      development: true
    }
  },
  methods: {
    goToScene(name) {
      this.scene = name
      console.log("going to " + name)
      if (name !== "ONBOARDING") return
      setTimeout(() => { this.blink() }, 500)
    },
    goToNextScene() {
      const i = SCENES.indexOf(this.scene)
      this.goToScene(SCENES[i + 1])
    },
    goToWaiting() {
      if (this.waiting || this.isScene("ELSLAND")) return
      this.waiting = true
      this.stopCountdown()
      this.goToNextScene()
      if (this.development) {
        setTimeout(() => { this.stopWaiting() }, 5000)
      }
    },
    switchToScene(name) {
      this.goToScene(name)
      if (this.waiting) this.stopWaiting()
    },
    switchToNextScene() {
      const i = SCENES.indexOf(this.scene)
      this.switchToScene(SCENES[i + 1])
    },
    stopCountdown() {
      this.countdown = -1
    },
    stopWaiting() {
      this.waiting = false
      if (this.staircaseWaiting || this.isScene("ELSLAND")) return
      setTimeout(() => { this.blink() }, 700)
      this.countdown = 50
    },
    notWaiting() {
      return !this.waiting
    },
    blink() {
      this.blinking = true
      setTimeout(() => { this.blinking = false }, 1000)
    },
    isScene(name) {
      return name === this.scene
    },
  },
  computed: {
    staircaseWaiting() {
      return this.isScene("STAIRCASE") && !this.waiting && this.propsStaircase.screenIndex === -1
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
      e.keyCode === 32 && _this.switchToNextScene()
    })
    setInterval(() => {
      if (this.countdown > 0) this.countdown -= 1
    }, 1000)
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
      this.countdown = 50
      !this.waiting && this.blink()
    },
    staircase_scene_wait() {
      this.switchToScene("STAIRCASE")
    },
    elsland_scene() {
      this.switchToScene("ELSLAND")
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

.wrapper {
  height: 100%;
  position: relative;
  overflow: hidden;
}

.countdown {
  transform: translateX(-50%);
  left: 50%;
  bottom: 20px;
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
