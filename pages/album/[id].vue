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
let albumDataSEO = {...albumData["_value"]};
if (albumDataSEO.name.toString().toLowerCase().includes("single")) {
    albumDataSEO.name = albumDataSEO.name.replace(" - Single", "");
}

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

<template>
    <div id="albumPage" class="container-fluid">
        <div class="row">
            <div class="col-12 flex-column-reverse col-lg-7 order-2 order-lg-1">
                <AlbumTrackList :albumData="albumData" class="" />
                <div class="d-block d-lg-none" style="margin-top: 1rem;"></div>
            </div>
            <div class="col-12 col-lg-5 order-1 order-lg-2">
                <AlbumInfoBox :albumData="albumData" class="" />
                <div class="d-block d-lg-none" style="margin-top: 1rem;"></div>
            </div>
        </div>
    </div>
    <!-- {{ albumData }} -->
</template>

<style></style>