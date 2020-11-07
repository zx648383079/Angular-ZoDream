import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IDataOne, IPage } from '../theme/models/page';
import { ITask, ITaskComment, ITaskDay } from '../theme/models/task';

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

    public daySave(params: any) {
        return this.http.post<ITaskDay>('task/home/save_day', params);
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

    public taskPlay(params: any) {
        return this.http.post<ITaskDay>('task/home/play', params);
    }

    public taskPause(id: any) {
        return this.http.post<ITaskDay>('task/home/pause', {id});
    }

    public taskStop(id: any) {
        return this.http.post<ITaskDay>('task/home/stop', {id});
    }

    public taskCheck(id: any) {
        return this.http.post<ITaskDay>('task/home/check', {id});
    }

    public commentList(params: any) {
        return this.http.get<IPage<ITaskComment>>('task/comment', {params});
    }

    public commenSave(params: any) {
        return this.http.post<ITaskComment>('task/comment/save', params);
    }
}
