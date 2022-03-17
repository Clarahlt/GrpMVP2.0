<template>
  <div id="home">
    <div class="container bloc-logo-groupomania">
      <img
        class="img-fluid img-logo-groupomania"
        src="../assets/icon-white.png"
        alt="logo de l'entreprise groupomania"
      />
    </div>
    <div class="connection">
      <button
        v-if@click="disappear"
        class="btn btn-connect"
        @click="connectForm"
      >
        Se connecter
      </button>
      <User v-if@click="revele" />
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import User from "@/components/User.vue";

export default {
  name: "home",
  components: {
    User,
  },
  data() {
    return {
      revele: false,
      disappear: true,
    };
  },
  methods: {
    connectForm() {
      (this.revele = true), (this.disappear = false);
    },
  },
};
</script>

<style scoped lang="scss">
.bloc-logo-groupomania {
  height: 400px;
}
.btn-connect {
  font-weight: bold;
  color: #3f3d56;
  border: 3px solid #3f3d56;
  border-radius: 25px;
}
.btn-connect:hover {
  color: #ff6363;
  border: 3px solid #ff6363;
}
</style>
