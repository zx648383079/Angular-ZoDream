import { Component, effect, forwardRef, input, model, signal, untracked } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { FormValueControl } from '@angular/forms/signals';
import { IControlOption } from '../event';
import { IDataSource, selectIndex, selectItems } from '../sources/IDataSource';

@Component({
    standalone: false,
    selector: 'app-check-input',
    templateUrl: './check-input.component.html',
    styleUrls: ['./check-input.component.scss'],
    providers: [{
        provide: NG_VALUE_ACCESSOR,
        useExisting: forwardRef(() => CheckInputComponent),
        multi: true
    }]
})
export class CheckInputComponent implements ControlValueAccessor, FormValueControl<any> {

    public readonly items = signal<IControlOption[]>([]);
    public readonly source = input.required<IDataSource>();
    public readonly multiple = input(false);

    public readonly disabled = input<boolean>(false);
    public readonly value = model<any>();
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

    private output() {
        const src = this.source();
        const selectedItems = this.items().filter(i => i.checked).map(i => src.format(i));
        let res = selectedItems;
        if (!this.multiple()) {
            res = selectedItems.length === 0 ? src.format() : selectedItems[0];
        }
        this.value.set(res);
        this.changeFn(res);
    }

    private formatValue(obj: any) {
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
