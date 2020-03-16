<template>
  <div class="wrapper">
    <div class="centered text">
      <div>
        {{amPm}} {{hours}}:{{minutes}}:{{seconds}}
      </div>
      <div>
        DEC 20, 2019
      </div>
      <div class="restart button" @click="restart">
        Restart
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Elsland',
  data() {
    return {
      date: new Date()
    }
  },
  methods: {
    restart() {
      this.goToScene("CONNECTION_STATUS")
    }
  },
  computed: {
    seconds() {
      let s = this.date.getSeconds()
      if (s <= 9) s = "0" + s
      return s
    },
    minutes() {
      let m = this.date.getMinutes()
      if (m <= 9) m = "0" + m
      return m
    },
    hours() {
      let h = this.date.getHours()
      if (h > 12) h -= 12
      return h
    },
    amPm() {
      return this.date.getHours() > 12 ? "PM" : "AM"
    },
  },
  mounted() {
    setInterval(() => {
      this.date = new Date()
    }, 1000)
  }
}
</script>

<style scoped>
.wrapper {
  background: url("../assets/images/elsland-bg.jpg");
  background-size: cover;
  height: 100%;
}

.text {
  line-height: 2.2rem;
  font-family: acumin-pro, sans-serif;
  font-weight: 800;
  font-style: italic;
  font-size: 2rem;
}

.restart {
  display: inline-block;
  margin-top: 1rem;
}
</style>
