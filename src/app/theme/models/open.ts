export interface IAuthorize {
    id: number;
    user_id: number;
    platform_id: number;
    token: string;
    status?: string;
    expired_at: number;
    created_at: string;
    updated_at: string;
    platform?: IPlatform;
}

export interface IPlatform {
    id: number;
    user_id: number;
    name: string;
    type: number;
    domain: string;
    description: string;
    appid: string;
    secret: string;
    sign_type: number;
    sign_key: string;
    encrypt_type: number;
    public_key: string;
    rules: string;
    allow_self: number;
    status: number;
    created_at: string;
    updated_at: string;
}


export interface IUploadResult {
    url: string;
    size: number;
    title: string;
    original: string;
    type: string;
    thumb: string;
}

export interface IUploadFile {
    url: string;
    mtime: number;
    thumb: string;
    size: number;
    title: string;
}
