<template>
  <div class="wrapper" @touchmove="cut" @mousemove="cut">
    <div class="inner-wrapper" :style="{ backgroundImage: innerWrapperBackground }">
      <div class="centered-horizontal train" />
      <div class="centered-horizontal" id="carriage-container" ondragstart="return false;" ondrop="return false;">
        <div ref="carriage1" id="carriage-1" class="carriage">
          <img :src="carriageImg" :style="{ webkitClipPath: clipPathLeft }" />
        </div>
        <div ref="carriage2" id="carriage-2" class="carriage">
          <img :src="carriageImg" :style="{ webkitClipPath: clipPathRight }" />
        </div>
        <transition name="fade">
          <div v-if="!cutCompleted" class="carriage-divider-wrapper" :style="{ transform: dividerTransform }">
            <div class="centered carriage-divider" :style="{ width: dividerWidth, webkitClipPath: clipPathDivider }" />
          </div>
        </transition>
        <div class="particle-wrapper" :style="{ transform: dividerTransform }">
          <div class="centered" :style="{ width: particleWrapperWidth }">
            <div class="particle" :style="{ right: particleRight }" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { TimelineLite } from 'gsap/dist/gsap'

export default {
  name: 'Train',
  props: {
    top: Number,
    bottom: Number,
    cutIndex: Number,
    segmentIndex: Number,
    goToWaiting: Function,
    stopCountdown: Function,
    development: Boolean
  },
  data() {
    return {
      progress: 0,
      carriageImgWidth: 0,
      carriageImgHeight: 0,
      dividerMultiple: 1.3
    }
  },
  watch: {
    progress(newProgress) {
      if (newProgress >= 1) {
        this.stopCountdown()
        this.$socket.emit("client_cut", this.cutIndex)
        if (this.development) {
          setTimeout(() => { this.explode() }, 1000)
          setTimeout(() => { this.goToWaiting() }, 3000)
        }
      }
    }
  },
  computed: {
    clipPathLeft() {
      return this.clipPath()
    },
    clipPathRight() {
      return this.clipPath(true)
    },
    clipPathDivider() {
      if (this.progress === 0) return
      const percentage = (1 - (0.05 / (this.dividerMultiple / 2) + this.progress / this.dividerMultiple)) * 100
      if (this.top > this.bottom) {
        return `polygon(0 0, ${percentage}% 0, ${percentage}% 100%, 0 100%)`
      } else {
        return `polygon(100% 0, ${100 - percentage}% 0, ${100 - percentage}% 100%, 100% 100%)`
      }
    },
    dividerDegree() {
      const diff = (this.bottom - this.top) * 100
      const tan = this.carriageImgHeight / (diff / 100 * this.carriageImgWidth)
      return Math.atan(tan) / (Math.PI / 180)
    },
    dividerTransform() {
      const translateX = 0.5 * (this.top + this.bottom - 1) * 100
      const degree = Math.round(this.dividerDegree)
      return `translate(${translateX}%, -50%) rotate(${degree}deg)`
    },
    particleWrapperWidth() {
      const radian = 2 * Math.PI / 360 * this.dividerDegree
      const sin = Math.sin(radian)
      const width = Math.abs(this.carriageImgHeight / this.carriageImgWidth / sin * 100)
      return width + '%'
    },
    dividerWidth() {
      return this.dividerMultiple * (parseInt(this.particleWrapperWidth)) + '%'
    },
    cutCompleted() {
      return this.progress >= 1
    },
    innerWrapperBackground() {
      const url = require(`../assets/images/train-thumbnail-${this.segmentIndex + 1}.png`)
      return `url(${url})`
    },
    particleRight() {
      let portion
      if (this.top >= this.bottom) {
        portion = this.progress
      } else {
        portion = 1 - this.progress
      }
      return portion * 100 + '%'
    },
    carriageImg() {
      return require(`../assets/images/train-carriage-${this.segmentIndex + 1}.png`)
    }
  },
  methods: {
    cut(e) {
      if (this.progress > 1) this.progress = 1
      if (this.progress >= 1) return

      const STEP = 0.1
      const TOUCH_DISTANCE = 30;

      const container = document.getElementById('carriage-container')
      const rect = container.getBoundingClientRect()
      let touch = e
      if (e.targetTouches) touch = e.targetTouches[0]


      const containerWidth = container.offsetWidth
      const gapTopX = rect.left + containerWidth * this.top
      const gapBottomX = rect.left + containerWidth * this.bottom
      const nextPointX = gapTopX + (gapBottomX - gapTopX) * (this.progress + STEP)

      const containerHeight = container.offsetHeight
      const nextPointY = rect.top + containerHeight * (this.progress + STEP)

      const diffX = Math.abs(touch.pageX - nextPointX)
      const diffY = Math.abs(touch.pageY - nextPointY)
      const distance = Math.sqrt(diffX * diffX + diffY * diffY)

      if (distance < TOUCH_DISTANCE) {
        if (this.progress > 0.9) {
          this.progress = 1
        } else {
          this.progress = this.progress + STEP
        }
      }
    },
    explode() {
      const container = document.getElementById('carriage-container')
      container.style.height = container.offsetHeight + 'px'
      const { carriage1, carriage2 } = this.$refs
      const timeline = new TimelineLite()
      timeline.to(carriage1, 2, { y: 600, x: -300, rotate: -30, scale: 0.5, rotateX: 90, rotateY: 90 })
      timeline.to(carriage2, 2, { y: 600, x: +300, rotate: 50, scale: 0.2, rotateX: 90, rotateY: 90 }, 0)
    },
    clipPath(right = false) {
      const cutPointX = this.top * 100 - (this.top - this.bottom) * 100 * this.progress
      const progress = this.progress * 100
      const dividerHeight = 2
      if (!right) {
        return `polygon(0 0, ${this.top * 100 - dividerHeight}% 0, ${cutPointX - dividerHeight}% ${progress}%, ${cutPointX}% ${progress}%, ${this.bottom * 100}% 100%, 0 100%)`
      } else {
        return `polygon(100% 0, ${this.top * 100 + dividerHeight}% 0, ${cutPointX + dividerHeight}% ${progress}%, ${cutPointX}% ${progress}%, ${this.bottom * 100}% 100%, 100% 100%)`
      }
    }
  },
  sockets: {
    cut_piece_fall() {
      this.explode()
    }
  },
  created() {
    const img = new Image()
    img.src = this.carriageImg
    img.onload = () => {
      this.carriageImgWidth = img.width
      this.carriageImgHeight = img.height
    }
  }
}
</script>

