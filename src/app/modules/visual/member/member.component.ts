import { Component, OnInit } from '@angular/core';
import { ComponentTypeItems, ICategory, IThemeComponent } from '../model';
import { IPageQueries } from '../../../theme/models/page';
import { VisualService } from './visual.service';
import { DialogService } from '../../../components/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { SearchService } from '../../../theme/services';
import { UploadButtonEvent } from '../../../components/form';

@Component({
    standalone: false,
    selector: 'app-member',
    templateUrl: './member.component.html',
    styleUrls: ['./member.component.scss']
})
export class MemberComponent implements OnInit {

    public items: IThemeComponent[] = [];
    public hasMore = true;
    public isLoading = false;
    public total = 0;
    public queries: IPageQueries = {
        keywords: '',
        category: 0,
        type: 0,
        page: 1,
        per_page: 20
    };
    public categories: ICategory[] = [];
    public typeItems = ComponentTypeItems;

    constructor(
        private service: VisualService,
        private toastrService: DialogService,
        private route: ActivatedRoute,
        private searchService: SearchService,
    ) {
    }

    ngOnInit() {
        this.service.categoryTree().subscribe(res => {
            this.categories = res.data;
        });
        this.route.queryParams.subscribe(params => {
            this.queries = this.searchService.getQueries(params, this.queries);
            this.tapPage();
        });
    }

    public onImport(e: UploadButtonEvent) {
        e.enter();
        const formData = new FormData();
        formData.append('file', e.files[0]);
        this.service.componentImport(formData).subscribe({
            next: _ => {
                e.reset();
                this.toastrService.success($localize `Import component success`);
                this.tapRefresh();
            },
            error: err => {
                e.reset();
                this.toastrService.error(err);
            }
        })
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
        this.service.componentList(queries).subscribe({
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

    public tapRemove(item: IThemeComponent) {
        this.toastrService.confirm($localize `Are you sure to delete"${item.name}"?`, () => {
            this.service.componentRemove(item.id).subscribe(res => {
                if (!res.data) {
                    return;
                }
                this.toastrService.success($localize `Delete Successfully`);
                this.items = this.items.filter(it => {
                    return it.id !== item.id;
                });
            });
        })
    }

}
