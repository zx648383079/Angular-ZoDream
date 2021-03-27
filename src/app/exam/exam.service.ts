import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IData } from '../theme/models/page';
import { ICourse, IQuestion } from './model';

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
        return this.http.get<IQuestion>('exam/question', {
          params,
        });
    }

}
