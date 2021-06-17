import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IData, IDataOne, IPage } from '../../theme/models/page';
import { ICourse, IExamPage, IPageEvaluate, IQuestion, IQuestionMaterial } from '../model';

@Injectable()
export class ExamService {

    constructor(
        private http: HttpClient
    ) { }

    public questionList(params: any) {
        return this.http.get<IPage<IQuestion>>('exam/admin/question', {params});
    }

    public question(id: any) {
        return this.http.get<IQuestion>('exam/admin/question/detail', {
          params: {id},
        });
    }

    public questionSave(data: any) {
        return this.http.post<IQuestion>('exam/admin/question/save', data);
    }

    public questionRemove(id: any) {
        return this.http.delete<IDataOne<true>>('exam/admin/question/delete', {
          params: {id}
        });
    }

    public courseList(params?: any) {
        return this.http.get<IPage<ICourse>>('exam/admin/course', {params});
    }

    public courseAll() {
        return this.http.get<IData<ICourse>>('exam/admin/course/all');
    }

    public course(id: any) {
        return this.http.get<ICourse>('exam/admin/course/detail', {
          params: {id},
        });
    }

    public courseSave(data: any) {
        return this.http.post<ICourse>('exam/admin/course/save', data);
    }

    public courseRemove(id: any) {
        return this.http.delete<IDataOne<true>>('exam/admin/course/delete', {
          params: {id}
        });
    }

    public pageList(params: any) {
        return this.http.get<IPage<IExamPage>>('exam/admin/page', {params});
    }

    public page(id: any) {
        return this.http.get<IExamPage>('exam/admin/page/detail', {
          params: {id},
        });
    }

    public pageSave(data: any) {
        return this.http.post<IExamPage>('exam/admin/page/save', data);
    }

    public pageRemove(id: any) {
        return this.http.delete<IDataOne<true>>('exam/admin/page/delete', {
          params: {id}
        });
    }

    public evaluateList(params: any) {
        return this.http.get<IPage<IPageEvaluate>>('exam/admin/page/evaluate', {params});
    }

    public evaluateRemove(id: any) {
        return this.http.delete<IDataOne<true>>('exam/admin/page/evaluate_delete', {
            params: {id}
        });
    }


    public materialList(params: any) {
        return this.http.get<IPage<IQuestionMaterial>>('exam/admin/material', {params});
    }

    public material(id: any) {
        return this.http.get<IQuestionMaterial>('exam/admin/material/detail', {
          params: {id},
        });
    }

    public materialSave(data: any) {
        return this.http.post<IQuestionMaterial>('exam/admin/material/save', data);
    }

    public materialRemove(id: any) {
        return this.http.delete<IDataOne<true>>('exam/admin/material/delete', {
          params: {id}
        });
    }
}
