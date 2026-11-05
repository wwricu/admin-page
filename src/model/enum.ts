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
    RESTORE = 'restore'
}

export enum ConfigKeyEnum {
    ABOUT_CONTENT = 'about_content',
    SITE_TITLE = 'site_title',
    SITE_TAGLINE = 'site_tagline',
    TOTP_ENFORCE = 'totp_enforce',
    TOTP_SECRET = 'totp_secret',
    USERNAME = 'username',
    PASSWORD = 'password'
}

export enum ManageCommandEnum {
    SET_ABOUT = 'set_about',
    SET_SITE_TITLE = 'set_site_title',
    SET_SITE_TAGLINE = 'set_site_tagline',
    SET_LOGIN = 'set_login',
    RESET_LOGIN = 'reset_login',
    ENROLL_TOTP = 'enroll_totp',
    CONFIRM_TOTP = 'confirm_totp',
    DISABLE_TOTP = 'disable_totp',
    REBUILD_SEARCH_INDEX = 'rebuild_search_index'
}

export enum EntityTypeEnum {
    BLOG_POST = 'Post',
    POST_TAG = 'Tag',
    POST_CAT = 'Category',
    POST_IMAGE = 'Image',
    POST_COVER = 'Cover'
}
