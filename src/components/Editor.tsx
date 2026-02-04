import {Editor} from '@tinymce/tinymce-react'

import 'tinymce/tinymce'
import 'tinymce/models/dom/model'
import 'tinymce/themes/silver'
import 'tinymce/icons/default'

import 'tinymce/skins/content/default/content'
import 'tinymce/skins/content/dark/content'
import 'tinymce/skins/ui/oxide/skin'
// import 'tinymce/skins/ui/oxide/content'
import 'tinymce/skins/ui/oxide-dark/skin'
// import 'tinymce/skins/ui/oxide-dark/content'

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

import {IAllProps} from "@tinymce/tinymce-react/lib/cjs/main/ts/components/Editor"

export default function TinyMCE(props: IAllProps) {
    return <Editor licenseKey='gpl' {...props}/>
}
