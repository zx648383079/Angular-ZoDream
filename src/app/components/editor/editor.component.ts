import { AfterViewInit, Component, ComponentRef, ElementRef, Injector, Input, OnInit, ViewChild, ViewContainerRef, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { EDITOR_CLOSE_TOOL, EVENT_TOOL_ADD, EVENT_TOOL_ENTER, EVENT_TOOL_FLOW_CLOSE, EditorOptionManager, IEditorTool } from './base';
import { EditorContainer } from './container';
import { IEditorModal } from './model';

@Component({
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
export class EditorComponent implements OnInit, AfterViewInit, ControlValueAccessor {

    @ViewChild('modalVC', {read: ViewContainerRef})
    private modalViewContainer: ViewContainerRef;
    @ViewChild('EditorView', {static: true})
    private editorViewRef: ElementRef<HTMLDivElement>;
    @Input() public height: number|string = 'auto';
    public topLeftItems: IEditorTool[] = [];
    public topRightItems: IEditorTool[] = [];
    public subItems: IEditorTool[] = [];
    public flowItems: IEditorTool[] = [];
    public flowStyle: any = {};
    public subIsRight = false;
    public subParent = '';
    public disabled = false;
    private flowOldItems :IEditorTool[] = [];
    private container = new EditorContainer(new EditorOptionManager());
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
        this.container.on(EVENT_TOOL_ADD, y => {
            if (this.modalRef) {
                this.modalRef.destroy();
                this.modalRef = undefined;
            }
            this.flowItems = [this.container.option.addTool];
            this.flowStyle = {
                top: y + 'px'
            };
        });
        this.container.on(EVENT_TOOL_ENTER, p => {
            this.flowItems = [this.container.option.enterTool];
            this.flowStyle = {
                top: p.y + 'px',
            };
        });
        this.container.on(EVENT_TOOL_FLOW_CLOSE, () => {
            this.flowItems = [];
            if (this.modalRef) {
                this.modalRef.destroy();
                this.modalRef = undefined;
            }
        });
    }

    ngAfterViewInit(): void {
        this.container.ready(this.editorViewRef.nativeElement);
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
        this.executeModule(item);
    }

    private executeModule(item: IEditorTool) {
        if (this.modalRef) {
            this.modalRef.destroy();
            this.modalRef = undefined;
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
