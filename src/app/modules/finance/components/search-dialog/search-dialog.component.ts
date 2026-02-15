import { Component, computed, inject, input, signal } from '@angular/core';
import { form } from '@angular/forms/signals';
import { ILog, LogTypeItems } from '../../model';
import { SearchDialogEvent } from '../../../../components/dialog';
import { FinanceService } from '../../finance.service';

@Component({
    standalone: false,
    selector: 'app-search-dialog',
    templateUrl: './search-dialog.component.html',
    styleUrls: ['./search-dialog.component.scss']
})
export class SearchDialogComponent implements SearchDialogEvent {

    private readonly service = inject(FinanceService);

    public readonly multiple = input(false);
    public readonly placeholder = input($localize `Select logs`);

    /**
     * 是否显示
     */
    public readonly visible = signal(false);

    public readonly items = signal<ILog[]>([]);
    private hasMore = true;
    public readonly isLoading = signal(false);
    public readonly total = signal(0);
    public readonly queries = form(signal({
        keywords: '',
        type: '0',
        page: 1,
        per_page: 20,
    }));
    public readonly typeItems = ['全部', ...LogTypeItems];
    public readonly selectedItems = signal<ILog[]>([]);
    public readonly onlySelected = signal(false);
    private confirmFn: (items: ILog|ILog[]) => void;
    private checkFn: (items: ILog[]) => boolean;


    public open(confirm: (data: ILog|ILog[]) => void): void;
    public open(data: any|any[], confirm: (data: ILog|ILog[]) => void): void;
    public open(data: any|any[], confirm: (data: ILog|ILog[]) => void, check: (data: ILog[]) => boolean): void;
    public open(data: any, confirm?: (data: ILog|ILog[]) => void, check?: (data: ILog[]) => boolean) {
        this.visible.set(true);
        if (typeof data === 'function') {
            this.confirmFn = data;
        } else {
            this.formatValue(data);
            this.confirmFn = confirm;
        }
        this.checkFn = check;
    }

    public close() {
        this.visible.set(false);
    }

    public tapToggleOnly() {
        this.onlySelected.update(v => !v);
    }

    public isSelected(item: ILog) {
        const items = this.selectedItems();
        for (const i of items) {
            if (i.id === item.id) {
                return true;
            }
        }
        return false;
    }

    public tapSelected(item: ILog) {
        if (!this.multiple()) {
            this.selectedItems.set([item]);
            return;
        }
        this.selectedItems.update(v => {
            for (let i = 0; i < v.length; i++) {
                if (item.id === v[i].id) {
                    v.splice(i, 1);
                    return [...v];
                }
            }
            v.push(item);
            return [...v];
        });
        
    }

    public tapYes() {
        if (this.checkFn && this.checkFn(this.selectedItems()) === false) {
            return;
        }
        if (this.multiple()) {
            this.output(this.selectedItems());
            return;
        }
        this.output(this.selectedItems().length > 0 ? this.selectedItems()[0] : null);
    }

    private output(items: any) {
        if (this.confirmFn) {
            this.confirmFn(items);
        }
        this.visible.set(false);
    }

    public tapCancel() {
        this.selectedItems.set([]);
    }

    public readonly formatItems = computed(() => {
        return this.onlySelected() ? this.selectedItems().map(i => i as ILog) : this.items();
    });


    public readonly selectedCount = computed(() => {
        return this.selectedItems().length;
    });

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
        this.service.search(queries).subscribe({
            next: res => {
                this.isLoading.set(false);
                this.items.set(res.data);
                this.hasMore = res.paging.more;
                this.total.set(res.paging.total);
                this.queries().value.set(queries)
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


    private formatValue(data: any) {
        if (!data) {
            this.selectedItems.set([]);
            return;
        }
        if (typeof data !== 'object') {

        } else if (data instanceof Array) {
            if (data.length < 1) {
                this.selectedItems.set([]);
                return;
            }
            if (typeof data[0] === 'object') {
                this.selectedItems.set([...data]);
                return;
            }
        } else {
            this.selectedItems.set([data]);
            return;
        }
        // this.service.search({
        //     id: data,
        //     per_page: typeof data === 'object' ? data.length : 20,
        // }).subscribe(res => {
        //     this.selectedItems = res.data;
        // });
    }
}
