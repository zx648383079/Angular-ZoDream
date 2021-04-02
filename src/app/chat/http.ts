import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { eachObject } from '../theme/utils';

export const COMMAND_PROFILE = 'chat/user';
export const COMMAND_HISTORY = 'chat/chat';
export const COMMAND_FRIENDS = 'chat/friend';
export const COMMAND_FRIEND_SEARCH = 'chat/friend/search';
export const COMMAND_FRIEND_APPLY = 'chat/friend/apply';
export const COMMAND_GROUPS = 'chat/group';
export const COMMAND_MESSAGE = 'chat/message';
export const COMMAND_MESSAGE_SEND = 'chat/message/send';
export const COMMAND_MESSAGE_SEND_TEXT = 'chat/message/send_text';
export const COMMAND_MESSAGE_SEND_IMAGE = 'chat/message/send_image';
export const COMMAND_MESSAGE_SEND_VIDEO = 'chat/message/send_video';
export const COMMAND_MESSAGE_SEND_AUDIO = 'chat/message/send_audio';
export const COMMAND_MESSAGE_SEND_FILE = 'chat/message/send_file';

export type RequestCallback = (data?: any) => void;

export interface IRequest {
    open(): IRequest;
    emit(event: string, data?: any): IRequest;
    emitBatch(data: {
        [key: string]: any
    }): IRequest;
    trigger(event: string, data?: any): void;
    on(event: string|string[], cb: RequestCallback): IRequest;
    close(): void;
}

export class HttpRequest implements IRequest {
    constructor(
        private http: HttpClient
    ) {
    }

    private listeners: {
        [key: string]: RequestCallback[]
    } = {};

    public open(): IRequest {
        return this;
    }
    public emit(event: string, data?: any): IRequest {
        let request: Observable<any>;
        if ([COMMAND_PROFILE].indexOf(event) >= 0) {
           request = this.http.get(event, {
               params: data
           });
        } else if ([].indexOf(event) >= 0) {
            request = this.http.delete(event, {
                params: data
            });
        } else {
            request = this.http.post(event, data);
        }
        request.subscribe(res => {
            this.trigger(event, res);
        });
        return this;
    }

    public emitBatch(data: {
        [key: string]: any
    }): IRequest {
        this.http.post('chat/batch', data).subscribe(res => {
            eachObject(res, (item, key: string) => {
                if (key.indexOf('chat/') < 0) {
                    return;
                }
                this.trigger(key, item);
            });
        });
        return this;
    }

    public trigger(event: string, data?: any): void {
        if (!Object.prototype.hasOwnProperty.call(this.listeners, event)) {
            return;
        }
        this.listeners[event].map(cb => {
            cb(data);
        });
    }

    public on(event: string|string[], cb: RequestCallback): IRequest {
        eachObject(event, item => {
            if (!event) {
                return;
            }
            if (!Object.prototype.hasOwnProperty.call(this.listeners, item)) {
                this.listeners[item] = [];
            }
            this.listeners[item].push(cb);
        });
        return this;
    }
    public close(): void {
    }
}
