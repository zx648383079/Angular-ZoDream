import { IBound } from '../../../../theme/utils/canvas';
import { Canvas } from './Canvas';

export abstract class CanvasLayer {
    constructor(
        protected parent: Canvas
    ) {
    }

    public locked = false;
    public hidden = false;

    public get bound(): IBound {
        return {x: 0, y: 0, width: 0, height: 0};
    }


    public abstract update(ctx: CanvasRenderingContext2D): void;
}