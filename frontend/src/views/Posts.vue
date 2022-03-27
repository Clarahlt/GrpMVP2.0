<template>
    <div id="app">
        <Navbar/>

        <div class="row display-post">

            <aside class="col-md-3 profile-box">
            

            </aside>
            <div class="col-md-6 txtarea-post">
                <div class="row post">
                    <ProfileImage :src="imageProfile" class="icon-img-profile"/>
                    <div class="col-md-8">  
                    <input v-model="title" class="title-post" type="title" id="title" name="title" placeholder="Votre titre">
                    <input v-model="content" class="content-post" type="post" id="post" name="post" placeholder="Quoi de neuf dans la boîte ?...">
                    </div>
                </div>
                <div class="row post-tools">
                    <button class="col-md-3 col-3 btn" type="button" name="photo"><i class="bi bi-image"></i> Photo</button>
                    <button class="col-md-3 col-3 btn" type="button" name="vidéo"><i class="bi bi-youtube"></i> Vidéo</button>
                    <button class="col-md-6 col-6 btn btn-secondary btn-sm btn-submit" v-on:click="createPost">Publier</button>
                </div>
            </div>
            <aside class="col-md-3 aside-agenda">
                <div class="agenda">
                    <iframe src="https://calendar.google.com/calendar/embed?height=300&wkst=1&bgcolor=%23ffffff&ctz=Europe%2FParis&title=Groupomania%20Agenda&showCalendars=1&showTabs=1&showPrint=0&showTz=0&src=azBzcHRwbWFlNGd2a29zaXE5MGtmN2VvbWtAZ3JvdXAuY2FsZW5kYXIuZ29vZ2xlLmNvbQ&src=ZnIuZnJlbmNoI2hvbGlkYXlAZ3JvdXAudi5jYWxlbmRhci5nb29nbGUuY29t&color=%23D50000&color=%237986CB" style="border:solid 1px #777" width="300" height="300" frameborder="0" scrolling="no"></iframe>                
                </div>
            </aside>


            <div class="displayPost" v-for="post in posts" :key="post.postId">
                <div class="displayPost__item">
                    <div class="row display-content-post">
                        <div :contentPostId="post.id" class="card-post col-md-6">
                            <div class="card modele-post ">
                                <div class="card-title" >
                                    <ProfileImage :src="imageProfile" class="icon-user-post"/>
                                    <div class="title">
                                        <h5 class="username-post">{{ username }}</h5>
                                        <h6 class="text-muted">{{ post.title }}</h6>
                                    </div>
                                    <div class="dropdown">
                                        <button type="button" class="btn" data-toggle="dropdown"><i class="bi bi-three-dots-vertical"></i></button>
                                        <div class="dropdown-menu">
                                            <a class="dropdown-item" href="#">Modifier</a>
                                            <div class="dropdown-divider"></div>
                                            <a class="dropdown-item" href="#">Supprimer</a> 
                                        </div>
                                    </div>
                                </div>
                                <p class="card-text">{{ post.content }}</p>
                                <div class="card-footer text-muted">
                                    <p>Publié le {{ post.createdAt }}</p>
                                    <p>{{ post.likes }}</p>
                                </div>
                            </div>
                        </div>                
                    </div>
                </div>
            </div>
        </div>  
    </div>
</template>

<script>
import axios from 'axios';
import { Notyf } from 'notyf'
import 'notyf/notyf.min.css'

import Navbar from '../components/Navbar.vue'
import ProfileImage from '../components/ProfileImage.vue'
    export default {
        name: 'Posts',
        components: {
            Navbar,
            ProfileImage
        },
        data(){
            return {
                userId: localStorage.getItem('userId'),
                username: localStorage.getItem('username'),
                isAdmin: localStorage.getItem('isAdmin'),
                imageProfile: localStorage.getItem('imageProfile'),
                posts: [],
                post: "",
                title: "",
                content: "",
                attachment: "vide pour le moment",
            }
        },
        created(){
            this.displayPost();
            this.notyf = new Notyf({
                duration: 4000,
                position: {
                    x: 'center',
                    y: 'bottom'
                }
            });
        },
        methods: {
            // Permet de créer un post
            createPost() {
                const postForm = {
                    title: this.title,
                    content: this.content, 
                    attachment: this.attachment,
                    username: this.username,
                }
                axios.post('http://localhost:3000/api/users/messages/create', postForm, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + localStorage.getItem('token')
                    },
                })
                .then(() => {
                    window.location.reload()
                })
                .catch(error => {
                    const msgerror = error.response.data;
                    this.notyf.error(msgerror.error)
                    
                })

            },

            // Permet d'afficher tous les messages
            displayPost() {
                axios.get('http://localhost:3000/api/users/messages', {
                    headers: {
                        'Content-Type' : 'application/json',
                        'Authorization': 'Bearer ' + localStorage.getItem('token')
                    }
                })
                .then(response => {
                    this.posts = response.data;
    
                })
                .catch(error => {
                    const msgerror = error.response.data
                    this.notyf.error(msgerror.error)
                })
            },        
        },
        
    }
</script>

<style lang="scss" scoped>

.display-post{
    .txtarea-post{
        height: fit-content;
        background: #F7F7F7;
        padding: 10px;
        margin: 20px auto;
        border-radius: 10px;
        .post{
            display: flex;
            margin: auto;
            .icon-img-profile{
                background-size: cover;
                width: 80px;
                height: 70px;
                background-position: center;
                margin: 0 20px;
            }
            input{
                margin: 2px 0;
                padding: 10px;
                width: 120%;
                border: lightblue 2px solid;
                border-radius: 5px;
            }
            .title-post{
                    height: 30px;
                }
                .content-post{
                    height: 80px;
                }
        }
    }
    .post-tools{
        justify-content: right;
        margin: 5px 30px 5px 0;
        .btn{
            color: #4A4A48;
            font-weight: bold;
            font-size: 13px;
            svg{
            margin-right: 5px;
            }
            &:hover{
                color: #ff6363;
            }
        }
        .btn-submit{
                width: 15%;
            }
    }
    .aside-agenda{
        padding: 10px;
        .agenda{
                padding: 9px;
            }
    }
}
.display-content-post{
    .card-post{
        margin: auto;
        position: relative;
        top: -120px;
        padding: 20px 0px;
        border-top: 1px lightgrey solid;
        .modele-post{
            margin: auto;
        .card-title{
            display: inline-flex;
            .icon-user-post{
                background-size: cover;
                width: 70px;
                height: 60px;
                background-position: center;
                margin: 5px 0px 0px 40px;
            }
            .title{
                text-align: left;
                margin: 10px 0px 0px 30px;
            }
            .dropdown{
                position: absolute;
                right: 0px;
                margin: 5px;
            }
        }}
    }
}
</style>