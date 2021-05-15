import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DialogService } from '../../../../dialog';
import { IPageQueries } from '../../../../theme/models/page';
import { IBrand, ICategory, IGoods } from '../../../../theme/models/shop';
import { applyHistory, getQueries } from '../../../../theme/query';
import { GoodsService } from '../goods.service';

@Component({
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
            this.queries = getQueries(params, this.queries);
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
        this.service.get(queries).subscribe(res => {
            this.isLoading = false;
            this.items = res.data;
            this.hasMore = res.paging.more;
            this.total = res.paging.total;
            applyHistory(this.queries = queries);
        });
    }

    public tapSearch(form: any) {
        this.queries = getQueries(form, this.queries);
        this.tapRefresh();
    }

    public tapRemove(item: IGoods) {
        if (!confirm('确定彻底删除“' + item.name + '”商品，删除后将无法恢复？')) {
            return;
        }
        this.service.trashRemove(item.id).subscribe(res => {
            if (!res.data) {
                return;
            }
            this.toastrService.success('删除成功');
            this.items = this.items.filter(it => {
                return it.id !== item.id;
            });
        });
    }

    public tapClear() {
        if (!confirm('确定彻底清空回收站的商品，删除后将无法恢复？')) {
            return;
        }
        this.service.trashClear().subscribe(res => {
            if (!res.data) {
                return;
            }
            this.toastrService.success('删除成功');
            this.items = [];
        });
    }

    public tapRestore(item ? : IGoods) {
        if (!confirm(item ? '确定还原“' + item.name + '”商品？' : '确定还原所有回收站商品？')) {
            return;
        }
        this.service.trashRestore(item?.id).subscribe(res => {
            if (!res.data) {
                return;
            }
            this.toastrService.success('还原成功');
            this.items = item ? this.items.filter(it => {
                return it.id !== item.id;
            }) : [];
        });
    }

}
