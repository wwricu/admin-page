import type {ReactNode} from 'react'

export type Action = {
    label: string
    confirm?: string
    success?: string
    run: () => Promise<void> | void
}

export type Section = { key: string; title: string; actions: Action[] }

export type Dialog = {
    title: string
    width?: number
    input?: { placeholder: string; secret?: boolean }
    body?: (value: string, onChange: (value: string) => void) => ReactNode
    value: string
    onSubmit: (value: string) => Promise<void>
}

export type Ui = {
    notify: (content: string) => void
    dialog: (dialog: Dialog) => void
    relogin: () => void
}
