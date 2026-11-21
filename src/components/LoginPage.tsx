import {infoAPI, loginAPI} from "@/api/common.ts"
import {useLocation, useNavigate} from "react-router-dom"
import {useEffect, useState} from "react"
import {Form, Button, Input, message, Flex, theme} from "antd"
import {LockOutlined, UserOutlined} from "@ant-design/icons"
import {LoginRO} from "@/model/request.ts"
import {HttpError} from "@/common.ts"
import icon from '/doge.png'

export default function LoginPage() {
    const navigate = useNavigate()
    const location = useLocation()
    const [loginForm] = Form.useForm()
    const [loginPhase, setLoginPhase] = useState<'account' | 'totp'>('account')
    const {token} = theme.useToken()

    useEffect(() => {
        document.title = 'Admin - Login - wwr.icu'
        if (import.meta.env.PROD) {
            infoAPI().then(
            () => message.success('Logging in...', 1).then(
            () => navigate('/'))).catch(() => {})
        }
    }, [location.pathname, navigate])

    return (
        <Flex
            vertical
            justify='center'
            align='center'
            style={{
                minHeight: '100dvh',
                boxSizing: 'border-box',
                padding: 24,
                background: `radial-gradient(1100px 520px at 50% -12%, ${token.colorPrimary}14, transparent 62%), linear-gradient(180deg, ${token.colorBgLayout} 0%, ${token.colorBgContainer} 100%)`,
            }}
        >
            <div
                style={{
                    width: 360,
                    maxWidth: '100%',
                    boxSizing: 'border-box',
                    padding: '36px 32px 32px',
                    background: token.colorBgContainer,
                    borderRadius: 12,
                    border: `1px solid ${token.colorBorderSecondary}`,
                    boxShadow: token.boxShadowSecondary,
                    transform: 'translateY(-4vh)',
                }}
            >
                <Form
                    style={{width: '100%'}}
                    form={loginForm}
                    onValuesChange={(changedValues, allValues) => {
                        if (changedValues.totp !== undefined && allValues.totp?.length === 6) {
                            loginForm.submit()
                        }
                    }}
                    onFinish={(record: Record<string, string>) =>
                        loginAPI({username: record.username, password: record.password, totp: record.totp}).then(
                            () => navigate('/')).catch(
                            (err: HttpError) => {
                                loginForm.setFieldsValue({ totp: '' })
                                if (err.status === 401 && err.message === 'Please input TOTP') {
                                    setLoginPhase('totp')
                                }
                            })
                    }
                >
                    <Flex justify='center' align='center' gap='middle' style={{height: 72, width: '100%', marginBottom: 8}}>
                        <img
                            alt='icon'
                            src={icon}
                            width={44}
                            height={44}
                        />
                        <p style={{fontSize: 36, fontWeight: 500, color: token.colorText}}>wwr.icu</p>
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
                        <Form.Item style={{marginBottom: 0}}>
                            <Button block size='large' type="primary" htmlType="submit">Login</Button>
                        </Form.Item>
                    </div>
                    {/* natural height: the outer Flex centers the card symmetrically, so switching phases does not shift it lower */}
                    <div style={loginPhase === 'totp' ? {} : {display: 'none'}}>
                        <p style={{textAlign: 'center', fontSize: 13, color: token.colorTextDescription, marginBottom: 16, textWrap: 'balance'}}>
                            Enter your 6-digit authenticator code
                        </p>
                        <Flex justify='center'>
                            {/* Flex to work around with mobile safari; TODO: Fix OTP width on safari */}
                            <Form.Item<LoginRO> name="totp" style={{marginBottom: 0}}>
                                <Input.OTP size='large'/>
                            </Form.Item>
                        </Flex>
                    </div>
                </Form>
            </div>
        </Flex>
    )
}
