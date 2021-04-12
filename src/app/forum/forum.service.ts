import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { IForum, IThread, IThreadPost } from './model';
import { IData, IDataOne, IPage } from '../theme/models/page';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable()
export class ForumService {

    constructor(private http: HttpClient) { }

    public getForumList(): Observable<IForum[]> {
        return this.http.get<IData<IForum>>('forum').pipe(map(res => res.data));
    }

    public getForum(id: any, full: any = true): Observable<IForum> {
        return this.http.get<IForum>('forum/home/detail', {
            params: {id, full}
        });
    }

    public getThreadList(params: any): Observable<IPage<IThread>> {
        return this.http.get<IPage<IThread>>('forum/thread', {
            params
        });
    }

    public getThread(id: any): Observable<IThread> {
        return this.http.get<IThread>('forum/thread/detail', {
            params: {id}
        });
    }

    public getPostList(params: any): Observable<IPage<IThreadPost>> {
        return this.http.get<IPage<IThreadPost>>('forum/thread/post', {
            params
        });
    }

    public threadEdit(id: any) {
        return this.http.get<IThread>('forum/thread/edit', {params: {id}});
    }

    public threadSave(data: any) {
        return this.http.post<IThread>(data.id && data.id > 0 ? 'forum/thread/update' : 'forum/thread/create', data);
    }

    public postCreate(data: any) {
        return this.http.post<IThread>('forum/thread/reply', data);
    }

    public threadDigest(id: number) {
        return this.http.post<IThread>('forum/thread/digest', {id});
    }

    public threadHighlight(id: number) {
        return this.http.post<IThread>('forum/thread/highlight', {id});
    }

    public threadAction(id: number, action: any) {
        return this.http.post<IThread>('forum/thread/action', {id, action});
    }

    public threadClose(id: number) {
        return this.http.post<IThread>('forum/thread/close', {id});
    }

    public postRemove(id: any) {
        return this.http.delete<IDataOne<boolean>>('forum/thread/remove_post', {params: {id}});
    }

    public postDo(data: any) {
        return this.http.post<IDataOne<{
            id: number;
            content: any
        }>>('forum/thread/do', data);
    }
}
