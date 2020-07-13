import { ServiceResponse } from "../classes/service.response";
import { strings } from "./strings";

/**
 * Gets URL from message
 * @param message (string)
 * @returns URL (string) 
 */
function getUrlFromMessage(message: string): string {
    message = message.replace(/\/dodaj/g, '').trim();
    return message;
}
/**
 * Gets service from URL
 * @param message (string)
 * @returns ServiceResponse
 */
function getServiceFromUrl(message: string): ServiceResponse {

    // RegExp pattern: https:// + one of < (www.)otomoto.pl || (www.)olx.pl || (www.)allegro.pl> + /any_word (because we want link to somewhere, not the home page)
    const services: RegExpMatchArray | null = message.match(/(https:\/\/)(www.otomoto.pl|otomoto.pl|olx.pl|www.olx.pl|m.olx.pl|www.m.olx.pl|allegro.pl|www.allegro.pl)\/\w+/g);
    
    // Bad format - no service provided
    if (!services){
        return new ServiceResponse()
                .setSuccess(false)
                .setMessage(strings.incorrect_url);
    }
    // More than 1 URL provided
    else if ( services.length > 1 ) {
        return new ServiceResponse()
                .setSuccess(false)
                .setMessage(strings.mulitple_url);
    }

    // Check the service to which the link is provided
    let serviceName: string = "";
    if( services[0].includes('olx.pl') ) {
        serviceName = "OLX";
    }
    else if (services[0].includes('otomoto.pl')) {
        serviceName = "OtoMoto";
    }
    else if (services[0].includes('allegro.pl')) {
        serviceName = "Allegro";
    }
    else {
        return new ServiceResponse()
                .setSuccess(false)
                .setMessage(strings.incorrect_url);
    }
    
    return new ServiceResponse()
            .setSuccess(true)
            .setName(serviceName);
}


export { getUrlFromMessage, getServiceFromUrl }