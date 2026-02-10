import { HttpClient } from '@angular/common/http';
import { IControlOption } from '../event';
import { IDataSource } from './IDataSource';
import { Observable, of } from 'rxjs';

export class NetSource implements IDataSource {

    static cacheMaps: {[url: string]: any} = {};

    constructor(
        private readonly http: HttpClient,
        private readonly url: string,
        private readonly searchKey = 'id',
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
    
}