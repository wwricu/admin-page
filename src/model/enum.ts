// Mirrors wwricu/domain/enum.py. Keep the members and their wire values identical to the backend,
// including members this app never sends: the tables render whatever the backend returns.

export enum TagTypeEnum {
    POST_TAG = 'post_tag',
    POST_CAT = 'post_category'
}

export enum PostStatusEnum {
    PUBLISHED = 'published',
    DRAFT = 'draft'
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
    TOTP_ENFORCE = 'totp_enforce',
    TOTP_SECRET = 'totp_secret',
    USERNAME = 'username',
    PASSWORD = 'password'
}

export enum EntityTypeEnum {
    BLOG_POST = 'Post',
    POST_TAG = 'Tag',
    POST_CAT = 'Category',
    POST_IMAGE = 'Image',
    POST_COVER = 'Cover'
}
