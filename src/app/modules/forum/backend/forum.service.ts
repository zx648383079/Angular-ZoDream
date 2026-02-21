import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { IForum, IThread, IThreadPost } from '../model';
import { IData, IDataOne, IPage } from '../../../theme/models/page';
import { IUser, IUserZone } from '../../../theme/models/user';

@Injectable()
export class ForumService {
    private readonly http = inject(HttpClient);


    public userList(params: any) {
        return this.http.get<IPage<IUser>>('auth/admin/user/search', {
            params,
        });
    }

    public forumList(params: any) {
        return this.http.get<IPage<IForum>>('forum/admin/forum', {params});
    }

    public forum(id: any) {
        return this.http.get<IForum>('forum/admin/forum/detail', {params: {id}});
    }

    public forumSave(data: any) {
        return this.http.post<IForum>('forum/admin/forum/save', data);
    }

    public forumRemove(id: any) {
        return this.http.delete<IDataOne<boolean>>('forum/admin/forum/delete', {params: {id}});
    }

    public threadList(params: any) {
        return this.http.get<IPage<IThread>>('forum/admin/thread', {params});
    }

    public thread(id: any) {
        return this.http.get<IThread>('forum/admin/thread/detail', {params: {id}});
    }

    public threadSave(data: any) {
        return this.http.post<IThread>('forum/admin/thread/save', data);
    }

    public threadChange(data: any) {
        return this.http.post<IThread>('forum/admin/thread/change', data);
    }

    public threadRemove(id: any) {
        return this.http.delete<IDataOne<boolean>>('forum/admin/thread/delete', {params: {'id[]': id}});
    }

    
    public postList(params: any) {
        return this.http.get<IPage<IThreadPost>>('forum/admin/thread/post', {params});
    }

    public postSave(data: any) {
        return this.http.post<IThreadPost>('forum/admin/thread/post_save', data);
    }

    public postRemove(id: any) {
        return this.http.delete<IDataOne<boolean>>('forum/admin/thread/post_delete', {params: {id}});
    }

    public batch(data: {
        forums?: any;
        zones?: any;
    }) {
        return this.http.post<{
            forums: IForum[];
            zones: IUserZone[];
        }>('forum/admin/batch', data);
    }

    public statistics() {
        return this.http.get<any>('forum/admin/statistics');
    }
}
