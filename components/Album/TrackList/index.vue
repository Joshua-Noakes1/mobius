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
                    <div v-if="track.meta.itunes.anyFeatures" class="d-none d-lg-block">
                        <small class="card-text text-muted">Features: <i v-if="track.meta.itunes.hasLyrics" class="fa-solid fa-music" title="Has Lyrics"></i> <i v-if="track.meta.itunes.hasSyncedLyrics" class="fa-solid fa-clock" title="Has Synced Lyrics" style="margin-left: 0.2rem;"></i> <i v-if="track.meta.itunes.isMasteredForItunes" class="fa-solid fa-record-vinyl" title="Mastered For iTunes" style="margin-left: 0.2rem;"></i> <i v-if="track.meta.itunes.isSingle" class="fa-solid fa-user" title="Relased as Single" style="margin-left: 0.2rem;"></i> <i v-if="track.meta.itunes.isLossless" class="fa-solid fa-record-vinyl" title="Lossless" style="margin-left: 0.2rem;"></i> <i v-if="track.meta.itunes.isLossyStereo" class="fa-solid fa-headphones" title="Lossy Stereo" style="margin-left: 0.2rem;"></i> <i v-if="track.meta.itunes.isHighResLossless" class="fa-solid fa-record-vinyl" title="Hi-Res Lossless" style="margin-left: 0.2rem;"></i> <i v-if="track.meta.itunes.isAtmos" class="fa-solid fa-volume-high" title="Dolby Atmos" style="margin-left: 0.2rem;"></i> <i v-if="track.meta.itunes.isSpatial" class="fa-solid fa-headphones-simple" title="Spatial Audio" style="margin-left: 0.2rem;"></i></small>
                    </div>
                    <div style="margin-top: 0.5rem; @media(996px) { margin-top: 1rem;}"></div>
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