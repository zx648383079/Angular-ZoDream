import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IData, IDataOne, IPage } from '../../../theme/models/page';
import { IDiskServer, IDiskServerFile, ILinkServerData, IStorageFile } from '../model';
import { IFileItem, IFileProvider, IFileQueries } from '../../../components/file-explorer/model';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DiskService implements IFileProvider {

    constructor(
        private http: HttpClient
    ) { }

    public serverList(params: any) {
        return this.http.get<IPage<IDiskServer>>('disk/admin/file/server', {
            params,
        });
    }

    public fileList(params: any) {
        return this.http.get<IPage<IDiskServerFile>>('disk/admin/file', {
            params,
        });
    }

    public linkServer(data: ILinkServerData) {
        return this.http.post<ILinkServerData>('disk/admin/client/link_server', data);
    }

    public statistics() {
        return this.http.get<any>('disk/admin/statistics');
    }

    public driveList(): Observable<IFileItem[]> {
        return this.http.get<IData<IFileItem>>('disk/admin/explorer/drive').pipe(map(res => res.data.map(i => {
            i.isFolder = true;
            return i;
        })));
    }

    public searchFile(params: IFileQueries): Observable<IPage<IFileItem> | IData<IFileItem>> {
        return this.http.get<IData<IFileItem>>('disk/admin/explorer', {params: params as any});
    }

    public storageSearch(params: any) {
        return this.http.get<IPage<IStorageFile>>('disk/admin/explorer/storage', {
            params,
        });
    }

    public storageRemove(id: any) {
        return this.http.delete<IDataOne<boolean>>('disk/admin/explorer/storage_delete', {
            params: {id},
        });
    }

    public storageReload(tag: number) {
        return this.http.post<IDataOne<boolean>>('disk/admin/explorer/storage_reload', {tag});
    }

    public storageSync(id: any) {
        return this.http.post<IDataOne<boolean>>('disk/admin/explorer/storage_sync', {id});
    }
}
