import React, {MutableRefObject, useEffect, useRef, useState} from 'react'
import {Editor as TinyMCEEditor} from 'tinymce'
import {getPostDetailAPI, updatePostDetailAPI} from '../api/post.ts'
import {PostDetailVO, TagVO} from '../model/response.ts'
import {Button, type GetProp, Image as AntdImage, Input, message, Popconfirm, Select, Upload, type UploadProps} from 'antd'
import {getAllTag} from '../api/tag.ts'
import {PostUpdateRO} from '../model/request.ts'
import {baseUrl} from "../api/common.ts"
import {PostResourceTypeEnum, PostStatusEnum, TagTypeEnum} from "../model/enum.ts"
import {DownOutlined, LoadingOutlined, PlusOutlined, UpOutlined} from "@ant-design/icons"
import ImgCrop from "antd-img-crop"
import {useParams} from "react-router-dom"

import { CKEditor } from '@ckeditor/ckeditor5-react';
import {CKEditorUploader} from './CKEditorUploader'
import { Editor, ClassicEditor, Essentials, Paragraph, Bold, Italic, CodeBlock,
    Heading, Highlight, Alignment, BlockQuote, Emoji, Mention, Font, Fullscreen,
    AutoLink, Link, SpecialCharacters, SpecialCharactersEssentials, List, ListProperties,
    GeneralHtmlSupport, FindAndReplace,
    Strikethrough, Subscript, Superscript, Code,
    Table, TableCaption, TableToolbar, TableLayout, TableColumnResize,
    Image, ImageCaption, ImageResize, ImageStyle, ImageToolbar, LinkImage, ImageInsert
} from 'ckeditor5';

import 'ckeditor5/ckeditor5.css';

const { TextArea } = Input

type TagItem = {
    value: number
    label: string
}

type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0]

const getBase64 = (img: FileType, callback: (url: string) => void) => {
    const reader = new FileReader()
    reader.addEventListener('load', () => callback(reader.result as string))
    reader.readAsDataURL(img)
}

const beforeUpload = (file: FileType) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png'
    if (!isJpgOrPng) {
        message.error('You can only upload JPG/PNG file!').then()
    }
    const isLt2M = file.size / 1024 / 1024 < 2
    if (!isLt2M) {
        message.error('Image must smaller than 2MB!').then()
    }
    return isJpgOrPng && isLt2M
}

