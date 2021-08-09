import React, { FC, useState } from "react";
import { createPortal } from "react-dom";
import { API, FileInfo } from "../api";
import { Button } from "../components/Button";
import { Input } from "../components/Input";
import { Modal } from "../components/Modal";
import { ToolProps } from "../Dashboard";
import { usePromise } from "../utils";

export const FileExplorer: FC<ToolProps> = ({ selected, onOpenTextFile, onSetCurrentTool }) => {
    const [currentDirectory, setCurrentDirectory] = useState('/home/brundolf')
    const [files, _1, _2, updateFiles] = usePromise(() => API.getFiles(currentDirectory), [currentDirectory])
    const [selectedFile, setSelectedFile] = useState<FileInfo|undefined>(undefined)
    const [previewing, setPreviewing] = useState(false)
    const [renaming, setRenaming] = useState(false)
    const [newFileName, setNewFileName] = useState('')

    // const [sort, setSort] = useState('alpha')

    const sortedFiles = files?.slice().sort((a, b) => a.name.localeCompare(b.name) + (a.kind === 'directory' ? -1000000 : 0) - (b.kind === 'directory' ? -1000000 : 0))

    function handleFileClick(e: React.MouseEvent<HTMLDivElement>, file: FileInfo) {
        e.stopPropagation()

        if (file.kind === 'directory') {
            setCurrentDirectory(file.fullPath)
        } else {
            setSelectedFile(file)
        }
    }

    return (
        <div className={`component-file-explorer ${selected ? 'selected' : ''}`}>
            <div className="main">
                <div className="files" onClick={() => setSelectedFile(undefined)}>
                    {sortedFiles?.map(file =>
                        <div className={`file ${getFileIconClasses(file)} ${selectedFile === file ? 'selected' : ''}`} 
                            onClick={e => handleFileClick(e, file)}
                            key={file.name}>
                            {file.name}
                        </div>)}
                </div>

                <div className={`action-menu ${selectedFile != null ? 'open' : ''}`}>
                    <ActionItem icon="sign-add" action={() => alert('create new file')} />

                    {selectedFile != null && <>
                        {RUNNABLE_FILE_KINDS.includes(selectedFile.kind) &&
                            <ActionItem icon="terminal" action={() => alert('run ' + selectedFile.name)} />}
                        {PREVIEWABLE_FILE_KINDS.includes(selectedFile.kind) &&
                            <ActionItem icon="search" action={() => setPreviewing(true)} />}
                        {TEXT_FILE_KINDS.includes(selectedFile.kind) &&
                            <ActionItem icon="notepad" action={() => { onOpenTextFile(selectedFile.fullPath); onSetCurrentTool('text-editor'); }} />}
                        <ActionItem icon="pencil" action={() => {
                            setRenaming(true)
                            setNewFileName(selectedFile.name)
                        }} />
                        {navigator.share != null &&
                            <ActionItem icon="box-out" action={() => share(selectedFile)} />}
                        <ActionItem icon="sign-down" action={() => download(selectedFile)} />
                        <ActionItem icon="trashcan" action={() => alert('delete ' + selectedFile.name)} />
                    </>}
                </div>
            </div>
            <div className="path-bar">
                {currentDirectory.split(/[/\\]/g).map(segment =>
                    <span className={`path-segment`} onClick={() => setCurrentDirectory(currentDirectory.substr(0, currentDirectory.indexOf(segment) + segment.length))}> {/* HACK */}
                        {segment}
                    </span>)}
            </div>

            {createPortal(
                <Modal open={previewing}>
                    (preview)
                </Modal>, document.body)}
                
            {createPortal(
                <Modal open={renaming} buttons={<>
                    <Button onClick={async () => {
                        await rename(selectedFile, newFileName)
                        setRenaming(false)
                        updateFiles()
                        setSelectedFile(undefined)
                    }}>Done</Button>
                    <Button onClick={() => setRenaming(false)}>Cancel</Button>
                </>}>
                    New name: <Input value={newFileName} onChange={setNewFileName} autoFocus={true} />
                </Modal>, document.body)}
        </div>
    )
}

const ActionItem: FC<{ icon: string, action: () => void }> = ({ icon, action }) => {
    return (
        <div 
            className="component-action-item" 
            style={{ '--icon-url': `url("/icons/${icon}.svg")` } as React.CSSProperties} 
            onClick={action} />
    )
}

function download({ name, fullPath }: FileInfo) {
    var link = document.createElement("a");
    link.download = name;
    link.href = `/fs/download/${encodeURIComponent(fullPath)}`;
    link.click();
}

async function share({ name, fullPath }: FileInfo) {
    try {
        await navigator.share({
            title: name,
            url: `/fs/download/${encodeURIComponent(fullPath)}`
        })
    } catch (e) {
        console.error(e)
    }
}

async function rename({ fullPath }: FileInfo, newFileName: string) {
    await API.rename(fullPath, newFileName)
}

const RUNNABLE_FILE_KINDS: readonly (string|undefined)[] = ['sh']
const IMAGE_FILE_KINDS: readonly (string|undefined)[] = ['png', 'jpg', 'jpeg']
const AUDIO_FILE_KINDS: readonly (string|undefined)[] = ['mp3', 'wav']
const VIDEO_FILE_KINDS: readonly (string|undefined)[] = ['mp4']
const PREVIEWABLE_FILE_KINDS: readonly (string|undefined)[] = [...IMAGE_FILE_KINDS, ...AUDIO_FILE_KINDS, ...VIDEO_FILE_KINDS]
const TEXT_FILE_KINDS: readonly (string|undefined)[] = ['txt', 'json', 'js', 'css', 'ts', 'tsx', 'ini', 'md', 'rs', 'toml', 'yaml', 'xml']
const CODE_FILE_KINDS: readonly (string|undefined)[] = ['json', 'js', 'css', 'ts', 'tsx', 'md', 'rs', 'toml', 'yaml', 'xml']

const EXACT_FILE_KINDS: readonly (string|undefined)[] = ['directory', 'zip', 'pdf']

function getFileIconClasses(file: FileInfo) {
    return [
        RUNNABLE_FILE_KINDS.includes(file.kind) ? 'runnable' : undefined,
        IMAGE_FILE_KINDS.includes(file.kind) ? 'image' : undefined,
        AUDIO_FILE_KINDS.includes(file.kind) ? 'audio' : undefined,
        VIDEO_FILE_KINDS.includes(file.kind) ? 'video' : undefined,
        TEXT_FILE_KINDS.includes(file.kind) ? 'text' : undefined,
        CODE_FILE_KINDS.includes(file.kind) ? 'code' : undefined,
        
        EXACT_FILE_KINDS.includes(file.kind) ? file.kind : undefined,
    ].filter(c => c != null).join(' ')
}