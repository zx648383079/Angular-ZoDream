import { Component, OnInit, inject, signal, viewChild } from '@angular/core';
import { DialogBoxComponent, DialogService } from '../../../../components/dialog';
import { ButtonEvent } from '../../../../components/form';
import { IItem } from '../../../../theme/models/seo';
import { GenerateService } from '../../generate.service';
import { ITableColumn } from '../../model';
import { form } from '@angular/forms/signals';

interface ITableItem {
    schema: string;
    table: string;
    column?: string;
    foreignTable?: string;
    foreignSchema?: string;
    foreignColumn?: string;
}

interface ILinkItem {
    dist: ITableColumn;
    src?: IColumnValue;
}

interface IColumnItem {
    schema: string;
    table: string;
    column: string;
    label: string;
}

interface IColumnValue {
    type: 0|1,
    value: string|number,
    valueType: 'string'|'number',
    column?: IColumnItem,
    append: string|number,
    appendType: 'string'|'number',
    label?: string;
}

@Component({
    standalone: false,
    selector: 'app-copy-table',
    templateUrl: './copy-table.component.html',
    styleUrls: ['./copy-table.component.scss']
})
export class CopyTableComponent implements OnInit {
    private readonly service = inject(GenerateService);
    private readonly toastrService = inject(DialogService);


    public readonly previewModal = viewChild<DialogBoxComponent>('previewModal');
    public distTable?: ITableItem;
    public srcTable: ITableItem[] = [];
    public linkItems: ILinkItem[] = [];


    public schemaItems: IItem[] = [];
    public tableItems: IItem[] = [];
    public columnItems: IColumnItem[] = [];
    public srcColumnItems: IColumnItem[] = [];
    public readonly tableForm = form(signal({
        type: 0,
        schema: '',
        table: '',
        column: '',
        foreign: null,
    }));
    public readonly columnForm = form(signal({
        type: 0,
        value: '',
        valueType: 'string',
        column: null,
        append: '0',
        appendType: 'number',
    }));

    public typeItems: IItem[] = [
        {
            name: '数字',
            value: 'number'
        },
        {
            name: '文本',
            value: 'string',
        },
    ];

    private cacheItems: any = {};

    ngOnInit() {
        this.getSchame(data => {
            this.schemaItems = data.map(i => {
                return {
                    name: i,
                    value: i,
                };
            });
        });
    }

    public tapSubmit(preview = true, e: ButtonEvent) {
        if (!this.distTable || this.srcTable.length < 1) {
            this.toastrService.warning('请选择数据表');
            return;
        }
        for (const item of this.linkItems) {
            if (!item.src) {
                this.toastrService.warning('请设置完整数据');
                return;
            }
        }
        e.enter();
        this.service.copy({
            dist: this.distTable,
            src: this.srcTable,
            column: this.linkItems,
            preview
        }).subscribe({
            next: res => {
                e.reset();
                if (!preview) {
                    this.toastrService.success('复制成功');
                    return;
                }
                this.previewModal().open();
            },
            error: err => {
                e.reset();
                this.toastrService.error(err);
            }
        });
    }

    public formatTable(item: ITableItem) {
        if (!item) {
            return '请选择';
        }
        return item.schema + '.' + item.table;
    }

    public tapDist(modal: DialogBoxComponent) {
        modal.open(() => {
            this.distTable = {
                schema: this.tableForm.schema().value(),
                table: this.tableForm.table().value(),
            };
            this.getColumn(this.distTable, data => {
                this.linkItems = data.map(i => {
                    return {
                        dist: i
                    };
                });
            });
        }, '请选择目标表');
    }

    public tapAddTable(modal: DialogBoxComponent) {
        if (!this.distTable) {
            this.toastrService.warning('请先选择目标表');
            return;
        }
        this.tableForm().value.update(v => {
            v.type = this.srcTable.length > 0 ? 2 : 1;
            v.table = '';
            return {...v};
        })
        modal.open(() => {
            const data = this.tableForm().value();
            const table: ITableItem = {
                schema: data.schema,
                table: data.table,
            };
            if (data.type > 1) {
                table.column = data.column;
                table.foreignColumn = data.foreign.column;
                table.foreignTable = data.foreign.table;
                table.foreignSchema = data.foreign.schema;
            }
            this.srcTable.push(table);
            this.refreshSrcColumn();
            this.autoLinkColumn();
        }, '请选择数据表');
    }

