import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IPage } from '../../theme/models/page';
import { IGameProject, IGameResponse } from './model';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class GameService {

    constructor(
        private http: HttpClient
    ) { }

    public projectList(params?: any) {
        return this.http.get<IPage<IGameProject>>('game', {params});
    }

    public play(data: {
        project: number,
        command: string,
        data?: any
    }): Observable<IGameResponse>;
    public play(data: {
        project: number,
        batch: {
            [command: string]: any
        }
    }): Observable<{
        batch: {
            [cammand: string]: IGameProject
        },
        message?: string;
    }>;
    public play(data: any) {
        return this.http.post<any>('game/play', data);
    }
}
