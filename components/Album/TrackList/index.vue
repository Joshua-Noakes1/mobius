<script>
import { default as cardTimeFunc } from '~/assets/time/getTimeCard.ts';

export default {
    props: {
        albumData: {
            type: Object,
            required: true
        }
    },
    methods: {
        formatTimeCard(release) {
            return cardTimeFunc(release);
        }
    }
}
</script>

<template>
    <div class="card" data-bs-theme="dark">
        <div class="card-body">
            <a :href="albumData.meta.itunes.url" target="_blank">
                <h5 class="d-block d-lg-none">{{ albumData.name }} ({{ formatTimeCard(albumData.meta.releaseDate).year }})</h5><h5 class="card-title">Track List [Tracks: {{ albumData.meta.trackCount }}]</h5>
            </a>
            <div class="container-fluid">
                <span v-for="track of albumData.tracks" :key="track.id">
                    <h6><a :href="track.meta.itunes.url" target="_blank">{{ track.track }} - {{ track.name }} <i v-if="track.meta.isExplicit" class="fa-solid fa-land-mine-on" title="Track Explicit"></i></a> <audio v-if="track.preview !== ''" :src="track.preview" controls class="float-end"></audio></h6>
                    <small class="card-text">{{ track.meta.composer }}</small>
                    <div style="margin-top: 0.5rem;"></div>
                </span>
            </div>

        </div>
    </div>
</template>

<style scoped>
a {
    color: #4383bb;
    text-decoration: none;
}
</style>