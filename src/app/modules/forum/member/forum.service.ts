import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { IThread } from '../model';
import { IDataOne, IPage } from '../../../theme/models/page';

@Injectable()
export class ForumService {
    private readonly http = inject(HttpClient);


    public threadList(params: any) {
        return this.http.get<IPage<IThread>>('forum/member/thread', {params});
    }

    
    public threadSave(data: any) {
        return this.http.post<IThread>('forum/member/thread_save', data);
    }

    public threadRemove(id: any) {
        return this.http.delete<IDataOne<true>>('forum/member/thread_delete', {
            params: {id}
        });
    }
}
