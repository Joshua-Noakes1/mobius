<script setup>
// set meta stuff
let url = useRequestURL();
useSeoMeta({
    title: 'Home - Mobius',
    description: 'Apple Music API Explorer',
    ogTitle: 'Home - Mobius',
    ogDescription: 'Apple Music API Explorer',
    ogImage: `${url.origin}/images/creg.png`,
    ogUrl: 'https://music.kirasblahaj.moe',
    twitterTitle: 'Home - Mobius',
    twitterDescription: 'Apple Music API Explorer',
    twitterImage: `${url.origin}/images/creg.png`,
    twitterCard: 'summary_large_image'
});

useHead({
    htmlAttrs: {
        lang: 'en'
    },
    link: [
        {
            rel: 'icon',
            type: 'image/png',
            href: '/favicon.ico'
        }
    ]
})
</script>

<script>
import { default as amAvailability } from '~/assets/music/amAvailability.json';

export default {
    methods: {
        submit() {
            // get the data from the form
            let searchForm = document.getElementById("findSong");
            let albumID = document.getElementById("albumID").value;
            let storeID = document.getElementById("storeID").value;

            // send to the album page
            if ((albumID == null || albumID == "") || (storeID == null || storeID == "")) return;
            albumID = albumID.trim();
            storeID = storeID.trim();

            // check if the albumID is just a number or if it is a full URL which includes music.apple.com
            if (albumID.includes("music.apple.com") && albumID.includes("/album/")) {
                const regex = /\/\w+\/album\/[^/]+\/(\d+)/;
                albumID = albumID.match(regex)[1];
            }
                
            // check if the album has any ? in it 
            if (albumID.includes("?")) {
                albumID = albumID.split("?")[0];
            }

            this.$router.push(`/album/${albumID}?storeID=${storeID}`);

            // reset the form
            searchForm.reset();
        }
    }
}
</script>

<template>
    <div id="home" class="container-fluid">
        <span class="text-center">
            <h3>Mobius</h3>
            <h6>Apple Music API Explorer</h6>
        </span>
        <form id="findSong" data-bs-theme="dark" class="container" @submit.stop.prevent="submit()">
            <div class="row">
                <div class="col-12 col-lg-8 mb-3">
                    <label for="basic-url" class="form-label">Album ID</label>
                    <div class="input-group">
                        <span class="input-group-text d-none d-lg-block" id="basic-addon3"
                            title="Currents is an album by Tame Impala, after '/album/' would be different for you">https://music.apple.com/gb/album/currents/</span>
                        <input type="text" class="form-control" id="albumID" placeholder="1440838039">
                    </div>
                    <div class="form-text" id="basic-addon4">Copy the album ID into the box above.</div>
                </div>
                <div class="col-12 col-lg-4 mb-3">
                    <label for="country" class="form-label">Country</label>
                    <div class="input-group">
                        <select class="form-select round" id="storeID">
                            <option v-for="country of amAvailability" :value="country.code"
                                :selected="country.code === 'NZ'">{{ country.country.split("- ")[1].toString().trim() }} ({{ country.code }} - {{ country.country.split("- ")[0].toString().trim() }}){{ country.code === 'NZ' ? ' [Default]' : ''}}</option>
                        </select>
                    </div>
                    <div class="form-text" id="basic-addon4">This isnt the full list of support Apple Music countries.</div>
                </div>
            </div>
            <div class="row">
                <div class="col-md-12 mt-3">
                    <button type="submit" class="btn btn-outline-primary float-end">Find Album</button>
                </div>
            </div>
        </form>
        <div class="text-center fixed-bottom" title="Please don't sue me craig, I love your hair">
            <h6>Not affiliated with Apple Inc.<span class="d-none d-xl-inline-block">, Apple Music, or any of its subsidiaries and partners including but not limited to music and record labels (UMG, Sony, Warner, etc.)</span></h6>
        </div>
    </div>
</template>

<style scoped>
@media (max-width: 996px) {
    .form-control {
        border-radius: 0.5rem !important;
    }
}
</style>