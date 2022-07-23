import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { FileTypeMap, IDisk, IFile, IShare } from './model';
import { IData, IDataOne, IPage } from '../../theme/models/page';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class DiskService {

    constructor(
        private http: HttpClient,
    ) { }

    public getCatalog(params: any) {
        return this.http.get<IPage<IDisk>>('disk', {params});
    }

    public create(data: any) {
        return this.http.post<IDisk>('disk/home/create', data);
    }

    public file(id: any) {
        return this.http.get<IFile>('disk/home/file', {
            params: {id}
        });
    }

    public files(id: any[]) {
        return this.http.post<IData<IFile>>('disk/home/files', {id});
    }

    public uploadCheck(data: any) {
        return this.http.post<any>('disk/upload/check', data);
    }

    public upload(data: any) {
        return this.http.post<any>('disk/upload', data);
    }

    public uploadFinish(data: any) {
        return this.http.post<IDisk>('disk/upload/finish', data);
    }

    public shareList(params: any) {
        return this.http.get<IPage<IShare>>('disk/share', {params});
    }

    public myShare(params: any) {
        return this.http.get<IPage<IShare>>('disk/share/my', {params});
    }

    public trashList(params: any) {
        return this.http.get<IPage<IDisk>>('disk/trash', {params});
    }

    public allowUrl(url: string): Observable<IDataOne<string>>;
    public allowUrl(url: string[]): Observable<IDataOne<string[]>>;
    public allowUrl(url: string|string[]) {
        return this.http.post<IDataOne<string|string[]>>('disk/home/allow', {url});
    }

    public getIconByExt(ext?: string): string {
        if (!ext) {
            return 'icon-folder-o';
        }
        for (const key in FileTypeMap) {
            if (Object.prototype.hasOwnProperty.call(FileTypeMap, key) && FileTypeMap[key].extension.indexOf(ext) >= 0) {
                return FileTypeMap[key].icon;
            }
        }
        return 'icon-file-o';
    }

    public getTypeByExt(ext?: string): string {
        if (!ext) {
            return '';
        }
        for (const key in FileTypeMap) {
            if (Object.prototype.hasOwnProperty.call(FileTypeMap, key) && FileTypeMap[key].extension.indexOf(ext) >= 0) {
                return key;
            }
        }
        return '';
    }
}
