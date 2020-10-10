import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { IDataOne, IPage } from '../../theme/models/page';
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

    public friendLinkOff(id: any) {
        return this.http.delete<IDataOne<true>>('auth/admin/friend_link/remove', {
          params: {id}
        });
    }

    public friendLinkRemove(id: any) {
        return this.http.delete<IDataOne<true>>('auth/admin/friend_link/delete', {
          params: {id}
        });
    }

    public friendLinkVerify(id: any) {
        return this.http.delete<IFriendLink>('auth/admin/friend_link/verify', {
          params: {id}
        });
    }

    public feedbackList(params: any) {
        return this.http.get<IPage<IFeedback>>('contact/admin/feedback', {
            params
        });
    }

    public feedback(id: any) {
        return this.http.get < IFeedback > ('contact/admin/feedback/detail', {
            params: {
                id
            },
        });
    }

    public feedbackSave(data: any) {
        return this.http.post < IFeedback > ('contact/admin/feedback/change', data);
    }

    public feedbackRemove(id: any) {
        return this.http.delete < IDataOne < true >> ('contact/admin/feedback/delete', {
            params: {
                id
            }
        });
    }

    public subscribeList(params: any) {
        return this.http.get<IPage<ISubscribe>>('contact/admin/subscribe', {
            params
        });
    }

}
