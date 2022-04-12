<template>
    <div id="app">
        <Navbar/>
        <div class="container welcom">
            <h1 v-if="user" class="title">Bienvenue {{ user.username }} !</h1>
        </div>
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
                            <a v-on:click="displayModify">
                            <i class="fa-solid fa-pen" id="icon"></i>
                            <ModifyProfile v-bind:revele="revele" v-bind:displayModify="displayModify" id="displayModifyContent" />
                            </a>
                            </li>
                        </ul>
                    </nav>
                </div>
                

            </div>
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
import axios from 'axios'
import { Notyf } from 'notyf'
import 'notyf/notyf.min.css'

import Navbar from '../components/Navbar.vue'
import ModifyProfile from '../components/ModifyProfile.vue'
import ProfileImage from '../components/ProfileImage.vue'

    export default {
        name: 'Profile',
        components: {
            Navbar,
            ModifyProfile,
            ProfileImage,
        },
        data(){
            return{
                revele: false,
                user: "",
                username: "",
                lastname: "",
                imageProfile: null,
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
                    this.uploadFile();
                    
                }
			},
            uploadFile(){
                const userId = localStorage.getItem('userId')
                const formData = new FormData();
                formData.append("image", this.imageProfile)
                    axios.put('http://localhost:3000/api/users/profile/' + userId, formData, {
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
        
        }
    }
</script>

<style lang="scss" scoped>
.welcom{
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
        .img-content{
            margin: auto;
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
    }
    .navbar-profile{
        .nav{
            justify-content: right;
            position: relative;
            top: 10px;
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