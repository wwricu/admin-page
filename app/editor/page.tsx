"use client"

import React, {MutableRefObject, useRef, useState} from 'react'
import { Editor } from '@tinymce/tinymce-react'
import { Editor as TinyMCEEditor } from 'tinymce'
import {useSearchParams} from "next/navigation"
import {getPostDetailAPI, updatePostDetailAPI} from "@/app/api/post"
import {PostDetailVO, PostStatusEnum} from "@/app/model/response"
import {Button, Card, Input} from "antd"


// TODO: edit title, cover, categories and tags here.
export default function EditorPage() {
    const editorRef: MutableRefObject<TinyMCEEditor | undefined> = useRef()
    const searchParams = useSearchParams()
    const [title, setTitle] = useState('');
    const id = searchParams.get('id')

    return (
        <>
            <Card
                title={(<Input value={title} onChange={(e) => setTitle(e.target.value)}></Input>)}
                style={{ margin: 24}}
                extra={<>
                    <Button onClick={() => updatePostDetailAPI({
                        id: parseInt(id!),
                        title: title,
                        content: editorRef.current?.getContent()
                    })}>Save</Button>
                    <Button onClick={() => updatePostDetailAPI({
                        id: parseInt(id!),
                        content: editorRef.current?.getContent(),
                        title: title,
                        status: PostStatusEnum.PUBLISHED
                    })}>Save And Publish</Button>
                </>}
            >
                <Editor
                    id='tinyMCE'
                    onInit={(_, editor) => {
                        editorRef.current = editor
                        if (id == null) {
                            return
                        }
                        getPostDetailAPI(id).then((postDetailVO: PostDetailVO) => {
                            editor.setContent(postDetailVO?.content)
                            setTitle(postDetailVO?.title)
                        })
                    }}
                    apiKey='ttp8w1owo5c68hkksofh1cth7018mik8e8urjtrz23ng6fy5'
                    init={{
                        menubar: false,
                        images_upload_url: '/demo/upimg.php',
                        plugins: [
                            'autolink', 'charmap', 'codesample', 'emoticons', 'image', 'link', 'lists', 'media', 'searchreplace', 'table', 'visualblocks', 'wordcount'
                        ],
                        toolbar: 'blocks fontfamily fontsize | bold italic underline strikethrough | link image table',
                    }}
                />

            </Card>

        </>
    )
}