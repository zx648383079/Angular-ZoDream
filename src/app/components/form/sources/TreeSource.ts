import { Observable, of } from 'rxjs';
import { IControlOption } from '../event';
import { IDataSource } from './IDataSource';

export class TreeSource implements IDataSource {

    constructor(
        private readonly items: any[],
        public readonly rangeKey = 'id',
        public readonly rangeLabel = 'name',
        public readonly rangeChildren = 'children'
    ) {

    }

    private columnItems: string[] = [];

    public get columnCount(): number {
        return this.columnItems.length;
    }

    public select(items: IControlOption[], next: number): Observable<IControlOption[]> {
        return of([]);
    }

    public influence(column: number): number {
        return -1;
    }

    public initialize(value?: any): Observable<IControlOption[][]> {
        return of([]);
    }

    public format(...items: IControlOption[]): any {
        return null;
    }
    

    private equal(value: IControlOption, target: IControlOption): boolean {
        return value === target || value.value === target.value;
    }

    private formatOption(items: any[], filterFn?: (data: IControlOption) => boolean) {
        const selected = [];//this.selectedItems().map(i => i.value);
        const data = [];
        for (let i = 0; i < items.length; i++) {
            const formatted = this.formatOptionItem(items[i], i);
            if (filterFn && !filterFn(formatted)) {
                continue;
            }
            formatted.selected = selected.includes(formatted.value)
            data.push(formatted);
        }
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