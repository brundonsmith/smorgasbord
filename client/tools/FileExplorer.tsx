import React, { FC, useState } from "react";
import { API, FileInfo } from "../api";
import { ToolProps } from "../Dashboard";
import { usePromise } from "../utils";

export const FileExplorer: FC<ToolProps> = ({ selected, onOpenTextFile, onSetCurrentTool }) => {
    const [currentDirectory, setCurrentDirectory] = useState('/home/brundolf')
    const [files] = usePromise(() => API.getFiles(currentDirectory), [currentDirectory])

    // const [sort, setSort] = useState('alpha')

    const sortedFiles = files?.slice().sort((a, b) => a.name.localeCompare(b.name) + (a.kind === 'directory' ? -1000000 : 0) - (b.kind === 'directory' ? -1000000 : 0))

    return (
        <div className={`component-file-explorer ${selected ? 'selected' : ''}`}>
            <div className="files">
                {sortedFiles?.map(file =>
                    <div className={`file ${file.kind}`} onClick={
                        file.kind === 'directory' ? () => setCurrentDirectory(file.fullPath) :
                        TEXT_FILE_KINDS.includes(file.kind) ? () => { onOpenTextFile(file.fullPath); onSetCurrentTool('text-editor'); } :
                        () => downloadURI(file)} key={file.name}>
                        {file.name}
                    </div>)}
            </div>
            <div className="path-bar">
                {currentDirectory.split(/[/\\]/g).map(segment =>
                    <span className={`path-segment`} onClick={() => setCurrentDirectory(currentDirectory.substr(0, currentDirectory.indexOf(segment) + segment.length))}> {/* HACK */}
                        {segment}
                    </span>)}
            </div>
        </div>
    )
}

function downloadURI({ name, fullPath }: FileInfo) {
    var link = document.createElement("a");
    link.download = name;
    link.href = `/fs/download/${encodeURIComponent(fullPath)}`;
    link.click();
}

// function downloadFile({ name, fullPath }: FileInfo) {
//     if (navigator.share) {
//         navigator.share({
//             title: name,
//             url: `/fs/download/${encodeURIComponent(fullPath)}`
//         }).then(() => alert("Shared!")).catch(console.error);
//     } else {
//         alert("Share not supported!")
//     }
// }

const TEXT_FILE_KINDS: readonly (string|undefined)[] = ['txt', 'json', 'js', 'css', 'ts', 'tsx', 'ini', 'md']