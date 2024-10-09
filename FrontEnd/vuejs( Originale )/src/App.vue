<template>
    <div class="fond">
    <!-- <div id="app">
    <nav class="navbar navbar-expandlgnavbar-light" style="background-color:#e3f2fd;">
    <ul class="navbar-navmr-auto mt-2mt-lg-0">
    <li><router-link class="nav-link" to="/MaPage"> Ma page </router-link></li>
    <li><router-link class="nav-link" to="/Design"> Design </router-link></li>
    <li><router-link class="nav-link" to="/Menu"> Menu </router-link></li>
    <li><router-link class="nav-link" to="/transition"> Transition </router-link></li>
    </ul>
    </nav>
    </div> -->
<router-view></router-view>  
</div>
</template>
<script>
    import gsap from 'gsap' 


export default{
    name:'App'
}
</script>
<style>
</style>