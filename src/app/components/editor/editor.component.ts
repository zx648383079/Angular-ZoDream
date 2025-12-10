import { AfterViewInit, Component, ComponentRef, ElementRef, OnDestroy, OnInit, OutputRefSubscription, ViewContainerRef, ViewEncapsulation, effect, inject, input, model, viewChild } from '@angular/core';
import { EDITOR_ADD_TOOL, EDITOR_CLOSE_TOOL, EDITOR_CODE_TOOL, EDITOR_ENTER_TOOL, EDITOR_FULL_SCREEN_TOOL, EDITOR_IMAGE_TOOL, EDITOR_LINK_TOOL, EDITOR_REDO_TOOL, EDITOR_TABLE_TOOL, EDITOR_UNDO_TOOL, EDITOR_EVENT_CLOSE_TOOL, EDITOR_EVENT_SHOW_ADD_TOOL, EDITOR_EVENT_SHOW_COLUMN_TOOL, EDITOR_EVENT_SHOW_IMAGE_TOOL, EDITOR_EVENT_SHOW_LINE_BREAK_TOOL, EDITOR_EVENT_SHOW_LINK_TOOL, EDITOR_EVENT_SHOW_TABLE_TOOL, EDITOR_EVENT_UNDO_CHANGE, IEditorTool, EDITOR_EVENT_CUSTOM, IEditorContainer } from './base';
import { IEditor, IEditorBlock, IEditorModal } from './model';
import { EditorResizerComponent } from './modal/resizer/editor-resizer.component';
import { CodeEditorComponent } from './code-editor/code-editor.component';
import { EditorService } from './container';
import { FormValueControl } from '@angular/forms/signals';

@Component({
    standalone: false,
    encapsulation: ViewEncapsulation.None,
    selector: 'app-zre-editor',
    templateUrl: './editor.component.html',
    styleUrls: ['./editor.component.scss'],
})
export class EditorComponent implements OnInit, AfterViewInit, OnDestroy, FormValueControl<string>, IEditor {

    private readonly modalViewContainer = viewChild('modalVC', { read: ViewContainerRef });
    private readonly editorViewRef = viewChild<ElementRef<HTMLDivElement>>('EditorView');
    private readonly resizer = viewChild(EditorResizerComponent);
    private readonly codeEditor = viewChild(CodeEditorComponent);
    public readonly height = input<number | string>('auto');
    public topLeftItems: IEditorTool[] = [];
    public topRightItems: IEditorTool[] = [];
    public subItems: IEditorTool[] = [];
    public flowItems: IEditorTool[] = [];
    public flowStyle: any = {};
    public subIsRight = false;
    public subParent = '';
    public readonly disabled = input<boolean>(false);
    public readonly value = model<string>('');
    public isCodeMode = false;
    public isFullScreen = false;
    private flowOldItems :IEditorTool[] = [];
    private modalRef: ComponentRef<IEditorModal>;
    private container: EditorService;


    constructor() {
        const container = inject(EditorService);

        this.container = container.clone();
        this.topLeftItems = this.container.option.leftToolbar;
        this.topRightItems = this.container.option.rightToolbar;
        effect(() => this.container.value = this.value());
    }

