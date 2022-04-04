<template>
    <div class="post-likes">
        <button @click="postLike()" class="heart_action">
            <i class="bi bi-heart empty_heart"></i>
            <i class="bi bi-heart-fill full_heart"></i>
        </button>
        <p :id="post.id" class="likes">{{ post.likes }}</p>
    </div>
</template>


<script>
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
        },
        methods:{
            // Permet d'aimer un message
            postLike(){
                const messageId = this.post.id
                const userId = this.userId
                axios.get('http://localhost:3000/api/users/messages/' + messageId, {
                    headers: {
                        'Content-Type' : 'application/json',
                        'Authorization' : 'Bearer ' + localStorage.getItem('token')
                    }
                }).then((res) => {
                    const like = res.data.like
                    if(like.isLike === 0){
                        axios.post('http://localhost:3000/api/users/messages/' + messageId + '/like',{
                            messageId,
                            userId
                        }, {
                            headers: {
                                'Content-Type' : 'application/json',
                                'Authorization' : 'Bearer ' + localStorage.getItem('token')
                            }
                        }).then((res) => {
                            const likesCounter = res.data.likesCounter.likes
                            const refreshLikes = document.getElementById(this.post.id)
                            refreshLikes.innerHTML = likesCounter
                        })
                        .catch((error) => {
                            console.log(error.response.data);
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
            }
            // postLike(){
            //     const post = this.post
            //     const messageId = this.post.id
            //     console.log(post);
            //     console.log(post.userId)
            //     console.log(this.userId);
                
            //         axios.get('http://localhost:3000/api/users/messages/' + messageId, {
            //             headers: {
            //                 'Content-Type' : 'application/json',
            //                 'Authorization': 'Bearer ' + localStorage.getItem('token')
            //             }
            //         }).then((res) => {
            //             const like = res.data.allLikes[0]
            //             console.log(like);
            //             if(like.isLike === 0){

            //                 axios.post('http://localhost:3000/api/users/messages/' + messageId + '/like', {
            //                     messageId,
            //                     userId :  this.userId,
            //                 },{
            //                     headers: {
            //                         'Content-Type' : 'application/json',
            //                         'Authorization': 'Bearer ' + localStorage.getItem('token')
            //                     }
            //                 }).then(() => {
            //                     this.updateLikeCounter();
            //                 }).catch((error) => {
            //                     const msgerror = error.res.data
            //                     this.notyf.error(msgerror.error)
            //                 })
            //             } else {
            //                 if(like.isLike === 1){
            //                     axios.post('http://localhost:3000/api/users/messages/' + messageId + '/dislike', {
            //                         messageId,
            //                         userId : this.userId,
            //                     }, {
            //                         headers: {
            //                             'Content-Type' : 'application/json',
            //                             'Authorization': 'Bearer ' + localStorage.getItem('token')
            //                         }
            //                     }).then(() => {
            //                         this.updateLikeCounter();
            //                     }).catch((error) => {
            //                         const msgerror = error.res.data
            //                         this.notyf.error(msgerror.error)
            //                     })
            //                 }
            //             }
            //         }).catch((error) => {
            //             const msgerror = error.res.data
            //             this.notyf.error(msgerror.error)
            //         })

            // },
            // updateLikeCounter(){
            //     const messageId = this.post.id
            //         axios.get('http://localhost:3000/api/users/messages/' + messageId, {
            //             headers: {
            //                 'Content-Type' : 'application/json',
            //                 'Authorization': 'Bearer ' + localStorage.getItem('token')
            //             }
            //         }).then((res) => {
            //             const likeCounter = res.data.messageFound
            //             const refreshLikes = document.getElementById(this.post.id)
            //             console.log(refreshLikes);
            //             refreshLikes.innerHTML = likeCounter.likes
            //         }).catch((error) => {
            //             const msgerror = error.res.data
            //             this.notyf.error(msgerror.error)
            //         })
            // }
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