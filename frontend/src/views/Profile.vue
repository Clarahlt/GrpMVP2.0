<template>
    <div id="app">
        <Navbar/>
        <div class="container welcom">
            <h1 v-if="user" class="title">Bienvenue {{ user.username }} !</h1>
        </div>

        <!-- Affiche les informations du profil-->
        <div class ="container profile-infos">
            <div class="row background-profile">
                <div class="col-md-4 img-content">
                    <div class="img-profile">
                        <input type="file" ref="uploadFile" name="image" @change="onFileSelected"  accept="image/*" id="file-input" aria-label="Modifier ma photo de profil">
                        <label for="file-input"><ProfileImage :src="user.imageProfile" class="profile__photo__image"/></label>
                    </div>
                </div>
                <div class="col-md-8 navbar-profile">
                    <nav>
                        <ul class="nav">
                            <li class="navbar-item item-modify">
                            <div v-on:click="displayModify">
                            <i class="fa-solid fa-pen" id="icon"></i>
                            </div>
                            </li>
                        </ul>
                    </nav>
                </div>

                <!-- Bloc permettant de modifier le profil -->
                <div class="bloc" v-show="revele">
                    <div class="overlay"></div>
                    <div class="bloc-form">

                        <div @click="displayModify" class="icon-bloc-close">
                            <i class="far fa-times-circle fa-2x modaleBloc__card__title__close"></i>
                        </div>
                    <div class="form-content">
                        <div class="form-color">
                            <h2>Informations personnelles</h2>
                            <form @submit.prevent="onSubmit">

                                <div class="form-input row">
                                    <div class="bloc-upload-img">
                                            <label for="form-file-input" class="form-img-profile label-img-profile"><i class="fa-solid fa-file-arrow-up"></i><p>Changer ma photo de profil</p></label>
                                            <input type="file" ref="uploadFormFile" name="image" @change="onFormFileSelected"  accept="image/*" id="form-file-input" aria-label="Modifier ma photo de profil">
                                    </div>
                                </div>

                                <div class="form-input row">
                                    <label class="col-md-4" for="username">Pseudo: </label>
                                    <input class="col-md-8" type="text" name="username" id="username" v-model="username">
                                </div>
                                <div class="form-input row">
                                    <label class="col-md-4" for="lastname">Nom: </label>
                                    <input class="col-md-8" type="text" name="lastname" id="lastname" v-model="lastname">
                                </div>
                                <div class="form-input row">
                                    <label class="col-md-4" for="firstname">Prénom: </label>
                                    <input class="col-md-8" type="text" name="firstname" id="firstname" v-model="firstname">
                                </div>
                                <div class="form-input row">
                                    <label class="col-md-4" for="bio">Bio :</label>
                                    <input class="col-md-8" type="text" name="bio" id="bio" v-model="bio">
                                </div>
                                <div class="form-input row">
                                    <label class="col-md-4" for="email">Email: </label>
                                    <input class="col-md-8" type="text" name="email" id="email" v-model="email">
                                </div>

                                <button v-on:click="updateProfile" class="btn form-btn">Enregistrer</button>
                                
                                <!-- Permet d'accéder au bloc de suppression de compte -->
                                <div class="delete-account row">
                                    <button v-on:click="deleteProfile" class="btn display btn-danger">
                                    <DeleteAccount v-bind:display="display" v-bind:displayDeleteBloc="displayDeleteBloc" id="displayDeleteBloc" />
                                    Supprimer mon compte</button>
                                </div>
                            </form>
                        </div>
                    </div>
                    </div>
                </div>





            </div>
            <!-- informations du profil -->
            <div class="row profile-content">
                <div class="col-md-6 profile-cart">
                    <p class="name">{{ user.lastname}} {{user.firstname}}</p>
                    <p>Username: {{ user.username}}</p>
                    <p>Bio : {{ user.bio }}</p>
                    <p>Email: {{ user.email}}</p>
                </div>
            </div>
        </div>
        
    </div>
    
</template>

<script>
//Imports
import axios from 'axios'
import { Notyf } from 'notyf'
import 'notyf/notyf.min.css'

