<template>
  <div class="wrapper">
    <div class="full-height">
      <transition name="fade" appear>
        <div v-if="stage === 1" class="full-height instruction">
          <img class="hand" src="../assets/images/onboarding-hand.gif" />
          <div class="centered text">
            <br />
            You can try to swipe over your screen
          </div>
        </div>
      </transition>
      <div
        class="full-height canvas-wrapper" :class="{ opaque: stage > 1 }"
        id="canvas-wrapper"
        @touchstart="startErasing"
        @mousedown="startErasing"
      >
        <vue-eraser
          ref="vueEraser"
          :size="80"
          :completeRatio="development ? 0.3 : 0.75"
          resultSrc=""
          :coverSrc="require('../assets/images/onboarding-dark.png')"
          :completeFunction="complete"
          class="full-height"
        />
        <transition name="fade">
          <div class="centered text">
            <img src="../assets/images/logo-black.svg" />
          </div>
        </transition>
      </div>
    </div>
  </div>
</template>

<script>
import NoSleep from "nosleep.js"
import vueEraser from "vue-eraser"

export default {
  name: 'Onboarding',
  props: {
    goToWaiting: Function,
    stopCountdown: Function,
    development: Boolean
  },
  data() {
    return { stage: 1 }
  },
  components: {
    'vue-eraser': vueEraser
  },
  methods: {
    startErasing() {
      new NoSleep().enable()
      this.stage = 2
    },
    complete() {
      this.stopCountdown()
      this.$socket.emit("client_erase_block")
      if (this.development) {
        setTimeout(() => { this.goToWaiting() }, 2000)
      }
    }
  }
}
</script>

<style scoped>
.wrapper {
  font-size: 1.2rem;
  margin: 0 auto;
  height: 100%;
  background: #2B2A2D;
}

.wrapper.fade-enter {
  opacity: 1;
}

.canvas-wrapper {
  opacity: 0;
  background: #E4E4E4;
  color: #2B2A2D;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  cursor: pointer;
}

.instruction {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
}

.hand {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  height: 100%;
}
</style>
