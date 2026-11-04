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

export enum ManageReadEnum {
    ABOUT = 'about',
    USERNAME = 'username',
    TOTP_ENFORCED = 'totp_enforced'
}

export enum ManageCommandEnum {
    SET_ABOUT = 'set_about',
    SET_USERNAME = 'set_username',
    SET_PASSWORD = 'set_password',
    RESET_LOGIN = 'reset_login',
    ENROLL_TOTP = 'enroll_totp',
    CONFIRM_TOTP = 'confirm_totp',
    DISABLE_TOTP = 'disable_totp'
}

export enum EntityTypeEnum {
    BLOG_POST = 'Post',
    POST_TAG = 'Tag',
    POST_CAT = 'Category',
    POST_IMAGE = 'Image',
    POST_COVER = 'Cover'
}
