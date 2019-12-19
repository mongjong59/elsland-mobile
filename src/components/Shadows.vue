<template>
  <div
    id="wrapper"
    @touchstart="dragStart"
    @touchmove="dragMove"
    @touchend="dragEnd"
    @mousedown="dragStart"
    @mousemove="dragMove"
    @mouseup="dragEnd"
  >
    <div class="centered rod-wrapper">
      <div class="rod" :style="{ transform: `translateY(-${this.screenRodOffset}px)` }" />
    </div>
    <div class="centered handle-top-wrapper">
      <img class="handle-top" src="../assets/images/shadows-handle-top.png" />
    </div>
    <div class="centered handle-wrapper">
      <img class="handle" src="../assets/images/shadows-handle.png" />
    </div>
    <div class="centered curtain-wrapper" :style="{ width: this.screenCurtainWidth + 'px', height: this.screenCurtainWidth * 2 + 'px' }">
      <img class="curtain" :style="{ transform: `translateY(-${this.progress * 100}%)` }" src="../assets/images/shadows-curtain.png" />
    </div>
    <div class="centered shadow-wrapper">
      <img class="shadow" :style="{ transform: `translateY(${this.screenShadowOffset}px)` }" src="../assets/images/shadows-shadow.png" />
    </div>
  </div>
</template>

<script>
export default {
  name: 'Shadows',
  props: {
    shadowIndex: Number,
    development: Boolean,
    goToWaiting: Function,
    stopCountdown: Function
  },
  data() {
    return {
      progress: 0,
      prevPosition: 0,
      screenRodOffset: 0,
      screenShadowOffset: 0,
      screenCurtainWidth: 0,
      bgWidth: 0
    }
  },
  methods: {
    dragStart(e) {
      let touch = e
      if (e.targetTouches) touch = e.targetTouches[0]
      this.prevPosition = touch.pageY
    },
    dragMove(e) {
      if (this.progress < 0 || this.progress >= 1) return
      let touch = e
      if (e.targetTouches) touch = e.targetTouches[0]
      const position = touch.pageY
      const diff = position - this.prevPosition
      if (diff <= 0) return
      this.progress += diff / 700
      if (this.progress > 1) this.progress = 1
      if (this.progress === 1) this.stopCountdown()
      this.prevPosition = position
    },
    dragEnd(e) {
      this.$socket.emit('client_moveup_curtain', {
        index: this.shadowIndex,
        progress: this.progress
      })
      if (this.development && this.progress >= 1) {
        setTimeout(() => { this.goToWaiting() }, 1000)
      }
    }
  },
  mounted() {
    const img = new Image()
    img.src = require("../assets/images/shadows-bg.jpg")
    img.onload = () => {
      this.bgWidth = img.width
      const IMG_ROD_OFFSET = 680
      const IMG_SHADOW_OFFSET = 900
      const IMG_CURTAIN_WIDTH = 680
      const wrapperWidth = document.getElementById("wrapper").offsetWidth
      this.screenRodOffset = wrapperWidth / this.bgWidth * IMG_ROD_OFFSET
      this.screenShadowOffset = wrapperWidth / this.bgWidth * IMG_SHADOW_OFFSET
      this.screenCurtainWidth = wrapperWidth / this.bgWidth * IMG_CURTAIN_WIDTH
    }
  }
}
</script>

<style scoped>
#wrapper {
  height: 100%;
  width: 100%;
  background: url("../assets/images/shadows-bg.jpg") center;
  background-size: cover;
}

.curtain-wrapper {
  z-index: 3;
  overflow: hidden;
}

.curtain {
  width: 100%;
}

.rod-wrapper {
  width: 100%;
  z-index: 4;
}

.rod {
  height: 25px;
  width: 72%;
  background: black;
  margin: 0 auto;
}

.cord {
  width: 30px;
  height: 70%;
  transform: translateY(-50%);
  top: 50%;
  right: 20px;
  position: absolute;
  background: red;
}

.indicator {
  width: 100%;
  height: 30px;
  background: green;
  position: absolute;
}

.handle-top-wrapper {
  z-index: 99;
}

.handle-top {
  width: 20%;
  /* top: 0; */
  /* position: absolute; */
}

.handle-wrapper {
  z-index: 99;
}

.handle {
  width: 40%;
}

.shadow-wrapper {
  z-index: 2;
  width: 100%;
}

.shadow {
  width: 100%;
}
</style>
