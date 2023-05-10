import { AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { EDITOR_CLOSE_TOOL, EditorOptionManager, IEditorTool } from './base';
import { EditorContainer } from './container';

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

    @ViewChild('EditorView', {static: true})
    private editorViewRef: ElementRef<HTMLDivElement>;
    @Input() public height: number|string = 'auto';
    public topLeftItems: IEditorTool[] = [];
    public topRightItems: IEditorTool[] = [];
    public subItems: IEditorTool[] = [];
    public flowItems: IEditorTool[] = [];
    public subIsRight = false;
    public subParent = '';
    public disabled = false;
    private flowOldItems :IEditorTool[] = [];
    private container = new EditorContainer(new EditorOptionManager());
    onChange: any = () => { };
    onTouch: any = () => { };

    constructor() {
        this.topLeftItems = this.container.option.leftToolbar;
        this.topRightItems = this.container.option.rightToolbar;
    }

    ngOnInit() {
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
        if (item.name === this.subParent) {
            this.subItems = [];
        } else {
            this.subItems = this.container.option.toolChildren(item.name);
        }
        this.subParent = this.subItems.length > 0 ? item.name : '';
        this.subIsRight = isRight;
    }

    public tapFlowTool(item: IEditorTool) {
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
    }


    writeValue(obj: any): void {
        // this.value = obj;
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
