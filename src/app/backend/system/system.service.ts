import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { IData, IDataOne } from '../../theme/models/page';
import { IItem, IOption } from '../../theme/models/seo';
import { map } from 'rxjs/operators';

@Injectable()
export class SystemService {

    constructor(
        private http: HttpClient
    ) { }

    public cacheStore() {
        return this.http.get<IData<IItem>>('seo/cache').pipe(map(res => res.data));
    }

    public cacheClear(data: any) {
        return this.http.post<IDataOne<true>>('seo/cache/clear', data);
    }

    public optionList() {
        return this.http.get<IData<IOption>>('seo/setting');
    }

    public optionSave(data: any) {
        return this.http.post<IDataOne<true>>('seo/setting/save', data);
    }

    public optionSaveField(data: any) {
        return this.http.post<IOption>('seo/setting/save_option', data);
    }

    public optionRemove(id: any) {
        return this.http.delete<IDataOne<true>>('seo/setting/delete', {
            params: {id}
        });
    }

    public sitemap() {
        return this.http.post<IData<any>>('seo/sitemap', {});
    }

    public sqlList() {
        return this.http.get<IData<any>>('seo/sql');
    }

    public sqlBackup() {
        return this.http.post<IDataOne<true>>('seo/sql/back_up', {});
    }

    public sqlClear() {
        return this.http.delete<IDataOne<true>>('seo/sql/clear');
    }

}
