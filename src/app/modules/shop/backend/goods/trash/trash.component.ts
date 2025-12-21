import { form } from '@angular/forms/signals';
import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DialogService } from '../../../../../components/dialog';
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
    private readonly service = inject(GoodsService);
    private readonly toastrService = inject(DialogService);
    private readonly route = inject(ActivatedRoute);
    private readonly searchService = inject(SearchService);

    public readonly items = signal<IGoods[]>([]);
    private hasMore = true;
    public readonly isLoading = signal(false);
    public readonly total = signal(0);
    public readonly queries = form(signal({
        keywords: '',
        category: '',
        brand: '',
        page: 1,
        per_page: 20,
    }));
    public categories: ICategory[] = [];
    public brandItems: IBrand[] = [];

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
        this.isLoading.set(true);
        const queries = {...this.queries().value(), page, trash: true,};
        this.service.get(queries).subscribe({
            next: res => {
                this.isLoading.set(false);
                this.items.set(res.data);
                this.hasMore = res.paging.more;
                this.total.set(res.paging.total);
                this.queries().value.set(queries);
            this.searchService.applyHistory(queries, ['trash']);
            },
            error: () => {
                this.isLoading.set(false);
            }
        });
    }

    public tapSearch() {

        this.tapRefresh();
    }

    public tapRemove(item: IGoods) {
        this.toastrService.confirm('确定彻底删除“' + item.name + '”商品，删除后将无法恢复？', () => {
            this.service.trashRemove(item.id).subscribe(res => {
                if (!res.data) {
                    return;
                }
                this.toastrService.success($localize `Delete Successfully`);
                this.items.update(v => {
                    return v.filter(it => {
                        return it.id !== item.id;
                    });
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
                this.items.set([]);
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
                this.items.update(v => {
                    return item ? v.filter(it => {
                        return it.id !== item.id;
                    }) : []
                });
            });
        });
    }

}
