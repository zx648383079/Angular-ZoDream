import { Component, computed, inject, input, output, signal } from '@angular/core';
import { FILE_PROVIDER, IFileDataSource, IFileItem, IFileProvider } from '../model';
import { IPage } from '../../../theme/models/page';
import { parseNumber } from '../../../theme/utils';
import { form } from '@angular/forms/signals';

@Component({
    standalone: false,
    selector: 'app-file-explorer-panel',
    templateUrl: './file-explorer-panel.component.html',
    styleUrls: ['./file-explorer-panel.component.scss']
})
export class FileExplorerPanelComponent implements IFileDataSource {
    private readonly service = inject<IFileProvider>(FILE_PROVIDER);


    public readonly editable = input(true);
    public readonly pathChange = output<string>();
    public readonly selectedChange = output<IFileItem>();
    public readonly items = signal<IFileItem[]>([]);
    public listViewMode = false;
    public listEditable = false;
    public readonly isChecked = signal(false);
    public sortKey = '';
    public orderAsc = true;
    public readonly queries = form(signal({
        path: '',
        keywords: '',
    }));
    public page = 1;
    public readonly hasMore = signal(true);
    public readonly isLoading = signal(false);

    public readonly filterItems = computed(() => {
        const items = this.items();
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
    });

    public readonly checkedItems = computed(() => {
        return this.items().filter(i => i.checked);
    });

    public readonly subtotal = computed(() => {
        let total = 0;
        for (const item of this.items()) {
            if (item.size) {
                total += item.size;
            }
        }
        return total;
    });

    public readonly count = computed(() => {
        return this.items().length;
    });
    public indexOf(file: IFileItem): number {
        return this.items().indexOf(file);
    }
    public getAt(i: number): IFileItem|undefined {
        if (i < 0 || i >= this.count()) {
            return;
        }
        return this.items[i];
    }

    private formatValue(item: IFileItem, k: string) {
        return item[k];
    }

    public search(path: string, keywords?: string) {
        this.queries().value.update(v => {
            v.path = path;
            v.keywords = keywords ? keywords : '';
            return {...v};
        });
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
            this.isChecked.update(v => !v);
            const isChecked = this.isChecked();
            this.items.update(v => {
                return v.map(i => {
                    i.checked = isChecked;
                    return i;
                });
            });
            return;
        }
        item.checked = !item.checked;
        if (!item.checked) {
            this.isChecked.set(false);
            return;
        }
        if (this.checkedItems().length === this.items().length) {
            this.isChecked.set(true);
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
        if (this.isLoading()) {
            return;
        }
        this.isLoading.set(true);
        this.service.searchFile({
            ...this.queries().value(),
            page,
        }).subscribe({
            next: (res: IPage<IFileItem>) => {
                this.isLoading.set(false);
                this.page = page;
                this.hasMore.set(res.paging ? res.paging.more : false);
                const data = res.data.map(i => {
                    if (!i.icon) {
                        i.icon = i.isFolder ? 'icon-folder-o' : 'icon-file-o';
                    }
                    if (i.size) {
                        i.size = parseNumber(i.size);
                    }
                    return i;
                });
                this.items.update(v => {
                    if (page < 2) {
                        return data;
                    }
                    return [...v, ...data];
                });
            },
            error: _ => {
                this.isLoading.set(false);
            }
        });
    }
}
