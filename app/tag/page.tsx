'use client'

import React from 'react'
import {TagTable} from "@/app/TagTable";
import {TagTypeEnum} from "@/app/model/request";

const TagPage: React.FC = () => {
  return (<TagTable tagType={TagTypeEnum.POST_TAG}/>)
}

export default TagPage
