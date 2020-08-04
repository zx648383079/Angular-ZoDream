import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { IData } from '../../theme/models/page';
import { IItem } from '../../theme/models/seo';
import { map } from 'rxjs/operators';

@Injectable()
export class SystemService {

    constructor(
        private http: HttpClient
    ) { }

    public cacheStore() {
        return this.http.get<IData<IItem>>('seo/cache').pipe(map(res => res.data));
    }

}
