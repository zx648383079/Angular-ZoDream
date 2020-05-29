import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { IUserGroup, IMessage } from '../theme/models/chat';
import { mockGroups, mockMessages } from '../theme/mock/chat';
import { IPage } from '../theme/models/page';
import { mockPage } from '../theme/mock/page';

@Injectable()
export class ChatService {

    constructor() { }

    public getFriends(): Observable<IUserGroup[]> {
        return of(mockGroups);
    }

    public getMessages(id: number): Observable<IPage<IMessage>> {
        return of(mockPage(mockMessages));
    }
}
