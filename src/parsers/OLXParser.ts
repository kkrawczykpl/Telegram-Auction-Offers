import { AxiosResponse } from "axios";
import cheerio from "cheerio";

/**
 * OLX Parser
 */
class OLXParser {

    /**
     * Gets OLX Urls
     * @param response 
     * @returns urls (string[])
     */
    async getUrls(response: AxiosResponse): Promise<string[]> {
        const html = response.data;
        const $ = cheerio.load(html);
        const auctions = $('.marginright5.link.linkWithHash').toArray();
        let urls: string[] = []
        for(let offer of auctions) {
            // URLs have different parameters depending on the time e.g "#hash;promoted". Just get rid of them
            let url: string | undefined =  offer.attribs["href"].split('.html', 1).shift();
            if(!url) {
                break;
            }
            urls.push(url + '.html');
        }
        return urls;
    }
}

export { OLXParser }