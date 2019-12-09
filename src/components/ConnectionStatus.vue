<template>
  <div class="wrapper">
    <transition name="fade" mode="out-in">
      <h1 class="centered" v-if="stage === 1">Connecting...</h1>
      <div v-if="stage >= 2">
        <transition name="fade" mode="out-in">
          <img class="welcome" v-if="stage === 2" src="../assets/images/connection-status-welcome.svg" />
          <p class="instruction" v-if="stage === 3">
            Most of the experience will be on the BIG SCREEN.
            <br />
            <br />
            When you notice yellow particles on the screen, look back onto your phone.
          </p>
        </transition>
        <transition name="entrance-animation" delay="5000">
          <img v-if="stage <= 4" class="entrance" src="../assets/images/connection-status-entry.png" />
        </transition>
        <transition name="silhouette-animation">
          <img v-if="stage <= 4" class="silhouette" src="../assets/images/connection-status-silhouette.png" />
        </transition>
      </div>
    </transition>
    <Blink v-if="stage === 6" />
  </div>
</template>

<script>
import Blink from "./Blink"

export default {
  name: 'ConnectionStatus',
  components: {
    Blink
  },
  props: {
    goToNextScene: Function,
    development: Boolean
   },
  watch: {
    stage: function(val) {
      // welcome
      if (val === 2) {
        setTimeout(() => { this.stage = 3 }, 5000)
      }
      if (val === 3 && this.development) {
        setTimeout(() => { this.stage = 4 }, 6000)
      }
      if (val === 4) {
        setTimeout(() => { this.stage = 5 }, 1000)
      }
      if (val === 5) {
        setTimeout(() => { this.stage = 6 }, 8000)
      }
      if (val === 6) {
        setTimeout(() => { this.goToNextScene() })
      }
    }
  },
  sockets: {
    connect() {
      this.stage = 2
    },
    intro_scene() {
      this.stage = 4
    },
  },
  data() {
    return {
      stage: 1
    }
  },
  mounted() {
    setTimeout(() => { this.development && this.stage++ }, 1000)
  }
}
</script>

<style scoped>
.wrapper {
  background-image: url("../assets/images/connection-status-bg.png");
  height: 100%;
}

.wrapper.fade-leave-to {
  opacity: 1;
}

.welcome, .instruction, .entrance, .silhouette {
  left: 50%;
  transform: translateX(-50%);
  position: absolute;
}

.welcome {
  width: 55%;
  z-index: 3;
  top: 35%;
  transform: translate(-50%, -50%);
}

.instruction {
  width: 70%;
  top: 25%;
  font-size: 1.2rem;
  z-index: 10;
}

.entrance {
  transition: all 2s ease-in 5s;
  transform-origin: center center;
  z-index: 1;
  width: 77%;
  bottom: 0;
  animation: blink 1.5s infinite alternate;
}

.silhouette {
  z-index: 2;
  width: 32%;
  bottom: 0;
}

.entrance-animation-leave-active {
  transform: translateX(-50%) scaleX(0.01);
}

.silhouette-animation-leave-active {
  animation: silhouette-animation 5s ease-in;
}

@media only screen and (max-height: 720px) {
  .instruction {
    font-size: 1rem;
    top: 25%;
    transform: translate(-50%, -50%);
    margin: 0;
  }
}

@keyframes blink {
  0%  {
    opacity: 100%;
  }
  5%  {
    opacity: 90%;
  }
  7%  {
    opacity: 80%;
  }
  9%  {
    opacity: 70%;
  }
  11%  {
    opacity: 80%;
  }
  15%  {
    opacity: 100%;
  }
}

@keyframes silhouette-animation {
  0%  {
    transform: translateX(-50%) translateY(0) scale(1);

  }
  30% {
    opacity: 100%;
  }
  100% {
    transform: translateX(-50%) translateY(-80px) scale(0.2);
    opacity: 0%;
  }
}
</style>
