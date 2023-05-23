import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IData, IDataOne, IPage } from '../../../theme/models/page';
import { IItem } from '../../../theme/models/seo';
import { IWeChatAccount, IWeChatUser, IWeChatMedia, IWeChatMenuItem, IWeChatQr, IWeChatReply, IWeChatReplyTemplate, IWeChatTemplate, IWeChatTemplateCategory, IWeChatUserGroup } from '../model';
import { Router } from '@angular/router';

@Injectable({
    providedIn: 'root'
})
export class WechatService {

    public baseId = 0;

    constructor(
        private http: HttpClient,
        private router: Router
    ) { }

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
        this.router.navigate(['/frontend/wx/account'], {
            queryParams: { redirect_uri: uri }
        });
        return false;
    }

    public accountList(params: any) {
        return this.http.get<IPage<IWeChatAccount>>('wx/member/account', {params});
    }

    public account(id: any) {
        return this.http.get<IWeChatAccount>('wx/member/account/detail', {params: {id}});
    }

    public accountSave(data: any) {
        return this.http.post<IWeChatAccount>('wx/member/account/save', data);
    }

    public accountRemove(id: any) {
        return this.http.delete<IDataOne<boolean>>('wx/member/account/delete', {params: {id, wid: this.baseId}});
    }

    public mediaList(params: any) {
        return this.http.get<IPage<IWeChatMedia>>('wx/member/media', {params: {...params, wid: this.baseId}});
    }

    public media(id: any) {
        return this.http.get<IWeChatMedia>('wx/member/media/detail', {params: {id, wid: this.baseId}});
    }

    public mediaSave(data: any) {
        return this.http.post<IWeChatMedia>('wx/member/media/save', data, {
            params: {wid: this.baseId}
        });
    }

    public mediaPull(data?: any) {
        return this.http.post<IDataOne<boolean>>('wx/member/media/pull', data, {
            params: {wid: this.baseId}
        });
    }

    public mediaRemove(id: any) {
        return this.http.delete<IDataOne<boolean>>('wx/member/media/delete', {params: {id, wid: this.baseId}});
    }

    public mediaAsync(id: any) {
        return this.http.post<IDataOne<boolean>>('wx/member/media/async', {id}, {
            params: {wid: this.baseId}
        });
    }

    public menuList(params: any) {
        return this.http.get<IData<IWeChatMenuItem>>('wx/member/menu', {params: {...params, wid: this.baseId}});
    }

    public menuSave(data: any) {
        return this.http.post<IWeChatMenuItem>('wx/member/menu/save', data, {
            params: {wid: this.baseId}
        });
    }

    public menuBatchSave(data: IWeChatMenuItem[]) {
        return this.http.post<IData<IWeChatMenuItem>>('wx/member/menu/batch_save', {data}, {
            params: {wid: this.baseId}
        });
    }

    public menuAsync() {
        return this.http.post<IDataOne<boolean>>('wx/member/menu/apply', {}, {
            params: {wid: this.baseId}
        });
    }

    public menuRemove(id: any) {
        return this.http.delete<IDataOne<boolean>>('wx/member/menu/delete', {params: {id, wid: this.baseId}});
    }

    public templateList(params: any) {
        return this.http.get<IPage<IWeChatTemplate>>('wx/member/template', {params});
    }

    public replyList(params: any) {
        return this.http.get<IPage<IWeChatReply>>('wx/member/reply', {params: {...params, wid: this.baseId}});
    }

    public reply(id: any) {
        return this.http.get<IWeChatReply>('wx/member/reply/detail', {params: {id, wid: this.baseId}});
    }

    public replySave(data: any) {
        return this.http.post<IWeChatReply>('wx/member/reply/save', data, {
            params: {wid: this.baseId}
        });
    }

    public send(data: any) {
        return this.http.post<IDataOne<boolean>>('wx/member/reply/send', data, {
            params: {wid: this.baseId}
        });
    }

    public replyUpdate(id: any, data: any) {
        return this.http.post<IWeChatReply>('wx/member/reply/update', {id, data}, {
            params: {wid: this.baseId}
        });
    }

    public replyRemove(id: any) {
        return this.http.delete<IDataOne<boolean>>('wx/member/reply/delete', {params: {id, wid: this.baseId}});
    }

    public wxTemplateList(params: any) {
        return this.http.get<IPage<IWeChatReplyTemplate>>('wx/member/reply/template', {params: {...params, wid: this.baseId}});
    }

    public wxTemplate(id: string) {
        return this.http.get<IWeChatReplyTemplate>('wx/member/reply/template_detail', {params: {id, wid: this.baseId}});
    }

    public wxTemplateSave(data: any) {
        return this.http.post<IWeChatTemplate>('wx/member/reply/template_save', data);
    }

    public wxTemplateRemove(id: any) {
        return this.http.delete<IDataOne<boolean>>('wx/member/reply/template_delete', {params: {id}});
    }

    public wxTemplateAsync() {
        return this.http.post<IDataOne<boolean>>('wx/member/reply/refresh_template', {wid: this.baseId});
    }

    public userList(params: any) {
        return this.http.get<IPage<IWeChatUser>>('wx/member/user', {params: {...params, wid: this.baseId}});
    }

    public user(id: any) {
        return this.http.get<any>('wx/member/user/detail', {params: {id, wid: this.baseId}});
    }

    public userUpdate(id: any, data: any) {
        return this.http.post<IWeChatUser>('wx/member/user/update', {id, data}, {
            params: {wid: this.baseId}
        });
    }

    public userRemove(id: any) {
        return this.http.delete<IDataOne<boolean>>('wx/member/user/delete', {params: {id, wid: this.baseId}});
    }

    public userAsync() {
        return this.http.post<IDataOne<boolean>>('wx/member/user/refresh', {wid: this.baseId});
    }

    public userGroupList(params: any) {
        return this.http.get<IPage<IWeChatUserGroup>>('wx/member/user/group', {params: {...params, wid: this.baseId}});
    }

    public userGroupSave(data: any) {
        return this.http.post<IWeChatUserGroup>('wx/member/user/group_save', data, {
            params: {wid: this.baseId}
        });
    }

    public userGroupRemove(id: any) {
        return this.http.delete<IDataOne<boolean>>('wx/member/user/group_delete', {params: {id, wid: this.baseId}});
    }

    public logList(params: any) {
        return this.http.get<IPage<any>>('wx/member/log', {params: {...params, wid: this.baseId}});
    }

    public logRemove(id: any) {
        return this.http.delete<IDataOne<boolean>>('wx/member/log/delete', {params: {id, wid: this.baseId}});
    }

    public qrcodeList(params: any) {
        return this.http.get<IPage<IWeChatQr>>('wx/member/qrcode', {params: {...params, wid: this.baseId}});
    }

    public qrcode(id: any) {
        return this.http.get<IWeChatQr>('wx/member/qrcode/detail', {params: {id, wid: this.baseId}});
    }

    public qrcodeSave(data: any) {
        return this.http.post<IWeChatQr>('wx/member/qrcode/save', data, {
            params: {wid: this.baseId}
        });
    }

    public qrcodeRemove(id: any) {
        return this.http.delete<IDataOne<boolean>>('wx/member/qrcode/delete', {params: {id, wid: this.baseId}});
    }

    public statistics() {
        return this.http.get<any>('wx/member/statistics');
    }

    public batch(data: {
        template_type?: any;
        template_category?: any;
        scenes?: any;
    }) {
        return this.http.post<{
            template_type?: IItem[];
            template_category?: IWeChatTemplateCategory[];
            scenes?: IItem[];
        }>('wx/member/batch', data);
    }
}
