import React, { FC, ReactNode } from "react"

export const Button: FC<{ onClick: () => void, children: ReactNode }> = ({ onClick, children }) => {
    return (
        <button className="component-button" onClick={onClick}>
            {children}
        </button>
    )
}