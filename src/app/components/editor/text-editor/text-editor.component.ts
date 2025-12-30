import { AfterViewInit, Component, computed, ElementRef, input, model, viewChild } from '@angular/core';
import { wordLength } from '../../../theme/utils';
import { IEditorRange } from '../model';
import { FormValueControl } from '@angular/forms/signals';

@Component({
    standalone: false,
    selector: 'app-text-editor',
    templateUrl: './text-editor.component.html',
    styleUrls: ['./text-editor.component.scss'],
})
export class TextEditorComponent implements AfterViewInit, FormValueControl<string> {

    private readonly areaElement = viewChild<ElementRef<HTMLTextAreaElement>>('editorArea');
    public readonly height = input<string | number>('80vh');
    public readonly maxLength = input(0);
    public readonly placeholder = input('');

    public readonly disabled = input<boolean>(false);
    public readonly value = model<string>('');
    private range: IEditorRange;
    
    public readonly size = computed(() => {
        return wordLength(this.value());
    });

    public readonly areaStyle = computed(() => {
        const height = this.height();
        return {
            height: typeof height === 'number' || /^[\d\.]+$/.test(height) ? height + 'px' : height,
        };
    });

    private get area(): HTMLTextAreaElement {
        return this.areaElement().nativeElement as HTMLTextAreaElement;
    }

    ngAfterViewInit() {
        this.bindAreaEvent();
    }

    public onValueChange(e: Event) {
        this.value.set((e.target as HTMLTextAreaElement).value);
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
        this.value.set(this.area.value = value);
    }

}
