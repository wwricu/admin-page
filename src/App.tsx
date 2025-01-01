import {Layout} from "antd";
import Sider from "antd/es/layout/Sider";
import {Content} from "antd/es/layout/layout";
import AdminMenu from "./components/AdminMenu.tsx";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import {PostStatusEnum, TagTypeEnum} from "./model/enum.ts";
import PostTable from "./components/PostTable.tsx";
import TagTable from "./components/TagTable.tsx";
import './App.css'
import EditorPage from "./components/Editor.tsx";

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
                      <Route path="/post" element={<PostTable postStatus={PostStatusEnum.PUBLISHED}/>}/>
                      <Route path="/draft" element={<PostTable postStatus={PostStatusEnum.DRAFT}/>}/>
                      <Route path="/category" element={<TagTable tagType={TagTypeEnum.POST_CAT}/>}/>
                      <Route path="/tag" element={<TagTable tagType={TagTypeEnum.POST_TAG}/>}/>
                      <Route path="/edit/:id" element={<EditorPage/>}/>
                  </Routes>
              </Content>
          </Layout>
      </Layout>
      </BrowserRouter>
  )
}

export default App
