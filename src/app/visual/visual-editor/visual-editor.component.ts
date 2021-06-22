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
    private selectionRect = new SelectionBound();
    public tempWidget: Widget;
    public vBar = new ScrollBar();
    public hBar = new ScrollBar();
    private moveListeners = {
        move: undefined,
        finish: undefined,
    };
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
        this.renderer.listen(document, 'mouseup', (event: MouseEvent) => {
            if (this.moveListeners.finish) {
                this.moveListeners.finish(event);
            }
        });
        this.renderer.listen(document, 'mousemove', (event: MouseEvent) => {
            if (this.moveListeners.move) {
                this.moveListeners.move(event);
            }
        });
        this.service.moveWidget$.subscribe(res => {
            if (!res.start) {
                this.clearMove();
                this.service.pushWidget(this.service.newWidget(res.data));
                return;
            }
            this.move(event => {
                const point = {
                    x: event.clientX,
                    y: event.clientY,
                };
                if (!this.tempWidget) {
                    const item = this.service.newWidget(res.data);
                    item.location = point;
                    this.tempWidget = item;
                } else if (this.tempWidget) {
                    this.tempWidget.location = point;
                }
            }, () => {
                const item = this.tempWidget;
                this.tempWidget = undefined;
                if (item && this.service.inZoom(item)) {
                    this.service.pushWidget(this.service.zoomLocation(item));
                }
            });

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
        if (this.moveListeners.finish) {
            return;
        }
        this.selectionRect.start = {
            x: event.clientX,
            y: event.clientY
        };
        this.move(event => {
            this.selectionRect.end = {
                x: event.clientX,
                y: event.clientY
            };
        });
    }

    public onResizing(e: IPoint) {
        let lastY = e.y;
        this.move(event => {
            this.vBar.innerLength += event.clientY - lastY;
            lastY = event.clientY;
        }, () => {
            this.refreshZoom();
        });
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

    public scrolBarMove(hor: boolean, e: MouseEvent) {
        let last = hor ? e.clientX : e.clientY;
        this.move(event => {
            if (hor) {
                this.hBar.move(event.clientX - last);
                last = event.clientX;
            } else {
                this.vBar.move(event.clientY - last);
                last = event.clientY;
            }
        }, () => {
            this.refreshZoom();
        });
    }

    public onContext(e: MouseEvent, item?: Widget) {
        const navItems = this.inSelection(e.clientX, e.clientY) ? menu.EditorSelected : menu.EditorNotSelected;
        return this.contextMenu.show(e, navItems, menu => {
            if (menu.name === '删除' && item) {
                this.service.removeWidget(item);
            }
        });
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

    private move(move: (event: MouseEvent) => void, finish?: (event: MouseEvent) => void) {
        this.moveListeners = {
            move,
            finish: (event: MouseEvent) => {
                this.clearMove();
                finish && finish(event);
            },
        };
    }

    private clearMove() {
        this.moveListeners = {move: undefined, finish: undefined};
    }

}
