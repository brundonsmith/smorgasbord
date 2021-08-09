
import React, { FC, useState } from 'react'
import { FileExplorer } from './tools/FileExplorer';
import { Settings } from './tools/Settings';
import { Terminal } from './tools/Terminal';
import { TextEditor } from './tools/TextEditor';

export const Dashboard: FC = () => {
    const [currentTool, setCurrentTool] = useState<ToolName>('settings')
    const [openTextFile, setOpenTextFile] = useState<string|undefined>('/home/brundolf/git/jqr/README.md')

    return (
        <div className="component-dashboard">
            <div className="tool-icons">
                {Object.keys(ALL_TOOLS).map(name =>
                    <div
                        className={`icon ${name} ${currentTool === name ? 'selected' : ''}`}
                        onTouchStart={fakeTouchStartHandler}
                        onClick={() => setCurrentTool(name as ToolName)}
                        key={name} />)}
            </div>
            <div className="current-tool">
                {Object.entries(ALL_TOOLS).map(([name, Component]) =>
                    <Component
                        selected={currentTool === name}
                        openTextFile={openTextFile}
                        onOpenTextFile={setOpenTextFile}
                        onSetCurrentTool={setCurrentTool}
                        key={name} />)}
            </div>
        </div>
    )
}

export type ToolProps = {
    selected: boolean,
    openTextFile: string|undefined,
    onOpenTextFile: (file: string) => void,
    onSetCurrentTool: (tool: ToolName) => void,
}

function fakeTouchStartHandler() {
}

type ToolName = keyof typeof ALL_TOOLS
const ALL_TOOLS = {
    'file-explorer': FileExplorer,
    'text-editor': TextEditor,
    'terminal': Terminal,
    'settings': Settings,
} as const;
