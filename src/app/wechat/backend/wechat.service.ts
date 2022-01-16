import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IData, IDataOne, IPage } from '../../theme/models/page';
import { IItem } from '../../theme/models/seo';
import { IWeChatAccount, IWeChatFans, IWeChatMedia, IWeChatMenuItem, IWeChatTemplate, IWeChatTemplateCategory } from '../model';

@Injectable({
    providedIn: 'root'
})
export class WechatService {

    public baseId = 0;

    constructor(private http: HttpClient) { }

    public accountList(params: any) {
        return this.http.get<IPage<IWeChatAccount>>('wx/admin/account', {params});
    }

    public account(id: any) {
        return this.http.get<IWeChatAccount>('wx/admin/account/detail', {params: {id}});
    }

    public accountSave(data: any) {
        return this.http.post<IWeChatAccount>('wx/admin/account/save', data);
    }

    public accountRemove(id: any) {
        return this.http.delete<IDataOne<boolean>>('wx/admin/account/delete', {params: {id, wid: this.baseId}});
    }

    public mediaList(params: any) {
        return this.http.get<IPage<IWeChatMedia>>('wx/admin/media', {params: {...params, wid: this.baseId}});
    }

    public media(id: any) {
        return this.http.get<IWeChatMedia>('wx/admin/media/detail', {params: {id, wid: this.baseId}});
    }

    public mediaSave(data: any) {
        return this.http.post<IWeChatMedia>('wx/admin/media/save', data, {
            params: {wid: this.baseId}
        });
    }

    public mediaRemove(id: any) {
        return this.http.delete<IDataOne<boolean>>('wx/admin/media/delete', {params: {id, wid: this.baseId}});
    }

    public mediaAsync(id: any) {
        return this.http.post<IDataOne<boolean>>('wx/admin/media/async', {id}, {
            params: {wid: this.baseId}
        });
    }

    public menuList(params: any) {
        return this.http.get<IData<IWeChatMenuItem>>('wx/admin/menu', {params: {...params, wid: this.baseId}});
    }

    public menuSave(data: any) {
        return this.http.post<IWeChatMenuItem>('wx/admin/menu/save', data, {
            params: {wid: this.baseId}
        });
    }

    public menuBatchSave(data: IWeChatMenuItem[]) {
        return this.http.post<IData<IWeChatMenuItem>>('wx/admin/menu/batch_save', {data}, {
            params: {wid: this.baseId}
        });
    }

    public menuRemove(id: any) {
        return this.http.delete<IDataOne<boolean>>('wx/admin/menu/delete', {params: {id, wid: this.baseId}});
    }

    public templateList(params: any) {
        return this.http.get<IPage<IWeChatTemplate>>('wx/admin/template', {params});
    }

    public template(id: any) {
        return this.http.get<IWeChatTemplate>('wx/admin/template/detail', {params: {id}});
    }

    public templateSave(data: any) {
        return this.http.post<IWeChatTemplate>('wx/admin/template/save', data);
    }

    public templateRemove(id: any) {
        return this.http.delete<IDataOne<boolean>>('wx/admin/template/delete', {params: {id}});
    }

    public categorySave(data: any) {
        return this.http.post<IWeChatTemplate>('wx/admin/template/category_save', data);
    }

    public categoryRemove(id: any) {
        return this.http.delete<IDataOne<boolean>>('wx/admin/template/category_delete', {params: {id}});
    }

    public replyList(params: any) {
        return this.http.get<IPage<any>>('wx/admin/reply', {params: {...params, wid: this.baseId}});
    }

    public reply(id: any) {
        return this.http.get<any>('wx/admin/reply/detail', {params: {id, wid: this.baseId}});
    }

    public replySave(data: any) {
        return this.http.post<any>('wx/admin/reply/save', data, {
            params: {wid: this.baseId}
        });
    }

    public replyUpdate(id: any, data: any) {
        return this.http.post<any>('wx/admin/reply/update', {id, data}, {
            params: {wid: this.baseId}
        });
    }

    public replyRemove(id: any) {
        return this.http.delete<IDataOne<boolean>>('wx/admin/reply/delete', {params: {id, wid: this.baseId}});
    }

    public wxTemplateList(params: any) {
        return this.http.get<IPage<any>>('wx/admin/reply/template', {params: {...params, wid: this.baseId}});
    }

    public wxTemplateAsync() {
        return this.http.post<IDataOne<boolean>>('wx/admin/reply/refresh_template', {wid: this.baseId});
    }

    public userList(params: any) {
        return this.http.get<IPage<IWeChatFans>>('wx/admin/user', {params: {...params, wid: this.baseId}});
    }

    public user(id: any) {
        return this.http.get<any>('wx/admin/user/detail', {params: {id, wid: this.baseId}});
    }

    public userRemove(id: any) {
        return this.http.delete<IDataOne<boolean>>('wx/admin/user/delete', {params: {id, wid: this.baseId}});
    }

    public userAsync() {
        return this.http.post<IDataOne<boolean>>('wx/admin/user/refresh', {wid: this.baseId});
    }

    public logList(params: any) {
        return this.http.get<IPage<any>>('wx/admin/log', {params: {...params, wid: this.baseId}});
    }

    public logRemove(id: any) {
        return this.http.delete<IDataOne<boolean>>('wx/admin/log/delete', {params: {id, wid: this.baseId}});
    }

    public qrcodeList(params: any) {
        return this.http.get<IPage<any>>('wx/admin/qrcode', {params: {...params, wid: this.baseId}});
    }

    public qrcode(id: any) {
        return this.http.get<any>('wx/admin/qrcode/detail', {params: {id, wid: this.baseId}});
    }

    public qrcodeSave(data: any) {
        return this.http.post<any>('wx/admin/qrcode/save', data, {
            params: {wid: this.baseId}
        });
    }

    public qrcodeRemove(id: any) {
        return this.http.delete<IDataOne<boolean>>('wx/admin/qrcode/delete', {params: {id, wid: this.baseId}});
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
        }>('wx/admin/batch', data);
    }
}
