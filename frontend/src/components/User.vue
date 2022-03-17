<template>
  <div class="user">
    <div class="login">
      <form @submit.prevent="login" class="login-form">
        <h1>Se connecter</h1>

        <div class="form-input">
            <label for="mail" class="form-mail">Email</label>
            <input type="email" id="mail" name="mail" v-model="email" placeholder="email">
        </div>

        <div class="form-input">
            <label for="password" class="form-password">Mot de passe</label>
            <input type="password" id="password" name="password" v-model="password" placeholder="Tapez votre mot de passe">
        </div>

        <button class="btn btn-form" v-on:click="login()">Connexion</button>

        <p>Vous n'avez pas encore de compte?<router-link to="/signup" class="signup-form">S'inscrire</router-link></p>
      
      </form>
    </div>
    
  </div>
</template>

<script>
import axios from 'axios'
import { Notyf } from 'notyf'
import 'notyf/notyf.min.css'

export default {
  name: 'user',
  data () {
    return {
      email: "",
      password: ""
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
    login() {
        axios.post('http://localhost:3000/api/users/login', {
                    email: this.email,
                    password: this.password,
                    
                })
                .then(() => {
                    this.notyf.success('Ravie de vous revoir')
                    this.$router.push('/Posts');
                })
                .catch(error => {
                    const msgerror = error.response.data
                    this.notyf.error(msgerror.error)
                })
            }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.user{
  animation: fadein 3s;
}
@keyframes fadein {
    from {
        opacity:0;
    }
    to {
        opacity:1;
    }
}
.login-form{
  border: 3px solid #3f3d56;
  border-radius: 25px;
  background: linear-gradient(0deg, #24586d, transparent);
  width: 35%;
  margin: auto;
  h1{
    margin:25px auto;
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
    border: 3px solid #3f3d56;
    font-weight: bold;
    border-radius: 25px;
    color: #3f3d56;
    margin: 15px;
    width: 30%;
    &:hover{
      border: 3px solid #ff6363;
      color: #ff6363;
    }
    a{
      text-decoration: none;
      color: #3f3d56;
      &:hover{
        color: #ff6363;
      }
    }
  }
  p{
    margin: 25px;
  }
}

</style>
