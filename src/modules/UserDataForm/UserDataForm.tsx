import React, { ChangeEvent, useState } from 'react'

function UserDataForm() {
    const [volume, setVolume] = useState(0)
    const [capital, setCapital] = useState(0)
    const [tax, setTax] = useState(0)
    const [highsec, setHighsec] = useState(false)

    const onVolumeChange = (e:ChangeEvent<HTMLInputElement>) => {setVolume(Number(e.target.value))}
    const onCapitalChange = (e:ChangeEvent<HTMLInputElement>) => {setCapital(Number(e.target.value))}
    const onTaxChange = (e:ChangeEvent<HTMLInputElement>) => {setTax(Number(e.target.value))}
    const onHighsecChange = () => {setHighsec(currentValue => !currentValue)}

    const onSubmit = () => {
        if (volume && capital && tax){
                    
        }
    }

    return (
    <div>
        <form>
            <label htmlFor='setVolume'>Set Volume</label>
            <input value={volume} onChange={onVolumeChange} type='number' name='setVolume' id='setVolume'/>
            <label htmlFor='setCapital'>Set Capital</label>
            <input value={capital} onChange={onCapitalChange} type='number' name='setCapital' id='setCapital'/>
            <label htmlFor='setTax'>Set Tax</label>
            <input value={tax} onChange={onTaxChange} type='number' name='setTax' id='setTax'/>
            <label htmlFor='setHighsec'>Is Highsec</label>
            <input onChange={onHighsecChange} type='checkbox' name='setHighsec' id='setHighsec'/>
            <button onClick={onSubmit} >submit</button>
        </form>
    </div>
  )
}

export default UserDataForm