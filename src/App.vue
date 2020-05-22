<template>
  <div id="app" class="ev-scrollbar">
    <router-view/>
  </div>
</template>

<script>
  export default {
    name: 'App',
    mounted () {
      console.log("mounted method is running in App.vue file.")
      // 防止页面刷新后vuex中的userinfo重置，从sessionStorage中取出userinfo
      this.$store.getters.getStorage
    }
  }
</script>
<style lang="scss">
  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    /*text-align: center;*/
    color: #2c3e50;
  }

  #app, html, body {
    height: 100%;
  }
  #app{
    overflow-x: auto;
    overflow-y: auto;
  }

</style>
