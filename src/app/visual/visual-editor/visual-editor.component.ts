import { AfterViewInit, Component, ElementRef, NgZone, OnInit, Renderer2, ViewChild } from '@angular/core';
import { ContextMenuComponent } from '../../context-menu';
import { EditorService } from './editor.service';
import { Widget } from './model';
import { IBound, IPoint, LocationPoint, ScrollBar } from './model/core';
import * as menu from './model/menu';
import { SelectionBound } from './model/selection';

enum ACTION {
    NONE,
    SELECTION,
    MOVE_WIDGET,
    H_SCROLL,
    V_SCROLL,
    RESIZE,
}

@Component({
  selector: 'app-visual-editor',
  templateUrl: './visual-editor.component.html',
  styleUrls: ['./visual-editor.component.scss']
})
export class VisualEditorComponent implements OnInit, AfterViewInit {

    @ViewChild('mainBox', {static: true})
    public mainRef: ElementRef<HTMLDivElement>;
    @ViewChild('zoomBox', {static: true})
    public zoomRef: ElementRef<HTMLDivElement>;
    @ViewChild(ContextMenuComponent)
    public contextMenu: ContextMenuComponent;
    private status = ACTION.NONE;
    private selectionRect = new SelectionBound();
    public tempWidget: Widget;
    public vBar = new ScrollBar();
    public hBar = new ScrollBar();
    /**
     * 临时数据，需要鼠标移动才会使用的数据
     */
    private moveData: any;
    private lastPoint = new LocationPoint();
    public get widgetItems$() {
        return this.service.widgetCellItems$;
    }

    public get selectionStyle() {
        const bound = this.selectionRect.box;
        return {
            left: bound.x + 'px',
            top: bound.y + 'px',
            width: bound.width + 'px',
            height: bound.height + 'px',
            'z-index': 100,
        };
    }

    public get zoomStyle() {
        if (this.hBar.innerLength <= 0) {
            return {};
        } 
        return {
            width: this.hBar.innerLength + 'px',
            height: this.vBar.innerLength + 'px',
            transform: 'translate(' + (-this.hBar.innerOffset) +  'px, '+ (-this.vBar.innerOffset) +'px)',
        };
    }

    public get barHStyle() {
        return this.hBar.barHStyle;
    }

    public get barVStyle() {
        return this.vBar.barVStyle;
    }

    constructor(
        private readonly renderer: Renderer2,
        private service: EditorService,
        private ngZone: NgZone,
    ) { }

    ngOnInit() {
        this.renderer.listen(window, 'resize', () => {
            this.refreshSize();
        });
        this.renderer.listen(document, 'keydown', (event: KeyboardEvent) => {
            // if (event.ctrlKey && event.code === 'KeyV') {
            //     // 粘贴
            //     console.log(window.clipboardData.getData('text/plain'));
                
            // }
            if (event.ctrlKey && event.code === 'KeyZ') {
                if (event.shiftKey) {
                    this.service.histories.goForward();
                } else {
                    this.service.histories.goBack();
                }
            }
        });
        this.renderer.listen(document, 'paste', (event: any) => {
            if (event.clipboardData || event.originalEvent) {
                const clipboardData = (event.clipboardData || (window as any).clipboardData);
                const val = clipboardData.getData('text');
            }
        });
        this.renderer.listen(document, 'mouseup', () => {
            const old = this.status;
            this.status = ACTION.NONE;
            this.lastPoint.isNull = true;
            if (old === ACTION.MOVE_WIDGET && this.tempWidget) {
                const item = this.tempWidget;
                this.tempWidget = undefined;
                if (this.service.inZoom(item)) {
                    this.service.pushWidget(this.service.zoomLocation(item));
                }
            }
            if (old === ACTION.RESIZE || old === ACTION.H_SCROLL || old === ACTION.V_SCROLL) {
                this.refreshZoom();
            }
        });
        this.renderer.listen(document, 'mousemove', (event: MouseEvent) => {
            const point = {
                x: event.clientX,
                y: event.clientY
            };
            if (this.status === ACTION.SELECTION) {
                this.selectionRect.end = point;
            } else if (this.status === ACTION.MOVE_WIDGET) {
                if (!this.tempWidget && this.moveData) {
                    const item = this.service.newWidget(this.moveData.data);
                    item.location = point;
                    this.tempWidget = item;
                    this.moveData = undefined;
                } else if (this.tempWidget) {
                    this.tempWidget.location = point;
                }
            } else if (this.status === ACTION.H_SCROLL) {
                this.hBar.move(this.lastPoint.xDistance(point));
                this.lastPoint.move(point);
            } else if (this.status === ACTION.V_SCROLL) {
                this.vBar.move(this.lastPoint.yDistance(point));
                this.lastPoint.move(point);
            } else if (this.status === ACTION.RESIZE) {
                this.vBar.innerLength += this.lastPoint.yDistance(point);
                this.lastPoint.move(point);
            }
        });
        this.service.moveWidget$.subscribe(res => {
            if (!res.start) {
                this.service.pushWidget(this.service.newWidget(this.moveData.data));
                return;
            }
            this.status = ACTION.MOVE_WIDGET;
            this.moveData = res;
        });
        this.service.resize$.subscribe(res => {
            if (!res) {
                return;
            }
            this.ngZone.run(() => {
                this.vBar.boxLength = res.main.height;
                this.vBar.innerLength = res.zoom.height;
                this.hBar.boxLength = res.main.width;
                this.hBar.innerLength = res.zoom.width;
            });
        });
    }

    ngAfterViewInit() {
        this.renderer.listen(this.mainRef.nativeElement, 'wheel', (event: WheelEvent) => {
            this.ngZone.run(() => {
                // this.hBar.move(event.deltaX);
                this.vBar.move(event.deltaY);
                this.refreshZoom();
            });
        });
        this.refreshSize();
    }

    public onSelectStart(event: MouseEvent) {
        if (this.status !== ACTION.NONE) {
            return;
        }
        this.status = ACTION.SELECTION;
        this.selectionRect.start = {
            x: event.clientX,
            y: event.clientY
        };
    }

    public onResizing(event: IPoint) {
        this.status = ACTION.RESIZE;
        this.lastPoint.move(event);
    }

    private refreshSize() {
        this.service.resize$.next({
            main: this.formatBound(this.mainRef),
            zoom: this.formatBound(this.zoomRef),
        });
    }

    private refreshZoom() {
        const res = this.service.resize$.value;
        if (!res) {
            return;
        }
        setTimeout(() => {
            res.zoom = this.formatBound(this.zoomRef);
            this.service.resize$.next(res);
        }, 100);
    }

    public scrolBarMove(hor: boolean, event: MouseEvent) {
        this.status = hor ? ACTION.H_SCROLL : ACTION.V_SCROLL;
        this.lastPoint.move(event.clientX, event.clientY);
    }

    public onContext(e: MouseEvent) {
        const navItems = this.inSelection(e.clientX, e.clientY) ? menu.EditorSelected : menu.EditorNotSelected;
        this.contextMenu.show(e, navItems);
        return false;
    }

    private inSelection(x: number, y: number) {
        return true;
    }

    private formatBound(ref: ElementRef<HTMLDivElement>): IBound {
        if (!ref || !ref.nativeElement) {
            return undefined;
        }
        const rect = ref.nativeElement.getBoundingClientRect();
        return {
            x: rect.left,
            y: rect.top,
            width: rect.width,
            height: rect.height
        };
    }

}
