export enum TagTypeEnum {
    POST_TAG = 'post_tag',
    POST_CAT = 'post_category'
}

export enum PostStatusEnum {
    DRAFT = 'draft',
    PUBLISHED = 'published'
}

export enum PostResourceTypeEnum {
    IMAGE = 'image',
    COVER_IMAGE = 'cover'
}

export enum DatabaseActionEnum {
    BACKUP = 'backup',
    RESTORE = 'restore',
    DOWNLOAD = 'download'
}

export enum ConfigKeyEnum {
    ABOUT_CONTENT = 'about_content',
    ABOUT_AVATAR = 'about_avatar',
    TOTP_SECRET = 'totp_secret',
    USERNAME = 'username',
    PASSWORD = 'password'
}
