
export type FileInfo = { name: string, fullPath: string, kind?: string }

export const API = {
    getFiles(dir: string): Promise<FileInfo[]> {
        return fetch(`/fs/${encodeURIComponent(dir)}`).then(res => res.json())
    },
    move(src: string, dest: string): Promise<void> {
        return fetch(`/fs/move?src=${encodeURIComponent(src)}&dest=${encodeURIComponent(dest)}`, { method: 'post' }).then(() => {})
    },
    rename(path: string, newFileName: string): Promise<void> {
        return fetch(`/fs/rename?filePath=${encodeURIComponent(path)}&newFileName=${encodeURIComponent(newFileName)}`, { method: 'post' }).then(() => {})
    },

    shellInit(session: string): Promise<void> {
        return fetch(`/shell/init?session=${encodeURIComponent(session)}`, { method: 'post' }).then(() => {})
    },
    shellListen(session: string): Promise<string> {
        return fetch(`/shell?session=${encodeURIComponent(session)}`).then(res => res.text())
    },
    shellCommand(session: string, input: string): Promise<void> {
        return fetch(`/shell?session=${encodeURIComponent(session)}&input=${encodeURIComponent(input)}`, { method: 'post' }).then(() => {})
    },

    readText(path: string): Promise<string> {
        return fetch(`/text-file/${encodeURIComponent(path)}`).then(res => res.text())
    },
    writeText(path: string, contents: string): Promise<void> {
        return fetch(`/text-file/${encodeURIComponent(path)}`, { method: 'post', body: JSON.stringify({ contents }), headers: { 'Content-Type': 'application/json' } }).then(() => {})
    },
}