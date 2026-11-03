import {useEffect, useState} from 'react'
import {Button, Input, List, message, Modal, Popconfirm} from 'antd'
import {useNavigate} from 'react-router-dom'
import {getConfigAPI} from '@/api/manage.ts'
import {ConfigKeyEnum} from '@/model/enum.ts'
import type {Action, Dialog, Section, Ui} from '@/manage/ui.ts'
import {about} from '@/manage/features/about.tsx'
import {database} from '@/manage/features/database.ts'
import {login} from '@/manage/features/login.ts'
import {totp} from '@/manage/features/totp.ts'

// The page owns the one dialog; a feature is data plus the calls that fill it.
export default function ManagePage() {
    const [messageApi, messageContextHolder] = message.useMessage()
    const [dialog, setDialog] = useState<Dialog | null>(null)
    // The only config the page renders itself, because it decides which TOTP action is on offer.
    const [totpEnforce, setTotpEnforce] = useState(false)
    const navigate = useNavigate()

    const loadTotpEnforce = () => getConfigAPI(ConfigKeyEnum.TOTP_ENFORCE)
        .then((value) => setTotpEnforce(!!value))
        .catch(() => {})

    useEffect(() => {
        document.title = 'Admin - Management - wwr.icu'
        loadTotpEnforce()
    }, [])

    const ui: Ui = {
        notify: (content) => messageApi.success(content).then(),
        dialog: setDialog,
        relogin: () => navigate('/login'),
    }

    const sections: Section[] = [about(ui), login(ui), database(), totp(ui, {enforced: totpEnforce, reload: loadTotpEnforce})]

    // The one place that swallows a failure, which the http layer already toasted, and announces
    // what succeeded.
    const run = async (task: () => Promise<void> | void, success?: string): Promise<boolean> => {
        try {
            await task()
        } catch {
            return false
        }
        if (success) {
            ui.notify(success)
        }
        return true
    }

    const submitDialog = async (current: Dialog) => {
        const value = current.input ? current.value.trim() : current.value
        if (current.input && !value) {
            messageApi.error('Please input a valid value').then()
            return
        }
        // A failed write leaves the dialog open, so the pending edit is not thrown away.
        if (await run(() => current.onSubmit(value), 'success')) {
            setDialog(null)
        }
    }

    const renderAction = (action: Action) => action.confirm ? (
        <Popconfirm
            key={action.label}
            title={action.confirm}
            okButtonProps={{variant: 'solid', color: 'danger'}}
            onConfirm={() => run(action.run, action.success)}
        >
            <Button size='small'>{action.label}</Button>
        </Popconfirm>
    ) : (
        <Button key={action.label} size='small' onClick={() => run(action.run, action.success)}>
            {action.label}
        </Button>
    )

    const changeDialogValue = (value: string) => setDialog((prev) => prev && {...prev, value})

    return (
        <>
            {messageContextHolder}
            <List
                size='small'
                bordered
                dataSource={sections}
                renderItem={(section: Section) => (
                    <List.Item actions={section.actions.map(renderAction)}>
                        {section.title}
                    </List.Item>
                )}
            />
            <Modal
                open={dialog !== null}
                title={dialog?.title}
                width={dialog?.width}
                closable={false}
                // closable={false} alone still closes on mask click, which would throw away the
                // TOTP secret and any pending edit.
                maskClosable={false}
                destroyOnHidden
                onCancel={() => setDialog(null)}
                onOk={() => dialog && submitDialog(dialog)}
            >
                {
                    dialog?.input
                        ? (dialog.input.secret
                            ? <Input.Password value={dialog.value} placeholder={dialog.input.placeholder} onChange={(e) => changeDialogValue(e.target.value)}/>
                            : <Input value={dialog.value} placeholder={dialog.input.placeholder} onChange={(e) => changeDialogValue(e.target.value)}/>)
                        : dialog?.body?.(dialog.value, changeDialogValue)
                }
            </Modal>
        </>
    )
}
