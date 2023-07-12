import { Md5 } from 'ts-md5';
import { environment } from '../../../environments/environment';
import { IPageTreeItem } from '../models/page';

const rdashAlpha = /-([a-z])/g;

/**
 * - 转驼峰
 * @param val 
 * @returns 
 */
export function camelCase(val: string): string {
	return val.replace(rdashAlpha, (_, letter) => letter.toUpperCase());
}

export function isNumber(val: any): boolean {
    if (typeof val === 'number') {
        return true;
    }
    if (typeof val !== 'string') {
        return false;
    }
    return /^\d*(\.\d*)?$/.test(val);
}

/**
 * 展开tree
 * @param items 
 * @param search 
 * @returns 
 */
export function toggleTreeItem<T extends IPageTreeItem>(items: T[], search: number|T): T[] {
    const begin = typeof search === 'object' ? items.indexOf(search) : parseNumber(search);
    if (begin < 0 || begin >= items.length) {
        return items;
    }
    const item = items[begin];
    if (!item) {
        return items;
    }
    item.toggled = !item.toggled;
    for (let j = begin + 1; j < items.length; j++) {
        const target = items[j];
        if (target.level <= item.level) {
            break;
        }
        target.visibled = item.toggled && target.level === item.level + 1;
    }
    return items;
}

/**
 * 格式化数字
 * @param val 
 * @returns 
 */
export function parseNumber(val: any): number {
    if (!val || isNaN(val)) {
        return 0;
    }
    if (typeof val === 'number') {
        return val;
    }
    if (typeof val === 'boolean') {
        return val ? 1 : 0;
    }
    if (typeof val !== 'string') {
        val = val.toString();
    }
    if (val.indexOf(',') > 0) {
        val = val.replace(/,/g, '');
    }
    if (val.indexOf('.') > 0) {
        val = parseFloat(val);
    } else {
        val = parseInt(val, 10);
    }
    return isNaN(val) ? 0 : val;
}

export function checkRange(val: number, min = 0, max = 100): number {
    if (val < min) {
        return min;
    }
    if (max > min && val > max) {
        return max;
    }
    return val;
}

export function checkLoopRange(val: number, min = 0, max = 0): number {
    if (max <= min) {
        max = min;
        min = 0;
    }
    const count = max - min + 1;
    if (count <= 0) {
        return 0;
    }
    let real = val % count;
    if (real < 0) {
        real += count;
    }
    return real + min;
}

export function formatTime(date: Date): string {
    return formatDate(date, 'yyyy-mm-dd hh:ii:ss');
}

/**
 * 格式化日期
 */
export function formatDate(date: Date|number|string, fmt: string = 'yyyy-mm-dd hh:ii:ss'): string {
    if (typeof date === 'number') {
        date = new Date(date * 1000);
    } else if (typeof date === 'string') {
        date = new Date(/^\d+$/.test(date) ? parseInt(date, 10) * 1000 : date);
    }
    const o = {
        'y+': date.getFullYear(),
        'm+': date.getMonth() + 1, // 月份
        'd+': date.getDate(), // 日
        'h+': date.getHours(), // 小时
        'i+': date.getMinutes(), // 分
        's+': date.getSeconds(), // 秒
        'q+': Math.floor((date.getMonth() + 3) / 3), // 季度
        'S': date.getMilliseconds() // 毫秒
    };
    for (const k in o) {
        const match = fmt.match(new RegExp('(' + k + ')'));
        if (match) {
            fmt = fmt.replace(match[1], (match[1].length === 1 || k === 'y+') ? (o[k]) : (('00' + o[k]).substring(('' + o[k]).length)));
        }
    }
    return fmt;
}

