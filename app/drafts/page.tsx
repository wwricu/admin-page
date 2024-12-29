'use client'

import React from 'react'
import {PostStatusEnum} from "@/app/model/enum";
import PostTable from "@/app/PostTable";


const AdminPostPage: React.FC = () => {
    return <PostTable postStatus={PostStatusEnum.DRAFT}/>

}

export default AdminPostPage
