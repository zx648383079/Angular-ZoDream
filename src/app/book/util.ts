/**
 * 页面滚动条距离顶部的距离
 * @returns 
 */
export function windowScollTop(): number {
    let scrollTop = 0;
    let bodyScrollTop = 0;
    let documentScrollTop = 0;
    if (document.body) {
        bodyScrollTop = document.body.scrollTop;
    }
    if (document.documentElement) {
        documentScrollTop = document.documentElement.scrollTop;
    }
    scrollTop = (bodyScrollTop - documentScrollTop > 0) ? bodyScrollTop : documentScrollTop;
    return scrollTop;
}

/**
 * 浏览器窗口的高度
 * @returns 
 */
export function windowHeight(): number {
    let windowHeight = 0;
    if (document.compatMode === 'CSS1Compat') {
        windowHeight = document.documentElement.clientHeight;
    } else {
        windowHeight = document.body.clientHeight;
    }
    return windowHeight;
}

/**
 * 整个页面的高度
 * @returns 
 */
export function documentHeight(): number {
    const box = document.querySelector('html');
    if (!box) {
        return 0;
    }
    return box.scrollHeight;
}

/**
 * 滚动条距离底部的距离
 * @returns 
 */
export function scrollBottom(): number {
    return documentHeight() - windowScollTop() - windowHeight();
}