<template>  
    <div id="appNav">
        <nav class="navbar navbar-expand-lg navbar-light nav">
            <img class="nav-logo" src="../assets/logo.png"/>
            <button class="navbar-toggler justify-content-center nav__menuButton" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                <i class="fa fa-bars"></i>
            </button>
            
            <div class="collapse navbar-collapse justify-content-end" id="navbarSupportedContent">
                <ul class="navbar-nav nav__links">
                    <li class="nav-item">
                        <router-link to='/posts' class="display-post"><i class="fa-solid fa-house"></i>Accueil</router-link>
                    </li>


                    <li class="nav-item">
                        <router-link to='/posts' class="display-post"><i class="fa-regular fa-envelope"></i>Messagerie</router-link>
                    </li>
                    
                    <li class="nav-item">
                        <router-link to='/profile' class="display-profile"><i class="fa-regular fa-user"></i>Mon profil</router-link>
                    </li>

                    <li class="nav-item">
                        <button class="nav__links__logoutLink">Déconnexion <i class="fas fa-sign-out-alt"></i></button>    
                    </li>
                </ul>
            </div>
        </nav>

        <router-view/>
    </div>
</template>

<script>
    export default {
        name: 'Navbar'
    }
</script>

<style scoped lang="scss">
#appNav{
    padding: 0;
}
    .nav {
        background: white;
        display: flex;
        justify-content: space-between;
        align-items: center;
        box-shadow: 0px 5px 15px #3f3d56; 
        height: 80px;
        &__logo {
            display: flex;
            justify-content: flex-start;
            max-width: 450px;
            width: 52%;
        }
        &__menuButton:hover, &__menuButton:focus {
            color: #ff6363;
        }
        .nav-logo{
            width: 5%;
            margin: 0 80px;
        }
        .navbar-nav{
            li{
                margin: 5px 20px;
                svg{
                    margin-right: 8px;
                }
            }
        }
        a, button {
            font-weight: bold;
            color: #A4C2A5;
            &:hover, &:focus  {
                color: #ff6363;
            }
            i{
                margin: 0 5px;
            }
        }
        &__links {
            align-items: flex-end;
            @media (max-width: 776px) {
                padding: 0;
            }
            &__link {   
                padding-right: 4rem;
                text-decoration: none;
                align-items: flex-end;
                @media (max-width: 990px) {
                    padding: 0;
                }
            }
            &__logoutLink {
                border: none;
                background-color: white;
                &:hover, &:focus  {
                    color: #ff6363;
                }
                @media (max-width: 990px) {
                    padding-right: 0;
                }
            }
        }
    }
</style>