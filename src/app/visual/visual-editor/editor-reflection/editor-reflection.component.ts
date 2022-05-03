import { Component, OnInit } from '@angular/core';
import { BatchCommand, ResizeWidgetCommand } from '../command';
import { EditorService } from '../editor.service';
import { IBound, IPoint, Widget } from '../model';
import { maxBound } from '../util';

enum EditMode {
    NONE,
    HOVER,
    EDIT,
}

@Component({
  selector: 'app-editor-reflection',
  templateUrl: './editor-reflection.component.html',
  styleUrls: ['./editor-reflection.component.scss']
})
export class EditorReflectionComponent implements OnInit {

    public mode = EditMode.NONE;

    private widgetBound?: IBound;
    private widgetItems: Widget[] = [];

    public get boxStyle() {
        if (!this.widgetBound) {
            return {
                display: 'none',
            };
        }
        return {
            display: 'block',
            left: this.widgetBound.x + 'px',
            top: this.widgetBound.y + 'px',
            width: this.widgetBound.width + 'px',
            height: this.widgetBound.height + 'px',
        };
    }

    public get boxCls() {
        if (this.mode === EditMode.EDIT) {
            return 'edit-in';
        }
        if (this.mode === EditMode.HOVER) {
            return 'edit-hover';
        }
        return 'edit-hide';
    }

    public set bound(args: IBound) {
        this.widgetBound = args;
    }

    constructor(
        private service: EditorService,
    ) { }

    ngOnInit() {
        this.service.selectionChanged$.subscribe(res => {
            this.widgetItems = res;
            if (res.length < 1) {
                this.widgetBound = undefined;
                this.mode = EditMode.NONE;
                return;
            }
            this.widgetBound = maxBound(res);
            this.mode = EditMode.EDIT;
        });
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
        if (this.widgetItems.length < 1 || !this.widgetBound) {
            return;
        }
        const oldBound = {...this.widgetBound};
        const oldItems = this.widgetItems.map(i => i.bound);
        let last: IPoint = {x: start.clientX, y: start.clientY};
        this.service.mouseMove(p => {
            const offsetX = p.x - last.x;
            const offsetY = p.y - last.y;
            this.widgetBound = move(this.widgetBound, offsetX, offsetY);
            for (const item of this.widgetItems) {
                item.bound = move(item.bound, offsetX, offsetY);
            }
            last = p;
        }, _ => {
            this.service.commandManager.executeCommand(
                new BatchCommand(
                    ...this.widgetItems.map((i, j) => new ResizeWidgetCommand(i, oldItems[j], i.bound)),
                    new ResizeWidgetCommand(this, oldBound, this.widgetBound)
                )
            );
        });
    }
}
