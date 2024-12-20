import { Component, HostListener } from '@angular/core';
import { EditorUpdatedCallback } from '../../base';
import { EditorBlockType, IEditorResizeBlock } from '../../model';
import { IBound, IPoint } from '../../../../theme/utils/canvas';

@Component({
    standalone: false,
    selector: 'app-editor-resizer',
    templateUrl: './editor-resizer.component.html',
    styleUrls: ['./editor-resizer.component.scss']
})
export class EditorResizerComponent {

    public toolType = 0;
    private rectBound?: IBound;
    private mouseMoveListeners = {
        move: undefined,
        finish: undefined,
    };
    private updatedHandler: EditorUpdatedCallback;

    constructor() { }

    public get boxStyle() {
        if (this.toolType !== 1) {
            return {
                display: 'none',
            };
        }
        return {
            display: 'block',
            left: this.rectBound.x + 'px',
            top: this.rectBound.y + 'px',
            width: this.rectBound.width + 'px',
            height: this.rectBound.height + 'px',
        };
    }

    public get horizontalStyle() {
        if (this.toolType !== 2) {
            return {
                display: 'none',
            };
        }
        return {
            display: 'block',
            left: this.rectBound.x + 'px',
            top: this.rectBound.y + 'px',
            height: this.rectBound.height + 'px',
        };
    }

    public get verticalStyle() {
        if (this.toolType !== 3) {
            return {
                display: 'none',
            };
        }
        return {
            display: 'block',
            left: this.rectBound.x + 'px',
            top: this.rectBound.y + 'px',
            width: this.rectBound.width + 'px',
        };
    }

    @HostListener('document:mousemove', ['$event'])
    private docMouseMove(e: MouseEvent) {
        if (this.mouseMoveListeners.move) {
            this.mouseMoveListeners.move({x: e.clientX, y: e.clientY});
        }
    }

    @HostListener('document:mouseup', ['$event'])
    private docMouseUp(e: MouseEvent) {
        if (this.mouseMoveListeners.finish) {
            this.mouseMoveListeners.finish({x: e.clientX, y: e.clientY});
        }
    }

    public openResize(bound: IBound, cb: EditorUpdatedCallback) {
        this.toolType = 1;
        this.updatedHandler = cb;
        this.rectBound = bound;
    }

    public openHorizontalResize(bound: IBound, cb: EditorUpdatedCallback) {
        this.toolType = 2;
        this.updatedHandler = cb;
        this.rectBound = bound;
        this.mouseMove(undefined, (b, x, y) => {
            return {
                ...b,
                x: b.x  + x,
            };
        });
    }

    
    public openVerticalResize(bound: IBound, cb: EditorUpdatedCallback) {
        this.toolType = 3;
        this.updatedHandler = cb;
        this.rectBound = bound;
        this.mouseMove(undefined, (b, x, y) => {
            return {
                ...b,
                y: b.y + y,
            };
        });
    }

    public close() {
        this.toolType = 0;
    }


    public onMoveLt(e: MouseEvent) {
        this.mouseMove(e, (b, x, y) => {
            return {
                x: b.x  + x,
                y: b.y  + y,
                width: b.width  - x,
                height: b.height - y,
            };
        });
    }
    public onMoveT(e: MouseEvent) {
        this.mouseMove(e, (b, x, y) => {
            return {
                ...b,
                y: b.y  + y,
                height: b.height - y,
            };
        });
    }
    public onMoveRt(e: MouseEvent) {
        this.mouseMove(e, (b, x, y) => {
            return {
                ...b,
                y: b.y  + y,
                height: b.height - y,
                width: b.width + x
            };
        });
    }
    public onMoveR(e: MouseEvent) {
        this.mouseMove(e, (b, x, y) => {
            return {
                ...b,
                width: b.width + x
            };
        });
    }
    public onMoveRb(e: MouseEvent) {
        this.mouseMove(e, (b, x, y) => {
            return {
                ...b,
                height: b.height + y,
                width: b.width + x
            };
        });
    }
    public onMoveB(e: MouseEvent) {
        this.mouseMove(e, (b, x, y) => {
            return {
                ...b,
                height: b.height + y,
            };
        });
    }
    public onMoveLb(e: MouseEvent) {
        this.mouseMove(e, (b, x, y) => {
            return {
                ...b,
                x: b.x + x,
                width: b.width - x,
                height: b.height + y,
            };
        });
    }
    public onMoveL(e: MouseEvent) {
        this.mouseMove(e, (b, x, y) => {
            return {
                ...b,
                x: b.x + x,
                width: b.width - x,
            };
        });
    }

    private mouseMove(start: MouseEvent|undefined, move: (last: IBound, x: number, y: number) => IBound) {
        if (this.toolType < 1) {
            return;
        }
        let last: IPoint
        if (start) {
            start.stopPropagation();
            last = {x: start.clientX, y: start.clientY};
        }
        this.onMouseMove(p => {
            if (!last) {
                last = {x: p.x, y: p.y};
                return;
            }
            const offsetX = p.x - last.x;
            const offsetY = p.y - last.y;
            this.rectBound = move(this.rectBound, offsetX, offsetY);
            last = p;
        }, _ => {
            const toolType = this.toolType;
            this.toolType = 0;
            if (!this.updatedHandler) {
                return;
            }
            if (toolType === 1) {
                this.updatedHandler(<IEditorResizeBlock>{
                    type: EditorBlockType.NodeResize,
                    ...this.rectBound,
                });
                return;
            } else if (toolType === 2 || toolType === 3) {
                this.updatedHandler(<IEditorResizeBlock>{
                    type: EditorBlockType.NodeMove,
                    ...this.rectBound,
                });
            }
        });
    }

    private onMouseMove(move?: (p: IPoint) => void, finish?: (p: IPoint) => void) {
        this.mouseMoveListeners = {
            move,
            finish: !move && !finish ? undefined : (p: IPoint) => {
                this.mouseMoveListeners = {move: undefined, finish: undefined};
                finish && finish(p);
            },
        };
    }
}
