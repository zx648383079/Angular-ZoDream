import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IData } from '../theme/models/page';
import { ITableColumn } from './model';

@Injectable()
export class GenerateService {

    constructor(private http: HttpClient) { }


    public schemaList() {
        return this.http.get<IData<string>>('gzo/database/schema');
    }

    public tableList(schema = '') {
        return this.http.get<IData<string>>('gzo/database/table', {
            params: {schema}
        });
    }

    public columnList(table: string, schema = '') {
        if (schema.length > 0) {
            table = schema + '.' + table;
        }
        return this.http.get<IData<ITableColumn>>('gzo/database/column', {
            params: {table}
        });
    }
}
