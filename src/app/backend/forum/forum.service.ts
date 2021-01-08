import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IBlackWord, IEmoji, IEmojiCategory, IForum, IThread } from '../../theme/models/forum';
import { IData, IDataOne, IPage } from '../../theme/models/page';

@Injectable()
export class ForumService {

    constructor(private http: HttpClient) { }

    public forumList(params: any) {
        return this.http.get<IPage<IForum>>('forum/admin/forum', {params});
    }

    public forumAll() {
        return this.http.get<IData<IForum>>('forum/admin/forum/all');
    }

    public forum(id: any) {
        return this.http.get<IForum>('forum/admin/forum/detail', {params: {id}});
    }

    public forumSave(data: any) {
        return this.http.post<IForum>('forum/admin/forum/save', data);
    }

    public forumRemove(id: any) {
        return this.http.delete<IDataOne<boolean>>('forum/admin/forum/delete', {params: {id}});
    }

    public threadList(params: any) {
        return this.http.get<IPage<IThread>>('forum/admin/thread', {params});
    }

    public thread(id: any) {
        return this.http.get<IThread>('forum/admin/thread/detail', {params: {id}});
    }

    public threadSave(data: any) {
        return this.http.post<IThread>('forum/admin/thread/save', data);
    }

    public threadRemove(id: any) {
        return this.http.delete<IDataOne<boolean>>('forum/admin/thread/delete', {params: {id}});
    }

    public wordList(params: any) {
        return this.http.get<IPage<IBlackWord>>('forum/admin/word', {params});
    }

    public word(id: any) {
        return this.http.get<IBlackWord>('forum/admin/word/detail', {params: {id}});
    }

    public wordSave(data: any) {
        return this.http.post<IBlackWord>('forum/admin/word/save', data);
    }

    public wordRemove(id: any) {
        return this.http.delete<IDataOne<boolean>>('forum/admin/word/delete', {params: {id}});
    }

    public emojiList(params: any) {
        return this.http.get<IPage<IEmoji>>('forum/admin/emoji', {params});
    }

    public emoji(id: any) {
        return this.http.get<IEmoji>('forum/admin/emoji/detail', {params: {id}});
    }

    public emojiSave(data: any) {
        return this.http.post<IEmoji>('forum/admin/emoji/save', data);
    }

    public emojiRemove(id: any) {
        return this.http.delete<IDataOne<boolean>>('forum/admin/emoji/delete', {params: {id}});
    }

    public emojiCategoryList(params: any) {
        return this.http.get<IData<IEmojiCategory>>('forum/admin/emoji/category', {params});
    }

    public emojiCategory(id: any) {
        return this.http.get<IEmojiCategory>('forum/admin/emoji/category_detail', {params: {id}});
    }

    public emojiCategorySave(data: any) {
        return this.http.post<IEmojiCategory>('forum/admin/emoji/category_save', data);
    }

    public emojiCategoryRemove(id: any) {
        return this.http.delete<IDataOne<boolean>>('forum/admin/emoji/category_delete', {params: {id}});
    }
}
