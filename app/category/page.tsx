'use client'

import React from 'react'
import {TagTable} from "@/app/TagTable"
import {TagTypeEnum} from "@/app/model/enum"

const CategoryPage: React.FC = () => {
    return (<TagTable tagType={TagTypeEnum.POST_CAT}/>)
}

export default CategoryPage
