<template>  
    <!-- Barre de navigation / Menu -->
    <div id="Navbar" class="container-fluid-lg">
        <nav class="navbar navbar-expand-lg navbar-light nav">
            
            <div class="nav-items" id="navbarSupportedContent">
                <ul class="nav-links">
                    <li class="item item-logo">
                        <div class="color-logo">
                            <img class="img-logo" src="../assets/icon.png" alt="logo entreprise">
                        </div>
                    </li>
                    <li class="item">
                        <router-link to='/posts' class="display-post"><i class="bi bi-house-fill"></i><p>Accueil</p></router-link>
                    </li>


                    <li class="item">
                        <router-link to='/posts' class="display-post"><i class="bi bi-envelope"></i><p>Messagerie</p></router-link>
                    </li>
                    
                    <li class="item">
                        <router-link to='/profile' class="display-profile"><i class="bi bi-person"></i><p>Mon profil</p></router-link>
                    </li>
                    
                    <!-- Permet de se déconnecter -->
                    <li class="item">
                        <Logout class="logout"/>
                    </li>
                    
                </ul>
            </div>
        </nav>

    </div>
</template>

<script>
import Logout from '../components/Logout.vue'
    export default {
        name: 'Navbar',
        components: {
            Logout
        }
    }
</script>

<style scoped lang="scss">
#Navbar{
    @media (max-width: 776px){
        position: fixed;
        width: 100%;
        z-index: 1;
    }
    nav {
        background: #4E5166;;
        display: flex;
        justify-content: flex-end;
        align-items: baseline;
        box-shadow: 0px 5px 15px #3f3d56; 
        height: 80px;
        @media (max-width: 776px){
            justify-content: center;
        }
        .nav-items{
            width: 100%;
            @media (max-width: 776px){
                width: 100%;
            }
        }
        
        .nav-links{
            justify-content: space-around;
            display: flex;
            list-style: none;
            flex-direction: row;
            margin: auto;
            align-items: baseline;
            @media (max-width: 776px){
                padding: 0;
            }
            .item-logo{
                width: 70px;
                img{
                    width: 95%;
                    border-radius: 50%;
                    @media (max-width: 776px){
                        width: 99%;
                        position: relative;
                        left: 1px;
                        top: -2px;
                    }
                }
            }
            .item{
                @media (max-width: 776px){
                    margin: 0 auto;
                }
                a, button{
                    display: flex;
                    text-decoration: none;
                    color: #FFD7D7;
                    font-weight: bold;
                    i{
                        margin: 0 5px;
                    }
                    &:hover, &:focus  {
                        color: #FD2D01;
                    }
                    p{
                        @media (max-width: 776px){
                            display: none;
                            }
                    }
                }
                .logout{
                    border: none;
                    background-color: #4E5166;
                    &:hover, &:focus  {
                        color: #FD2D01;
                    }
                }
            }
        }
        @media (max-width: 776px){
            .nav-links :nth-child(1) { order: 3; }
            .nav-links :nth-child(2) { order: 1; }
            .nav-links :nth-child(3) { order: 2; }
            .nav-links :nth-child(4) { order: 4; }
            .nav-links :nth-child(5) { order: 5; } 
        }
    }   
}
</style>