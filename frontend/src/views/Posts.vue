<template>
    <div id="app">
        <Navbar/>

        <div class="container">

            <div class="row display-post">

            <aside class="col- col-xl-3 profile-box">
            

            </aside>
            <!-- Bloc de création de post -->
            <div class="col-sm-10 col-lg-8 col-xl-6  txtarea-post">
                <div class="row post">
                    <ProfileImage :src="imageProfile" class="icon-img-profile"/>
                    <div class="col">  
                    <input v-model="title" class="form-text title-post" type="title" id="title" name="title" placeholder="Votre titre">
                    <input v-model="content" class="form-text content-post" type="post" id="post" name="post" placeholder="Quoi de neuf dans la boîte ?...">
                    </div>
                </div>
                <div class="row post-tools">
                    <button for="file-input"  @click="uploadFile" class="col-md-3 col-3 btn"><i class="bi bi-image"></i> image</button> 
                    <input type="file" ref="uploadFile" name="image" @change="onFileSelected"  accept="image/*" id="file-input" aria-label="Modifier ma photo de profil">
    
                    <button class="col-md-3 col-3 btn" type="button" name="vidéo"><i class="bi bi-youtube"></i> Vidéo</button>
                    <button type="submit" @click="createPost" class="col-md-6 col-6 btn btn-secondary btn-sm btn-submit">Publier</button>
                </div>
            </div>


            <aside class="col- col-xl-3 aside-agenda">
                <div class="agenda">
                    <iframe src="https://calendar.google.com/calendar/embed?height=300&wkst=1&bgcolor=%23ffffff&ctz=Europe%2FParis&title=Groupomania%20Agenda&showCalendars=1&showTabs=1&showPrint=0&showTz=0&src=azBzcHRwbWFlNGd2a29zaXE5MGtmN2VvbWtAZ3JvdXAuY2FsZW5kYXIuZ29vZ2xlLmNvbQ&src=ZnIuZnJlbmNoI2hvbGlkYXlAZ3JvdXAudi5jYWxlbmRhci5nb29nbGUuY29t&color=%23D50000&color=%237986CB" style="border:solid 1px #777" width="300" height="300" frameborder="0" scrolling="no"></iframe>                
                </div>
            </aside>

            <!-- Bloc affichant les posts -->
            <div class="displayPost" v-for="post in posts" :key="post.id">
                <div class="displayPost__item">
                    <div class="row display-content-post">
                        <div :contentPostId="post.id" class="col-sm-10 col-lg-8 col-xl-6 card-post">
                            <div class="card modele-post ">
                                <div class="card-title" >
                                    <div v-if="!post.User.imageProfile" class="icon-user-post"><i class="bi bi-person-circle"></i></div>
                                    <div v-else-if="post.User.imageProfile"><ProfileImage :src="post.User.imageProfile" class="icon-user-post"/></div>
                                    
                                    <div class="title">
                                        <h5 class="username-post">{{ post.User.username }}</h5>
                                        <h6 class="text-muted">{{ post.title }}</h6>
                                    </div>
                                    <div v-if="post.userId == this.userId" class="dropdown">
                                        <button type="button" class="btn" data-toggle="dropdown"><i class="bi bi-three-dots-vertical"></i></button>
                                        <div class="dropdown-menu">
                                            <a class="dropdown-item" href="#">Modifier</a>
                                            <div class="dropdown-divider"></div>
                                            <a :messageId="post.id" @click="deletePost(post.id)" class="dropdown-item" href="#">Supprimer</a> 
                                        </div>
                                    </div>
                                    <div v-else-if="post.userId !== this.userId"></div>
                                </div>
                                <div v-if="!post.attachment" class="img-post">
                                </div>
                                <div v-else-if="post.attachment" class="img-post">
                                    <img :src="post.attachment" alt="image du message">
                                </div>
                                
                                <p class="card-text">{{ post.content }}</p>
                                <div class="card-footer text-muted">
                                    <p class="post-date">Publié le {{ dateFormat(post.createdAt) }}</p>
                                    <Likes v-bind:post="post"/>                                    </div>
                                
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
import moment from 'moment'
import { Notyf } from 'notyf'
import 'notyf/notyf.min.css'

