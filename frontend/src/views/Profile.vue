<template>
    <div id="app">
        <Navbar/>
        <div class="container welcom">
            <h1 class="title">Bienvenue {{ username }} !</h1>
        </div>
        <div class ="container profile-infos">
            <div class="row background-profile">
                <div class="col-md-4 img-content">
                    <div class="img-profile">
                    <button class="btn" type="button"><img src="../assets/DSCF6139.png" /></button>
                    </div>
                </div>
                <div class="col-md-8 navbar-profile">
                    <nav>
                        <ul class="nav">
                            <li class="navbar-item item-modify">
                            <a v-on:click="modifyProfile">
                            <i class="fa-solid fa-pen" id="icon"></i>
                            <ModifyProfile v-bind:modify="modify" v-bind:modifyProfile="modifyProfile" id="displayModifyContent" />
                            </a>
                            </li>
                        </ul>
                    </nav>
                </div>
                

            </div>
            <div class="row profile-content">
                <div class="col-md-6 profile-cart">
                    <p class="name">{{lastname}} {{firstname}}</p>
                    <p>Bio : {{ bio }}</p>
                    <p>Username: {{username}}</p>
                    <p>Email: {{email}}</p>
                </div>
            </div>
        </div>

    </div>
</template>

<script>
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
                modify: false,
                revele: false,
                lastname: "",
                firstname: "",
                bio: "",
                username: "",
                email: "",
            }
        },
        created() {
			this.displayProfile(); 
		},
        methods: {
            displayProfile() {
                this.lastname = localStorage.getItem('lastname');
                this.firstname = localStorage.getItem('firstname');
                this.birth = localStorage.getItem('birth');
                this.username = localStorage.getItem('username');
                this.email = localStorage.getItem('email');

			},
            modifyProfile(){
                this.modify = !this.modify
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
                img{
                    width: 70%;
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