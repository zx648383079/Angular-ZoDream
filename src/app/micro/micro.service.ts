import { Injectable } from '@angular/core';
import { IDataOne, IPage } from '../theme/models/page';
import { IBlockItem, IComment, IExtraRule, IMicro, ITopic } from './model';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class MicroService {

    constructor(
        private http: HttpClient
    ) { }

    public getList(params: any) {
        return this.http.get<IPage<IMicro>>('micro', {
            params
        });
    }

    public get(id: any) {
        return this.http.get<IMicro>('micro/home/detail', {
            params: {id}
        });
    }

    public create(data: any) {
        return this.http.post<IMicro>('micro/home/create', data);
    }

    public collect(id: any) {
        return this.http.post<IMicro>('micro/home/collect', {id});
    }

    public recommend(id: any) {
        return this.http.post<IMicro>('micro/home/recommend', {id});
    }

    public remove(id: any) {
        return this.http.delete<IDataOne<boolean>>('micro/home/delete', {
            params: {id}
        });
    }

    public forward(data: any) {
        return this.http.post<IMicro>('micro/home/forward', data);
    }

    public shareCheck(data: any) {
        return this.http.post<IDataOne<boolean>>('micro/share', data);
    }

    public shareSave(data: any) {
        return this.http.post<IMicro>('micro/share/save', data);
    }

    public commentList(params: any) {
        return this.http.get<IPage<IComment>>('micro/comment', {
            params
        });
    }

    public comment(id: any) {
        return this.http.get<IComment>('micro/comment/detail', {
            params: {id}
        });
    }

    public commentSave(data: any) {
        return this.http.post<IComment>('micro/comment/save', data);
    }

    public commentRemove(id: any) {
        return this.http.delete<IDataOne<boolean>>('micro/comment/delete', {
            params: {id}
        });
    }

    public commentAgree(id: any) {
        return this.http.post<IComment>('micro/comment/agree', {id});
    }

    public commentDisagree(id: any) {
        return this.http.post<IComment>('micro/comment/disagree', {id});
    }

    public topicList(params: any) {
        return this.http.get<IPage<ITopic>>('micro/topic', {params});
    }

    public topic(id: any) {
        return this.http.get<ITopic>('micro/topic/detail', {params: {id}});
    }

    public user(id: any) {
        return this.http.get<any>('micro/user', {params: {id}});
    }

    public renderRule(content: string, rules: IExtraRule[]): IBlockItem[] {
        const toBlock = (rule: IExtraRule): IBlockItem => {
            if (rule.i) {
                return {
                    type: 1,
                    content: rule.s,
                    image: rule.i,
                };
            }
            if (rule.u) {
                return {
                    type: 2,
                    content: rule.s,
                    user: rule.u,
                };
            }
            if (rule.t) {
                return {
                    type: 3,
                    content: rule.s,
                    topic: rule.t,
                };
            }
            if (rule.l) {
                return {
                    type: 4,
                    content: rule.s,
                    link: rule.l,
                };
            }
            return {content: rule.s};
        };
        const splitArr = (items: IBlockItem[], rule: IExtraRule): IBlockItem[] => {
            const data: IBlockItem[] = [];
            const block = toBlock(rule);
            for (const item of items) {
                if (item.type && item.type > 0) {
                    data.push(item);
                    continue;
                }
                item.content.split(rule.s).forEach((val, i) => {
                    if (i > 0) {
                        data.push({...block});
                    }
                    if (val.length < 1) {
                        return;
                    }
                    data.push({content: val});
                });
            }
            return data;
        }
        let blockItems = [
            {content}
        ];
        for (const rule of rules) {
            blockItems = splitArr(blockItems, rule);
        }
        return blockItems;
    }
}
