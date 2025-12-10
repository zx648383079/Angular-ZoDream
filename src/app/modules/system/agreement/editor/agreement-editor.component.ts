import { Component, effect, input, model } from '@angular/core';
import { IAgreementGroup } from '../../../../theme/models/seo';
import { eachObject } from '../../../../theme/utils';
import { FormValueControl } from '@angular/forms/signals';



@Component({
    standalone: false,
    selector: 'app-agreement-editor',
    templateUrl: './agreement-editor.component.html',
    styleUrls: ['./agreement-editor.component.scss'],
})
export class AgreementEditorComponent implements FormValueControl<IAgreementGroup[]|string> {


    public readonly disabled = input<boolean>(false);
    public readonly value = model<IAgreementGroup[]|string>([]);
    public data: IAgreementGroup;
    public items: IAgreementGroup[] = [];

    constructor() {
        effect(() => {
            this.writeValue(this.value());
        });
    }


    public tapEditItem(item: IAgreementGroup) {
        this.data = item;
    }

    public tapAddGroup() {
        this.items.push({
            name: '',
            title: '',
            children: [
                {
                    content: '',
                }
            ],
        });
        this.value.set(this.items);
    }

    public tapRemoveGroup() {
        if (!this.data) {
            return;
        }
        for (let i = 0; i < this.value.length; i++) {
            if (this.value[i] === this.data) {
                this.items.splice(i, 1);
                this.value.set(this.items);
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
        this.items[i] = this.items.splice(i - 1, 1, this.items[i])[0];
        this.value.set(this.items);
    }

    public tapMoveDown(i: number) {
        if (i >= this.items.length - 1) {
            return;
        }
        this.items[i] = this.items.splice(i + 1, 1, this.items[i])[0];
        this.value.set(this.items);
    }

    private writeValue(obj: any): void {
        const value = typeof obj !== 'object' ? JSON.parse(obj) : obj;
        if (!value) {
            return;
        }
        const items = [];
        eachObject(value, item => {
            if (typeof item !== 'object') {
                return;
            }
            if (!item.children) {
                item.children = [];
            }
            items.push(item);
        });
        this.items = items;
    }
    

}
