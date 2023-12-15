import { InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';
import { IData, IPage } from '../../theme/models/page';

export const FILE_PROVIDER = new InjectionToken<IFileProvider>('file.provider');

export interface IFileProvider {
    /**
     * 返回驱动列表
     */
    driveList(): Observable<IFileItem[]>;
    searchFile(params: IFileQueries): Observable<IPage<IFileItem>|IData<IFileItem>>;
}

export interface IFileQueries {
    path?: string;
    keywords?: string;
    filter?: string;
    page?: number;
}

export interface IFileCatalogItem {
    icon?: string;
    name: string;
    path?: string;
    level?: number;
    expandable?: boolean;
    expanded?: boolean;
    children?: IFileCatalogItem[];
    loading?: 0|1|2;
}

export interface IFileItem {
    icon?: string;
    thumb?: string;
    name: string;
    path: string;
    isFolder?: boolean;
    size?: number;
    created_at?: string;
    checkable?: boolean;
    checked?: boolean;
    extension: string;
    type?: 'file'|'folder'|'group';
}

export interface IBreadcrumbItem {
    icon?: string;
    name: string;
    path: string;
    disabled?: boolean;
}

export interface IFileDataSource {
    get count(): number;
    indexOf(file: IFileItem): number;
    getAt(i: number): IFileItem|undefined;
}

export interface IFileExplorerTool {
    open(file: IFileItem, source: IFileDataSource);
}

export enum FileExplorerAction {
    New,
    Cut,
    Paste,
    Trash,
    Download,
    Edit
}