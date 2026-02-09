import { Observable } from 'rxjs';
import { IControlOption } from '../event';

export interface IDataSource {
    get columnCount(): number;
    /**
     * 选中的项
     * @param items 所有选中项
     * @param next 需要的位置
     */
    select(items: IControlOption[], next: number): Observable<IControlOption[]>;

    initialize(value?: any): Observable<IControlOption[][]>;
    format(...items: IControlOption[]): any;
}

/**
 * 获取选中的序号
 * @param items 
 * @returns 
 */
export function selectedIndex(items: IControlOption[]): number {
    for (let i = 0; i < items.length; i++) {
        if (items[i].selected) {
            return i;
        }
    }
    return -1;
}

/**
 * 选中指定值
 * @param items 
 * @param val 
 * @returns 
 */
export function select(items: IControlOption[], val: any): number {
    let index = -1;
    for (let i = 0; i < items.length; i++) {
        const item = items[i];
        item.selected = false;
        if (index < 0 && item.value === val) {
            index = i;
            item.selected = true;
        }
    }
    return index;
}

/**
 * 选中指定项
 * @param items 
 * @param index 
 * @returns 
 */
export function selectIndex(items: IControlOption[], index: number): number {
    if (items.length <= index) {
        return -1;
    }
    for (let i = 0; i < items.length; i++) {
        items[i].selected = i === index;
    }
    return index;
}