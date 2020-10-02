export function formatTime(date: Date): string {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const hour = date.getHours();
    const minute = date.getMinutes();
    const second = date.getSeconds();
    return [year, month, day].map(twoPad).join('-') + ' ' + [hour, minute, second].map(twoPad).join(':')
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
