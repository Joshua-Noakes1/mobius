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
                genre: album.attributes.genreNames,
                meta: {
                    copyright: album.attributes.copyright,
                    label: album.attributes.recordLabel,
                    upc: album.attributes.upc,
                    trackCount: album.attributes.trackCount,
                    isPreRelease: album.attributes.isPrerelease,
                    releaseDate: new Date(album.attributes.releaseDate).getTime(),
                    preferredColor: album.attributes.artwork.bgColor,
                    notes: {
                        long: album.attributes.editorialNotes ? album.attributes.editorialNotes.standard : '',
                        short: album.attributes.editorialNotes ? album.attributes.editorialNotes.short : '',
                    },
                    itunes: {
                        url: album.attributes.url,
                        isMasteredForItunes: album.attributes.isMasteredForItunes,
                        isSingle: album.attributes.isSingle,
                    }
                },
                tracks: album.relationships.tracks.data.map((track: any) => {
                    return {
                        id: track.id,
                        name: track.attributes.name,
                        artwork: track.attributes.artwork.url.replace("{w}", track.attributes.artwork.width).replace("{h}", track.attributes.artwork.height),
                        preview: track.attributes.previews.length > 0 ? track.attributes.previews[0].url : '',
                        track: track.attributes.trackNumber,
                        duration: track.attributes.durationInMillis,
                        meta: {
                            apiURL: track.href,
                            releaseDate: track.attributes.releaseDate !== undefined ? new Date(track.attributes.releaseDate).getTime() : new Date(album.attributes.releaseDate).getTime(), // in 99.9% of cases, the track release date is the same as the album release date
                            isrc: track.attributes.isrc,
                            composer: track.attributes.composerName,
                            itunes: {
                                url: track.attributes.url,
                                hasLyrics: track.attributes.hasLyrics,
                                hasSyncedLyrics: track.attributes.hasTimeSyncedLyrics,
                                isMasteredForItunes: track.attributes.isMasteredForItunes,
                                isADM: track.attributes.isAppleDigitalMaster,
                                isLossless: track.attributes.audioTraits.map((trait: any) => trait.toString().toLowerCase() === "lossless").includes(true),
                                isLossyStereo: track.attributes.audioTraits.map((trait: any) => trait.toString().toLowerCase() === "lossy-stereo").includes(true),
                                isHighResLossless: track.attributes.audioTraits.map((trait: any) => trait.toString().toLowerCase() === "high-res-lossless").includes(true), // eg 24-bit 96kHz ALAC
                                isAtmos: track.attributes.audioTraits.map((trait: any) => trait.toString().toLowerCase() === "atmos").includes(true), // eg 24-bit 48kHz Dolby Atmos
                                isSpacial: track.attributes.audioTraits.map((trait: any) => trait.toString().toLowerCase() === "spatial").includes(true), // funny airpods
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