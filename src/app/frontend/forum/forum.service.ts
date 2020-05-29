import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { IForum, IThread, IThreadPost } from 'src/app/theme/models/forum';
import { mockForum, mockThread, mockThreadPost } from 'src/app/theme/mock/forum';
import { IPage } from 'src/app/theme/models/page';
import { mockPage } from 'src/app/theme/mock/page';

@Injectable()
export class ForumService {

    constructor() { }

    public getForumList(): Observable<IForum[]> {
        return of(mockForum);
    }

    public getForum(id: number): Observable<IForum> {
        return of(mockForum[0]);
    }

    public getThreadList(param: any): Observable<IPage<IThread>> {
        return of(mockPage(mockThread));
    }

    public getThread(id: number): Observable<IThread> {
        return of(mockThread[0]);
    }

    public getPostList(param: any): Observable<IPage<IThreadPost>> {
        return of(mockPage(mockThreadPost));
    }
}
