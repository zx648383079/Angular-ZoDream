import { eachObject, uriEncode } from './utils';

/**
 * 从当前页面链接获取查询参数
 * @param routeQueries 
 * @param def 
 * @returns 
 */
export const getQueries = <T>(routeQueries: any, def: T): T => {
    const queries: any = {};
    eachObject(def, (val, key) => {
        if (!routeQueries || !Object.prototype.hasOwnProperty.call(routeQueries, key) || !routeQueries[key]) {
            queries[key] = val;
            return;
        }
        if (typeof val === 'number') {
            queries[key] = routeQueries[key].indexOf('.') > 0 ? parseFloat(routeQueries[key]) : parseInt(routeQueries[key], 10);
            return;
        }
        if (typeof val === 'boolean') {
            queries[key] = routeQueries[key] === '1' || routeQueries[key] === 'true';
            return;
        }
        queries[key] = routeQueries[key];
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