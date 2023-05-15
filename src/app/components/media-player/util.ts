/**
 * https://github.com/sindresorhus/screenfull.js
 */
const screenFullFn = function() {
    const fnMap = [
        [
            'requestFullscreen',
            'exitFullscreen',
            'fullscreenElement',
            'fullscreenEnabled',
            'fullscreenchange',
            'fullscreenerror'
        ],
        // New WebKit
        [
            'webkitRequestFullscreen',
            'webkitExitFullscreen',
            'webkitFullscreenElement',
            'webkitFullscreenEnabled',
            'webkitfullscreenchange',
            'webkitfullscreenerror'
    
        ],
        // Old WebKit
        [
            'webkitRequestFullScreen',
            'webkitCancelFullScreen',
            'webkitCurrentFullScreenElement',
            'webkitCancelFullScreen',
            'webkitfullscreenchange',
            'webkitfullscreenerror'
    
        ],
        [
            'mozRequestFullScreen',
            'mozCancelFullScreen',
            'mozFullScreenElement',
            'mozFullScreenEnabled',
            'mozfullscreenchange',
            'mozfullscreenerror'
        ],
        [
            'msRequestFullscreen',
            'msExitFullscreen',
            'msFullscreenElement',
            'msFullscreenEnabled',
            'MSFullscreenChange',
            'MSFullscreenError'
        ]
    ];
    
    for (const item of fnMap) {
        if (item && item[1] in document) {
            return item;
        }
    }
    return false;
}();

export class ScreenFull {

    public static get isFullScreen() {
        return screenFullFn && Boolean(document[screenFullFn[2]]);
    }

    public static request(element: any = document.documentElement) {
        if (!screenFullFn) {
            return;
        }
        element[screenFullFn[0]]();
    }

    public static exit(element: any = document) {
        if (!screenFullFn) {
            return;
        }
        element[screenFullFn[1]]();
    }

    public static get changeEvent(): string {
        return screenFullFn ? screenFullFn[4] : '';
    }
}

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