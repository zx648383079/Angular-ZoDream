export interface IPoint {
    x: number;
    y: number;
}

export interface ISize {
    width: number;
    height: number;
}

export interface IBound extends IPoint, ISize {

}

export function pointFormEvent(e: MouseEvent|TouchEvent): IPoint {
    if (!Object.prototype.hasOwnProperty.call(e, 'targetTouches')) {
        const src = e as MouseEvent;
        return {x: src.clientX, y: src.clientY};
    }
    const src = (e as TouchEvent).targetTouches[0];
    return {x: src.clientX, y: src.clientY};
}

/**
 * 根据两点计算区域位置
 * @param from 
 * @param to 
 * @returns 
 */
export function computedBound(from?: IPoint, to?: IPoint): IBound {
    if (!from) {
        return {
            x: 0,
            y: 0,
            width: 0,
            height: 0,
        };
    }
    if (!to) {
        return {
            x: from.x,
            y: from.y,
            width: 0,
            height: 0,
        };
    }
    return {
        x: Math.min(from.x, to.x),
        y: Math.min(from.y, to.y),
        width: Math.abs(from.x - to.x),
        height: Math.abs(from.y - to.y),
    };
}

/**
 * 根据两点画贝塞尔曲线
 * @param ctx 
 * @param from 
 * @param to 
 * @param lineWidth 
 * @param lineColor 
 */
export function drawLineTo(ctx: CanvasRenderingContext2D, from: IPoint, to: IPoint, lineWidth = 2, lineColor = '#000') {
    const centerX = (to.x + from.x) / 2;
    const centerY = (to.y + from.y) / 2;
    const isHor = Math.abs(to.x - from.x) > Math.abs(to.y - from.y);
    const fromCtl: IPoint = isHor ? {
        x: centerX,
        y: from.y
    } : {
        x: from.x,
        y: centerY
    };
    const toCtl: IPoint = isHor ? {
        x: centerX,
        y: to.y,
    } : {
        x: to.x,
        y: centerY
    };
    ctx.beginPath();
    ctx.lineWidth = lineWidth;
    ctx.strokeStyle = lineColor;
    ctx.moveTo(from.x, from.y);
    ctx.bezierCurveTo(fromCtl.x, fromCtl.y, toCtl.x, toCtl.y, to.x, to.y);
    ctx.stroke();
}

/**
 * 判断两个区域是否相交
 * @param a 
 * @param b 
 * @returns 
 */
export function isIntersect(a: IBound, b: IBound|IPoint): boolean {
    const aR = a.x + a.width;
    const aB = a.y + a.height;
    if (!Object.prototype.hasOwnProperty.call(b, 'width')) {
        return a.x <= b.x && a.y <= b.y && aB >= b.y && aR >= b.x;
    }
    const bR = b.x + (b as IBound).width;
    const bB = b.x + (b as IBound).height;
    return Math.abs(aR + a.x - bR - b.x) <= (aR - a.x + bR - b.x) && Math.abs(aB + a.y - bB - b.y) <= (aB - a.y + bB - b.y);
}