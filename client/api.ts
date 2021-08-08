
export type FileInfo = { name: string, fullPath: string, kind?: string }

export const API = {
    getFiles(dir: string): Promise<FileInfo[]> {
        return fetch(`/fs/${encodeURIComponent(dir)}`).then(res => res.json())
    },
    move(src: string, dest: string): Promise<void> {
        return fetch(`/fs/move?src=${encodeURIComponent(src)}&${encodeURIComponent(dest)}`, { method: 'post' }).then(() => {})
    },

    shellListen(): Promise<string> {
        return fetch(`/shell`).then(res => res.text())
    },
    shellCommand(input: string): Promise<void> {
        return fetch(`/shell?input=${encodeURIComponent(input)}`, { method: 'post' }).then(() => {})
    },

    readText(path: string): Promise<string> {
        return fetch(`/text-file/${encodeURIComponent(path)}`).then(res => res.text())
    },
    writeText(path: string, contents: string): Promise<void> {
        return fetch(`/text-file/${encodeURIComponent(path)}`, { method: 'post', body: JSON.stringify({ contents }), headers: { 'Content-Type': 'application/json' } }).then(() => {})
    },
}