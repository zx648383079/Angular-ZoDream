import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IData, IDataOne, IPage } from '../theme/models/page';
import { IItem } from '../theme/models/seo';
import { IColumn, IPreviewFile, ITable, ITableColumn } from './model';

@Injectable()
export class GenerateService {

    constructor(private http: HttpClient) { }

    public controller(data: any) {
        return this.http.post<IData<IPreviewFile>>('gzo/template/controller', data);
    }

    public model(data: any) {
        return this.http.post<IData<IPreviewFile>>('gzo/template/model', data);
    }

    public migration(data: any) {
        return this.http.post<IData<IPreviewFile>>('gzo/template/migration', data);
    }

    public crud(data: any) {
        return this.http.post<IData<IPreviewFile>>('gzo/template/index', data);
    }

    public moduleList() {
        return this.http.get<IData<IItem>>('gzo/module/all');
    }

    public moduleInstall(data: any) {
        return this.http.post<IDataOne<boolean>>('gzo/module/install', data);
    }
    public moduleUninstall(data: any) {
        return this.http.post<IDataOne<boolean>>('gzo/module/uninstall', data);
    }

    public module(data: any) {
        return this.http.post<IData<IPreviewFile>>('gzo/template/module', data);
    }

    public moduleRoute() {
        return this.http.get<IData<IItem>>('gzo/module/route');
    }


    public schemaCreate(data: any) {
        return this.http.post<IDataOne<true>>('gzo/database/schema_create', data);
    }

    public tableCreate(data: any) {
        return this.http.post<IDataOne<true>>('gzo/database/table_create', data);
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

    public import(data: FormData) {
        return this.http.post<IDataOne<boolean>>('gzo/database/import', data);
    }

    public copy(data: any) {
        return this.http.post<IDataOne<true>>('gzo/database/copy', data);
    }

    public batch(data: {
        modules?: any,
        routes?: any;
        schemas?: {
            full?: boolean;
        };
        tables?: {
            schema?: string;
            full?: boolean;
        };
        columns?: {
            table: string;
            schema?: string;
            full?: boolean;
        }
    }) {
        return this.http.post<{
            modules?: IData<IItem>;
            routes?: IData<IItem>;
            schemas?: IData<any>;
            tables?: IData<any>;
            columns?: IData<any>;
        }>('gzo/batch', data);
    }
}
