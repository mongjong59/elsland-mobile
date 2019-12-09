<template>
  <div class="wrapper" @touchstart="dragStart" @touchmove="dragMove">

  </div>
</template>

<script>

export default {
  data() {
    return {
      start: 0,
    }
  },
  methods: {
    dragMove() {
      console.log("moving")
    }
  }
}
</script>

<style scoped>
.wrapper {
}


</style>
