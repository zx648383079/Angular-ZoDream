import { AfterViewInit, Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { ContextMenuComponent } from '../../context-menu';
import { EditorService } from './editor.service';
import { Widget } from './model';
import { IBound } from './model/core';
import * as menu from './model/menu';
import { SelectionBound } from './model/selection';

enum ACTION {
    NONE,
    SELECTION,
    MOVE_WIDGET,
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
    /**
     * 临时数据，需要鼠标移动才会使用的数据
     */
    private moveData: any;
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

    constructor(
        private readonly renderer: Renderer2,
        private service: EditorService,
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
            if (old === ACTION.MOVE_WIDGET && this.tempWidget) {
                const item = this.tempWidget;
                this.tempWidget = undefined;
                if (this.service.inZoom(item)) {
                    this.service.pushWidget(this.service.zoomLocation(item));
                }
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
    }

    ngAfterViewInit() {
        this.refreshSize();
    }

    public onSelectStart(event: MouseEvent) {
        this.status = ACTION.SELECTION;
        this.selectionRect.start = {
            x: event.clientX,
            y: event.clientY
        };
    }

    private refreshSize() {
        this.service.resize$.next({
            main: this.formatBound(this.mainRef),
            zoom: this.formatBound(this.zoomRef),
        });
    }

    public onContext(e: MouseEvent) {
        e.stopPropagation();
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
