import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IAgreement, ILink } from '../theme/models/seo';
import { HttpClient } from '@angular/common/http';
import { IData, IDataOne } from '../theme/models/page';
import { map } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class FrontendService {

    private link$: Observable<ILink[]>;

    constructor(
      private http: HttpClient
    ) {
    }

    /**
     * friendLinks
     */
    public friendLinks(): Observable<ILink[]> {
        if (this.link$) {
            return this.link$;
        }
        return this.link$ = this.http.get<IData<ILink>>('contact/friend_link').pipe(map(res => {
            return res.data;
        }));
    }

    public linkApply(data: any) {
        return this.http.post<IDataOne<Boolean>>('contact/friend_link/apply', data);
    }

    public agreement(name: string) {
        return this.http.get<IAgreement>('seo/agreement', {params: {name}});
    }

    public feedback(data: any) {
        return this.http.post<IDataOne<Boolean>>('contact/home/feedback', data);
    }

}
