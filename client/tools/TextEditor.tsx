import React, { FC, useEffect, useRef, useState } from "react";
import { API } from "../api";

import monaco from "monaco-editor/min/vs/editor/editor.main.js"

export const TextEditor: FC<{ selected: boolean }> = ({ selected }) => {
    const editorRef = useRef<HTMLTextAreaElement>(null);
    const monacoRef = useRef<ReturnType<typeof monaco.editor.create>|undefined>(undefined);

    const [openFilePath, setOpenFilePath] = useState('C:\\Users\\brundolf\\foo.json');
    const [openFileContents, setOpenFileContents] = useState('{ "foo": "bar" }');

    useEffect(() => {
        monacoRef.current = monaco.editor.create(editorRef.current, {
            value: openFileContents,
            language: 'json'
        });

        monacoRef.current.onDidChangeModelContent(() => setOpenFileContents(monacoRef.current?.getValue() ?? openFileContents))
    }, [])
    
    useEffect(() => {
        API.readText(openFilePath)
            .then(text => setOpenFileContents(text))
    }, [openFilePath])
    
    useEffect(() => {
        // const currentCursor = monacoRef.current?.getCursor()
        monacoRef.current?.setValue(openFileContents)
        // monacoRef.current?.setCursor(currentCursor)

        API.writeText(openFilePath, openFileContents)
    }, [openFileContents])

    return (
        <div className={`component-text-editor ${selected ? 'selected' : ''}`}>
            <textarea ref={editorRef}></textarea>
        </div>
    )
}