<template>
  <div class="wrapper">
    <!-- <div class="ref-particle" :style="{ left: this.particleCenterPosition.x + 'px', top: this.particleCenterPosition.y + 'px'}" />
    <div class="ref-jellyfish-head" :style="{
      left: this.jellyfishHeadCenterPosition.x + 'px',
      top: this.jellyfishHeadCenterPosition.y + 'px'}"
    /> -->
    <img
      class="centered halo"
      src="../assets/images/staircase-halo.png"
      :style="{ animationDuration: this.animationDuration }"
    />
    <div class="overlay-wrapper">
      <img
        class="overlay"
        src="../assets/images/staircase-bg-overlay.png"
      />
    </div>
    <vue-draggable-resizable
      :draggable="!completed"
      id="particle-wrapper"
      ref="particleWrapper"
      :x="particleInitialPosition.x"
      :y="particleInitialPosition.y"
      :z="99"
      :drag-handle="'.handle'"
      :style="{ width: this.screenParticleSidePercentage + '%' }"
      @dragging="onDragging"
      @dragstop="onDragstop"
    >
      <img
        id="particle"
        :class="{ completed }"
        src="../assets/images/particle.png"
        :style="{ animationDuration: this.animationDuration }"
      />
      <div class="centered handle" :style="{ height: handleSideLength + 'px', width: handleSideLength + 'px' }" />
    </vue-draggable-resizable>
    <audio ref="audio">
      <source src="../assets/audio/staircase.wav" type="audio/wav">
      Your browser does not support the audio element.
    </audio>
    <div class="debug">{{ debug }}</div>
    <div class="debug2">{{ debug2 }}</div>
    <transition name="fade">
      <div v-show="!active">
        <div class="overlay">
          <h1 class="centered">Wait...</h1>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import VueDraggableResizable from 'vue-draggable-resizable'
import { TimelineLite, TweenLite, Sine } from 'gsap/dist/gsap'

