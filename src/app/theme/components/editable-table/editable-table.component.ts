import { Component, EventEmitter, HostListener, Input, OnChanges, Output, SimpleChanges, TemplateRef } from '@angular/core';
import { eachObject } from '../../utils';
import { IColumnLink, ITableHeaderItem } from './model';
import { hasElementByClass } from '../../utils/doc';

@Component({
    standalone: false,
    selector: 'app-editable-table',
    templateUrl: './editable-table.component.html',
    styleUrls: ['./editable-table.component.scss']
})
export class EditableTableComponent implements OnChanges {

    @Input() public items: any[] = [];
    @Input() public columnItems: ITableHeaderItem[] = [];
    @Input() public batchable = true;
    @Input() public searchable = true;
    @Input() public loading = false;
    @Input() public page = 1;
    @Input() public perPage = 20;
    @Input() public total = -1;
    @Input() public action: TemplateRef<any>;
    @Output() public pageChange = new EventEmitter<number>();
    @Output() public remove = new EventEmitter<any[]>();

    public nameItems: IColumnLink[] = [];
    public sortKey = -1;
    public orderAsc = true;
    public checkAll = false;
    public openDrop = false;

    public get checkedItems() {
        return this.searchItems.filter(i => i.checked);
    }

    /**
     * 根据关键词过滤
     */
    public get searchItems() {
        return this.items.filter(i => this.inSearch(i));
    }

    public get filterItems() {
        const items = this.searchItems;
        if (this.sortKey < 0) {
            return items;
        }
        const column = this.columnItems[this.sortKey];
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
    }

    @HostListener('document:click', ['$event']) hideCalendar(event: any) {
        if (!event.target.closest('.drop-menu-btn') && !hasElementByClass(event.path, 'drop-menu-btn')) {
            this.openDrop = false;
        }
    }

    constructor() { }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes.columnItems) {
            this.refreshColumn();
        }
        if (changes.items && this.columnItems.length < 1) {
            this.resetColumn();
        }
    }

    public toggleHidden(i: number) {
        const item = this.columnItems[i];
        if (item.hidden) {
            item.hidden = false;
            this.refreshColumn();
            return;
        }
        if (this.nameItems.length < 2) {
            return;
        }
        item.hidden = true;
        if (this.sortKey === i) {
            this.sortKey = -1;
        }
        this.refreshColumn();
    }

    public tapSort(i: number) {
        if (this.sortKey == i) {
            this.orderAsc = !this.orderAsc;
        } else {
            this.sortKey = i;
            this.orderAsc = typeof this.columnItems[i].asc !== 'boolean' || this.columnItems[i].asc;
        }
    }

    public formatValue(item: any, name: IColumnLink) {
        const header = this.columnItems[name.index];
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
        this.checkAll = !this.checkAll;
        for (const item of this.searchItems) {
            item.checked = this.checkAll;
        }
    }

    public tapRemoveAll() {
        const items = this.checkedItems;
        if (items.length < 1) {
            return;
        }
        this.remove.emit(items);
    }

    public toggleCheck(item: any) {
        item.checked = !item.checked;
        if (!item.checked) {
            this.checkAll = false;
        }
    }

    public tapPage(page: number) {
        this.pageChange.emit(page);
    }

    private inSearch(data: any): boolean {
        for (const item of this.nameItems) {
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
        this.columnItems.forEach((item, i) => {
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
        this.nameItems = items;
    }

    private resetColumn() {
        if (this.items.length < 1) {
            return;
        }
        const column: ITableHeaderItem[] = [];
        let i = -1;
        eachObject(this.items[0], (value, name: string) => {
            i ++;
            column.push({
                name,
                hidden: (typeof value === 'string' && value.length > 50) || i > 6,
            });
        });
        this.columnItems = column;
        this.refreshColumn();
    }
}
