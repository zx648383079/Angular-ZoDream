import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IData, IPage } from '../../theme/models/page';
import { ICategory, IComment, IResource, IResourceCatalog } from './model';

@Injectable({
  providedIn: 'root'
})
export class ResourceService {

    constructor(
        private http: HttpClient
    ) { }

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

    public resourceCatalog(id: any) {
        return this.http.get<IData<IResourceCatalog>>('res/home/catalog', {params: {id}});
    }

    public resourceSuggest(params: any) {
        return this.http.get<IData<IResource>>('res/home/suggestion', {params});
    }

    public commentList(params: any) {
        return this.http.get<IPage<IComment>>('res/comment', {params});
    }

    public commentSave(data: any) {
        return this.http.post<IComment>('res/comment/save', data);
    }

    public batch(data: {
        categories?: any;
        recommend?: any;
    }) {
        return this.http.post<{
            categories?: ICategory[];
            recommend?: ICategory[];
        }>('res/batch', data);
    }
}
