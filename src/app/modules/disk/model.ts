import { IPageEditItem } from '../../theme/models/page';
import { IUser } from '../../theme/models/user';

export interface IFileTypeMap {
    [type: string]: {
        extension: string[];
        icon: string;
    };
}

export const FileTypeMap: IFileTypeMap = {
    text: {
        extension: ['txt', 'sql', 'c', 'cs', 'html', 'js', 'java', 'kt'],
        icon: 'icon-file-text-o',
    },
    image: {
        extension: ['png', 'jpg', 'jpeg', 'webp', 'bmp', 'gif'],
        icon: 'icon-file-image-o',
    },
    music: {
        extension: ['mp3', 'flac', 'ape', 'wav'],
        icon: 'icon-music',
    },
    movie: {
        extension: [ 'avi', 'mp4', 'rmvb', 'mkv', '3gp', 'm3u8'],
        icon: 'icon-file-movie-o',
    },
    archive: {
        extension: ['zip', '7z', 'rar', 'rar5', 'tar', 'gz', 'bz2',],
        icon: 'icon-file-archive-o',
    },
    word: {
        extension: ['doc', 'docx'],
        icon: 'icon-file-word-o',
    },
    ppt: {
        extension: ['ppt', 'pptx'],
        icon: 'icon-file-powerpoint-o',
    },
    excel: {
        extension: ['xls', 'xlsx', 'csv'],
        icon: 'icon-file-excel-o',
    },
    pdf: {
        extension: ['pdf'],
        icon: 'icon-file-pdf-o',
    },
    app: {
        extension: ['ipa', 'apk', 'appx'],
        icon: 'icon-APP',
    },
    bt: {
        extension: ['torrent'],
        icon: 'icon-gift',
    }
};

export interface ISubtitle {
    id: string;
    lang: string;
    label: string;
    url: string;
}

export interface IFile {
    id?: number;
    name?: string;
    extension: string;
    size: number;
    thumb: string;
    url: string;
    type?: string;
    subtitles?: ISubtitle[];
    lyrics?: ISubtitle[];
}

export interface IDisk {
    id: number;
    name: string;
    file_id?: number;
    parent_id?: number;
    file?: IFile;
    deleted_at?: number;
    updated_at: number;
    created_at: number;
    type?: string;
    icon?: string;
    checked?: boolean;
}

export interface IShare {
    id: number;
    name: string;
    mode?: number;
    user: IUser;
    death_at?: number;
    view_count?: number;
    save_count?: number;
    down_count?: number;
    created_at: string;
    checked?: boolean;
}

export interface IShareFile {
    id: number;
    file: IDisk;
}


export interface IDiskServer {
    id: number;
    ip: string;
    port: number;
    file_count: number;
    status: number;
    updated_at: number;
    created_at: number;
}

export interface IDiskServerFile {
    id: number;
    name: string;
    size: number;
    md5: string;
    updated_at: number;
    created_at: number;
    location: string;
    online_count: number;
    server_count: number;
}

export interface ILinkServerData {
    linked: boolean,
    server_url: string,
    upload_url: string,
    download_url: string,
    ping_url: string,
}

export interface IStorageFile extends IPageEditItem {
    id: number;
    name: string;
    size: number;
    md5: string;
    updated_at: number;
    created_at: number;
    folder: number;
    path: string;
    url?: string;
}