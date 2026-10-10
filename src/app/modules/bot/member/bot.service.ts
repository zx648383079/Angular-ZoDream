import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { IData, IDataOne, IPage } from '../../../theme/models/page';
import { IItem } from '../../../theme/models/seo';
import { IBotAccount, IBotUser, IBotMedia, IBotMenuItem, IBotQr, IBotReply, IBotReplyTemplate, IBotTemplate, IBotTemplateCategory, IBotUserGroup, MediaTypeItems, IBotReplyTemplateField } from '../model';
import { Router } from '@angular/router';
import { NetSource } from '../../../components/form';
import { mapFormat, parseNumber } from '../../../theme/utils';

export interface IEditorFormatted {
    type: number;
    text: string;
    media: number;
    template_id: string;
    template_url: string;
    parameters: IBotReplyTemplateField[];
    parameter: string;
    url: string;
    appid: string;
    path: string;
    scene: string;
}


@Injectable({
    providedIn: 'root'
})
export class BotService {
    private readonly http = inject(HttpClient);
    private readonly router = inject(Router);


    public baseId = 0;

    /**
     * 是否能跳转到路径
     * @param uri 当前的网址
     * @param roles 需要的权限
     * @returns 
     */
    public canActivate(uri: string) {
        if (this.baseId > 0) {
            return true;
        }
        this.router.navigate(['/frontend/bot/account'], {
            queryParams: { redirect_uri: uri }
        });
        return false;
    }

    public groupSource() {
        return NetSource.createSearchArray(this.http, 'bot/member/user/group_search?bot_id=' + this.baseId);
    }

    public userSource() {
        return NetSource.createSearchArray(this.http, 'bot/member/user/search?bot_id=' + this.baseId, 'keywords', i => i.note_name || i.nickname);
    }

    public mediaSource(isOnlyNews = false) {
        if (isOnlyNews) {
            return NetSource.createSearchArray(this.http, 'bot/member/media/search?type=news&bot_id=' + this.baseId, 'title', 'id', 'title');
        }
        return NetSource.createSearchArray(this.http, 'bot/member/media/search?bot_id=' + this.baseId, 'title', i => {
            const tag = mapFormat(i.type, MediaTypeItems);
            return {
                name: `[${tag}]${i.title}`,
                value: i.id
            }
        });
    };

    public accountList(params: any) {
        return this.http.get<IPage<IBotAccount>>('bot/member/account', {params});
    }

    public account(id: any) {
        return this.http.get<IBotAccount>('bot/member/account/detail', {params: {id}});
    }

    public accountSave(data: any) {
        return this.http.post<IBotAccount>('bot/member/account/save', data);
    }

    public accountRemove(id: any) {
        return this.http.delete<IDataOne<boolean>>('bot/member/account/delete', {params: {id, bot_id: this.baseId}});
    }

    public mediaList(params: any) {
        return this.http.get<IPage<IBotMedia>>('bot/member/media', {params: {...params, bot_id: this.baseId}});
    }

    public media(id: any) {
        return this.http.get<IBotMedia>('bot/member/media/detail', {params: {id, bot_id: this.baseId}});
    }

    public mediaSave(data: any) {
        return this.http.post<IBotMedia>('bot/member/media/save', data, {
            params: {bot_id: this.baseId}
        });
    }

    public mediaPull(data?: any) {
        return this.http.post<IDataOne<boolean>>('bot/member/media/pull', data, {
            params: {bot_id: this.baseId}
        });
    }

    public mediaRemove(id: any) {
        return this.http.delete<IDataOne<boolean>>('bot/member/media/delete', {params: {id, bot_id: this.baseId}});
    }

    public mediaAsync(id: any) {
        return this.http.post<IDataOne<boolean>>('bot/member/media/async', {id}, {
            params: {bot_id: this.baseId}
        });
    }

    public menuList(params: any) {
        return this.http.get<IData<IBotMenuItem>>('bot/member/menu', {params: {...params, bot_id: this.baseId}});
    }

    public menuSave(data: any) {
        return this.http.post<IBotMenuItem>('bot/member/menu/save', data, {
            params: {bot_id: this.baseId}
        });
    }

