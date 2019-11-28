<template>
  <div class="wrapper">
      <transition name="fade" mode="out-in">
        <h1 class="centered" v-if="stage === 1" key="1">Connecting...</h1>
        <div v-if="stage === 2" key="2">
          <img class="text" v-if="stage === 2" src="../assets/images/connection-status-welcome.svg" />
          <img class="entrance" v-if="stage === 2" src="../assets/images/connection-status-entry.png" />
          <img class="silhouette" v-if="stage === 2" src="../assets/images/connection-status-silhouette.png" />
        </div>
      </transition>
  </div>
</template>

<script>
export default {
  name: 'ConnectionStatus',
  props: { goToNextScene: Function },
  sockets: {
    connect() {
      this.stage++
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

.text, .entrance, .silhouette {
  left: 50%;
  transform: translateX(-50%);
  position: absolute;
}

.text {
  width: 55%;
  z-index: 3;
  top: 35%;
  transform: translate(-50%, -50%);
}

.entrance {
  z-index: 1;
  width: 77%;
  bottom: 0;
}

.silhouette {
  z-index: 2;
  width: 32%;
  bottom: 0;
}

@keyframes blink {
  0%   {opacity: 100%;}
  25%  {top: 80%;}
  50%  {top: 100%;}
  75%  {top: 70;}
  100% {top: 0px;}
}
</style>
