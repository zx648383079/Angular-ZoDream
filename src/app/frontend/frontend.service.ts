import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ILink } from '../theme/models/seo';
import { HttpClient } from '@angular/common/http';
import { IData, IDataOne } from '../theme/models/page';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class FrontendService {

    constructor(
      private http: HttpClient
    ) {
    }

    /**
     * friendLinks
     */
    public friendLinks(): Observable<ILink[]> {
        return this.http.get<IData<ILink>>('contact/friend_link').pipe(map(res => res.data));
    }

    public linkApply(data: any) {
        return this.http.post<IDataOne<Boolean>>('contact/friend_link/apply', data);
    }
}
