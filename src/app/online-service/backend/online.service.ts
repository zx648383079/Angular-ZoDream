import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IDataOne, IPage } from '../../theme/models/page';
import { ICategory, ICategoryUser, IWord } from '../model';

@Injectable()
export class OnlineBackendService {

    constructor(
        private http: HttpClient,
    ) { }

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

}
