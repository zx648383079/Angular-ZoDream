import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { IForum, IThread, IThreadPost } from 'src/app/theme/models/forum';
import { mockForum, mockThread, mockThreadPost } from 'src/app/theme/mock/forum';
import { IData, IPage } from 'src/app/theme/models/page';
import { mockPage } from 'src/app/theme/mock/page';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable()
export class ForumService {

    constructor(private http: HttpClient) { }

    public getForumList(): Observable<IForum[]> {
        return this.http.get<IData<IForum>>('forum').pipe(map(res => res.data));
    }

    public getForum(id: any): Observable<IForum> {
        return this.http.get<IForum>('forum/home/detail', {
            params: {id}
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
}
