<template>
  <div id="home" class="home">
    <div class="container bloc-logo-groupomania">
      <img
        class="img-fluid img-logo-groupomania"
        src="../assets/icon-white.png"
        alt="logo de l'entreprise groupomania"
      />
    </div>
    <!-- Affiche le bloc de connexion -->
    <div class="connection">
      <button v-if@click="disappear" class="btn btn-connect" @click="connectForm"> Se connecter </button>
      <User v-if@click="revele" />
    </div>
  </div>
</template>

<script>
//Imports
import User from "@/components/User.vue";
import axios from 'axios';

import { Notyf } from 'notyf'
import 'notyf/notyf.min.css'

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
  created(){
    this.AlreadyLogin();
    this.notyf = new Notyf({
                duration: 4000,
                position: {
                    x: 'center',
                    y: 'bottom'
                }
            });
  },
  methods: {
    //Permet d'afficher le bloc de connexion
    connectForm() {
      (this.revele = true), (this.disappear = false);
    },
    AlreadyLogin(){
      const userId = localStorage.getItem('userId')
      console.log(userId);
      const token = localStorage.getItem('token')
      axios.get('http://localhost:3000/api/users/profile/' + userId, {
                    headers: {
                        'Content-Type' : 'application/json',
                        'Authorization': 'Bearer ' + localStorage.getItem('token')
                    }
                })
                .then((res) => {
                  if(res.data.user.token === token){
                    this.notyf.success('Ravie de vous revoir si vite')
                    this.$router.push('/posts')
                  }
                })
    }
  },
};
</script>

<style scoped lang="scss">
.bloc-logo-groupomania {
  height: 400px;
  @media (max-width: 776px) {
    height: 220px;
    img{
      width:95%
    }
  }
}
.btn-connect {
  font-weight: bold;
  color: white;
  border: 3px solid #3f3d56;
  border-radius: 25px;
}
.btn-connect:hover {
  color: #ff6363;
  border: 3px solid #ff6363;
}
</style>
