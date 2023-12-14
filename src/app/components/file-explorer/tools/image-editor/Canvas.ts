import { ISize } from '../../../../theme/utils/canvas';
import { CanvasLayer } from './CanvasLayer';
import { ImageCanvasLayer } from './ImageCanvasLayer';

export class Canvas {

    constructor(
        private element: HTMLCanvasElement
    ) {
        const rect = element.getBoundingClientRect();
        this.ctx = this.element.getContext('2d');
        this.resize(rect.width, rect.height);
    }

    private items: CanvasLayer[] = [];
    private ctx: CanvasRenderingContext2D;
    private width: number;
    private height: number;
    public selectedIndex = 0;

    public get size(): ISize {
        return {width: this.width, height: this.height};
    }

    public get layer() {
        if (this.items.length === 0) {
            this.createLayer();
        }
        return this.items[this.selectedIndex];
    }


    public createLayer() {
        // this.items.push(new CanvasLayer(this));
    }

    public resize(width: number, height: number) {
        this.element.width = width;
        this.element.height = height;
    }

    public clear() {
        this.ctx.clearRect(0, 0, this.width, this.height);
    }

    public drawImage(img: HTMLImageElement) {
        this.items.push(new ImageCanvasLayer(img, this));
    }

    public reload() {
        for (const layer of this.items) {
            layer.update(this.ctx);
        }
    }
}