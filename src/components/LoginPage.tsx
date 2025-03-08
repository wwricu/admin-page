import {LockOutlined, UserOutlined} from '@ant-design/icons'
import {LoginForm, ProConfigProvider, ProFormText} from '@ant-design/pro-components'
import {theme} from 'antd'
import icon from '/favicon.ico'
import {loginAPI} from "../api/common.ts"
import {useNavigate} from "react-router-dom"


export default function LoginPage() {
    const { token } = theme.useToken()
    const navigate = useNavigate()

    return (
        <ProConfigProvider hashed={false}>
            <div style={{ backgroundColor: token.colorBgContainer }}>
                <LoginForm
                    logo={icon}
                    title="wwr.icu"
                    subTitle=" "
                    onFinish={(record: Record<string, string>) => {
                        loginAPI({
                            username: record.username,
                            password: record.password
                        }).then(() => {
                            navigate('/')
                        })
                        // TODO: CATCH HERE FOR ERROR PROMPT
                    }}
                >
                    <ProFormText
                        name="username"
                        fieldProps={{
                            size: 'large',
                            prefix: <UserOutlined className={'prefixIcon'} />,
                        }}
                        placeholder={'username'}
                        rules={[
                            {
                                required: true,
                                message: 'please enter username!',
                            },
                        ]}
                    />
                    <ProFormText.Password
                        name="password"
                        fieldProps={{
                            size: 'large',
                            prefix: <LockOutlined className={'prefixIcon'} />,
                        }}
                        placeholder={'password'}
                        rules={[
                            {
                                required: true,
                                message: 'please enter your Password!',
                            },
                        ]}
                    />
                </LoginForm>
            </div>
        </ProConfigProvider>
    )
}