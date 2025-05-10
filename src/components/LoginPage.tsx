import {LockOutlined, UserOutlined} from '@ant-design/icons'
import {LoginForm, ProConfigProvider, ProFormText} from '@ant-design/pro-components'
import {Flex, Input, Modal, theme} from 'antd'
import icon from '/favicon.ico'
import {loginAPI} from "../api/common.ts"
import {useNavigate} from "react-router-dom"
import {useEffect, useState} from "react";
import {getConfigAPI} from "../api/manage.ts";
import {ConfigKeyEnum} from "../model/enum.ts";


export default function LoginPage() {
    const {token} = theme.useToken()
    const navigate = useNavigate()
    const [totpEnforce, setTotpEnforce] = useState<boolean>(false)
    const [modalApi, modalContextHolder] = Modal.useModal();

    useEffect(() => {
        getConfigAPI(ConfigKeyEnum.TOTP_ENFORCE).then((res: string | null) => {
            setTotpEnforce(Boolean(res));
        })
    })

    const login = (username: string, password: string, totp: string | undefined = undefined) => {
        loginAPI({
            username: username,
            password: password,
            totp: totp
        }).then(() => {
            navigate('/')
        })
    }

    return (
        <>
            {modalContextHolder}
            <ProConfigProvider hashed={false}>
                <div style={{backgroundColor: token.colorBgContainer}}>
                    <LoginForm
                        logo={icon}
                        title="wwr.icu"
                        subTitle=" "
                        onFinish={(record: Record<string, string>) => {
                            if (!totpEnforce) {
                                login(record.username, record.password)
                            }
                            if (totpEnforce) {
                                modalApi.info({
                                    icon: null,
                                    okText: 'Cancel',
                                    title: 'Input totp',
                                    content: <Flex justify='center'>
                                        <Input.OTP
                                            onChange={(totp: string) => {
                                                if (totp.length == 6) {
                                                    login(record.username, record.password, totp)
                                                }
                                            }}
                                            style={{marginTop: '15px', marginBottom: '15px'}}
                                        />
                                    </Flex>
                                });
                            }
                        }}
                    >
                        <ProFormText
                            name="username"
                            fieldProps={{
                                size: 'large',
                                prefix: <UserOutlined className={'prefixIcon'}/>,
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
                                prefix: <LockOutlined className={'prefixIcon'}/>,
                            }}
                            placeholder={'password'}
                            rules={[
                                {
                                    required: true,
                                    message: 'please enter your Password!',
                                }
                            ]}
                        />
                    </LoginForm>
                </div>
            </ProConfigProvider>
        </>
    )
}
