'use client'

import React, {useEffect, useState} from 'react'
import {Button, message, Space, TableProps} from 'antd'
import { Form, Input, InputNumber, Popconfirm, Table} from 'antd'
import {TagVO} from "../model/response"
import {TagTypeEnum} from "../model/enum"
import {deleteTag, getAllTag, updateTag} from "../api/tag"


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
    const isEditing = (tag: TagVO) => tag.id === editingKey
    const [messageApi, contextHolder] = message.useMessage()

    useEffect(() => {
        getAllTag(tagType).then((tagList: TagVO[]) => {
            setData(tagList)
        })
    }, [tagType])

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
            updateTag({...tag, ...row,}).then((tagVO) => {
                newData.splice(index, 1, tagVO)
                setData(newData)
                messageApi.success("success").then()
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
                    <Button variant='solid' color='primary' size='small' onClick={() => save(tag.id)} style={{ marginInlineEnd: 8 }}>
                      Save
                    </Button>
                    <Popconfirm title="Sure to cancel?" onConfirm={cancel}>
                      <Button size='small'>Cancel</Button>
                    </Popconfirm>
                  </span>
                ) : (
                  <Space size='middle'>
                      <Button size='small' disabled={editingKey !== undefined} onClick={() => edit(tag)}>
                          Edit
                      </Button>
                      <Popconfirm title="Sure to Delete?" onConfirm={() => remove(tag)}>
                          <Button variant='solid' size='small' color='danger'>
                              Delete
                          </Button>
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
                <Table<TagVO>
                    size={'small'}
                    scroll={{ x: true }}
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
