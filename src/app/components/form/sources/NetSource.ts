import { HttpClient } from '@angular/common/http';
import { IControlOption } from '../event';
import { IDataSource } from './IDataSource';
import { map, mergeMap, Observable, of } from 'rxjs';
import { IDataOne } from '../../../theme/models/page';
import { TreeSource } from './TreeSource';
import { eachObject } from '../../../theme/utils';

type FormatFn = (data: any) => IControlOption;

export class NetSource implements IDataSource {

    static cacheMaps: {[url: string]: any} = {};

    public static createArray(http: HttpClient, url: string,
        rangeKey = 'id',
        rangeLabel = 'name'): NetSource {
        return new NetSource(http, url, 1, '', rangeKey, rangeLabel, '');
    }

    public static createSearchArray(http: HttpClient, url: string, searchKey = 'id',
        rangeKey: string|FormatFn = 'id',
        rangeLabel = 'name'): NetSource {
        return new NetSource(http, url, 1, searchKey, rangeKey, rangeLabel, '');
    }

    constructor(
        private readonly http: HttpClient,
        private readonly url: string,
        private readonly maxLevel: number,
        private readonly searchKey = 'id',
        rangeKey: string|FormatFn = 'id',
        private readonly rangeLabel = 'name',
        private readonly rangeChildren = 'children'
    ) {
        if (typeof rangeKey === 'function') {
            this.formatFn = rangeKey;
        } else {
            this.rangeKey = rangeKey;
        }
    }

    private readonly rangeKey: string = 'value';
    private readonly formatFn: FormatFn;

    private convertSource?: IDataSource;

    public get columnCount(): number {
        return this.maxLevel;
    }

    public select(items: IControlOption[], next: number): Observable<IControlOption[]> {
        if (this.convertSource) {
            return this.convertSource.select(items, next);
        }
        if (next > items.length) {
            return of([]);
        }
        return this.getOrSet(next > 0 ? items[next - 1].value : undefined)
            .pipe(map(res => this.toArray(res).map(i => {
                return <IControlOption>{
                    value: i[this.rangeKey],
                    name: i[this.rangeLabel]
                };
            })))
    }

    public influence(column: number): number {
        return column + 1;
    }

    public initialize(value?: any): Observable<IControlOption[][]> {
        if (this.convertSource) {
            return this.convertSource.initialize(value);
        }
        if (this.rangeChildren) {
            return this.getOrSet().pipe(mergeMap(res => {
                this.convertSource = new TreeSource(res, this.rangeKey, this.rangeLabel, this.rangeChildren, this.maxLevel);
                return this.convertSource.initialize(value);
            }));
        } 
        return of([]);
    }

    private toArray(data: any): any[] {
        if (typeof data !== 'object') {
            return [];
        }
        if (data instanceof Array) {
            return data;
        }
        return Object.values(data);
    }

    public format(...items: IControlOption[]): any {
        if (this.convertSource) {
            return this.convertSource.format(...items);
        }
        return null;
    }

    public display(...items: any[]): string {
        if (items.length === 0) {
            return '--';
        }
        return items.join(',');
    }
    
    private getOrSet(query?: string): Observable<any> {
        const key = `${this.url}?${query}`;
        if (Object.prototype.hasOwnProperty.call(NetSource.cacheMaps, key)) {
            return of(NetSource.cacheMaps[key]);
        }
        const params = {};
        if (query) {
            params[this.searchKey] = query;
        }
        return this.http.get<IDataOne<any>>(this.url, {
            params
        }).pipe(map(res => {
            let items = res.data;
            if (this.formatFn) {
                items = [];
                eachObject(res.data, v => {
                    items.push(this.formatFn(v));
                });
            }
            return NetSource.cacheMaps[key] = items;
        }));
    }
}