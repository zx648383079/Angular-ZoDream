import { IPoint, IBound, computedBound } from '../../../../theme/canvas';

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
        return computedBound(this._start, this._end);
    }

    public clear() {
        this._start = this._end = {x: 0, y: 0};
        this.box = this.refreshBox();
    }

    
}