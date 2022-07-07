import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IPageQueries } from '../../../theme/models/page';
import { applyHistory, getQueries } from '../../../theme/query';
import { parseNumber } from '../../../theme/utils';
import { ICategory, IResource } from '../model';
import { ResourceService } from '../resource.service';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss']
})
export class CategoryComponent implements OnInit {

    public queries: IPageQueries = {
        keywords: '',
        page: 1,
        per_page: 20,
        sort: '',
        order: '',
    };
    public items: IResource[] = [];
    public hasMore = true;
    public isLoading = false;
    public total = 0;
    public data: ICategory;
    public categories: ICategory[] = [];

    constructor(
        private service: ResourceService,
        private route: ActivatedRoute,
    ) { }

    ngOnInit() {
        this.route.params.subscribe(params => {
            this.data = {id: params.id} as any;
            if (params.id) {
                this.load(parseNumber(params.id));
            }
        });
        this.route.queryParams.subscribe(params => {
            this.queries = getQueries(params, this.queries);
            this.tapPage();
        });
    }

    private load(id: number) {
        this.service.category(id).subscribe(res => {
            this.data = res;
            this.categories = res.children;
        });
    }

    public tapCategory(item: ICategory) {
        this.data = item;
        this.service.categoryList(item.id).subscribe(res => {
            this.categories = res.data;
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

    /**
    * goPage
    */
    public goPage(page: number) {
        if (this.isLoading) {
            return;
        }
        this.isLoading = true;
        const queries = {...this.queries, page};
        this.service.resourceList({...queries, category: this.data?.id}).subscribe({
            next: res => {
                this.items = res.data;
                this.hasMore = res.paging.more;
                this.total = res.paging.total;
                applyHistory(this.queries = queries);
                this.isLoading = false;
            },
            error: () => {
                this.isLoading = false;
            }
        });
    }

    public tapSearch(form: any) {
        this.queries = getQueries(form, this.queries);
        this.tapRefresh();
    }

}
