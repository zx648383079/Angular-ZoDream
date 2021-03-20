import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IDataOne, IPage } from '../../theme/models/page';
import { IProject } from '../model';

@Injectable({
  providedIn: 'root'
})
export class DocumentService {

    constructor(
        private http: HttpClient,
    ) { }

    public projectList(params: any) {
        return this.http.get<IPage<IProject>>('doc/admin/project', {params});
    }

    public project(id: any) {
        return this.http.get<IProject>('doc/admin/project/detail', {
          params: {id},
        });
    }

    public projectSave(data: any) {
        return this.http.post<IProject>('doc/admin/project/save', data);
    }

    public projectRemove(id: any) {
        return this.http.delete<IDataOne<true>>('doc/admin/project/delete', {
          params: {id}
        });
    }
}