export default {
  name: 'Staircase',
  props: {
    screenIndex: Number,
    lightIndex: Number,
    development: Boolean,
    goToWaiting: Function,
    stopCountdown: Function
  },
  data() {
    return {
      prevPosition: 0,
      bgWidth: 0,
      bgHeight: 0,
      debug: "",
      debug2: "",
      completed: false,
      screenParticleSidePercentage: 70,
      particleX: 0,
      particleY: 0,
      initialDistance: 0,
      developmentActive: false
    }
  },
  components: {
    'vue-draggable-resizable': VueDraggableResizable
  },
  computed: {
    active() {
      return this.developmentActive || this.screenIndex != -1 && this.lightIndex != -1
    },
    particleSize() {
      return window.innerWidth * this.screenParticleSidePercentage / 100
    },
    particleInitialPosition() {
      const { particleSize } = this
      const x = window.innerWidth * 0.3
      const y = window.innerHeight - particleSize + 0.17 * particleSize
      return { x, y }
    },
    particleCenterPosition() {
      const x = this.particleX + this.particleSize / 2
      const y = this.particleY + this.particleSize / 2
      return { x, y }
    },
    jellyfishHeadCenterPosition() {
      const x = 0.43 * window.innerWidth

      const bgHeight = window.innerWidth / this.bgWidth * this.bgHeight
      const y = bgHeight * 0.32 - (0.5 * (bgHeight - window.innerHeight))

      return { x, y }
    },
    handleSideLength() {
      return this.particleSize * 0.5
    },
    distance() {
      const diffX = this.particleCenterPosition.x - this.jellyfishHeadCenterPosition.x
      const diffY = this.particleCenterPosition.y - this.jellyfishHeadCenterPosition.y
      return Math.sqrt(diffX * diffX + diffY * diffY)
    },
    progress() {
      let progress = (this.initialDistance - this.distance) / this.initialDistance
      if (progress < 0) progress = 0
      return progress
    },
    animationDuration() {
      return (this.progress.toFixed(2) * 2 + 1) + 's'
    }
  },
  methods: {
    complete() {
      // const particle = document.getElementById("particle-wrapper");
      // TweenLite.killTweensOf(particle)
      this.completed = true
      const { audio, particleWrapper } = this.$refs
      audio.play()
      const timeline = new TimelineLite()
      const { x, y } = this.jellyfishHeadCenterPosition
      const left = x - this.particleSize / 2
      const top = y - this.particleSize / 2
      timeline.to(particleWrapper, 1.5, { left, top, ease: Sine.easeOut })
    },
    onDragging(left, top) {
      this.particleX = left
      this.particleY = top
    },
    onDragstop() {
      if (this.progress > 0.82) this.complete()

      let { progress } = this
      if (this.completed) progress = 1
      this.$socket.emit('client_turnon_light', {
        screen_index: this.screenIndex,
        light_index: this.lightIndex,
        progress: this.progress
      })
      if (this.development && this.progress >= 1) {
        setTimeout(() => { this.goToWaiting() }, 1000)
      }
    }
  },
  mounted() {
    this.particleX = this.particleInitialPosition.x
    this.particleY = this.particleInitialPosition.y
    const img = new Image()
    img.src = require("../assets/images/staircase-bg.jpg")
    img.onload = () => {
      this.bgWidth = img.width
      this.bgHeight = img.height

      this.initialDistance = this.distance
    }

    setTimeout(() => { this.developmentActive = true }, 5000)
    // const particle = document.getElementById("particle-wrapper");
    //
    // const randomX = random(10, 20);
    // const randomY = random(20, 30);
    // const randomDelay = random(0, 1);
    // const randomTime = random(3, 5);
    // const randomTime2 = random(5, 10);
    // const randomAngle = random(8, 12);
    //
    // TweenLite.set(particle, {
    //   x: randomX(-1),
    //   y: randomX(1),
    //   rotation: randomAngle(-1)
    // });
    //
    // moveX(particle, 1);
    // moveY(particle, -1);
    // rotate(particle, 1);
    //
    // function rotate(target, direction) {
    //   TweenLite.to(target, randomTime2(), {
    //     rotation: randomAngle(direction),
    //     // delay: randomDelay(),
    //     ease: Sine.easeInOut,
    //     onComplete: rotate,
    //     onCompleteParams: [target, direction * -1]
    //   });
    // }
    //
    // function moveX(target, direction) {
    //   TweenLite.to(target, randomTime(), {
    //     x: randomX(direction),
    //     ease: Sine.easeInOut,
    //     onComplete: moveX,
    //     onCompleteParams: [target, direction * -1]
    //   });
    // }
    //
    // function moveY(target, direction) {
    //   TweenLite.to(target, randomTime(), {
    //     y: randomY(direction),
    //     ease: Sine.easeInOut,
    //     onComplete: moveY,
    //     onCompleteParams: [target, direction * -1]
    //   });
    // }
    //
    // function random(min, max) {
    //   const delta = max - min;
    //   return (direction = 1) => (min + delta * Math.random()) * direction;
    // }
  }
}
</script>

<style scoped>
.wrapper {
  height: 100%;
  background: url("../assets/images/staircase-bg.jpg") center;
  background-size: cover;
}

.halo {
  mix-blend-mode: screen;
  width: 100%;
  animation-name: halo-animation;
  animation-iteration-count: infinite;
  animation-timing-function: ease-in-out;
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

.jellyfish-wrapper {
  width: 80%;
}

.jellyfish {
  width: 100%;
  mix-blend-mode: overlay;
}

#particle {
  width: 100%;
  animation-name: particle-animation;
  animation-timing-function: ease-in-out;
  animation-iteration-count: infinite;
}

#particle.completed {
  animation-name: particle-completed-animation;
}

.handle {
  border-radius: 50%;
  /* background: yellow; */
}

.ref-particle, .ref-jellyfish-head {
  height: 5px;
  width: 5px;
  background: red;
  position: absolute;
}

.debug {
  top: 0;
  position: absolute;
}

.debug2 {
  top: 20px;
  position: absolute;
}

.overlay {
  opacity: 0.8;
  height: 100%;
  background: black;
  z-index: 200;
  position: absolute;
}

@keyframes halo-animation {
  0%  {
    opacity: 0;
  }
  50% {
    opacity: 0.9;
  }
  100% {
    opacity: 0;
  }
}

@keyframes particle-animation {
  0%  {
    opacity: 0.85;
  }
  50% {
    opacity: 1;
  }
  100% {
    opacity: 0.85;
  }
}

@keyframes particle-completed-animation {
  0%  {
    transform: scale(1.2);
  }
  50% {
    transform: scale(1.3);
  }
  100% {
    transform: scale(1.2);
  }
}
</style>
