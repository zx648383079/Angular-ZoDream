import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IData, IDataOne, IPage } from '../../../theme/models/page';
import { IItem } from '../../../theme/models/seo';
import { Router } from '@angular/router';
import { IBotAccount, IBotMedia, IBotMenuItem, IBotTemplate, IBotReply, IBotReplyTemplate, IBotUser, IBotUserGroup, IBotQr, IBotTemplateCategory } from '../model';

@Injectable({
    providedIn: 'root'
})
export class BotService {

    public baseId = 0;

    constructor(
        private http: HttpClient,
        private router: Router,
        ) { }

    public accountList(params: any) {
        return this.http.get<IPage<IBotAccount>>('bot/admin/account', {params});
    }

    public account(id: any) {
        return this.http.get<IBotAccount>('bot/admin/account/detail', {params: {id}});
    }

    public accountSave(data: any) {
        return this.http.post<IBotAccount>('bot/admin/account/save', data);
    }

    public accountRemove(id: any) {
        return this.http.delete<IDataOne<boolean>>('bot/admin/account/delete', {params: {id, bot_id: this.baseId}});
    }

    public mediaList(params: any) {
        return this.http.get<IPage<IBotMedia>>('bot/admin/media', {params: {...params, bot_id: this.baseId}});
    }

    public media(id: any) {
        return this.http.get<IBotMedia>('bot/admin/media/detail', {params: {id, bot_id: this.baseId}});
    }

    public mediaSave(data: any) {
        return this.http.post<IBotMedia>('bot/admin/media/save', data, {
            params: {bot_id: this.baseId}
        });
    }

    public mediaPull(data?: any) {
        return this.http.post<IDataOne<boolean>>('bot/admin/media/pull', data, {
            params: {bot_id: this.baseId}
        });
    }

    public mediaRemove(id: any) {
        return this.http.delete<IDataOne<boolean>>('bot/admin/media/delete', {params: {id, bot_id: this.baseId}});
    }

    public mediaAsync(id: any) {
        return this.http.post<IDataOne<boolean>>('bot/admin/media/async', {id}, {
            params: {bot_id: this.baseId}
        });
    }

    public menuList(params: any) {
        return this.http.get<IPage<IBotMenuItem>>('bot/admin/menu', {params: {...params, bot_id: this.baseId}});
    }

    public menuSave(data: any) {
        return this.http.post<IBotMenuItem>('bot/admin/menu/save', data, {
            params: {bot_id: this.baseId}
        });
    }

    public menuBatchSave(data: IBotMenuItem[]) {
        return this.http.post<IData<IBotMenuItem>>('bot/admin/menu/batch_save', {data}, {
            params: {bot_id: this.baseId}
        });
    }

    public menuAsync() {
        return this.http.post<IDataOne<boolean>>('bot/admin//menu/apply', {}, {
            params: {bot_id: this.baseId}
        });
    }

    public menuRemove(id: any) {
        return this.http.delete<IDataOne<boolean>>('bot/admin/menu/delete', {params: {id, bot_id: this.baseId}});
    }

    public templateList(params: any) {
        return this.http.get<IPage<IBotTemplate>>('bot/admin/template', {params});
    }

    public template(id: any) {
        return this.http.get<IBotTemplate>('bot/admin/template/detail', {params: {id}});
    }

    public templateSave(data: any) {
        return this.http.post<IBotTemplate>('bot/admin/template/save', data);
    }

    public templateRemove(id: any) {
        return this.http.delete<IDataOne<boolean>>('bot/admin/template/delete', {params: {id}});
    }

    public categorySave(data: any) {
        return this.http.post<IBotTemplate>('bot/admin/template/category_save', data);
    }

    public categoryRemove(id: any) {
        return this.http.delete<IDataOne<boolean>>('bot/admin/template/category_delete', {params: {id}});
    }

    public replyList(params: any) {
        return this.http.get<IPage<IBotReply>>('bot/admin/reply', {params: {...params, bot_id: this.baseId}});
    }

    public reply(id: any) {
        return this.http.get<IBotReply>('bot/admin/reply/detail', {params: {id, bot_id: this.baseId}});
    }

