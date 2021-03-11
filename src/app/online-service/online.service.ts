import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IData, IPage } from '../theme/models/page';
import { IMessage } from './model';

@Injectable({
  providedIn: 'root'
})
export class OnlineService {

    constructor(
        private http: HttpClient
    ) { }

    public getList(params: any) {
        return this.http.get<IPage<IMessage>>('os/home/index', {params});
    }

    public send(data: any) {
        return this.http.post<IData<IMessage>>('os/home/send', data);
    }
}
