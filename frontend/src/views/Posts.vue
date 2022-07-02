<template>
    <div id="app" class="app-posts">
        <Navbar/>

        <div class="container">

            <div class="row display-post">

                <aside class="col- col-xl-3 profile-box">
                    
                </aside>
                <!-- Bloc de création de post -->
                <div class="col-sm-10 col-lg-8 col-xl-6  txtarea-post">
                    <div class="row post">
                        <div v-if="imageProfile == 'null'" class="icon-img-profile"><i class="bi bi-person-circle"></i></div>
                        <div v-else-if="imageProfile !== 'null'" class="icon-img-profile"><ProfileImage :src="imageProfile"/></div>
                        <div class="col">  
                            <input v-model="title" class="form-text title-post" type="title" id="title" name="title" placeholder="Votre titre">
                            <input v-model="content" class="form-text content-post" type="post" id="post" name="post" placeholder="Quoi de neuf dans la boîte ?...">
                        </div>
                    </div>
                    <div class="row post-tools">
                        <button for="file-input"  @click="uploadFile" class="col-md-3 col-3 btn tool-btn"><i class="bi bi-image"></i>Image</button> 
                        <input type="file" ref="uploadFile" name="image" @change="onFileSelected"  accept="image/*" id="file-input" aria-label="Modifier ma photo de profil">
    
                        <button class="col-md-3 col-3 btn tool-btn" type="button" name="vidéo"><i class="bi bi-youtube"></i>Vidéo</button>
                        <button type="submit" @click="createPost" class="col-md-6 col-6 btn btn-sm btn-submit">Publier</button>
                    </div>
                </div>

                <!-- Aside agenda Google-->
                <aside class="col- col-xl-3 aside-agenda">
                    <div class="agenda">
                        <iframe src="https://calendar.google.com/calendar/embed?height=300&wkst=1&bgcolor=%23ffffff&ctz=Europe%2FParis&title=Groupomania%20Agenda&showCalendars=1&showTabs=1&showPrint=0&showTz=0&src=azBzcHRwbWFlNGd2a29zaXE5MGtmN2VvbWtAZ3JvdXAuY2FsZW5kYXIuZ29vZ2xlLmNvbQ&src=ZnIuZnJlbmNoI2hvbGlkYXlAZ3JvdXAudi5jYWxlbmRhci5nb29nbGUuY29t&color=%23D50000&color=%237986CB" style="border:solid 1px #777" width="300" height="300" frameborder="0" scrolling="no"></iframe>                
                    </div>
                </aside>


                <div class="">
                        <p class="text-muted">Aucun post n'a été publié !</p>
                </div>

                <!-- Bloc affichant les posts -->
                <div class="displayPost" v-for="post in posts" :key="post.id">
                    <div class="displayPost__item">
                        <div class="row display-content-post">
                            <div :PostId="post.id" class="col-sm-10 col-lg-8 col-xl-6 card-post">
                                <div class="card modele-post ">
                                    <div class="card-title" >
                                        <div v-if="!post.User.imageProfile" class="icon-user-post"><i class="bi bi-person-circle"></i></div>
                                        <div v-else-if="post.User.imageProfile"><ProfileImage :src="post.User.imageProfile" class="icon-user-post"/></div>
                                    
                                        <div class="title">
                                            <h5 class="username-post">{{ post.User.username }}</h5>
                                            <h6 class="text-muted">{{ post.title }}</h6>
                                        </div>
                                        <!-- Dropdown menu: Modification/suppression d'un post-->
                                        <div v-if="post.userId == this.userId || this.isAdmin == 'true'" class="dropdown">
                                            <button type="button" class="btn" data-toggle="dropdown"><i class="bi bi-three-dots-vertical"></i></button>
                                            <div class="dropdown-menu">
                                                <a v-if="post.userId == this.userId" @click="displayModificationBloc(post.id)" class="dropdown-item" href="#">Modifier</a>
                                                <div v-if="post.userId == this.userId" class="dropdown-divider"></div>
                                                <a @click="deletePost(post.id)" class="dropdown-item" href="#">Supprimer</a> 
                                            </div>
                                        </div>
                                    </div>
                                    <div v-if="!post.attachment" class="img-post">
                                    </div>
                                    <div v-else-if="post.attachment" class="img-post">
                                        <img :src="post.attachment" alt="image du message">
                                    </div>
                                
                                    <p class="card-text">{{ post.content }}</p>

                                    <div class="card-footer text-muted">
                                        <p class="post-date">Publié le {{ dateFormat(post.createdAt) }}</p>
                                        <Likes v-bind:post="post"/>
                                        <button class="btn-comments btn" type="button"><i class="bi bi-chat-dots"></i></button>
                                    </div>
                                    
                                    <!-- Bloc permettant de modifier un post -->
                                    <div v-show="bloc" class="bloc">
                                        <div class="overlay"></div>
                                        <div class="bloc-modify-post container">
                                            <div class="row modify-post-menu">
                                                <div @click="closeModificationBloc(post.id)" class="col-6 icon-bloc-close-to-modify">
                                                    <i class="far fa-times-circle fa-2x modaleBloc__card__title__close"></i>
                                                </div>
                                                <div class="col-6 save-btn">
                                                    <button :id="post.id" v-on:click="updatePost(post.id)" class="btn">Enregistrer</button>
                                                </div>
                                            </div>
                                            <div class="row modify-post">
                                                <div class="col-6 media">
                                                    <div v-if="attachment" v-show="showImgPost" class="img-post">
                                                        <img id="image" :src="attachment" alt="image du message">
                                                    </div>
                                                    <div v-if="newAttachment" v-show="showNewImgPost" class="img-post">
                                                            <img id="image" :src="newAttachment" alt="image du message">
                                                    </div>
                                                </div>
                                                <div class="col-6 content-post-to-modify">
                                                    <div class="row title-grp">
                                                        <div v-if="!imgUserPostId" class="col-4 user-logo"><i class="bi bi-person-circle"></i></div>
                                                        <div v-else-if="imgUserPostId" class="col-4 user-logo"><img :src="imgUserPostId"/></div>
                                                        <div class="col-8 title-rename">
                                                            <h5 class="username">{{ usernamePostId }}</h5>
                                                            <textarea v-model="newTitle" id="title-rename" class="title-to-modify"></textarea>
                                                        </div>
                                                    </div>
                                                    <div class="contents-grp">
                                                        <textarea v-model="newContent" class="text-to-modify"></textarea>
                                                    </div>
                                                    <div class="row media-tools">
                                                        <button for="input" @click="uploadNewFile" class="col-md-3 col-3 btn"><i class="bi bi-image"></i></button> 
    
                                                        <button class="col-md-3 col-3 btn" type="button" name="vidéo"><i class="bi bi-youtube"></i> </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
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
                bloc: false,

                showImgPost: true, 
                showNewImgPost: false,

                messageId : '',

                newTitle: '',
                newContent: '',
                imgUserPostId: '',
                usernamePostId: '',
                newAttachment: '',

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
                .then((response) => {
                    console.log(response.data);
                    window.location.reload()
                })
                .catch(error => {
                    const msgerror = error.response.data;
                    this.notyf.error(msgerror.error)    
                })

            },

            // Permet de récupérer les informations d'un fichier image
            onFileSelected(event){
                this.attachment = event.target.files[0]
                console.log(this.attachment);

                // Cette méthode permet de créer une URL provisoire d'une image pour la prévisualiser 
                if(event.target.files.length > 0){
                    this.newAttachment = URL.createObjectURL(event.target.files[0]);
                    this.showImgPost = !this.showImgPost;
                    this.showNewImgPost = !this.showNewImgPost
                }

            },

            // Permettent de télécharger les fichiers images sur le serveur
            uploadFile(){
                this.attachment = this.$refs.uploadFile.click()
            },
            uploadNewFile(){
                this.newAttachment = this.$refs.uploadFile.click()
            },

            // Permet d'afficher tous les messages sur la page Posts
            displayPost() {
                axios.get('http://localhost:3000/api/users/messages', {
                    headers: {
                        'Content-Type' : 'application/json',
                        'Authorization': 'Bearer ' + localStorage.getItem('token')
                    }
                })
                .then(response => {
                    this.posts = response.data;
                    console.log({"posts": response.data});
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

            //Permet d'afficher le bloc de modification des informations du profil
            displayModificationBloc(id){
                const messageId = id; 
                this.messageId = messageId
                console.log(this.messageId); 
                console.log(messageId);
                this.bloc = !this.bloc
                axios.get('http://localhost:3000/api/users/messages/' + messageId, {
                    headers: {
                        'Content-Type' : 'application/json',
                        'Authorization': 'Bearer ' + localStorage.getItem('token')
                    }
                })
                .then((res) => {
                    const messageById = res.data.messageFound
                    console.log(messageById);
                        this.imgUserPostId = messageById.User.imageProfile
                        this.usernamePostId = messageById.User.username
                        this.newTitle = messageById.title
                        this.newContent = messageById.content
                        this.attachment = messageById.attachment
                        
                })
                .catch(error => {
                    const msgerror = error.response.data
                    this.notyf.error(msgerror.error)
                })
            },

            // Permet de fermer le bloc de modification du profil
            closeModificationBloc(){
                this.bloc = !this.bloc
            },

            // Permet de modifier les informations du profil
            updatePost(){
                const messageId = this.messageId
                console.log(messageId);
                const formData = new FormData();
                formData.append('image' , this.attachment)
                formData.append('title', this.newTitle)
                formData.append('content', this.newContent)
                axios.put('http://localhost:3000/api/users/messages/' + messageId, formData,{
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        'Authorization': 'Bearer ' + localStorage.getItem('token')
                    }
                })
                .then((res)=>{
                    console.log(res.data);
                    this.content = res.data.content
                    this.title = res.data.title
                    this.attachment = res.data.attachment
                    window.location.reload()
                    
                })
                .catch((err)=> {
                    console.log(err);
                })
            },

            //Permet de supprimer un post
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
            },
        },
    }
