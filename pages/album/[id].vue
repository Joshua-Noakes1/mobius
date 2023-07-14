<script setup>


// get album id from url and storeID from params
const route = useRoute();
let albumID = route.params.id;
let storeID = route.query.storeID;
if (!storeID) {
    storeID = 'nz';
}

// get album data from store
let { data: albumData, error: albumError } = await useFetch(`/api/v1/music/${albumID}?storeID=${storeID}`, {
    transform: (data) => {
        return data["data"];
    }
});
let albumDataSEO = albumData["_value"];

useSeoMeta({
    title: `${albumDataSEO.name}`,
    description: `${albumDataSEO.name} - ${albumDataSEO.artist}`,
    ogTitle: `${albumDataSEO.name}`,
    ogDescription: `${albumDataSEO.name} - ${albumDataSEO.artist}`,
    ogImage: `${albumDataSEO.artwork}`,
    ogUrl: `${albumDataSEO.meta.itunes.url}`,
    twitterTitle: `${albumDataSEO.name}`,
    twitterDescription: `${albumDataSEO.name} - ${albumDataSEO.artist}`,
    twitterImage: `${albumDataSEO.artwork}`,
    twitterCard: 'summary_large_image'
});

useHead({
    htmlAttrs: {
        lang: 'en'
    },
    meta: [
        {
            name: 'theme-color',
            content: `#${albumDataSEO.meta.preferredColor}`
        }
    ],
    link: [
        {
            rel: 'icon',
            href: `${albumDataSEO.artwork}`
        }
    ]
})
</script>

<script>
// import components
import { default as cardTimeFunc } from '~/assets/time/getTimeCard.ts';

export default {
    methods: {
        formatTimeCard(release) {
            let timeCard = cardTimeFunc(release);
            return `${timeCard.date} ${timeCard.monthName} ${timeCard.year}`;
        }
    }
}
</script>

<template>
    <div id="albumPage" class="container-fluid">
        <div class="row">
            <div class="col-7">

            </div>
            <div class="col-5">
                <AlbumInfoBox :albumData="albumData" />
            </div>
        </div>
    </div>
    {{ albumData }}
</template>

<style></style>