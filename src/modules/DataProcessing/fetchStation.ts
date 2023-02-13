import { Profit } from './processOrdersData'

interface Station{
    name:string,
}

async function fetchStationName(order:Profit):Promise<Station>{
    const url = `https://esi.evetech.net/latest/universe/stations/${order.location_id}/?datasource=tranquility`
    const result = await fetch(url)
    return result.json();
}

export default fetchStationName