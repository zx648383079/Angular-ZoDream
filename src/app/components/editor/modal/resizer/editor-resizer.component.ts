import { Component } from '@angular/core';
import { IBound } from '../../base';

@Component({
    selector: 'app-editor-resizer',
    templateUrl: './editor-resizer.component.html',
    styleUrls: ['./editor-resizer.component.scss']
})
export class EditorResizerComponent {

    private visible = false;
    private rectBound?: IBound;

    constructor() { }

    public get boxStyle() {
        if (!this.visible) {
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

    public open(bound: IBound) {
        this.visible = true;
        this.rectBound = bound;
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

    private mouseMove(start: MouseEvent, move: (last: IBound, x: number, p: number) => IBound) {
        if (!this.visible) {
            return;
        }
        // const oldBound = {...this.widgetBound};
        // const oldItems = this.widgetItems.map(i => i.bound);
        // let last: IPoint = {x: start.clientX, y: start.clientY};
        // this.service.mouseMove(p => {
        //     const offsetX = p.x - last.x;
        //     const offsetY = p.y - last.y;
        //     this.widgetBound = move(this.widgetBound, offsetX, offsetY);
        //     for (const item of this.widgetItems) {
        //         item.bound = move(item.bound, offsetX, offsetY);
        //     }
        //     last = p;
        // }, _ => {
        //     this.service.workspace.executeCommand(
        //         new BatchCommand(
        //             ...this.widgetItems.map((i, j) => new ResizeWidgetCommand(i, oldItems[j], i.bound)),
        //             new ResizeWidgetCommand(this, oldBound, this.widgetBound)
        //         )
        //     );
        // });
    }
}
