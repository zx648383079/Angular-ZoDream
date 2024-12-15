import { Component, Input, Output, EventEmitter, forwardRef, OnChanges, SimpleChanges, HostListener } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { IDataOne } from '../../../theme/models/page';
import { cloneObject, eachObject } from '../../../theme/utils';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { hasElementByClass } from '../../../theme/utils/doc';

@Component({
    standalone: false,
    selector: 'app-region',
    styleUrls: ['./region.component.scss'],
    templateUrl: 'region.component.html',
    providers: [
        {
          provide: NG_VALUE_ACCESSOR,
          useExisting: forwardRef(() => RegionComponent),
          multi: true
        }
    ]
})
export class RegionComponent<T = any> implements ControlValueAccessor, OnChanges {

    static cacheMaps: {[url: string]: any} = {};

    @Input() public url: string;
    @Input() public range: {
        [key: number]: T
    } | T[];
    @Input() public canYes = false;
    @Input() public placeholder = $localize `Please select...`;
    @Input() public rangeKey = 'id';
    @Input() public rangeLabel = 'name';
    @Input() public rangeChildren = 'children';
    @Output() public columnChange = new EventEmitter<{column: number, value: T}>();

    public value: T[] | T;
    public disabled = false;

    public paths: Array<T> = [];
    public items: Array<T> = [];
    public activeColumn = 0;
    public panelVisible = false;

    private data: {
        [key: number]: T
    } | T[];
    private booted = false;

    private onChange: any = () => { };
    private onTouch: any = () => { };

    constructor(private http: HttpClient) {

    }

    get pathLabel() {
        const items = this.paths.filter(i => i[this.rangeKey]);
        if (items.length < 1) {
            return this.placeholder;
        }
        return items.map(i => i[this.rangeLabel]).join('/');
    }

    @HostListener('document:click', ['$event']) hideCalendar(event: any) {
        if (!(event.target as HTMLDivElement).closest('.selector') && !hasElementByClass(event.path, 'selector-panel-container')) {
            this.panelVisible = false;
        }
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes.url) {
            this.initByUrl(changes.url.currentValue);
        }
        if (changes.range) {
            this.init(changes.range.currentValue);
        }
    }

    public showPanel() {
        if (this.disabled) {
            return;
        }
        this.panelVisible = true;
    }

    private getOrSet(url: string): Observable<any> {
        if (Object.prototype.hasOwnProperty.call(RegionComponent.cacheMaps, url)) {
            return of(RegionComponent.cacheMaps[url]);
        }
        return this.http.get<IDataOne<any>>(url).pipe(map(res => {
            return RegionComponent.cacheMaps[url] = res.data;
        }));
    }

    private initByUrl(url?: string) {
        if (!url) {
            return;
        }
        this.getOrSet(url).subscribe(res => {
            this.init(res);
        });
    }

    private init(data: any) {
        if (!data) {
            return;
        }
        this.data = data;
        this.booted = false;
        this.formatPath();
        this.tapColumn(this.paths.length - 1);
    }

    public tapColumn(column: number) {
        this.items = this.coloumnItems(column);
        this.activeColumn = column;
    }

    public isSelected(item: T): boolean {
        const id = this.paths[this.activeColumn][this.rangeKey];
        return id && item[this.rangeKey] === id;
    }

    public tapClose() {
        this.panelVisible = false;
    }

    public tapYes() {
        this.panelVisible = false;
        this.output();
    }

    private coloumnItems(column: number): T[] {
        let items = this.data;
        for (let i = 0; i < column; i++) {
            const id = this.paths[i][this.rangeKey];
            if (!id) {
                return;
            }
            if (eachObject(items, (item) => {
                if (item[this.rangeKey] === id) {
                    items = item[this.rangeChildren];
                    return false;
                }
            }) !== false) {
                items = [];
            }
        }
        return this.toArr(items);
    }

    public tapCheckedItem(item: T) {
        const column = this.activeColumn;
        const nextColumn = column + 1;
        this.paths[column] = item;
        this.columnChange.emit({
            column,
            value: {...item, children: undefined}
        });
        this.paths.splice(nextColumn);
        const items = this.coloumnItems(nextColumn);
        if (items.length < 1) {
            this.tapYes();
            return;
        }
        this.paths.push({
            [this.rangeLabel]: this.placeholder
        } as any);
        this.items = items;
        this.activeColumn = nextColumn;
    }

    private toArr(data: any): T[] {
        if (typeof data !== 'object') {
            return [];
        }
        if (data instanceof Array) {
            return data;
        }
        return Object.values(data);
    }

    /**
     * 根据ID查找无限树的路径
     */
     public getPath(id: string|number): T[] {
        if (!id) {
            return [];
        }
        const findPath = (data: any): any[] => {
            let res = [];
            eachObject(data, (item) => {
                if (this.eq(item[this.rangeKey], id)) {
                    res = [item];
                    return false;
                }
                if (!Object.prototype.hasOwnProperty.call(item, this.rangeChildren)) {
                    return;
                }
                const args = findPath(item[this.rangeChildren]);
                if (args.length > 0) {
                    res = [item, ...args];
                    return false;
                }
            });
            return res;
        };
        return findPath(this.data);
    }

    private eq(val: any, next: any): boolean {
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

    private formatPath() {
        if (!this.data || this.booted) {
            return;
        }
        let path = [];
        if (!this.value) {
            path = [];
        } else if (typeof this.value !== 'object') {
            path = this.getPath(this.value as any);
        } else if (this.value instanceof Array) {
            path = cloneObject(this.value);
        } else {
            path = this.getPath(this.value[this.rangeKey]);
        }
        if (path.length < 1) {
            path = [
                {
                    [this.rangeLabel]: this.placeholder
                }
            ];
        }
        this.paths = path;
        this.booted = true;
    }

    private output() {
        const path = this.paths.filter(i => {
            return i[this.rangeKey];
        }).map(i => {
            return {
                ...i,
                [this.rangeChildren]: undefined
            };
        });
        if (path.length < 1) {
            return;
        }
        if (typeof this.value === 'undefined' || typeof this.value === 'boolean' || this.value === null) {
            this.value = path[path.length - 1];
        } else if (typeof this.value !== 'object') {
            this.value = path[path.length - 1][this.rangeKey];
        } else if (this.value instanceof Array) {
            this.value = path;
        } else {
            this.value = path[path.length - 1];
        }
        this.onChange(this.value);
    }

    writeValue(obj: any): void {
        this.value = obj;
        this.booted = false;
        this.formatPath();
    }

    registerOnChange(fn: any): void {
        this.onChange = fn;
    }

    registerOnTouched(fn: any): void {
        this.onTouch = fn;
    }

    setDisabledState?(isDisabled: boolean): void {
        this.disabled = isDisabled;
    }
}
