import { developerToken } from "../token.json";

export default async function getAlbum(albumID: string, storeFront: string = "nz", catalogType: string = "albums") {
    if (!albumID || albumID == "") {
        let error: any = new Error("Album ID is required");
        return {
            success: false,
            error: error["message"]
        }
    }
    try {
        // we use the NZ store as it is the most east from UTC (so it is the first to get new releases, as long as they are not Release Time exclusives)
        let amSearchRaw = await fetch(`https://amp-api.music.apple.com/v1/catalog/${storeFront}/${catalogType}/${albumID}?art[url]=f&extend=editorialArtwork,editorialVideo,extendedAssetUrls,offers`, {
            method: "GET",
            headers: {
                "User-Agent": `MusicKit/1.0 (iPhone; U; CPU iPhone OS 16_4 like Mac OS X; en_us; ${Math.random()})`,
                "Authorization": `Bearer ${developerToken}`,
                "Origin": "https://music.apple.com",
            }
        });
        if (amSearchRaw.status != 200) {
            let amResultText = await amSearchRaw.text();
            let error: any = new Error(`${amResultText} - ${amSearchRaw.status}`);
            error["status"] = 502; // bad gateway (Bad Tim Cook, Bad!)
            throw error;
        }
        // get data
        let amResultData = await amSearchRaw.json();

        return {
            success: true,
            data: amResultData["data"]
        };
    } catch (err) {
        let error: any = new Error(`AM Error, please try again later;${err}`);
        return {
            success: false,
            error: error["message"]
        }
    }
}