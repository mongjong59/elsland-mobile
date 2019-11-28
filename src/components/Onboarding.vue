<template>
  <div class="wrapper">
    <div class="full-height">
      <div v-if="stage === 1" class="full-height instruction">
        <img class="hand" src="../assets/images/onboarding-hand.gif" />
        <div class="centered text">
          <br />
          You can try to swipe over your screen
        </div>
      </div>
      <div class="full-height canvas-wrapper" :class="{ opaque: stage > 1 }" id="canvas-wrapper" @touchstart="startErasing">
        <vue-eraser
          ref="vueEraser"
          :size="80"
          resultSrc=""
          :coverSrc="require('../assets/images/onboarding-dark.png')"
          :completeFunction="complete"
          class="full-height"
        />
        <transition name="fade">
          <div class="centered text">
            Pay attention to the big screen while you swipe on the screen
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
  },
  data() {
    return { stage: 1 }
  },
  components: {
    'vue-eraser': vueEraser
  },
  methods: {
    startErasing() {
      this.stage = 2
      new NoSleep().enable()
    },
    complete() {
      this.$socket.emit("client_erase_block")
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

.canvas-wrapper {
  opacity: 0;
  background: #E4E4E4;
  color: #2B2A2D;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
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
