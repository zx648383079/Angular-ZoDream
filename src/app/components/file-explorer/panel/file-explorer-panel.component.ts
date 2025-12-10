import { Component, OnInit, inject, input, output } from '@angular/core';
import { FILE_PROVIDER, IFileDataSource, IFileItem, IFileProvider } from '../model';
import { IPage } from '../../../theme/models/page';
import { parseNumber } from '../../../theme/utils';

@Component({
    standalone: false,
    selector: 'app-file-explorer-panel',
    templateUrl: './file-explorer-panel.component.html',
    styleUrls: ['./file-explorer-panel.component.scss']
})
export class FileExplorerPanelComponent implements IFileDataSource {
    private service = inject<IFileProvider>(FILE_PROVIDER);


    public readonly editable = input(true);
    public readonly pathChange = output<string>();
    public readonly selectedChange = output<IFileItem>();
    public items: IFileItem[] = [];
    public listViewMode = false;
    public listEditable = false;
    public isChecked = false;
    public sortKey = '';
    public orderAsc = true;
    public queries = {
        path: '',
        keywords: '',
    };
    public page = 1;
    public hasMore = true;
    public isLoading = false;

    public get filterItems() {
        const items = this.items;
        if (!this.sortKey) {
            return items;
        }
        return items.sort((a, b) => {
            const [av, bv] = this.orderAsc ? [this.formatValue(a, this.sortKey), this.formatValue(b, this.sortKey)] : [this.formatValue(b, this.sortKey), this.formatValue(a, this.sortKey)];
            if (av == bv) {
                return 0;
            }
            if (typeof av === 'undefined') {
                return 1;
            }
            if (typeof bv === 'undefined') {
                return -1;
            }
            if (typeof av === 'number') {
                return av > bv ? 1 : -1;
            }
            return (av as string).localeCompare(bv, $localize `en`);
        });
    }

    public get checkedItems() {
        return this.items.filter(i => i.checked);
    }

    public get subtotal() {
        let total = 0;
        for (const item of this.items) {
            if (item.size) {
                total += item.size;
            }
        }
        return total;
    }

    public get count(): number {
        return this.items.length;
    }
    public indexOf(file: IFileItem): number {
        return this.items.indexOf(file);
    }
    public getAt(i: number): IFileItem|undefined {
        if (i < 0 || i >= this.count) {
            return;
        }
        return this.items[i];
    }

    private formatValue(item: IFileItem, k: string) {
        return item[k];
    }

    public search(path: string, keywords?: string) {
        this.queries.path = path;
        this.queries.keywords = keywords ? keywords : '';
        this.tapRefresh();
    }

    public tapAction(type: number, item?: IFileItem) {
        
    }

    public tapSort(i: string, asc?: boolean) {
        if (typeof asc === 'boolean') {
            this.sortKey = i;
            this.orderAsc = asc;
            return;
        }
        if (this.sortKey == i) {
            this.orderAsc = !this.orderAsc;
        } else {
            this.sortKey = i;
            this.orderAsc = true;
        }
    }

    public toggleCheck(item?: IFileItem) {
        if (!item) {
            this.isChecked = !this.isChecked;
            this.items.forEach(i => {
                i.checked = this.isChecked;
            });
            return;
        }
        item.checked = !item.checked;
        if (!item.checked) {
            this.isChecked = false;
            return;
        }
        if (this.checkedItems.length === this.items.length) {
            this.isChecked = true;
        }
    }

    public tapFile(item: IFileItem) {
        if (this.listEditable) {
            if (item.checkable) {
                item.checked = !item.checked;
            }
            return;
        }

        if (item.isFolder) {
            this.pathChange.emit(item.path);
            this.search(item.path);
        } else {
            this.selectedChange.emit(item);
        }
    }

    public tapRefresh() {
        this.goPage(1);
    }

    public tapMore() {
        if (!this.hasMore) {
            return;
        }
        this.goPage(this.page + 1);
    }

    public goPage(page: number) {
        if (this.isLoading) {
            return;
        }
        this.isLoading = true;
        this.service.searchFile({
            ...this.queries,
            page,
        }).subscribe({
            next: (res: IPage<IFileItem>) => {
                this.isLoading = false;
                this.page = page;
                this.hasMore = res.paging ? res.paging.more : false;
                const data = res.data.map(i => {
                    if (!i.icon) {
                        i.icon = i.isFolder ? 'icon-folder-o' : 'icon-file-o';
                    }
                    if (i.size) {
                        i.size = parseNumber(i.size);
                    }
                    return i;
                });
                this.items = page < 2 ? data : [].concat(this.items, data);
            },
            error: _ => {
                this.isLoading = false;
            }
        });
    }
}
