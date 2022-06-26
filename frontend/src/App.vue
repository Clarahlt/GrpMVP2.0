<template>
  <div id="app">
    <router-view/>
  </div>
</template>


<script>
export default { name: "App" }
</script>


<style lang="scss">
body{
  background: #4E5166;
  font-family: 'Lato', sans-serif;
}
#app {
  font-family: 'Lato', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #4A4A48;
}
.img-fluid{
  width: 50%;
}
</style>
