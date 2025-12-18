import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { IData, IDataOne, IPage } from '../../../theme/models/page';
import { ICategory, ICategoryUser, IMessage, ISession, IWord } from '../model';

@Injectable()
export class OnlineBackendService {
    private readonly http = inject(HttpClient);


    public categoryList(params: any) {
        return this.http.get<IPage<ICategory>>('os/admin/category', {params});
    }

    public category(id: any) {
        return this.http.get<ICategory>('os/admin/category/detail', {params: {id}});
    }

    public categorySave(data: any) {
        return this.http.post<ICategory>('os/admin/category/save', data);
    }

    public categoryRemove(id: any) {
        return this.http.delete<IDataOne<boolean>>('os/admin/category/delete', {params: {id}});
    }

    public userList(params: any) {
        return this.http.get<IPage<ICategoryUser>>('os/admin/category/user', {params});
    }

    public userAdd(data: any) {
        return this.http.post<IDataOne<boolean>>('os/admin/category/user_add', data);
    }

    public userRemove(params: any) {
        return this.http.delete<IDataOne<boolean>>('os/admin/category/user_delete', {params});
    }

    public wordList(params: any) {
        return this.http.get<IPage<IWord>>('os/admin/category/word', {params});
    }

    public wordSave(data: any) {
        return this.http.post<IWord>('os/admin/category/word_save', data);
    }

    public wordRemove(id: any) {
        return this.http.delete<IDataOne<boolean>>('os/admin/category/word_delete', {params: {id}});
    }

    public wordAll() {
        return this.http.get<IData<ICategory>>('os/admin/category/word_all');
    }

    public sessionList(params: any) {
        return this.http.get<IPage<ISession>>('os/admin/session', {params});
    }

    public sessionMy() {
        return this.http.get<IData<ISession>>('os/admin/session/my');
    }

    public messageList(params: any) {
        return this.http.get<IPage<IMessage>>('os/admin/session/message', {params});
    }

    public send(data: any) {
        return this.http.post<IData<IMessage>>('os/admin/session/send', data);
    }

    public sessionRemark(data: any) {
        return this.http.post<ISession>('os/admin/session/remark', data);
    }

    public sessionTransfer(data: any) {
        return this.http.post<ISession>('os/admin/session/transfer', data);
    }

    /**
     * 设置自动回复
     */
    public sessionReply(data: any) {
        return this.http.post<ISession>('os/admin/session/reply', data);
    }

}
