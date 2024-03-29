import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { IDataOne, IPage } from '../../theme/models/page';
import { IFriendLink, IFeedback, ISubscribe, IReport } from '../../theme/models/seo';

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

    public friendLinkToggle(data: {
        id: number;
        remark?: string;
    }) {
        return this.http.post<IFriendLink>('contact/admin/friend_link/toggle', data);
    }

    public friendLinkSave(data: any) {
        return this.http.post<IFriendLink>('contact/admin/friend_link/save', data);
    }

    public friendLinkRemove(id: any) {
        return this.http.delete<IDataOne<true>>('contact/admin/friend_link/delete', {
          params: {'id[]': id}
        });
    }

    public feedbackList(params: any) {
        return this.http.get<IPage<IFeedback>>('contact/admin/feedback', {
            params
        });
    }

    public feedback(id: any) {
        return this.http.get<IFeedback>('contact/admin/feedback/detail', {
            params: {
                id
            },
        });
    }

    public feedbackChange(id: any, data: any) {
        return this.http.post<IFeedback>('contact/admin/feedback/change', {
            id, data
        });
    }

    public feedbackRemove(id: any) {
        return this.http.delete<IDataOne<true>>('contact/admin/feedback/delete', {
            params: {'id[]': id}
        });
    }


    public reportList(params: any) {
        return this.http.get<IPage<IReport>>('contact/admin/report', {
            params
        });
    }

    public report(id: any) {
        return this.http.get<IReport> ('contact/admin/report/detail', {
            params: {
                id
            },
        });
    }

    public reportSave(data: any) {
        return this.http.post<IReport>('contact/admin/report/change', data);
    }

    public reportRemove(id: any) {
        return this.http.delete<IDataOne<true>>('contact/admin/report/delete', {
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

    public subscribeToggle(data: any) {
        return this.http.post<IDataOne<true>>('contact/admin/subscribe/change', data);
    }

    public subscribeRemove(id: any) {
        return this.http.delete<IDataOne<true>>('contact/admin/subscribe/delete', {
            params: {'id[]': id}
        });
    }

}
