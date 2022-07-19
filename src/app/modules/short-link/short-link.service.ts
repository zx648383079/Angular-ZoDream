import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IShortLink } from './model';

@Injectable({
    providedIn: 'root'
})
export class ShortLinkService {

    constructor(
        private http: HttpClient
    ) { }


    public generate(data: any) {
        return this.http.post<IShortLink>('short/home/save', data);
    }
}
