<template> 
    <div v-if="revele" v-on:click="displayModify" class="modaleBloc">
        <div class="modaleBloc__overlay"></div>
        
        <div class="modaleBloc__card">
            <div class="modaleBloc__card__title">
                <h2>Informations personnelles</h2>

                <div v-on:click="displayModify" class="modaleBloc__card__title__close">
                    <i class="far fa-times-circle fa-2x modaleBloc__card__title__close"></i>
                </div>
                <form class="modify-form">

                    <div class="form-input row">
                        <div class="img-content">
                            <div class="img-profile">
                                <button class="btn btn-img-profile" type="button"><i class="fa-solid fa-file-arrow-up"></i></button>
                            </div>
                        </div>
                        <label for="img-profile" class="form-img-profile">Changer ma photo de profil</label>
                    </div>

                    <div class="form-input row">
                        <label for="username" class="form-username col-md-4">Username</label>
                        <input class="col-md-8" type="text" id="username" name="username" v-model="username" placeholder="username">
                    </div>

                    <div class="form-input row">
                        <label for="lastname" class="form-lastname col-md-4">Nom</label>
                        <input class="col-md-8" type="text" id="lastname" name="lastname" v-model="lastname" placeholder="lastname">
                    </div>

                    <div class="form-input row">
                        <label for="name" class="form-name col-md-4">Prénom</label>
                        <input class="col-md-8" type="text" id="firstname" name="firstname" v-model="firstname" placeholder="firstname">
                    </div>

                    <div class="form-input row">
                        <label for="bio" class="form-bio col-md-4">Bio:</label>
                        <input class="col-md-8" type="text" id="bio" name="bio" v-model="bio" placeholder="bio">
                    </div>

                    <div class="form-input row">
                        <label for="mail" class="form-mail col-md-4">Email</label>
                        <input class="col-md-8" type="email" id="email" name="email" v-model="email" placeholder="email">
                    </div>

                    <button v-on:click="updateProfile" class="btn modaleBloc__card__button">Enregistrer</button>

                    <div class="delete-account row">
                    <button class="btn display btn-danger">
                    <DeleteAccount id="displayDeleteContent" />
                    Supprimer mon compte</button>
                    </div>

                    
                </form>

            </div>
        </div>
    </div>
</template>


<script>
import axios from 'axios'
import DeleteAccount from '../components/DeleteAccount.vue' 
    export default {
        name: 'ModifyProfile',
        components: {
            DeleteAccount
        },
        props: ['revele', 'displayModify'],
        data() {
            return {
                user: "",
                username: "",
                lastname: "",
                firstname: "",
                bio: "",
                email: "",
            }
        },
        methods:{
            updateProfile(){
                const userId = localStorage.getItem('userId')
                const postForm = {
                    username: this.username,
                    lastname: this.lastname, 
                    firstname: this.firstname,
                    bio: this.bio,
                    email: this.email
                }
                axios.put('http://localhost:3000/api/users/profile/' + userId, postForm, {
					headers: {
                        'Content-Type' : "application/json",
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
        }
        
    }
</script>


<style scoped lang="scss">
    .modaleBloc {
        position: fixed;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        display: flex;
        justify-content: center;
        align-items: center;
        &__overlay {
            background: rgba(0,0,0,0.5);
            position: fixed;
            top: 0;
            bottom: 0;
            left: 0;
            right: 0;
        }
        &__card {
            z-index: 2;
            position: fixed;
            background: #f1f1f1;
            color: #3f3d56;
            &__title {
                display: flex;
                flex-direction: column;
                text-align: center;
                padding: 3rem 6rem 1.5rem 6rem;
                & h2 {
                    margin-top: 0px;
                    @media (max-width: 500px) {
                        font-size: 20px;
                    }
                }
                &__close {
                    position: absolute;
                    top: 1rem;
                    right: 1rem;
                    color: #3f3d56;
                    &:hover, &:focus {
                        color: #ff6363;
                    }
                }
            }
            &__button {
                border: 3px solid #3f3d56;
                border-radius: 25px;
                color: #3f3d56;
                font-weight: bold;
                padding: 0.9rem;
                margin: 25px auto;
                &:hover, &:focus {
                    border: 3px solid #ff6363;
                    color: #ff6363;
                }
            }
        }
        .modify-form{
            padding: 55px;
            background: white;
            border-radius: 10px;
            .form-input{
                margin: 15px auto;
            }
        }       
    }
</style>