    public replySave(data: any) {
        return this.http.post<IBotReply>('bot/admin/reply/save', data, {
            params: {bot_id: this.baseId}
        });
    }

    public send(data: any) {
        return this.http.post<IDataOne<boolean>>('bot/admin/reply/send', data, {
            params: {bot_id: this.baseId}
        });
    }

    public replyUpdate(id: any, data: any) {
        return this.http.post<IBotReply>('bot/admin/reply/update', {id, data}, {
            params: {bot_id: this.baseId}
        });
    }

    public replyRemove(id: any) {
        return this.http.delete<IDataOne<boolean>>('bot/admin/reply/delete', {params: {id, bot_id: this.baseId}});
    }

    public wxTemplateList(params: any) {
        return this.http.get<IPage<IBotReplyTemplate>>('bot/admin/reply/template', {params: {...params, bot_id: this.baseId}});
    }

    public wxTemplate(id: string) {
        return this.http.get<IBotReplyTemplate>('bot/admin/reply/template_detail', {params: {id, bot_id: this.baseId}});
    }

    public wxTemplateSave(data: any) {
        return this.http.post<IBotTemplate>('bot/admin/reply/template_save', data);
    }

    public wxTemplateRemove(id: any) {
        return this.http.delete<IDataOne<boolean>>('bot/admin/reply/template_delete', {params: {id}});
    }

    public wxTemplateAsync() {
        return this.http.post<IDataOne<boolean>>('bot/admin/reply/refresh_template', {bot_id: this.baseId});
    }

    public userList(params: any) {
        return this.http.get<IPage<IBotUser>>('bot/admin/user', {params: {...params, bot_id: this.baseId}});
    }

    public user(id: any) {
        return this.http.get<any>('bot/admin/user/detail', {params: {id, bot_id: this.baseId}});
    }

    public userUpdate(id: any, data: any) {
        return this.http.post<IBotUser>('bot/admin/user/update', {id, data}, {
            params: {bot_id: this.baseId}
        });
    }

    public userRemove(id: any) {
        return this.http.delete<IDataOne<boolean>>('bot/admin/user/delete', {params: {id, bot_id: this.baseId}});
    }

    public userAsync() {
        return this.http.post<IDataOne<boolean>>('bot/admin/user/refresh', {bot_id: this.baseId});
    }

    public userGroupList(params: any) {
        return this.http.get<IPage<IBotUserGroup>>('bot/admin/user/group', {params: {...params, bot_id: this.baseId}});
    }

    public userGroupSave(data: any) {
        return this.http.post<IBotUserGroup>('bot/admin/user/group_save', data, {
            params: {bot_id: this.baseId}
        });
    }

    public userGroupRemove(id: any) {
        return this.http.delete<IDataOne<boolean>>('bot/admin/user/group_delete', {params: {id, bot_id: this.baseId}});
    }

    public logList(params: any) {
        return this.http.get<IPage<any>>('bot/admin/log', {params: {...params, bot_id: this.baseId}});
    }

    public logRemove(id: any) {
        return this.http.delete<IDataOne<boolean>>('bot/admin/log/delete', {params: {id, bot_id: this.baseId}});
    }

    public qrcodeList(params: any) {
        return this.http.get<IPage<IBotQr>>('bot/admin/qrcode', {params: {...params, bot_id: this.baseId}});
    }

    public qrcode(id: any) {
        return this.http.get<IBotQr>('bot/admin/qrcode/detail', {params: {id, bot_id: this.baseId}});
    }

    public qrcodeSave(data: any) {
        return this.http.post<IBotQr>('bot/admin/qrcode/save', data, {
            params: {bot_id: this.baseId}
        });
    }

    public qrcodeRemove(id: any) {
        return this.http.delete<IDataOne<boolean>>('bot/admin/qrcode/delete', {params: {id, bot_id: this.baseId}});
    }

    public statistics() {
        return this.http.get<any>('bot/admin/statistics');
    }

    public batch(data: {
        template_type?: any;
        template_category?: any;
        scenes?: any;
    }) {
        return this.http.post<{
            template_type?: IItem[];
            template_category?: IBotTemplateCategory[];
            scenes?: IItem[];
        }>('bot/admin/batch', data);
    }
}
