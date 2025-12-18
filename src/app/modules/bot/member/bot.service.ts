import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { IData, IDataOne, IPage } from '../../../theme/models/page';
import { IItem } from '../../../theme/models/seo';
import { IBotAccount, IBotUser, IBotMedia, IBotMenuItem, IBotQr, IBotReply, IBotReplyTemplate, IBotTemplate, IBotTemplateCategory, IBotUserGroup } from '../model';
import { Router } from '@angular/router';

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
            template_type?: IItem[];
            template_category?: IBotTemplateCategory[];
            scenes?: IItem[];
        }>('bot/member/batch', data);
    }
}
