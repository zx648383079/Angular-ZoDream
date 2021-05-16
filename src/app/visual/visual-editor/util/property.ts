import { eachObject } from '../../../theme/utils';
import { IStyle, WidgetProperty } from '../model';

export class PropertyUtil {

    public static animation(value: any): IStyle {
        if (!value) {
            return undefined;
        }
        if (typeof value !== 'object') {
            return {
                animation: value
            };
        }
        const items = [];
        let i = -1;
        eachObject(value, v => {
            ++ i;
            if (i < 1 && !v) {
                return false;
            }
            if (!v) {
                return;
            }
            if (v === 'none') {
                return false;
            }
            items.push(v);
        });
        if (items.length < 1) {
            return undefined;
        }
        return {
            animation: items.join(' ')
        };
    }

    public static transform(value: any) {
        if (!value) {
            return undefined;
        }
        if (typeof value !== 'object') {
            return {
                transform: value
            };
        }
        if (value instanceof WidgetProperty) {
            value = value.getMany(['matrix', 'matrix3d', 'translate', 'translate3d', 'translateX', 'translateY', 'translateZ', 'scale', 'scale3d', 'scaleX', 'scaleY', 'scaleZ', 'rotate', 'rotate3d', 'rotateX', 'rotateY', 'rotateZ', 'skew', 'skewX', 'skewY', 'perspective', 'transform']);
        }
        let items = [];
        const each = (data: any) => {
            eachObject(data, (v, k) => {
                if (!v) {
                    return;
                }
                if (k === 'transform') {
                    each(v);
                    return;
                }
                if (v === 'none') {
                    items = ['none'];
                    return false;
                }
                if (k === 'rotate' && typeof v === 'number') {
                    v = PropertyUtil.degToAngle(v);
                }
                if (typeof k === 'number') {
                    items.push(v);
                    return;
                }
                items.push(`${k}(${v})`);
            });
        };
        each(value);
        if (items.length < 1) {
            return undefined;
        }
        return {
            transform: items.join(' ')
        };
    }

    public static degToAngle(i: number) {
        i = (i - 90) % 360;
        if (i < 0) {
            i += 360;
        }
        return i * Math.PI / 180 ;
    }

    public static mergeStyle(...args: any[]): IStyle {
        const data: IStyle = {};
        const each = (items: any[]) => {
            for (const item of items) {
                if (!item) {
                    continue;
                }
                if (item instanceof Array) {
                    each(item);
                    continue;
                }
                eachObject(item, (v, k) => {
                    if (!v || !k) {
                        return;
                    }
                    data[k] = v;
                });
            }
        };
        each(args);
        return data;
    } 
}