
import React, { FC } from 'react'
import { observer, useLocalObservable } from 'mobx-react-lite'
import { FileExplorer } from './tools/FileExplorer';
import { given } from './utils';
import { Terminal } from './tools/Terminal';
import { TextEditor } from './tools/TextEditor';

type State = {
    currentTool: ToolName | undefined
}

export const Dashboard: FC = observer(() => {
    const state = useLocalObservable<State>(() => ({
        currentTool: 'file-explorer'
    }))

    return (
        <div className="component-dashboard">
            <div className="tool-icons">
                <div className={`icon one ${state.currentTool === 'file-explorer' ? 'selected' : ''}`} onTouchStart={fakeTouchStartHandler} onClick={() => state.currentTool = 'file-explorer'}></div>
                <div className={`icon two ${state.currentTool === 'terminal' ? 'selected' : ''}`} onTouchStart={fakeTouchStartHandler} onClick={() => state.currentTool = 'terminal'}></div>
                <div className={`icon three ${state.currentTool === 'text-editor' ? 'selected' : ''}`} onTouchStart={fakeTouchStartHandler} onClick={() => state.currentTool = 'text-editor'}></div>
                <div className="icon four" onTouchStart={fakeTouchStartHandler}></div>
            </div>
            <div className="current-tool">
                {Object.entries(ALL_TOOLS).map(([name, Component]) =>
                    <Component selected={state.currentTool === name} />)}
            </div>
        </div>
    )
})

function fakeTouchStartHandler() {
}

type ToolName = keyof typeof ALL_TOOLS
const ALL_TOOLS = {
    'file-explorer': FileExplorer,
    'terminal': Terminal,
    'text-editor': TextEditor,
} as const;
