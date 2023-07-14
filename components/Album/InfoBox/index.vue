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
        },

        async playArtworkVideo() {
            var artworkVideo = document.getElementById('artworkVideo');
            var videoSrc = this.albumData.artworkVideo;
            if (Hls.isSupported()) {
                var hls = new Hls();
                hls.loadSource(videoSrc);
                hls.attachMedia(artworkVideo);
            }
            else if (video.canPlayType('application/vnd.apple.mpegurl')) {
                artworkVideo.src = videoSrc;
            }
            artworkVideo.play();
        }
    },

    mounted() {
        if (this.albumData.artworkVideo !== '') {
            this.playArtworkVideo();
        }
    }
}
</script>

<template>
    <div class="card mb-3" data-bs-theme="dark">
        <img v-if="albumData.barEditorArtwork !== ''" :src="albumData.barEditorArtwork" class="card-img-top rounded"
            :alt="albumData.artist" :title="albumData.artist" style="margin-bottom: 0.3rem;">
        <div class="row g-0">
            <div class="col-md-4">
                <small v-if="albumData.artworkVideo !== ''" class="card-text">Album Cover</small>
                <img :src="albumData.artwork" class="img-fluid rounded-start mx-auto" :alt="albumData.name"
                    :title="albumData.name">
                <small v-if="albumData.artworkVideo !== ''" class="card-text">Album Video</small>
                <video v-if="albumData.artworkVideo !== ''" id="artworkVideo" class="img-fluid rounded-start mx-auto"
                    autoplay muted loop></video>
            </div>
            <div class="col-md-8">
                <div class="card-body">
                    <a :href="albumData.meta.itunes.url" target="_blank">
                        <h5 class="card-title"><span v-if="albumData.meta.isPreRelease">[Pre-Release] </span>{{
                            albumData.name }} ({{ formatTimeCard(albumData.meta.releaseDate).year }}) [UPC: {{
        albumData.meta.upc }}] <i v-if="albumData.meta.isExplicit" class="fa-solid fa-land-mine-on" title="Album Explicit"></i></h5>
                    </a>
                    <p class="card-text">{{ albumData.artist }}</p>
                    <small id="labelAndCopyright">
                        <small class="card-text">Label / Copyright</small>
                        <p class="text-muted">{{ albumData.meta.label }} ({{ albumData.meta.copyright }})</p>
                    </small>
                    <span id="genre">
                        <details style="padding-bottom: 0.3rem;" open>
                            <summary><small class="card-text">Genre{{ albumData.genre.length !== 1 ? 's' : '' }}</small>
                            </summary>
                            <p v-for="genre in albumData.genre" class="text-muted">• {{ genre }}</p>
                        </details>
                    </span>
                    <span v-if="albumData.meta.itunes.anyFeatures" id="features">
                        <small class="card-text">Features</small>
                        <p v-if="albumData.meta.itunes.isSingle" class="text-muted"><i class="fa-solid fa-turntable"></i><i
                                class="fa-solid fa-user"></i> Released as Single</p>
                        <p v-if="albumData.meta.itunes.isLossyStereo" class="text-muted"><i
                                class="fa-solid fa-headphones"></i> Lossy Stereo</p>
                        <p v-if="albumData.meta.itunes.isMasteredForItunes" class="text-muted"><i
                                class="fa-solid fa-record-vinyl"></i> Mastered for iTunes</p>
                        <p v-if="albumData.meta.itunes.isLossless" class="text-muted"><i
                                class="fa-solid fa-record-vinyl"></i> Lossless</p>
                        <p v-if="albumData.meta.itunes.isHighResLossless" class="text-muted"><i
                                class="fa-solid fa-record-vinyl"></i> High-Res Lossless</p>
                        <p v-if="albumData.meta.itunes.isAtmos" class="text-muted"><i class="fa-solid fa-volume-high"></i>
                            Dolby Atmos</p>
                        <p v-if="albumData.meta.itunes.isSpatial" class="text-muted"><i
                                class="fa-solid fa-headphones-simple"></i> Spatial Audio</p>
                    </span>
                    <span id="shortNote" v-if="albumData.meta.notes.short !== ''">
                        <small class="card-text">Short Editors Note</small>
                        <p class="text-muted">{{ albumData.meta.notes.short }}</p>
                    </span>
                    <span id="longNote" v-if="albumData.meta.notes.long !== ''">
                        <details>
                            <summary><small class="card-text">Editors Note</small></summary>
                            <p class="text-muted">{{ albumData.meta.notes.long }}</p>
                        </details>
                    </span>
                    <p class="card-text"><small class="text-body-secondary">Released: {{
                        formatTimeCard(albumData.meta.releaseDate).relativeTime }} ({{
        formatTimeCard(albumData.meta.releaseDate).dateName }} {{
        formatTimeCard(albumData.meta.releaseDate).date }}{{
        formatTimeCard(albumData.meta.releaseDate).ordinal }} {{
        formatTimeCard(albumData.meta.releaseDate).monthName }} {{
        formatTimeCard(albumData.meta.releaseDate).year }})</small></p>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
a {
    color: #4383bb;
    text-decoration: none;
}</style>