import { Injectable, inject } from '@angular/core';
import { IDataOne, IPage } from '../../theme/models/page';
import { IComment, IMicro, ITopic } from './model';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable()
export class MicroService {
    private readonly http = inject(HttpClient);


    public getList(params: any) {
        return this.http.get<IPage<IMicro>>('micro', {
            params
        });
    }

    public get(id: any) {
        return this.http.get<IMicro>('micro/home/detail', {
            params: {id}
        });
    }

    public create(data: any) {
        return this.http.post<IMicro>('micro/publish/create', data);
    }

    public collect(id: any) {
        return this.http.post<IMicro>('micro/home/collect', {id});
    }

    public recommend(id: any) {
        return this.http.post<IMicro>('micro/home/recommend', {id});
    }

    public remove(id: any) {
        return this.http.delete<IDataOne<boolean>>('micro/publish/delete', {
            params: {id}
        });
    }

    public forward(data: any) {
        return this.http.post<IMicro>('micro/home/forward', data);
    }

    public shareCheck(data: any) {
        return this.http.post<IDataOne<boolean>>('micro/share', data);
    }

    public shareSave(data: any) {
        return this.http.post<IMicro>('micro/share/save', data);
    }

    public commentList(params: any) {
        return this.http.get<IPage<IComment>>('micro/comment', {
            params
        });
    }

    public comment(id: any) {
        return this.http.get<IComment>('micro/comment/detail', {
            params: {id}
        });
    }

    public commentSave(data: any) {
        return this.http.post<IComment>('micro/comment/save', data);
    }

    public commentRemove(id: any) {
        return this.http.delete<IDataOne<boolean>>('micro/comment/delete', {
            params: {id}
        });
    }

    public commentAgree(id: any) {
        return this.http.post<IComment>('micro/comment/agree', {id});
    }

    public commentDisagree(id: any) {
        return this.http.post<IComment>('micro/comment/disagree', {id});
    }

    public topicList(params: any) {
        return this.http.get<IPage<ITopic>>('micro/topic', {params});
    }

    public topic(id: any) {
        return this.http.get<ITopic>('micro/topic/detail', {params: {id}});
    }

    public user(id: any) {
        return this.http.get<any>('micro/user', {params: {id}});
    }

    public toggleFollow(id: any) {
        return this.http.post<IDataOne<number>>('auth/space/follow', {user: id});
    }

    public suggestion(params: any) {
        return this.http.get<IPage<ITopic>>('micro/home/suggest', {params}).pipe(map(res => res.data));
    }
}
