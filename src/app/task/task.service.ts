import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IDataOne, IPage } from '../theme/models/page';
import { ITask, ITaskDay } from '../theme/models/task';

@Injectable()
export class TaskService {

    constructor(
        private http: HttpClient
    ) { }

    public dayList(params: any) {
        return this.http.get<IPage<ITaskDay>>('task/home/today', {params});
    }

    public day(id: any) {
        return this.http.get<ITaskDay>('task/home/detail_day', {params: {id}});
    }

    public taskList(params: any) {
        return this.http.get<IPage<ITask>>('task', {params});
    }

    public task(id: any) {
        return this.http.get<ITask>('task/home/detail', {params: {id}});
    }

    public taskSave(params: any) {
        return this.http.post<ITask>('task/home/save', params);
    }

    public taskRemove(id: any) {
        return this.http.delete<IDataOne<boolean>>('task/home/delete', {params: {id}});
    }

    public taskPlay(id: any) {
        return this.http.post<ITask>('task/home/play', {id});
    }

    public taskPause(id: any) {
        return this.http.post<ITask>('task/home/pause', {id});
    }

    public taskStop(id: any) {
        return this.http.post<ITask>('task/home/stop', {id});
    }

    public taskCheck(id: any) {
        return this.http.post<ITask>('task/home/check', {id});
    }
}
