import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { IDataOne, IPage } from '../../theme/models/page';
import { INote } from './model';

@Injectable({
  providedIn: 'root'
})
export class NoteService {
    private http = inject(HttpClient);


    public getList(params: any) {
        return this.http.get<IPage<INote>>('note', {
            params
        });
    }

    public get(id: any) {
        return this.http.get<INote>('note/home/detail', {
            params: {id}
        });
    }

    public save(data: any) {
        return this.http.post<INote>('note/home/save', data);
    }

    public remove(id: any) {
        return this.http.delete<IDataOne<boolean>>('note/home/delete', {
            params: {id}
        });
    }
}
