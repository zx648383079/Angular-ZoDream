import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IData, IDataOne, IPage } from '../../../theme/models/page';
import { IGameCharacter, IGameCharacterIdentity, IGameIndigenous, IGameItem, IGameMap, IGameMapArea, IGameProject, IGameRuleGrade, IGameSkill, IGameTask } from '../model';

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

    public characterIdentityList(params: any) {
        return this.http.get<IPage<IGameCharacterIdentity>>('game/maker/character/identity', {params});
    }

    public characterIdentitySave(data: any) {
        return this.http.post<IGameRuleGrade>('game/maker/character/identity_save', data);
    }

    public characterIdentityRemove(id: any) {
        return this.http.delete<IDataOne<true>>('game/maker/character/identity_delete', {
          params: {id}
        });
    }
    
    public indigenousList(params: any) {
        return this.http.get<IPage<IGameIndigenous>>('game/maker/indigenous', {params});
    }

    
    public indigenousSave(data: any) {
        return this.http.post<IGameIndigenous>('game/maker/indigenous/save', data);
    }

    public indigenousRemove(id: any) {
        return this.http.delete<IDataOne<true>>('game/maker/indigenous/delete', {
          params: {id}
        });
    }

    public itemList(params: any) {
        return this.http.get<IPage<IGameItem>>('game/maker/item', {params});
    }

        
    public itemSave(data: any) {
        return this.http.post<IGameItem>('game/maker/item/save', data);
    }

    public itemRemove(id: any) {
        return this.http.delete<IDataOne<true>>('game/maker/item/delete', {
          params: {id}
        });
    }

    public taskList(params: any) {
        return this.http.get<IPage<IGameTask>>('game/maker/task', {params});
    }

    public taskSave(data: any) {
        return this.http.post<IGameItem>('game/maker/task/save', data);
    }

    public taskRemove(id: any) {
        return this.http.delete<IDataOne<true>>('game/maker/task/delete', {
          params: {id}
        });
    }


    public mapList(params: any) {
        return this.http.get<{
            area_items: IGameMapArea[];
            items: IGameMap[];
        }>('game/maker/map', {params});
    }

    public mapMove(project: number, data: IGameMap[]) {
        return this.http.post<IGameMap>('game/maker/map/move', {project, data});
    }

    public mapAdd(data: any) {
        return this.http.post<IGameMap>('game/maker/map/add', data);
    }

    public mapLink(project: number, from: number, from_key: string, to: number, to_key: string) {
        return this.http.post<IGameMap>('game/maker/map/link', {project, from, from_key, to, to_key});
    }

    public mapSave(data: any) {
        return this.http.post<IGameMap>('game/maker/map/save', data);
    }

    public mapBatchSave(project: number, data: IGameMap[]) {
        return this.http.post<IDataOne<true>>('game/maker/map/batch_save', {data, project});
    }

    public mapRemove(id: any) {
        return this.http.delete<IDataOne<true>>('game/maker/map/delete', {
          params: {id}
        });
    }

    public skillList(params: any) {
        return this.http.get<IPage<IGameSkill>>('game/maker/skill', {params});
    }

    public skillSave(data: any) {
        return this.http.post<IGameSkill>('game/maker/skill/save', data);
    }

    public skillRemove(id: any) {
        return this.http.delete<IDataOne<true>>('game/maker/skill/delete', {
          params: {id}
        });
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
        return this.http.delete<IDataOne<true>>('game/maker/grade/delete', {
          params: {id}
        });
    }
}
