import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { IDataOne, IPage } from '../../../theme/models/page';
import { INote } from '../model';

@Injectable({
  providedIn: 'root'
})
export class NoteService {
    private readonly http = inject(HttpClient);


    public noteList(params: any) {
        return this.http.get<IPage<INote>>('note/admin', {params});
    }

    public noteChange(id: any, data: any) {
        return this.http.post<INote>('note/admin/home/change', {id, data});
    }

    public noteSave(data: any) {
        return this.http.post<INote>('note/admin/home/save', data);
    }

    public noteRemove(id: any) {
        return this.http.delete<IDataOne<true>>('note/admin/home/delete', {
            params: {'id[]': id}
        });
    }

    public statistics() {
        return this.http.get<any>('note/admin/statistics');
    }
}
