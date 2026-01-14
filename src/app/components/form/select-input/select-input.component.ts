import { HttpClient } from '@angular/common/http';
import { Component, HostListener, effect, inject, input, model, signal, untracked } from '@angular/core';
import { IData } from '../../../theme/models/page';
import { cloneObject } from '../../../theme/utils';
import { hasElementByClass } from '../../../theme/utils/doc';
import { FormValueControl } from '@angular/forms/signals';

@Component({
    standalone: false,
    selector: 'app-select-input',
    templateUrl: './select-input.component.html',
    styleUrls: ['./select-input.component.scss'],
})
export class SelectInputComponent<T = any> implements FormValueControl< T | T[] | number | string> {
    private readonly http = inject(HttpClient);


    public readonly url = input<string>(undefined);
    public readonly placeholder = input($localize `Please select...`);
    public readonly rangeKey = input('id');
    public readonly rangeLabel = input('name');
    public readonly searchKey = input('keywords');
    public readonly items = input<T[]>([]);
    public readonly multiple = input(false);
    /**
     * 只有通过url请求的才会触发，参数为http响应内容
     */
    public readonly formatFn = input<(data: any) => T[]>(undefined);

    public readonly disabled = input<boolean>(false);
    public readonly value = model<T | T[] | number | string>();
    public readonly optionItems = signal<T[]>([]);
    public readonly selectedItems = signal<T[]>([]);
    public readonly keywords = signal('');
    public readonly panelVisible = signal(false);
    private valueTypeT = false;
    private booted = false;

    /**
     *
     */
    constructor() {
        effect(() => {
            const obj = this.value();
            this.readerType(obj);
            this.formatSelected(obj);
        });
        effect(() => {
            const items = this.items();
            untracked(() => {
                this.optionItems.set(items);
            });
        });
    }


    @HostListener('document:click', ['$event']) 
    public hideCalendar(event: any) {
        if (!event.target.closest('.select-input-container') && !hasElementByClass(event.path, 'select-input-container')) {
            this.panelVisible.set(false);
        }
    }

    public isSelected(item: T) {
        for (const i of this.selectedItems()) {
            if (item[this.rangeKey()] === i[this.rangeKey()]) {
                return true;
            }
        }
        return false;
    }

    public tapSelected(item: T) {
        if (!this.multiple()) {
            this.selectedItems.set([item]);
            this.keywords.set('');
            this.panelVisible.set(false);
            this.output();
            return;
        }
        this.selectedItems.update(v => {
            for (let i = 0; i < v.length; i++) {
                if (item[this.rangeKey()] === v[i][this.rangeKey()]) {
                    v.splice(i, 1);
                    return [...v];
                }
            }
            v.push(item);
            return [...v];
        });
        this.output();
    }

    public tapUnselect(item: T) {
        this.selectedItems.update(v => {
            return v.filter(i => {
                return item[this.rangeKey()] !== i[this.rangeKey()];
            });
        });
        this.output();
    }

    public onKeywordsChange(val: string) {
        this.keywords.set(val);
        if (!this.keywords()) {
            this.optionItems.set([]);
            return;
        }
        const url = this.url();
        if (!url) {
            this.optionItems.set(this.items().filter(i => i[this.rangeLabel()].indexOf(this.keywords) >= 0));
            return;
        }
        this.http.get<IData<T>>(url, {params: {[this.searchKey()]: this.keywords()}}).subscribe(res => {
            const formatFn = this.formatFn();
            const items = formatFn ?  formatFn(res) : res.data;
            if (items instanceof Array) {
                this.optionItems.set(items);
            }
        });
    }

    public onFocus() {
        this.panelVisible.set(true);
    }

    public onBlur() {
        // this.panelVisible.set(false);
    }

    private output() {
        const items = this.selectedItems().map(i => {
            return this.valueTypeT ? i[this.rangeKey()] : {...i};
        });
        this.value.set(this.multiple() ? items : (items.length > 0 ? items[0] : 0));
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
            this.selectedItems.set([]);
            return;
        }
        if (!this.valueTypeT) {
            this.selectedItems.set(obj instanceof Array ? cloneObject(obj) : [cloneObject(obj)]);
        }
        const url = this.url();
        if (!url || !this.valueTypeT) {
            // 增加延迟，防止在 formbuilder 中url和值通知变动时无法正确获取
            if (loop < 1) {
                setTimeout(() => {
                    this.formatSelected(obj, loop ++ );
                }, 100);
            }
            return;
        }
        this.http.get<IData<T>>(url, {params: {[this.rangeKey()]: obj}}).subscribe(res => {
            this.selectedItems.set(res.data);
        });
    }

}
