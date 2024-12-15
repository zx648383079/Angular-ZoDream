import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DialogService } from '../../../../../components/dialog';
import { IPageQueries } from '../../../../../theme/models/page';
import { IBrand, ICategory, IGoods } from '../../../model';
import { SearchService } from '../../../../../theme/services';
import { GoodsService } from '../goods.service';

@Component({
    standalone: false,
  selector: 'app-trash',
  templateUrl: './trash.component.html',
  styleUrls: ['./trash.component.scss']
})
export class TrashComponent implements OnInit {
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
    };
    public categories: ICategory[] = [];
    public brandItems: IBrand[] = [];

    constructor(
        private service: GoodsService,
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
        const queries = {...this.queries, page, trash: true,};
        this.service.get(queries).subscribe({
            next: res => {
                this.isLoading = false;
                this.items = res.data;
                this.hasMore = res.paging.more;
                this.total = res.paging.total;
                this.searchService.applyHistory(this.queries = queries, ['trash']);
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

    public tapRemove(item: IGoods) {
        this.toastrService.confirm('确定彻底删除“' + item.name + '”商品，删除后将无法恢复？', () => {
            this.service.trashRemove(item.id).subscribe(res => {
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

    public tapClear() {
        this.toastrService.confirm('确定彻底清空回收站的商品，删除后将无法恢复？', () => {
            this.service.trashClear().subscribe(res => {
                if (!res.data) {
                    return;
                }
                this.toastrService.success($localize `Delete Successfully`);
                this.items = [];
            });
        });
    }

    public tapRestore(item ? : IGoods) {
        this.toastrService.confirm(item ? '确定还原“' + item.name + '”商品？' : '确定还原所有回收站商品？', () => {
            this.service.trashRestore(item?.id).subscribe(res => {
                if (!res.data) {
                    return;
                }
                this.toastrService.success('还原成功');
                this.items = item ? this.items.filter(it => {
                    return it.id !== item.id;
                }) : [];
            });
        });
    }

}
