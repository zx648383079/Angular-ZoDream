import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { IData, IDataOne, IPage } from '../../theme/models/page';
import { IAgreement, IBlackWord, IEmoji, IEmojiCategory, IItem, IOption, IPluginItem } from '../../theme/models/seo';
import { map } from 'rxjs/operators';
import { IFormInput } from '../../components/form';

@Injectable()
export class SystemService {
    private http = inject(HttpClient);


    public cacheStore() {
        return this.http.get<IData<IItem>>('seo/admin/cache').pipe(map(res => res.data));
    }

    public cacheClear(data: any) {
        return this.http.post<IDataOne<true>>('seo/admin/cache/clear', data);
    }

    public optionList() {
        return this.http.get<IData<IOption>>('seo/admin/setting');
    }

    public optionSave(data: any) {
        return this.http.post<IDataOne<true>>('seo/admin/setting/save', data);
    }

    public optionSaveField(data: any) {
        return this.http.post<IOption>('seo/admin/setting/save_option', data);
    }

    public optionRemove(id: any) {
        return this.http.delete<IDataOne<true>>('seo/admin/setting/delete', {
            params: {id}
        });
    }

    public pluginList(params: any) {
        return this.http.get<IPage<IPluginItem>>('plugin/admin/home', {params});
    }

    public pluginSync() {
        return this.http.post<IDataOne<true>>('plugin/admin/home/sync', {});
    }

    public pluginInstall(id: number, data?: any) {
        return this.http.post<IDataOne<true|IFormInput[]>>('plugin/admin/home/install', {id, data});
    }

    public pluginUninstall(id: number|number[]) {
        return this.http.post<IDataOne<true>>('plugin/admin/home/uninstall', {id});
    }

    public pluginExecute(id: number) {
        return this.http.post<IDataOne<true>>('plugin/admin/home/execute', {id});
    }

    public sitemap() {
        return this.http.post<IData<any>>('seo/admin/sitemap', {});
    }

    public sqlList() {
        return this.http.get<IData<any>>('seo/admin/sql');
    }

    public sqlBackup() {
        return this.http.post<IDataOne<true>>('seo/admin/sql/back_up', {});
    }

    public sqlClear() {
        return this.http.delete<IDataOne<true>>('seo/admin/sql/clear');
    }

    public wordList(params: any) {
        return this.http.get<IPage<IBlackWord>>('seo/admin/word', {params});
    }

    public word(id: any) {
        return this.http.get<IBlackWord>('seo/admin/word/detail', {params: {id}});
    }

    public wordSave(data: any) {
        return this.http.post<IBlackWord>('seo/admin/word/save', data);
    }

    public wordRemove(id: any) {
        return this.http.delete<IDataOne<boolean>>('seo/admin/word/delete', {params: {id}});
    }

    public emojiList(params: any) {
        return this.http.get<IPage<IEmoji>>('seo/admin/emoji', {params});
    }

    public emoji(id: any) {
        return this.http.get<IEmoji>('seo/admin/emoji/detail', {params: {id}});
    }

    public emojiSave(data: any) {
        return this.http.post<IEmoji>('seo/admin/emoji/save', data);
    }

    public emojiImport(data: any) {
        return this.http.post<IDataOne<boolean>>('seo/admin/emoji/import', data);
    }

    public emojiRemove(id: any) {
        return this.http.delete<IDataOne<boolean>>('seo/admin/emoji/delete', {params: {id}});
    }

    public emojiCategoryList(params: any) {
        return this.http.get<IData<IEmojiCategory>>('seo/admin/emoji/category', {params});
    }

    public emojiCategory(id: any) {
        return this.http.get<IEmojiCategory>('seo/admin/emoji/category_detail', {params: {id}});
    }

    public emojiCategorySave(data: any) {
        return this.http.post<IEmojiCategory>('seo/admin/emoji/category_save', data);
    }

    public emojiCategoryRemove(id: any) {
        return this.http.delete<IDataOne<boolean>>('seo/admin/emoji/category_delete', {params: {id}});
    }

    public agreementList(params: any) {
        return this.http.get<IPage<IAgreement>>('seo/admin/agreement', {params});
    }

    public agreement(id: any) {
        return this.http.get<IAgreement>('seo/admin/agreement/detail', {params: {id}});
    }

    public agreementSave(data: any) {
        return this.http.post<IAgreement>('seo/admin/agreement/save', data);
    }

    public agreementRemove(id: any) {
        return this.http.delete<IDataOne<boolean>>('seo/admin/agreement/delete', {params: {id}});
    }

}
