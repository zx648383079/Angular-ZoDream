import { Canvas } from './Canvas';
import { CanvasLayer } from './CanvasLayer';

export class ImageCanvasLayer extends CanvasLayer {
    constructor(
        private source: HTMLImageElement,
        parent: Canvas
    ) {
        super(parent);
        this._width = this.source.width;
        this._height = this.source.height;
        const rect = parent.size;
        this.scale(Math.min(Math.min(rect.width / this._width, rect.height / this._height), 1));
    }


    public update(ctx: CanvasRenderingContext2D) {
        if (this.hidden) {
            return;
        }
        const bound = this.bound;
        let x = bound.x;
        let y = bound.y;
        ctx.save();
        const centerX = (bound.x + bound.width) / 2;
        const centerY = (bound.y + bound.height) / 2;
    
        ctx.translate(centerX, centerY);
        if (this._rotate) {
            ctx.rotate(Math.PI / 180 * this._rotate);
        }
        const flipX = this._scaleX < 0 ? -1 : 1;
        const flipY = this._scaleY < 0 ? -1 : 1;
        if (this._scaleX < 0 || this._scaleY < 0) {
            ctx.scale(flipX, flipY);
        }
        ctx.drawImage(this.source, 0, 0, this.source.width, this.source.height, x * flipX - centerX, y  * flipY - centerY, bound.width, bound.height);
        ctx.restore();
    }
}