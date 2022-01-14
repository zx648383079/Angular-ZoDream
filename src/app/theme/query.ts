import { eachObject, parseNumber, uriEncode } from './utils';

/**
 * 从当前页面链接获取查询参数
 * @param routeQueries 全部参数
 * @param def 默认的参数，根据这个筛选并格式化参数
 * @returns 合并之后的参数
 */
export const getQueries = <T>(routeQueries: any, def: T): T => {
    const queries: any = {};
    eachObject(def, (val, key) => {
        if (!routeQueries || !Object.prototype.hasOwnProperty.call(routeQueries, key)) {
            queries[key] = val;
            return;
        }
        if (typeof val === 'number') {
            queries[key] = parseNumber(routeQueries[key]);
            return;
        }
        if (typeof val === 'boolean') {
            queries[key] = routeQueries[key] === true || routeQueries[key] === '1' || routeQueries[key] === 'true';
            return;
        }
        queries[key] = typeof routeQueries[key] === 'undefined' || routeQueries[key] === null ? '' : routeQueries[key];
    });
    return queries;
};


type HistoryCheckFn = (val: any, name: string) => boolean;

/**
 * 记录查询历史
 * @param queries 
 */
export function applyHistory(queries: any): void;

/**
 * 记录查询历史
 * @param queries 
 * @param check 移除一些默认的参数
 */
export function applyHistory(queries: any, check: HistoryCheckFn): void;

/**
 * 记录查询历史
 * @param queries 
 * @param scrollTop 是否回到顶部
 */
export function applyHistory(queries: any, scrollTop: boolean): void;

/**
 * 记录查询历史
 * @param queries 
 * @param title 记录的标题
 * @param check 移除一些默认的参数
 * @param scrollTop 是否回到顶部
 */
export function applyHistory(queries: any, title: string|boolean|HistoryCheckFn = $localize `Query results`, check: HistoryCheckFn = queriesCheckFn, scrollTop = true): void {
    if (typeof title === 'function') {
        [check, title] = [title, $localize `Query results`]
    } else if (typeof title === 'boolean') {
        [scrollTop, title] = [title, $localize `Query results`];
    }
    let params: any = {};
    eachObject(queries, (val, key) => {
        if (check && check(val, key as string) === false) {
            return;
        }
        params[key] = val;
    });
    const url = window.location.href;
    const path = url.split('?', 2)[0];
    const newUrl = uriEncode(path, params);
    if (url !== newUrl) {
        history.pushState(null, title, newUrl);
    }
    if (scrollTop) {
        document.documentElement.scrollTop = 0;
    }
};

export function queriesDefaultCheck(params: any): HistoryCheckFn {
    return (val, name) => {
        if (val === 0 || val === '' || val === null || val === false) {
            return false;
        }
        return !params || !Object.prototype.hasOwnProperty.call(params, name) || params[name] !== val;
    };
}

export const queriesCheckFn: HistoryCheckFn = queriesDefaultCheck({keywords: '', page: 1, per_page: 20});