import React, {useEffect, useState} from 'react'
import {Button, Form, Input, message, Popconfirm, Space, Table} from 'antd'
import {TagVO} from "@/model/response"
import {TagTypeEnum} from "@/model/enum"
import {deleteTag, getAllTag, updateTag} from "@/api/tag"
import {useRefresh} from "@/common.ts"

export default function TagTable ({ tagType }: { tagType: TagTypeEnum }) {
    const [form] = Form.useForm()
    const [data, setData] = useState<TagVO[]>([])
    const [editingKey, setEditingKey] = useState<number | undefined>()
    const [loading, setLoading] = useState(false)
    const isEditing = (tag: TagVO) => tag.id === editingKey
    const [messageApi, contextHolder] = message.useMessage()
    const refresh = useRefresh()

    useEffect(() => {
        document.title = `Admin - ${tagType === TagTypeEnum.POST_CAT ? 'Post Categories' : 'Post Tags'} - wwr.icu`
        setLoading(true)
        getAllTag(tagType).then((tagList: TagVO[]) => {
            setData(tagList)
        }).catch(() => {}).finally(() => setLoading(false))
        setEditingKey(undefined)
    }, [tagType, refresh])

    const edit = (tag: Partial<TagVO> & { id: React.Key }) => {
        form.setFieldsValue({ name: '', ...tag })
        setEditingKey(tag.id)
    }

    const cancel = () => {
        setEditingKey(undefined)
    }

    const remove = (tag: TagVO) => {
        deleteTag(tag.id).then(() => {
            const newData = [...data]
            const index = newData.findIndex((item) => tag.id === item.id)
            newData.splice(index, 1)
            setData(newData)
            messageApi.success("success").then()
        }).catch(() => {})
    }

    const save = async (tagId: number) => {
        const row = await form.validateFields().catch(() => undefined)
        const index = data.findIndex((item) => tagId === item.id)
        if (!row || index < 0) {
            return
        }
        const tagVO = await updateTag({...data[index], ...row}).catch(() => undefined)
        if (!tagVO) {
            return
        }
        const newData = [...data]
        newData.splice(index, 1, tagVO)
        setData(newData)
        messageApi.success("success").then()
        setEditingKey(undefined)
    }

    const columns = [
        {
            title: 'Name',
            dataIndex: 'name',
            width: '40%',
            render: (name: string, tag: TagVO) => isEditing(tag) ? (
                <Form.Item style={{margin: 0}} name='name' rules={[{required: true, message: 'Please Input Name!'}]}>
                    <Input maxLength={32}/>
                </Form.Item>
            ) : name,
        },
        {
            title: 'Count',
            dataIndex: 'count',
            width: '30%',
        },
        {
            width: '30%',
            title: 'Action',
            dataIndex: 'Action',
            render: (_: unknown, tag: TagVO) => {
                return isEditing(tag) ? (
                    <Space size='middle'>
                        <Popconfirm title={`Save ${form.getFieldValue('name')}?`} onConfirm={() => save(tag.id)}>
                            <Button variant='outlined' color='primary' size='small'>
                              Save
                            </Button>
                        </Popconfirm>
                        <Button size='small' onClick={cancel}>Cancel</Button>
                    </Space>
                ) : (
                  <Space size='middle'>
                      <Button size='small' disabled={editingKey !== undefined} onClick={() => edit(tag)}>
                          Edit
                      </Button>
                      <Popconfirm title={`Delete ${tag.name}?`} disabled={editingKey !== undefined} onConfirm={() => remove(tag)}>
                          <Button variant={editingKey !== undefined ? 'outlined' : 'solid'} size='small' color='danger'>
                              Delete
                          </Button>
                      </Popconfirm>
                  </Space>
                )
            },
        },
    ]

    return (
        <>
            {contextHolder}
            <Form form={form} component={false}>
                <Table<TagVO>
                    size={'small'}
                    scroll={{ x: true }}
                    loading={loading}
                    rowKey={(tagVO: TagVO) => tagVO.id}
                    bordered
                    dataSource={data}
                    columns={columns}
                    rowClassName="editable-row"
                    pagination={{ onChange: cancel, simple: true}}
                />
            </Form>
        </>
    )
}
