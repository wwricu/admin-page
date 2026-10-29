import { CKEditor } from '@ckeditor/ckeditor5-react'
import {
    Alignment, Heading,
    Font,
    Bold, Italic, Strikethrough, Subscript, Superscript, Highlight,

    Emoji, Mention, Link, AutoLink, SpecialCharactersEssentials, SpecialCharacters,

    ClassicEditor, Essentials, GeneralHtmlSupport, Paragraph,
} from 'ckeditor5'

import 'ckeditor5/ckeditor5.css'
import '@/ckeditor.css'

type EditorProps = {
    content: string,
    setContent: (content: string) => void,
}

// Default export so ManagePage can React.lazy() this without a `.then(m => ({default: m.X}))` shim.
export default function AboutEditor({ content, setContent }: EditorProps) {
    return (
        <div style={{ flex: 1,  minHeight: 0 }}>
            <CKEditor
                editor={ClassicEditor}
                data={content}
                onChange={(_, editor) => setContent(editor.getData())}
                config={{
                    licenseKey: 'GPL',
                    plugins: [
                        Heading,
                        Alignment, Font,
                        Essentials, Paragraph,
                        Bold, Italic, Strikethrough, Subscript, Superscript, Highlight,
                        Emoji, Mention, AutoLink, Link, SpecialCharacters, SpecialCharactersEssentials,
                        GeneralHtmlSupport
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
    )
}
