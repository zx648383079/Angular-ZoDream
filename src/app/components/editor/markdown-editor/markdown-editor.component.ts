import { AfterViewInit, Component, ElementRef, EventEmitter, forwardRef, Input, Output, ViewChild } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { marked } from 'marked';
import { FileUploadService } from '../../../theme/services';
import { wordLength } from '../../../theme/utils';
import { IEditor, IEditorRange, IImageUploadEvent } from '../model';

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
export class MarkdownEditorComponent implements AfterViewInit, ControlValueAccessor, IEditor {

    @ViewChild('editorArea')
    private areaElement: ElementRef<HTMLTextAreaElement>;
    @Input() public height = 200;
    @Input() public placeholder = '';
    @Output() public imageUpload = new EventEmitter<IImageUploadEvent>();

    public disable = false;
    public value = '';
    public isPreview = false;
    public previewValue: SafeHtml;
    public imageName = this.uploadService.uniqueGuid();

    private range: IEditorRange;

    onChange: any = () => { };
    onTouch: any = () => { };

    constructor(
        private sanitizer: DomSanitizer,
        private uploadService: FileUploadService,
    ) { }

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
        if (name === 'preview') {
            this.enterPreview();
            return;
        }
        if (name === 'image') {
            return;
        }
        if (name === 'code') {
            return this.insertOrInclude('```js\n\n```', 6);
        }
        if (name === 'link') {
            return this.parseSelectionLink();
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

    /**
        是否有选择字符串
     */
    public get hasSelection() {
        return this.range && this.range.start < this.range.end;
    }

    public insertOrInclude(val: string, move = 0) {
        if (!this.hasSelection) {
            this.insert(val, move);
            return;
        }
        this.replace(v => {
            return val.substring(0, move) + v + val.substring(move);
        }, move);
    }

    public insert(val: string, move = 0, focus: boolean = true) {
        this.checkRange();
        this.setContent(this.area.value.substring(0, this.range.start) + val + this.area.value.substring(this.range.start))
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
        const str = typeof val === 'function' ? val(this.area.value.substring(this.range.start, this.range.end)) : val;
        this.setContent(this.area.value.substring(0, this.range.start) + str + this.area.value.substring(this.range.end));
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
            return val.substring(0, move) + str + val.substring(move);
        }, move, focus);
    }

    public insertImage(file: string, name?: string) {
        this.insert('![' + name + '](' + file + ')');
    }

    public insertLink(text: string, href: string) {
        this.insert('[' + text + '](' + href + ')');
    }

    public clear(focus: boolean = true) {
        this.setContent('');
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

    public setContent(value: string) {
        this.value = this.area.value = value;
        this.onValueChange();
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

    private enterPreview() {
        if (this.isPreview) {
            this.isPreview = false;
            return;
        }
        this.previewValue = this.sanitizer.bypassSecurityTrustHtml(
            marked(this.value)
        );
        this.isPreview = true;
    }

    private parseSelectionLink() {
        if (!this.hasSelection) {
            this.insert('[](https://)', 1, true);
            return;
        }
        this.replace(v => {
            return '[](' + v + ')';
        }, 1);
    }

}