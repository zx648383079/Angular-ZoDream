import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IData, IDataOne, IPage } from '../theme/models/page';
import { IDocApi, IDocPage, IProject, IProjectVersion } from './model';

@Injectable({
  providedIn: 'root'
})
export class DocumentService {

    constructor(
        private http: HttpClient,
    ) { }

    public projectList(params: any) {
        return this.http.get<IPage<IProject>>('doc/project', {params});
    }

    public project(id: any) {
        return this.http.get<IProject>('doc/project/detail', {params: {id}});
    }

    public versionAll(id: any) {
        return this.http.get<IData<IProjectVersion>>('doc/project/version', {params: {id}});
    }

    public catalogAll(id: any, version: any) {
        return this.http.get<IData<IDocPage&IDocApi>>('doc/project/catalog', {params: {id, version}});
    }

    public projectPage(project: any, id: any) {
        return this.http.get<IDocPage&IDocApi>('doc/project/page', {params: {id, project}});
    }

    public page(id: any) {
        return this.http.get<IDocPage>('doc/page', {params: {id}});
    }

    public api(id: any) {
        return this.http.get<IDocApi>('doc/api', {params: {id}});
    }
 
    public language() {
        return this.http.get<IData<string>>('doc/api/language');
    }

    public apiMock(id: any) {
        return this.http.get<IDataOne<any>>('doc/api/mock', {params: {id}});
    }

    public apiCode(params: any) {
        return this.http.get<IDataOne<string>>('doc/api/code', {params});
    }
}
