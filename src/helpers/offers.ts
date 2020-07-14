import { getUrl } from './http';
import { OLXParser } from '../parsers/OLXParser';
import { OtoMotoParser } from '../parsers/OtoMotoParser';


/**
 * Get offers from given service
 * @param service (string)
 * @param url (string)
 * @returns Offers (string[]) 
 */
async function getOffersFromService(service: string, url: string): Promise<string[]> {
    
    let ret: string[] = [];
    const content = await getUrl(url);
    if ( typeof(content) === undefined ) { return []; };
    
    switch(service) {
        case "OtoMoto":
            const otomoto = new OtoMotoParser();
            ret = await otomoto.getUrls(content!)
           break;
        case "OLX":
           const olx = new OLXParser;
           ret = await olx.getUrls(content!);
           break;
        case "Allegro":
           break;
            // @TODO;
            // return AllegroParser(response);
        default:
            ret = []
    }

    return ret;
}

export { getOffersFromService }