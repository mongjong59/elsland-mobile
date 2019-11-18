<template>
  <div class="wrapper">
    <h1 class="centered">
      <transition name="fade" mode="out-in">
        <div v-if="stage === 1" key="1">Connecting...</div>
        <div v-if="stage === 2" key="2">Connected</div>
      </transition>
    </h1>
  </div>
</template>

<script>
export default {
  name: 'ConnectionStatus',
  props: { goToNextScene: Function },
  sockets: {
    connect() {
      this.stage++
    },
    intro_scene() {
      this.goToNextScene()
    }
  },
  data() {
    return {
      stage: 1
    }
  }
}
</script>

<style scoped>
  .wrapper {
    background-image: url("../assets/images/connection-status-bg.png");
    height: 100%;
  }
</style>
