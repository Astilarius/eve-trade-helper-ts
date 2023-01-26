import regions, { Region } from "../../data/regions"
export interface Order{
    duration:number,
    is_buy_order:boolean,
    issued:string,
    location_id:number,
    min_volume:number,
    order_id:number,
    price:number,
    range:string,
    system_id:number,
    type_id:number,
    volume_remain:number,
    volume_total:number,
}

function instanceOfRegion(object: any): object is Region {return 'id' in object && 'name' in object;}
function instanceOfOrderArr(object: any): object is Order[] {return 'duration' in object[0] 
    && 'is_buy_order' in object[0]
    && 'issued' in object[0]
    && 'location_id' in object[0]
    && 'min_volume' in object[0]
    && 'order_id' in object[0]
    && 'price' in object[0]
    && 'range' in object[0]
    && 'system_id' in object[0]
    && 'type_id' in object[0]
    && 'volume_remain' in object[0]
    && 'volume_total' in object[0];}
function instanceOfObjectArr(object: any): object is Object[] {return 'member' in object;}



async function loadAllOrdersData():Promise<Order[]>{
    var orders:Order[]=[]
    let pagesNumber;
    await Promise.all(regions.map(async (region) => {
        await fetch(`https://esi.evetech.net/latest/markets/${region.id}/orders/?datasource=tranquility&order_type=buy&page=1`)
            .then((response) => {
                pagesNumber = Number(response.headers.get("x-pages"))+1;
                const r = response.json();
                r.then(rr => {
                    if(instanceOfOrderArr(rr)){
                        orders = orders.concat(rr);
                    }
                })
                for(let i=2;i<pagesNumber;i++){
                    fetch(`https://esi.evetech.net/latest/markets/${region.id}/orders/?datasource=tranquility&order_type=buy&page=${i}`)
                        .catch(err => {
                            console.log(err);
                            return err;
                        })
                        .then((response) => {
                            const r = response.json();
                            r.then((rr: ConcatArray<Object>) => {
                                if(instanceOfOrderArr(rr)){
                                    orders = orders.concat(rr);
                                }
                            })
                        })
                }
            });
        await fetch(`https://esi.evetech.net/latest/markets/${region.id}/orders/?datasource=tranquility&order_type=sell&page=1`)
            .then((response) => {
                pagesNumber = Number(response.headers.get("x-pages"))+1;
                const r = response.json();
                r.then(rr => {
                    if(instanceOfOrderArr(rr)){
                        orders = orders.concat(rr);
                    }
                })
                for(let i=2;i<pagesNumber;i++){
                    fetch(`https://esi.evetech.net/latest/markets/${region.id}/orders/?datasource=tranquility&order_type=sell&page=${i}`)
                        .catch(err => {
                            console.log(err);
                            return err;
                        })
                        .then((response) => {
                            const r = response.json();
                            r.then((rr: ConcatArray<Object>) => {
                                if(instanceOfOrderArr(rr)){
                                    orders = orders.concat(rr);
                                }
                            })
                        })
                }
            });
    }))
    console.log(orders);
    return orders;
}

export default loadAllOrdersData