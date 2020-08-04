import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { IPage } from '../../theme/models/page';
import { IFriendLink, IFeedback, ISubscribe } from '../../theme/models/seo';

@Injectable()
export class ContactService {

    constructor(
        private http: HttpClient
    ) { }

    public friendLinkList(params: any) {
        return this.http.get<IPage<IFriendLink>>('contact/admin/friend_link', {
            params
        });
    }

    public feedbackList(params: any) {
        return this.http.get<IPage<IFeedback>>('contact/admin/feedback', {
            params
        });
    }

    public subscribeList(params: any) {
        return this.http.get<IPage<ISubscribe>>('contact/admin/subscribe', {
            params
        });
    }

}
