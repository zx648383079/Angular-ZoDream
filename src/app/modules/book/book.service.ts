import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IData, IDataOne, IPage } from '../../theme/models/page';
import { map } from 'rxjs/operators';
import { IBook, ICategory, IAuthor, IChapter, IBookList, IBookListItem, IBookRecord, IAuthorProfile, IBookRole, IBookRoleRelation } from './model';

@Injectable()
export class BookService {
    private readonly http = inject(HttpClient);


    public getHot(): Observable<string[]> {
        return this.http.get<IData<string>>('book/home/hot').pipe(map(item => {
            return item.data;
        }));
    }

    public getTips(keywords: string): Observable<string[]> {
        return this.http.get<IData<string>>('book/home/suggest', {
            params: {keywords}
        }).pipe(map(item => {
            return item.data;
        }));
    }

    public getBookList(params: any): Observable<IPage<IBook>> {
        return this.http.get<IPage<IBook>>('book', {
            params
        });
    }

    public getCategories(): Observable<ICategory[]> {
        return this.http.get<IData<ICategory>>('book/category').pipe(map(item => {
            return item.data;
        }));
    }

    public categories(): Observable<ICategory[]> {
        return this.http.get<IData<ICategory>>('book/category/all').pipe(map(item => {
            return item.data;
        }));
    }

    public getAuthors(): Observable<IAuthor[]> {
        return this.http.get<IData<IAuthor>>('book/author').pipe(map(item => {
            return item.data;
        }));
    }

    public getBook(id: number): Observable<IBook> {
        return this.http.get<IBook>('book', {
            params: {id: id.toString()}
        });
    }

    public getChapters(book: number, page = 1, perPage = 2000): Observable<IPage<IChapter>> {
        return this.http.get<IPage<IChapter>>('book/chapter', {
            params: {
                book: book.toString(),
                page: page.toString(),
                per_page: perPage.toString()
            }
        });
    }

    public getChapter(id: any, book?: any): Observable<IChapter>{
        return this.http.get<IChapter>('book/chapter/detail', {
            params: {
                id,
                book,
            }
        });
    }

    public getHistory(params: any) {
        return this.http.get<IPage<IBookRecord>>('book/history', {
            params
        });
    }

    public recordHistory(book: number, chapter: number, progress: number): Observable<any> {
        return this.http.post<any>('book/history/record', {book, chapter, progress});
    }

    public removeHistory(id: any) {
        return this.http.delete<IDataOne<boolean>>('book/history/delete', {params: {id}});
    }

    public getTheme(): Observable<any>{
        return this.http.get<IData<any>>('book/theme');
    }

    public saveTheme(params: any): Observable<any>{
        return this.http.post<any>('book/theme/save', params);
    }

    public list(params: any) {
        return this.http.get<IPage<IBookList>>('book/list', {params});
    }

    public listDetail(id: any) {
        return this.http.get<IBookList>('book/list/detail', {params: {id}});
    }

    public listSave(data: any) {
        return this.http.post<IBookList>('book/list/save', data);
    }

    public listRemove(id: any) {
        return this.http.delete<IDataOne<boolean>>('book/list/delete', {params: {id}});
    }

    public listCollect(id: any) {
        return this.http.post<IBookList>('book/list/collect', {id});
    }

    public listAgree(id: any) {
        return this.http.post<IBookListItem>('book/list/agree', {id});
    }

    public listDisagree(id: any) {
        return this.http.post<IBookListItem>('book/list/disagree', {id});
    }

    public profile() {
        return this.http.get<IAuthorProfile>('book/member/home/index');
    }

    public selfBookList(params: any) {
        return this.http.get<IPage<IBook>>('book/member/book', {params});
    }

    public selfBook(id: any) {
        return this.http.get<IBook>('book/member/book/detail', {params: {id}});
    }

    public selfSaveBook(data: any) {
        return this.http.post<IBook>('book/member/book/save', data);
    }

    public selfOverBook(id: any) {
        return this.http.put<IBook>('book/member/book/over', {id});
    }


}
