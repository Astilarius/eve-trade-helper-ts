import React from 'react'
import './ResultRoute.css'

function ResultRoute() {
    const [stars, setStars] = React.useState(generateStars());
    function generateStars(){
      var stars = [];
      var setleft = 0;
      var settop = 0;
      var setrotate = 0;
      for(var i = 0; i < 150; i++){
        setleft = Math.floor(Math.random() * 99);
        settop = Math.floor(Math.random() * 99);
        var star=<div className="star"
        key={i}
        style={
          {left: (setleft)+'%',
          top: (settop)+'%',
          opacity: (Math.random() - 1),
          animationDelay: (Math.random()*3)+'s' }}>
        </div>
        stars.push(star)
      }
      return stars;
    }

    const urlParams = new URLSearchParams(window.location.search);
    const system = urlParams.get('system');
    const sec = urlParams.get('sec');
    const profit = urlParams.get('profit');
    const profperjump = urlParams.get('profperjump');
    const jumps = urlParams.get('jumps');
    const divSquares = []
    for(let i = 0;i<Number(jumps)-1;i++){
        divSquares.push(<div></div>)
    }
    divSquares.push(<div id='green'></div>)
    return (
        <div>
            <h1>{system} <span className={`s${Number(sec)*10}`}>{sec}</span></h1>
            <div className='squares'>{divSquares}</div>
            <p>profit: {profit}</p>
            <p>profit per jump: {profperjump}</p>
            <p>jumps: {jumps}</p>
            <div className="stars">{stars}</div>
        </div>
    )
}

export default ResultRoute