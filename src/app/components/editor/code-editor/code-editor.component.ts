import { AfterViewInit, Component, ElementRef, OnDestroy, ViewChild, ViewEncapsulation, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { IEditor, IEditorBlock } from '../model';
import { EditorContainer } from '../container';
import { CodeElement } from '../base/code';
import { EDITOR_EVENT_EDITOR_CHANGE } from '../base';

@Component({
    encapsulation: ViewEncapsulation.None,
    selector: 'app-code-editor',
    template: '',
    styleUrls: ['./code-editor.component.scss'],
    host: {
        'class': 'code-editor-container'
    },
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => CodeEditorComponent),
            multi: true
        }
    ]
})
export class CodeEditorComponent implements AfterViewInit, OnDestroy, ControlValueAccessor, IEditor {

    public disabled = false;
    private container = new EditorContainer();
    onChange: any = () => { };
    onTouch: any = () => { };
    constructor(
        private elementRef: ElementRef
    ) {
        this.container.on(EDITOR_EVENT_EDITOR_CHANGE, () => {
            this.onChange(this.container.value);
        });
    }


    ngAfterViewInit(): void {
        this.container.ready(new CodeElement(this.elementRef.nativeElement, this.container));
    }

    ngOnDestroy(): void {
        this.container.destroy();
    }

    public insert(block: IEditorBlock|string): void {
        this.container.insert(block);
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
