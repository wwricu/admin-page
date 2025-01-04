import {Layout} from "antd";
import Sider from "antd/es/layout/Sider";
import {Content} from "antd/es/layout/layout";
import AdminMenu from "./components/AdminMenu.tsx";
import {BrowserRouter as Router, Navigate, Outlet, Route, Routes, useNavigate} from "react-router-dom";
import {PostStatusEnum, TagTypeEnum} from "./model/enum.ts";
import './App.css'
import React, {Suspense, useEffect} from "react";
import {infoAPI} from "./api/common.ts";


const LazyPostTable = React.lazy(() => import("./components/PostTable"));
const LazyTagTable = React.lazy(() => import("./components/TagTable"));
const LazyEditor = React.lazy(() => import("./components/Editor"));
const LazyLoginPage = React.lazy(() => import("./components/LoginPage.tsx"));

const Loading: React.FC = () => {
    return <div>Loading...</div>
}


const AppLayout: React.FC = () => {
    const navigate = useNavigate();
    useEffect(() => {
        infoAPI().then((res: boolean) => {
            if (!res) navigate("/login")
        }).catch(() => {
            navigate("/login")
        })
    }, [navigate])
    return <Layout style={{minHeight: '100svh', width: '100svw'}}>
        <Layout>
            <Sider theme='light'>
                <AdminMenu/>
            </Sider>
            <Content style={{padding: '24'}}>
                <Outlet/>
            </Content>
        </Layout>
    </Layout>
}

export default function App() {
    return (
        <Router>
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
                    <Route path="/edit/:id" element={(
                        <Suspense fallback={<Loading/>}>
                            <LazyEditor/>
                        </Suspense>
                    )}/>
                    <Route path="/" element={<Navigate to="/post" replace/>}/>
                </Route>
            </Routes>
        </Router>
    )
}
