import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IPage } from '../../theme/models/page';
import { IGameProject, IGameResponse } from './model';

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

    public play(data: any) {
        return this.http.post<IGameResponse>('game/play', data);
    }
}
