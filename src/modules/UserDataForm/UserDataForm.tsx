import React, { ChangeEvent, useState } from 'react'
export interface UserData{
    volume:number,
    capital:number,
    tax:number,
    highsec:boolean,
}
export interface UserDataProps{
    onSubmit:Function,
}

function UserDataForm(props:UserDataProps) {
    const [volume, setVolume] = useState(895)
    const [capital, setCapital] = useState(900000000)
    const [tax, setTax] = useState(0.08)
    const [highsec, setHighsec] = useState(false)

    const onVolumeChange = (e:ChangeEvent<HTMLInputElement>) => {setVolume(Number(e.target.value))}
    const onCapitalChange = (e:ChangeEvent<HTMLInputElement>) => {setCapital(Number(e.target.value))}
    const onTaxChange = (e:ChangeEvent<HTMLInputElement>) => {setTax(Number(e.target.value))}
    const onHighsecChange = () => {setHighsec(currentValue => !currentValue)}

    const onSubmitClick = () => {
        if (volume && capital && tax){
            props.onSubmit(volume, capital, tax, highsec)
        }
    }

    return (
    <div>
        {/* <form> */}
            <label htmlFor='setVolume'>Set Volume</label><br/>
            <input value={volume} onChange={onVolumeChange} type='number' name='setVolume' id='setVolume'/><br/>
            <label htmlFor='setCapital'>Set Capital</label><br/>
            <input value={capital} onChange={onCapitalChange} type='number' name='setCapital' id='setCapital'/><br/>
            <label htmlFor='setTax'>Set Tax</label><br/>
            <input value={tax} step={0.01} onChange={onTaxChange} type='number' name='setTax' id='setTax'/><br/>
            <label htmlFor='setHighsec'>Is Highsec</label><br/>
            <input onChange={onHighsecChange} type='checkbox' name='setHighsec' id='setHighsec'/><br/>
            <button onClick={onSubmitClick} >submit</button>
        {/* </form> */}
    </div>
  )
}

export default UserDataForm