import { Component, HostListener, TemplateRef, computed, effect, input, model, output, signal } from '@angular/core';
import { IColumnLink, ITableHeaderItem } from './model';
import { hasElementByClass } from '../../../theme/utils/doc';
import { eachObject } from '../../../theme/utils';

@Component({
    standalone: false,
    selector: 'app-editable-table',
    templateUrl: './editable-table.component.html',
    styleUrls: ['./editable-table.component.scss']
})
export class EditableTableComponent {

    public readonly items = input<any[]>([]);
    public readonly columnItems = model<ITableHeaderItem[]>([]);
    public readonly batchable = input(true);
    public readonly searchable = input(true);
    public readonly loading = input(false);
    public readonly page = input(1);
    public readonly perPage = input(20);
    public readonly total = input(-1);
    public readonly action = input<TemplateRef<any>>(undefined);
    public readonly pageChange = output<number>();
    public readonly remove = output<any[]>();

    public readonly nameItems = signal<IColumnLink[]>([]);
    public readonly sortKey = signal(-1);
    public readonly orderAsc = signal(true);
    public readonly isChecked = signal(false);
    public readonly openDrop = signal(false);

    public readonly checkedItems = computed(() => {
        return this.searchItems().filter(i => i.checked);
    });

    /**
     * 根据关键词过滤
     */
    public readonly searchItems = computed(() => {
        return this.items().filter(i => this.inSearch(i));
    });

    public readonly filterItems = computed(() => {
        const items = this.searchItems();
        if (this.sortKey() < 0) {
            return items;
        }
        const column = this.columnItems()[this.sortKey()];
        const compare = column.compare;
        return items.sort((a, b) => {
            const [av, bv] = this.orderAsc ? [a[column.name], b[column.name]] : [b[column.name], a[column.name]];
            if (compare) {
                return compare(av, bv);
            }
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

    @HostListener('document:click', ['$event']) 
    public hideCalendar(event: any) {
        if (!event.target.closest('.drop-menu-btn') && !hasElementByClass(event.path, 'drop-menu-btn')) {
            this.openDrop.set(false);
        }
    }

    constructor() {
        effect(() => {
            this.refreshColumn();
            if (this.items() && this.columnItems().length < 1) {
                this.resetColumn();
            }
        });
    }


    public toggleDrop() {
        this.openDrop.update(v => !v);
    }

    public toggleHidden(i: number) {
        const item = this.columnItems()[i];
        if (item.hidden) {
            item.hidden = false;
            this.refreshColumn();
            return;
        }
        if (this.nameItems.length < 2) {
            return;
        }
        item.hidden = true;
        this.sortKey.update(v => {
            return v === i ? -1 : v;
        });
        this.refreshColumn();
    }

    public tapSort(i: number) {
        if (this.sortKey() == i) {
            this.orderAsc.update(v => !v);
        } else {
            this.sortKey.set(i);
            const columnItems = this.columnItems();
            this.orderAsc.set(typeof columnItems[i].asc !== 'boolean' || columnItems[i].asc);
        }
    }

    public formatValue(item: any, name: IColumnLink) {
        const header = this.columnItems()[name.index];
        const format = header.format;
        if (typeof format === 'string' && ['img', 'switch', 'size', 'numberFormat', 'ago', 'timestamp'].indexOf(format) >= 0) {
            return '';
        }
        const value = item[name.name];
        if (!format) {
            return value;
        }
        if (typeof format === 'function') {
            return format(value, name.name, header);
        }
        if (header.optionItems && header.optionItems.length > 0) {
            for (const option of header.optionItems) {
                if (option.value == value) {
                    return option.name;
                }
            }
        }
        return value;
    }

    public toggleCheckAll() {
        this.isChecked.update(v => !v);
        const isChecked = this.isChecked();
        for (const item of this.searchItems()) {
            item.checked = isChecked;
        }
    }

    public tapRemoveAll() {
        const items = this.checkedItems();
        if (items.length < 1) {
            return;
        }
        this.remove.emit(items);
    }

    public toggleCheck(item: any) {
        item.checked = !item.checked;
        if (!item.checked) {
            this.isChecked.set(false);
        }
    }

    public tapPage(page: number) {
        this.pageChange.emit(page);
    }

    private inSearch(data: any): boolean {
        for (const item of this.nameItems()) {
            if (!item.value) {
                continue;
            }
            const value = data[item.name];
            if (item.inputType === 'switch') {
                if (this.isTrue(value) === this.isTrue(item.value)) {
                    continue;
                }
                return false;
            }
            if (item.inputType === 'select') {
                if (value === item.value) {
                    continue;
                }
                return false;
            }
            if (typeof value === 'number') {
                if (value == item.value) {
                    continue;
                }
                return false;
            }
            if (!this.isLike(value, item.value)) {
                return false;
            }
        }
        return true;
    }

    private isTrue(val: any) {
        if (typeof val === 'boolean') {
            return val;
        }
        return val > 0;
    };

    private isLike(input: string, keywords: string): boolean {
        return input.indexOf(keywords) >= 0;
    }

    private refreshColumn() {
        const items: IColumnLink[] = [];
        this.columnItems().forEach((item, i) => {
            if (item.hidden) {
                return;
            }
            items.push({
                name: item.name,
                label: item.label || item.name,
                index: i,
                searchable: item.searchable,
                inputType: item.inputType,
                optionItems: item.optionItems,
                editable: item.editable,
                format: item.format,
            });
        });
        this.nameItems.set(items);
    }

    private resetColumn() {
        if (this.items().length < 1) {
            return;
        }
        const column: ITableHeaderItem[] = [];
        let i = -1;
        eachObject(this.items()[0], (value, name: string) => {
            i ++;
            column.push({
                name,
                hidden: (typeof value === 'string' && value.length > 50) || i > 6,
            });
        });
        this.columnItems.set(column);
        this.refreshColumn();
    }
}
