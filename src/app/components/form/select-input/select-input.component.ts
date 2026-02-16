import { Component, HostListener, effect, forwardRef, input, model, signal, untracked } from '@angular/core';
import { hasElementByClass } from '../../../theme/utils/doc';
import { FormValueControl } from '@angular/forms/signals';
import { IControlOption } from '../event';
import { equalOption, IDataSource, selectIndex, selectItems, toggleSelectedItems } from '../sources/IDataSource';
import { NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
    standalone: false,
    selector: 'app-select-input',
    templateUrl: './select-input.component.html',
    styleUrls: ['./select-input.component.scss'],
    host: {
        'class': 'select-input-container',
        '[class.--with-open]': 'panelVisible()'
    },
    providers: [{
        provide: NG_VALUE_ACCESSOR,
        useExisting: forwardRef(() => SelectInputComponent),
        multi: true
    }]
})
export class SelectInputComponent<T = any> implements FormValueControl< T | T[] | number | string> {
    public readonly placeholder = input($localize `Please select...`);
    public readonly items = signal<IControlOption[]>([]);
    public readonly source = input.required<IDataSource>();
    public readonly multiple = input(false);
    /**
     * 是否可以创造
    */
    public readonly creatable = input(false);

    public readonly disabled = input<boolean>(false);
    public readonly value = model<T | T[] | number | string>();
    public readonly selectedItems = signal<IControlOption[]>([]);
    public readonly keywords = signal('');
    public readonly panelVisible = signal(false);
    public readonly isLoading = signal(false);
    private booted = false;
    private previousValue: any;
    private changeFn: any = () => {};

    constructor() {
        effect(() => {
            const src = this.source();
            untracked(() => {
                src.initialize(this.value()).subscribe(res => {
                    this.items.set(res[0]);
                });
            });
        });
        effect(() => {
            const val = this.value();
            untracked(() => {
                this.formatValue(val);
            });
        });
    }


    @HostListener('document:click', ['$event']) 
    public hideCalendar(event: any) {
        if (!event.target.closest('.select-input-container') && !hasElementByClass(event.path, 'select-input-container')) {
            this.panelVisible.set(false);
        }
    }

    public tapSelected(index: number) {
        if (this.disabled()) {
            return;
        }
        const isMultiple = this.multiple();
        const items = this.items();
        const isPush = selectIndex(items, index, isMultiple) >= 0;
        const target = items[index];
        if (target.created) {
            this.panelVisible.set(false);
            target.name = target.value;
            this.onKeywordsChange('');
        } else {
            this.items.set(items);
        }
        this.selectedItems.update(v => {
            return toggleSelectedItems(v, target, isPush, isMultiple);
        });
        this.output();
        if (isMultiple) {
            return;
        }
        this.panelVisible.set(false);
    }

    public tapUnselect(item: IControlOption) {
        item.checked = false;
        this.selectedItems.update(v => {
            return v.filter(i => !equalOption(i, item));
        });
        this.output();
    }

    public onKeywordsChange(val: string) {
        this.keywords.set(val);
        this.source().search([], 0, val).subscribe(res => {
            if (val && res.length === 0 && this.creatable()) {
                res = [{
                    name: `Add item "${val}"`,
                    value: val,
                    created: true
                }];
            } else {
                selectItems(res, ...this.selectedItems());
            }
            this.items.set(res);
        });
    }

    public onFocus() {
        this.panelVisible.set(true);
    }

    public onBlur() {
        // this.panelVisible.set(false);
    }

    private output() {
        const src = this.source();
        const selectedItems = this.items().filter(i => i.checked).map(i => src.format(i));
        let res = selectedItems;
        if (!this.multiple()) {
            res = selectedItems.length === 0 ? src.format() : selectedItems[0];
        }
        this.value.set(this.previousValue = res);
        this.changeFn(res);
    }

    private formatValue(obj: any) {
        if (this.previousValue === obj) {
            return;
        }
        const selected = typeof obj === 'object' && obj instanceof Array ? obj : [obj];
        selectItems(this.items(), ...selected);
    }

    writeValue(obj: any): void {
        this.value.set(obj);
    }

    registerOnChange(fn: any): void {
        this.changeFn = fn;
    }
    registerOnTouched(fn: any): void {}
    setDisabledState?(isDisabled: boolean): void {}
}
