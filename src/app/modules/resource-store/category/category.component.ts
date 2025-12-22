import { form } from '@angular/forms/signals';
import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IPageQueries } from '../../../theme/models/page';
import { SearchService } from '../../../theme/services';
import { parseNumber } from '../../../theme/utils';
import { ICategory, IResource } from '../model';
import { ResourceService } from '../resource.service';

@Component({
    standalone: false,
    selector: 'app-res-category',
    templateUrl: './category.component.html',
    styleUrls: ['./category.component.scss']
})
export class CategoryComponent implements OnInit {
    private readonly service = inject(ResourceService);
    private readonly route = inject(ActivatedRoute);
    private readonly searchService = inject(SearchService);


    public readonly queries = form(signal<IPageQueries>({
        keywords: '',
        page: 1,
        per_page: 20,
        sort: '',
        order: '',
    }));
    public readonly items = signal<IResource[]>([]);
    private hasMore = true;
    public readonly isLoading = signal(false);
    public readonly total = signal(0);
    public data: ICategory;
    public categories: ICategory[] = [];

    ngOnInit() {
        this.route.params.subscribe(params => {
            this.data = {id: params.id} as any;
            if (params.id) {
                this.load(parseNumber(params.id));
            }
        });
        this.route.queryParams.subscribe(params => {
            this.queries().value.update(v => this.searchService.getQueries(params, v));
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
        this.service.categoryList({parent: item.id}).subscribe(res => {
            this.categories = res.data;
        });
        this.tapRefresh();
        this.searchService.pushHistoryState(item.name, window.location.href.replace(/\d+(\?.+)*$/, item.id.toString()));
    }

    public tapRefresh() {
        this.goPage(1);
    }

    public tapPage() {
        this.goPage(this.queries.page().value());
    }

    public tapMore() {
        this.goPage(this.queries.page().value() + 1);
    }

    /**
    * goPage
    */
    public goPage(page: number) {
        if (this.isLoading()) {
            return;
        }
        this.isLoading.set(true);
        const queries = {...this.queries().value(), page};
        this.service.resourceList({...queries, category: this.data?.id}).subscribe({
            next: res => {
                this.items.set(res.data);
                this.hasMore = res.paging.more;
                this.total.set(res.paging.total);
                this.searchService.applyHistory(queries);
                this.queries().value.set(queries);
                this.isLoading.set(false);
            },
            error: () => {
                this.isLoading.set(false);
            }
        });
    }

    public tapSearch() {

        this.tapRefresh();
    }

}
