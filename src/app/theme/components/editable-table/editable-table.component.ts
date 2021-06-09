import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, TemplateRef } from '@angular/core';
import { eachObject, formatAgo } from '../../utils';
import { IColumnLink, ITableHeaderItem } from './model';

@Component({
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
        return this.items.filter(i => i.checked);
    }

    public get filterItems() {
        return this.items;
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

    public tapSort(i: number) {
        if (this.sortKey == i) {
            this.orderAsc = !this.orderAsc;
        } else {
            this.sortKey = i;
            this.orderAsc = typeof this.columnItems[i].asc !== 'boolean' || this.columnItems[i].asc;
        }
    }

    public formatValue(item: any, name: IColumnLink) {
        const value = item[name.name];
        const header = this.columnItems[name.index];
        const format = header.format;
        if (!format) {
            return value;
        }
        if (typeof format === 'function') {
            return format(value, name.name, header);
        }
        if (format === 'ago') {
            return formatAgo(value);
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
    }

    private resetColumn() {
        if (this.items.length < 1) {
            return;
        }
        const column = [];
        eachObject(this.items[0], (_, name) => {
            column.push({
                name,
            });
        });
        this.columnItems = column;
        this.refreshColumn();
    }
}
