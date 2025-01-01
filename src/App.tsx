import {Layout} from "antd";
import Sider from "antd/es/layout/Sider";
import {Content} from "antd/es/layout/layout";
import AdminMenu from "./components/AdminMenu.tsx";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import {PostStatusEnum, TagTypeEnum} from "./model/enum.ts";
import './App.css'
import React, {Suspense} from "react";

const LazyPostTable = React.lazy(() => import("./components/PostTable"));
const LazyTagTable = React.lazy(() => import("./components/TagTable"));
const LazyEditor = React.lazy(() => import("./components/Editor"));

function App() {
  return (
      <BrowserRouter>
      <Layout style={{minHeight: '100vh', width: '100vw'}}>
          <Layout>
              <Sider theme='light'>
                  <AdminMenu/>
              </Sider>
              <Content style={{padding: '24'}}>
                  <Routes>
                      <Route path="/post" element={(
                          <Suspense fallback={<div>Loading...</div>}>
                            <LazyPostTable postStatus={PostStatusEnum.PUBLISHED}/>
                          </Suspense>
                      )}/>
                      <Route path="/draft" element={(
                          <Suspense fallback={<div>Loading...</div>}>
                              <LazyPostTable postStatus={PostStatusEnum.DRAFT}/>
                          </Suspense>
                      )}/>
                      <Route path="/category" element={(
                          <Suspense fallback={<div>Loading...</div>}>
                              <LazyTagTable tagType={TagTypeEnum.POST_CAT}/>
                          </Suspense>
                      )}/>
                      <Route path="/tag" element={(
                          <Suspense fallback={<div>Loading...</div>}>
                              <LazyTagTable tagType={TagTypeEnum.POST_TAG}/>
                          </Suspense>
                      )}/>
                      <Route path="/edit/:id" element={(
                          <Suspense fallback={<div>Loading...</div>}>
                              <LazyEditor/>
                          </Suspense>
                      )}/>
                  </Routes>
              </Content>
          </Layout>
      </Layout>
      </BrowserRouter>
  )
}

export default App
