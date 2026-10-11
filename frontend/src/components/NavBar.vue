<script setup>
// import { useAuth } from '../service/auth';
import { useRouter } from "vue-router";

const router = useRouter();
// const { logout } = useAuth()
// const isAuthenticated = localStorage.getItem('isAuthenticated')

// const user = JSON.parse(localStorage.getItem('user'))

// let letter = ''
/*if(user) {
    letter = user.firstName[0]
}else{
    letter='P'
}

function handleLogout(){
    logout()
    router.push('/').then(() => {
        router.go(0)
    });
}*/

</script>

<template>
    <v-app-bar class="glass glass-primary">
        <v-app-bar-title>
            <router-link to="/">
                <v-img src="/logo.png" width="10%" height="10%"></v-img>
            </router-link>
        </v-app-bar-title>
        <v-btn to="/" class="ma-2">Home</v-btn>
        <v-btn to="/products"  class="ma-2">Products</v-btn>
        <v-btn to="/orders" class="ma-2">Orders</v-btn>

        <v-btn icon="mdi-account" variant="tonal" class="ma-2">P
            <v-menu activator="parent">
                <v-list>
                    <v-list-item>
                        <v-btn color="primary" to="/profile" class="ma-2">Profile</v-btn>
                    </v-list-item>
                    <v-list-item>
                        <v-btn color="primary" class="ma-2">Logout</v-btn>
                    </v-list-item>
                </v-list>
            </v-menu>
        </v-btn>

        <v-btn to="/signup">SignUp</v-btn>
    </v-app-bar>
</template>