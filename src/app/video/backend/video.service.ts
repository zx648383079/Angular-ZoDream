import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IDataOne, IPage } from '../../theme/models/page';
import { IComment, IMusic, IVideo } from '../model';

@Injectable({
  providedIn: 'root'
})
export class VideoService {

    constructor(
        private http: HttpClient
    ) { }

    public videoList(params: any) {
        return this.http.get<IPage<IVideo>>('video/admin/video', {params});
    }

    public video(id: any) {
        return this.http.get<IVideo>('video/admin/video/detail', {params: {id}});
    }

    public videoSave(data: any) {
        return this.http.post<IVideo>('video/admin/video/save', data);
    }

    public videoRemove(id: any) {
        return this.http.delete<IDataOne<boolean>>('video/admin/video/delete', {params: {id}});
    }

    public musicList(params: any) {
        return this.http.get<IPage<IMusic>>('video/admin/music', {params});
    }

    public music(id: any) {
        return this.http.get<IMusic>('video/admin/music/detail', {params: {id}});
    }

    public musicSave(data: any) {
        return this.http.post<IMusic>('video/admin/music/save', data);
    }

    public musicRemove(id: any) {
        return this.http.delete<IDataOne<boolean>>('video/admin/music/delete', {params: {id}});
    }

    public commentList(params: any) {
        return this.http.get<IPage<IComment>>('video/admin/comment', {params});
    }

    public comment(id: any) {
        return this.http.get<IComment>('video/admin/comment/detail', {params: {id}});
    }

    public commentSave(data: any) {
        return this.http.post<IComment>('video/admin/comment/save', data);
    }

    public commentRemove(id: any) {
        return this.http.delete<IDataOne<boolean>>('video/admin/comment/delete', {params: {id}});
    }
}
