import {SystemOrderData} from '../DataProcessing/processOrdersData'

const ResultsTable:React.FC<{systems:SystemOrderData[]}>=props=>{
    const cards = props.systems.map(system=>
    <div>
        <h1>{system.name}</h1>
        <p>{system.profit}</p>
    </div>)
    return(
        <div className="ResultsTable">
            {cards}
        </div>
    );
};

export default ResultsTable;