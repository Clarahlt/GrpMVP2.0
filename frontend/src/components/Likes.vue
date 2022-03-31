<template>
    <div class="post-likes">
        <button :id="post.id" @click="postLike()" class="heart_action">
            <i class="bi bi-heart empty_heart"></i>
            <i class="bi bi-heart-fill full_heart"></i>
        </button>
        <p class="likes">{{ post.likes }}</p>
    </div>
</template>


<script>
    import axios from 'axios'
    import { Notyf } from 'notyf'
    import 'notyf/notyf.min.css'

    export default {
        name: 'Likes',
        props:['post'],
        data(){
            return {
                userId: localStorage.getItem('userId')
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
        },
        methods:{
            // Permet d'aimer un message
            postLike(){
                const messageId = this.post.id
                const userId = this.userId
                const postLikes = this.post.likes
                console.log(userId);
                console.log(messageId);
                console.log(postLikes);

                if(postLikes >= 0){
                    axios.post('http://localhost:3000/api/users/messages/' + messageId + '/like', {
                        userId,
                        messageId,
                        isLike : true
                    },{
                        headers: {
                            'Content-Type' : 'application/json',
                            'Authorization': 'Bearer ' + localStorage.getItem('token')
                        }
                    }).then((res) => {
                        const isLike = res.data
                        const user = res.data.userFound
                        console.log(isLike);
                        console.log(user);
                    }).catch((error) => {
                        const msgerror = error.response.data
                        this.notyf.error(msgerror.error)
                    })
                } else {
                    const userFound = this.post.userId
                    console.log(userFound);
                    
                    axios.post('http://localhost:3000/api/users/messages/' + messageId + '/dislike', {
                        isLike : this.isLike - 1
                    }, {
                        headers: {
                            'Content-Type' : 'application/json',
                            'Authorization': 'Bearer ' + localStorage.getItem('token')
                        }
                    }).then((res) => {
                        const isLike = res.data
                        window.location.relaod(isLike)
                    }).catch((error)=> {
                        const msgerror = error.response.data
                        this.notyf.error(msgerror.error)
                    })
                }

            }
        }
    }
</script>

<style lang="scss">
.post-likes{
                    position: absolute;
                    right: 20px;
                    display: flex;
                    .heart_action{
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
                    .heart_action:focus{
                        outline: none;
                        .full_heart, .empty_heart{
                            transition: all 1s ease-out;
                            background: yellowgreen;
                            -webkit-background-clip: text;
                            -webkit-text-fill-color: transparent;
                        }
                    }
                    .likes-nb{
                        margin: auto;
                    }
                }

</style>