<template>
  <div class="wrapper">
    <div class="carriage">

    </div>
  </div>
</template>

<script>
export default {
  name: '',
  props: {
    // msg: String
  }
}
</script>

<style scoped>
  .wrapper {
    background-image: url("../assets/images/train-bg.png");
    height: 100%;
  }

  .carriage {
    background-image: url("../assets/images/train-carriage-1.png");
    background-size: contain;
    background-repeat: no-repeat;
  }
</style>
