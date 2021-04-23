import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IData, IDataOne } from '../theme/models/page';
import { ICheckIn } from './model';

@Injectable({
  providedIn: 'root'
})
export class CheckinService {

    constructor(private http: HttpClient) { }

    public checkIn() {
        return this.http.post<IDataOne<ICheckIn>>('checkin/home/checkin', {});
    }

    public canCheck() {
        return this.http.get<IDataOne<ICheckIn>>('checkin', {});
    }

    public monthLog(month?: string) {
        return this.http.get<IData<ICheckIn>>('checkin/home/month', {
            params: {month}
        });
    }

    public batch(data: {
        today: any;
        month: {
            month?: string
        };
    }) {
        return this.http.post<{
            today: ICheckIn | null;
            month: ICheckIn[];
        }>('checkin/batch', data);
    }

}
