import { map, Observable, of } from 'rxjs';
import { IControlOption } from '../event';
import { IDataSource, selectItem } from './IDataSource';
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
        public readonly rangeKey: string|number|false = 'id',
        public readonly rangeLabel = 'name',
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
        if ((typeof value === 'undefined' || value === null) && this.items.length > 0) {
            value = this.items[0].value;
        }
        const items = [...this.items];
        selectItem(items, value);
        return of([items]);
    }

    public format(...items: IControlOption[]): any {
        return items.length > 0 ? items[0].value : (typeof this.rangeKey === 'number' ? -1 : null);
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