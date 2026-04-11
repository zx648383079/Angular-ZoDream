/**
 * 判断网址是否是iframe 打开方式
 * @param src 
 * @returns 
 */
export function mediaIsFrame(src: string) {
    const maps = [
        'player.youku.com',
        'player.bilibili.com',
        'v.qq.com',
        'open.iqiyi.com',
    ];
    for (const host of maps) {
        const i = src.indexOf(host);
        if (i > 0 && i < 15) {
            return true;
        }
    }
    return false;
}