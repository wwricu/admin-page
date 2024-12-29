'use client'

import React, {MutableRefObject, useEffect, useRef, useState} from 'react'
import {Editor} from '@tinymce/tinymce-react'
import {Editor as TinyMCEEditor} from 'tinymce'
import {useSearchParams} from 'next/navigation'
import {getPostDetailAPI, updatePostDetailAPI} from '@/app/api/post'
import {PostDetailVO, TagVO} from '@/app/model/response'
import {Button, Card, Flex, type GetProp, Input, message, Select, Upload, type UploadProps} from 'antd'
import {getAllTag} from '@/app/api/tag'
import {PostUpdateRO} from '@/app/model/request'
import {uploadFileAPI} from "@/app/api/common"
import {PostResourceTypeEnum, PostStatusEnum, TagTypeEnum} from "@/app/model/enum"
import {LoadingOutlined, PlusOutlined} from "@ant-design/icons";

type TagItem = {
    value: number
    label: string
}

// TODO: 1. image upload base url, 2. preview, 3. revoke, delete and publish
const image_upload_handler = (blobInfo: any, progress: any) => new Promise((resolve: any, reject: any) => {
    const formData = new FormData();
    formData.append('file', blobInfo.blob(), blobInfo.filename());
    uploadFileAPI(formData).then((fileUploadVO) => {
        progress(100)
        resolve(fileUploadVO.location)
    }).catch(() => {
        reject('failed');
    })
})

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



// TODO: edit title, cover, categories and tags here.
export default function EditorPage() {
    const editorRef: MutableRefObject<TinyMCEEditor | undefined> = useRef()
    const searchParams = useSearchParams()
    const [title, setTitle] = useState('')
    const [postStatus, setPostStatus] = useState<PostStatusEnum>()
    const [category, setCategory] = useState<TagItem>()
    const [tags, setTags] = useState<TagItem[]>([])

    const [allTags, setAllTags] = useState<TagItem[]>([])
    const [allCategories, setAllCategories] = useState<TagItem[]>([])
    const id = searchParams.get('id')
    const [messageApi, contextHolder] = message.useMessage()
    const [loading, setLoading] = useState(false)
    const [imageUrl, setImageUrl] = useState<string>()
    const [coverId, setCoverId] = useState<number>()


    const handleChange: UploadProps['onChange'] = (info) => {
        if (info.file.status === 'uploading') {
            setLoading(true)
            return
        }
        if (info.file.status === 'done') {
            // Get this url from response in real world.
            getBase64(info.file.originFileObj as FileType, (url) => {
                setLoading(false)
                setImageUrl(url)
                setCoverId(info.file.response.id)
            })
        }
    }

    const getExtraData: UploadProps['data'] = () => ({
        post_id: parseInt(id!),
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
    }, [id])

    const updatePost = (status: PostStatusEnum) => {
        const postUpdateRO: PostUpdateRO = {
            id: parseInt(id!),
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

    const actionButtons = () => {
        const publish = postStatus == PostStatusEnum.DRAFT ? (
            <Button
                onClick={() => {
                    updatePost(PostStatusEnum.PUBLISHED)
                    window.location.reload()
                }}
            >
                Publish
            </Button>
        ) : null
        return (
            <Flex justify='start'>
                <Button onClick={() => updatePost(postStatus!)}>
                    Save
                </Button>
                {publish}
            </Flex>
        )
    }

    return (
        <>
            {contextHolder}
            <Card
                title={(
                    <Flex>
                        <Flex gap='middle' wrap>
                            <Upload
                                name='file'
                                listType='picture-card'
                                showUploadList={false}
                                action='http://localhost:8000/post/upload'
                                beforeUpload={beforeUpload}
                                onChange={handleChange}
                                data={getExtraData}
                            >
                                {imageUrl ? <img width={100} src={imageUrl} alt='cover' style={{ width: '100%' }} /> : uploadButton}
                            </Upload>
                        </Flex>
                        <Flex vertical justify='space-evenly' style={{width: '100%'}}>
                            <Input value={title} onChange={(e) => setTitle(e.target.value)}></Input>
                            <Flex justify='space-between'>
                                <div style={{width: '100%'}}>
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
                                </div>
                                {actionButtons()}
                            </Flex>
                        </Flex>
                    </Flex>

                )}
                style={{ margin: 24}}
            >
                <Editor
                    id='tinyMCE'
                    onInit={(_, editor) => {
                        editorRef.current = editor
                        getPostDetailAPI(id!).then((postDetailVO: PostDetailVO) => {
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
                        images_upload_handler: image_upload_handler,
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