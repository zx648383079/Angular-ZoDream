import { Observable, of } from 'rxjs';
import { IControlOption } from '../event';
import { IDataSource } from './IDataSource';
import { eachObject } from '../../../theme/utils';

export class TreeSource implements IDataSource {

    constructor(
        private readonly items: any,
        private readonly rangeKey = 'id',
        private readonly rangeLabel = 'name',
        private readonly rangeChildren = 'children',
        maxLevel = 0,
    ) {
        if (maxLevel > 0) {
            this.maxLevel = maxLevel;
            return;
        }
        let next = this.first(items);
        let level = 1;
        while (next[this.rangeChildren]) {
            next = this.first(next[this.rangeChildren]);
            level++;
        }
        this.maxLevel = level;
    }

    private maxLevel = 0;

    public get columnCount(): number {
        return this.maxLevel;
    }

    public select(items: IControlOption[], next: number): Observable<IControlOption[]> {
        if (items.length < next) {
            return of([]);
        }
        let src = this.items;
        let i = 0;
        while(next > i) {
            const selected = items[i ++].value;
            let next: any;
            eachObject(src, item => {
                if (this.equal(item[this.rangeKey], selected)) {
                    next = item[this.rangeChildren];
                    return false;
                }
            });
            if (!next) {
                src = [];
                break;
            }
            src = next;
        }
        return of(this.toArray(src));
    }

    public influence(column: number): number {
        return column + 1;
    }

    public initialize(value?: any): Observable<IControlOption[][]> {
        if (!value) {
            return of([this.toArray(this.items)]);
        }
        const data = this.getPath(value);
        const res: IControlOption[][] = [];
        for (let i = 0; i < data.length; i++) {
            const children = i > 0 ? data[i - 1][this.rangeChildren] : this.items;
            res.push(this.toArray(children, data[i]))
        }
        return of(res);
    }

    public format(...items: IControlOption[]): any {
        return items.length > 0 ? items[items.length - 1].value : null;
    }

    public display(...items: any[]): string {
        if (items.length === 0) {
            return '--';
        }
        return items.join(',');
    }
    

    private first(items: any): any {
        if (items instanceof Array) {
            return items.length > 0 ? items[0] : undefined;
        }
        if (typeof items === 'object') {
            for (const key in items) {
                if (!Object.hasOwn(items, key)) {
                    continue;
                }
                return items[key];
            }
        }
        return undefined;
    }

    /**
     * 根据ID查找无限树的路径
     */
    private getPath(id: string|number): any[] {
        if (!id) {
            return [];
        }
        const findPath = (data: any): any[] => {
            let res = [];
            eachObject(data, item => {
                if (this.equal(item[this.rangeKey], id)) {
                    res = [item];
                    return false;
                }
                const rangeChildren = this.rangeChildren;
                if (!Object.prototype.hasOwnProperty.call(item, rangeChildren)) {
                    return;
                }
                const args = findPath(item[rangeChildren]);
                if (args.length > 0) {
                    res = [item, ...args];
                    return false;
                }
            });
            return res;
        };
        return findPath(this.items);
    }



    private equal(val: any, next: any): boolean {
        if (val === next) {
            return true;
        }
        if (!val || !next) {
            return false;
        }
        if (typeof val === typeof next) {
            return false;
        }
        return val.toString() === next.toString();
    }

    private equalOption(value: IControlOption, target: IControlOption): boolean {
        return value === target || this.equal(value.value, target.value);
    }

    private toArray(data: any, selected?: any): IControlOption[] {
        if (typeof data !== 'object') {
            return [];
        }
        const res = data instanceof Array ? data : Object.values(data);
        return res.map(v => {
            return <IControlOption>{
                value: v[this.rangeKey],
                name: v[this.rangeLabel],
                checked: v === selected
            };
        });
    }
}