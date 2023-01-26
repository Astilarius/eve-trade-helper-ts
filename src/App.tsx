import { useState, useEffect } from 'react'
import UserDataForm from './modules/UserDataForm/UserDataForm'
import Login from './modules/Login/Login'
import ResultsTable from './modules/ResultsTable/ResultsTable'
import type { LoginProps } from './modules/Login/Login'
import type { UserDataProps, UserData } from './modules/UserDataForm/UserDataForm'
import { client_id, scopes, secret_key, url } from './secrets'
import loadAllOrdersData from './modules/DataProcessing/loadAllOrdersData'
import processOrdersData from './modules/DataProcessing/processOrdersData'
import './App.css'

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)

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
  const userDataProps:UserDataProps={
    onSubmit:(volume:number, capital:number, tax:number, highsec:boolean) => {
      console.log(`button pressed`)
      loadAllOrdersData()
        .then(r => {
          console.log(r)
          processOrdersData(r, {volume:volume, capital:capital, tax:tax, highsec:highsec});
        })
    }
  }

  return (
    <div className="App">
      <Login {...loginProps}/>
      <UserDataForm {...userDataProps}/>
    </div>
  )
}

export default App
