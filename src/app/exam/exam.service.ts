import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IData, IDataOne, IPage } from '../theme/models/page';
import { ICourse, IExamPage, IExamPager, IExamSheet, IQuestion, IQuestionCard, IQuestionFormat } from './model';

@Injectable()
export class ExamService {

    constructor(
        private http: HttpClient
    ) { }

    public courseChildren(id: any = 0) {
        return this.http.get<IData<ICourse>>('exam/course/children', {params: {id}});
    }

    public course(id: any) {
        return this.http.get<ICourse>('exam/course', {
          params: {id},
        });
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
    } | IExamSheet[], id: number, spentTIme = 0) {
        return this.http.post<IExamPager>('exam/pager/check', {question, id, spent_time: spentTIme});
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
}
