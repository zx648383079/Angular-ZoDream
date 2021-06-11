import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IData, IPage } from '../theme/models/page';
import { IItem } from '../theme/models/seo';
import { IColumn, ITable, ITableColumn } from './model';

@Injectable()
export class GenerateService {

    constructor(private http: HttpClient) { }

    public moduleList() {
        return this.http.get<IData<IItem>>('gzo/module/all');
    }

    public schemaList(): Observable<IData<string>>;
    public schemaList(full: true): Observable<IData<any>>;
    public schemaList(full = false) {
        return this.http.get<IData<any>>('gzo/database/schema', {
            params: {full}
        });
    }

    public tableList(schema?: string): Observable<IData<string>>;
    public tableList(schema: string, full: true): Observable<IData<ITable>>;
    public tableList(schema = '', full = false) {
        return this.http.get<IData<any>>('gzo/database/table', {
            params: {schema, full}
        });
    }

    public columnList(table: string, schema?: string): Observable<IData<ITableColumn>>;
    public columnList(table: string, schema: string, full: true): Observable<IData<IColumn>>;
    public columnList(table: string, schema = '', full = false) {
        return this.http.get<IData<any>>('gzo/database/column', {
            params: {table, schema, full}
        });
    }

    public query(data: any) {
        return this.http.post<IPage<any>>('gzo/database/query', data);
    }
}
