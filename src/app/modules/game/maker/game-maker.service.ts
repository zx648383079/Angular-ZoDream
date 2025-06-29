import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IDataOne, IPage } from '../../../theme/models/page';
import { IGameAchieve, IGameCharacter, IGameCharacterIdentity, IGameDescent, IGameIndigenous, IGameItem, IGameMap, IGameMapArea, IGameMapItem, IGamePrizeItem, IGameProject, IGameRecipe, IGameRuleGrade, IGameSkill, IGameStoreItem, IGameTask } from '../model';

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

    public characterIdentityRemove(id: any, project: any) {
        return this.http.delete<IDataOne<true>>('game/maker/character/identity_delete', {
          params: {id, project}
        });
    }
    
    public indigenousList(params: any) {
        return this.http.get<IPage<IGameIndigenous>>('game/maker/indigenous', {params});
    }

    
    public indigenousSave(data: any) {
        return this.http.post<IGameIndigenous>('game/maker/indigenous/save', data);
    }

    public indigenousRemove(id: any, project: any) {
        return this.http.delete<IDataOne<true>>('game/maker/indigenous/delete', {
          params: {id, project}
        });
    }

    public itemList(params: any) {
        return this.http.get<IPage<IGameItem>>('game/maker/item', {params});
    }

        
    public itemSave(data: any) {
        return this.http.post<IGameItem>('game/maker/item/save', data);
    }

    public itemRemove(id: any, project: any) {
        return this.http.delete<IDataOne<true>>('game/maker/item/delete', {
          params: {id, project}
        });
    }

    public taskList(params: any) {
        return this.http.get<IPage<IGameTask>>('game/maker/task', {params});
    }

    public taskSave(data: any) {
        return this.http.post<IGameItem>('game/maker/task/save', data);
    }

    public taskRemove(id: any, project: any) {
        return this.http.delete<IDataOne<true>>('game/maker/task/delete', {
          params: {id, project}
        });
    }


    public mapList(params: any) {
        return this.http.get<IPage<IGameMap>>('game/maker/map', {params});
    }

    public mapAll(params: any) {
        return this.http.get<{
            area_items: IGameMapArea[];
            items: IGameMap[];
        }>('game/maker/map/all', {params});
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

    public mapRemove(id: any, project: any) {
        return this.http.delete<IDataOne<true>>('game/maker/map/delete', {
          params: {id, project}
        });
    }

    public mapAreaList(params: any) {
        return this.http.get<IPage<IGameMapArea>>('game/maker/map/area', {params});
    }

    public mapArea(id: any, project: any) {
        return this.http.get<IGameMapArea>('game/maker/map/area_detail', {params: {id, project}});
    }

    public mapAreaSave(data: any) {
        return this.http.post<IGameMapArea>('game/maker/map/area_save', data);
    }

    public mapAreaRemove(id: any, project: any) {
        return this.http.delete<IDataOne<true>>('game/maker/map/area_delete', {
            params: {id, project}
        });
    }

    public mapItemList(params: any) {
        return this.http.get<IPage<IGameMapItem>>('game/maker/map/item', {params});
    }

    public mapItemSave(data: any) {
        return this.http.post<IGameMapItem>('game/maker/map/item_save', data);
    }

    public mapItemRemove(id: any, project: any) {
        return this.http.delete<IDataOne<true>>('game/maker/map/item_delete', {
            params: {id, project}
        });
    }


    public skillList(params: any) {
        return this.http.get<IPage<IGameSkill>>('game/maker/skill', {params});
    }

    public skillSave(data: any) {
        return this.http.post<IGameSkill>('game/maker/skill/save', data);
    }

    public skillRemove(id: any, project: any) {
        return this.http.delete<IDataOne<true>>('game/maker/skill/delete', {
          params: {id, project}
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

    public ruleGradeRemove(id: any, project: any) {
        return this.http.delete<IDataOne<true>>('game/maker/grade/delete', {
          params: {id, project}
        });
    }

    public descentList(params: any) {
        return this.http.get<IPage<IGameDescent>>('game/maker/descent', {params});
    }

    public descentSave(data: any) {
        return this.http.post<IGameRuleGrade>('game/maker/descent/save', data);
    }

    public descentRemove(id: any, project: any) {
        return this.http.delete<IDataOne<true>>('game/maker/descent/delete', {
          params: {id, project}
        });
    }

    public storeList(params: any) {
        return this.http.get<IPage<IGameStoreItem>>('game/maker/store', {params});
    }

    public storeSave(data: any) {
        return this.http.post<IGameStoreItem>('game/maker/store/save', data);
    }

    public storeRemove(id: any, project: any) {
        return this.http.delete<IDataOne<true>>('game/maker/store/delete', {
            params: {id, project}
        });
    }

    public prizeList(params: any) {
        return this.http.get<IPage<IGamePrizeItem>>('game/maker/prize', {params});
    }

    public prizeSave(data: any) {
        return this.http.post<IGamePrizeItem>('game/maker/prize/save', data);
    }

    public prizeRemove(id: any, project: any) {
        return this.http.delete<IDataOne<true>>('game/maker/prize/delete', {
            params: {id, project}
        });
    }

    public achieveList(params: any) {
        return this.http.get<IPage<IGameAchieve>>('game/maker/achieve', {params});
    }

    public achieveSave(data: any) {
        return this.http.post<IGameAchieve>('game/maker/achieve/save', data);
    }

    public achieveRemove(id: any, project: any) {
        return this.http.delete<IDataOne<true>>('game/maker/achieve/delete', {
            params: {id, project}
        });
    }

    public recipeList(params: any) {
        return this.http.get<IPage<IGameRecipe>>('game/maker/recipe', {params});
    }

    public recipeSave(data: any) {
        return this.http.post<IGameRecipe>('game/maker/recipe/save', data);
    }

    public recipeRemove(id: any, project: any) {
        return this.http.delete<IDataOne<true>>('game/maker/recipe/delete', {
            params: {id, project}
        });
    }
}
