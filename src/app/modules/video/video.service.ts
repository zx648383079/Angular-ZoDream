import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IDataOne, IPage } from '../../theme/models/page';
import { IUser } from '../../theme/models/user';
import { IComment, IMusic, IVideo } from './model';

@Injectable()
export class VideoService {

    constructor(private http: HttpClient) { }

    public videoList(params: any) {
        return this.http.get<IPage<IVideo>>('video/video', {params});
    }

    public videoMore(params: any) {
        return this.http.get<IPage<IVideo>>('video/video/more', {params});
    }

    public videoUser(id: any) {
        return this.http.get<IUser>('video/video/user', {params: {id}});
    }

    public videoSave(data: any) {
        return this.http.post<IVideo>('video/video/save', data);
    }

    public videoLike(id: number) {
        return this.http.post<IVideo>('video/video/like', {id});
    }

    public videoRemove(id: any) {
        return this.http.delete<IDataOne<boolean>>('video/video/delete', {params: {id}});
    }

    public musicList(params: any) {
        return this.http.get<IPage<IMusic>>('video/music', {params});
    }

    public commentList(params: any) {
        return this.http.get<IPage<IComment>>('video/comment', {params});
    }

    public commentSave(data: any) {
        return this.http.post<IComment>('video/comment/save', data);
    }
}
