import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, ViewChild } from '@angular/core';
import { IPageQueries } from '../../../../../theme/models/page';
import { IBrand, ICategory, IGoods, IGoodsResult } from '../../../model';
import { SearchService } from '../../../../../theme/services';
import { GoodsService } from '../goods.service';
import { ProductDialogComponent } from '../product-dialog/product-dialog.component';

@Component({
  selector: 'app-search-dialog',
  templateUrl: './search-dialog.component.html',
  styleUrls: ['./search-dialog.component.scss']
})
export class SearchDialogComponent implements OnChanges  {

    @ViewChild(ProductDialogComponent)
    private modal: ProductDialogComponent;
    @Input() public multiple = false;
    @Input() public value: any;
    @Input() public visible = false;
    @Input() public propertyVisible = false;
    @Output() public valueChange = new EventEmitter<IGoodsResult|IGoodsResult[]>();
    private confirmFn: (items: IGoodsResult|IGoodsResult[]) => void;
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
    public selectedItems: IGoodsResult[] = [];
    public onlySelected = false;

    constructor(
        private service: GoodsService,
        private searchService: SearchService,
    ) {
        this.service.categoryAll().subscribe(res => {
            this.categories = res.data;
        });
        this.service.brandAll().subscribe(res => {
            this.brandItems = res.data;
        });
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes.value) {
            this.formatValue();
        }
    }

    /**
     * 显示
     * @param confirm 
     */
    public open();
    public open(confirm: (items: IGoodsResult|IGoodsResult[]) => void);
    public open(confirm?: (items: IGoodsResult|IGoodsResult[], next?: (close: boolean) => void) => void) {
        this.visible = true;
        this.confirmFn = confirm;
    }

    public close() {
        this.visible = false;
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
        if (!this.multiple) {
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
        if (!this.propertyVisible || (item.products && item.products.length < 1) || (!item.products && !item.attribute_group_id)) {
            cb(item);
            return;
        }
        this.modal.open(item, data => {
            if (data) {
                cb(data);
            }
        });
    }

    public tapYes() {
        if (this.multiple) {
            this.output(this.selectedItems);
            return;
        }
        this.output(this.selectedItems.length > 0 ? this.selectedItems[0] : null);
    }

    private output(items: any) {
        this.valueChange.emit(items);
        if (this.confirmFn) {
            this.confirmFn(items);
        }
        this.visible = false;
    }

    public tapCancel() {
        this.selectedItems = [];
    }

    public get formatItems(): IGoods[] {
        return this.onlySelected ? this.selectedItems.map(i => i as IGoods) : this.items;
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
        this.service.search(queries).subscribe({
            next: res => {
                this.isLoading = false;
                this.items = res.data;
                this.hasMore = res.paging.more;
                this.total = res.paging.total;
                this.queries = queries
            }, 
            error: _ => {
                this.isLoading = false;
            }
        });
    }

    public tapSearch(form: any) {
        this.queries = this.searchService.getQueries(form, this.queries);
        this.tapRefresh();
    }

    private formatValue() {
        if (!this.value) {
            this.selectedItems = [];
            return;
        }
        if (typeof this.value !== 'object') {

        } else if (this.value instanceof Array) {
            if (this.value.length < 1) {
                this.selectedItems = [];
                return;
            }
            if (typeof this.value[0] === 'object') {
                this.selectedItems = [...this.value];
                return;
            }
        } else {
            this.selectedItems = [this.value];
            return;
        }
        this.service.search({
            id: this.value,
            per_page: typeof this.value === 'object' ? this.value.length : 20,
        }).subscribe(res => {
            this.selectedItems = res.data;
        });
    }

}
