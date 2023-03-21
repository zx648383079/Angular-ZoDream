import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IData, IPage } from '../../../theme/models/page';
import { ICategory } from '../model';

@Injectable({
    providedIn: 'root'
})
export class VisualService {

    constructor(
        private http: HttpClient,
    ) { }

    public getNav() {
        return this.http.get<IData<ICategory>>('tpl/category');
    }

    public category(params: any) {
        return this.http.get<ICategory>('tpl/category/detail', {
            params
        });
    }

    public search(params: any) {
        return this.http.get<IPage<any>>('tpl/search', {
            params
        });
    }
}
