import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IDataOne, IPage } from '../../theme/models/page';
import { IBotAccount } from './model';

@Injectable()
export class BotService {

    constructor(private http: HttpClient) { }

    public getList(params: any) {
        return this.http.get<IPage<IBotAccount>>('bot/home/index', {params});
    }

    public get(id: any) {
        return this.http.get<IBotAccount>('bot/emulate', {params: {id}});
    }

    public reply(data: any) {
        return this.http.post<IDataOne<any|any[]>>('bot/emulate/reply', data);
    }

    public media(data: any) {
        return this.http.get<any>('bot/emulate/media', {params: data});
    }
}
