import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { IData, IDataOne, IPage } from '../../../theme/models/page';
import { IApiField, IDocApi, IDocPage, IProject, IProjectVersion } from '../model';

@Injectable()
export class DocumentService {
    private readonly http = inject(HttpClient);


    public projectList(params: any) {
        return this.http.get<IPage<IProject>>('doc/member/project', {params});
    }

    public project(id: any) {
        return this.http.get<IProject>('doc/member/project/detail', {
          params: {id},
        });
    }

    public projectSave(data: any) {
        return this.http.post<IProject>('doc/member/project/save', data);
    }

    public projectRemove(id: any) {
        return this.http.delete<IDataOne<true>>('doc/member/project/delete', {
          params: {id}
        });
    }

    public versionAll(id: any) {
        return this.http.get<IData<IProjectVersion>>('doc/member/project/version', {params: {id}});
    }

    public catalogAll(id: any, version: any) {
        return this.http.get<IData<IDocPage&IDocApi>>('doc/member/project/catalog', {params: {id, version}});
    }

    public page(id: any) {
        return this.http.get<IDocPage>('doc/member/page', {
          params: {id},
        });
    }

    public pageSave(data: any) {
        return this.http.post<IDocPage>('doc/member/page/save', data);
    }

    public pageRemove(id: any) {
        return this.http.delete<IDataOne<true>>('doc/member/page/delete', {
          params: {id}
        });
    }

    public api(id: any) {
        return this.http.get<IDocApi>('doc/member/api', {
          params: {id},
        });
    }

    public apiSave(data: any) {
        return this.http.post<IDocApi>('doc/member/api/save', data);
    }

    public apiRemove(id: any) {
        return this.http.delete<IDataOne<true>>('doc/member/api/delete', {
          params: {id}
        });
    }

    public apiParse(content: string, kind: number) {
        return this.http.post<IData<IApiField>>('doc/member/api/parse', {content, kind});
    }

    public apiDebug(data: any) {
        return this.http.post<IDataOne<{
            body: string;
            headers: {
                request: string[];
                response: string[];
            },
            info: any;
        }>>('doc/member/api/debug_result', data);
    }

    public versionNew(project: number, version: number, name: string) {
        return this.http.post<IDataOne<true>>('doc/member/project/version_new', {project, version, name});
    }

    public versionRemove(project: number, version: number) {
        return this.http.post<IDataOne<true>>('doc/member/project/version_delete', {project, version});
    }
}
