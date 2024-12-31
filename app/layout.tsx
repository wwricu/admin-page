import type { Metadata } from "next";
import localFont from "next/font/local";
import React from "react";
import {Layout} from "antd";
import AdminMenu from "@/app/components/AdminMenu";
import AdminHeader from "@/app/components/AdminHeader";
import Sider from "antd/es/layout/Sider";
import {Content} from "antd/es/layout/layout";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "wwr.icu",
  description: "wwr.icu",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
      <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
          <Layout style={{minHeight: '100vh'}}>
            <AdminHeader/>
            <Layout>
              <Layout>
                <Sider theme='light'>
                  <AdminMenu/>
                </Sider>
                <Content style={{padding: '24'}}>
                  {children}
                </Content>
              </Layout>
            </Layout>
          </Layout>
      </body>
      </html>
  );
}
