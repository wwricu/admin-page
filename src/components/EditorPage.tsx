import React, {useEffect, useRef, useState} from 'react'
import {getPostDetailAPI, updatePostDetailAPI} from '@/api/post.ts'
import {PostDetailVO, TagVO} from '@/model/response.ts'
import {
    Alert,
    App as AntdApp,
    Button,
    Flex,
    type GetProp,
    Image,
    Input,
    message,
    Popconfirm,
    Select,
    Spin,
    Upload,
    type UploadProps
} from 'antd'
import {getAllTag} from '@/api/tag.ts'
import {PostUpdateRO} from '@/model/request.ts'
import {PostResourceTypeEnum, PostStatusEnum, TagTypeEnum} from "@/model/enum.ts"
import {DownOutlined, LoadingOutlined, PlusOutlined, UpOutlined} from "@ant-design/icons"
import ImgCrop from "antd-img-crop"
import {useBlocker, useNavigate, useParams} from "react-router-dom"
import {PostEditor as CKEditor} from './CKEditor'

const { TextArea } = Input

type TagItem = {
    value: number
    label: string
}

// Everything the save call sends. Keeping it in one object is what lets a load replace the whole
// editor state at once and lets unsaved changes be detected by comparing against the loaded copy.
type Draft = {
    title: string
    preview: string
    content: string
    status?: PostStatusEnum
    category?: TagItem
    tags: TagItem[]
    coverId?: number
    coverUrl?: string
}

type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0]

const emptyDraft: Draft = {title: '', preview: '', content: '', tags: []}

const toTagItems = (tagList: TagVO[]): TagItem[] =>
    tagList.map(({id, name}) => ({value: id, label: name}))

const draftFrom = (post: PostDetailVO): Draft => ({
    title: post.title ?? '',
    preview: post.preview,
    content: post.content,
    status: post.status ?? PostStatusEnum.DRAFT,
    category: post.category ? {value: post.category.id, label: post.category.name} : undefined,
    tags: toTagItems(post.tag_list),
    coverId: post.cover?.id,
    coverUrl: post.cover?.url,
})

