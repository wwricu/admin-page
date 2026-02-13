import {infoAPI, loginAPI} from "../api/common.ts"
import {useLocation, useNavigate} from "react-router-dom"
import {useEffect, useState} from "react"
import {Form, Button, Input, message, Flex} from "antd"
import {LockOutlined, UserOutlined} from "@ant-design/icons"
import {AxiosError} from "axios"
import {LoginRO} from "../model/request.ts"
import icon from '/doge.png'

export default function LoginPage() {
    const navigate = useNavigate()
    const location = useLocation()
    const [loginForm] = Form.useForm()
    const [loginPhase, setLoginPhase] = useState<'account' | 'totp'>('account')

    useEffect(() => {
        document.title = 'Login - wwr.icu'
        infoAPI().then(
            () => message.success('Logging in...', 1).then(
            () => navigate('/'))).catch()
    }, [location.pathname, navigate])

    return (
        <Flex justify='center' style={{height: '100vh', padding: 24}}>
            <Form
                style={{ width: 328 }}
                form={loginForm}
                onValuesChange={(changedValues, allValues) => {
                    if (changedValues.totp !== undefined && allValues.totp?.length === 6) {
                        loginForm.submit()
                    }
                }}
                onFinish={(record: Record<string, string>) =>
                    loginAPI({username: record.username, password: record.password, totp: record.totp}).then(
                        () => navigate('/')).catch(
                        (err: AxiosError) => {
                            loginForm.setFieldsValue({ totp: '' })
                            if (err.status === 422) {
                                setLoginPhase('totp')
                                return
                            }
                            throw err
                        })
                }
            >
                <Flex justify='center' align='center' gap='middle' style={{ height: 80, width: '100%' }}>
                    <img
                        alt='icon'
                        src={icon}
                        width={44}
                        height={44}
                    />
                    <p style={{fontSize: 36, fontWeight: 500}}>wwr.icu</p>
                </Flex>
                <div style={loginPhase === 'account' ? {} : {display: 'none'}}>
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
                <Flex justify='center'>
                    {/* Flex to work around with mobile safari; TODO: Fix OTP width on safari */}
                    <Form.Item<LoginRO> name="totp" style={loginPhase === 'totp' ? {} : {display: 'none'}}>
                        <Input.OTP size='large'/>
                    </Form.Item>
                </Flex>
            </Form>
        </Flex>
    )
}
