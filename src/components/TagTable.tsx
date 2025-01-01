'use client'

import React, {useEffect, useState} from 'react'
import {Button, Flex, TableProps} from 'antd'
import { Form, Input, InputNumber, Popconfirm, Table, Typography } from 'antd'
import {TagVO} from "../model/response"
import {TagTypeEnum} from "../model/enum"
import {deleteTag, getAllTag, newTag, updateTag} from "../api/tag"


interface EditableCellProps extends React.HTMLAttributes<HTMLElement> {
    editing: boolean
    dataIndex: string
    title: string
    inputType: 'number' | 'text'
    record: TagVO
    index: number
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

interface TagTableProps {
    tagType: TagTypeEnum
}

const TagTable: React.FC<TagTableProps> = ({tagType}) => {
    const [form] = Form.useForm()
    const [data, setData] = useState<TagVO[]>([])
    const [editingKey, setEditingKey] = useState<number | undefined>()
    const [creating, setCreating] = useState<boolean>(false)
    const isEditing = (tag: TagVO) => tag.id === editingKey

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
            type: tagType
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
        deleteTag(tag.id, tagType).then((id: number) => {
            if (id === 1) {
                const newData = [...data]
                const index = newData.findIndex((item) => tag.id === item.id)
                newData.splice(index, 1)
                setData(newData)
                // TODO: toast success
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
            title: 'ID',
            dataIndex: 'id',
            width: '15%',
            editable: false,
        },
        {
            title: 'Name',
            dataIndex: 'name',
            width: '50%',
            editable: true,
        },
        {
            width: '15%',
            title: 'operation',
            dataIndex: 'operation',
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
                  <Flex justify='space-evenly'>
                      <Typography.Link disabled={editingKey !== undefined} onClick={() => edit(tag)}>
                          Edit
                      </Typography.Link>
                      <Popconfirm title="Sure to Delete?" onConfirm={() => remove(tag)}>
                          <Typography.Link color='red'>
                              Delete
                          </Typography.Link>
                      </Popconfirm>
                  </Flex>
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
            <Button onClick={create}>New</Button>
            <Form form={form} component={false}>
                <Table<TagVO>
                    components={{
                        body: { cell: EditableCell },
                    }}
                    bordered
                    dataSource={data}
                    columns={mergedColumns}
                    rowClassName="editable-row"
                    pagination={{ onChange: cancel }}
                />
            </Form>
        </>

    )
}

export default TagTable
