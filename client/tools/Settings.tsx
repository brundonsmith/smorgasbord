import React, { FC } from "react";
import { ToolProps } from "../Dashboard";

export const Settings: FC<ToolProps> = ({ selected }) => {

    return (
        <div className={`component-settings ${selected ? 'selected' : ''}`}>
            (settings)
        </div>
    )
}