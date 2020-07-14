import { AxiosResponse } from "axios";
import cheerio from "cheerio";

/**
 * OtoMoto Parser
 */
class OtoMotoParser {

    /**
     * Gets OtoMoto Urls
     * @param response 
     * @returns urls (string[])
     */
    async getUrls(response: AxiosResponse): Promise<string[]> {
        const html = response.data;
        const $ = cheerio.load(html);
        const cars = $('.offers.list > article').toArray();
        let urls: string[] = []
        for(let car of cars) {
            urls.push(car.attribs["data-href"]);
        }
        return urls;
    }
}

export { OtoMotoParser }