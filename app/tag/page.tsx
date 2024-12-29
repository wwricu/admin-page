'use client'

import React from 'react'
import {TagTable} from "@/app/components/TagTable";
import {TagTypeEnum} from "@/app/model/enum";

const TagPage: React.FC = () => {
  return <TagTable tagType={TagTypeEnum.POST_TAG}/>
}

export default TagPage
