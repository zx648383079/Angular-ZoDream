import { AfterViewInit, Component, ComponentRef, ElementRef, Injector, Input, OnDestroy, OnInit, ViewChild, ViewContainerRef, ViewEncapsulation, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { EDITOR_ADD_TOOL, EDITOR_CLOSE_TOOL, EDITOR_CODE_TOOL, EDITOR_ENTER_TOOL, EDITOR_FULL_SCREEN_TOOL, EDITOR_IMAGE_TOOL, EDITOR_LINK_TOOL, EDITOR_REDO_TOOL, EDITOR_TABLE_TOOL, EDITOR_UNDO_TOOL, EVENT_CLOSE_TOOL, EVENT_SHOW_ADD_TOOL, EVENT_SHOW_COLUMN_TOOL, EVENT_SHOW_IMAGE_TOOL, EVENT_SHOW_LINE_BREAK_TOOL, EVENT_SHOW_LINK_TOOL, EVENT_SHOW_TABLE_TOOL, EVENT_UNDO_CHANGE, IEditorTool } from './base';
import { EditorContainer } from './container';
import { IEditor, IEditorBlock, IEditorModal } from './model';
import { EditorResizerComponent } from './modal/resizer/editor-resizer.component';
import { CodeEditorComponent } from './code-editor/code-editor.component';

@Component({
    encapsulation: ViewEncapsulation.None,
    selector: 'app-zre-editor',
    templateUrl: './editor.component.html',
    styleUrls: ['./editor.component.scss'],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => EditorComponent),
            multi: true
        }
    ]
})
export class EditorComponent implements OnInit, AfterViewInit, OnDestroy, ControlValueAccessor, IEditor {

    @ViewChild('modalVC', {read: ViewContainerRef})
    private modalViewContainer: ViewContainerRef;
    @ViewChild('EditorView', {static: true})
    private editorViewRef: ElementRef<HTMLDivElement>;
    @ViewChild(EditorResizerComponent)
    private resizer: EditorResizerComponent;
    @ViewChild(CodeEditorComponent)
    private codeEditor: CodeEditorComponent;
    @Input() public height: number|string = 'auto';
    public topLeftItems: IEditorTool[] = [];
    public topRightItems: IEditorTool[] = [];
    public subItems: IEditorTool[] = [];
    public flowItems: IEditorTool[] = [];
    public flowStyle: any = {};
    public subIsRight = false;
    public subParent = '';
    public disabled = false;
    public isCodeMode = false;
    public isFullScreen = false;
    private flowOldItems :IEditorTool[] = [];
    private container = new EditorContainer();
    private modalRef: ComponentRef<IEditorModal>;
    onChange: any = () => { };
    onTouch: any = () => { };

    constructor(
        private injector: Injector,
    ) {
        this.topLeftItems = this.container.option.leftToolbar;
        this.topRightItems = this.container.option.rightToolbar;
    }

    ngOnInit() {
        this.container.on(EVENT_UNDO_CHANGE, () => {
            for (const item of this.topRightItems) {
                if (item.name === EDITOR_UNDO_TOOL) {
                    item.disabled = !this.container.canUndo;
                } else if (item.name === EDITOR_REDO_TOOL) {
                    item.disabled = !this.container.canRedo;
                }
            }
        });
        this.container.on(EVENT_SHOW_ADD_TOOL, y => {
            if (this.modalRef) {
                this.modalRef.destroy();
                this.modalRef = undefined;
            }
            this.flowItems = this.container.option.tool(EDITOR_ADD_TOOL);
            this.flowStyle = {
                top: y + 'px'
            };
        });
        this.container.on(EVENT_SHOW_LINE_BREAK_TOOL, p => {
            this.flowItems = this.container.option.tool(EDITOR_ENTER_TOOL);
            this.flowStyle = {
                top: p.y + 'px',
            };
        });
        this.container.on(EVENT_SHOW_TABLE_TOOL, p => {
            this.flowItems = this.container.option.toolChildren(EDITOR_TABLE_TOOL);
            this.flowStyle = {
                top: p.y + 'px',
                left: p.x + 'px',
            };
        });
        this.container.on(EVENT_SHOW_LINK_TOOL, p => {
            this.flowItems = this.container.option.toolChildren(EDITOR_LINK_TOOL);
            this.flowStyle = {
                top: p.y + 'px',
                left: p.x + 'px',
            };
        });
        this.container.on(EVENT_SHOW_IMAGE_TOOL, (p, cb) => {
            this.flowItems = this.container.option.toolChildren(EDITOR_IMAGE_TOOL);
            this.flowStyle = {
                top: p.y + p.height + 20 + 'px',
                left: p.x + 'px',
            };
            this.resizer.openResize(p, cb);
        });
        this.container.on(EVENT_SHOW_COLUMN_TOOL, (p, cb) => {
            this.resizer.openHorizontalResize(p, cb);
        });
        this.container.on(EVENT_CLOSE_TOOL, () => {
            this.flowItems = [];
            if (this.modalRef) {
                this.modalRef.destroy();
                this.modalRef = undefined;
            }
            this.resizer.close();
        });
    }

    ngAfterViewInit(): void {
        this.container.ready(this.editorViewRef.nativeElement);
    }

    ngOnDestroy(): void {
        this.container.destroy();
    }

    public get areaStyle() {
        if (!this.height || this.height == 'auto') {
            return {};
        }
        if (typeof this.height === 'string' && /(rem|em|px|vw|vh|%)$/.test(this.height)) {
            return {
                height: this.height,
                'min-height': 0,
                'overflow-y': 'auto',
            };
        }
        return {
            height: this.height + 'px',
            'min-height': 0,
            'overflow-y': 'auto',
        };
    }

    public tapTool(item: IEditorTool, isRight = false) {
        this.container.focus();
        if (item.name === this.subParent) {
            this.subItems = [];
        } else {
            const next = this.container.option.toolChildren(item.name);
            if (next.length === 0) {
                this.executeModule(item);
                return;
            }
            this.subItems = next;
        }
        this.subParent = this.subItems.length > 0 ? item.name : '';
        this.subIsRight = isRight;
    }

    public tapFlowTool(item: IEditorTool) {
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
        this.executeModule(item);
    }

    public insert(block: IEditorBlock|string): void {
        this.container.insert(block);
    }

    private executeModule(item: IEditorTool) {
        if (this.modalRef) {
            this.modalRef.destroy();
            this.modalRef = undefined;
        }
        if (item.name === EDITOR_CODE_TOOL) {
            this.isCodeMode = !this.isCodeMode;
            if (this.isCodeMode) {
                this.codeEditor.writeValue(this.container.value);
            }
            return;
        }
        if (item.name === EDITOR_FULL_SCREEN_TOOL) {
            this.isFullScreen = !this.isFullScreen;
            return;
        }
        const module = this.container.option.toModule(item);
        if (!module) {
            return;
        }
        if (!module.modal) {
            this.container.execute(module);
            return;
        }
        this.modalRef = this.modalViewContainer.createComponent<IEditorModal>(module.modal, {
            injector: this.injector
        });
        this.modalRef.instance.open({}, res => {
            this.modalRef.destroy();
            this.modalRef = undefined;
            this.container.execute(module, undefined, res);
        });
    }
    writeValue(obj: any): void {
        this.container.value = obj;
    }
    registerOnChange(fn: any): void {
        this.onChange = fn;
    }
    registerOnTouched(fn: any): void {
        this.onTouch = fn;
    }
    setDisabledState?(isDisabled: boolean): void {
        this.disabled = isDisabled;
    }

}
