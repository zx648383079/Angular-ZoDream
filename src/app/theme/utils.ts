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
        if (new RegExp('(' + k + ')').test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1 || k === 'y+') ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)));
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
    }
    const s = time % 60;
    const m = format && format.indexOf('h') < 0 ? Math.floor(time / 60) : (Math.floor(time / 60) % 60);
    const h = Math.floor(time / 3600);
    if (!format) {
        return (h !== 0 ? twoPad(h) + ':' : '') + twoPad(m) + ':' + twoPad(s);
    }
    return format.replace(/h+/, twoPad(h)).replace(/i+/, twoPad(m)).replace(/s+/, twoPad(s));
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

export function uriEncode(path: string, obj: any = {}, unEncodeURI?: boolean) {
    const result = [];
    for (const name in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, name)) {
            const value = obj[name];
            result.push(name + '=' + (unEncodeURI ? value : encodeURIComponent(value)));
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
    }
    for (const key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
            if (cb(obj[key], key) === false) {
                return false;
            }
        }
    }
}


export function hasElementByClass(path: Array<Element>, className: string): boolean {
    let hasClass = false;
    for (const item of path) {
        if (!item || !item.className) {
            continue;
        }
        hasClass = item.className.indexOf(className) >= 0;
        if (hasClass) {
            return true;
        }
    }
    return hasClass;
}