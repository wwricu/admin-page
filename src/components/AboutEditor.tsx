import {Modal, ModalProps} from "antd";
import TinyMCE from "./Editor.tsx";
import React, {MutableRefObject, useRef} from "react";
import {Editor as TinyMCEEditor} from "tinymce";
import {getConfigAPI, setConfigAPI} from "../api/manage.ts";
import {ConfigKeyEnum} from "../model/enum.ts";


export default function AboutEditor({onOk, ...props}: ModalProps) {
    const editorRef: MutableRefObject<TinyMCEEditor | undefined> = useRef()
    const updateAbout = (e: React.MouseEvent<HTMLButtonElement>) => {
        setConfigAPI({
            key: ConfigKeyEnum.ABOUT_CONTENT,
            value: editorRef.current?.getContent()
        }).then(() => {
            if (onOk) {
                onOk(e)
            }
        })

    }

    const fetchAbout = () => {
        getConfigAPI(ConfigKeyEnum.ABOUT_CONTENT).then((res: string | null) => {
            editorRef.current?.setContent(res ?? '')
        })
    }

    // onOk upload, onInit fetch content
    return (
        <Modal closable={false} onOk={updateAbout} width={800} {...props}>
            <TinyMCE
                id='tinyMCE'
                onInit={(_, editor) => {
                    editorRef.current = editor
                    fetchAbout()
                }}
                init={{
                    menubar: false,
                    branding: false,
                    width: '100%',
                    height: '500px',
                    plugins: ['wordcount']
                }}
            />
        </Modal>
    )
}
