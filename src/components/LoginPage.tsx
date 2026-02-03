import {infoAPI, loginAPI} from "../api/common.ts"
import {useNavigate} from "react-router-dom"
import {useEffect, useState} from "react"
import {Form, Button, Input, message} from "antd"
import {LockOutlined, UserOutlined} from "@ant-design/icons"
import {AxiosError} from "axios"
import {LoginRO} from "../model/request.ts"
import icon from '/favicon.ico'

export default function LoginPage() {
    const navigate = useNavigate()
    const [loginForm] = Form.useForm()
    const [loginPhase, setLoginPhase] = useState<'account' | 'totp'>('account')
    const [totpValue, setTotpValue] = useState<string | undefined>(undefined)

    useEffect(() => {
        infoAPI().then((res: boolean) => {
            if (res) {
                message.success('Logging in...', 1).then(() => navigate('/'))
            }
        })
    }, [navigate])

    return (
        <div className='justify-items-center h-screen p-6'>
            <Form
                className='w-82'
                name="basic"
                form={loginForm}
                onFinish={(record: Record<string, string>) =>
                    loginAPI({username: record.username, password: record.password, totp: record.totp}).then(
                        () => navigate('/')).catch(
                        (err: AxiosError) => {
                            setTotpValue(undefined)
                            if (err.status === 422) {
                                setLoginPhase('totp')
                                return
                            }
                            throw err
                        })
                }
            >
                <div className='flex justify-center items-start gap-4 w-full h-20'>
                    <img
                        alt='icon'
                        src={icon}
                        width={44}
                        height={44}
                    />
                    <p className='text-4xl font-semibold'>wwr.icu</p>
                </div>
                <div className={loginPhase === 'account' ? '' : 'hidden'}>
                    <Form.Item<LoginRO>
                        name="username"
                        rules={[{ required: true, message: 'Please input your username!' }]}
                    >
                        <Input allowClear size='large' prefix={<UserOutlined/>}/>
                    </Form.Item>

                    <Form.Item<LoginRO>
                        name="password"
                        rules={[{ required: true, message: 'Please input your password!' }]}
                    >
                        <Input.Password size='large' prefix={<LockOutlined/>}/>
                    </Form.Item>
                    <Form.Item>
                        <Button block size='large' type="primary" htmlType="submit">Login</Button>
                    </Form.Item>
                </div>
                <Form.Item<LoginRO>
                    className={`justify-items-center ${loginPhase === 'totp' ? '' : 'hidden'}`}
                    name="totp"
                >
                    <Input.OTP
                        size='large'
                        value={totpValue}
                        onChange={(totp: string) => {
                            if (totp.length == 6) {
                                loginForm.submit()
                            }
                        }}
                    />
                </Form.Item>
            </Form>
        </div>
    )
}
