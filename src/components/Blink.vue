<template>
  <div class="blink" />
</template>

<script>
export default {}
</script>

<style scoped>
.blink {
  animation: blink 1s step-start forwards;
  height: 100%;
  width: 100%;
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