    public tapColumn(modal: DialogBoxComponent, item: ILinkItem) {
        if (this.srcTable.length < 1) {
            this.toastrService.warning('请先选择数据表');
            return;
        }
        this.columnForm().value.update(v => {
            return item.src ? {...item.src} as any : {type: 0, value: '', valueType: 'string', column: undefined, append: '0', appendType: 'number',};
        });
        modal.open(() => {
            const data = this.columnForm().value() as any;
            item.src = {...data, label: this.formatColumnValue(data)};
        }, '选择数据');
    }

    public tapRemoveTable(i: number) {
        this.srcTable.splice(i, 1);
    }

    public tapRemoveItem(i: number) {
        this.linkItems.splice(i, 1);
    }

    public onSchemaChange() {
        this.getTable(this.tableForm.schema().value(), data => {
            this.tableItems = data.map(i => {
                return {
                    name: i,
                    value: i,
                };
            });
        });
    }

    public onTableChange() {
        this.getColumn(this.tableForm().value(), data => {
            this.columnItems = data.map(i => {
                return {
                    schema: this.tableForm.schema().value(),
                    table: this.tableForm.table().value(),
                    column: i.value,
                    label: i.label,
                };
            });
        });
    }

    public tapReset() {
        this.srcColumnItems = [];
        this.srcTable = [];
        this.distTable = undefined;
        this.linkItems = [];
    }

    private formatColumnValue(item: IColumnValue) {
        if (!item) {
            return '请设置';
        }
        if (item.type < 1) {
            return `'${item.value}'`;
        }
        if (!item.append) {
            return `${item.column.label}`;
        }
        return `${item.column.label} + '${item.append}'`;
    }

    private autoLinkColumn() {
        for (const item of this.linkItems) {
            if (item.src) {
                continue;
            }
            for (const column of this.srcColumnItems) {
                if (item.dist.value === column.column) {
                    item.src = {
                        type: 1,
                        column: {...column},
                        label: column.label
                    } as any;
                }
            }
        }
    }

    private refreshSrcColumn() {
        const items: IColumnItem[] = [];
        for (const item of this.srcTable) {
            this.getColumn(item, data => {
                data.forEach(i => {
                    items.push({
                        schema: item.schema,
                        table: item.table,
                        column: i.value,
                        label: `[${item.table}]${i.label}`,
                    });
                });
            });
        }
        this.srcColumnItems = items;
    }

    private getSchame(cb: (data: string[]) => void) {
        const schames = Object.keys(this.cacheItems);
        if (schames.length > 0) {
            return cb(schames);
        }
        this.service.schemaList().subscribe(res => {
            for (const item of res.data) {
                this.cacheItems[item] = {};
            }
            cb(res.data);
        });
    }
    private getTable(schame: string, cb: (data: string[]) => void) {
        const tables = this.cacheItems.hasOwnProperty(schame) ? Object.keys(this.cacheItems[schame]) : [];
        if (tables.length > 0) {
            return cb(tables);
        }
        this.service.tableList(schame).subscribe(res => {
            let obj = {};
            for (const item of res.data) {
                obj[item] = [];
            }
            this.cacheItems[schame] = obj;
            cb(res.data);
        });
    }
    private getColumn(table: string|ITableItem, cb: (data: ITableColumn[]) => void) {
        const [schame, tab] = typeof table === 'object' ? [table.schema, table.table] : table.split('.');
        const columns = this.cacheItems.hasOwnProperty(schame) && this.cacheItems[schame].hasOwnProperty(tab) ? this.cacheItems[schame][tab] : [];
        if (columns.length > 0) {
            return cb(columns);
        }
        this.service.columnList(tab, schame).subscribe(res => {
            this.cacheItems[schame][tab] = res.data;
            cb(res.data);
        });
    }

}
