import {Modal, ModalProps} from "antd";
import React, {MutableRefObject, useRef} from "react";
import {getConfigAPI, setConfigAPI} from "../api/manage.ts";
import {ConfigKeyEnum} from "../model/enum.ts";
import {CKEditor} from "@ckeditor/ckeditor5-react";
import {
    Alignment, AutoLink,
    Bold,
    ClassicEditor,
    Editor, Emoji,
    Essentials, Font, GeneralHtmlSupport,
    Heading,
    Highlight,
    Italic, Link, Mention,
    Paragraph, SpecialCharacters, SpecialCharactersEssentials, Strikethrough, Subscript,
    Superscript
} from "ckeditor5";
import 'ckeditor5/ckeditor5.css';


export default function AboutEditor({onOk, ...props}: ModalProps) {
    const editorRef: MutableRefObject<Editor | undefined> = useRef()

    const updateAbout = (e: React.MouseEvent<HTMLButtonElement>) => {
        setConfigAPI({
            key: ConfigKeyEnum.ABOUT_CONTENT,
            value: editorRef.current?.getData()
        }).then(() => {
            if (onOk) {
                onOk(e)
            }
        })

    }

    return (
        <Modal closable={false} onOk={updateAbout} width={800} {...props}>
            <div className="h-125">
                <CKEditor
                    editor={ ClassicEditor }
                    onReady={(editor: Editor) => {
                        editorRef.current = editor
                        getConfigAPI(ConfigKeyEnum.ABOUT_CONTENT).then((res: string | null) => {
                            editorRef.current?.setData(res ?? '')
                        })
                    }}
                    config={{
                        licenseKey: 'GPL',
                        plugins: [ Essentials, Paragraph, Bold, Italic, Heading, Highlight, Alignment,
                            Font, Emoji, Mention, AutoLink, Link,
                            SpecialCharacters, SpecialCharactersEssentials, GeneralHtmlSupport,
                            Strikethrough, Subscript, Superscript
                        ],
                        toolbar: {
                            items: [
                                'heading', '|',
                                'alignment', 'fontFamily', 'fontSize', '|',
                                'bold', 'italic', 'strikethrough', 'subscript', 'superscript', 'highlight', '|',
                                'emoji', 'link', 'specialCharacters'
                            ],
                            shouldNotGroupWhenFull: true
                        },
                    }}
                />
            </div>
        </Modal>
    )
}
