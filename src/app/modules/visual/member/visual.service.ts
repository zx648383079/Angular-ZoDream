import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { IData, IDataOne, IPage } from '../../../theme/models/page';
import { ICategory, ISite, ISiteComponent, ISitePage, IThemeComponent } from '../model';
import { IUploadResult } from '../../../theme/models/open';
import { Router } from '@angular/router';
import { assetUri, uriEncode } from '../../../theme/utils';
import { DialogService } from '../../../components/dialog';

@Injectable({
  providedIn: 'root'
})
export class VisualService {
    private http = inject(HttpClient);
    private router = inject(Router);
    private toastrService = inject(DialogService);



    public search(params: any) {
        return this.http.get<IPage<IThemeComponent>>('tpl/search/dialog', {
            params
        });
    }

    public categoryTree() {
        return this.http.get<IData<ICategory>>('tpl/category/all');
    }

    public componentList(params: any) {
        return this.http.get<IPage<IThemeComponent>>('tpl/member/component', {params});
    }

    public component(id: any) {
        return this.http.get<IThemeComponent>('tpl/member/component/detail', {params: {id}});
    }

    public componentSave(data: any) {
        return this.http.post<IThemeComponent>('tpl/member/component/save', data);
    }

    public componentImport(data: FormData) {
        return this.http.post<IDataOne<boolean>>('tpl/member/component/import', data);
    }

    public componentRemove(id: any) {
        return this.http.delete<IDataOne<boolean>>('tpl/member/component/delete', {params: {id}});
    }

    public siteList(params: any) {
        return this.http.get<IPage<ISite>>('tpl/member/site', {params});
    }

    public siteSave(data: any) {
        return this.http.post<ISite>('tpl/member/site/save', data);
    }

    public siteRemove(id: any) {
        return this.http.delete<IDataOne<boolean>>('tpl/member/site/delete', {params: {id}});
    }

    public sitePageList(params: any) {
        return this.http.get<IPage<ISitePage>>('tpl/member/site/page', {params});
    }

    public sitePageSave(data: any) {
        return this.http.post<ISitePage>('tpl/member/site/page_save', data);
    }

    public sitePageRemove(id: any) {
        return this.http.delete<IDataOne<boolean>>('tpl/member/site/page_delete', {params: {id}});
    }

    public siteComponentList(params: any) {
        return this.http.get<IPage<ISiteComponent>>('tpl/member/site/component', {params});
    }

    public siteComponentAdd(data: any) {
        return this.http.post<ISite>('tpl/member/site/component_add', data);
    }

    public siteComponentRemove(id: any) {
        return this.http.delete<IDataOne<boolean>>('tpl/member/site/component_delete', {params: {id}});
    }

    public authTicket() {
        return this.http.get<IDataOne<string>>('auth/user/ticket');
    }


    public upload(file: File) {
        const data = new FormData();
        data.append('file', file);
        return this.http.post<IUploadResult>('tpl/member/component/upload', data);
    }

    public gotoEditor(item: ISitePage, isPreview = true) {
        const isOpen = true;
        if (!isOpen) {
            this.router.navigate([
                isPreview ? '/visual/preview' : 'visual/editor',
                item.site_id, item.id
            ]);
            return;
        }
        this.authTicket().subscribe({
            next: res => {
                const url = assetUri(uriEncode('auth', {ticket: res.data,  redirect_uri: uriEncode('tpl/admin/visual' + (isPreview ? '/preview' : ''), {
                    site: item.site_id,
                    id: item.id
                })}));
                window.open(url, '_blank');
            },
            error: err => {
                this.toastrService.error(err);
            }
        })
    }
}