<style scoped>
.wrapper {
  background-image: url("../assets/images/train-bg.jpg");
  background-position: bottom;
  height: 100%;
}

.inner-wrapper {
  height: 100%;
  background-size: contain;
}

#carriage-container {
  width: 80%;
  height: fit-content;
  bottom: 30%;
}

.carriage {
  height: fit-content;
}

.carriage img {
  width: 100%;
  transition: all 0.1s;
}

#carriage-1, #carriage-2 {
  background-size: contain;
  width: 100%;
}

#carriage-2 {
  top: 0;
  position: absolute;
}

.carriage-divider-wrapper, .particle-wrapper {
  width: 100%;
  position: absolute;
  top: 50%;
}

.carriage-divider {
  border-top: 3px white dashed;
}

.particle {
  top: 50%;
  transform: translate(50%, -50%);
  position: absolute;
  height: 50px;
  width: 50px;
  background: url("../assets/images/train-particle.png")
}

.fall-left-leave-active, .fall-right-leave-active {
  -webkit-transition: -webkit-transform 1.5s cubic-bezier(1, 0, 1, 0);
  transition: transform 1.5s cubic-bezier(1, 0, 1, 0);
  /* -webkit-transition: -webkit-transform 1000ms;
  -webkit-transition: transform 1000ms;
  transition: all 1000ms; */
}

.fall-left-leave-to {
  transform: rotate(-30deg) scale(0.3) translateX(-800px) translateY(1300px);
  /* -webkit-transform: scale(3);
  transform: scale(3); */
}

.fall-right-leave-to {
  transform: rotate(30deg) scale(0.3) translateX(800px) translateY(1300px);
  /* -webkit-transform: scale(3);
  transform: scale(3); */
}
</style>
