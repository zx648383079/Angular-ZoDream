import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IData, IDataOne, IPage } from '../theme/models/page';
import { IShare, ITask, ITaskComment, ITaskDay, ITaskReview } from '../theme/models/task';

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

    public review(params: any) {
        return this.http.get<IData<ITaskReview>>('task/review', {params});
    }

    /**
     * record
     */
    public record(params: any) {
        return this.http.get<IPage<any>>('task/record', {params});
    }

    public shareList(params: any) {
        return this.http.get<IPage<IShare>>('task/share', {params});
    }

    public myShareList(params: any) {
        return this.http.get<IPage<IShare>>('task/share/my', {params});
    }

    public share(id: any) {
        return this.http.get<IShare>('task/share/detail', {params: {id}});
    }

    public shareCreate(params: any) {
        return this.http.post<IShare>('task/share/create', params);
    }

    public shareRemove(id: any) {
        return this.http.delete<IDataOne<boolean>>('task/share/delete', {params: {id}});
    }

    public shareRemoveUser(id: any, userId: any) {
        return this.http.delete<IDataOne<boolean>>('task/share/delete_user', {params: {id, user_id: userId}});
    }

    public shareUsers(params: any) {
        return this.http.get<IPage<any>>('task/share/users', {params});
    }
}
