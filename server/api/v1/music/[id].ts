import { default as getAlbum } from "~/assets/music/getAlbum";

export default defineEventHandler(async (event) => {
    // console.log(event)

    try {
        // get id param from user
        const id = event.context.params.id;
        let { storeID } = getQuery(event);
        if (!id || id == "") {
            // console.log(id)
            let error: any = new Error("Album ID is required");
            error["status"] = 400;
            throw error;
        }

        // attempt to get search from AM
        let amResult = await getAlbum(id, storeID);
        if (!amResult["success"]) {
            let error: any = new Error(`AM Error, please try again later;${amResult["error"]}`);
            error["status"] = 502;
            throw error;
        }

        // check if album was found
        // console.log(amResult)
        if (amResult["data"].length <= 0) {
            let error: any = new Error(`Album not found`);
            error["status"] = 404;
            throw error;
        }

        // sort through results
        let album = amResult["data"][0];
        if (!album.type.includes("album")) {
            let error: any = new Error(`Unsupoorted type ${album.type}`);
            error["status"] = 400;
            throw error;
        }


        return {
            status: true,
            data: {
                id: album.id,
                name: album.attributes.name,
                artist: album.attributes.artistName,
                artwork: album.attributes.artwork.url.replace("{w}", album.attributes.artwork.width).replace("{h}", album.attributes.artwork.height),
                artworkLQ: album.attributes.artwork.url.replace("{w}", album.attributes.artwork.width / 10).replace("{h}", album.attributes.artwork.height / 10),
                artworkVideo: album.attributes.editorialVideo !== undefined ? album.attributes.editorialVideo.motionDetailSquare.video : '',
                barEditorArtwork: album.attributes.editorialArtwork !== undefined ? album.attributes.editorialArtwork.bannerUber !== undefined ? album.attributes.editorialArtwork.bannerUber.url.replace("{w}", album.attributes.editorialArtwork.bannerUber.width).replace("{h}", album.attributes.editorialArtwork.bannerUber.height).replace("{f}", "png") : album.attributes.editorialArtwork.storeFlowcase !== undefined ? album.attributes.editorialArtwork.storeFlowcase.url.replace("{w}", album.attributes.editorialArtwork.storeFlowcase.width).replace("{h}", album.attributes.editorialArtwork.storeFlowcase.height).replace("{f}", "png") : '' : '', // yes this is actually fucked
                barEditorArtworkLQ: album.attributes.editorialArtwork !== undefined ? album.attributes.editorialArtwork.bannerUber !== undefined ? album.attributes.editorialArtwork.bannerUber.url.replace("{w}", album.attributes.editorialArtwork.bannerUber.width / 10).replace("{h}", album.attributes.editorialArtwork.bannerUber.height / 10).replace("{f}", "png") : album.attributes.editorialArtwork.storeFlowcase !== undefined ? album.attributes.editorialArtwork.storeFlowcase.url.replace("{w}", album.attributes.editorialArtwork.storeFlowcase.width / 10).replace("{h}", album.attributes.editorialArtwork.storeFlowcase.height / 10).replace("{f}", "png") : '' : '', // yes this is actually fucked
                genre: album.attributes.genreNames,
                meta: {
                    copyright: album.attributes.copyright,
                    label: album.attributes.recordLabel,
                    upc: album.attributes.upc,
                    trackCount: album.attributes.trackCount,
                    isPreRelease: album.attributes.isPrerelease,
                    releaseDate: new Date(album.attributes.releaseDate).getTime(),
                    preferredColor: album.attributes.artwork.bgColor,
                    isExplicit: album.attributes.contentRating !== undefined ? album.attributes.contentRating.toString().toLowerCase() == "explicit" : false,
                    notes: {
                        long: album.attributes.editorialNotes ? album.attributes.editorialNotes.standard !== undefined ? album.attributes.editorialNotes.standard.replace(/(<([^>]+)>)/gi, "") : "" : '',
                        short: album.attributes.editorialNotes ? album.attributes.editorialNotes.short !== undefined ? album.attributes.editorialNotes.short.replace(/(<([^>]+)>)/gi, "")  : "": '',
                    },
                    price: {
                        amPrice: album.attributes.offers.find((offer: any) => offer.type === "subscription") ? album.attributes.offers.find((offer: any) => offer.type === "subscription").priceFormatted : 0,
                        buyPrice: album.attributes.offers.find((offer: any) => offer.type === "buy" || offer.type === "preorder") ? album.attributes.offers.find((offer: any) => offer.type === "buy" || offer.type === "preorder").priceFormatted : 0,
                    },
                    itunes: {
                        url: album.attributes.url,
                        anyFeatures: album.attributes.isMasteredForItunes || album.attributes.isSingle || album.attributes.audioTraits.map((trait: any) => trait.toString().toLowerCase() === "lossless").includes(true) || album.attributes.audioTraits.map((trait: any) => trait.toString().toLowerCase() === "lossy-stereo").includes(true) || album.attributes.audioTraits.map((trait: any) => trait.toString().toLowerCase() === "high-res-lossless").includes(true) || album.attributes.audioTraits.map((trait: any) => trait.toString().toLowerCase() === "atmos").includes(true) || album.attributes.audioTraits.map((trait: any) => trait.toString().toLowerCase() === "spatial").includes(true),
                        isMasteredForItunes: album.attributes.isMasteredForItunes,
                        isSingle: album.attributes.isSingle,
                        isLossless: album.attributes.audioTraits.map((trait: any) => trait.toString().toLowerCase() === "lossless").includes(true),
                        isLossyStereo: album.attributes.audioTraits.map((trait: any) => trait.toString().toLowerCase() === "lossy-stereo").includes(true),
                        isHighResLossless: album.attributes.audioTraits.map((trait: any) => trait.toString().toLowerCase() === "high-res-lossless").includes(true), // eg 24-bit 96kHz ALAC
                        isAtmos: album.attributes.audioTraits.map((trait: any) => trait.toString().toLowerCase() === "atmos").includes(true), // eg 24-bit 48kHz Dolby Atmos
                        isSpatial: album.attributes.audioTraits.map((trait: any) => trait.toString().toLowerCase() === "spatial").includes(true), // funny airpods
                    }
                },
                tracks: album.relationships.tracks.data.map((track: any) => {
                    return {
                        id: track.id,
                        name: track.attributes.name,
                        artwork: track.attributes.artwork.url.replace("{w}", track.attributes.artwork.width).replace("{h}", track.attributes.artwork.height).replace("{f}", "png"),
                        preview: track.attributes.previews.length > 0 ? track.attributes.previews[0].url : '',
                        track: track.attributes.trackNumber,
                        duration: track.attributes.durationInMillis,
                        meta: {
                            releaseDate: track.attributes.releaseDate !== undefined ? new Date(track.attributes.releaseDate).getTime() : new Date(album.attributes.releaseDate).getTime(), // in 99.9% of cases, the track release date is the same as the album release date
                            isrc: track.attributes.isrc,
                            composer: track.attributes.composerName,
                            diskNumber: track.attributes.discNumber,
                            isExplicit: track.attributes.contentRating !== undefined ? track.attributes.contentRating.toString().toLowerCase() == "explicit" : false,
                            price: {
                                amPrice: track.attributes.offers.find((offer: any) => offer.type === "subscription") ? track.attributes.offers.find((offer: any) => offer.type === "subscription").priceFormatted : 0,
                                buyPrice: track.attributes.offers.find((offer: any) => offer.type === "buy") ? track.attributes.offers.find((offer: any) => offer.type === "buy").priceFormatted : 0,
                            },
                            itunes: {
                                url: track.attributes.url,
                                anyFeatures: track.attributes.isMasteredForItunes || track.attributes.audioTraits.map((trait: any) => trait.toString().toLowerCase() === "lossless").includes(true) || track.attributes.audioTraits.map((trait: any) => trait.toString().toLowerCase() === "lossy-stereo").includes(true) || track.attributes.audioTraits.map((trait: any) => trait.toString().toLowerCase() === "high-res-lossless").includes(true) || track.attributes.audioTraits.map((trait: any) => trait.toString().toLowerCase() === "atmos").includes(true) || track.attributes.audioTraits.map((trait: any) => trait.toString().toLowerCase() === "spatial").includes(true),
                                hasLyrics: track.attributes.hasLyrics,
                                hasSyncedLyrics: track.attributes.hasTimeSyncedLyrics,
                                isMasteredForItunes: track.attributes.isMasteredForItunes,
                                isADM: track.attributes.isAppleDigitalMaster,
                                isLossless: track.attributes.audioTraits.map((trait: any) => trait.toString().toLowerCase() === "lossless").includes(true),
                                isLossyStereo: track.attributes.audioTraits.map((trait: any) => trait.toString().toLowerCase() === "lossy-stereo").includes(true),
                                isHighResLossless: track.attributes.audioTraits.map((trait: any) => trait.toString().toLowerCase() === "high-res-lossless").includes(true), // eg 24-bit 96kHz ALAC
                                isAtmos: track.attributes.audioTraits.map((trait: any) => trait.toString().toLowerCase() === "atmos").includes(true), // eg 24-bit 48kHz Dolby Atmos
                                isSpatial: track.attributes.audioTraits.map((trait: any) => trait.toString().toLowerCase() === "spatial").includes(true), // funny airpods
                            }
                        }
                    }
                }),

            }
        }
    } catch (err: any) {
        event.node.res.statusCode = err["status"] || 500;
        return {
            status: false,
            error: err.message.split(";")[0].trim(),
            errorDetail: err.message.split(";")[1] || ""
        };
    }
});