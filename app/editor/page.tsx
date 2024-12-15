"use client"

import React, {MutableRefObject, useRef} from 'react';
import { Editor } from '@tinymce/tinymce-react';
import { Editor as TinyMCEEditor } from 'tinymce';
import {useSearchParams} from "next/navigation";
import {getPostDetailAPI, updatePostDetailAPI} from "@/app/api/post";
import {PostDetailVO, PostStatusEnum} from "@/app/model/response";
import {Button} from "antd";


export default function EditorPage() {
    const editorRef: MutableRefObject<TinyMCEEditor | undefined> = useRef();
    const searchParams = useSearchParams();
    const id = searchParams.get('id')

    return (
        <>
            <Editor
                id='tinyMCE'
                onInit={(evt, editor) => {
                    editorRef.current = editor
                    if (id == null) {
                        return
                    }
                    getPostDetailAPI(id).then((postDetailVO: PostDetailVO) => {
                        editor.setContent(postDetailVO?.content)
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
            <Button onClick={() => updatePostDetailAPI({
                id: parseInt(id!),
                content: editorRef.current?.getContent()
            })}>Save</Button>
            <Button onClick={() => updatePostDetailAPI({
                id: parseInt(id!),
                content: editorRef.current?.getContent(),
                status: PostStatusEnum.PUBLISHED
            })}>Save And Publish</Button>
        </>
    );
}