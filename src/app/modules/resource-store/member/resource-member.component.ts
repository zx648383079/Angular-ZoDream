import { Component, OnInit } from '@angular/core';
import { ICategory, IResource } from '../model';
import { IPageQueries } from '../../../theme/models/page';
import { ResourceService } from './resource.service';
import { DialogService } from '../../../components/dialog';
import { ActivatedRoute } from '@angular/router';
import { SearchService } from '../../../theme/services';

@Component({
    standalone: false,
    selector: 'app-resource-member',
    templateUrl: './resource-member.component.html',
    styleUrls: ['./resource-member.component.scss']
})
export class ResourceMemberComponent implements OnInit {

public items: IResource[] = [];
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

    constructor(
        private service: ResourceService,
        private toastrService: DialogService,
        private route: ActivatedRoute,
        private searchService: SearchService,
    ) {
    }

    ngOnInit() {
        this.service.categoryAll().subscribe(res => {
            this.categories = res;
        });
        this.route.queryParams.subscribe(params => {
            this.queries = this.searchService.getQueries(params, this.queries);
            this.tapPage();
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
        this.service.resourceList(queries).subscribe({
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

    public tapRemove(item: IResource) {
        this.toastrService.confirm($localize `Are you sure to delete"${item.title}"?`, () => {
            this.service.resourceRemove(item.id).subscribe(res => {
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
