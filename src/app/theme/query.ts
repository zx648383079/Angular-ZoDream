import { eachObject, uriEncode } from './utils';

/**
 * 从当前页面链接获取查询参数
 * @param routeQueries 
 * @param def 
 * @returns 
 */
export const getQueries = <T>(routeQueries: any, def: T, ): T => {
    const queries: any = {};
    const parseNumber = (val: any): number => {
        if (!val) {
            return 0;
        }
        if (typeof val === 'string' && val.indexOf('.') > 0) {
            return parseFloat(val);
        }
        return parseInt(val, 10);
    };
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

/**
 * 记录查询历史
 * @param queries 
 * @param title 
 */
export const applyHistory = (queries: any, title = '查询列表') => {
    const url = window.location.href;
    const path = url.split('?', 2)[0];
    history.pushState(null, title, uriEncode(path, queries));
    document.documentElement.scrollTop = 0;
};