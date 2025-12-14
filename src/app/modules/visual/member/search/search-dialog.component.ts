import { form } from '@angular/forms/signals';
import { Component, inject, input, signal } from '@angular/core';
import { SearchDialogEvent } from '../../../../components/dialog';
import { IPageQueries } from '../../../../theme/models/page';
import { ComponentTypeItems, ICategory, IThemeComponent } from '../../model';
import { VisualService } from '../visual.service';
import { SearchService } from '../../../../theme/services';

@Component({
    standalone: false,
    selector: 'app-search-dialog',
    templateUrl: './search-dialog.component.html',
    styleUrls: ['./search-dialog.component.scss']
})
export class SearchDialogComponent implements SearchDialogEvent {
    private readonly service = inject(VisualService);
    private readonly searchService = inject(SearchService);


    public readonly multiple = input(false);
    public visible = false;
    public items: IThemeComponent[] = [];
    public hasMore = true;
    public isLoading = false;
    public total = 0;
    public readonly queries = form(signal<IPageQueries>({
        keywords: '',
        category: 0,
        type: 0,
        page: 1,
        per_page: 20,
    }));
    public categories: ICategory[] = [];
    public typeItems = ComponentTypeItems;
    public selectedItems: IThemeComponent[] = [];
    public onlySelected = false;
    private confirmFn: (items: IThemeComponent|IThemeComponent[]) => void;
    private checkFn: (items: IThemeComponent[]) => boolean;


    constructor() {
        this.service.categoryTree().subscribe(res => {
            this.categories = res.data;
        });
    }

    public open(confirm: (data: IThemeComponent|IThemeComponent[]) => void): void;
    public open(data: any|any[], confirm: (data: IThemeComponent|IThemeComponent[]) => void): void;
    public open(data: any|any[], confirm: (data: IThemeComponent|IThemeComponent[]) => void, check: (data: IThemeComponent[]) => boolean): void;
    public open(data: any, confirm?: (data: IThemeComponent|IThemeComponent[]) => void, check?: (data: IThemeComponent[]) => boolean) {
        this.visible = true;
        if (typeof data === 'function') {
            this.confirmFn = data;
        } else {
            this.formatValue(data);
            this.confirmFn = confirm;
        }
        this.checkFn = check;
    }

    public close() {
        this.visible = false;
    }

    public tapToggleOnly() {
        this.onlySelected = !this.onlySelected;
    }

    public isSelected(item: IThemeComponent) {
        for (const i of this.selectedItems) {
            if (i.id === item.id) {
                return true;
            }
        }
        return false;
    }

    public tapSelected(item: IThemeComponent) {
        if (!this.multiple()) {
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
        if (this.checkFn && this.checkFn(this.selectedItems) === false) {
            return;
        }
        if (this.multiple()) {
            this.output(this.selectedItems);
            return;
        }
        this.output(this.selectedItems.length > 0 ? this.selectedItems[0] : null);
    }

    private output(items: any) {
        if (this.confirmFn) {
            this.confirmFn(items);
        }
        this.visible = false;
    }

    public tapCancel() {
        this.selectedItems = [];
    }

    public get formatItems(): IThemeComponent[] {
        return this.onlySelected ? this.selectedItems.map(i => i as IThemeComponent) : this.items;
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
        if (this.isLoading) {
            return;
        }
        this.isLoading = true;
        const queries = {...this.queries().value(), page};
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

    public tapSearch() {

        this.tapRefresh();
    }


    private formatValue(data: any) {
        if (!data) {
            this.selectedItems = [];
            return;
        }
        if (typeof data !== 'object') {

        } else if (data instanceof Array) {
            if (data.length < 1) {
                this.selectedItems = [];
                return;
            }
            if (typeof data[0] === 'object') {
                this.selectedItems = [...data];
                return;
            }
        } else {
            this.selectedItems = [data];
            return;
        }
        this.service.search({
            id: data,
            per_page: typeof data === 'object' ? data.length : 20,
        }).subscribe(res => {
            this.selectedItems = res.data;
        });
    }

}