    ngOnInit() {
        this.container.on(EDITOR_EVENT_UNDO_CHANGE, () => {
            for (const item of this.topRightItems) {
                if (item.name === EDITOR_UNDO_TOOL) {
                    item.disabled = !this.container.canUndo;
                } else if (item.name === EDITOR_REDO_TOOL) {
                    item.disabled = !this.container.canRedo;
                }
            }
        });
        this.container.on(EDITOR_EVENT_SHOW_ADD_TOOL, y => {
            if (this.modalRef) {
                this.modalRef.destroy();
                this.modalRef = undefined;
            }
            this.flowItems = this.container.option.tool(EDITOR_ADD_TOOL);
            this.flowStyle = {
                top: y + 'px'
            };
        });
        this.container.on(EDITOR_EVENT_SHOW_LINE_BREAK_TOOL, p => {
            this.flowItems = this.container.option.tool(EDITOR_ENTER_TOOL);
            this.flowStyle = {
                top: p.y + 'px',
            };
        });
        this.container.on(EDITOR_EVENT_SHOW_TABLE_TOOL, p => {
            this.flowItems = this.container.option.toolChildren(EDITOR_TABLE_TOOL);
            this.flowStyle = {
                top: p.y + 'px',
                left: p.x + 'px',
            };
        });
        this.container.on(EDITOR_EVENT_SHOW_LINK_TOOL, p => {
            this.flowItems = this.container.option.toolChildren(EDITOR_LINK_TOOL);
            this.flowStyle = {
                top: p.y + 'px',
                left: p.x + 'px',
            };
        });
        this.container.on(EDITOR_EVENT_SHOW_IMAGE_TOOL, (p, cb) => {
            this.flowItems = this.container.option.toolChildren(EDITOR_IMAGE_TOOL);
            this.flowStyle = {
                top: p.y + p.height + 20 + 'px',
                left: p.x + 'px',
            };
            this.resizer().openResize(p, cb);
        });
        this.container.on(EDITOR_EVENT_SHOW_COLUMN_TOOL, (p, cb) => {
            this.resizer().openHorizontalResize(p, cb);
        });
        let lastSync: OutputRefSubscription;
        this.container.on(EDITOR_EVENT_CLOSE_TOOL, () => {
            this.flowItems = [];
            if (this.modalRef) {
                this.modalRef.destroy();
                this.modalRef = undefined;
            }
            this.resizer().close();
        }).on(EDITOR_EVENT_CUSTOM, e => {
            if (e.name === EDITOR_CODE_TOOL) {
                this.isCodeMode = !this.isCodeMode;
                lastSync.unsubscribe();
                if (this.isCodeMode) {
                    this.codeEditor().value.set(this.container.value);
                    lastSync = this.codeEditor().value.subscribe(res => {
                        this.value.set(res);
                    });
                }
                return;
            }
            if (e.name === EDITOR_FULL_SCREEN_TOOL) {
                this.isFullScreen = !this.isFullScreen;
            }
        });
    }

    ngAfterViewInit(): void {
        this.container.ready(this.editorViewRef().nativeElement, this.modalViewContainer());
    }

    ngOnDestroy(): void {
        this.container.destroy();
    }

    public get areaStyle() {
        const height = this.height();
        if (!height || height == 'auto') {
            return {};
        }
        if (typeof height === 'string' && /(rem|em|px|vw|vh|%)$/.test(height)) {
            return {
                height: height,
                'min-height': 0,
                'overflow-y': 'auto',
            };
        }
        return {
            height: height as number - (this.subItems.length > 0 ? 40 : 0) + 'px',
            'min-height': 0,
            'overflow-y': 'auto',
        };
    }

    public tapTool(item: IEditorTool, isRight: boolean, event: MouseEvent) {
        this.container.focus();
        if (item.name === this.subParent) {
            this.subItems = [];
        } else {
            const next = this.container.option.toolChildren(item.name);
            if (next.length === 0) {
                this.container.emitTool(item, event);
                return;
            }
            this.subItems = next;
        }
        this.subParent = this.subItems.length > 0 ? item.name : '';
        this.subIsRight = isRight;
    }

    public tapFlowTool(item: IEditorTool, event: MouseEvent) {
        this.container.focus();
        if (item.name === EDITOR_CLOSE_TOOL) {
            this.flowItems = this.flowOldItems;
            this.flowOldItems = [];
            return;
        }
        const items = this.container.option.toolChildren(item.name);
        if (items.length > 0) {
            this.flowOldItems = this.flowItems;
            this.flowItems = [this.container.option.closeTool, ...items];
            return;
        }
        this.flowItems = [];
        this.container.emitTool(item, event);
    }

    public insert(block: IEditorBlock|string): void {
        this.container.insert(block);
    }
}
