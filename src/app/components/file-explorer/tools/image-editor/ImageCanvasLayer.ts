import { Canvas } from './Canvas';
import { CanvasLayer } from './CanvasLayer';

export class ImageCanvasLayer extends CanvasLayer {
    constructor(
        private source: HTMLImageElement,
        parent: Canvas
    ) {
        super(parent);
    }


    public update(ctx: CanvasRenderingContext2D) {
        ctx.drawImage(this.source, 0, 0, this.source.width, this.source.height, 0, 0, this.source.width, this.source.height);
    }
}