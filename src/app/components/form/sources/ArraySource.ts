import { map, Observable, of } from 'rxjs';
import { IControlOption } from '../event';
import { IDataSource, selectIndex, selectItem, selectItems } from './IDataSource';
import { IItem } from '../../../theme/models/seo';

export class ArraySource implements IDataSource {

    /**
     * 以序号为值
     * @param items
     * @returns 
     */
    public static fromOrder(...items: (string|number)[]): ArraySource {
        return new ArraySource(items, 1);
    }

    /**
     * 以项为值
     * @param items 
     * @returns 
     */
    public static fromValue(...items: (string|number)[]): ArraySource {
        return new ArraySource(items, '');
    }

    public static fromItems(items: IItem[]): ArraySource {
        return new ArraySource(items, 'value');
    }

    /**
     * 直接创建不需要再格式化
     * @param items 
     * @returns 
     */
    public static from(items: IControlOption[]): ArraySource {
        return new ArraySource(items, false);
    }

    public static readonly empty = new ArraySource([]);

    constructor(
        items: any[],
        private readonly rangeKey: string|number|false = 'id',
        private readonly rangeLabel = 'name',
        private readonly valueIsObject = false

    ) {
        if (this.rangeKey === false) {
            this.items = items;
            return;
        }
        this.items = items.map(this.formatOptionItem.bind(this));
    }

    public readonly items: IControlOption[];

    public get columnCount(): number {
        return 1;
    }
    public select(items: IControlOption[], next: number): Observable<IControlOption[]> {
        if (next > 0) {
            return of([]);
        }
        const data = [...this.items];
        if (data.length > 0) {
            selectItem(data, items.length > 0 ? items[0].value : data[0].value);
        }
        return of(data);
    }

    public search(items: IControlOption[], column: number, keywords: string): Observable<IControlOption[]> {
        const res = this.select(items, column);
        if (!keywords) {
            return res;
        }
        return res.pipe(map(res => res.filter(i => i.name.indexOf(keywords) >= 0)));
    }

    public influence(column: number): number {
        return -1;
    }

    public initialize(value?: any): Observable<IControlOption[][]> {
        const items = [...this.items];
        if (value instanceof Array) {
            const selected = this.valueIsObject ? value.map(i => i[this.rangeKey as string]) : value;
            selectItems(items, ...selected);
        } else if ((typeof value === 'undefined' || value === null) && this.items.length > 0) {
            selectIndex(items, 0);
        } else if (!this.valueIsObject && typeof value !== 'object') {
            selectItem(items, value);
        } else if (typeof value === 'object' && value !== null) {
            selectItem(items, value[this.rangeKey as string]);
        }
        return of([items]);
    }

    public format(...items: IControlOption[]): any {
        if (items.length === 0) {
            return typeof this.rangeKey === 'number' ? -1 : null;
        }
        if (items.length > 1) {
            return items.map(i => this.format(i));
        }
        const val = items[0];
        if (!this.valueIsObject) {
            return val.value;
        }
        if (val.created) {
            return {
                [this.rangeLabel]: val.name,
            };
        }
        return {
            [this.rangeKey as string]: val.value,
            [this.rangeLabel]: val.name,
        };
    }
    
    public display(...items: any[]): string {
        const selected = this.items.filter(i => items.indexOf(i.value) >= 0).map(i => i.name);
        if (selected.length === 0) {
            return '--';
        }
        return selected.join(',');
    }

    private equal(value: IControlOption, target: IControlOption): boolean {
        return value === target || value.value === target.value;
    }


    private formatOptionItem(item: any, index: number): IControlOption {
        const key = this.rangeKey;
        const name = typeof item === 'object' ? item[this.rangeLabel] : item;
        if (typeof key === 'number') {
            return {
                value: index,
                name
            };
        }
        if (key && typeof item === 'object') {
            return {
                value: item[key],
                name
            };
        }
        return {
            value: item,
            name
        };
    }
}