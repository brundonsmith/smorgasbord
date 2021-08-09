import React, { FC, useEffect, useRef, useState } from "react"
import { Terminal as XTerminal } from 'xterm'
import { API } from "../api";
import { ToolProps } from "../Dashboard";

const terminalSessionID = String(Math.random())

export const Terminal: FC<ToolProps> = ({ selected }) => {
    const terminalRef = useRef<HTMLDivElement>(null);
    const xtermRef = useRef<XTerminal | null>(null);
    const [sessionStarted, setSessionStarted] = useState(false)
    
    useEffect(() => {
        API.shellInit(terminalSessionID).then(() => setSessionStarted(true));
    }, [])

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
        if (terminalRef.current != null && sessionStarted) {
            console.log('initialized')
            xtermRef.current = new XTerminal();
            xtermRef.current.open(terminalRef.current);

            xtermRef.current.onData(async input => {
                console.log({ input })
                // xtermRef.current?.write(input);
                await API.shellCommand(terminalSessionID, input)
                // const output = await API.shellListen(terminalSessionID)
                // xtermRef.current?.write(output);
            }) // To the Channel

            function poll() {
                setTimeout(() => {
                    if (xtermRef.current != null) {
                        API.shellListen(terminalSessionID).then(output => {
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
    }, [sessionStarted])

    return (
        <div className={`component-terminal ${selected ? 'selected' : ''}`} ref={terminalRef}></div>
    )
}