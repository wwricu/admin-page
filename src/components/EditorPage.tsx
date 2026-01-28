import React, {MutableRefObject, useEffect, useRef, useState} from 'react'
// import {Editor} from '@tinymce/tinymce-react'
import {Editor as TinyMCEEditor} from 'tinymce'
import {getPostDetailAPI, updatePostDetailAPI} from '../api/post.ts'
import {PostDetailVO, TagVO} from '../model/response.ts'
import {
    Button,
    Card,
    Flex,
    type GetProp,
    Image,
    Input,
    message, Popconfirm,
    Select,
    Upload,
    type UploadProps
} from 'antd'
import {getAllTag} from '../api/tag.ts'
import {PostUpdateRO} from '../model/request.ts'
import {baseUrl, uploadFileAPI} from "../api/common.ts"
import {PostResourceTypeEnum, PostStatusEnum, TagTypeEnum} from "../model/enum.ts"
import {LoadingOutlined, PlusOutlined} from "@ant-design/icons"
import ImgCrop from "antd-img-crop"
import {useParams} from "react-router-dom"
import TinyMCE from "./Editor.tsx";
const { TextArea } = Input

type ProgressFn = (percent: number) => void

type TagItem = {
    value: number
    label: string
}

interface BlobInfo {
    id: () => string
    name: () => string
    filename: () => string
    blob: () => Blob
    base64: () => string
    blobUri: () => string
    uri: () => string | undefined
}

const selectorStyle = {
    width: '50%'
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
    const [title, setTitle] = useState('')
    const [postStatus, setPostStatus] = useState<PostStatusEnum>()
    const [category, setCategory] = useState<TagItem>()
    const [tags, setTags] = useState<TagItem[]>([])
    const [preview, setPreview] = useState<string>('')
    const [allTags, setAllTags] = useState<TagItem[]>([])
    const [allCategories, setAllCategories] = useState<TagItem[]>([])
    const [messageApi, contextHolder] = message.useMessage()
    const [loading, setLoading] = useState(false)
    const [imageUrl, setImageUrl] = useState<string>()
    const [coverId, setCoverId] = useState<number>()
    const { id } = useParams()
    const postId = parseInt(id!)

    const tinyMCEImageUploadHandler = (blobInfo: BlobInfo, progress: ProgressFn) => new Promise((resolve: (value: string) => void, reject: (reason?: string) => void) => {
        const formData = new FormData()
        formData.append('post_id', postId.toString())
        formData.append('file_type', PostResourceTypeEnum.IMAGE)
        formData.append('file', blobInfo.blob(), blobInfo.filename())
        formData.append('file', blobInfo.blob(), blobInfo.filename())
        uploadFileAPI(formData).then((fileUploadVO) => {
            progress(100)
            resolve(fileUploadVO.location)
        }).catch(() => {
            reject('failed')
        })
    })

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
        <button style={{ border: 0, background: 'none' }} type='button'>
            {loading ? <LoadingOutlined /> : <PlusOutlined />}
            <div style={{ marginTop: 8 }}>Upload</div>
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
    }, [id])

    const updatePost = (status: PostStatusEnum) => {
        const postUpdateRO: PostUpdateRO = {
            id: postId,
            title: title,
            cover_id: coverId,
            content: editorRef.current?.getContent() ?? '',
            preview: preview,
            category_id: category?.value,
            tag_id_list: tags.map((tagItem) => tagItem.value),
            status: status?.toString()
        }
        updatePostDetailAPI(postUpdateRO).then(() => {
            messageApi.info('success').then()
        })
    }

    return (
        <>
            {contextHolder}
            <Card
                title={(
                        <Flex vertical justify='space-evenly' gap='middle' style={{marginTop: 16, marginBottom: 16}}>
                            <Flex justify='space-between' gap='middle'>
                                <Input value={title} onChange={(e) => setTitle(e.target.value)}></Input>
                                <Select<TagItem>
                                    showSearch
                                    allowClear
                                    labelInValue
                                    placeholder='No Category'
                                    optionFilterProp='label'
                                    value={category}
                                    style={selectorStyle}
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
                                    style={selectorStyle}
                                    value={tags}
                                    onChange={(values) => {setTags(values)}}
                                    options={allTags}
                                />
                            </Flex>
                            <Flex justify='space-between' gap='middle'>
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
                                        {imageUrl ? <Image src={imageUrl} alt='cover'/> : uploadButton}
                                    </Upload>
                                </ImgCrop>
                                <Flex vertical gap='small' style={{width: '100%'}}>
                                    <TextArea
                                        showCount
                                        maxLength={200}
                                        onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
                                            setPreview(e.target.value)
                                        }}
                                        value={preview}
                                        placeholder="Preview"
                                        style={{ height: 140, resize: 'none' }}
                                    />
                                    <Flex gap='small'>
                                        <Popconfirm title="Sure to save change?" onConfirm={() => updatePost(postStatus!)}>
                                            <Button type='primary'>
                                                Save
                                            </Button>
                                        </Popconfirm>
                                        <Button onClick={() => {
                                            setCoverId(undefined)
                                            setImageUrl(undefined)
                                        }}>Reset cover</Button>
                                    </Flex>
                                </Flex>
                            </Flex>
                        </Flex>
                )}
                style={{ margin: 4, padding: 0}}
                styles={{
                    header: { paddingBottom: 2, paddingLeft: 12, paddingRight: 12 },
                    body: { padding: 12, paddingTop: 16 }
                }}
            >
                <div style={{ height: 'calc(100vh - 300px)' }}>
                <TinyMCE
                    id='tinyMCE'
                    onInit={(_, editor) => {
                        editorRef.current = editor
                        getPostDetailAPI(postId).then((postDetailVO: PostDetailVO) => {
                            editor.setContent(postDetailVO.content)
                            setTitle(postDetailVO.title)
                            setPostStatus(postDetailVO.status as PostStatusEnum)
                            if (postDetailVO.category) {
                                setCategory({label: postDetailVO.category.name, value: postDetailVO.category.id})
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
                    }}
                    init={{
                        height: '100%',
                        menubar: false,
                        resize: false,
                        images_upload_handler: tinyMCEImageUploadHandler,
                        automatic_uploads: true,
                        toolbar: 'blocks fontfamily fontsize | bold italic underline strikethrough codesample | image link table',
                        plugins: [
                            'autolink', 'charmap', 'codesample', 'emoticons', 'image', 'link', 'lists', 'media', 'searchreplace', 'table', 'visualblocks', 'wordcount'
                        ]
                    }}
                />
                </div>
            </Card>
        </>
    )
}
