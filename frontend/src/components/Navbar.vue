<template>  
    <div id="Navbar" class="container-fluid-lg">
        <nav class="navbar navbar-expand-lg navbar-light nav">
            
            <div class="nav-items" id="navbarSupportedContent">
                <ul class="nav-links">
                    <li class="item item-logo">
                        <div class="color-logo">
                            <img class="img-logo" src="../assets/logo-white.png" alt="logo entreprise">
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
        background: white;
        display: flex;
        justify-content: flex-end;
        align-items: baseline;
        box-shadow: 0px 5px 15px #3f3d56; 
        height: 80px;
        @media (max-width: 776px){
            justify-content: center;
        }
        .nav-items{
            @media (max-width: 776px){
                width: 100%;
            }
        }
        
        .nav-links{
            display: flex;
            list-style: none;
            flex-direction: row;
            margin-top: 10px;
            align-items: center;
            @media (max-width: 776px){
                padding: 0;
            }
            .item-logo{
                .color-logo{
                    position: absolute;
                    top: 3px;
                    left: 47px;
                    width: 70px;
                    height: 70px;
                    background: #A4C2A5;
                    border-radius: 50px;
                    @media (max-width: 776px){
                        width: 40px;
                        height: 40px;
                        position: initial; 
                    }
                }
                img{
                    width: 95%;
                    position: relative;
                    top: -2px;
                    left: 1px;
                    @media (max-width: 776px){
                        width: 99%;
                        position: relative;
                        left: 1px;
                        top: -2px;
                    }
                }
            }
            .item{ 
                margin: 5px 30px;
                @media (max-width: 776px){
                    margin: 0 auto;
                }
                a, button{
                    display: flex;
                    text-decoration: none;
                    color: #A4C2A5;
                    font-weight: bold;
                    i{
                        margin: 0 5px;
                    }
                    &:hover, &:focus  {
                        color: #ff6363;
                    }
                    p{
                        @media (max-width: 776px){
                            display: none;
                            }
                    }
                }
                .logout{
                    border: none;
                    background-color: white;
                    &:hover, &:focus  {
                        color: #ff6363;
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