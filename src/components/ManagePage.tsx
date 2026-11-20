import {useEffect, useState} from 'react'
import {Button, Flex, Input, message, Modal, Popconfirm, Table} from 'antd'
import {useNavigate} from 'react-router-dom'
import {logoutAPI} from '@/api/common.ts'
import {getValueAPI} from '@/api/manage.ts'
import {ConfigKeyEnum} from '@/model/enum.ts'
import type {Action, Dialog, Section, Ui} from '@/manage/ui.ts'
import {site} from '@/manage/features/site.tsx'
import {system} from '@/manage/features/system.ts'
import {login} from '@/manage/features/login.tsx'

const {Column} = Table

export default function ManagePage() {
    const [messageApi, messageContextHolder] = message.useMessage()
    const [dialog, setDialog] = useState<Dialog | null>(null)
    const [submitting, setSubmitting] = useState(false)
    const [totpEnforce, setTotpEnforce] = useState<boolean | null>(null)
    const navigate = useNavigate()

    const loadTotpEnforce = () => getValueAPI(ConfigKeyEnum.TOTP_ENFORCE)
        .then((value) => setTotpEnforce(value !== null))
        .catch(() => {})

    useEffect(() => {
        document.title = 'Admin - Management - wwr.icu'
        loadTotpEnforce()
    }, [])

    const ui: Ui = {
        notify: (content) => messageApi.success(content).then(),
        dialog: setDialog,
        relogin: () => logoutAPI().catch(() => {}).then(() => navigate('/login')),
    }

    const sections: Section[] = [site(ui), login(ui, {enforced: totpEnforce, reload: loadTotpEnforce}), system()]

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
        setSubmitting(true)
        const submit = current.onSubmit
        if (!submit || await run(() => submit(value), 'success')) {
            setDialog(null)
        }
        setSubmitting(false)
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
            <Table
                <Section>
                scroll={{x: true}}
                size='small'
                dataSource={sections}
                pagination={false}
            >
                <Column title='Name' dataIndex='title' key='title' ellipsis={true}/>
                <Column
                    title='Actions'
                    key='actions'
                    render={(_, row: Section) => (
                        <Flex justify='flex-start' gap='middle'>
                            {row.actions.map(renderAction)}
                        </Flex>
                    )}
                />
            </Table>
            <Modal
                open={dialog !== null}
                title={dialog?.title}
                width={dialog?.width}
                closable={false}
                maskClosable={!dialog?.onSubmit}
                keyboard={false}
                footer={dialog?.onSubmit ? undefined : null}
                confirmLoading={submitting}
                cancelButtonProps={{disabled: submitting}}
                destroyOnHidden
                onCancel={() => setDialog(null)}
                onOk={() => dialog && submitDialog(dialog)}
            >
                {dialog?.input
                    ? <Input value={dialog.value} placeholder={dialog.input.placeholder} onChange={(e) => changeDialogValue(e.target.value)}/>
                    : dialog?.body?.(dialog.value, changeDialogValue)}
            </Modal>
        </>
    )
}
