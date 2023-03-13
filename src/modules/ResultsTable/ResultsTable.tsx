import {SystemOrderData} from '../DataProcessing/processOrdersData'
import './ResultsTable.css'

const ResultsTable:React.FC<{systems:SystemOrderData[]}>=props=>{
    const cards = props.systems.map(system=>{
        var toBuyClipBoard = ''
        var toSellClipBoard = ''
        try {
            // system.buyCart.forEach(order=> order.location_id)
            system.buyCart.forEach(order=> toBuyClipBoard+=` ${order.itemName} ${order.profitableAmount} \n`)
            system.sellCart.forEach(order=> toSellClipBoard+=` ${order.itemName} ${order.profitableAmount} \n`)
        } catch (error) {
            
        }
        const roundedSec = Math.round(system.security*10)/10
        const toDoList = system.locationCart.map(location => {
            var toBuyClipBoard2 = ''
            var toSellClipBoard2 = ''
            location.buyCart.forEach(order=> toBuyClipBoard2+=` ${order.itemName} ${order.profitableAmount} \n`)
            location.sellCart.forEach(order=> toSellClipBoard2+=` ${order.itemName} ${order.profitableAmount} \n`)
            return (
                <div key={location.id}>
                    <p>at {location.name}</p>
                    {location.buyCart.length > 0 ? 
                    <p>buy: <button onClick={()=>{navigator.clipboard.writeText(toBuyClipBoard2)}}>copy to clipboard</button></p> : <></>}
                    
                    {location.sellCart.length > 0 ? 
                    <p>sell: <button onClick={()=>{navigator.clipboard.writeText(toSellClipBoard2)}}>copy to clipboard</button></p> : <></>}
                </div>
            )
        })
        return (
            <div key={system.id}>
                <a className='systemName' href={`http://127.0.0.1:5173/routes?system=${system.name}&sec=${roundedSec}&profit=${system.profit}&profperjump=${system.prof_per_jump}&jumps=${system.jumps}`} target="_blank">{system.name} <span className={`s${(roundedSec*10).toString()}`}>{roundedSec}</span></a>
                <p>profit: {Math.floor(system.profit)}</p>
                <p>profit per jump: {Math.floor(system.prof_per_jump)}</p>
                <p>jumps: {system.jumps}</p>
                <p>to do list:</p>
                {toDoList}
                {/* <p>buy: <button onClick={()=>{navigator.clipboard.writeText(toBuyClipBoard)}}>copy to clipboard</button></p>
                <p>sell: <button onClick={()=>{navigator.clipboard.writeText(toSellClipBoard)}}>copy to clipboard</button></p> */}
            </div>
            )
        })
    return(
        <div className="ResultsTable">
            {cards}
        </div>
    );
};

export default ResultsTable;