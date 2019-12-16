<template>
  <div class="blink" />
</template>

<script>
export default { name: 'Blink' }
</script>

<style scoped>
.blink {
  animation: blink 1s step-start forwards;
  height: 100%;
  width: 100%;
  top: 0;
  position: absolute;
}

@keyframes blink {
  0% {
    background: #2B2A2D;
  }
  20% {
    background: white;
  }
  30% {
    background: #2B2A2D;
  }
  50% {
    background: white;
  }
  60% {
    background: #2B2A2D;
  }
  70% {
    background: white;
  }
  100% {
    background: #2B2A2D;
  }
}
</style>
