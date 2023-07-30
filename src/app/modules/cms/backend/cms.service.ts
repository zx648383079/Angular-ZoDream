import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IData, IDataOne, IPage } from '../../../theme/models/page';
import { IItem } from '../../../theme/models/seo';
import { ICmsCategory, ICmsComment, ICmsContent, ICmsFormInput, ICmsGroup, ICmsLinkage, ICmsLinkageData, ICmsModel, ICmsModelField, ICmsSite, ICMSTheme } from '../model';

@Injectable()
export class CmsService {

    constructor(
        private http: HttpClient,
    ) { }

    public siteList(params: any) {
        return this.http.get<IPage<ICmsSite>>('cms/admin/site', {params});
    }

    public site(id: any) {
        return this.http.get<ICmsSite>('cms/admin/site/detail', {
          params: {id},
        });
    }

    public siteSave(data: any) {
        return this.http.post<ICmsSite>('cms/admin/site/save', data);
    }

    public siteRemove(id: any) {
        return this.http.delete<IDataOne<true>>('cms/admin/site/delete', {
          params: {id}
        });
    }

    public siteDefault(id: any) {
        return this.http.post<IDataOne<boolean>>('cms/admin/site/default', {id});
    }

    public option(id: any) {
        return this.http.get<IData<any>>('cms/admin/site/option', {
          params: {id},
        });
    }

    public optionSave(id: any, option: any[]) {
        return this.http.post<IDataOne<boolean>>('cms/admin/site/option_save', {id, option});
    }

    
    public categoryList(site: any) {
        return this.http.get<IData<ICmsCategory>>('cms/admin/category', {params: {site}});
    }

    public categoryAll(site: any) {
        return this.http.get<IData<ICmsCategory>>('cms/admin/category/all', {params: {site}});
    }

    public category(site: any, id: any) {
        return this.http.get<ICmsCategory>('cms/admin/category/detail', {
          params: {site, id},
        });
    }

    public categorySave(data: any) {
        return this.http.post<ICmsCategory>('cms/admin/category/save', data);
    }

    public categoryRemove(site: any, id: any) {
        return this.http.delete<IDataOne<true>>('cms/admin/category/delete', {
          params: {site, id}
        });
    }

    public contentList(params: any) {
        return this.http.get<IPage<ICmsContent>>('cms/admin/content', {params});
    }

    public content(params: any) {
        return this.http.get<ICmsContent>('cms/admin/content/detail', {
          params,
        });
    }

    public contentSave(data: any) {
        return this.http.post<ICmsContent>('cms/admin/content/save', data);
    }

    public contentRemove(params: any) {
        return this.http.delete<IDataOne<true>>('cms/admin/content/delete', {
          params
        });
    }

    public groupList(params: any) {
        return this.http.get<IData<ICmsGroup>>('cms/admin/group', {params});
    }

    public group(id: any) {
        return this.http.get<ICmsGroup>('cms/admin/group/detail', {
          params: {id},
        });
    }

    public groupSave(data: any) {
        return this.http.post<ICmsGroup>('cms/admin/group/save', data);
    }

    public groupRemove(id: any) {
        return this.http.delete<IDataOne<true>>('cms/admin/group/delete', {
          params: {id}
        });
    }


    public modelList(params: any) {
        return this.http.get<IPage<ICmsModel>>('cms/admin/model', {params});
    }

    public model(id: any) {
        return this.http.get<ICmsModel>('cms/admin/model/detail', {
          params: {id},
        });
    }

    public modelSave(data: any) {
        return this.http.post<ICmsModel>('cms/admin/model/save', data);
    }

    public modelRestart(data: any) {
        return this.http.post<IDataOne<boolean>>('cms/admin/model/restart', data);
    }

    public modelRemove(id: any) {
        return this.http.delete<IDataOne<true>>('cms/admin/model/delete', {
          params: {id}
        });
    }

    public modelAll(type: any = 0) {
        return this.http.get<IData<ICmsModel>>('cms/admin/model/all', {params: {type}});
    }

    public fieldList(params: any) {
        return this.http.get<IData<ICmsModelField>>('cms/admin/model/field', {params});
    }

    public field(id: any) {
        return this.http.get<ICmsModelField>('cms/admin/model/field_detail', {
          params: {id},
        });
    }

    public fieldOption(type: string, id: any) {
        return this.http.get<IData<ICmsFormInput>>('cms/admin/model/option', {
          params: {id, type},
        });
    }

    public fieldSave(data: any) {
        return this.http.post<ICmsModelField>('cms/admin/model/field_save', data);
    }

    public fieldRemove(id: any) {
        return this.http.delete<IDataOne<true>>('cms/admin/model/field_delete', {
          params: {id}
        });
    }

    public linkageList(params: any) {
        return this.http.get<IPage<ICmsLinkage>>('cms/admin/linkage', {params});
    }

    public linkage(id: any) {
        return this.http.get<ICmsLinkage>('cms/admin/linkage/detail', {
          params: {id},
        });
    }

    public linkageSave(data: any) {
        return this.http.post<ICmsLinkage>('cms/admin/linkage/save', data);
    }

    public linkageRemove(id: any) {
        return this.http.delete<IDataOne<true>>('cms/admin/linkage/delete', {
          params: {id}
        });
    }

    public linkageDataList(params: any) {
        return this.http.get<IPage<ICmsLinkageData>>('cms/admin/linkage/data', {params});
    }

    public linkageDataSave(data: any) {
        return this.http.post<ICmsLinkageData>('cms/admin/linkage/data_save', data);
    }

    public linkageDataRemove(id: any) {
        return this.http.delete<IDataOne<true>>('cms/admin/linkage/data_delete', {
          params: {id}
        });
    }

    public commentList(params: any) {
        return this.http.get<IPage<ICmsComment>>('cms/admin/comment', {
            params
        });
    }

    public commentRemove(params: any) {
        return this.http.delete<IDataOne<true>>('cms/admin/comment/delete', {
            params
          });
    }

    public statistics() {
        return this.http.get<any>('cms/admin/statistics');
    }

    public batch(data: {
        category?: {
            site: number; 
        },
        group?: any;
        model?: {
            type: number,
        },
        field_type?: any;
        model_tab?: {
            model: number;
        };
        theme?: any;
    }) {
        return this.http.post<{
            category?: ICmsCategory[],
            group?: ICmsGroup[];
            model?: ICmsModel[],
            field_type?: IItem[];
            model_tab?: string[];
            theme?: ICMSTheme[]
        }>('cms/admin/batch', data);
    }

}