    public menuBatchSave(data: IBotMenuItem[]) {
        return this.http.post<IData<IBotMenuItem>>('bot/member/menu/batch_save', {data}, {
            params: {bot_id: this.baseId}
        });
    }

    public menuAsync() {
        return this.http.post<IDataOne<boolean>>('bot/member/menu/apply', {}, {
            params: {bot_id: this.baseId}
        });
    }

    public menuRemove(id: any) {
        return this.http.delete<IDataOne<boolean>>('bot/member/menu/delete', {params: {id, bot_id: this.baseId}});
    }

    public templateList(params: any) {
        return this.http.get<IPage<IBotTemplate>>('bot/member/template', {params});
    }

    public replyList(params: any) {
        return this.http.get<IPage<IBotReply>>('bot/member/reply', {params: {...params, bot_id: this.baseId}});
    }

    public reply(id: any) {
        return this.http.get<IBotReply>('bot/member/reply/detail', {params: {id, bot_id: this.baseId}});
    }

    public replySave(data: any) {
        return this.http.post<IBotReply>('bot/member/reply/save', data, {
            params: {bot_id: this.baseId}
        });
    }

    public send(data: any) {
        return this.http.post<IDataOne<boolean>>('bot/member/reply/send', data, {
            params: {bot_id: this.baseId}
        });
    }

    public replyUpdate(id: any, data: any) {
        return this.http.post<IBotReply>('bot/member/reply/update', {id, data}, {
            params: {bot_id: this.baseId}
        });
    }

    public replyRemove(id: any) {
        return this.http.delete<IDataOne<boolean>>('bot/member/reply/delete', {params: {id, bot_id: this.baseId}});
    }

    public wxTemplateList(params: any) {
        return this.http.get<IPage<IBotReplyTemplate>>('bot/member/reply/template', {params: {...params, bot_id: this.baseId}});
    }

    public wxTemplate(id: string) {
        return this.http.get<IBotReplyTemplate>('bot/member/reply/template_detail', {params: {id, bot_id: this.baseId}});
    }

    public wxTemplateSave(data: any) {
        return this.http.post<IBotTemplate>('bot/member/reply/template_save', data);
    }

    public wxTemplateRemove(id: any) {
        return this.http.delete<IDataOne<boolean>>('bot/member/reply/template_delete', {params: {id}});
    }

    public wxTemplateAsync() {
        return this.http.post<IDataOne<boolean>>('bot/member/reply/refresh_template', {bot_id: this.baseId});
    }

    public userList(params: any) {
        return this.http.get<IPage<IBotUser>>('bot/member/user', {params: {...params, bot_id: this.baseId}});
    }

    public user(id: any) {
        return this.http.get<any>('bot/member/user/detail', {params: {id, bot_id: this.baseId}});
    }

    public userUpdate(id: any, data: any) {
        return this.http.post<IBotUser>('bot/member/user/update', {id, data}, {
            params: {bot_id: this.baseId}
        });
    }

    public userRemove(id: any) {
        return this.http.delete<IDataOne<boolean>>('bot/member/user/delete', {params: {id, bot_id: this.baseId}});
    }

    public userAsync() {
        return this.http.post<IDataOne<boolean>>('bot/member/user/refresh', {bot_id: this.baseId});
    }

    public userGroupList(params: any) {
        return this.http.get<IPage<IBotUserGroup>>('bot/member/user/group', {params: {...params, bot_id: this.baseId}});
    }

    public userGroupSave(data: any) {
        return this.http.post<IBotUserGroup>('bot/member/user/group_save', data, {
            params: {bot_id: this.baseId}
        });
    }

    public userGroupRemove(id: any) {
        return this.http.delete<IDataOne<boolean>>('bot/member/user/group_delete', {params: {id, bot_id: this.baseId}});
    }

    public logList(params: any) {
        return this.http.get<IPage<any>>('bot/member/log', {params: {...params, bot_id: this.baseId}});
    }

    public logRemove(id: any) {
        return this.http.delete<IDataOne<boolean>>('bot/member/log/delete', {params: {id, bot_id: this.baseId}});
    }

