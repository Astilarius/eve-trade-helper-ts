import { Order } from "./loadAllOrdersData"
import items, {Item} from '../../data/items'
import systems, {System} from "../../data/systems"
import type { UserData } from '../UserDataForm/UserDataForm'
import fetchRoute from "./fetchRoute"


export interface BuySellOrders{
    buy:Order[],
    sell:Order[],
}
interface Profit extends Order{
    profit:number,
    totalProfit:number,
    profitableAmount:number,
}
interface MainMarket{
    orders:{
        jita: BuySellOrders,
        nonjita: BuySellOrders,
    },
    name:string,
    volume:number,
    id:number,
}
interface ItemOrderData{
    orders: Profit[],
    id: number,
    name: string,
    volume: number,
    profit: number,
    vol_profit: number,
}
export interface SystemOrdersData{
    [key:string]:{
        items:{[key:string]:ItemOrderData},
        id:number,
        name: string,
        profit:number,
        cart:Array<Profit>,
        buyCart:Array<Profit>,
        sellCart:Array<Profit>,
        order_vol:number,
        order_price:number,
        jumps:number,
        prof_per_jump:number}
}
export interface SystemOrderData{
    items:{[key:string]:ItemOrderData},
    id:number,
    name: string,
    profit:number,
    cart:Array<Profit>,
    buyCart:Array<Profit>,
    sellCart:Array<Profit>,
    order_vol:number,
    order_price:number,
    jumps:number,
    prof_per_jump:number
}

