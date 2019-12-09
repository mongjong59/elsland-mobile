<template>
  <div class="wrapper">
    <transition name="collapse">
      <div v-if="!buttonPressed" class="screen" />
    </transition>
    <div class="remote-control-wrapper">
      <img :class="{ inclined: buttonDown }" class="remote-control" :src="remoteControlImg" />
      <div class="button centered-horizontal" @touchstart="onButtonDown" @touchend="onButtonUp" />
    </div>
  </div>
</template>

<script>
export default {
  name: 'Screens',
  props: {
    development: Boolean
  },
  data() {
    return {
      buttonDown: false,
      buttonPressed: false
    }
  },
  methods: {
    onButtonDown() {
      if (this.buttonPressed) return
      this.$socket.emit('client_turnoff_screen')
      this.buttonDown = true
      this.buttonPressed = true
    },
    onButtonUp() {
      this.buttonDown = false
    }
  },
  computed: {
    remoteControlImg() {
      const suffix = this.buttonDown ? "-pressed" : ""
      return require(`../assets/images/screens-remote-control${suffix}.png`)
    }
  }
}
</script>

<style scoped>
.wrapper {
  background: #220219;
  height: 100%;
}

.screen {
  transition: transform 1s cubic-bezier(0.75, 0, 1, 0.25);
  background: url('../assets/images/screens-bg.png');
  background-size: cover;
  height: 100%;
}

.remote-control-wrapper {
  transform: translate(-50%, 60px);
  bottom: 0;
  left: 50%;
  position: absolute;
  width: 120%;
}

.remote-control {
  width: 100%;
}

.button {
  top: 0;
  width: 60px;
  height: 60px;
}

.inclined {
  transform: rotateX(20deg);
}

.collapse-leave-to {
  transform: scaleY(0.01);
}
</style>
