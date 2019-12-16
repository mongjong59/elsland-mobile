<template>
  <div class="wrapper">
    <div class="centered container">
      <img class="logo" src="../assets/images/logo-white.svg" />
      <p class="text">Wait for next interaction!</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Waiting'
}
</script>

<style scoped>
.wrapper {
  z-index: 999;
  position: absolute;
  top: 0;
  width: 100%;
  background: black;
  font-size: 1.2rem;
  margin: 0 auto;
  height: 100%;
}

.wrapper.fade-enter-active {
  transition-delay: 1.5s;
}

.container {
  width: 85%;
}

.text {
  margin: 0 auto;
}
</style>
