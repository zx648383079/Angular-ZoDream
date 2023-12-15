import { IBound } from '../../../../theme/utils/canvas';
import { Canvas } from './Canvas';

export abstract class CanvasLayer {
    constructor(
        protected parent: Canvas
    ) {
    }

    protected _x: number = 0;
    protected _y: number = 0;
    protected _width: number = 0;
    protected _height: number = 0;
    protected _scaleX = 1;
    protected _scaleY = 1;
    protected _rotate = 0;
    public locked = false;
    public hidden = false;

    public get bound(): IBound {
        return {x: this._x, y: this._y, width: this.actualWidth, height: this.actualHeight};
    }

    public get actualWidth() {
        return this._width * Math.abs(this._scaleX);
    }

    public get actualHeight() {
        return this._height * Math.abs(this._scaleY);
    }

    public translate(x: number, y: number) {
        this._x += x;
        this._y += y;
    }

    public rotate(deg: number) {
        this._rotate = (this._rotate + deg) % 360;
    }

    public scale(scale: number): void;
    public scale(x: number, y: number): void;
    public scale(x: number, y?: number): void {
        this._scaleX *= x;
        this._scaleY *= typeof y === 'undefined' ? x : y;
        
    }

    public abstract update(ctx: CanvasRenderingContext2D): void;
}