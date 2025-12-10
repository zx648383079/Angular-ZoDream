import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { IShortLink } from '../model';
import { IDataOne, IPage } from '../../../theme/models/page';

@Injectable({
    providedIn: 'root'
})
export class ShortLinkService {
    private http = inject(HttpClient);



    public linkList(params: any) {
        return this.http.get<IPage<IShortLink>>('short/home', {params});
    }

    
    public linkSave(data: any) {
        return this.http.post<IShortLink>('short/home/save', data);
    }

    public linkRemove(id: any) {
        return this.http.delete<IDataOne<true>>('short/home/delete', {
            params: {id}
        });
    }

}
