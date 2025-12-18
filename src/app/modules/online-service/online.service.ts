import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { IData, IPage } from '../../theme/models/page';
import { IMessage } from './model';

@Injectable()
export class OnlineService {
    private readonly http = inject(HttpClient);


    public getList(params: any) {
        return this.http.get<IPage<IMessage>>('os/home/index', {params});
    }

    public send(data: any) {
        return this.http.post<IData<IMessage>>('os/home/send', data);
    }
}