    public qrcodeList(params: any) {
        return this.http.get<IPage<IBotQr>>('bot/member/qrcode', {params: {...params, bot_id: this.baseId}});
    }

    public qrcode(id: any) {
        return this.http.get<IBotQr>('bot/member/qrcode/detail', {params: {id, bot_id: this.baseId}});
    }

    public qrcodeSave(data: any) {
        return this.http.post<IBotQr>('bot/member/qrcode/save', data, {
            params: {bot_id: this.baseId}
        });
    }

    public qrcodeRemove(id: any) {
        return this.http.delete<IDataOne<boolean>>('bot/member/qrcode/delete', {params: {id, bot_id: this.baseId}});
    }

    public statistics() {
        return this.http.get<any>('bot/member/statistics');
    }

    public batch(data: {
        template_type?: any;
        template_category?: any;
        scenes?: any;
    }) {
        return this.http.post<{
            template_type: IItem[];
            template_category: IBotTemplateCategory[];
            scenes: IItem[];
        }>('bot/member/batch', data);
    }


    public formatTemplateField(content: string): IBotReplyTemplateField[] {
        const reg = /\{\{([^\{]+)\.DATA\}\}/g;
        const items: IBotReplyTemplateField[] = [];
        let res;
        while (res = reg.exec(content)) {
            items.push({
                name: res[1]
            } as any);
        }
        return items;
    }

    public renderTemplateField(content: string, items: IBotReplyTemplateField[]): string {
        return content.replace(/\{\{([^\{]+)\.DATA\}\}/g, (_, match) => {
            for (const item of items) {
                if (item.name === match) {
                    return typeof item.value === 'undefined' ? '' : item.value;
                }
            }
            return '';
        });
    }

    public parseEditor(value?: any): IEditorFormatted {
        const data: IEditorFormatted = {
            type: parseNumber(value?.type),
            text: '',
            media: 0,
            template_id: '',
            template_url: '',
            parameters: [],
            parameter: '',
            url: '',
            appid: '',
            path: '',
            scene: '',
        };
        if (!value) {
            return data;
        }
        const getVal = (key: string) => {
            if (typeof value.content === 'string') {
                value.content = JSON.parse(value.content);
            }
            if (!value.content) {
                return '';
            }
            return value.content[key] || '';
        };
        switch (data.type) {
            case 0:
                data.text = value.content;
                break;
            case 1:
            case 2:
                data.media = value.content;
                break;
            case 3:
                data.template_id = getVal('template_id');
                data.template_url = getVal('template_url');
                data.appid = getVal('appid');
                data.path = getVal('path');
                let p = getVal('template_data');
                if (typeof p === 'string') {
                    if (p.indexOf('{') < 0) {
                        p = p.split('\n').map(i => {
                            let [name, value] = i.split('=');
                            return {name, value}
                        });
                    } else {
                        p = JSON.parse(p);
                    }
                }
                data.parameters = p;
                break;
            case 4:
                data.parameter = value.content;
                break;
            case 5:
                data.url = value.content;
                break;
            case 6:
                data.appid = getVal('appid');
                data.path = getVal('path');
                data.url = getVal('url');
                break;
            case 7:
                data.scene = value.content;
                break;
            default:
                break;
        }
        return data;
    }

    public renderEditor(data: IEditorFormatted): any {
        const res: any = {
            type: data.type,
        };
        switch (data.type) {
            case 0:
                res.content = data.text;
                break;
            case 1:
            case 2:
            res.content = data.media;
                break;
            case 3:
                res.content = {
                    template_id: data.template_id,
                    template_url: data.template_url,
                    appid: data.appid,
                    path: data.path,
                    template_data: data.parameters
                };
                break;
            case 4:
                res.content = data.parameter;
                break;
            case 5:
                res.content = data.url;
                break;
            case 6:
                res.content = {
                    appid: data.appid,
                    path: data.path,
                    url: data.url
                };
                break;
            case 7:
                res.content = data.scene;
                break;
            default:
                break;
        }
        return res;
    }
}
