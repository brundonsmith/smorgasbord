
import React, { FC } from "react"

export const Input: FC<{ value: string, onChange: (val: string) => void, autoFocus?: boolean }> = ({ value, onChange, autoFocus }) => {

    return (
        <input
            className="component-input" 
            value={value} 
            onChange={e => onChange(e.target.value)} 
            autoFocus={autoFocus}/>
    )
}