import { AfterViewInit, Component, ElementRef, OnInit, ViewChild, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { EditorOptionManager, IEditorTool } from './base';
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
    public topLeftItems: IEditorTool[] = [];
    public topRightItems: IEditorTool[] = [];
    public subItems: IEditorTool[] = [];
    public disabled = false;
    private option = new EditorOptionManager();
    private container = new EditorContainer();
    onChange: any = () => { };
    onTouch: any = () => { };

    constructor() {
        this.topLeftItems = this.option.leftToolbar;
        this.topRightItems = this.option.rightToolbar;
    }

    ngOnInit() {
    }

    ngAfterViewInit(): void {
        this.container.ready(this.editorViewRef.nativeElement);
    }

    public tapTool(item: IEditorTool) {
        this.subItems = this.option.toolChildren(item.name);
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
