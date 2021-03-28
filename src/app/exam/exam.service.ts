import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IData } from '../theme/models/page';
import { ICourse, IExamPager, IQuestion, IQuestionCard, IQuestionFormat } from './model';

@Injectable({
  providedIn: 'root'
})
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
        [key: number]: {
            answer: any;
            dynamic: string;
        }
    }) {
        return this.http.post<IData<IQuestionFormat>>('exam/question/check', {question});
    }

    public pager(params: any) {
        return this.http.get<IExamPager>('exam/pager', {params});
    }

    public pagerCheck(question: {
        [key: number]: {
            answer: any;
            dynamic: string;
        }
    }) {
        return this.http.post<any>('exam/pager/check', {question});
    }
}
