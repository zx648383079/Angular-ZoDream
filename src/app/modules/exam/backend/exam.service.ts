import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IData, IDataOne, IPage } from '../../../theme/models/page';
import { IItem } from '../../../theme/models/seo';
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

    public questionCheck(params: any) {
        return this.http.get<IData<IQuestion>>('exam/admin/question/check', {
            params,
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

    public gradeList(params: any) {
        return this.http.get<IPage<any>>('exam/admin/course/grade', {params});
    }

    public gradeAll(params: any) {
        return this.http.get<IData<IItem>>('exam/admin/course/grade_all', {params});
    }

    public gradeSave(data: any) {
        return this.http.post<any>('exam/admin/course/grade_save', data);
    }

    public gradeRemove(id: any) {
        return this.http.delete<IDataOne<true>>('exam/admin/course/grade_delete', {
          params: {id}
        });
    }

    public upgradeList(params?: any) {
        return this.http.get<IPage<any>>('exam/admin/upgrade', {params});
    }

    public upgrade(id: any) {
        return this.http.get<any>('exam/admin/upgrade/detail', {
          params: {id},
        });
    }

    public upgradeSave(data: any) {
        return this.http.post<any>('exam/admin/upgrade/save', data);
    }

    public upgradeRemove(id: any) {
        return this.http.delete<IDataOne<true>>('exam/admin/upgrade/delete', {
          params: {id}
        });
    }

    public upgradeLogList(params?: any) {
        return this.http.get<IPage<any>>('exam/admin/upgrade/log', {params});
    }

    public upgradeLogRemove(id: any) {
        return this.http.delete<IDataOne<true>>('exam/admin/upgrade/log_delete', {
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

    public evaluate(id: any) {
        return this.http.get<IPageEvaluate>('exam/admin/page/evaluate_detail', {params: {id}});
    }

    public evaluateRemove(id: any) {
        return this.http.delete<IDataOne<true>>('exam/admin/page/evaluate_delete', {
            params: {id}
        });
    }

    public pageQuestionScoring(data: any) {
        return this.http.post<IDataOne<true>>('exam/admin/page/question_scoring', data);
    }

    public pageScoring(data: any) {
        return this.http.post<IDataOne<true>>('exam/admin/page/scoring', data);
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

    public statistics() {
        return this.http.get<any>('exam/admin/statistics');
    }
}
