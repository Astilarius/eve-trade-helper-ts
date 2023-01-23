import { useState } from 'react'
import UserDataForm from './modules/UserDataForm/UserDataForm'
import Login from './modules/Login/Login'
import ResultsTable from './modules/ResultsTable/ResultsTable'
import type { LoginProps } from './modules/Login/Login'
import './App.css'

function App() {
  const client_id = "c231174a475b4f588f3070ce1a7838b2"
  const scopes = "esi-location.read_location.v1 esi-location.read_ship_type.v1 esi-skills.read_skills.v1 esi-wallet.read_character_wallet.v1 esi-ui.write_waypoint.v1 esi-markets.structure_markets.v1"
  const secret_key = "2X2eyYggWQ2Fr2cECEZuKzjUZWIbNzDCBZv83m0U"
  const url = "http://localhost:3000"
  const loginProps:LoginProps={
    isLoggedIn: false,
    characterName: null,
    loginUrl: `https://login.eveonline.com/v2/oauth/authorize/?response_type=code&redirect_uri=${encodeURIComponent(url)}&client_id=${client_id}&scope=${encodeURIComponent(scopes)}&state=teststate`,
  }

  return (
    <div className="App">
      <UserDataForm />
      <Login {...loginProps}/>
    </div>
  )
}

export default App
