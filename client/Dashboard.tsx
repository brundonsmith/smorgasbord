
import React, { FC, useState } from 'react'
import { FileExplorer } from './tools/FileExplorer';
import { Settings } from './tools/Settings';
import { Terminal } from './tools/Terminal';
import { TextEditor } from './tools/TextEditor';

export const Dashboard: FC = () => {
    const [currentTool, setCurrentTool] = useState<ToolName>('text-editor')
    const [openTextFile, setOpenTextFile] = useState<string|undefined>('/home/brundolf/git/jqr/README.md')

    return (
        <div className="component-dashboard">
            <div className="tool-icons">
                {Object.keys(ALL_TOOLS).map(name =>
                    <div
                        className={`icon ${name} ${currentTool === name ? 'selected' : ''}`}
                        onTouchStart={fakeTouchStartHandler}
                        onClick={() => setCurrentTool(name as ToolName)} />)}
            </div>
            <div className="current-tool">
                {Object.entries(ALL_TOOLS).map(([name, Component]) =>
                    <Component
                        selected={currentTool === name}
                        openTextFile={openTextFile}
                        onOpenTextFile={setOpenTextFile}
                        onSetCurrentTool={setCurrentTool} />)}
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
    'terminal': Terminal,
    'text-editor': TextEditor,
    'settings': Settings,
} as const;