export function formatHour(time: number, format?: string, isSecond = false): string {
    if (isNaN(time)) {
        time = 0;
    }
    if (!isSecond) {
        time = Math.floor(time / 1000);
    } else {
        time = Math.floor(time);
    }
    let s = time % 60;
    const m = format && format.indexOf('h') < 0 ? Math.floor(time / 60) : (Math.floor(time / 60) % 60);
    const h = Math.floor(time / 3600);
    if (!format) {
        return (h !== 0 ? twoPad(h) + ':' : '') + twoPad(m) + ':' + twoPad(s);
    }
    return format.replace(/h+/, twoPad(h)).replace(/i+/, twoPad(m)).replace(/s+/, twoPad(s));
}

export function formatAgo(value: any, now: Date = new Date()): string {
    if (!value) {
        return '--';
    }
    const timeDate = new Date(/^\d{10}$/.test(value) ? value * 1000 : value);
    let time = Math.floor((now.getTime() - timeDate.getTime()) / 1000);
    if (time < 1) {
        return $localize `now`;
    }
    if (time < 60) {
        return $localize `${time} seconds ago`;
    }
    if (time < 3600) {
        time = Math.floor(time / 60);
        return $localize `${time} minutes ago`;
    }
    if (time < 86400) {
        time = Math.floor(time / 3600);
        return $localize `${time} hours ago`;
    }
    if (time < 2592000) {
        time = Math.floor(time / 86400);
        return $localize `${time} days ago`;
    }
    if (timeDate.getFullYear() === now.getFullYear()) {
        return twoPad(timeDate.getMonth() + 1) + '-' + twoPad(timeDate.getDate());
    }
    return timeDate.getFullYear() + '-' + twoPad(timeDate.getMonth() + 1);
}

export function assetUri(value: string) {
    if (!value) {
        return null;
    }
    if (value.indexOf('//') >= 0) {
        return value;
    }
    if (value.startsWith('/')) {
        return environment.assetUri + value;
    }
    return environment.assetUri + '/' + value;
}

export function apiUri(path: string, queries: Object = {}): string {
    const timestamp = getCurrentTime();
    const sign = Md5.hashStr(environment.appid + timestamp + environment.secret);
    return uriEncode(environment.apiEndpoint + (path.startsWith('/') ? path.substring(1) : path), {
        ...queries,
        appid: environment.appid,
        timestamp,
        sign,
    }, true);
}

export function getCurrentTime() {
    return formatTime(new Date());
}

export function twoPad(n: number): string {
    const str = n.toString();
    return str[1] ? str : '0' + str;
}

export function randomInt(min: number = 0, max: number = 1): number {
    if (min > max) {
        [min, max] = [0, min];
    }
    return min + Math.floor(Math.random() * (max - min + 1));
}

/**
 * tree 中排除当前和子后代的节点
 * @param items 数组
 * @param id 当前id
 */
export function filterTree(items: any[], id: number) {
    const data = [];
    let level: number;
    for (const item of items) {
        if (item.id === id) {
            level = item.level;
            continue;
        }
        if (!level) {
            data.push(item);
            continue;
        }
        if (item.level > level) {
            continue;
        }
        level = undefined;
        data.push(item);
    }
    return data;
}
/**
 * 拼接网址
 * @param path 
 * @param obj 
 * @param unEncodeURI 不要编码
 * @returns 
 */
export function uriEncode(path: string, obj: Object = {}, unEncodeURI?: boolean): string {
    const result: string[] = [];
    const pushQuery = (key: string, value: any) => {
        if (typeof value !== 'object') {
            result.push(key + '=' + (unEncodeURI ? value : encodeURIComponent(value)));
            return;
        }
        if (value instanceof Array) {
            value.forEach(v => {
                pushQuery(key + '[]', v);
            });
            return;
        }
        eachObject(value, (v, k) => {
            pushQuery(key + '[' + k +']', v);
        });
    }
    for (const name in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, name)) {
            pushQuery(name, obj[name]);
        }
    }
    if (result.length < 1) {
        return path;
    }
    return path + (path.indexOf('?') > 0 ? '&' : '?') + result.join('&');
}

