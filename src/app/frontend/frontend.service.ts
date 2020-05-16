import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

export interface ILink {
    name: string;
    url: string;
    description?: string;
}

@Injectable({
  providedIn: 'root'
})
export class FrontendService {

    constructor() { }

    /**
     * friendLinks
     */
    public friendLinks(): Observable<ILink[]> {
        return of<ILink[]>([
            {name: 'zodream', url: 'https://zodream.cn'},
        ]);
    }
}
