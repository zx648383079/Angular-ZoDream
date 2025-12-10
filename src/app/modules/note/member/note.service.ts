import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { IDataOne, IPage } from '../../../theme/models/page';
import { INote } from '../model';

@Injectable({
  providedIn: 'root'
})
export class NoteService {
    private http = inject(HttpClient);


    public noteList(params: any) {
        return this.http.get<IPage<INote>>('note/home', {params});
    }

    
    public noteSave(data: any) {
        return this.http.post<INote>('note/home/save', data);
    }

    public noteRemove(id: any) {
        return this.http.delete<IDataOne<true>>('note/home/delete', {
            params: {id}
        });
    }
}
