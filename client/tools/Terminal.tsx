import React, { FC, useEffect, useRef } from "react"
import { Terminal as XTerminal } from 'xterm'
import { API } from "../api";

type Props = {
    selected: boolean,
}

export const Terminal: FC<Props> = ({ selected }) => {
    const terminalRef = useRef<HTMLDivElement>(null);
    const xtermRef = useRef<XTerminal | null>(null);

    // useEffect(() => {
    //     function poll() {
    //         setTimeout(() => {
    //             if (xtermRef.current != null) {
    //                 API.shellListen().then(output => {
    //                     xtermRef.current?.write(output);
    //                     poll();
    //                 })
    //             } else {
    //                 poll();
    //             }
    //         }, 1000)
    //     }

    //     poll();
    // }, [xtermRef.current])

    useEffect(() => {
        if (terminalRef.current != null) {
            console.log('initialized')
            xtermRef.current = new XTerminal();
            xtermRef.current.open(terminalRef.current);

            xtermRef.current.onData(input => {
                xtermRef.current?.write(input);
                API.shellCommand(input)
            }) // To the Channel

            function poll() {
                setTimeout(() => {
                    if (xtermRef.current != null) {
                        API.shellListen().then(output => {
                            xtermRef.current?.write(output);
                            poll();
                        })
                    } else {
                        console.log('xtermRef.current is undefined')
                        poll();
                    }
                }, 1000)
            }

            poll();
            
            // return () => xtermRef.current?.dispose()
            
        }
    }, [])

    return (
        <div className={`component-terminal ${selected ? 'selected' : ''}`} ref={terminalRef}></div>
    )
}