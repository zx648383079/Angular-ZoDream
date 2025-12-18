import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { IData, IPage } from '../../theme/models/page';
import { IScoreSubtotal } from '../../theme/models/seo';
import { ICategory, IComment, IResource, IResourceCatalog } from './model';

@Injectable({
    providedIn: 'root'
})
export class ResourceService {
    private readonly http = inject(HttpClient);


    public categoryList(params: any) {
        return this.http.get<IData<ICategory>>('res/category', {params});
    }

    public category(id: any) {
        return this.http.get<ICategory>('res/category/detail', {params: {id}});
    }

    public resourceList(params: any) {
        return this.http.get<IPage<IResource>>('res', {params});
    }

    public resource(id: any) {
        return this.http.get<IResource>('res/home/detail', {params: {id}});
    }

    public resourcePreview(id: any) {
        return this.http.get<IResource>('res/home/preview', {params: {id}});
    }

    public resourceCatalog(id: any) {
        return this.http.get<IData<IResourceCatalog>>('res/home/catalog', {params: {id}});
    }

    public resourceSuggest(params: any) {
        return this.http.get<IData<IResource>>('res/home/suggest', {params});
    }

     public collect(id: any) {
        return this.http.post<IResource>('res/home/collect', {id});
    }

    public commentList(params: any) {
        return this.http.get<IPage<IComment>>('res/comment', {params});
    }

    public commentSave(data: any) {
        return this.http.post<IComment>('res/comment/save', data);
    }

    public scoreSubtotal(params: any) {
        return this.http.get<IScoreSubtotal>('res/comment/score_count', {params});
    }

    public scoreGrade(data: any) {
        return this.http.post<{
            avg: number;
        }>('res/comment/grade', data);
    }

    public batch(data: {
        categories?: any;
        recommend?: {
            extra?: string
        };
    }) {
        return this.http.post<{
            categories?: ICategory[];
            recommend?: ICategory[];
        }>('res/batch', data);
    }
}
