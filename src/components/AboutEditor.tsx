import {Modal, ModalProps} from "antd";
import TinyMCE from "./Editor.tsx";
import React, {MutableRefObject, useRef} from "react";
import {Editor as TinyMCEEditor} from "tinymce";
import {getConfigAPI, setConfigAPI} from "../api/common.ts";
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
    return <Modal closable={false} onOk={updateAbout} {...props}>
        {/*<textarea style={{width: '100%', maxWidth: '100%', height: '100%', maxHeight: '100%'}}/>*/}
        <TinyMCE
            id='tinyMCE'
            onInit={(_, editor) => {
                editorRef.current = editor
                fetchAbout()
            }}
            init={{
                menubar: false,
                height: '300px'
            }}
        />
    </Modal>
}
