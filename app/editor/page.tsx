'use client'

import React, {MutableRefObject, useEffect, useRef, useState} from 'react'
import {Editor} from '@tinymce/tinymce-react'
import {Editor as TinyMCEEditor} from 'tinymce'
import {useSearchParams} from 'next/navigation'
import {getPostDetailAPI, updatePostDetailAPI} from '@/app/api/post'
import {PostDetailVO, PostStatusEnum, TagVO} from '@/app/model/response'
import {Button, Card, Flex, Input, message, Select} from 'antd'
import {getAllTag} from '@/app/api/tag'
import {PostUpdateRO, TagTypeEnum} from '@/app/model/request'

type TagItem = {
    value: number
    label: string
}


// TODO: edit title, cover, categories and tags here.
export default function EditorPage() {
    const editorRef: MutableRefObject<TinyMCEEditor | undefined> = useRef()
    const searchParams = useSearchParams()
    const [title, setTitle] = useState('')
    const [category, setCategory] = useState<TagItem>()
    const [tags, setTags] = useState<TagItem[]>([])
    const [allTags, setAllTags] = useState<TagItem[]>([])
    const [allCategories, setAllCategories] = useState<TagItem[]>([])
    const id = searchParams.get('id')
    const [messageApi, contextHolder] = message.useMessage();

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
    }, [])

    const updatePost = (status: PostStatusEnum | undefined) => {
        const postUpdateRO: PostUpdateRO = {
            id: parseInt(id!),
            title: title,
            content: editorRef.current?.getContent(),
            category_id: category?.value,
            tag_id_list: tags?.map((tagItem) => tagItem.value),
            status: status?.toString()
        }
        updatePostDetailAPI(postUpdateRO).then(() => {
            messageApi.info('success').then();
        })
    }
    // TODO: 1. image upload base url, 2. preview, 3. revoke, delete and publish

    return (
        <>
            {contextHolder}
            <Card
                title={(
                    <Flex justify='space-between'>
                        <Input value={title} style={{width: '50%'}} onChange={(e) => setTitle(e.target.value)}></Input>
                        <Flex justify='start'>
                            <Select<TagItem>
                                showSearch
                                optionFilterProp='label'
                                value={category}
                                options={allCategories}
                                onChange={(value) => {setCategory(value)}}
                            />
                            <Select<TagItem[]>
                                showSearch
                                mode='tags'
                                optionFilterProp='label'
                                value={tags}
                                onChange={(values) => {setTags(values)}}
                                options={allTags}
                            />
                        </Flex>
                        <Flex justify='start'>
                            <Button onClick={() => updatePost(undefined)}>
                                Save
                            </Button>
                            <Button onClick={() => updatePost(PostStatusEnum.PUBLISHED)}>
                                Publish
                            </Button>
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
                            if (postDetailVO.category) {
                                setCategory({label: postDetailVO.category.name, value: postDetailVO.category.id})
                            }
                            setTags(postDetailVO.tag_list.map((tagVO: TagVO) => {
                                return {
                                    label: tagVO.name,
                                    value: tagVO.id
                                }
                            }))
                        })
                    }}
                    apiKey='ttp8w1owo5c68hkksofh1cth7018mik8e8urjtrz23ng6fy5'
                    init={{
                        height: '90vh',
                        menubar: false,
                        images_upload_base_path: 'http://localhost:8000',
                        images_upload_url: '/upload',
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