import { Order } from "./loadAllOrdersData"
import items, {Item} from '../../data/items'
import systems, {System} from "../../data/systems"
import type { UserData } from '../UserDataForm/UserDataForm'

export interface BuySellOrders{
    buy:Order[],
    sell:Order[],
}
interface Profit extends Order{
    profit:number,  
}
interface OrdersGroupedByJita{
    orders:{
        jita: BuySellOrders,
        nonjita: BuySellOrders,
    },
    name:string,
    volume:number,
    id:number,
}
interface ItemOrderData{
    orders: BuySellOrders,
    id: number,
    name: string,
    volume: number,
    profit: number,
    vol_profit: number,
}
interface SystemOrderData{
    items:Array<ItemOrderData>,
    id:number,
    name: string,
    profit:number,
    cart:Array<Order>,
    order_vol:number,
    order_price:number,
    toClipBoard:string,
    jumps:number,
    prof_per_jump:number
}

function processOrdersData(downloadedOrders:Order[], userData:UserData){
    console.log(userData)
    console.log(downloadedOrders)
    const allowedItems = items.filter(item => item.volume < userData.volume)
    const allowedItemsIds:number[] = allowedItems.map(item => item.id)
    const allowedSystems = userData.highsec ? (systems.filter(system => system.sec > 0.45)) : systems
    const allowedSystemsIds:number[] = allowedSystems.map(sys=>sys.id)
    console.log(allowedItemsIds)
    console.log(allowedSystemsIds)
    const sortedOutOrders:Order[] = userData.highsec ?  downloadedOrders.filter(order => {
            if(!allowedItemsIds.includes(order.type_id)) return false;
            if(!allowedSystemsIds.includes(order.system_id)) return false;
            return order.price < userData.capital;
        }) : downloadedOrders.filter(order => {
            if(!allowedItemsIds.includes(order.type_id)) return false;
            return order.price < userData.capital;
        })
    console.log(sortedOutOrders)

    var tempOrders = sortedOutOrders.reduce((r, a)=>{//creating sellData object
        r[a.system_id] = r[a.system_id] || [];
        r[a.system_id].push(a);
        return r;
        }, Object.create(null));
    for(var system in tempOrders){//grouping buyData by type_id
        tempOrders[system] = tempOrders[system].reduce((r:any, a:any)=>{
            r[a.type_id] = r[a.type_id] || [];
            r[a.type_id].push(a);
            return r;
        }, Object.create(null));
      };
    console.log(tempOrders)
    for(var orderSystem in tempOrders){
        const system:System = allowedSystems.find(sys=>sys.id===Number(orderSystem))!
        tempOrders[orderSystem]={//adding 'profit' property to each buyData system
            'items':tempOrders[orderSystem],
            'id':Number(orderSystem),
            'name': tempOrders.system_name,
            'profit':0,
            'cart':[],
            'order_vol':0,
            'order_price':0,
            'toClipBoard': ' ',
            'jumps':0,
            'prof_per_jump':0,
        };
        for (var item in tempOrders[orderSystem]['items']){
            const orderItem:Item = allowedItems.find(tempItem=>tempItem.id===Number(item))!
            tempOrders[orderSystem]['items'][Number(item)] = {//adding properties to each item in system
                'orders': {
                    buy:tempOrders[orderSystem]['items'][Number(item)].filter((o: { is_buy_order: boolean }) => o.is_buy_order),
                    sell:tempOrders[orderSystem]['items'][Number(item)].filter((o: { is_buy_order: boolean }) => !o.is_buy_order),
                },
                'id': Number(item),
                'name': orderItem.name,
                'volume': orderItem.volume,
                'profit': 0,
                'vol_profit': 0,
              };
        }
    }
    console.log(tempOrders)
    var groupedOrders:SystemOrderData[] = tempOrders;
    console.log(groupedOrders)
    for(var item in groupedOrders['30000142']['items']){
        groupedOrders['30000142']['items'][item].orders.buy.sort((a, b) => {
            return b.price - a.price
        })
        groupedOrders['30000142']['items'][item].orders.sell.sort((a, b) => {
            return a.price - b.price
        })
    }

    console.log(groupedOrders['30000142']['items'])

    for(var system in groupedOrders){
        if (system==='30000142'){
            continue;
        } else {
            for (var item in groupedOrders[system]['items']){
                groupedOrders[system]['items'][item].orders.buy.sort((a, b) => {
                    return b.price - a.price
                })
                groupedOrders[system]['items'][item].orders.sell.sort((a, b) => {
                    return a.price - b.price
                })
                
                const canBuyAtJita = groupedOrders['30000142']['items'][item]['orders'].sell.length===0
                    || groupedOrders[system]['items'][item]['orders'].buy.length===0;
                const canSellAtJita = groupedOrders['30000142']['items'][item]['orders'].buy.length===0
                    || groupedOrders[system]['items'][item]['orders'].sell.length===0;
                if (canBuyAtJita&&canSellAtJita){
                    const sellJitaPrice = groupedOrders['30000142']['items'][item]['orders'].sell[0].price;
                    const buyJitaPrice = groupedOrders['30000142']['items'][item]['orders'].buy[0].price;
                    const sellNonJitaPrice = groupedOrders[system]['items'][item]['orders'].sell[0].price;
                    const buyNonJitaPrice = groupedOrders[system]['items'][item]['orders'].buy[0].price;
    
                    groupedOrders[system]['items'][item].profit = 
                        buyNonJitaPrice*(1-userData.tax) - sellJitaPrice > 
                        buyJitaPrice*(1-userData.tax) - sellNonJitaPrice ? 
                        buyNonJitaPrice*(1-userData.tax) - sellJitaPrice : 
                        buyJitaPrice*(1-userData.tax) - sellNonJitaPrice;
                    groupedOrders[system]['items'][item].vol_profit = groupedOrders[system]['items'][item].profit/groupedOrders[system]['items'][item].volume;
                } else if (canBuyAtJita&&(!canSellAtJita)){
                    const sellJitaPrice = groupedOrders['30000142']['items'][item]['orders'].sell[0].price;
                    const buyNonJitaPrice = groupedOrders[system]['items'][item]['orders'].sell[0].price;
                    groupedOrders[system]['items'][item].profit = buyNonJitaPrice*(1-userData.tax) - sellJitaPrice
                    groupedOrders[system]['items'][item].vol_profit = groupedOrders[system]['items'][item].profit/groupedOrders[system]['items'][item].volume;
            
                } else if ((!canBuyAtJita)&&canSellAtJita){
                    const buyJitaPrice = groupedOrders['30000142']['items'][item]['orders'].buy[0].price;
                    const sellNonJitaPrice = groupedOrders[system]['items'][item]['orders'].buy[0].price;
                    groupedOrders[system]['items'][item].profit = buyJitaPrice*(1-userData.tax) - sellNonJitaPrice;
                    groupedOrders[system]['items'][item].vol_profit = groupedOrders[system]['items'][item].profit/groupedOrders[system]['items'][item].volume;
                } else {
                    groupedOrders[system]['items'][item].vol_profit = 0;
                }
            }
            while(userData.volume>groupedOrders[system].order_vol
                &&userData.capital>groupedOrders[system].order_price){
                    const bestDeal = groupedOrders[system].items.reduce(function(prev, current) {
                        return (prev.vol_profit > current.vol_profit) ? prev : current
                    })
                    
                }
        }
    }
}

export default processOrdersData