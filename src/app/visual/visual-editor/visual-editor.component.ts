import { AfterViewInit, Component, ElementRef, NgZone, OnInit, Renderer2, ViewChild } from '@angular/core';
import { EditorWorkBodyComponent } from './editor-work-body/editor-work-body.component';
import { EditorService } from './editor.service';
import { Widget, AddWeightCommand } from './model';
import { elementBound } from './util';

@Component({
  selector: 'app-visual-editor',
  templateUrl: './visual-editor.component.html',
  styleUrls: ['./visual-editor.component.scss']
})
export class VisualEditorComponent implements OnInit, AfterViewInit {

    @ViewChild('mainBox', {static: true})
    public mainRef: ElementRef<HTMLDivElement>;
    @ViewChild(EditorWorkBodyComponent)
    private workBody: EditorWorkBodyComponent;
    public tempWidget: Widget;

    constructor(
        private readonly renderer: Renderer2,
        private service: EditorService,
        private ngZone: NgZone,
    ) {}

    ngOnInit() {
        this.renderer.listen(window, 'resize', () => {
            this.refreshSize();
        });
        this.renderer.listen(document, 'keydown', (event: KeyboardEvent) => {
            if (event.ctrlKey) {
                // if (event.code === 'KeyV') {
                //     // 粘贴
                //     console.log(window.clipboardData.getData('text/plain'));
                    
                // }
                if (event.code === 'KeyZ') {
                    event.stopPropagation();
                    if (event.shiftKey) {
                        this.service.workEditor.reverseUndo();
                    } else {
                        this.service.workEditor.undo();
                    }
                }
                if (event.code === 'Equal') {
                    event.preventDefault();
                    // 放大
                    this.workBody.scale(0, 10);
                }
                if (event.code === 'Minus') {
                    event.preventDefault();
                    // 缩小
                    this.workBody.scale(0, -10);
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
            this.service.mouseUp$.next({x: event.clientX, y: event.clientY});
        });
        this.renderer.listen(document, 'mousemove', (event: MouseEvent) => {
            this.service.mouseMove$.next({x: event.clientX, y: event.clientY});
        });
        this.service.moveWidget$.subscribe(res => {
            if (!res.start) {
                this.service.mouseMove();
                this.workBody.executeCommand(new AddWeightCommand(this.workBody, this.service.newWidget(res.data)));
                return;
            }
            this.service.mouseMove(event => {
                const point = {
                    x: event.x,
                    y: event.y,
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
                this.workBody.executeCommand(new AddWeightCommand(this.workBody, this.service.newWidget(res.data), item.location));
            });

        });
    }

    ngAfterViewInit() {
        setTimeout(() => {
            this.refreshSize();
        }, 100);
    }

    private refreshSize() {
        this.service.resize$.next({
            main: elementBound(this.mainRef),
            zoom: elementBound(this.workBody.elementRef),
        });
    }

    private refreshZoom() {
        const res = this.service.resize$.value;
        if (!res) {
            return;
        }
        setTimeout(() => {
            res.zoom = elementBound(this.workBody.elementRef);
            this.service.resize$.next(res);
        }, 100);
    }
}
