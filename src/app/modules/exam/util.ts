import { is } from 'immutable';
import { IQuestion, IQuestionCard, IQuestionFormat, IQuestionOption, IQuestionPageItem } from './model';

export const questionNeedOption = (value: IQuestion) => {
    return !value.type || value.type < 2 || value.type == 4;
};

export const questionOptionIsEmpty = (items: IQuestionOption[]) => {
    return items.filter(i => i.content).length === 0;
}

/**
 * 序号转AA
 * @param v 从0 开始 0 : A
 * @returns 
 */
export const intToABC = (v: number): string => {
    const items = [];
    while (true) {
        items.push(String.fromCharCode(v % 26 + 65));
        if (v < 26) {
            break;
        }
        v = Math.floor(v / 26);
    }
    return items.reverse().join('');
};

/**
 * 补全填空题选项
 * @param content 
 * @param optionItems 
 * @returns 
 */
export const formatFillOption = (content: string, optionItems: IQuestionOption[]): IQuestionOption[] => {
    const matches = content.match(/_{3,}/g);
    if (!matches || matches.length < 1) {
        return optionItems;
    }
    const items = optionItems.filter(i => i.is_right);
    if (items.length < 1) {
        optionItems = [];
    }
    let diff = matches.length - optionItems.length;
    if (diff < 1) {
        return optionItems;
    }
    optionItems.forEach(i => {
        i.is_right = true;
    })
    const len = optionItems.length;
    for (let i = 0; i < diff; i++) {
        optionItems.push({
            content: '答案' + intToABC(len + i),
            is_right: true,
        });
    }
    return optionItems
}

/**
 * 生成正确得试卷页
 * @param items 
 * @param maxLength 
 * @returns 
 */
export function formatPager(items: IQuestionFormat[], maxLength = 10): any[] {
    const pageItems: IQuestionPageItem[] = [];
    const cardItems: IQuestionCard[] = [];
    let currentPage: IQuestionPageItem;
    const parentMap: any = {};
    const materialMap: any = {};
    const newPage = (material?: any) => {
        currentPage = {
            material,
            items: [],
            page: pageItems.length
        };
        pageItems.push(currentPage);
    }
    const pushByParent = (item: IQuestionFormat) => {
        if (Object.prototype.hasOwnProperty.call(parentMap, item.parent.id)) {
            pageItems[parentMap[item.parent.id]].items.push(item);
            return;
        }
        newPage(item.parent);
        currentPage.items.push(item);
        parentMap[item.parent.id] = currentPage.page;
    };
    const pushByMaterial = (item: IQuestionFormat) => {
        if (Object.prototype.hasOwnProperty.call(materialMap, item.material.id)) {
            pageItems[materialMap[item.material.id]].items.push(item);
            return;
        }
        newPage(item.material);
        currentPage.items.push(item);
        materialMap[item.material.id] = currentPage.page;
    };
    const pushByEmpty = (item: IQuestionFormat) => {
        if (!currentPage || currentPage.material) {
            newPage();
        }
        if (currentPage.items.length >= maxLength) {
            newPage();
        }
        currentPage.items.push(item);
    };
    for (const item of items) {
        if (item.parent) {
            pushByParent(item);
            continue;
        }
        if (item.material) {
            pushByMaterial(item);
            continue;
        }
        pushByEmpty(item);
    }
    let i = 0;
    for (const page of pageItems) {
        for (const item of page.items) {
            cardItems.push({
                order: (++i).toString(),
                id: item.id,
                right: 0,
                active: false,
                page: page.page
            });
        }
    }
    return [pageItems, cardItems];
}