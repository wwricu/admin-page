import {Button, ConfigProvider, Drawer, Layout, Spin} from "antd"
import Sider from "antd/es/layout/Sider"
import {Content, Header} from "antd/es/layout/layout"
import {BrowserRouter as Router, Navigate, Outlet, Route, Routes, useNavigate} from "react-router-dom"
import {PostStatusEnum, TagTypeEnum} from "./model/enum.ts"
import './App.css'
import React, {Suspense, useEffect, useState} from "react"
import {infoAPI} from "./api/common.ts"
import {MenuOutlined} from "@ant-design/icons"
import useAutoTheme from "./theme.ts"

const LazyPostTable = React.lazy(() => import("./components/PostTable"))
const LazyTagTable = React.lazy(() => import("./components/TagTable"))
const LazyEditor = React.lazy(() => import("./components/EditorPage"))
const LazyLoginPage = React.lazy(() => import("./components/LoginPage.tsx"))
const LazyManagement = React.lazy(() => import("./components/ManagePage.tsx"))
const LazyMenu = React.lazy(() => import("./components/AdminMenu.tsx"))
const LazyTrashBinPage = React.lazy(() => import("./components/TrashBinPage.tsx"))

const Loading: React.FC = () => {
    return <Spin className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" size="large"/>
}

const AppLayout: React.FC = () => {
    const navigate = useNavigate()
    const [open, setOpen] = useState(false)

    useEffect(() => {
        infoAPI().then((res: boolean) => {
            if (!res) {
                navigate('/login')
            }
        }).catch(() => {
            navigate('/login')
        })
    }, [navigate])

    return (
        <>
            <Layout className='h-screen'>
                <Header className='lg:hidden'>
                    <Button color="default" variant="text" onClick={() => setOpen(true)}>
                        <MenuOutlined/>
                    </Button>
                </Header>
                <Layout>
                    <Sider className='max-lg:hidden' theme='light'>
                        <Suspense fallback={<Loading/>}>
                            <LazyMenu/>
                        </Suspense>
                    </Sider>
                    <Content><Outlet/></Content>
                </Layout>
            </Layout>
            <Drawer
                width={200}
                title={null}
                placement='left'
                closable={false}
                onClose={() => setOpen(false)}
                open={open}
                key={'left'}
                styles={{body: {padding: 0}}}
            >
                <Suspense fallback={<Loading/>}>
                    <LazyMenu/>
                </Suspense>
            </Drawer>
        </>
    )
}

const AppRouter = () => {
    return (
        <Router basename='/'>
            <Routes>
                <Route path="/login" element={(
                    <Suspense fallback={<Loading/>}>
                        <LazyLoginPage/>
                    </Suspense>
                )}/>
                <Route path='/' element={<AppLayout/>}>
                    <Route index path="/post" element={(
                        <Suspense fallback={<Loading/>}>
                            <LazyPostTable postStatus={PostStatusEnum.PUBLISHED}/>
                        </Suspense>
                    )}/>
                    <Route path="/draft" element={(
                        <Suspense fallback={<Loading/>}>
                            <LazyPostTable postStatus={PostStatusEnum.DRAFT}/>
                        </Suspense>
                    )}/>
                    <Route path="/category" element={(
                        <Suspense fallback={<Loading/>}>
                            <LazyTagTable tagType={TagTypeEnum.POST_CAT}/>
                        </Suspense>
                    )}/>
                    <Route path="/tag" element={(
                        <Suspense fallback={<Loading/>}>
                            <LazyTagTable tagType={TagTypeEnum.POST_TAG}/>
                        </Suspense>
                    )}/>
                    <Route path="/management" element={(
                        <Suspense fallback={<Loading/>}>
                            <LazyManagement/>
                        </Suspense>
                    )}/>
                    <Route path="/edit/:id" element={(
                        <Suspense fallback={<Loading/>}>
                            <LazyEditor/>
                        </Suspense>
                    )}/>
                    <Route path="/trash" element={(
                        <Suspense fallback={<Loading/>}>
                            <LazyTrashBinPage/>
                        </Suspense>
                    )}/>
                    <Route path="/" element={<Navigate to="/post" replace/>}/>
                </Route>
            </Routes>
        </Router>
    )
}

export default function App() {
    const theme = useAutoTheme()
    return (
        <ConfigProvider theme={theme}>
            <AppRouter/>
        </ConfigProvider>
    )
}
