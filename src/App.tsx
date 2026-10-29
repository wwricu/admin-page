import {App as AntdApp, Button, ConfigProvider, Drawer, Flex, Layout, Spin} from "antd"
import Sider from "antd/es/layout/Sider"
import {Content, Header} from "antd/es/layout/layout"
import {createBrowserRouter, Navigate, Outlet, RouterProvider, useLocation} from "react-router-dom"
import {PostStatusEnum, TagTypeEnum} from "./model/enum.ts"
import '@/App.css'
import React, {ReactNode, Suspense, useMemo, useState} from "react"
import {MenuOutlined} from "@ant-design/icons"
import useAutoTheme from "@/theme.ts"
import {RefreshContext} from "@/common.ts"

const LazyPostTable = React.lazy(() => import("./components/PostTable"))
const LazyTagTable = React.lazy(() => import("./components/TagTable"))
const LazyEditor = React.lazy(() => import("./components/EditorPage"))
const LazyLoginPage = React.lazy(() => import("./components/LoginPage.tsx"))
const LazyManagement = React.lazy(() => import("./components/ManagePage.tsx"))
const LazyMenu = React.lazy(() => import("./components/AdminMenu.tsx"))
const LazyTrashBinPage = React.lazy(() => import("./components/TrashBinPage.tsx"))

const RefreshProvider = ({ children }: { children: ReactNode }) => {
    const [key, setKey] = useState(false)

    // Memoized so consumers' useEffect deps only fire on an actual refresh trigger
    const value = useMemo(() => ({
        key,
        triggerRefresh: () => setKey(prev => !prev),
    }), [key])

    return (
        <RefreshContext.Provider value={value}>
            {children}
        </RefreshContext.Provider>
    )
}

const Loading: React.FC = () => {
    return <Spin style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)'}} size="large"/>
}

const AppLayout: React.FC = () => {
    const location = useLocation()
    const [open, setOpen] = useState(false)

    const getPosition = () => {
        const url = location.pathname.split('/').filter(Boolean)[0] || null
        if (!url) {
            return null
        }
        return url[0].toUpperCase() + url.slice(1)
    }

    return (
        <>
            <Layout style={{height: '100vh'}}>
                <Header className='lg:hidden'>
                    <Flex align='center' gap='small'>
                        <Button color="default" variant="text" onClick={() => setOpen(true)}>
                            <MenuOutlined/>
                        </Button>
                        <span style={{verticalAlign: 'middle'}}>
                            {getPosition()}
                        </span>
                    </Flex>
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

const suspend = (node: ReactNode) => <Suspense fallback={<Loading/>}>{node}</Suspense>

// A data router, unlike <BrowserRouter>, is what exposes useBlocker to the editor page
const router = createBrowserRouter([
    {
        path: '/login',
        element: suspend(<LazyLoginPage/>),
    },
    {
        path: '/',
        element: <AppLayout/>,
        children: [
            {index: true, element: <Navigate to='/post' replace/>},
            {path: 'post', element: suspend(<LazyPostTable postStatus={PostStatusEnum.PUBLISHED}/>)},
            {path: 'draft', element: suspend(<LazyPostTable postStatus={PostStatusEnum.DRAFT}/>)},
            {path: 'category', element: suspend(<LazyTagTable tagType={TagTypeEnum.POST_CAT}/>)},
            {path: 'tag', element: suspend(<LazyTagTable tagType={TagTypeEnum.POST_TAG}/>)},
            {path: 'management', element: suspend(<LazyManagement/>)},
            {path: 'edit/:id', element: suspend(<LazyEditor/>)},
            {path: 'trash', element: suspend(<LazyTrashBinPage/>)},
        ],
    },
])

export default function App() {
    const theme = useAutoTheme()
    return (
        <ConfigProvider theme={theme}>
            <AntdApp component={false}>
                <RefreshProvider>
                    <RouterProvider router={router}/>
                </RefreshProvider>
            </AntdApp>
        </ConfigProvider>
    )
}
