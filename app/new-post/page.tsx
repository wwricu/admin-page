'use client'

import React from 'react';
import {Button, Flex, Form, FormProps, Input, Upload} from 'antd';
import {PostCreateRO} from '@/app/model/request';
import {LoadingOutlined, PlusOutlined} from '@ant-design/icons';
import {createPostAPI} from '@/app/api/post';
import {PostDetailVO} from '@/app/model/response';
import {useRouter} from 'next/navigation';
import Image from "next/image";


type FieldType = PostCreateRO

export default function NewPostPage() {
    const router = useRouter();

    const onFinish: FormProps<FieldType>['onFinish'] = (values) => {
        createPostAPI(values).then((result: PostDetailVO) => {
            router.push(`/editor?id=${result.id}`)
        })
    };

    const onFinishFailed: FormProps<FieldType>['onFinishFailed'] = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    const loading = false
    const imageUrl = null
    const uploadButton = (
        <button style={{ border: 0, background: 'none' }} type='button'>
            {loading ? <LoadingOutlined /> : <PlusOutlined />}
            <div style={{ marginTop: 8 }}>Upload</div>
        </button>
    );
    return (
        <Flex justify='center'>
                <Form
                    name='basic'
                    labelCol={{ span: 8 }}
                    wrapperCol={{ span: 16 }}
                    style={{ maxWidth: 600 }}
                    initialValues={{ remember: true }}
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                    autoComplete='off'
                >
                    <Form.Item<FieldType>
                        label='Title'
                        name='title'
                        rules={[{ required: true, message: 'Please input your username!' }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item<FieldType>
                        label='Cover'
                        name='cover'
                    >
                        <Upload
                            name='avatar'
                            listType='picture-card'
                            className='avatar-uploader'
                            showUploadList={false}
                            action='https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload'
                        >
                            {imageUrl ? <Image src={imageUrl} alt='avatar' style={{ width: '100%' }} /> : uploadButton}
                        </Upload>
                    </Form.Item>

                    <Form.Item label={null}>
                        <Button type='primary' htmlType='submit'>
                            Submit
                        </Button>
                    </Form.Item>
                </Form>
        </Flex>
    );
}