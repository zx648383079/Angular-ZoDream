import { AfterViewInit, Component, ElementRef, EventEmitter, forwardRef, Input, Output, ViewChild } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { wordLength } from '../../utils';

interface IRange {
    start: number;
    end: number;
}

export interface IImageUploadEvent {
    files: FileList;
    target: MarkdownEditorComponent;
}

@Component({
    selector: 'app-markdown-editor',
    templateUrl: './markdown-editor.component.html',
    styleUrls: ['./markdown-editor.component.scss'],
    providers: [
        {
          provide: NG_VALUE_ACCESSOR,
          useExisting: forwardRef(() => MarkdownEditorComponent),
          multi: true
        }
    ]
})
export class MarkdownEditorComponent implements AfterViewInit {

    @ViewChild('editorArea')
    private areaElement: ElementRef;
    @Input() public height = 200;
    @Output() imageUpload = new EventEmitter<IImageUploadEvent>();

    public disable = false;
    public value = '';
    private range: IRange;

    onChange: any = () => { };
    onTouch: any = () => { };

    constructor() { }

    get size() {
        return wordLength(this.value);
    }

    get areaStyle() {
        return {
            height: this.height + 'px',
        };
    }

    get area(): HTMLTextAreaElement {
        return this.areaElement.nativeElement as HTMLTextAreaElement;
    }

    ngAfterViewInit() {
        this.bindAreaEvent();
    }

    private bindAreaEvent() {
        this.area.addEventListener('keydown', e => {
            if (e.key === 'Tab') {
                e.preventDefault();
                this.saveRange();
                this.insertTab();
            }
        });
        this.area.addEventListener('blur', e => {
            this.saveRange();
        });
    }

    private checkRange() {
        if (!this.range) {
            this.range = {
                start: this.area.value.length,
                end: this.area.value.length
            };
        }
    }

    private saveRange() {
        this.range = {
            start: this.area.selectionStart,
            end: this.area.selectionEnd
        };
    }

    public onValueChange() {
        this.onChange(this.value);
    }

    public tapTool(name: string) {
        if (name === 'image') {
            return;
        }
        if (name === 'code') {
            return this.insert('```js\n\n```', 6, true);
        }
        if (name === 'link') {
            return this.insert('[](https://)', 1, true);
        }
    }

    public uploadImage(event: any) {
        const files = event.target.files as FileList;
        this.imageUpload.emit({
            files,
            target: this
        });
    }

    public insertTab() {
        return this.insert('    ', 4, true);
    }

    public insert(val: string, move: number = 0, focus: boolean = true) {
        this.checkRange();
        this.area.value = this.area.value.substr(0, this.range.start) + val + this.area.value.substr(this.range.start);
        this.move(move);
        if (!focus) {
            return;
        }
        this.focus();
    }

    /**
     * replace
     */
    public replace(val: (str: string) => string | string, move: number = 0, focus: boolean = true) {
        this.checkRange();
        if (this.range.start === this.range.end) {
            return this.insert(typeof val === 'function' ? val('') : val, move, focus);
        }
        const str = typeof val === 'function' ? val(this.area.value.substr(this.range.start, this.range.end - this.range.start)) : val;
        this.area.value = this.area.value.substr(0, this.range.start) + str + this.area.value.substr(this.range.end);
        this.move(move);
        if (!focus) {
            return;
        }
        this.focus();
    }

    public append(val: string, move: number = 0, focus: boolean = true) {
        this.replace(str => {
            if (str.length < 1) {
                return val;
            }
            if (move < 1) {
                return str + val;
            }
            if (move > val.length) {
                return val + str;
            }
            return val.substr(0, move) + str + val.substr(move);
        }, move, focus);
    }

    public insertImage(file: string, name?: string) {
        this.insert('![' + name + '](' + file + ')');
    }

    public clear(focus: boolean = true) {
        this.area.value = '';
        if (!focus) {
            return;
        }
        this.focus();
    }

    /**
     * move
     */
    public move(x: number) {
        if (x === 0) {
            return;
        }
        x = this.range.start + x;
        this.range = {
            start: x,
            end: Math.max(x, this.range.end)
        };
    }

    /**
     * focus
     */
    public focus() {
        this.checkRange();
        this.area.selectionStart = this.range.start;
        this.area.selectionEnd = this.range.end;
        this.area.focus();
    }

    writeValue(obj: any): void {
        this.value = obj;
    }
    registerOnChange(fn: any): void {
        this.onChange = fn;
    }
    registerOnTouched(fn: any): void {
        this.onTouch = fn;
    }
    setDisabledState?(isDisabled: boolean): void {
        this.disable = isDisabled;
    }

}
