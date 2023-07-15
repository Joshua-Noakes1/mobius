<script setup></script>

<template>
    <nav class="navbar navbar-expand-lg bg-body-tertiary" data-bs-theme="dark">
        <div class="container-fluid">
            <NuxtLink class="navbar-brand" to="/">Mobius</NuxtLink>
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavAltMarkup"
                aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse justify-content-end" id="navbarNavAltMarkup">
                <div class="navbar-nav">
                    <a class="nav-link" href="https://www.isrcfinder.com/reverse-lookup/" target="_blank">ISRC Finder</a>
                    <NuxtLink class="nav-link" to="/">Search</NuxtLink>
                </div>
            </div>
        </div>
    </nav>
</template>

<style scoped></style>