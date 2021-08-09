
import React, { FC } from "react"

export const PillButtons: FC<{ items: { value: string|undefined, label: string }[], selected: string|undefined, onSelect: (val: string|undefined) => void }> = ({ items, selected, onSelect }) => {

    return (
        <div className={`component-pill-buttons`}>
            
        </div>
    )
}