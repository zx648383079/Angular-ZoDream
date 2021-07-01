import { HttpClient } from '@angular/common/http';
import { Component, forwardRef, HostListener, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { IData } from '../../theme/models/page';
import { cloneObject, hasElementByClass } from '../../theme/utils';

@Component({
    selector: 'app-select-input',
    templateUrl: './select-input.component.html',
    styleUrls: ['./select-input.component.scss'],
    providers: [{
        provide: NG_VALUE_ACCESSOR,
        useExisting: forwardRef(() => SelectInputComponent),
        multi: true
    }]
})
export class SelectInputComponent<T = any> implements ControlValueAccessor, OnChanges {

    @Input() public url: string;
    @Input() public placeholder = '请选择';
    @Input() public rangeKey = 'id';
    @Input() public rangeLabel = 'name';
    @Input() public searchKey = 'keywords';
    @Input() public items: T[] = [];
    @Input() public multiple = false;

    public value: T | T[] | number | string;
    public disabled = false;
    public optionItems: T[] = [];
    public selectedItems: T[] = [];
    public keywords = '';
    public panelVisible = false;
    private valueTypeT = false;
    private booted = false;

    onChange: any = () => {};
    onTouch: any = () => {};

    @HostListener('document:click', ['$event']) hideCalendar(event: any) {
        if (!event.target.closest('.select-input-container') && !hasElementByClass(event.path, 'select-input-container')) {
            this.panelVisible = false;
        }
    }

    constructor(private http: HttpClient) { }

    ngOnChanges(changes: SimpleChanges) {
        if (changes.items) {
            this.optionItems = changes.items.currentValue;
        }
    }

    public isSelected(item: T) {
        for (const i of this.selectedItems) {
            if (item[this.rangeKey] === i[this.rangeKey]) {
                return true;
            }
        }
        return false;
    }

    public tapSelected(item: T) {
        if (!this.multiple) {
            this.selectedItems = [item];
            this.keywords = '';
            this.panelVisible = false;
            this.output();
            return;
        }
        for (let i = 0; i < this.selectedItems.length; i++) {
            if (item[this.rangeKey] === this.selectedItems[i][this.rangeKey]) {
                this.selectedItems.splice(i, 1);
                this.output();
                return;
            }
        }
        this.selectedItems.push(item);
        this.output();
    }

    public tapUnselect(item: T) {
        this.selectedItems = this.selectedItems.filter(i => {
            return item[this.rangeKey] !== i[this.rangeKey];
        });
        this.output();
    }

    public onKeywordsChange() {
        if (!this.keywords) {
            this.optionItems = [];
            return;
        }
        if (!this.url) {
            this.optionItems = this.items.filter(i => i[this.rangeLabel].indexOf(this.keywords) >= 0);
            return;
        }
        this.http.get<IData<T>>(this.url, {params: {[this.searchKey]: this.keywords}}).subscribe(res => {
            this.optionItems = res.data;
        });
    }

    public onFocus() {
        this.panelVisible = true;
    }

    public onBlur() {
        // this.panelVisible = false;
    }

    private output() {
        const items = this.selectedItems.map(i => {
            return this.valueTypeT ? i[this.rangeKey] : {...i};
        });
        this.value = this.multiple ? items : (items.length > 0 ? items[0] : 0);
        this.onChange(this.value);
    }

    private readerType(obj: any) {
        if (typeof obj !== 'object') {
            this.valueTypeT = true;
            return;
        }
        if (obj instanceof Array && obj.length > 0) {
            this.valueTypeT = typeof obj[0] !== 'object';
            return;
        }
    }

    private formatSelected(obj: any, loop = 0) {
        if (!obj || (obj instanceof Array && obj.length < 1)) {
            this.selectedItems = [];
            return;
        }
        if (!this.valueTypeT) {
            this.selectedItems = obj instanceof Array ? cloneObject(obj) : [cloneObject(obj)];
        }
        if (!this.url || !this.valueTypeT) {
            // 增加延迟，防止在 formbuilder 中url和值通知变动时无法正确获取
            if (loop < 1) {
                setTimeout(() => {
                    this.formatSelected(obj, loop ++ );
                }, 100);
            }
            return;
        }
        this.http.get<IData<T>>(this.url, {params: {[this.rangeKey]: obj}}).subscribe(res => {
            this.selectedItems = res.data;
        });
    }

    writeValue(obj: any): void {
        this.value = obj;
        this.readerType(obj);
        this.formatSelected(obj);
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
