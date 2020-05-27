export interface IFile {
    id?: number;
    name?: string;
    extension: string;
    size: number;
    thumb: string;
    url: string;
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
