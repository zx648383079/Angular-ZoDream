import { Component, OnInit } from '@angular/core';
import { IBrand, ICategory, IGoods } from '../../model';
import { ActivatedRoute } from '@angular/router';
import { DialogService } from '../../../../components/dialog';
import { IPageQueries } from '../../../../theme/models/page';
import { SearchService } from '../../../../theme/services';
import { ShopService } from '../shop.service';
import { PanelAnimation } from '../../../../theme/constants';

@Component({
    standalone: false,
    selector: 'app-product',
    templateUrl: './product.component.html',
    styleUrls: ['./product.component.scss'],
    animations: [
        PanelAnimation,
    ]
})
export class ProductComponent implements OnInit {

    public items: IGoods[] = [];
    public hasMore = true;
    public isLoading = false;
    public total = 0;
    public queries: IPageQueries = {
        keywords: '',
        category: 0,
        brand: 0,
        page: 1,
        per_page: 20,
        is_best: 0,
        is_hot: 0,
        is_new: 0,
    };
    public categories: ICategory[] = [];
    public brandItems: IBrand[] = [];
    public panelOpen = false;

    constructor(
        private service: ShopService,
        private toastrService: DialogService,
        private route: ActivatedRoute,
        private searchService: SearchService,
    ) {
        this.service.categoryAll().subscribe(res => {
            this.categories = res.data;
        });
        this.service.brandAll().subscribe(res => {
            this.brandItems = res.data;
        });
    }

    ngOnInit() {
        this.route.queryParams.subscribe(params => {
            this.queries = this.searchService.getQueries(params, this.queries);
            this.tapPage();
        });
    }


    /**
     * tapRefresh
     */
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
        this.service.goodsList(queries).subscribe(res => {
            this.isLoading = false;
            this.items = res.data;
            this.hasMore = res.paging.more;
            this.total = res.paging.total;
            this.searchService.applyHistory(this.queries = queries);
        });
    }

    public tapSearch(form: any) {
        this.queries = this.searchService.getQueries(form, this.queries);
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
