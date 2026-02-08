import {Editor} from '@tinymce/tinymce-react'

import 'tinymce/tinymce'
import 'tinymce/models/dom/model'
import 'tinymce/themes/silver'
import 'tinymce/icons/default'

import 'tinymce/skins/content/default/content'
import 'tinymce/skins/content/dark/content'
import 'tinymce/skins/ui/oxide/skin'
import 'tinymce/skins/ui/oxide/content'
import 'tinymce/skins/ui/oxide-dark/skin'
import 'tinymce/skins/ui/oxide-dark/content'

// More on https://www.tiny.cloud/docs/tinymce/latest/plugins/
import 'tinymce/plugins/advlist'
import 'tinymce/plugins/autolink'
import 'tinymce/plugins/emoticons/js/emojis'
import 'tinymce/plugins/emoticons'
import 'tinymce/plugins/charmap'
import 'tinymce/plugins/codesample'
import 'tinymce/plugins/image'
import 'tinymce/plugins/link'
import 'tinymce/plugins/lists'
import 'tinymce/plugins/media'
import 'tinymce/plugins/save'
import 'tinymce/plugins/searchreplace'
import 'tinymce/plugins/table'
import 'tinymce/plugins/wordcount'
import 'tinymce/plugins/fullscreen'

import {PostResourceTypeEnum} from "../model/enum.ts"
import {uploadFileAPI} from "../api/common.ts"

type BlobInfo = {
    id: () => string
    name: () => string
    filename: () => string
    blob: () => Blob
    base64: () => string
    blobUri: () => string
    uri: () => string | undefined
}

type EditorProps = {
    content: string,
    setContent: (content: string) => void,
    postId?: number
}

export const AboutEditor = ({ content, setContent }: EditorProps) => {
    return (
        <Editor
            id='AboutEditor'
            value={content}
            onEditorChange={(editorContent) => setContent(editorContent)}
            init={{
                menubar: false,
                branding: false,
                resize: false,
                content_css: (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'default'),
                skin: (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'oxide-dark' : 'oxide'),
                width: '100%',
                height: '500px',
                plugins: ['wordcount']
            }}
        />
    )
}

export const PostEditor = ({ content, setContent, postId }: EditorProps) => {
    const tinyMCEImageUploadHandler = (blobInfo: BlobInfo, progress: (percent: number) => void) => new Promise((resolve: (value: string) => void, reject: (reason?: string) => void) => {
        const formData = new FormData()
        formData.append('post_id', postId!.toString())
        formData.append('file_type', PostResourceTypeEnum.IMAGE)
        formData.append('file', blobInfo.blob(), blobInfo.filename())

        uploadFileAPI(formData).then((fileUploadVO) => {
            progress(100)
            resolve(fileUploadVO.location)
        }).catch(() => {
            reject('failed')
        })
    })

    return (
        <Editor
            id={`PostEditor-${postId}`}
            licenseKey='gpl'
            value={content}
            onEditorChange={(editorContent) => setContent(editorContent)}
            init={{
                height: '100%',
                menubar: false,
                resize: false,
                statusbar: false,
                content_css: (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'default'),
                skin: (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'oxide-dark' : 'oxide'),
                images_upload_handler: tinyMCEImageUploadHandler,
                automatic_uploads: true,
                toolbar: `blocks fontfamily fontsize |
                          bold italic underline strikethrough  |
                          subscript superscript charmap codesample |
                          table image link emoticons |
                          alignleft aligncenter alignright alignjustify bullist numlist lineheight |
                          searchreplace fullscreen`,
                plugins: [
                    'autolink', 'charmap', 'codesample', 'fullscreen', 'image', 'lineheight', 'link',
                    'emoticons', 'lists', 'advlist', 'media', 'searchreplace', 'table', 'importcss'
                ]
            }}
        />
    )
}
