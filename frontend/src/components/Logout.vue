<template>
    <button @click="logout" class="nav__links__logoutLink"><p>Déconnexion</p> <i class="bi bi-door-closed"></i></button>    
</template>

<script>
export default {
    name: 'Logout',
    methods:{
        // Permet de se déconnecter
        logout() {
            localStorage.removeItem('firstname');
            localStorage.removeItem('username');
            localStorage.removeItem('email');
            localStorage.removeItem('imageProfile');
            localStorage.removeItem('token');
            localStorage.removeItem('userId');

            this.$router.push('http://localhost:8080/')
        }
    }
}
</script>

<style lang='scss'>
button{
    p{
        @media (max-width: 776px){
            display: none;
        }
    }
}

</style>
