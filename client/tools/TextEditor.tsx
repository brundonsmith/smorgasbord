import React, { FC, useEffect, useRef, useState } from "react";
import { API } from "../api";

import monacoLib from 'monaco-editor'
import { ToolProps } from "../Dashboard";

declare global {
    interface Window {
        monaco: typeof monacoLib
    }
}

export const TextEditor: FC<ToolProps> = ({ selected, openTextFile }) => {
    const editorRef = useRef<HTMLDivElement>(null);
    const monacoRef = useRef<ReturnType<typeof monacoLib.editor.create>|undefined>(undefined);

    const [fileLoaded, setFileLoaded] = useState(false);
    const [openFileContents, setOpenFileContents] = useState('');

    useEffect(() => {
        monacoRef.current = window.monaco.editor.create(editorRef.current, {
            value: openFileContents,
        });

        monacoRef.current.onDidChangeModelContent(() => setOpenFileContents(monacoRef.current?.getValue() ?? openFileContents))
    }, [])
    
    useEffect(() => {
        setFileLoaded(false)
        if (openTextFile != null) {
            if (monacoRef.current != null) {
                window.monaco.editor.setModelLanguage(monacoRef.current.getModel(), EXT_TO_LANGUAGE[getFileExt(openTextFile)] ?? getFileExt(openTextFile));
            }
            API.readText(openTextFile)
                .then(text => {
                    setOpenFileContents(text)
                    setFileLoaded(true)
                })
        }
    }, [openTextFile])
    
    useEffect(() => {
        if (openTextFile != null && fileLoaded) {
            const currentSelection = monacoRef.current?.getSelection()
            monacoRef.current?.setValue(openFileContents)
            if (currentSelection != null) {
                monacoRef.current?.setSelection(currentSelection)
            }

            API.writeText(openTextFile, openFileContents)
        }
    }, [openFileContents, fileLoaded])

    return (
        <div className={`component-text-editor ${selected ? 'selected' : ''}`}>
            <div className="monaco-container" ref={editorRef} />
            
            <div className="status-bar">
                {openTextFile
                    ? `Editing: ${openTextFile}`
                    : `<no file open>`}
            </div>
        </div>
    )
}

function getFileExt(path: string) {
    const parts = path.split('.')
    return parts[parts.length - 1]
}

const EXT_TO_LANGUAGE: Readonly<{[kind: string]: string}> = {
    "md": "markdown",
    "json": "json",
    "js": "javascript",
    "ts": "typescript",
    "tsx": "typescript-react",
    "rs": "rust",
    "py": "python",
    "sh": "bash",
}