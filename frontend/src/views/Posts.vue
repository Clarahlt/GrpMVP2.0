<template>
    <div id="app">
        <Navbar/>

        <div class="row display-post">

            <aside class="col-md-3 profile-box">
            

            </aside>
            <div class="col-md-6 txtarea-post">
                <div class="row post">
                    <div class="col-md-2 icon-img-profile"></div>
                    <textarea class="col-md-10" type="post" id="post" name="post" v-model="post" placeholder="Quoi de neuf dans la boîte ?..."></textarea>
                </div>
                <hr/>
                <div class="row post-tools">
                    <button class="col-md-3 col-3 btn" type="button" name="photo"><i class="fa-regular fa-image"></i>Photo</button>
                    <button class="col-md-3 col-3 btn" type="button" name="vidéo"><i class="fa-solid fa-clapperboard"></i>Vidéo</button>
                    <button class="col-md-6 col-6 btn btn-secondary btn-sm btn-submit">Publier</button>
                </div>
            </div>
            <aside class="col-md-3 aside-agenda">
                <div class="agenda">
                    <iframe src="https://calendar.google.com/calendar/embed?height=300&wkst=1&bgcolor=%23ffffff&ctz=Europe%2FParis&title=Groupomania%20Agenda&showCalendars=1&showTabs=1&showPrint=0&showTz=0&src=azBzcHRwbWFlNGd2a29zaXE5MGtmN2VvbWtAZ3JvdXAuY2FsZW5kYXIuZ29vZ2xlLmNvbQ&src=ZnIuZnJlbmNoI2hvbGlkYXlAZ3JvdXAudi5jYWxlbmRhci5nb29nbGUuY29t&color=%23D50000&color=%237986CB" style="border:solid 1px #777" width="300" height="300" frameborder="0" scrolling="no"></iframe>                
                </div>
            </aside>
            
        </div>
        <div class="row display-content-post">
            <div class="card-post col-md-6">
                <div class="card text-center modele-post">
                    <h5 class="card-title">Statut Post</h5>
                    <p class="card-text">With supporting text below as a natural lead-in to additional content.</p>
                    <div class="card-footer text-muted">
                        2 days ago
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import Navbar from '../components/Navbar.vue'
    export default {
        name: 'Posts',
        components: {
            Navbar
        }
        
    }
</script>

<style lang="scss" scoped>

.display-post{
    .txtarea-post{
        height: fit-content;
        background: #F7F7F7;
        padding: 10px;
        margin: 20px auto;
        border-radius: 10px;
        .post{
            display: flex;
            margin: auto;
            .icon-img-profile{
                background: url("../assets/DSCF6139.png");
                background-size: cover;
                width: 70px;
                background-position: center;
                margin: 0 20px;
            }
            textarea{
                padding: 10px;
                width: 80%;
                height: 50px;
                border: lightblue 2px solid;
                border-radius: 25px;
            }
        }
    }
    .post-tools{
        justify-content: right;
        margin-right: 10px;
        .btn{
            color: #4A4A48;
            font-weight: bold;
            svg{
            margin-right: 5px;
            }
            &:hover{
                color: #ff6363;
            }
        }
        .btn-submit{
                width: 15%;
            }
    }
    .aside-agenda{
        padding: 10px;
        .agenda{
                padding: 9px;
            }
    }
}
.display-content-post{
    .card-post{
        margin: auto;
        position: relative;
        top: -120px;
        padding: 20px 0px;
        border-top: 1px lightgrey solid;
        .modele-post{
            margin: auto;
        }
    }
}
</style>