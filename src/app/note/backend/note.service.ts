import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IDataOne, IPage } from '../../theme/models/page';
import { INote } from '../model';

@Injectable({
  providedIn: 'root'
})
export class NoteService {

    constructor(private http: HttpClient) { }

    public noteList(params: any) {
        return this.http.get<IPage<INote>>('note/admin', {params});
    }

    public noteRemove(id: any) {
        return this.http.delete<IDataOne<true>>('note/admin/home/delete', {
            params: {id}
        });
    }

    public statistics() {
        return this.http.get<any>('note/admin/statistics');
    }
}
