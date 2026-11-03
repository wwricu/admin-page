import type {ReactNode} from 'react'

export type Action = {
    label: string
    confirm?: string // present when the action must be confirmed first
    success?: string // shown once the call succeeds; a dialog action has nothing to announce
    run: () => Promise<void> | void
}

export type Section = { key: string; title: string; actions: Action[] }

// One dialog at a time: an input and a custom body edit the same `value`, so a pending edit cannot
// get lost between two Modal states.
export type Dialog = {
    title: string
    width?: number
    input?: { placeholder: string; secret?: boolean }
    body?: (value: string, onChange: (value: string) => void) => ReactNode
    value: string
    onSubmit: (value: string) => Promise<void>
}

// What the page hands a feature; the dialog state and the message api stay in the page.
export type Ui = {
    notify: (content: string) => void
    dialog: (dialog: Dialog) => void
    relogin: () => void // changing the login ends the session, so the admin signs in again
}
