'use client'

import React, { useEffect, useState} from 'react'
import {Space, Table} from 'antd'
import {TagVO} from '@/app/model/response'
import type { TableProps } from 'antd'
import {getAllCategory} from "@/app/api/tag";


const columns: TableProps<TagVO>['columns'] = [
  {
    title: 'ID',
    dataIndex: 'id',
    key: 'id',
  },
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
    render: (text) => <a>{text}</a>,
  },
  {
    title: 'Created At',
    dataIndex: 'create_time',
    key: 'create_time',
  },
  {
    title: 'Action',
    key: 'action',
    render: (_, tagVO) => (
        <Space size='middle'>
          <p>Rename {tagVO.id}</p>
          <p>Delete</p>
        </Space>
    ),
  },
]

const TagPage: React.FC = () => {
  const [list, setList] = useState<TagVO[]>([])

  useEffect(() => {
    getAllCategory().then((res: TagVO[]) => {
      setList(res)
    }).catch((reason) => {
      console.log(reason)
    })
  }, [])

  return (
      <Table<TagVO> columns={columns} dataSource={list} />
  )
}

export default TagPage
