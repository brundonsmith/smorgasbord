import React, { FC, useState } from "react";
import { Input } from "../components/Input";
import { ToolProps } from "../Dashboard";
import { given } from "../utils";

export const Settings: FC<ToolProps> = ({ selected }) => {
    const [subsection, setSubsection] = useState<Subsection | undefined>('general');

    return (
        <div className={`component-settings ${selected ? 'selected' : ''}`}>
            <SubsectionsList selectedSubsection={subsection} setSubsection={setSubsection} />
            <SubsectionSettings selectedSubsection={subsection} />
        </div>
    )
}

const SubsectionsList: FC<{ selectedSubsection: Subsection | undefined, setSubsection: (s: Subsection) => void }> = ({ selectedSubsection, setSubsection }) => {

    return (
        <div className="component-subsections-list">
            {Object.entries(SUBSECTIONS).map(([subsection, { label }]) =>
                <div className={`subsection ${selectedSubsection === subsection ? 'selected' : ''}`} onMouseDown={() => setSubsection(subsection as Subsection)} key={subsection}>
                    {label}
                    
                    <div style={{ flexGrow:1, flexShrink: 0, minWidth: 15 }} />

                    ❯
                </div>)}
        </div>
    )
}

const SubsectionSettings: FC<{ selectedSubsection: Subsection | undefined }> = ({ selectedSubsection }) => {

    return (
        <div className="component-subsection-settings">
            {Object.entries(SUBSECTIONS).map(([subsection, { label, settings }]) =>
                <div className={`subsection ${subsection === selectedSubsection ? 'selected' : ''}`} key={subsection}>
                    {Object.entries(settings).map(([ setting, descriptor ]) =>
                        <SettingItem descriptor={descriptor} key={setting} />)}
                </div>)}
        </div>
    )
}

const SettingItem: FC<{ descriptor: Setting }> = ({ descriptor }) => {
    const [val, setVal] = useState('')

    return (
        <div className="component-setting-item" style={{ display: 'flex' }}>
            {descriptor.label}

            <Input value={val} onChange={setVal} />
        </div>
    )
}

const SUBSECTIONS = {
    'general': {
        label: 'General',
        settings: {
            theme: { kind: 'choice', label: 'Theme', options: [{ value: 'light', label: 'Light' }, { value: 'dark', label: 'Dark' }, { value: undefined, label: 'Auto' }] }
        }
    },
    'file-explorer': {
        label: 'File Explorer',
        settings: {},
    },
    'text-editor': {
        label: 'Text Editor',
        settings: {},
    },
    'terminal': {
        label: 'Terminal',
        settings: {},
    },
    'system': {
        label: 'System',
        settings: {},
    }
} as const
type Subsection = keyof typeof SUBSECTIONS

type Setting =
    | { readonly kind: 'boolean', readonly label: string }
    | { readonly kind: 'choice', readonly label: string, readonly options: readonly { readonly value: string|undefined, readonly label: string }[] }