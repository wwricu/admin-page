'use client'

import React, {useEffect, useState} from 'react'
import {Button, message, Space, TableProps} from 'antd'
import { Form, Input, InputNumber, Popconfirm, Table, Typography } from 'antd'
import {TagVO} from "../model/response"
import {TagTypeEnum} from "../model/enum"
import {deleteTag, getAllTag, newTag, updateTag} from "../api/tag"
import {PlusOutlined} from "@ant-design/icons";


interface EditableCellProps extends React.HTMLAttributes<HTMLElement> {
    editing: boolean
    dataIndex: string
    title: string
    inputType: 'number' | 'text'
    record: TagVO
    index: number
}

interface TagTableProps {
    tagType: TagTypeEnum
}

const EditableCell: React.FC<React.PropsWithChildren<EditableCellProps>> = (
    {
        editing,
        dataIndex,
        title,
        inputType,
        children,
        ...restProps
    }) => {
    const inputNode = inputType === 'number' ? <InputNumber/> : <Input/>

    return (
        <td {...restProps}>
            {editing ? (
                <Form.Item
                    name={dataIndex}
                    style={{ margin: 0 }}
                    rules={[
                        {
                            required: true,
                            message: `Please Input ${title}!`,
                        }
                    ]}
                >
                    {inputNode}
                </Form.Item>
            ) : (
                children
            )}
        </td>
    )
}

const TagTable: React.FC<TagTableProps> = ({tagType}) => {
    const [form] = Form.useForm()
    const [data, setData] = useState<TagVO[]>([])
    const [editingKey, setEditingKey] = useState<number | undefined>()
    const [creating, setCreating] = useState<boolean>(false)
    const isEditing = (tag: TagVO) => tag.id === editingKey
    const [messageApi, contextHolder] = message.useMessage()

    useEffect(() => {
        getAllTag(tagType).then((tagList: TagVO[]) => {
            setData(tagList)
        })
    }, [tagType])

    const create = () => {
        setCreating(true)
        const newData = [...data]
        const tag: TagVO = {
            id: 0,
            name: '',
            type: tagType,
            count: 0
        }
        newData.unshift(tag)
        form.setFieldsValue(tag)
        setEditingKey(tag.id)
        setData(newData)
    }

    const edit = (tag: Partial<TagVO> & { id: React.Key }) => {
        setCreating(false)
        form.setFieldsValue({ name: '', ...tag })
        setEditingKey(tag.id)
    }

    const cancel = () => {
        setEditingKey(undefined)
    }

    const remove = (tag: TagVO) => {
        deleteTag(tag.id).then((id: number) => {
            if (id === 1) {
                const newData = [...data]
                const index = newData.findIndex((item) => tag.id === item.id)
                newData.splice(index, 1)
                setData(newData)
                messageApi.success("success").then()
            }
        })
    }

    const save = async (tagId: number) => {
        try {
            const row = (await form.validateFields()) as TagVO

            const newData = [...data]
            const index = newData.findIndex((item) => tagId === item.id)
            if (index < 0) {
                return
            }
            const tag = newData[index]
            const tagApi = creating ? newTag : updateTag
            tagApi({...tag, ...row,}).then((tagVO) => {
                newData.splice(index, 1, tagVO)
                setData(newData)
            })
            setEditingKey(undefined)
        } catch (errInfo) {
            console.log('Validate Failed:', errInfo)
        }
    }

    const columns = [
        {
            title: 'Name',
            dataIndex: 'name',
            width: '40%',
            editable: true,
        },
        {
            title: 'Count',
            dataIndex: 'count',
            width: '30%',
            editable: false,
        },
        {
            width: '30%',
            title: 'Action',
            dataIndex: 'Action',
            render: (_: unknown, tag: TagVO) => {
                return isEditing(tag) ? (
                  <span>
                    <Typography.Link onClick={() => save(tag.id)} style={{ marginInlineEnd: 8 }}>
                      Save
                    </Typography.Link>
                    <Popconfirm title="Sure to cancel?" onConfirm={cancel}>
                      <a>Cancel</a>
                    </Popconfirm>
                  </span>
                ) : (
                  <Space size='middle'>
                      <Typography.Link disabled={editingKey !== undefined} onClick={() => edit(tag)}>
                          Edit
                      </Typography.Link>
                      <Popconfirm title="Sure to Delete?" onConfirm={() => remove(tag)}>
                          <Typography.Link color='red'>
                              Delete
                          </Typography.Link>
                      </Popconfirm>
                  </Space>
                )
            },
        },
    ]

    const mergedColumns: TableProps<TagVO>['columns'] = columns.map((col) => {
        if (!col.editable) {
            return col
        }
        return {
            ...col,
            onCell: (record: TagVO) => ({
                record,
                inputType: col.dataIndex === 'age' ? 'number' : 'text',
                dataIndex: col.dataIndex,
                title: col.title,
                editing: isEditing(record),
            }),
        }
    })

    return (
        <>
            {contextHolder}
            <Form form={form} component={false}>
                <Button style={{marginTop: 4, marginLeft: 4}} type='primary' onClick={create}>
                    <PlusOutlined/>New
                </Button>
                <Table<TagVO>
                    rowKey={(tagVO: TagVO) => tagVO.id}
                    components={{body: { cell: EditableCell }}}
                    bordered
                    dataSource={data}
                    columns={mergedColumns}
                    rowClassName="editable-row"
                    pagination={{ onChange: cancel, simple: true}}
                    style={{margin: 4}}
                />
            </Form>
        </>
    )
}

export default TagTable
