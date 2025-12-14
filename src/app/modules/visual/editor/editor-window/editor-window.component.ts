import { Component, ElementRef, OnInit, Renderer2, inject, viewChild } from '@angular/core';
import { EditorWorkBodyComponent } from '../editor-work-body/editor-work-body.component';
import { AddWeightCommand, MENU_ACTION, Widget } from '../model';
import { EditorService } from '../editor.service';

@Component({
    standalone: false,
    selector: 'app-editor-window',
    templateUrl: './editor-window.component.html',
    styleUrls: ['./editor-window.component.scss']
})
export class EditorWindowComponent implements OnInit {
    private readonly renderer = inject(Renderer2);
    private readonly service = inject(EditorService);


    public readonly mainRef = viewChild<ElementRef<HTMLDivElement>>('mainBox');
    private readonly workBody = viewChild(EditorWorkBodyComponent);
    public tempWidget: Widget;
    public editorStyle: any = {};
    public workStyle: any = {};

    ngOnInit() {
        this.service.editorSize$.subscribe(res => {
            if (!res) {
                return;
            }
            this.editorStyle = {
                width: res.width + 'px',
                height: res.height + 'px'
            };
            this.workStyle = {
                width: res.width - 460 + 'px',
                height: res.height + 'px'
            };
            this.service.workspaceSize$.next({
                x: res.x + 200,
                y: res.y,
                width: res.width - 460,
                height: res.height,
            });
        });
        this.renderer.listen(document, 'keydown', (event: KeyboardEvent) => {
            if (event.code === 'Delete' || event.code === 'Backspace') {
                this.workBody().execute(MENU_ACTION.DELETE);
                return;
            }
            if (event.ctrlKey) {
                // if (event.code === 'KeyV') {
                //     // 粘贴
                //     console.log(window.clipboardData.getData('text/plain'));
                    
                // }
                if (event.code === 'KeyA') {
                    event.preventDefault();
                    this.workBody().execute(MENU_ACTION.SELECT_ALL);
                    return;
                }
                if (event.code === 'KeyZ') {
                    event.stopPropagation();
                    this.workBody().execute(event.shiftKey ? MENU_ACTION.FORWARD : MENU_ACTION.BACK);
                    return;
                }
                if (event.code === 'KeyG') {
                    event.preventDefault();
                    this.workBody().execute(event.shiftKey ? MENU_ACTION.SPLIT : MENU_ACTION.MERGE);
                    return;
                }
                if (event.code === 'KeyH') {
                    event.preventDefault();
                    this.workBody().execute(event.shiftKey ? MENU_ACTION.HIDE_RULE : MENU_ACTION.VISIBLE_RULE);
                    return;
                }
                if (event.code === 'Equal') {
                    event.preventDefault();
                    // 放大
                    this.workBody().execute(MENU_ACTION.SCALE_UP);
                    return;
                }
                if (event.code === 'Minus') {
                    event.preventDefault();
                    // 缩小
                    this.workBody().execute(MENU_ACTION.SCALE_DOWN);
                    return;
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
                this.workBody().executeCommand(new AddWeightCommand(this.workBody(), this.service.newWidget(res.data)));
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
                if (!item) {
                    return;
                }
                this.tempWidget = undefined;
                this.workBody().executeCommand(new AddWeightCommand(this.workBody(), this.service.newWidget(res.data), item.location));
            });

        });
    }

}
