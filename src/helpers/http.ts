import axios, { AxiosResponse } from 'axios';

async function getUrl(url: string): Promise<AxiosResponse | undefined> {
    try {
        const response = await axios.get(url);
        if ( response.status === 200 ) {
            return response;
        }
    }catch (err) {
        console.log(`ERROR received from ${url}: ${err}\n`);
        return;
    }
}

export { getUrl }