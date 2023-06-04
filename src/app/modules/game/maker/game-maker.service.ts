import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IData, IDataOne, IPage } from '../../../theme/models/page';
import { IGameCharacter, IGameIndigenous, IGameItem, IGameMap, IGameProject, IGameRuleGrade, IGameTask } from '../model';

@Injectable()
export class GameMakerService {

    constructor(
        private http: HttpClient
    ) { }

    public projectList(params: any) {
        return this.http.get<IPage<IGameProject>>('game/maker/project', {params});
    }

    public project(id: any) {
        return this.http.get<IGameProject>('game/maker/project/detail', {
          params: {id},
        });
    }

    public projectSave(data: any) {
        return this.http.post<IGameProject>('game/maker/project/save', data);
    }

    public projectRemove(id: any) {
        return this.http.delete<IDataOne<true>>('game/maker/project/delete', {
          params: {id}
        });
    }

    public projectStatistics(project: any) {
        return this.http.get<IGameProject>('game/maker/project/statistics', {params: {project}});
    }

    public characterList(params: any) {
        return this.http.get<IPage<IGameCharacter>>('game/maker/character', {params});
    }

    
    public indigenousList(params: any) {
        return this.http.get<IPage<IGameIndigenous>>('game/maker/indigenous', {params});
    }

    public itemList(params: any) {
        return this.http.get<IPage<IGameItem>>('game/maker/item', {params});
    }

    public taskList(params: any) {
        return this.http.get<IPage<IGameTask>>('game/maker/task', {params});
    }

    public mapList() {
        return this.http.get<IData<IGameMap>>('game/maker/map');
    }

    public ruleGradeList(params: any) {
        return this.http.get<IPage<IGameRuleGrade>>('game/maker/grade', {params});
    }

    public ruleGradeSave(data: any) {
        return this.http.post<IGameRuleGrade>('game/maker/grade/save', data);
    }

    public ruleGradeGenerate(data: any) {
        return this.http.post<IDataOne<true>>('game/maker/grade/generate', data);
    }

    public ruleGradeRemove(id: any) {
        return this.http.delete<IDataOne<true>>('game/maker/gradedelete', {
          params: {id}
        });
    }
}
