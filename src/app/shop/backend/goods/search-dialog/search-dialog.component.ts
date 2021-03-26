import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { IBrand, ICategory, IGoods } from '../../../../theme/models/shop';
import { GoodsService } from '../goods.service';

@Component({
  selector: 'app-search-dialog',
  templateUrl: './search-dialog.component.html',
  styleUrls: ['./search-dialog.component.scss']
})
export class SearchDialogComponent implements OnChanges  {

    @Input() public multiple = false;
    @Input() public value: any;
    @Output() public valueChange = new EventEmitter<IGoods|IGoods[]>();
    @Output() public cancel = new EventEmitter();
    public items: IGoods[] = [];
    public hasMore = true;
    public page = 1;
    public perPage = 20;
    public isLoading = false;
    public total = 0;
    public keywords = '';
    public category = 0;
    public brand = 0;
    public categories: ICategory[] = [];
    public brandItems: IBrand[] = [];
    public selectedItems: IGoods[] = [];
    public onlySelected = false;

    constructor(
        private service: GoodsService,
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
            this.selectedItems = [item];
            return;
        }
        for (let i = 0; i < this.selectedItems.length; i++) {
            if (item.id === this.selectedItems[i].id) {
                this.selectedItems.splice(i, 1);
                return;
            }
        }
        this.selectedItems.push(item);
    }

    public tapYes() {
        if (this.multiple) {
            this.valueChange.emit(this.selectedItems);
            return;
        }
        this.valueChange.emit(this.selectedItems.length > 0 ? this.selectedItems[0] : null);
    }

    public tapCancel() {
        this.cancel.emit();
    }

    public get formatItems() {
        return this.onlySelected ? this.selectedItems : this.items;
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
        this.goPage(this.page);
    }

    public tapMore() {
        this.goPage(this.page + 1);
    }

    /**
     * goPage
     */
    public goPage(page: number) {
        if (this.isLoading) {
            return;
        }
        this.isLoading = true;
        this.service.search({
            keywords: this.keywords,
            category: this.category,
            brand: this.brand,
            page,
            per_page: this.perPage
        }).subscribe(res => {
            this.isLoading = false;
            this.items = res.data;
            this.hasMore = res.paging.more;
            this.total = res.paging.total;
        }, _ => {
            this.isLoading = false;
        });
    }

    public tapSearch(form: any) {
        this.keywords = form.keywords;
        this.category = form.cat_id || 0;
        this.brand = form.brand_id || 0;
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
