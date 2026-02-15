import { Component, HostListener, effect, forwardRef, input, model, signal, untracked } from '@angular/core';
import { hasElementByClass } from '../../../theme/utils/doc';
import { FormValueControl } from '@angular/forms/signals';
import { IControlOption } from '../event';
import { IDataSource, selectIndex, selectItems } from '../sources/IDataSource';
import { NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
    standalone: false,
    selector: 'app-select-input',
    templateUrl: './select-input.component.html',
    styleUrls: ['./select-input.component.scss'],
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
        this.items.update(v => {
            selectIndex(v, index, this.multiple());
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

    private initialize(data: IControlOption[]) {
        this.items.set(data);
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
