<template>
  <div id="app">
    <transition name="fade" mode="out-in">
      <ConnectionStatus
        v-if="scene === 'CONNECTING'"
        :goToNextScene="goToNextScene"
      />
      <Onboarding
        v-if="scene === 'ONBOARDING'"
        :goToNextScene="goToNextScene"
      />
      <Train
        v-if="scene === 'TRAIN'"
        :goToNextScene="goToNextScene"
      />
    </transition>
  </div>
</template>

<script>
import ConnectionStatus from './components/ConnectionStatus.vue'
import Onboarding from './components/Onboarding.vue'
import Train from './components/Train.vue'

const SCENES = {
  CONNECTING: "CONNECTING",
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
      scene: SCENES.CONNECTING,
      connected: false
    }
  },
  methods: {
    goToNextScene: function() {
      const i = Object.values(SCENES).indexOf(this.scene)
      this.scene = SCENES[Object.keys(SCENES)[i + 1]]
    }
  },
  // debug code for scene switching
  mounted() {
    const _this = this
    window.addEventListener('keydown', function(e) {
      e.keyCode === 32 && _this.goToNextScene()
    })
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
