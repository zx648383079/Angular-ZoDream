import { IBound, IPoint } from './core';

export class SelectionBound {

    private _start: IPoint;

    private _end: IPoint;

    public box: IBound = {
        x: 0,
        y: 0,
        width: 0,
        height: 0,
    };

    public set start(p: IPoint) {
        this._start = p;
        this._end = undefined;
        this.box = this.refreshBox();
    }

    public set end(p: IPoint) {
        this._end = p;
        this.box = this.refreshBox();
    }

    public refreshBox(): IBound {
        if (!this._start) {
            return {
                x: 0,
                y: 0,
                width: 0,
                height: 0,
            };
        }
        if (!this._end) {
            return {
                x: this._start.x,
                y: this._start.y,
                width: 0,
                height: 0,
            };
        }
        return {
            x: Math.min(this._start.x, this._end.x),
            y: Math.min(this._start.y, this._end.y),
            width: Math.abs(this._start.x - this._end.x),
            height: Math.abs(this._start.y - this._end.y),
        };
    }

    
}