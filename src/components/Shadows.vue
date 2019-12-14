<template>
  <div class="wrapper" @touchstart="dragStart" @touchmove="dragMove" @touchend="dragEnd">
    <div class="centered rod-wrapper">
      <div class="rod" :style="{ transform: `translateY(-${this.screenRodOffset}px)` }" />
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
  props: {
    shadowIndex: Number
  },
  data() {
    return {
      progress: 0,
      prevPosition: 0,
      screenRodOffset: 0,
      screenShadowOffset: 0,
      screenCurtainWidth: 0
    }
  },
  methods: {
    dragStart(e) {
      this.prevPosition = e.targetTouches[0].pageY
    },
    dragMove(e) {
      if (this.progress < 0 || this.progress >= 1) return
      const position = e.targetTouches[0].pageY
      const diff = position - this.prevPosition
      if (diff <= 0) return
      this.progress += diff / 2000
      if (this.progress > 1) this.progress = 1
      this.prevPosition = position
    },
    dragEnd(e) {
      this.$socket.emit('client_moveup_curtain', { index: this.shadowIndex, progress: this.progress })
    }
  },
  mounted() {
    const IMG_WIDTH = 1125
    const IMG_ROD_OFFSET = 800
    const IMG_SHADOW_OFFSET = 900
    const IMG_CURTAIN_WIDTH = 840
    const screenWidth = screen.width
    this.screenRodOffset = screen.width / IMG_WIDTH * IMG_ROD_OFFSET
    this.screenShadowOffset = screen.width / IMG_WIDTH * IMG_SHADOW_OFFSET
    this.screenCurtainWidth = screen.width / IMG_WIDTH * IMG_CURTAIN_WIDTH
  }
}
</script>

<style scoped>
.wrapper {
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

.shadow-wrapper {
  z-index: 2;
  width: 100%;
}

.shadow {
  width: 100%;
}
</style>
