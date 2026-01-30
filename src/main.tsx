import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import {ConfigProvider} from "antd";
import {zhCNIntl} from "@ant-design/pro-components";

createRoot(document.getElementById('root')!).render(
  <StrictMode>
      <ConfigProvider
          locale={zhCNIntl} // 移除此行则用英文
          componentSize="middle" // 全局默认尺寸: 'large' | 'middle' | 'small'
          theme={{
              token: {
                  colorPrimary: '#1677ff',
                  borderRadius: 6,
              },
              components: {
                  Button: {
                      colorPrimary: '#722ed1',
                  },
                  Layout: {
                      headerBg: '#ffffff',
                      headerHeight: '3',
                      headerPadding: '0 5px'
                  },
              },
          }}
      >
          <App/>
      </ConfigProvider>
  </StrictMode>,
)
