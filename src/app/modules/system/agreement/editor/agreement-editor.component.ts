import { Component, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { IAgreementGroup } from '../../../../theme/models/seo';
import { eachObject } from '../../../../theme/utils';



@Component({
    selector: 'app-agreement-editor',
    templateUrl: './agreement-editor.component.html',
    styleUrls: ['./agreement-editor.component.scss'],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => AgreementEditorComponent),
            multi: true
        }
    ]
})
export class AgreementEditorComponent implements ControlValueAccessor {

    public disable = false;
    public value: IAgreementGroup[] = [];
    public data: IAgreementGroup;

    onChange: any = () => { };
    onTouch: any = () => { };

    constructor(
    ) { }

    public tapEditItem(item: IAgreementGroup) {
        this.data = item;
    }

    public tapAddGroup() {
        this.value.push({
            name: '',
            title: '',
            children: [
                {
                    content: '',
                }
            ],
        });
        this.onChange(this.value);
    }

    public tapRemoveGroup() {
        if (!this.data) {
            return;
        }
        for (let i = 0; i < this.value.length; i++) {
            if (this.value[i] === this.data) {
                this.value.splice(i, 1);
                this.onChange(this.value);
                this.data = null;
                return;
            }
        }
    }

    public tapRemoveItem(i: number) {
        if (!this.data) {
            return;
        }
        this.data.children.splice(i, 1);
    }

    public tapAddItem() {
        if (!this.data) {
            return;
        }
        this.data.children.push({
            content: '',
        });
    }

    public tapMoveUp(i: number) {
        if (i < 1) {
            return;
        }
        const items = this.value;
        items[i] = items.splice(i - 1, 1, items[i])[0];
    }

    public tapMoveDown(i: number) {
        const items = this.value;
        if (i >= items.length - 1) {
            return;
        }
        items[i] = items.splice(i + 1, 1, items[i])[0];
    }

    writeValue(obj: any): void {
        const value = typeof obj !== 'object' ? JSON.parse(obj) : obj;
        if (!value) {
            return;
        }
        this.value = [];
        eachObject(value, item => {
            if (typeof item !== 'object') {
                return;
            }
            if (!item.children) {
                item.children = [];
            }
            this.value.push(item);
        });
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
