import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IDataOne } from '../../theme/models/page';

@Injectable()
export class CheckinService {

    constructor(private http: HttpClient) { }

    public statistics() {
        return this.http.get<any>('checkin/admin/home/index');
    }

    public option() {
        return this.http.get<any>('checkin/admin/home/option');
    }

    public optionSave(data: any) {
        return this.http.post<IDataOne<boolean>>('checkin/admin/home/option_save', data);
    }

}
