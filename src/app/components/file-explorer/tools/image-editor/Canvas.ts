import { ISize } from '../../../../theme/utils/canvas';
import { CanvasLayer } from './CanvasLayer';
import { ImageCanvasLayer } from './ImageCanvasLayer';

export class Canvas {

    constructor(
        private element: HTMLCanvasElement
    ) {
        const rect = element.getBoundingClientRect();
        this._ctx = this.element.getContext('2d');
        this.resize(rect.width, rect.height);
    }

    private _items: CanvasLayer[] = [];
    private _ctx: CanvasRenderingContext2D;
    private _width: number;
    private _height: number;
    private _disabled = false;
    public selectedIndex = 0;
    public scale = 1;

    public get size(): ISize {
        return {width: this._width, height: this._height};
    }

    public get layer() {
        if (this._items.length === 0) {
            // this.createLayer();
        }
        return this._items[this.selectedIndex];
    }


    public push(...layers: CanvasLayer[]) {
        this._items.push(...layers);
        this.selectedIndex = this._items.length - 1;
    }

    public resize(width: number, height: number) {
        this.element.width = width;
        this.element.height = height;
        this._width = width;
        this._height = height; 
        this.reload();
    }

    public clear() {
        this._ctx.clearRect(0, 0, this._width, this._height);
    }

    public drawImage(img: HTMLImageElement) {
        this.push(new ImageCanvasLayer(img, this));
        this.reload();
    }

    public batch(...items: Function[]) {
        const old = this._disabled;
        this._disabled = true;
        for (const fn of items) {
            fn();
        }
        this._disabled = old;
        this.reload();
    }

    public reload() {
        if (this._disabled) {
            return;
        }
        this.clear();
        for (const layer of this._items) {
            layer.update(this._ctx);
        }
    }

    public saveAs(type?: string) {
        if (!type) {
            type = 'image/jpeg'; // 'png';
        }
        return this.element.toDataURL(type);
    }
}