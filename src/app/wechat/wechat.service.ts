import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IPage } from '../theme/models/page';
import { IWeChatAccount } from './model';

@Injectable()
export class WechatService {

    constructor(private http: HttpClient) { }

    public getList(params: any) {
        return this.http.get<IPage<IWeChatAccount>>('wx/home/index', {params});
    }

    public get(id: any) {
        return this.http.get<IWeChatAccount>('wx/emulate', {params: {id}});
    }

    public reply(data: any) {
        return this.http.post<any>('wx/emulate/reply', data);
    }

    public media(id: any) {
        return this.http.get<any>('wx/emulate/media', {params: {id}});
    }
}
