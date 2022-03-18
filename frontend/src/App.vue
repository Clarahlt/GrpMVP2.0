<template>
  <div id="nav">
    <router-view/>
  </div>
</template>


<script>
export default { name: "App" }
</script>


<style lang="scss">
body{
  background: #A4C2A5;
  font-family: FontAwesome;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #4A4A48;
}
.img-fluid{
  width: 50%;
}
</style>