const OTHER_WORD_CODE = [8220, 8221, 8216, 8217, 65281, 12290, 65292, 12304, 12305, 12289, 65311, 65288, 65289, 12288, 12298, 12299, 65306];
/**
 * 计算内容的长度，排除空格符号等特殊字符
 */
export function wordLength(val: string): number {
    if (!val) {
        return 0;
    }
    let code: number;
    let length = 0;
    for (let i = val.length - 1; i >= 0; i --) {
        code = val.charCodeAt(i);
        if (code < 48
            || (code > 57 && code < 65)
            || (code > 90 && code < 97)
            || (code > 122 && code < 128)
            || (code > 128 && OTHER_WORD_CODE.indexOf(code) >= 0)
            ) {
            continue;
        }
        length ++;
    }
    return length;
}

/**
 * 深层次复制对象
 */
export function cloneObject<T>(val: T): T {
    if (typeof val !== 'object') {
        return val;
    }
    if (val instanceof Array) {
        return val.map(item => {
            return cloneObject(item);
        }) as any;
    }
    const res: any = {};
    for (const key in val) {
        if (Object.prototype.hasOwnProperty.call(val, key)) {
            res[key] = cloneObject(val[key]);
        }
    }
    return res;
}

/**
 * 遍历对象属性或数组
 */
export function eachObject(obj: any, cb: (val: any, key?: string|number) => any): any {
    if (typeof obj !== 'object') {
        return cb(obj, undefined);
    }
    if (obj instanceof Array) {
        for (let i = 0; i < obj.length; i++) {
            if (cb(obj[i], i) === false) {
                return false;
            }
        }
        return;
    }
    for (const key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
            if (cb(obj[key], key) === false) {
                return false;
            }
        }
    }
}

/**
 * 生成一系列连串数字
 * @param start 包括开始
 * @param end 包含结束
 * @param step 每次相隔
 * @param format 可以对每一项格式化
 * @returns 数字组合
 */
export function rangeStep<T = number>(start: number, end: number, step = 1, format?: (i: number) => T): T[] {
    const items: T[] = [];
    step = step === 0 ? 1 : Math.abs(step);
    if (start > end) {
        step = - step;
    }
    while (true) {
        items.push(format ? format(start) : start as any);
        start += step;
        if ((step > 0 && start > end) || (step < 0 && start < end)) {
            break;
        }
    }
    return items;
}


export function mapFormat(value: string|number, items: {[key: string|number]: string}, def?: string): string;
export function mapFormat(value: number, items: string[], def?: string): string;
export function mapFormat(value: any, items: {name: string;value: any}[], def?: string): string;

export function mapFormat(value: any, items: any, def = '--') {
    if (typeof items !== 'object') {
        return def;
    }
    if (!(items instanceof Array)) {
        return Object.prototype.hasOwnProperty.call(items, value) ? items[value] : def;
    }
    if (items.length < 1) {
        return def;
    }
    if (typeof items[0] !== 'object') {
        return value < 0 || value >= items.length ? def : items[value];
    }
    for (const item of items) {
        if (item.value === value) {
            return item.name;
        }
    }
    return def;
};

/**
 * 根据字符分割字符串
 * @param val 待分割的字符串
 * @param serach 分割标识
 * @param count 分割段数
 * @returns 不一定等于分割段数
 */
export function splitStr(val: string, serach: string, count: number = 0): string[] {
    if (count < 1 ) {
        return val.split(serach);
    }
    if (count == 1) {
        return [val];
    }
    let i = -1;
    const data: string[] = [];
    while(true) {
        if (count < 2) {
            data.push(val.substring(i));
            break;
        }
        const index = val.indexOf(serach, i);
        if (index < 0) {
            data.push(val.substring(i));
            break;
        }
        data.push(val.substring(i, index));
        count -- ;
        i = index + serach.length;
    }
    return data;
}