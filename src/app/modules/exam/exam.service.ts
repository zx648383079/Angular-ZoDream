import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { map } from 'rxjs/operators';
import { IData, IDataOne, IPage } from '../../theme/models/page';
import { IItem } from '../../theme/models/seo';
import { ICourse, IExamPage, IExamPager, IExamSheet, IQuestion, IQuestionCard, IQuestionFormat } from './model';

@Injectable()
export class ExamService {
    private http = inject(HttpClient);


    public courseChildren(id: any = 0) {
        return this.http.get<IData<ICourse>>('exam/course/children', {params: {id}});
    }

    public course(id: any) {
        return this.http.get<ICourse>('exam/course', {
          params: {id},
        });
    }

    public courseAll(full = false) {
        return this.http.get<IData<ICourse>>('exam/course/tree', {params: {full}});
    }

    public gradeAll(params: any) {
        return this.http.get<IData<IItem>>('exam/course/grade', {params});
    }

    public question(params: any) {
        return this.http.get<IQuestionFormat>('exam/question', {
          params,
        });
    }

    public questionCard(course: any) {
        return this.http.get<IData<IQuestionCard>>('exam/question/card', {
          params: {course},
        });
    }

    public questionCheck(question: {
        [key: number]: IExamSheet
    } | IExamSheet[]) {
        return this.http.post<IData<IQuestionFormat>>('exam/question/check', {question});
    }

    public pager(params: any) {
        return this.http.get<IExamPager>('exam/pager', {params});
    }

    public pagerCheck(question: {
        [key: number]: IExamSheet
    } | IExamSheet[], id: number, pageId: number) {
        return this.http.post<IExamPager>('exam/pager/check', {question, id, page_id: pageId});
    }

    public pagerSave(question: {
        [key: number]: IExamSheet
    } | IExamSheet[], id: number, pageId: number) {
        return this.http.post<IDataOne<true>>('exam/pager/save', {question, id, page_id: pageId});
    }

    public pageList(params: any) {
        return this.http.get<IPage<IExamPage>>('exam/member/page', {params});
    }

    public page(id: any) {
        return this.http.get<IExamPage>('exam/member/page/detail', {
          params: {id},
        });
    }

    public pageSave(data: any) {
        return this.http.post<IExamPage>('exam/member/page/save', data);
    }

    public pageRemove(id: any) {
        return this.http.delete<IDataOne<true>>('exam/member/page/delete', {
          params: {id}
        });
    }

    public search(params: any) {
        return this.http.get<IPage<IQuestion|IExamPage>>('exam/search', {params});
    }

    public suggestion(params: any) {
        return this.http.get<IData<IQuestion|IExamPage>>('exam/search/suggest', {params}).pipe(map(res => res.data));
    }
}