</script>

<style lang="scss" scoped>
.app-posts{
  background: #F6F8FB;
}
.container{
    @media (max-width: 776px){
      padding-top: 100px;
    }
}

.display-post{
    margin: 30px auto;
    @media (max-width: 776px) {
        width: 95%;
        margin: auto;
    }
    .txtarea-post{
        height: fit-content;
        background: #4E5166;
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
                i{
                    font-size: 50px;
                    color: white;
                }
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
        .tool-btn{
            color: #FFD7D7;
            font-weight: bold;
            font-size: 13px;
            i{
                margin: 7px;
            }
            svg{
            margin-right: 5px;
            }
            &:hover{
                color: #FD2D01;
            }
        }
        input{
            display:none;
        }
        .btn-submit{
                width: 15%;
                background: #FFD7D7;
                color: #FD2D01;
                @media (max-width: 776px){
                    width: 25%;
                }
                &:hover{
                    border-color: white;
                    color: #FD2D01;
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
        .bloc-modify-post{
            position: fixed;
            top: 50px;
            bottom: 50px;
            left: 0;
            right: 0;
            border-radius: 10px;
            width: 55%;
            margin: 15px auto;
            z-index: 1;
            @media (max-width: 776px){
                width: 95%;
                padding: 0;
            }
        }
        .modify-post-menu{
            padding: 10px;
            background: white;
            border-top-left-radius: 10px;
            border-top-right-radius: 10px;
            align-items: end;
            border-bottom: 1px solid lightgray;
            .icon-bloc-close-to-modify{
                top: 10px;
                right: 10px;
                text-align-last: left;
                &:hover, &:focus {
                    color: #ff6363;
                    }
            }
            .save-btn{
                text-align-last: right;
                .btn{
                    &:hover, &:focus {
                    color: #ff6363;
                    }
                }
            }
        }
        .modify-post{
            background: white;
            border-bottom-left-radius: 10px;
            border-bottom-right-radius: 10px;
            height: 400px;
            position: relative;
            .media{
                align-self: center;
            }
            .content-post-to-modify{
                border-left: 1px solid lightgray;
                textarea{
                    width: 100%;
                    border: none;
                    resize: none;
                    outline: none;
                    }
                .title-grp{
                    align-items: center;
                    margin-top: 20px;
                    .user-logo{
                        text-align: start;
                            height: 85px;
                            width: 85px;
                        img{
                            width: 100%;
                        }
                    }
                    .title-rename{
                        .username{
                            text-align-last: left;
                            margin-left: 10px;
                        }
                        .title-to-modify{
                            margin-left: 10px;
                        }
                    }
                }
                .contents-grp{
                    .text-to-modify{
                            height: 250px;
                            padding: 1%;
                        }
                }
                .media-tools{
                        position: absolute;
                        bottom: 0;
                        width: 50%;
                        justify-content: flex-end;
                        border-top: 1px solid lightgray;
                        #newUploadFile{
                            display: none;
                        }
                    }
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
                .btn-comments{
                    position: absolute; 
                    right: 70px;
                    display: flex;
                    font-size: 22px;
                    bottom: -7px;
                }
            }
            .users-comments{
                .user-comment{
                    display: flex;
                    padding: 10px;
                }
                .input-add-comment{
                    width: 100%; 
                    margin: 8px;
                    border-radius: 16px;
                    border: lightgrey 1px solid;
                    font-size: 12px;
                }
                .comment-bloc{
                    p{
                        text-align: center;
                    }
                }
            }

        }
    }
}
</style>