import React, { FC, useState } from "react";
import { API, FileInfo } from "../api";
import { usePromise } from "../utils";

type Props = {
    selected: boolean
}

export const FileExplorer: FC<Props> = ({ selected }) => {
    const [currentDirectory, setCurrentDirectory] = useState('C:\\Users\\brundolf')
    const [files] = usePromise(() => API.getFiles(currentDirectory), [currentDirectory])

    // const [sort, setSort] = useState('alpha')

    const sortedFiles = files?.slice().sort((a, b) => a.name.localeCompare(b.name) + (a.kind === 'directory' ? -1000000 : 0) - (b.kind === 'directory' ? -1000000 : 0))

    return (
        <div className={`component-file-explorer ${selected ? 'selected' : ''}`}>
            <div className="files">
                {sortedFiles?.map(file =>
                    <div className={`file ${file.kind}`} onClick={file.kind === 'directory' ? () => setCurrentDirectory(file.fullPath) : () => downloadURI(file)} key={file.name}>
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

function downloadURI({ name, fullPath }: FileInfo) {
    var link = document.createElement("a");
    link.download = name;
    link.href = `/fs/download/${encodeURIComponent(fullPath)}`;
    link.click();
}