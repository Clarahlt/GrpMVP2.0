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
                    <button class="btn btn-img-profile" type="button"><i class="fa-solid fa-file-arrow-up"></i></button>
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
import Navbar from '../components/Navbar.vue'
import ModifyProfile from '../components/ModifyProfile.vue'

    export default {
        name: 'Profile',
        components: {
            Navbar,
            ModifyProfile,
        },
        data(){
            return{
                revele: false,
                user: "",
                username: "",
                lastname: "",
            }
        },
        created() {
			this.displayProfile(); 
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
				})
				.catch(error => {
					const msgerror = error.response.data
					this.notyf.error(msgerror.error)
				})

			},
            displayModify(){
                this.revele = !this.revele
            }
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
    background: white;
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
                .btn-img-profile{
                    width: 100%;
                    border-radius: 50%;
                    font-size: 60px;
                    color: dimgray;
                }
            }
        }
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