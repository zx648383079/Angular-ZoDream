import { Observable, of, Subscribable } from 'rxjs';
import { IControlOption } from '../event';
import { IDataSource } from './IDataSource';
import { parseDate, rangeStep, twoPad } from '../../../theme/utils';

export class DateSource implements IDataSource {

    constructor(
        private readonly dateFormat: string = 'yyyy-mm-dd',
        private readonly min = new Date('1970/01/01 00:00:00'),
        private readonly max = new Date('2050/12/31 23:59:59'),
        private readonly preselect = new Date()
    ) {
        const allows = ['y', 'm', 'd', 'h', 'i', 's'];
        let last = '';
        let count = 0;
        for (let i = 0; i < dateFormat.length; i++) {
            const code = dateFormat[i];
            if (allows.indexOf(code) < 0) {
                continue;
            }
            if (code === last) {
                count ++;
                continue;
            }
            if (last) {
                this.columnItems.push({
                    format: last,
                    padding: count
                });
            }
            last = code;
            count = 1;
        }
        this.columnItems.push({
            format: last,
            padding: count
        });
    }

    private columnItems: {
        format: string,
        padding: number;
    }[] = [];

    public get columnCount(): number {
        return this.columnItems.length;
    }

    public select(items: IControlOption[], next: number): Observable<IControlOption[]> {
        if (next >= this.columnItems.length) {
            return of([]);
        }
        const column = this.columnItems[items.length];
        let maxDay = 31;
        if (column.format === 'd') {
            maxDay = this.getLastOfMonth(this.getFromSelected('y', items), this.getFromSelected('m', items));
        }
        return of(this.create(column.format, maxDay));
    }

    public initialize(value?: any): Observable<IControlOption[][]> {
        const val = value ? parseDate(value) : this.preselect;
        const maxDay = this.getLastOfMonth(val.getFullYear(), val.getMonth() + 1);
        const items = [];
        for (const column of this.columnItems) {
            items.push(this.create(column.format, maxDay, this.get(column.format, val)));
        }
        return of(items);
    }

    public format(...items: IControlOption[]): any {
        if (items.length === 0) {
            return '';
        }
        let value = this.dateFormat;
        const max = Math.min(this.columnItems.length, items.length);
        for (let i = 0; i < max; i++) {
            const src = this.columnItems[i];
            const match = value.match(new RegExp('(' + src.format + '+)'));
            if (match) {
                value = value.replace(match[1], 
                    (items[i].value as number).toString().padStart(src.padding, '0'));
            }
        }
        return value;
    }

    private getLastOfMonth(y: number, m: number): number {
        const date = new Date(y, m, 0);
        return date.getDate();
    }

    private indexOf(format: string): number {
        for (let i = 0; i < this.columnItems.length; i++) {
            if (this.columnItems[i].format === format) {
                return i;
            }
        }
        return -1;
    }

    private getFromSelected(format: string, items: IControlOption[]): number {
        const index = this.indexOf(format);
        if (index < 0 || index >= items.length) {
            return this.get(format, this.preselect);
        }
        return items[index].value;
    }

    private get(format: string, val: Date): number {
        switch(format) {
            case 'y':
                return val.getFullYear();
            case 'm':
                return val.getMonth() + 1;
            case 'd':
                return val.getDate();
            case 'h':
                return val.getHours();
            case 'i':
                return val.getMinutes();
            case 's':
                return val.getSeconds();
            default:
                return 0;
        }
    }

    private create(format: string, maxDay = 31, selected?: number): IControlOption[] {
        switch(format) {
            case 'y':
                return rangeStep(this.min.getFullYear(), this.max.getFullYear(), 1, i => {
                    return <IControlOption>{
                        label: i.toString(),
                        value: i,
                        selected: i === selected
                    };
                });
            case 'm':
                return rangeStep(1, 12, 1, i => {
                    return <IControlOption>{
                        label: twoPad(i),
                        value: i,
                        selected: i === selected
                    };
                });
            case 'd':
                return rangeStep(1, maxDay, 1, i => {
                    return <IControlOption>{
                        label: twoPad(i),
                        value: i,
                        selected: i === selected
                    };
                });
            case 'h':
                return rangeStep(0, 23, 1, i => {
                    return <IControlOption>{
                        label: twoPad(i),
                        value: i,
                        selected: i === selected
                    };
                });
            case 'i':
            case 's':
                return rangeStep(0, 59, 1, i => {
                    return <IControlOption>{
                        label: twoPad(i),
                        value: i,
                        selected: i === selected
                    };
                });
            default:
                return [];
        }
    }
    
}