import { developerToken } from "../../../../assets/token.json";

export default defineEventHandler(async (event) => {
    try {
        // get id param from user
        const id = event.context.params.id;
        if (!id || id == "") {
            console.log(id)
            let error: any = new Error("Album ID is required");
            error["status"] = 400;
            throw error;
        }

        // attempt to get search from AM
        try {
            let amSearchRaw = await fetch(`https://amp-api.music.apple.com/v1/catalog/us/albums?ids=${id}`, {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${developerToken}`,
                    "Origin": "https://music.apple.com",
                }
            });
            if (amSearchRaw.status != 200) {
                let amResultText = await amSearchRaw.text();
                let error: any = new Error(`AM Error, please try again later ${amResultText}`);
                error["status"] = 502; // bad gateway (Bad Tim Cook, Bad!)
                throw error;
            }
            var amResult = await amSearchRaw.json();
        } catch (err) {
            let error: any = new Error(`AM Error, please try again later ${err}`);
            return error;
        }

        return {
            status: true,
            data: amResult["data"]
        }
    } catch (err: any) {
        event.node.res.statusCode = err["status"] || 500;
        return {
            status: false,
            error: err.message
        };
    }
});