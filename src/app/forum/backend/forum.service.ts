import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IForum, IThread } from '../../theme/models/forum';
import { IData, IDataOne, IPage } from '../../theme/models/page';
import { IUser } from '../../theme/models/user';

@Injectable()
export class ForumService {

    constructor(private http: HttpClient) { }

    public userList(params: any) {
        return this.http.get<IPage<IUser>>('auth/admin/user/search', {
            params,
        });
    }

    public forumList(params: any) {
        return this.http.get<IPage<IForum>>('forum/admin/forum', {params});
    }

    public forumAll() {
        return this.http.get<IData<IForum>>('forum/admin/forum/all');
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

    public threadRemove(id: any) {
        return this.http.delete<IDataOne<boolean>>('forum/admin/thread/delete', {params: {id}});
    }
}
