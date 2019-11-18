<template>
  <div class="wrapper">
    <div class="full-height">
      <div v-if="stage === 1" class="full-height instruction">
        <div class="centered text">
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
        <div class="centered text">
          Look back at the big screen to check what you've changed!
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import vueEraser from "vue-eraser"

export default {
  name: 'Onboarding',
  props: {
    emitSocketMsg: Function,
    goToNextScene: Function
  },
  data() {
    return { stage: 1 }
  },
  components: {
    'vue-eraser': vueEraser
  },
  methods: {
    startErasing() {
      this.stage++
    },
    complete() {
      this.$socket.emit("client_erase_block")
    }
  },
  sockets: {
    cut_scene() {
      this.goToNextScene()
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
</style>