export default function EditorPage() {
    const editorRef: MutableRefObject<TinyMCEEditor | undefined> = useRef()
    const ckEditorRef: MutableRefObject<Editor | undefined> = useRef()
    const [title, setTitle] = useState('')
    const [postStatus, setPostStatus] = useState<PostStatusEnum>()
    const [category, setCategory] = useState<TagItem>()
    const [tags, setTags] = useState<TagItem[]>([])
    const [preview, setPreview] = useState<string>('')
    const [allTags, setAllTags] = useState<TagItem[]>([])
    const [allCategories, setAllCategories] = useState<TagItem[]>([])
    const [hidePublishOption, setHidePublishOption] = useState<boolean>(true)
    const [messageApi, contextHolder] = message.useMessage()
    const [loading, setLoading] = useState(false)
    const [imageUrl, setImageUrl] = useState<string>()
    const [coverId, setCoverId] = useState<number>()
    const { id } = useParams()
    const postId = parseInt(id!)

    const onChange: UploadProps['onChange'] = (info) => {
        if (info.file.status === 'uploading') {
            setLoading(true)
            return
        }
        if (info.file.status === 'done') {
            // Get this url from response in real world.
            getBase64(info.file.originFileObj as FileType, (url) => {
                setLoading(false)
                setImageUrl(url)
            })
            setCoverId(info.file.response.id)
        }
    }

    const getExtraData: UploadProps['data'] = () => ({
        post_id: postId,
        file_type: PostResourceTypeEnum.COVER_IMAGE
    })

    const uploadButton = (
        <button className={'border-none bg-none'} type='button'>
            {loading ? <LoadingOutlined /> : <PlusOutlined />}
            <div className='mt-2'>Upload</div>
        </button>
    )
    useEffect(() => {
        getAllTag(TagTypeEnum.POST_TAG).then((tagList: TagVO[]) => {
            const tagItems = tagList.map((tag) => {
                return {
                    value: tag.id,
                    label: tag.name
                }
            })
            setAllTags(tagItems)
        })
        getAllTag(TagTypeEnum.POST_CAT).then((tagList: TagVO[]) => {
            const tagItems = tagList.map((tag) => {
                return {
                    value: tag.id,
                    label: tag.name
                }
            })
            setAllCategories(tagItems)
        })
        loadPostContent()
    }, [id])

    const updatePost = (status: PostStatusEnum) => {
        const postUpdateRO: PostUpdateRO = {
            id: postId,
            title: title,
            cover_id: coverId,
            // content: editorRef.current?.getContent() ?? '',
            content: ckEditorRef.current?.getData() ?? '',
            preview: preview,
            category_id: category?.value,
            tag_id_list: tags.map((tagItem) => tagItem.value),
            status: status?.toString()
        }
        updatePostDetailAPI(postUpdateRO).then(() => {
            messageApi.info('success').then()
        })
    }

    const loadPostContent = () => {
        const tinyEditor = editorRef.current
        const ckEditor = ckEditorRef.current
        getPostDetailAPI(postId).then((postDetailVO: PostDetailVO) => {
            if (tinyEditor) {
                tinyEditor.setContent(postDetailVO.content)
            }
            if (ckEditor) {
                ckEditor.setData(postDetailVO.content)
                // ckEditor.setData(postDetailVO.content)
            }
            setTitle(postDetailVO.title)
            setPostStatus(postDetailVO.status as PostStatusEnum)
            if (postDetailVO.category) {
                setCategory({ label: postDetailVO.category.name, value: postDetailVO.category.id })
            }
            setImageUrl(postDetailVO.cover?.url)
            setPreview(postDetailVO.preview)
            if (postDetailVO.tag_list?.length > 0) {
                setTags(postDetailVO.tag_list.map((tagVO: TagVO) => {
                    return {
                        label: tagVO.name,
                        value: tagVO.id
                    }
                }))
            }
        })
    }

    const moreOptionPanel = () => (
        <div className={`flex flex-col gap-1 max-md:p-4 md:p-8 ${hidePublishOption && 'hidden'}`}>
            <Select<TagItem>
                showSearch
                allowClear
                labelInValue
                placeholder='No Category'
                optionFilterProp='label'
                value={category}
                options={allCategories}
                onChange={(value) => {setCategory(value)}}
            />
            <Select<TagItem[]>
                showSearch
                labelInValue
                allowClear
                mode='multiple'
                placeholder='No Tag'
                optionFilterProp='label'
                value={tags}
                onChange={(values) => {setTags(values)}}
                options={allTags}
            />
            <div className='flex justify-start gap-1 max-sm:flex-wrap'>
                <div className='flex flex-col items-center gap-1'>
                    <ImgCrop showReset rotationSlider zoomSlider minZoom={0.5} aspect={300 / 180}>
                        <Upload
                            name='file'
                            listType='picture-card'
                            showUploadList={false}
                            action={`${baseUrl}/post/upload`}
                            maxCount={1}
                            beforeUpload={beforeUpload}
                            onChange={onChange}
                            data={getExtraData}
                            openFileDialogOnClick={coverId === undefined || imageUrl === undefined}
                        >
                            {imageUrl ? <AntdImage src={imageUrl} alt='cover'/> : uploadButton}
                        </Upload>
                    </ImgCrop>
                    <Popconfirm className='w-full' title="Sure to reset cover?" onConfirm={() => {
                        setCoverId(undefined)
                        setImageUrl(undefined)
                    }}>
                        <Button>Reset cover</Button>
                    </Popconfirm>
                </div>
                <TextArea
                    style={{ resize: 'none' }}
                    className='max-sm:h-30'
                    showCount
                    maxLength={200}
                    onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
                        setPreview(e.target.value)
                    }}
                    value={preview}
                    placeholder="Preview"
                />
            </div>
        </div>
    )

    return (
        <>
            {contextHolder}
            <div className='flex flex-col gap-2 w-full h-screen p-1 pb-0'>
                <Input value={title} onChange={(e) => setTitle(e.target.value)}></Input>
                <div className='flex justify-start items-center gap-2'>
                    <Button
                        className='flex-1'
                        icon={hidePublishOption ? <DownOutlined /> : <UpOutlined />}
                        onClick={() => setHidePublishOption(!hidePublishOption)}>
                        More Options
                    </Button>
                    <Popconfirm className='flex-1' title="Sure to save change?" onConfirm={() => updatePost(postStatus!)}>
                        <Button variant='solid' color={postStatus === PostStatusEnum.DRAFT ? 'primary' : 'danger'}>
                            Save {postStatus} post
                        </Button>
                    </Popconfirm>
                </div>
                {moreOptionPanel()}
                <div className='flex-1 min-h-0'>
                <CKEditor
                    editor={ ClassicEditor }
                    onReady={(editor: Editor) => {
                        ckEditorRef.current = editor
                        loadPostContent()
                    }}
                    config={{
                        licenseKey: 'GPL',
                        plugins: [ Essentials, Paragraph, Bold, Italic, CodeBlock, Heading, Highlight, Alignment,
                            BlockQuote, Font, Fullscreen, Emoji, Mention, AutoLink, Link,
                            SpecialCharacters, SpecialCharactersEssentials, List, ListProperties, GeneralHtmlSupport,
                            Table, TableCaption, TableToolbar, TableLayout, TableColumnResize, FindAndReplace,
                            Strikethrough, Subscript, Superscript, Code,
                            Image, ImageToolbar, ImageCaption, ImageStyle, ImageResize, LinkImage, ImageInsert, CKEditorUploader
                        ],
                        toolbar: {
                            items: [
                                'undo', 'redo', '|',
                                'alignment', 'heading', '|',
                                'fontFamily', 'fontSize', 'fontColor', 'fontBackgroundColor', '|',
                                'bold', 'italic', 'strikethrough', 'subscript', 'superscript', 'code', 'codeblock',
                                'blockquote', 'highlight', '|',
                                'bulletedList', 'numberedList', 'insertTable', 'insertImage', 'emoji', 'link', 'specialCharacters', '|',
                                'findandreplace', 'fullscreen'
                            ],
                            shouldNotGroupWhenFull: true
                        },
                        table: {
                            contentToolbar: [
                                'toggleTableCaption', 'tableColumn', 'tableRow', 'mergeTableCells'
                            ]
                        },
                        image: {
                            toolbar: [
                                'imageStyle:block', 'imageStyle:side', '|',
                                'toggleImageCaption', 'imageTextAlternative', '|',
                                'linkImage'
                            ],
                        },
                        uploader: {
                            postId: id!!,
                            fileType: PostResourceTypeEnum.IMAGE
                        }
                    }}
                />
                </div>
            </div>
        </>
    )
}
