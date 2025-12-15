import { form } from '@angular/forms/signals';
import { Component, OnInit, inject, signal } from '@angular/core';
import {
    GoodsService
} from '../goods.service';
import {
    IBrand,
    ICategory,
    IGoods
} from '../../../model';
import {
    ActivatedRoute
} from '@angular/router';
import { IPageQueries } from '../../../../../theme/models/page';
import { SearchService } from '../../../../../theme/services';
import { DialogService } from '../../../../../components/dialog';

@Component({
    standalone: false,
    selector: 'app-list',
    templateUrl: './list.component.html',
    styleUrls: ['./list.component.scss'],
})
export class ListComponent implements OnInit {
    private readonly service = inject(GoodsService);
    private readonly toastrService = inject(DialogService);
    private readonly route = inject(ActivatedRoute);
    private readonly searchService = inject(SearchService);


    public items: IGoods[] = [];
    public hasMore = true;
    public isLoading = false;
    public total = 0;
    public readonly queries = form(signal<IPageQueries>({
        keywords: '',
        category: 0,
        brand: 0,
        page: 1,
        per_page: 20,
        is_best: 0,
        is_hot: 0,
        is_new: 0,
        sort: 'id',
        order: 'desc',
    }));
    public categories: ICategory[] = [];
    public brandItems: IBrand[] = [];
    public panelOpen = false;

    constructor() {
        this.service.categoryAll().subscribe(res => {
            this.categories = res.data;
        });
        this.service.brandAll().subscribe(res => {
            this.brandItems = res.data;
        });
    }

    ngOnInit() {
        this.route.queryParams.subscribe(params => {
            this.queries().value.update(v => this.searchService.getQueries(params, v));
            this.tapPage();
        });
    }

    public tapSort(key: string) {
        if (this.queries.sort === key) {
            this.queries.order = this.queries.order == 'desc' ? 'asc' : 'desc';
        } else {
            this.queries.sort = key;
            this.queries.order = 'desc';
        }
        this.tapRefresh();
    }


    /**
     * tapRefresh
     */
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
        if (this.isLoading) {
            return;
        }
        this.isLoading = true;
        const queries = {...this.queries().value(), page};
        this.service.get(queries).subscribe(res => {
            this.isLoading = false;
            this.items = res.data;
            this.hasMore = res.paging.more;
            this.total = res.paging.total;
            this.searchService.applyHistory(queries);
                this.queries().value.set(queries);
        });
    }

    public tapSearch() {

        this.tapRefresh();
    }

    public tapRemove(item: IGoods) {
        this.toastrService.confirm('确定删除“' + item.name + '”商品？', () => {
            this.service.goodsRemove(item.id).subscribe(res => {
                if (!res.data) {
                    return;
                }
                this.toastrService.success($localize `Delete Successfully`);
                this.items = this.items.filter(it => {
                    return it.id !== item.id;
                });
            });
        });
    }

}
