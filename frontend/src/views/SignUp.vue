<template>
<div class="home">
  <div class="container bloc-logo-groupomania">
    <img class="img-fluid img-logo-groupomania" src="../assets/icon-white.png" alt="logo de l'entreprise groupomania"/>
  </div>
  <div class="signup">
    <!-- Formulaire de création de compte -->
    <form @submit.prevent="login" class="signup-form">
        <h1>S'inscrire</h1>

        <div class="form-input">
            <label for="username" class="form-username">Username</label>
            <input type="username" id="username" name="username" v-model="username" placeholder="username">
        </div>

        <div class="form-input">
            <label for="lastname" class="form-lastname">Nom</label>
            <input type="lastname" id="lastname" name="lastname" v-model="lastname" placeholder="lastname">
        </div>

        <div class="form-input">
            <label for="firstname" class="form-firstname">Prénom</label>
            <input type="firstname" id="firstname" name="firstname" v-model="firstname" placeholder="firstname">
        </div>

        <div class="form-input">
            <label for="email" class="form-mail">Email</label>
            <input type="email" id="email" name="email" v-model="email" placeholder="email">
        </div>

        <div class="form-input">
            <label for="password" class="form-password">Mot de passe</label>
            <input type="password" id="password" name="password" v-model="password" placeholder="Tapez votre mot de passe">
        </div>

        <button class="btn btn-primary btn-form" v-on:click="postUser()" type="button"> S'incrire </button>
        
        <!-- Lien de redirection vers la page de connexion -->
        <p>Vous avez déjà un compte? <router-link to="/" class="home-display-login-form">Se connecter</router-link></p>
      
      </form>
    </div> 
  </div>
</template>


<script>
//imports
import axios from 'axios';
import { Notyf } from 'notyf'
import 'notyf/notyf.min.css'

export default {
    name: 'Signup',
    data(){
        return {
            username: "",
            lastname: "",
            firstname: "",
            email: "",
            password: "",
        }
    },
    created() {
            this.notyf = new Notyf({
                duration: 4000,
                position: {
                    x: 'center',
                    y: 'bottom'
                }
            });
        },
    methods: {
      //Permet de s'inscrire et de basculer sur la page d'entrée
        postUser(){
          axios.post('http://localhost:3000/api/users/signup', {
                    username: this.username,
                    lastname: this.lastname,
                    firstname: this.firstname,
                    email: this.email,
                    password: this.password,
                    
                })
                .then((response) => {
                  console.log(response.data);
                    this.notyf.success('Votre compte a bien été créé ! A présent, veuillez vous connecter.')
                    this.$router.push('/');
                })
                .catch(error => {
                    const msgerror = error.response.data
                    this.notyf.error(msgerror.error)
                })
        }
    }
}


</script>


<style scoped lang="scss">
.bloc-logo-groupomania{
  height: 400px;
  @media (max-width: 776px) {
    height: 220px;
    img{
      width:95%
    }
  }
}
.signup-form{
  border: 3px solid #3f3d56;
  border-radius: 25px;
  background: linear-gradient(0deg, white, transparent);
  width: 35%;
  margin: auto;
  color: white;
  @media (max-width: 776px) {
    width: 90%;
    margin-bottom: 10px;
  }
  h1{
    margin: 25px auto;
  }
  .form-title{
    margin: 40px;
  }
  .form-input{
    display: flex;
    flex-direction: column;
    width: 60%;
    margin: 15px auto;
    label{
      text-align: left;
    }
    input{
      margin: 5px 0;
      height: 25px;
    }
  }
  .btn-form{
    margin: 15px;
    width: 30%;

  }
  p{
    margin: 25px;
    color: #4E5166;
  }
}

</style>