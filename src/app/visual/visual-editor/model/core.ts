import { cloneObject } from '../../../theme/utils';
import { TreeItem } from './tree';

export interface ISize {
    width: number;
    height: number;
}

export interface IPoint {
    x: number;
    y: number;
}

export interface IRect extends IPoint {
    right: number;
    bottom: number;
}

export interface IBound extends ISize, IPoint {
}

export interface IActionItem {
    id: string|number;
    event: any;
    data: any;
}

export interface IResetEvent {
    main: IBound;
    zoom: IBound;
}

export interface IRuleLine {
    value: number;
    label: string|number;
    horizontal?: boolean;
}

export interface ITabBarItem {
    text?: string;
    icon?: string;
    iconPath?: string;
    selectedIconPath?: string;
    color?: string;
    selectedColor?: string;
}

export class LocationPoint implements IPoint {
    constructor(
        public x = 0,
        public y = 0
    ) {
    }
    private _isNull = true;

    public set location(p: IPoint) {
        this.x = p.x;
        this.y = p.y;
        this._isNull = false;
    }

    public get isNull() {
        return this._isNull;
    }

    public set isNull(v: boolean) {
        this._isNull = v;
        if (v == true) {
            this.x = 0;
            this.y = 0;
        }
    }

    /**
     * 直线距离
     * @param v 
     * @returns 
     */
    public distance(v: IPoint) {
        return Math.sqrt(Math.pow(this.x - v.x, 2) + Math.pow(this.y - v.y, 2));
    }

    /**
     * v.x - x
     * @param v 
     * @returns 
     */
    public xDistance(v: IPoint) {
        return v.x - this.x;
    }

    /**
     * v.y - y
     * @param v 
     * @returns 
     */
    public yDistance(v: IPoint) {
        return v.y - this.y;
    }

    /**
     * 是否在区域
     * @param v 
     * @returns 
     */
    public inBound(v: IBound) {
        return this.x >= v.x && 
            this.y >= v.y &&
            this.x < v.x + v.width && 
            this.y < v.y + v.height;
    }

    /**
     * 根据v中心转化成世界坐标
     * @param v 
     */
    public add(v: IPoint): IPoint {
        return {
            x: this.x + v.x,
            y: this.y + v.y,
        };
    }

    /**
     * 根据v中心转成相对坐标
     * @param v 
     * @returns 
     */
    public subtract(v: IPoint): IPoint {
        return {
            x: this.x - v.x,
            y: this.y - v.y,
        };
    }

    /**
     * 根据当前坐标转化成世界坐标
     * @param v 
     * @param clone 
     * @returns 
     */
    public inc<T extends IPoint>(v: T, clone = false): T {
        const obj = clone ? cloneObject(v) : v;
        obj.x += this.x;
        obj.y += this.y;
        return obj;
    }

    /**
     * 根据当前坐标中心转成相对坐标
     * @param v 
     * @returns 
     */
    public dec<T extends IPoint>(v: T, clone = false): T {
        const obj = clone ? cloneObject(v) : v;
        obj.x -= this.x;
        obj.y -= this.y;
        return obj;
    }
    
    public move(p: IPoint);
    public move(x: number, y: number)
    public move(x: number|MouseEvent|IPoint, y?: number) {
        if (typeof x === 'object') {
            [x, y] = [x.x, x.y];
        }
        this.x = x as number;
        this.y = y as number;
        this._isNull = false;
    }
}

export class ScrollBar {

    private readonly margin = window.innerWidth / 3;
    private _boxLength = 0;

    private _innerLength = 0;

    private _innerOffset = 0;

    public readonly uint = '%';

    /**
     * 1%表示的长度
     */
    private perValue = 0;
    private barLength = 0;
    
    public set boxLength(v: number) {
        this._boxLength = v;
        this.refreshPix();
    }

    public set innerLength(v: number) {
        this._innerLength = v;
        this.refreshPix();
    }

    public get hidden() {
        return false;
        // return this._innerLength === 0 || this._boxLength >= this._innerLength;
    }

    public get realLength() {
        return this._innerLength + 2 * this.margin;
    }

    public get startOffset() {
        return -this.margin;
    }

    public get endOffset() {
        return this._innerLength - this._boxLength + this.margin;
    }

    
    public get innerOffset() : number {
        return this._innerOffset;
    }

    
    public get innerLength() : number {
        return this._innerLength;
    }
    
    

    public get offsetValue() {
        return (this._innerOffset - this.startOffset) / this.perValue + this.uint;
    }

    public get barHStyle() {
        return {
            left: this.offsetValue,
            width: this.barLength + this.uint,
        };
    }

    public get barVStyle() {
        return {
            top: this.offsetValue,
            height: this.barLength + this.uint,
        };
    }
    public move(offset: number) {
        this._innerOffset = Math.max(Math.min(this._innerOffset + offset, this.endOffset), this.startOffset);
    }

    private refreshPix() {
        if (this._innerLength <= 0) {
            this.barLength = this.perValue = 0;
            return;
        }
        const total = this.realLength;
        this.barLength = Math.max(20, this._boxLength * 100 / total);
        this.perValue = this._boxLength / this.barLength;
    }
}

export interface ICatalogItem extends TreeItem {

}