async function processOrdersData(downloadedOrders:Order[], userData:UserData){
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
    var jitaOrders:Array<BuySellOrders>=[];
    for(var orderSystem in tempOrders){
        if(Number(orderSystem)===30000142){
            // jitaOrders=tempOrders[orderSystem]['items']
            // for (var item in tempOrders[orderSystem]){
            //     jitaOrders[Number(item)].buy = tempOrders[orderSystem]['items'][Number(item)].filter((order: { is_buy_order: any })=>order.is_buy_order)
            //     jitaOrders[Number(item)].sell = tempOrders[orderSystem]['items'][Number(item)].filter((order: { is_buy_order: any })=>!order.is_buy_order)
            // }
            // jitaOrders = tempOrders[orderSystem];

            for (var item in tempOrders[orderSystem]){
                jitaOrders[Number(item)] = {
                    buy:tempOrders[orderSystem][Number(item)].filter((o: { is_buy_order: boolean }) => o.is_buy_order),
                    sell:tempOrders[orderSystem][Number(item)].filter((o: { is_buy_order: boolean }) => !o.is_buy_order),
                }
            }
            // tempOrders.splice(orderSystem, 1);
            delete tempOrders[orderSystem];

            continue;
        }
        const system:System = allowedSystems.find(sys=>sys.id===Number(orderSystem))!
        if (system===undefined){
            console.log(`missing system - ${Number(orderSystem)}`)
            continue;
        }
        tempOrders[orderSystem]={//adding 'profit' property to each buyData system
            'items':tempOrders[orderSystem],
            'id':Number(orderSystem),
            'name': system.name,
            'profit':0,
            'cart':[],
            'buyCart':[],
            'sellCart':[],
            'order_vol':0,
            'order_price':0,
            'jumps': await fetchRoute(Number(orderSystem),userData.highsec).then(res=>res.length),
            'prof_per_jump':0,
        };
        for (var item in tempOrders[orderSystem]['items']){
            const orderItem:Item = allowedItems.find(tempItem=>tempItem.id===Number(item))!
            tempOrders[orderSystem]['items'][Number(item)] = {//adding properties to each item in system
                'orders': tempOrders[orderSystem]['items'][Number(item)].map((order: any)=>{
                    return {
                        ...order,
                        profit:0,
                        totalProfit:0,
                        profitableAmount:0,
                    }
                }),
                'id': Number(item),
                'name': orderItem.name,
                'volume': orderItem.volume,
                'profit': 0,
                'vol_profit': 0,
              };
        }
    }
    console.log(tempOrders)
    var groupedOrders:SystemOrdersData = tempOrders;
    console.log(groupedOrders)
    for(var item in jitaOrders){
        jitaOrders[item].buy.sort((a, b) => {
            return b.price - a.price
        })
        jitaOrders[item].sell.sort((a, b) => {
            return a.price - b.price
        })
    }
    console.log(jitaOrders)
    for(var system in groupedOrders){
        var currentSystem = groupedOrders[system]
        for (var item in groupedOrders[system].items){
            var currentItem = groupedOrders[system].items[item]
            var sortedOrders = groupedOrders[system].items[item].orders.map((order):Profit|null=>{
                if(jitaOrders[currentItem.id]===undefined) return null;
                var jitaOrder = order.is_buy_order ? jitaOrders[currentItem.id].sell[0]
                    : jitaOrders[currentItem.id].buy[0]
                if(jitaOrder===undefined) return null;
                    order.profit = order.is_buy_order ?
                    order.price*(1-userData.tax)-jitaOrder.price :
                    jitaOrder.price*(1-userData.tax)-order.price
                order.profitableAmount = jitaOrder.volume_remain > order.volume_remain ?
                    order.volume_remain : jitaOrder.volume_remain
                // order.profitableAmount = order.profitableAmount*currentItem.volume>userData.volume ? 
                //     userData.volume/currentItem.volume : order.profitableAmount
                // order.totalProfit = order.profit * order.profitableAmount
                // if (order.totalProfit > 0){
                //     console.log(order)
                // }
                return order
            })
            groupedOrders[system].items[item].orders = sortedOrders.filter(notEmpty)
            if (currentItem.orders.length>0){
                currentItem.profit = currentItem.orders[0].profit
                currentItem.vol_profit = currentItem.profit / currentItem.volume
                if (currentItem.vol_profit<=0){
                    delete groupedOrders[system].items[item]
                }
            } else {
                delete groupedOrders[system].items[item]
            }
        }
        if(currentSystem.items==null||currentSystem.items==undefined){
            continue
        }
        if (Object.keys(currentSystem.items).length < 1){
            delete groupedOrders[system]
            continue
        }
        var buyLimit = Object.assign({}, userData)
        var sellLimit = Object.assign({}, userData)
        while(true){
            if (Object.keys(currentSystem.items).length < 1){
                break
            }
            var bestProfitItem = Object.values(currentSystem.items).reduce((prev, current) => (+prev.vol_profit > +current.vol_profit) ? prev : current)
            var bestProfitOrder = bestProfitItem.orders[0]
            if(bestProfitOrder.profit < 1){
                delete groupedOrders[currentSystem.id].items[bestProfitItem.id]
                continue
            }
            var currentLimit = bestProfitOrder.is_buy_order ? buyLimit : sellLimit
            bestProfitOrder.profitableAmount = bestProfitOrder.profitableAmount*bestProfitItem.volume>currentLimit.volume?
                currentLimit.volume/bestProfitItem.volume : bestProfitOrder.profitableAmount
            bestProfitOrder.profitableAmount = bestProfitOrder.profitableAmount*bestProfitOrder.price>currentLimit.capital?
                currentLimit.capital/bestProfitOrder.price : bestProfitOrder.profitableAmount
            // if(bestProfitOrder.profitableAmount===0){
            //     console.log()
            // }
            currentSystem.profit += bestProfitItem.profit*bestProfitOrder.profitableAmount
            if(bestProfitOrder.is_buy_order){
                buyLimit.capital -= bestProfitOrder.price*bestProfitOrder.profitableAmount
                buyLimit.volume -= bestProfitItem.volume*bestProfitOrder.profitableAmount
                currentLimit = buyLimit
                currentSystem.buyCart.push(bestProfitOrder)
            } else {
                sellLimit.capital -= bestProfitOrder.price*bestProfitOrder.profitableAmount
                sellLimit.volume -= bestProfitItem.volume*bestProfitOrder.profitableAmount
                currentLimit = sellLimit
                currentSystem.sellCart.push(bestProfitOrder)
            }
            currentSystem.cart.push(bestProfitOrder)
            bestProfitItem.orders.splice(0,1)
            if (bestProfitItem.orders.length < 1){
                delete groupedOrders[currentSystem.id].items[bestProfitItem.id]
            }
            for (var item in currentSystem.items){
                if (currentSystem.items[item].volume > currentLimit.volume 
                    && currentSystem.items[item].orders[0].price > currentLimit.capital){
                    delete currentSystem.items[item]
                }
            }
        }
        currentSystem.buyCart.forEach(order=>{
            const orderItem = items.find(item => item.id===order.type_id)!

            currentSystem.order_vol += orderItem.volume*order.profitableAmount
            currentSystem.order_price += order.profit*order.profitableAmount
        })
        currentSystem.sellCart.forEach(order=>{
            const orderItem = items.find(item => item.id===order.type_id)!

            currentSystem.order_vol += orderItem.volume*order.profitableAmount
            currentSystem.order_price += order.profit*order.profitableAmount
        })
        currentSystem.prof_per_jump=currentSystem.profit/currentSystem.jumps/2
    }
    console.log(groupedOrders)
    console.log(userData)
    var functionResult:SystemOrderData[] = []
    for(var system in groupedOrders){
        functionResult.push(groupedOrders[system])
    }
    functionResult.sort((a, b)=>b.prof_per_jump-a.prof_per_jump)
    functionResult = functionResult.slice(0,100)
    console.log(functionResult)
    console.log('done')
    return functionResult
}

function notEmpty<Profit>(value: Profit | null | undefined): value is Profit {
    return value !== null && value !== undefined;
}

export default processOrdersData