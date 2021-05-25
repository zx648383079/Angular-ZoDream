import { IBlockItem, IExtraRule } from './rule-block/model';

export type parseBlockFn = (rule: IExtraRule) => IBlockItem;

/**
 * 转化规则
 * @param parseFn 
 * @param content 
 * @param rules 
 * @param newLine 
 * @returns 
 */
export function formatLinkRule(parseFn: parseBlockFn, content?: string, rules?: IExtraRule[], newLine = true): IBlockItem[] {
    if (!content) {
        return [];
    }
    const splitArr = (items: IBlockItem[], rule: IExtraRule): IBlockItem[] => {
        const data: IBlockItem[] = [];
        const block = parseFn(rule);
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
    if (!rules) {
        rules = [];
    }
    if (newLine) {
        rules.unshift({
            s: '\n',
            type: 99,
        });
    }
    for (const rule of rules) {
        blockItems = splitArr(blockItems, rule);
    }
    return blockItems;
}