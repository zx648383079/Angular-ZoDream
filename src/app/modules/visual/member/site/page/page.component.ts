import { Component, OnInit } from '@angular/core';
import { ISitePage } from '../../../model';
import { IPageQueries } from '../../../../../theme/models/page';
import { VisualService } from '../../visual.service';
import { DialogEvent, DialogService } from '../../../../../components/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { SearchService } from '../../../../../theme/services';
import { emptyValidate } from '../../../../../theme/validators';
import { assetUri, uriEncode } from '../../../../../theme/utils';

@Component({
    selector: 'app-site-page',
    templateUrl: './page.component.html',
    styleUrls: ['./page.component.scss']
})
export class SitePageComponent implements OnInit {

    public items: ISitePage[] = [];
    public hasMore = true;
    public isLoading = false;
    public total = 0;
    public queries: IPageQueries = {
        keywords: '',
        site: 0,
        page: 1,
        per_page: 20
    };
    public editData: ISitePage = {} as any;

    constructor(
        private service: VisualService,
        private toastrService: DialogService,
        private route: ActivatedRoute,
        private router: Router,
        private searchService: SearchService,
    ) {
    }

    ngOnInit() {
        this.route.params.subscribe(params => {
            this.queries = this.searchService.getQueries(params, this.queries);
        });
        this.route.queryParams.subscribe(params => {
            this.queries = this.searchService.getQueries(params, this.queries);
            this.tapPage();
        });
    }

    public open(modal: DialogEvent, item: ISitePage) {
        this.editData = Object.assign({}, item);
        modal.open(() => {
            this.service.sitePageSave(this.editData).subscribe({
                next: () => {
                    this.toastrService.success('保存成功');
                    this.tapPage();
                },
                error: err => {
                    this.toastrService.error(err);
                }
            });
        }, () => {
            return !emptyValidate(this.editData.name);
        });
    }

    public tapPreview(item: ISitePage) {
        this.gotoWeb(item, true);
    }

    public tapEditor(item: ISitePage) {
        this.gotoWeb(item, false);
    }

    private gotoWeb(item: ISitePage, isPreview = true) {
        const isOpen = true;
        if (!isOpen) {
            this.router.navigate([
                isPreview ? '/visual/preview' : 'visual/editor',
                item.site_id, item.id
            ]);
            return;
        }
        this.service.authTicket().subscribe({
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

    public tapBack() {
        history.back();
    }

    public tapRefresh() {
        this.goPage(1);
    }

    public tapPage() {
        this.goPage(this.queries.page);
    }

    public tapMore() {
        this.goPage(this.queries.page + 1);
    }

    
    public goPage(page: number) {
        if (this.isLoading) {
            return;
        }
        this.isLoading = true;
        const queries = {...this.queries, page};
        this.service.sitePageList(queries).subscribe({
            next: res => {
                this.items = res.data;
                this.hasMore = res.paging.more;
                this.total = res.paging.total;
                this.searchService.applyHistory(this.queries = queries, ['site']);
                this.isLoading = false;
            },
            error: () => {
                this.isLoading = false;
            }
        });
    }

    public tapSearch(form: any) {
        this.queries = this.searchService.getQueries(form, this.queries);
        this.tapRefresh();
    }

    public tapRemove(item: ISitePage) {
        this.toastrService.confirm('确定删除“' + item.name + '”页面？', () => {
            this.service.sitePageRemove(item.id).subscribe(res => {
                if (!res.data) {
                    return;
                }
                this.toastrService.success('删除成功');
                this.items = this.items.filter(it => {
                    return it.id !== item.id;
                });
            });
        })
    }

}
