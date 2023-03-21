import { Component, OnInit } from '@angular/core';
import { ISite } from '../../model';
import { IPageQueries } from '../../../../theme/models/page';
import { VisualService } from '../visual.service';
import { DialogEvent, DialogService } from '../../../../components/dialog';
import { ActivatedRoute } from '@angular/router';
import { SearchService } from '../../../../theme/services';
import { emptyValidate } from '../../../../theme/validators';

@Component({
    selector: 'app-site',
    templateUrl: './site.component.html',
    styleUrls: ['./site.component.scss']
})
export class SiteComponent implements OnInit {

    public items: ISite[] = [];
    public hasMore = true;
    public isLoading = false;
    public total = 0;
    public queries: IPageQueries = {
        keywords: '',
        page: 1,
        per_page: 20
    };
    public editData: ISite = {} as any;

    constructor(
        private service: VisualService,
        private toastrService: DialogService,
        private route: ActivatedRoute,
        private searchService: SearchService,
    ) {
    }

    ngOnInit() {
        this.route.queryParams.subscribe(params => {
            this.queries = this.searchService.getQueries(params, this.queries);
            this.tapPage();
        });
    }

    public open(modal: DialogEvent, item?: ISite) {
        this.editData = item ? Object.assign({}, item) : {
            id: 0,
            name: '',
            thumb: '',
            logo: '',
            title: '',
            keywords: '',
            description: '',
            domain: '',
            is_share: false,
            share_price: 0,
            status: 0,
        };
        modal.open(() => {
            this.service.siteSave(this.editData).subscribe({
                next: () => {
                    this.toastrService.success('保存成功');
                    if (item) {
                        this.tapPage();
                    } else {
                        this.tapRefresh();
                    }
                },
                error: err => {
                    this.toastrService.error(err);
                }
            });
        }, () => {
            return !emptyValidate(this.editData.name);
        });
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
        this.service.siteList(queries).subscribe({
            next: res => {
                this.items = res.data;
                this.hasMore = res.paging.more;
                this.total = res.paging.total;
                this.searchService.applyHistory(this.queries = queries);
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

    public tapRemove(item: ISite) {
        this.toastrService.confirm('确定删除“' + item.name + '”站点？', () => {
            this.service.siteRemove(item.id).subscribe(res => {
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
