import { HttpClient } from '@angular/common/http';
import { Component, HostListener, effect, inject, input, model, signal, untracked } from '@angular/core';
import { IData } from '../../../theme/models/page';
import { hasElementByClass } from '../../../theme/utils/doc';
import { FormValueControl } from '@angular/forms/signals';
import { IControlOption } from '../event';

@Component({
    standalone: false,
    selector: 'app-select-input',
    templateUrl: './select-input.component.html',
    styleUrls: ['./select-input.component.scss'],
})
export class SelectInputComponent<T = any> implements FormValueControl< T | T[] | number | string> {
    private readonly http = inject(HttpClient);


    public readonly url = input<string>();
    public readonly placeholder = input($localize `Please select...`);
    public readonly rangeKey = input('id');
    public readonly rangeLabel = input('name');
    public readonly searchKey = input('keywords');
    public readonly items = input<T[]>([]);
    public readonly multiple = input(false);
    /**
     * 只有通过url请求的才会触发，参数为http响应内容
     */
    public readonly formatFn = input<(data: any) => T[]>(null);

    public readonly disabled = input<boolean>(false);
    public readonly value = model<T | T[] | number | string>();
    public readonly optionItems = signal<IControlOption[]>([]);
    public readonly selectedItems = signal<IControlOption[]>([]);
    public readonly keywords = signal('');
    public readonly panelVisible = signal(false);
    public readonly isLoading = signal(false);
    private booted = false;

    constructor() {
        effect(() => {
            const obj = this.value();
            untracked(() => {
                if (this.optionItems().length === 0 && !this.url()) {
                    return;
                }
                this.booted = true;
                this.formatSelected(obj);
            });
        });
        effect(() => {
            const items = this.items();
            untracked(() => {
                this.formatOption(items);
            });
        });
    }


    @HostListener('document:click', ['$event']) 
    public hideCalendar(event: any) {
        if (!event.target.closest('.select-input-container') && !hasElementByClass(event.path, 'select-input-container')) {
            this.panelVisible.set(false);
        }
    }

    public tapSelected(item: IControlOption) {
        if (!this.multiple()) {
            item.checked = true;
            this.selectedItems.set([item]);
            this.keywords.set('');
            this.panelVisible.set(false);
            this.output();
            return;
        }
        this.selectedItems.update(v => {
            for (let i = 0; i < v.length; i++) {
                if (item.value === v[i].value) {
                    v.splice(i, 1);
                    item.checked = false;
                    return [...v];
                }
            }
            item.checked = true;
            v.push(item);
            return [...v];
        });
        this.output();
    }

    public tapUnselect(item: IControlOption) {
        item.checked = false;
        this.selectedItems.update(v => {
            return v.filter(i => {
                return item.value !== i.value;
            });
        });
        this.output();
    }

    public onKeywordsChange(val: string) {
        this.keywords.set(val);
        if (!val) {
            this.optionItems.set([]);
            return;
        }
        const url = this.url();
        if (!url) {
            this.formatOption(this.items(), item => item.name.indexOf(val) >= 0);
            return;
        }
        this.isLoading.set(true);
        this.http.get<IData<T>>(url, {params: {[this.searchKey()]: val}}).subscribe({
            next: res => {
                this.isLoading.set(false);
                const formatFn = this.formatFn();
                const items = formatFn ? formatFn(res) : res.data;
                if (items instanceof Array) {
                    this.formatOption(items);
                }
            },
            error: _ => {
                this.isLoading.set(false);
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
        this.value.set(this.getSelectedValue());
    }

    private formatSelected(obj: any) {
        if (this.equal(obj, this.getSelectedValue())) {
            return;
        }
        if (!obj || (obj instanceof Array && obj.length === 0)) {
            if (this.selectedItems().length === 0) {
                return;
            }
            this.selectedItems.set([]);
            return;
        }
        const url = this.url();
        if (!url) {
            this.selectValue(obj);
            return;
        }
        this.isLoading.set(true);
        this.http.get<IData<T>>(url, {params: {[this.rangeKey()]: obj}}).subscribe({
            next: res => {
                this.isLoading.set(false);
                this.selectedItems.set(res.data.map(i => this.formatOptionItem(i, 0)));
            },
            error: _ => {
                this.isLoading.set(false);
            }
        });
    }

    private formatOption(items: T[], filterFn?: (data: IControlOption) => boolean) {
        const selected = this.selectedItems().map(i => i.value);
        const data = [];
        for (let i = 0; i < items.length; i++) {
            const formatted = this.formatOptionItem(items[i], i);
            if (filterFn && !filterFn(formatted)) {
                continue;
            }
            formatted.checked = selected.includes(formatted.value)
            data.push(formatted);
        }
        this.optionItems.set(data);
        if (data.length > 0 && !this.booted) {
            this.selectValue(this.value());
            this.booted = true;
        }
    }

    private formatOptionItem(item: any, index: number): IControlOption {
        const key = this.rangeKey();
        const name = typeof item === 'object' ? item[this.rangeLabel()] : item;
        if (typeof key === 'number') {
            return {
                value: index,
                name
            };
        }
        if (key && typeof item === 'object') {
            return {
                value: item[key],
                name
            };
        }
        return {
            value: item,
            name
        };
    }

    private selectValue(val: any) {
        const selectedValue = this.toSelectedValue(val);
        const selected = [];
        this.optionItems.update(v => {
            for (const item of v) {
                item.checked = selectedValue.includes(item.value);
                if (item.checked) {
                    selected.push(item);
                } 
            }
            return v;
        });
        this.selectedItems.set(selected);
    }

    private getSelectedValue() {
        const items = this.selectedItems().map(i => i.value);
        return this.multiple() ? items : (items.length > 0 ? items[0] : this.getUnknownValue())
    }

    private toSelectedValue(val: any): any[] {
        return this.multiple() && val instanceof Array ? val : [val];
    }

    private getUnknownValue(): any {
        const key = this.rangeKey();
        if (typeof key === 'number') {
            return 0;
        }
        return '';
    }

    private equal(arg: any, val: any): boolean {
        if (arg === val) {
            return;
        }
        if (!(arg instanceof Array && val instanceof Array)) {
            return false;
        }
        if (arg.length !== val.length) {
            return false;
        }
        for (const item of arg) {
            if (!val.includes(item)) {
                return false;
            }
        }
        return true;
    }

}