// category and tags are replaced, never mutated, so identity comparison is exact here
const sameDraft = (a: Draft, b: Draft) =>
    a.title === b.title &&
    a.preview === b.preview &&
    a.content === b.content &&
    a.status === b.status &&
    a.category === b.category &&
    a.tags === b.tags &&
    a.coverId === b.coverId

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
    const [draft, setDraft] = useState<Draft>(emptyDraft)
    const [allTags, setAllTags] = useState<TagItem[]>([])
    const [allCategories, setAllCategories] = useState<TagItem[]>([])
    const [hidePublishOption, setHidePublishOption] = useState<boolean>(true)
    const [messageApi, contextHolder] = message.useMessage()
    const [loading, setLoading] = useState(false)
    const [loaded, setLoaded] = useState(false)
    const [loadFailed, setLoadFailed] = useState(false)
    // What the loaded post looked like; null until a load succeeds
    const loadedDraft = useRef<Draft | null>(null)
    const { modal } = AntdApp.useApp()
    const { id } = useParams()
    const navigate = useNavigate()
    const postId = Number(id)

    const update = (patch: Partial<Draft>) => setDraft((prev) => ({...prev, ...patch}))

    const isDirty = loaded && loadedDraft.current !== null && !sameDraft(loadedDraft.current, draft)

    const onChange: UploadProps['onChange'] = (info) => {
        if (info.file.status === 'uploading') {
            setLoading(true)
            return
        }
        if (info.file.status === 'done') {
            // Get this url from response in real world.
            getBase64(info.file.originFileObj as FileType, (url) => {
                setLoading(false)
                update({coverUrl: url, coverId: info.file.response.id})
            })
        }
        if (info.file.status === 'error') {
            setLoading(false)
            messageApi.error('Cover upload failed').then()
        }
    }

    const save = async () => {
        const postUpdateRO: PostUpdateRO = {
            id: postId,
            title: draft.title,
            cover_id: draft.coverId,
            content: draft.content,
            preview: draft.preview,
            category_id: draft.category?.value,
            tag_id_list: draft.tags.map((tagItem) => tagItem.value)
        }
        try {
            await updatePostDetailAPI(postUpdateRO)
        } catch {
            return // already toasted in the http layer
        }
        loadedDraft.current = draft
        messageApi.info('success').then()
    }

    const load = async () => {
        if (!Number.isSafeInteger(postId) || postId <= 0) {
            messageApi.error(`Invalid post id '${id}'`).then(() => navigate('/post'))
            return
        }
        setLoaded(false)
        setLoadFailed(false)
        getAllTag(TagTypeEnum.POST_TAG).then((tagList: TagVO[]) => {
            setAllTags(toTagItems(tagList))
        }).catch(() => {})
        getAllTag(TagTypeEnum.POST_CAT).then((tagList: TagVO[]) => {
            setAllCategories(toTagItems(tagList))
        }).catch(() => {})

        // A missing post comes back as null (or as nothing at all); the http layer reports the
        // latter as an error. Either way there is nothing to edit, so the form stays unmounted.
        const postDetailVO = await getPostDetailAPI(postId).catch(() => null)
        if (!postDetailVO) {
            setLoadFailed(true)
            return
        }

        const next = draftFrom(postDetailVO)
        loadedDraft.current = next
        setDraft(next)
        setLoaded(true)
        document.title = `Admin - ${next.title} - wwr.icu`
    }

    useEffect(() => {
        load()
        // Only the id can change under a mounted editor; every other input is per-render state
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [postId])

    // In-app navigation (menu links, post table) is intercepted so a dirty editor can ask first
    const blocker = useBlocker(({currentLocation, nextLocation}) =>
        isDirty && currentLocation.pathname !== nextLocation.pathname)

    useEffect(() => {
        if (blocker.state !== 'blocked') {
            return
        }
        modal.confirm({
            title: 'Discard unsaved changes?',
            content: 'This post has edits that have not been saved.',
            okText: 'Discard',
            okButtonProps: {danger: true},
            cancelText: 'Keep editing',
            onOk: () => blocker.proceed(),
            onCancel: () => blocker.reset(),
        })
    }, [blocker, modal])

    // Reloads and tab closes cannot be blocked by the router; the browser shows its own prompt
    useEffect(() => {
        if (!isDirty) {
            return
        }
        const warn = (event: BeforeUnloadEvent) => event.preventDefault()
        window.addEventListener('beforeunload', warn)
        return () => window.removeEventListener('beforeunload', warn)
    }, [isDirty])

    const moreOptionPanel = (
        <Flex vertical gap='small' style={{ paddingTop: 16, paddingBottom: 16, ...(hidePublishOption ? {display: 'none'} : {}) }}>
            <Select<TagItem>
                showSearch
                allowClear
                labelInValue
                placeholder='No Category'
                optionFilterProp='label'
                value={draft.category}
                options={allCategories}
                onChange={(value) => {update({category: value})}}
            />
            <Select<TagItem[]>
                showSearch
                labelInValue
                allowClear
                mode='multiple'
                placeholder='No Tag'
                optionFilterProp='label'
                value={draft.tags}
                onChange={(values) => {update({tags: values})}}
                options={allTags}
            />
            <Flex justify='start' gap='small' className='max-sm-flex-wrap'>
                <Flex vertical align='center' gap='small'>
                    <ImgCrop showReset rotationSlider zoomSlider minZoom={0.5} aspect={2}>
                        <Upload
                            name='file'
                            listType='picture-card'
                            showUploadList={false}
                            action='/api/post/upload'
                            maxCount={1}
                            beforeUpload={beforeUpload}
                            onChange={onChange}
                            data={() => ({
                                post_id: postId,
                                file_type: PostResourceTypeEnum.COVER_IMAGE
                            })}
                            openFileDialogOnClick={draft.coverId === undefined || draft.coverUrl === undefined}
                        >
                            {
                                draft.coverUrl ?
                                <Image src={draft.coverUrl} alt='cover'/> :
                                (loading ? <LoadingOutlined style={{ fontSize: '24px' }}/> : <PlusOutlined style={{ fontSize: '24px' }}/>)
                            }
                        </Upload>
                    </ImgCrop>
                    <Popconfirm title="Sure to reset cover?" onConfirm={() => update({coverId: undefined, coverUrl: undefined})}>
                        <Button style={{width: '100%'}}>Reset cover</Button>
                    </Popconfirm>
                </Flex>
                <TextArea
                    style={{ resize: 'none', minHeight: 140 }}
                    showCount
                    maxLength={200}
                    onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
                        update({preview: e.target.value})
                    }}
                    value={draft.preview}
                    placeholder="Preview"
                />
            </Flex>
        </Flex>
    )

    return (
        <>
            {contextHolder}
            <Flex vertical gap='small' style={{ padding: 4, paddingBottom: 0, width: '100%', height: '100vh'}}>
                {
                    loadFailed &&
                    <Alert
                        type='error'
                        showIcon
                        message='Failed to load this post'
                        description='Nothing has been changed. Retry, or pick another post.'
                        action={<Button size='small' onClick={load}>Retry</Button>}
                    />
                }
                {
                    loaded ? (
                        <>
                            <Input value={draft.title} onChange={(e) => update({title: e.target.value})}></Input>
                            <Flex wrap justify='start' align='center' gap='small'>
                                <Button
                                    style={{ flex: '1 1 0' }}
                                    icon={hidePublishOption ? <DownOutlined /> : <UpOutlined />}
                                    onClick={() => setHidePublishOption(!hidePublishOption)}
                                >
                                    More Options
                                </Button>
                                <Popconfirm title="Sure to save change?" onConfirm={save}>
                                    <Button
                                        style={{ flex: '1 1 0' }}
                                        variant='solid'
                                        color={draft.status === PostStatusEnum.DRAFT ? 'primary' : 'danger'}
                                    >
                                        Save {draft.status} post
                                    </Button>
                                </Popconfirm>
                            </Flex>
                            {moreOptionPanel}
                            <div style={{ flex: 1,  minHeight: 0}}>
                                <CKEditor
                                    content={draft.content}
                                    setContent={(editorContent) => update({content: editorContent})}
                                    postId={postId}
                                />
                            </div>
                        </>
                    ) : (
                        !loadFailed &&
                        <Flex align='center' justify='center' style={{flex: 1}}>
                            <Spin size='large'/>
                        </Flex>
                    )
                }
            </Flex>
        </>
    )
}
