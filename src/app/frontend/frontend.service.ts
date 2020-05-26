import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ILink } from '../theme/models/seo';
import { mockLinks } from '../theme/mock/seo';

@Injectable({
  providedIn: 'root'
})
export class FrontendService {

    constructor() { }

    /**
     * friendLinks
     */
    public friendLinks(): Observable<ILink[]> {
        return of(mockLinks);
    }
}
