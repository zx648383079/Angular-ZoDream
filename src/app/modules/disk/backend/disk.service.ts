import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IPage } from '../../../theme/models/page';
import { IDiskServer, IDiskServerFile } from '../model';

@Injectable({
  providedIn: 'root'
})
export class DiskService {

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

    public statistics() {
        return this.http.get<any>('disk/admin/statistics');
    }
}
