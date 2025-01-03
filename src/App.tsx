import {Layout} from "antd";
import Sider from "antd/es/layout/Sider";
import {Content} from "antd/es/layout/layout";
import AdminMenu from "./components/AdminMenu.tsx";
import {BrowserRouter as Router, Outlet, Route, Routes} from "react-router-dom";
import {PostStatusEnum, TagTypeEnum} from "./model/enum.ts";
import './App.css'
import React, {Suspense} from "react";

const LazyPostTable = React.lazy(() => import("./components/PostTable"));
const LazyTagTable = React.lazy(() => import("./components/TagTable"));
const LazyEditor = React.lazy(() => import("./components/Editor"));
const LazyLoginPage = React.lazy(() => import("./components/LoginPage.tsx"));


const AppLayout = <Layout style={{minHeight: '100vh', width: '100vw'}}>
    <Layout>
        <Sider theme='light'>
            <AdminMenu/>
        </Sider>
        <Content style={{padding: '24'}}>
            <Outlet/>
        </Content>
    </Layout>
</Layout>

const Loading = <div>Loading...</div>

function App() {
    return (
        <Router>
            <Routes>

                <Route path="/login" element={(
                    <Suspense fallback={Loading}>
                        <LazyLoginPage/>
                    </Suspense>
                )}/>
                <Route path='/' element={AppLayout}>
                    <Route path="/post" element={(
                        <Suspense fallback={Loading}>
                            <LazyPostTable postStatus={PostStatusEnum.PUBLISHED}/>
                        </Suspense>
                    )}/>
                    <Route path="/draft" element={(
                        <Suspense fallback={Loading}>
                            <LazyPostTable postStatus={PostStatusEnum.DRAFT}/>
                        </Suspense>
                    )}/>
                    <Route path="/category" element={(
                        <Suspense fallback={Loading}>
                            <LazyTagTable tagType={TagTypeEnum.POST_CAT}/>
                        </Suspense>
                    )}/>
                    <Route path="/tag" element={(
                        <Suspense fallback={Loading}>
                            <LazyTagTable tagType={TagTypeEnum.POST_TAG}/>
                        </Suspense>
                    )}/>
                    <Route path="/edit/:id" element={(
                        <Suspense fallback={Loading}>
                            <LazyEditor/>
                        </Suspense>
                    )}/>
                </Route>
            </Routes>
        </Router>
    )
}

export default App