//Importe les composants
import Navbar from '../components/Navbar.vue'
import ProfileImage from '../components/ProfileImage.vue'
import DeleteAccount from '../components/DeleteAccount.vue'

    export default {
        name: 'Profile',
        components: {
            Navbar,
            ProfileImage,
            DeleteAccount
        },
        data(){
            return{
                display: false,
                revele: false,
                user: "",
                username: "",
                lastname: "",
                firstname: "",
                bio: "",
                email: "",
                imageProfile: null,
                bloc: false,
            }
        },
        created() {
			this.displayProfile(); 
            this.notyf = new Notyf({
                duration: 4000,
                position: {
                    x: 'center',
                    y: 'bottom'
                }
            });
		},
        methods: {
            //Permet d'afficher les informations du profil
            displayProfile() {
                const userId = localStorage.getItem('userId');

				axios.get('http://localhost:3000/api/users/profile/' + userId, {
					headers: {
                        'Content-Type' : "application/json",
						'Authorization': 'Bearer ' + localStorage.getItem('token')
					}
				})
				.then(response => {
					this.user = response.data.user;
                    localStorage.setItem('imageProfile', this.user.imageProfile)
				})
				.catch(error => {
					const msgerror = error.response.data
					this.notyf.error(msgerror.error)
				})

			},
            //Affiche le bloc permettant à l'utilisateur de modifier ses informations
            displayModify(){
                this.revele = !this.revele
            },
            onFileSelected(event) {
                this.$refs.uploadFile.click()
				this.imageProfile = event.target.files[0]
                if(this.imageProfile === null){
                    console.log("cant null");
                } else {
                    console.log(this.imageProfile);
                    this.uploadImgProfile();
                    
                }
			},
            //Permet d'ajouter ou modifier l'image du profil directement sur la fiche profil
            uploadImgProfile(){
                const userId = localStorage.getItem('userId')
                const imgData = new FormData();
                imgData.append("image", this.imageProfile)
                    axios.put('http://localhost:3000/api/users/profile/' + userId, imgData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
						'Authorization': 'Bearer ' + localStorage.getItem('token')
					}
                })
                .then((res) => {
                    const userImg = res.data.userFound.imageProfile
                    localStorage.setItem("imageProfile", userImg)
                    console.log(res.data);
                    window.location.reload()
                }).catch(error => {
					const msgerror = error.res.data
					this.notyf.error(msgerror.error)
				})
                
            },
            onFormFileSelected(event) {
				this.imageProfile = event.target.files[0]
			},
            uploadFormFile(){
                this.refs.uploadFormFile.click();
            },
            //Permet à l'utilisateur de modifier ses informations
            updateProfile(){
                const userId = localStorage.getItem('userId')
                const formData = new FormData();
                formData.append("image", this.imageProfile)
                formData.append("username", this.username)
                formData.append("lastname", this.lastname)
                formData.append("firstname", this.firstname)
                formData.append("bio", this.bio);
                formData.append("email", this.email);

                if(this.imageProfile == null && this.username == "" && this.lastname == "" && this.firstname == "" && this.bio == "" && this.email == ""){
                    console.log("Votre modification n'a pas pu être prise en compte !");
                    this.displayModify();
                } else {
                   axios.put('http://localhost:3000/api/users/profile/' + userId, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
						'Authorization': 'Bearer ' + localStorage.getItem('token')
				}
                 })
                .then((response) => {
                    this.user = response.data.user
                    window.location.reload();
                 })
                 .catch((error) => {
                    const msgerror = error.response.data;
                    this.notyf.error(msgerror.error)
                    
                })
                }
            },
            //Permet à l'utilisateur d'afficher le bloc de suppression de compte
            deleteProfile(){
                this.display = !this.display
            }
        
        }
    }
</script>

<style lang="scss" scoped>
.welcom{
    @media (max-width: 776px){
      padding-top: 100px;
    }
    h1{
        margin: 50px 0;
    }
}
.profile-infos{
    border-radius: 15px;
    width: 90%;
    margin: auto;
    
    .background-profile{
        height: 250px;
        border-radius: 10px;
        background: url("../assets/vecteur-fond.jpg");
        background-size: cover;
        position: relative;
        .img-content{
            margin: auto;
            @media (max-width: 775px) {
                position: relative;
                top: 25px;
            }
            .img-profile{
                width: 200px;
                height: 200px;
                display: inline-flex;
                border: 2px solid white;
                border-radius: 50%;
                overflow: hidden;
                .image{
                    width: 300px;
                    height: 200px;
                    border-radius: 100%;
                    position: relative;
                    right: 21%;
                    top: -2%;
                }
                input{
                    display: none;
                }
            }
        }
    }
    .profile-content{
        background: white;
        position: relative;
        top: -10px;
        z-index: -1;
    }
    .navbar-profile{
        .nav{
            justify-content: right;
            position: relative;
            top: 10px;
            @media (max-width: 775px) {
                justify-content: right;
                position: absolute;
                top: 0;
                right: 0
            }
            li{
                list-style: none;
                #icon{
                    color: white;
                    padding: 10px;
                    font-size: 25px;
                    border-radius: 50px;
                }
                #icon:hover{
                    background: lightgrey;
                }
            }
        }
        
    }
    .bloc{
        position: absolute;
        .overlay {
            background: rgba(0,0,0,0.5);
            position: fixed;
            top: 0;
            bottom: 0;
            left: 0;
            right: 0;
            }
        .bloc-form{
            position: fixed;
            top: 0;
            bottom: 0;
            left: 0;
            right: 0;
            background: lightgrey;
            border-radius: 10px;
            padding: 40px;
            width: 45%;
            margin: 15px auto;
            @media (max-width: 776px){
                width: 95%;
                padding: 0;
            }
            .icon-bloc-close{
                position: absolute;
                top: 10px;
                right: 10px;
                &:hover, &:focus {
                    color: #ff6363;
                    }
            }
            .form-color{
                background: white;
                width: 80%;
                padding: 20px 20px 10px 20px;
                margin: auto;
                border-radius: 10px;
                @media (max-width: 776px){
                width: 100%;
                }
                .bloc-upload-img{
                    display: grid;
                    margin-bottom: 35px;
                    .label-img-profile{
                        text-align: center;
                        font-size: 40px;
                        p{
                            font-size: 20px;
                            margin: 0;
                        }
                    }
                    #form-file-input{
                        display: none;
                    }
                }
                .btn-img-profile{
                    font-size: 40px;
                }
                .form-btn{
                    border: 3px solid #3f3d56;
                    border-radius: 25px;
                    color: #3f3d56;
                    font-weight: bold;
                    margin: 20px auto;
                    &:hover, &:focus {
                    border: 3px solid #ff6363;
                    color: #ff6363;
                    }   
                }
                h2{
                    margin-bottom: 30px;
                    font-size: 30px;
                }
                .form-input{
                    margin: 5px 10px;
                    @media (max-width: 776px){
                        margin: 0;
                    }
                    label{
                        text-align: left;
                    }
                    input{
                        padding-left: 15px;
                    }
                }
            }
        }
    }
    .profile-cart{
        text-align: left;
        margin-left: 20px;
        padding: 35px;
        .name{
            font-size: 35px;
            font-weight: bold;
        }
    }
}
</style>