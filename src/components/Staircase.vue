<template>
  <div class="wrapper">
    <div class="overlay-wrapper">
      <img class="overlay" src="../assets/images/staircase-bg-overlay.png" />
    </div>
    <div class="knob-wrapper">
      <img
        @touchstart="dragStart"
        @touchmove="dragMove"
        @touchend="dragEnd"
        class="knob"
        :style="{ transform: knobTranslateY }"
        src="../assets/images/staircase-knob.png"
      />
    </div>
    <div>{{ debug }}</div>
    <div>{{ debug2 }}</div>
  </div>
</template>

<script>
export default {
  name: 'Staircase',
  props: {
    screenIndex: Number,
    lightIndex: Number,
    development: Boolean,
    goToWaiting: Function
  },
  data() {
    return {
      prevPosition: 0,
      progress: 0,
      bgWidth: 0,
      debug: "",
      debug2: "",
      compeleted: false
    }
  },
  computed: {
    screenMaxDistance() {
      return window.innerWidth / this.bgWidth * 1400
    },
    screenGrooveBottom() {
      return window.innerHeight - window.innerWidth / this.bgWidth * 200
    },
    screenKnobHeight() {
      return window.innerWidth / this.bgWidth * 150
    },
    knobTranslateY() {
      const translateY = (this.screenMaxDistance * this.progress) * -1
      return `translateY(${translateY}px)`
    }
  },
  methods: {
    dragStart(e) {
      this.prevPosition = e.targetTouches[0].pageY
    },
    dragMove(e) {
      if (this.progress >= 1 || this.compeleted) return
      const position = e.targetTouches[0].pageY
      if (position < this.screenKnobHeight / 2) this.complete()
      const diff = position - this.prevPosition
      if (diff >= 0) return
      const diffBottom = this.screenGrooveBottom - position
      if (diffBottom <= 0) return
      const nextProgress = diffBottom / this.screenMaxDistance
      if (nextProgress > this.progress) this.progress = nextProgress
      if (this.progress > 1) this.progress = 1
      this.prevPosition = position
    },
    dragEnd(e) {
      let progress = this.progress
      if (this.compeleted) progress = 1
      console.log(progress)
      this.$socket.emit('client_turnon_light', {
        screen_index: this.screenIndex,
        light_index: this.lightIndex,
        progress
      })
      if (this.development && progress >= 1) {
        setTimeout(() => { this.goToWaiting() }, 1000)
      }
    },
    complete() {
      this.compeleted = true
    }
  },
  mounted() {
    const img = new Image()
    img.src = require("../assets/images/staircase-bg.jpg")
    img.onload = () => { this.bgWidth = img.width }
  }
}
</script>

<style scoped>
.wrapper {
  height: 100%;
  background: url("../assets/images/staircase-bg.jpg") bottom;
  background-size: cover;
}

.overlay-wrapper {
  width: 67%;
  bottom: 0;
  z-index: 2;
  position: absolute;
}

.overlay {
  width: 100%;
}

.knob-wrapper {
  width: 55%;
  transform: translate(-50%, 0);
  left: 50%;
  bottom: 0;
  position: absolute;
  line-height: 0;
  z-index: 99;
}

.knob {
  width: 100%;
}
</style>
