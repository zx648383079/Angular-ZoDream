import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpRequest, IRequest } from './http';

@Injectable()
export class ChatService {

    public request: IRequest;

    constructor(
        private http: HttpClient
    ) {
        this.request = new HttpRequest(this.http);
    }
}
