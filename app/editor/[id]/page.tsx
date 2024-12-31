'use client'

import React, {MutableRefObject, useEffect, useRef, useState} from 'react'
import {Editor} from '@tinymce/tinymce-react'
import {Editor as TinyMCEEditor} from 'tinymce'
import {getPostDetailAPI, updatePostDetailAPI} from '@/app/api/post'
import {PostDetailVO, TagVO} from '@/app/model/response'
import {
    Button,
    Card,
    Flex,
    type GetProp,
    Image,
    Input,
    message,
    Select,
    Upload,
    type UploadProps
} from 'antd'
import {getAllTag} from '@/app/api/tag'
import {PostUpdateRO} from '@/app/model/request'
import {uploadFileAPI} from "@/app/api/common"
import {PostResourceTypeEnum, PostStatusEnum, TagTypeEnum} from "@/app/model/enum"
import {LoadingOutlined, PlusOutlined} from "@ant-design/icons";
import ImgCrop from "antd-img-crop";
import '@/app/css/uploader.css'

type TagItem = {
    value: number
    label: string
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


export default function EditorPage({ params }: { params: { id: string } }) {
    const editorRef: MutableRefObject<TinyMCEEditor | undefined> = useRef()
    const [title, setTitle] = useState('')
    const [postStatus, setPostStatus] = useState<PostStatusEnum>()
    const [category, setCategory] = useState<TagItem>()
    const [tags, setTags] = useState<TagItem[]>([])
    const postId = parseInt(params.id)
    const [allTags, setAllTags] = useState<TagItem[]>([])
    const [allCategories, setAllCategories] = useState<TagItem[]>([])
    const [messageApi, contextHolder] = message.useMessage()
    const [loading, setLoading] = useState(false)
    const [imageUrl, setImageUrl] = useState<string>()
    const [coverId, setCoverId] = useState<number>()

    const tinyMCEImageUploadHandler = (blobInfo: any, progress: any) => new Promise((resolve: any, reject: any) => {
        const formData = new FormData();
        formData.append('post_id', postId.toString());
        formData.append('file_type', PostResourceTypeEnum.IMAGE);
        formData.append('file', blobInfo.blob(), blobInfo.filename());
        formData.append('file', blobInfo.blob(), blobInfo.filename());
        uploadFileAPI(formData).then((fileUploadVO) => {
            progress(100)
            resolve(fileUploadVO.location)
        }).catch(() => {
            reject('failed');
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
    });

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
    }, [params.id])

    const updatePost = (status: PostStatusEnum) => {
        const postUpdateRO: PostUpdateRO = {
            id: postId,
            title: title,
            cover_id: coverId,
            content: editorRef.current?.getContent() ?? '',
            category_id: category?.value,
            tag_id_list: tags.map((tagItem) => tagItem.value),
            status: status?.toString()
        }
        updatePostDetailAPI(postUpdateRO).then(() => {
            messageApi.info('success').then()
        })
    }

    // TODO: upload url compatible with diff env
    return (
        <>
            {contextHolder}
            <Card
                title={(
                    <Flex justify='space-between' gap='middle'>
                        <Flex vertical justify='space-evenly' style={{width: '100%'}}>
                            <Input value={title} onChange={(e) => setTitle(e.target.value)}></Input>
                            <Flex justify='space-between' gap='middle'>
                                    <Select<TagItem>
                                        showSearch
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
                            <Flex justify='start'>
                                <Button onClick={() => updatePost(postStatus!)}>
                                    Save
                                </Button>
                            </Flex>
                        </Flex>
                        <Flex gap='middle' wrap>
                            <ImgCrop showReset rotationSlider zoomSlider minZoom={0.5} minAspect={1} aspect={4 / 3}>
                                <Upload
                                    name='file'
                                    listType='picture-card'
                                    showUploadList={false}
                                    action={`${process.env.BASE_URL}/post/upload`}
                                    maxCount={1}
                                    beforeUpload={beforeUpload}
                                    onChange={onChange}
                                    data={getExtraData}
                                >
                                    {imageUrl ? <Image src={imageUrl} alt='cover'/> : uploadButton}
                                </Upload>
                            </ImgCrop>
                        </Flex>
                    </Flex>
                )}
                style={{ margin: 24}}
            >
                <Editor
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
                    apiKey='ttp8w1owo5c68hkksofh1cth7018mik8e8urjtrz23ng6fy5'
                    init={{
                        height: '90vh',
                        menubar: false,
                        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                        // @ts-expect-error
                        images_upload_handler: tinyMCEImageUploadHandler,
                        automatic_uploads: true,
                        plugins: [
                            'autolink', 'charmap', 'codesample', 'emoticons', 'image', 'link', 'lists', 'media', 'searchreplace', 'table', 'visualblocks', 'wordcount'
                        ],
                        toolbar: 'blocks fontfamily fontsize | bold italic underline strikethrough | image link table',
                    }}
                />
            </Card>
        </>
    )
}