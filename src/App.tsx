import { useState, useEffect } from 'react'
import UserDataForm from './modules/UserDataForm/UserDataForm'
import Login from './modules/Login/Login'
import ResultsTable from './modules/ResultsTable/ResultsTable'
import type { LoginProps } from './modules/Login/Login'
import type { UserDataProps, UserData } from './modules/UserDataForm/UserDataForm'
import { client_id, scopes, secret_key, url } from './secrets'
import loadAllOrdersData from './modules/DataProcessing/loadAllOrdersData'
import processOrdersData, { SystemOrdersData, SystemOrderData } from './modules/DataProcessing/processOrdersData'
import './App.css'

function App() {
  const [msg, setMsg] = useState('')
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const firstSys:SystemOrderData[] = []
  const [systemOrderData, setSystemOrderData] = useState(firstSys)
  const [stars, setStars] = useState(generateStars());
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

  useEffect(()=>{
    const queryParams = new URLSearchParams(window.location.search);
    const authCode = queryParams.get("code");
    setIsLoggedIn((authCode !== null) ? true : false)
  }, [])
  const loginProps:LoginProps={
    isLoggedIn: isLoggedIn,
    characterName: null,
    loginUrl: `https://login.eveonline.com/v2/oauth/authorize/?response_type=code&redirect_uri=${encodeURIComponent(url)}&client_id=${client_id}&scope=${encodeURIComponent(scopes)}&state=teststate`,
  }

  const onUserSubmitsData = (volume:number, capital:number, tax:number, highsec:boolean) => {
    console.log(`button pressed`)
    loadAllOrdersData()
  }
  const resultsTableProps:{systems:SystemOrderData[]} = {
    systems: systemOrderData
  }
  const userDataProps:UserDataProps={
    onSubmit:(volume:number, capital:number, tax:number, highsec:boolean) => {
      setMsg('Downloading orders')
      console.log(`button pressed`)
      const gouse:Array<string> = [
        "░░░░░░░░░░░░░░░░░░░░░░░░░░",
        "░░░░░░▄▀▀▀▄░░░░░░░░░░░░░░░",
        "▄███▀░◐░░░▌░░░░░░░░░░░░░░",
        "░░░░▌░░░░░▐░░░░░░░░░░░░░░░",
        "░░░░▐░░░░░▐░░░░░░░░░░░░░░░",
        "░░░░▌░░░░░▐▄▄░░░░░░░░░░░░░",
        "░░░░▌░░░░▄▀▒▒▀▀▀▀▄░░░░░░░░",
        "░░░▐░░░░▐▒▒▒▒▒▒▒▒▀▀▄░░░░░░",
        "░░░▐░░░░▐▄▒▒▒▒▒▒▒▒▒▒▀▄░░░░",
        "░░░░▀▄░░░░▀▄▒▒▒▒▒▒▒▒▒▒▀▄░░",
        "░░░░░░▀▄▄▄▄▄█▄▄▄▄▄▄▄▄▄▄▄▀▄",
        "░░░░░░░░░░░▌▌░▌▌░░░░░░░░░░",
        "░░░░░░░░░░░▌▌░▌▌░░░░░░░░░",
        "░░░░░░░░░░░▌▌░▌▌░░░░░░░░░░",
        "░░░░░░░░░▄▄▌▌▄▌▌░░░░░░░░░░",
      ]
      gouse.forEach(string=>{
        console.log(string)
      })
      // fakeOrdersData().then(r => {
      //       console.log(r)
      //       processOrdersData(r, {volume:volume, capital:capital, tax:tax, highsec:highsec});
      //     })
      loadAllOrdersData()
        .then(r => {
          setMsg('Processing orders')
          console.log(r)
          processOrdersData(r, {volume:volume, capital:capital, tax:tax, highsec:highsec})
            .then(systems=>{
              if(systems.length===0){
                setMsg('No results for your input')
              } else {
                setMsg('')
              }
              setSystemOrderData(systems)
            })
        })
    },
    msg:msg,
  }

  return (
    <div className="App">
      <h1>Eve Trade Helper</h1>
      <Login {...loginProps}/>
      <UserDataForm {...userDataProps}/>
      <ResultsTable {...resultsTableProps}/>
      <div className="stars">{stars}</div>
    </div>
  )
}

export default App
