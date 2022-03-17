<template> 
    <div v-if="modify" class="modaleBloc">
        <div @click="modifyProfile" class="modaleBloc__overlay"></div>
        
        <div class="modaleBloc__card">
            <div class="modaleBloc__card__title">
                <h2>Informations personnelles</h2>

                <div class="modaleBloc__card__title__close">
                    <i @click="modifyProfile" class="far fa-times-circle fa-2x modaleBloc__card__title__close"></i>
                </div>
                <form class="modify-form">
                    <div class="form-input row">
                        <label for="username" class="form-username col-md-4">Username</label>
                        <input class="col-md-8" type="username" id="username" name="username" v-model="username" placeholder="username">
                    </div>

                    <div class="form-input row">
                        <label for="lastname" class="form-lastname col-md-4">Nom</label>
                        <input class="col-md-8" type="lastname" id="lastname" name="lastname" v-model="lastname" placeholder="lastname">
                    </div>

                    <div class="form-input row">
                        <label for="name" class="form-name col-md-4">Prénom</label>
                        <input class="col-md-8" type="name" id="name" name="name" v-model="name" placeholder="name">
                    </div>

                    <div class="form-input row">
                        <label for="birth" class="form-birth col-md-4">Date de naissance:</label>
                        <input class="col-md-8" type="birth" id="birth" name="birth" v-model="birth" placeholder="birth">
                    </div>

                    <div class="form-input row">
                        <label for="mail" class="form-mail col-md-4">Email</label>
                        <input class="col-md-8" type="email" id="mail" name="mail" v-model="email" placeholder="email">
                    </div>

                    <div class="form-input row">
                        <label for="password" class="form-password col-md-4">Mot de passe</label>
                        <input class="col-md-8" type="password" id="password" name="password" v-model="password" placeholder="Tapez votre mot de passe">
                    </div>
                    <button class="btn modaleBloc__card__button">Enregistrer</button>

                    <div class="delete-account row">
                    <button class="btn display btn-danger">
                    <DeleteAccount v-bind:revele="revele" v-bind:displayDeleteContent="displayDeleteContent" id="displayDeleteContent" />
                    Supprimer mon compte</button>
                    </div>

                    
                </form>

            </div>
        </div>
    </div>
</template>


<script>
import DeleteAccount from '../components/DeleteAccount.vue' 


    export default {
        name: 'ModifyProfile',
        components: {
            DeleteAccount
        },
        props: ['modify', 'modifyProfile'],
        
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