import {FileLoader, FileRepository, UploadAdapter, UploadResponse, Plugin } from "ckeditor5";
import {PostResourceTypeEnum} from "../model/enum.ts";
import {uploadFileAPI} from "../api/common.ts";

declare module '@ckeditor/ckeditor5-core' {
    interface EditorConfig {
        uploader?: CKEditorUploaderConfig
    }
}

export interface CKEditorUploaderConfig {
    postId: string
    fileType: PostResourceTypeEnum
}

export class CKEditorUploader extends Plugin {
    public static override get isOfficialPlugin(): false {
        return false;
    }

    public static override get isPremiumPlugin(): false {
        return false;
    }

    public init(): void {
        const options = this.editor.config.get( 'uploader' );
        if (!options) {
            return
        }

        this.editor.plugins.get( FileRepository ).createUploadAdapter = loader => {
            return new CKEditorUploadAdaptor( loader, options );
        }
    }
}

class CKEditorUploadAdaptor implements UploadAdapter {
    public loader: FileLoader
    readonly fileType: PostResourceTypeEnum
    readonly postId: string

    constructor(loader: FileLoader, options : CKEditorUploaderConfig) {
        this.fileType = options.fileType
        this.postId = options.postId
        this.loader = loader;
    }

    public async upload(): Promise<UploadResponse> {
        return this.loader.file.then( file => new Promise( ( resolve, reject ) => {
                if (!file) {
                    return
                }

                const formData = new FormData()
                formData.append('post_id', this.postId)
                formData.append('file_type', this.fileType)
                formData.append('file', file, file?.name)

                uploadFileAPI(formData).then((fileUploadVO) => {
                    resolve({ default: fileUploadVO.location, name: fileUploadVO.name })
                }).catch(() => {
                    reject('failed')
                })
            }))
    }
}
