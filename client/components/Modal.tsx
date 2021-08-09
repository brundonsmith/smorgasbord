
import React, { FC, ReactNode } from "react"

export const Modal: FC<{ open: boolean, children: ReactNode, buttons?: ReactNode }> = ({ open, children, buttons }) => {

    return (
        <div className={`component-modal ${open ? 'open' : ''} ${buttons ? 'has-buttons' : ''}`}>
            <div className={`popup`}>
                <div className="content">
                    {children}
                </div>

                {buttons &&
                    <div className="buttons">
                        {buttons}
                    </div>}
            </div>
        </div>
    )
}
