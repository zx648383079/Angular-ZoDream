import { form } from '@angular/forms/signals';
import { Component, effect, inject, input, model, signal, viewChild } from '@angular/core';
import { IPage, IPageQueries } from '../../../../../theme/models/page';
import { IBrand, ICategory, IGoods, IGoodsResult } from '../../../model';
import { SearchService } from '../../../../../theme/services';
import { ProductDialogComponent } from '../product-dialog/product-dialog.component';
import { HttpClient } from '@angular/common/http';

@Component({
    standalone: false,
    selector: 'app-search-dialog',
    templateUrl: './search-dialog.component.html',
    styleUrls: ['./search-dialog.component.scss']
})
export class SearchDialogComponent {
    private readonly http = inject(HttpClient);
    private readonly searchService = inject(SearchService);


    private readonly modal = viewChild(ProductDialogComponent);
    public readonly multiple = input(false);
    public readonly value = model<IGoodsResult | IGoodsResult[]>(undefined);
    public readonly visible = signal(false);
    public readonly propertyVisible = input(false);
    private confirmFn: (items: IGoodsResult|IGoodsResult[]) => void;
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
    public selectedItems: IGoodsResult[] = [];
    public onlySelected = false;

    constructor() {
        this.http.post<{
            category?: ICategory[];
            brand?: IBrand[];
        }>('shop/admin/batch', {
            category: {},
            brand: {}
        }).subscribe(res => {
            this.categories = res.category;
            this.brandItems = res.brand;
        });
        effect(() => {
            this.value();
            this.formatValue();
        });
    }

    /**
     * 显示
     * @param confirm
     */
    public open();
    public open(confirm: (items: IGoodsResult|IGoodsResult[]) => void);
    public open(confirm?: (items: IGoodsResult|IGoodsResult[], next?: (close: boolean) => void) => void) {
        this.visible.set(true);
        this.confirmFn = confirm;
    }

    public close() {
        this.visible.set(false);
    }

    public tapToggleOnly() {
        this.onlySelected = !this.onlySelected;
    }

    public isSelected(item: IGoods) {
        for (const i of this.selectedItems) {
            if (i.id === item.id) {
                return true;
            }
        }
        return false;
    }

    public tapSelected(item: IGoods) {
        if (!this.multiple()) {
            this.selectProduct(item, data => {
                this.selectedItems = [data];
            });
            return;
        }
        for (let i = 0; i < this.selectedItems.length; i++) {
            if (item.id === this.selectedItems[i].id) {
                this.selectedItems.splice(i, 1);
                return;
            }
        }
        this.selectProduct(item, data => {
            this.selectedItems.push(data);
        });

    }

    private selectProduct(item: IGoods, cb: (item: IGoodsResult) => void) {
        if (!this.propertyVisible() || (item.products && item.products.length < 1) || (!item.products && !item.attribute_group_id)) {
            cb(item);
            return;
        }
        this.modal().open(item, data => {
            if (data) {
                cb(data);
            }
        });
    }

    public tapYes() {
        if (this.multiple()) {
            this.output(this.selectedItems);
            return;
        }
        this.output(this.selectedItems.length > 0 ? this.selectedItems[0] : null);
    }

    private output(items: any) {
        this.value.set(items);
        if (this.confirmFn) {
            this.confirmFn(items);
        }
        this.visible.set(false);
    }

    public tapCancel() {
        this.selectedItems = [];
    }

    public get formatItems(): IGoods[] {
        return this.onlySelected ? this.selectedItems.map(i => i as IGoods) : this.items();
    }


    public get selectedCount() {
        return this.selectedItems.length;
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
        if (this.isLoading()) {
            return;
        }
        this.isLoading.set(true);
        const queries = {...this.queries().value(), page};
        this.search(queries).subscribe({
            next: res => {
                this.isLoading.set(false);
                this.items.set(res.data);
                this.hasMore = res.paging.more;
                this.total.set(res.paging.total);
                this.queries().value.set(queries);
            },
            error: _ => {
                this.isLoading.set(false);
            }
        });
    }

    public tapSearch(e: Event) {
        e.preventDefault();
        this.tapRefresh();
    }

    private formatValue() {
        const value = this.value();
        if (!value) {
            this.selectedItems = [];
            return;
        }
        if (typeof value !== 'object') {

        } else if (value instanceof Array) {
            if (value.length < 1) {
                this.selectedItems = [];
                return;
            }
            if (typeof value[0] === 'object') {
                this.selectedItems = [...value];
                return;
            }
        } else {
            this.selectedItems = [value];
            return;
        }
        this.search({
            id: value,
            per_page: typeof value === 'object' ? value.length : 20,
        }).subscribe(res => {
            this.selectedItems = res.data;
        });
    }

    public search(params: any) {
        return this.http.get<IPage<IGoods>>('shop/admin/goods/search', {
            params
        });
    }
}
