import React from 'react'
import { SystemOrderData } from '../DataProcessing/processOrdersData'

function ResultCard(props:SystemOrderData) {
  return (
    <div className='resultCard'>
      <h2>{props.name}</h2>
      <p>profit: {props.profit}</p>
      <p>jumps: {props.jumps}</p>
      <p>profit per jump: {props.prof_per_jump}</p>
      <p>total price: {props.order_price}</p>
      <p>total volume: {props.order_vol}</p>
    </div>
  )
}

export default ResultCard