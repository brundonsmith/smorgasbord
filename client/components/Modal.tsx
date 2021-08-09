
import React, { FC, ReactNode } from "react"

export const Modal: FC<{ open: boolean, children: ReactNode }> = ({ open, children }) => {

    return (
        <div className={`component-modal ${open ? 'open' : ''}`}>
            <div className={`popup`}>
                {children}
            </div>
        </div>
    )
}
