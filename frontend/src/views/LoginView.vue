<script setup>
import LoginForm from '@/components/auth/LoginForm.vue';
import AppLogo from '@/components/ui/AppLogo.vue';
</script>

<template>
    <v-container max-width="100%" height="100vh" class="ma-0 pa-0 hero__aside animated-bg animated-bg--brand">

        <span class="blob blob-1" aria-hidden="true" />
        <span class="blob blob-2" aria-hidden="true" />
        <span class="blob blob-3" aria-hidden="true" />

        <div class="hero__panel glass glass-dark">
            <AppLogo />
            <h3 class="hero__panel-title">Welcome Back.</h3>
            <p class="hero__panel-text">Jump back in to your world of creativity.</p>
            <LoginForm dark />
        </div>
    </v-container>
</template>