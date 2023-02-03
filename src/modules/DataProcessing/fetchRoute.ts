async function fetchRoute(sysId:number,security:boolean):Promise<Array<number>>{
    const url = `https://esi.evetech.net/latest/route/30000142/${sysId}/?datasource=tranquility&flag=${security?'secure':'shortest'}`
    const result = await fetch(url)
    return result.json();
}

export default fetchRoute