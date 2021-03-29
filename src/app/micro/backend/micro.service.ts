import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IDataOne, IPage } from '../../theme/models/page';
import { IComment, IMicro, ITopic } from '../model';

@Injectable()
export class MicroService {

    constructor(
        private http: HttpClient
    ) { }

    public postList(params: any) {
        return this.http.get<IPage<IMicro>>('micro/admin/micro', {params});
    }

    public postRemove(id: any) {
        return this.http.delete<IDataOne<true>>('micro/admin/micro/delete', {
            params: {id}
        });
    }

    public topicList(params: any) {
        return this.http.get<IPage<ITopic>>('micro/admin/topic', {params});
    }

    public topicRemove(id: any) {
        return this.http.delete<IDataOne<true>>('micro/admin/topic/delete', {
            params: {id}
        });
    }

    
    public commentList(params: any) {
        return this.http.get<IPage<IComment>>('micro/admin/comment', {params});
    }

    public commentRemove(id: any) {
        return this.http.delete<IDataOne<true>>('micro/admin/comment/delete', {
            params: {id}
        });
    }
}
