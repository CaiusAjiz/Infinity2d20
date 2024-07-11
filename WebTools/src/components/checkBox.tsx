import * as React from 'react';


const CheckBox = (props) => {
    const {value, onChanged, isChecked} = props

    React.useEffect(() => {
    
        return onChanged(null)

    },[])

    return (
        <input type="checkbox" value={value} onChange={e => onChanged(value) } checked={isChecked} />

    )

}

export default CheckBox
