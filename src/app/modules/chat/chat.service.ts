import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpRequest, IRequest } from './http';
import { WsRequest } from './ws';
import { environment } from '../../../environments/environment';
import { getCurrentTime, uriEncode } from '../../theme/utils';
import { Md5 } from 'ts-md5';

@Injectable()
export class ChatService {

    public request: IRequest;

    constructor(
        private http: HttpClient,
    ) {
        // this.initHttp();
        this.initWs();
    }

    private initHttp() {
        this.request = new HttpRequest(this.http);
    }

    private initWs() {
        const timestamp = getCurrentTime();
        const sign = Md5.hashStr(environment.appid + timestamp + environment.secret);
        this.request = new WsRequest(uriEncode(environment.apiEndpoint.replace(/^.+?:\/\//, 'ws://') + 'chat/ws', {
            appid: environment.appid,
            timestamp,
            sign
        }))
    }
}
