import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { COMMAND_FRIENDS, COMMAND_GROUPS, COMMAND_HISTORY, COMMAND_PROFILE, HttpRequest, IRequest } from './http';
import { WsRequest } from './ws';
import { environment } from '../../../environments/environment';
import { getCurrentTime, uriEncode } from '../../theme/utils';
import { Md5 } from 'ts-md5';
import { IUser } from '../../theme/models/user';
import { IData, IDataOne, IPage } from '../../theme/models/page';
import { IApplyLog, IChatHistory, IChatWith, IFriend, IFriendGroup, IGroup, IMessage } from './model';

@Injectable()
export class ChatService {
    private readonly http = inject(HttpClient);


    public profile() {
        return this.http.get<IFriend>(COMMAND_PROFILE);
    }

    public histories() {
        return this.http.get<IPage<IChatHistory>>(COMMAND_HISTORY);
    }

    public friends() {
        return this.http.get<IData<IFriendGroup>>(COMMAND_FRIENDS);
    }

    public groups() {
        return this.http.get<IData<IGroup>>(COMMAND_GROUPS);
    }

    public search(params: any) {
        return this.http.get<IPage<IUser>>('chat/friend/search', {params});
    }

    public friendMove(data: {
        user: number;
        group: number;
    }) {
        return this.http.post<IDataOne<boolean>>('chat/friend/move', data);
    }

    public applies(params: any) {
        return this.http.get<IPage<IApplyLog>>('chat/friend/apply_log', {params});
    }

    public apply(data: any) {
        return this.http.post<IDataOne<boolean>>('chat/friend/apply', data);
    }

    public applyAccept(data: any) {
        return this.http.post<IDataOne<boolean>>('chat/friend/agree', data);
    }



    public messages(user: IChatWith, start_time?: number) {
        return this.http.get<{
            next_time: number;
            data: IMessage[];
        }>('chat/message', {params: {
            type: user.type,
            id: user.id,
            start_time
        }});
    }

    public sendText(user: IChatWith, content: string) {
        return this.http.post<IDataOne<IMessage>>('chat/message/send_text', {
            type: user.type,
            id: user.id,
            content
        });
    }

    public sendImage(user: IChatWith, files: FileList) {
        return this.sendFiles('chat/message/send_image', user.id, files, user.type);
    }

    public sendAudio(user: IChatWith, files: FileList) {
        return this.sendFiles('chat/message/send_audio', user.id, files, user.type);
    }
    public sendVideo(user: IChatWith, files: FileList) {
        return this.sendFiles('chat/message/send_video', user.id, files, user.type);
    }
    public sendFile(user: IChatWith, files: FileList) {
        return this.sendFiles('chat/message/send_file', user.id, files, user.type);
    }

    public sendVoice(user: IChatWith, form: FormData) {
        form.append('id', user.id as any);
        if (user.type) {
            form.append('type', user.type as any);
        }
        return this.http.post<IDataOne<IMessage|IMessage[]>>('chat/message/send_audio', form);
    }

    private sendFiles(uri: string, id: any, files: FileList, type?: number) {
        const form = new FormData();
        form.append('id', id);
        if (type) {
            form.append('type', type.toString());
        }
        for (let i = 0; i < files.length; i++) {
            form.append('file', files[i], files[i].name);
        }
        return this.http.post<IDataOne<IMessage>>(uri, form);
    }

    public revoke(id: any) {
        return this.http.delete<IDataOne<boolean>>('chat/message/revoke', {params: {id}});
    }

    public batch(data: {
        [COMMAND_HISTORY]?: any;
        [COMMAND_PROFILE]?: any;
        [COMMAND_FRIENDS]?: any;
        [COMMAND_GROUPS]?: any;
    }) {
        return this.http.post<{
            [COMMAND_HISTORY]?: IPage<IChatHistory>;
            [COMMAND_PROFILE]?: IFriend;
            [COMMAND_FRIENDS]?: IData<IFriendGroup>;
            [COMMAND_GROUPS]?: IData<IGroup>;
        }>('chat/batch', data);
    }

    public createRequest(): IRequest {
        return this.initHttp();
        // return this.initWs();
    }

    private initHttp(): IRequest {
        return new HttpRequest(this.http);
    }

    private initWs(): IRequest {
        const timestamp = getCurrentTime();
        const sign = Md5.hashStr(environment.appid + timestamp + environment.secret);
        return new WsRequest(uriEncode(environment.apiEndpoint.replace(/^.+?:\/\//, 'ws://') + 'chat/ws', {
            appid: environment.appid,
            timestamp,
            sign
        }))
    }
}
