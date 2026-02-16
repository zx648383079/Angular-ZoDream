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
    /**
     * 搜索
     * @param items 
     * @param column 
     * @param keywords 
     */
    search(items: IControlOption[], column: number, keywords: string): Observable<IControlOption[]>;

    /**
     * 当前列选择变化，需要更新第几列
     * @param column 
     */
    influence(column: number): number;

    /**
     * 根据值显示所有列
     * @param value 
     */
    initialize(value?: any): Observable<IControlOption[][]>;
    /**
     * 根据选择的项返回实际值
     * @param items 
     */
    format(...items: IControlOption[]): any;
    /**
     * 根据值返回显示的字符串
     * @param items 
     */
    display(...items: any[]): string;
}

/**
 * 获取选中的序号
 * @param items 
 * @returns 
 */
export function selectedIndex(items: IControlOption[]): number {
    for (let i = 0; i < items.length; i++) {
        if (items[i].checked) {
            return i;
        }
    }
    return -1;
}

/**
 * 选中指定值
 * @param items 
 * @param val 
 * @param multiple 是否为多选模式
 * @returns 
 */
export function selectItem(items: IControlOption[], val: any, multiple = false): number {
    let index = -1;
    for (let i = 0; i < items.length; i++) {
        const item = items[i];
        if ((index < 0 || multiple) && item.value === val) {
            index = i;
            item.checked = true;
            continue;
        }
        if (multiple) {
            continue;
        }
        item.checked = false;
    }
    return index;
}
/**
 * 选择多个
 * @param items 
 * @param valItems 
 * @returns 
 */
export function selectItems(items: IControlOption[], ...valItems: any[]): number {
    let index = 0;
    for (let i = 0; i < items.length; i++) {
        const item = items[i];
        item.checked = valItems.indexOf(item.value) >= 0;
    }
    return index;
}

/**
 * 选中指定项
 * @param items 
 * @param index 
 * @param multiple 是否为多选模式
 * @returns 
 */
export function selectIndex(items: IControlOption[], index: number, multiple = false): number {
    if (items.length <= index) {
        return -1;
    }
    if (multiple) {
        items[index].checked = !items[index].checked;
        return items[index].checked ? index : -1;
    }
    for (let i = 0; i < items.length; i++) {
        items[i].checked = i === index;
    }
    return index;
}

export function equalValue(val: any, next: any): boolean {
    if (val === next) {
        return true;
    }
    if (!val || !next) {
        return false;
    }
    if (typeof val === typeof next) {
        return false;
    }
    return val.toString() === next.toString();
}

export function equalOption(value: IControlOption, target: IControlOption): boolean {
    return value === target || equalValue(value.value, target.value);
}

export function toggleSelectedItems(items: IControlOption[], target: IControlOption, isPush = true, multiple = false): IControlOption[] {
    if (!multiple) {
        return isPush ? [target] : [];
    }
    if (isPush) {
        return [...items, target];
    }
    return items.filter(i => equalOption(i, target));
}