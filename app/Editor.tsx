"use client"

import React, {MutableRefObject, useRef} from 'react';
import { Editor } from '@tinymce/tinymce-react';
import { Editor as TinyMCEEditor } from 'tinymce';


export default function EditorComponent() {
    const editorRef: MutableRefObject<TinyMCEEditor | undefined> = useRef();
    const log = () => {
        console.log(editorRef.current?.getContent())
    }
    return (
        <>
            <Editor
                id='tinyMCE'
                onInit={(evt, editor) => editorRef.current = editor}
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
            <button onClick={log}>Log Content</button>
        </>

    );
}