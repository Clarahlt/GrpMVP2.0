<template>
    <div class="post-likes">
        <button @click="postLike(post.id)" :name="post.id" class="heart_action">
            <i class="bi bi-heart empty_heart"></i>
            <i class="bi bi-heart-fill full_heart"></i>
        </button>
        <p :id="post.id" class="likes">{{ post.likes }}</p>
    </div>
</template>


<script>
//Imports
    import axios from 'axios'
    import { Notyf } from 'notyf'
    import 'notyf/notyf.min.css'

    export default {
        name: 'Likes',
        props:['post', 'likes'],
        data(){
            return {
                userId: localStorage.getItem('userId'),
            }
        },
        created(){
            this.notyf = new Notyf({
                duration: 4000,
                position: {
                    x: 'center',
                    y: 'bottom'
                }
            });
            this.displayHeartColor()
        },
        methods:{
            // Permet de liker un message ou de dislike ce message
            postLike(){
                const messageId = this.post.id
                const userId = this.userId
                console.log(userId);
                axios.get('http://localhost:3000/api/users/messages/' + messageId, {
                    headers: {
                        'Content-Type' : 'application/json',
                        'Authorization' : 'Bearer ' + localStorage.getItem('token')
                    }
                }).then((response) => {
                    const like = response.data.like
                    console.log(like);
                    if(like === null || like.isLike === 0){
                        axios.post('http://localhost:3000/api/users/messages/' + messageId + '/like',{
                            messageId,
                            userId,
                        }, {
                            headers: {
                                'Content-Type' : 'application/json',
                                'Authorization' : 'Bearer ' + localStorage.getItem('token')
                            }
                        }).then((res) => {
                            const likesCounter = res.data.likesCounter.likes
                            const refreshLikes = document.getElementById(this.post.id)
                            refreshLikes.innerHTML = likesCounter
                            const fillHeart = document.getElementsByName(this.post.id)[0]
                            fillHeart.className = 'heart_action display_heart_color'
                        })
                        .catch((error) => {
                            console.log(error.res.data);
                        })
                    } else {
                        if(like.isLike === 1){
                        axios.post('http://localhost:3000/api/users/messages/' + messageId + '/dislike', {
                            messageId,
                            userId
                        }, {
                            headers: {
                                'Content-Type' : 'application/json',
                                'Authorization' : 'Bearer ' + localStorage.getItem('token')
                            }
                        })
                        .then((res) => {
                            const likesCounter = res.data.messageFound.likes
                            const refreshLikes = document.getElementById(this.post.id)
                            refreshLikes.innerHTML = likesCounter
                            const fillHeart = document.getElementsByName(this.post.id)[0]
                            fillHeart.className = 'heart_action'
                        })
                        .catch((error) => {
                            console.log(error.response.data);
                        })
                        }
                    }
                })
                .catch((error) => {
                    console.log(error.response.data);
                })
            },
            //si un message est liké, permet d'afficher une icone "coeur" remplie
            displayHeartColor(){
                const messageId = this.post.id
                axios.get('http://localhost:3000/api/users/messages/' + messageId, {
                    headers: {
                        'Content-Type' : 'application/json',
                        'Authorization' : 'Bearer ' + localStorage.getItem('token')
                    }
                }).then((res) => {
                    const like = res.data.like
                    console.log(like);
                    if(like.isLike == 1){
                        const fillHeart = document.getElementsByName(this.post.id)[0]
                        fillHeart.className = 'heart_action display_heart_color'
                    }
                }).catch((error) => {
                    console.log(error);
                })
            }
        }
    }
</script>

<style lang="scss">
.post-likes{
                    position: absolute;
                    right: 20px;
                    display: flex;
                    align-items: flex-start;
                    font-size: 20px;
                    .heart_action{
                        outline: none;
                        border: none;
                        background: none;
                        position: relative;
                        .full_heart{
                            z-index: 0;
                            color: white;
                        }
                        .empty_heart{
                            z-index: 1;
                            position: absolute;
                        }
                    }
                    p{
                        margin-left: 10px;
                    }
                    .display_heart_color{
                        outline: none;
                        .full_heart, .empty_heart{
                            transition: all 1s ease-out;
                            background: #FD2D01;
                            -webkit-background-clip: text;
                            -webkit-text-fill-color: transparent;
                        }
                    }
                    .likes-nb{
                        margin: auto;
                    }
                }

</style>