import Navbar from '../components/Navbar.vue'
import ProfileImage from '../components/ProfileImage.vue'
import Likes from '../components/Likes.vue'
    export default {
        name: 'Posts',
        components: {
            Navbar,
            ProfileImage,
            Likes
        },
        data(){
            return {
                userId: localStorage.getItem('userId'),
                isAdmin: localStorage.getItem('isAdmin'),
                imageProfile: localStorage.getItem('imageProfile'),
                posts: [],
                title: '',
                content: '',
                attachment: '',
                file: '',
                likes: 0,
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
            onFileSelected(event){
                
                this.attachment = event.target.files[0]
                console.log(this.attachment);
            },
            uploadFile(){
                this.$refs.uploadFile.click()
            },
            // Permet de créer un post
            createPost() {
                const formData = new FormData()
                formData.append('image' , this.attachment)
                formData.append('title', this.title)
                formData.append('content', this.content)
                formData.append('likes', this.likes)
                axios.post('http://localhost:3000/api/users/messages/create', formData,{
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        'Authorization': 'Bearer ' + localStorage.getItem('token')
                    },
                })
                .then((res) => {
                    console.log(res.data);
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
                    console.log(this.posts)
                })
                .catch(error => {
                    const msgerror = error.response.data
                    this.notyf.error(msgerror.error)
                })
            },
            // Permet d'afficher la date de publication au bon format
            dateFormat(date){
                if (date) {
                    return moment(String(date)).format('DD/MM/YYYY')
                }
            },
            deletePost(id){
                const messageId = id;               
                axios.delete('http://localhost:3000/api/users/messages/' + messageId, {
                    headers: {
                        'Content-Type' : 'application/json',
                        'Authorization': 'Bearer ' + localStorage.getItem('token')
                    }
                })
                .then(() => {
                    this.displayPost();
                })
                .catch(error => {
                    const msgerror = error.response.data
                    this.notyf.error(msgerror.error)
                })                
            }
        },
        
    }
</script>

<style lang="scss" scoped>
.container{
    @media (max-width: 776px){
      padding-top: 100px;
    }
}

.display-post{
    @media (max-width: 776px) {
        width: 95%;
        margin: auto;
    }
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
                width: 90px;
                height: 65px;
                background-position: center;
                margin: 0 20px;
                @media (max-width: 775px) {
                    display: none;
                }
            }
            input{
                margin: 2px 0;
                padding: 10px;
                width: 100%;
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
        @media (max-width: 776px) {
            justify-content: center;
            margin: 5px auto;
            
        }
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
        input{
            display:none;
        }
        .btn-submit{
                width: 15%;
                @media (max-width: 776px){
                    width: 25%;
                }
            }
    }
    .aside-agenda{
        padding: 10px;
        @media (max-width: 775px) {
            display: none;        
            }
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
        @media(max-width: 776px){
            top: 0;
        }
        .modele-post{
            margin: auto;
            .card-title{
                display: inline-flex;
                .icon-user-post{
                    background-size: cover;
                    width: 70px;
                    height: 60px;
                    background-position: center;
                    margin: 5px 0px 0px 25px;
                    i{
                        font-size: 60px;
                        position: relative;
                        bottom: 12px;
                    }
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
            }
            .img-post{
                img{
                    width: 90%;
                    border-radius: 15px;
                }
            }
            p{
                margin: 15px 35px 15px 35px;
                text-align: left;
            }
            .card-footer{
                display: flex;
                p{
                    margin: 0;
                }
                .post-likes{
                    position: absolute;
                    right: 20px;
                    display: flex;
                }
            }
        }
    }
}
</style>