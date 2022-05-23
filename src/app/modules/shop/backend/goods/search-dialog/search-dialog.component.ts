import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { IPageQueries } from '../../../../../theme/models/page';
import { IBrand, ICategory, IGoods } from '../../../model';
import { getQueries } from '../../../../../theme/query';
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
        this.service.search(queries).subscribe(res => {
            this.isLoading = false;
            this.items = res.data;
            this.hasMore = res.paging.more;
            this.total = res.paging.total;
            this.queries = queries
        }, _ => {
            this.isLoading = false;
        });
    }

    public tapSearch(form: any) {
        this.queries = getQueries(form, this.queries);
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
