import { Observable, of } from 'rxjs';
import { IControlOption } from '../event';
import { IDataSource, select } from './IDataSource';

export class ArraySource implements IDataSource {

    constructor(
        items: any[],
        public readonly rangeKey: string|number = 'id',
        public readonly rangeLabel = 'name',
    ) {
        this.items = items.map(this.formatOptionItem);
    }

    private readonly items: IControlOption[];

    public get columnCount(): number {
        return 1;
    }
    public select(items: IControlOption[], next: number): Observable<IControlOption[]> {
        if (next > 0) {
            return of([]);
        }
        const data = [...this.items];
        select(data, items.length > 0 ? items[0].value : data[0].value);
        return of(data);
    }

    public influence(column: number): number {
        return -1;
    }

    public initialize(value?: any): Observable<IControlOption[][]> {
        if (typeof value === 'undefined' || value === null) {
            value = this.items[0].value;
        }
        const items = [...this.items];
        select(items, value);
        return of([items]);
    }

    public format(...items: IControlOption[]): any {
        return items.length > 0 ? items[0].value : null;
    }
    

    private equal(value: IControlOption, target: IControlOption): boolean {
        return value === target || value.value === target.value;
    }


    private formatOptionItem(item: any, index: number): IControlOption {
        const key = this.rangeKey;
        const label = typeof item === 'object' ? item[this.rangeLabel] : item;
        if (typeof key === 'number') {
            return {
                value: index,
                label
            };
        }
        if (key && typeof item === 'object') {
            return {
                value: item[key],
                label
            };
        }
        return {
            value: item,
            label
        };
    }
}