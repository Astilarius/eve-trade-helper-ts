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
      <Login {...loginProps}/>
      <UserDataForm {...userDataProps}/>
      <ResultsTable {...resultsTableProps}/>
    </div>
  )
}

export default App
