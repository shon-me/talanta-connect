<script setup>
import SignupForm from '@/components/auth/SignupForm.vue';
import AppLogo from '@/components/ui/AppLogo.vue';
</script>

<template>
    <v-container max-width="100%" height="100vh" class="ma-0 pa-0 hero__aside animated-bg animated-bg--brand">

        <span class="blob blob-1" aria-hidden="true" />
        <span class="blob blob-2" aria-hidden="true" />
        <span class="blob blob-3" aria-hidden="true" />

        <div class="hero__panel glass glass-dark">
            <AppLogo />
            <h3 class="hero__panel-title">Welcome To The Community</h3>
            <p class="hero__panel-text">Connect With Brands And Creators.</p>
            <SignupForm dark />
        </div>
    </v-container>
</template>