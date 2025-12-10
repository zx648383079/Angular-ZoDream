import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { IShortLink } from './model';

@Injectable({
    providedIn: 'root'
})
export class ShortLinkService {
    private http = inject(HttpClient);



    public generate(data: any) {
        return this.http.post<IShortLink>('short/home/save', data);
    }
}
