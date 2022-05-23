import { AfterViewInit, Component, ElementRef, forwardRef, Input, OnInit, ViewChild } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { wordLength } from '../../../theme/utils';
import { IEditorRange } from '../model';

@Component({
    selector: 'app-text-editor',
    templateUrl: './text-editor.component.html',
    styleUrls: ['./text-editor.component.scss'],
    providers: [
        {
          provide: NG_VALUE_ACCESSOR,
          useExisting: forwardRef(() => TextEditorComponent),
          multi: true
        }
    ]
})
export class TextEditorComponent implements AfterViewInit, ControlValueAccessor {

    @ViewChild('editorArea')
    private areaElement: ElementRef<HTMLTextAreaElement>;
    @Input() public height: string|number = '80vh';
    @Input() public maxLength = 0;
    @Input() public placeholder = '';

    public disable = false;
    public value = '';
    private range: IEditorRange;

    onChange: any = () => { };
    onTouch: any = () => { };

    constructor() { }

    get size() {
        return wordLength(this.value);
    }

    get areaStyle() {
        return {
            height: typeof this.height === 'number' ? this.height + 'px' : this.height,
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

    public insertTab() {
        return this.insert('    ', 4, true);
    }

    public insert(val: string, move: number = 0, focus: boolean = true) {
        this.checkRange();
        this.setContent(this.area.value.substring(0, this.range.start) + val + this.area.value.substring(this.range.start))
        this.move(move);
        if (!focus) {
            return;
        }
        this.focus();
    }

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

    public clear(focus: boolean = true) {
        this.setContent('');
        if (!focus) {
            return;
        }
        this.focus();
    }

    public scrollToTop() {
        if (this.area) {
            this.area.focus();
            this.area.scrollTo({
                top: 0
            });
            this.area.selectionStart = 0;
            this.area.selectionEnd = 0;
        }
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

}
