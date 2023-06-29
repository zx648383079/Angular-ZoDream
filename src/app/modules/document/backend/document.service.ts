import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IData, IDataOne, IPage } from '../../../theme/models/page';
import { IApiField, ICategory, IDocApi, IDocPage, IProject, IProjectVersion } from '../model';

@Injectable()
export class DocumentService {

    constructor(
        private http: HttpClient,
    ) { }

    public categoryTree() {
        return this.http.get<IData<ICategory>>('doc/admin/category/all');
    }

    public categoryList() {
        return this.http.get<IData<ICategory>>('doc/admin/category');
    }

    public category(id: any) {
        return this.http.get<ICategory>('doc/admin/category/detail', {params: {id}});
    }

    public categorySave(data: any) {
        return this.http.post<ICategory>('doc/admin/category/save', data);
    }

    public categoryRemove(id: any) {
        return this.http.delete<IDataOne<boolean>>('doc/admin/category/delete', {params: {id}});
    }

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

    public versionAll(id: any) {
        return this.http.get<IData<IProjectVersion>>('doc/admin/project/version', {params: {id}});
    }

    public catalogAll(id: any, version: any) {
        return this.http.get<IData<IDocPage&IDocApi>>('doc/admin/project/catalog', {params: {id, version}});
    }

    public page(id: any) {
        return this.http.get<IDocPage>('doc/admin/page', {
          params: {id},
        });
    }

    public pageSave(data: any) {
        return this.http.post<IDocPage>('doc/admin/page/save', data);
    }

    public pageRemove(id: any) {
        return this.http.delete<IDataOne<true>>('doc/admin/page/delete', {
          params: {id}
        });
    }

    public api(id: any) {
        return this.http.get<IDocApi>('doc/admin/api', {
          params: {id},
        });
    }

    public apiSave(data: any) {
        return this.http.post<IDocApi>('doc/admin/api/save', data);
    }

    public apiRemove(id: any) {
        return this.http.delete<IDataOne<true>>('doc/admin/api/delete', {
          params: {id}
        });
    }

    public apiParse(content: string, kind: number) {
        return this.http.post<IData<IApiField>>('doc/admin/api/parse', {content, kind});
    }

    public apiDebug(data: any) {
        return this.http.post<IDataOne<{
            body: string;
            headers: {
                request: string[];
                response: string[];
            },
            info: any;
        }>>('doc/admin/api/debug_result', data);
    }

    public versionNew(project: number, version: number, name: string) {
        return this.http.post<IDataOne<true>>('doc/admin/project/version_new', {project, version, name});
    }

    public versionRemove(project: number, version: number) {
        return this.http.post<IDataOne<true>>('doc/admin/project/version_remove', {project, version});
    }
}
