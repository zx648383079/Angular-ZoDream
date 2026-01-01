import { Component, effect, input, model, signal, WritableSignal } from '@angular/core';
import { IAgreementGroup } from '../../../../theme/models/seo';
import { eachObject } from '../../../../theme/utils';
import { form, FormValueControl } from '@angular/forms/signals';



@Component({
    standalone: false,
    selector: 'app-agreement-editor',
    templateUrl: './agreement-editor.component.html',
    styleUrls: ['./agreement-editor.component.scss'],
})
export class AgreementEditorComponent implements FormValueControl<IAgreementGroup[]|string> {


    public readonly disabled = input<boolean>(false);
    public readonly value = model<IAgreementGroup[]|string>([]);
    public readonly dataForm = form(signal<IAgreementGroup>({
        name: '',
        title: '',
        children: [],
    }));
    public readonly selectedIndex = signal(-1);
    public readonly items = signal<IAgreementGroup[]>([]);

    constructor() {
        effect(() => {
            this.writeValue(this.value());
        });
    }

    public toggle(item: WritableSignal<boolean>) {
        item.update(v => !v);
    }

    public tapEditItem(index: number) {
        this.save();
        if (this.selectedIndex() === index) {
            return;
        }
        this.selectedIndex.set(index);
        this.dataForm().value.set(this.items()[index]);
    }

    public tapAddGroup() {
        this.save();
        if (this.selectedIndex() >= 0) {
            this.selectedIndex.set(-1);
            this.dataForm().value.set({
                name: '',
                title: '',
                children: [],
            });
        }
        this.value.set(this.items());
    }

    public tapRemoveGroup() {
        const index = this.selectedIndex();
        if (index < 0) {
            return;
        }
        this.items.update(v => {
            return v.filter((_, i) => i !== index);
        });
        this.selectedIndex.set(-1);
        this.dataForm().value.set({
            name: '',
            title: '',
            children: [],
        });
        this.value.set(this.items());
    }

    public tapRemoveItem(i: number) {
        this.dataForm.children().value.update(v => {
            v.splice(i, 1);
            return [...v];
        });
    }

    public tapAddItem() {
        this.dataForm.children().value.update(v => {
            return [...v, {
                content: '',
                b: false
            }];
        });
    }

    public tapMoveUp(i: number) {
        if (i < 1) {
            return;
        }
        this.items.update(v => {
            v[i] = v.splice(i - 1, 1, v[i])[0];
            return v;
        });
        this.value.set(this.items());
    }

    public tapMoveDown(i: number) {
        this.items.update(v => {
            if (i >= v.length - 1) {
                return v;
            }
            v[i] = v.splice(i + 1, 1, v[i])[0];
            return v;
        });
        this.value.set(this.items());
    }

    public tapSaveGroup() {
        this.save();
        this.value.set(this.items());
    }

    private save() {
        const data = this.dataForm().value();
        data.children = data.children.filter(i => i.content);
        if (data.name === '' && data.title === '' && data.children.length === 0) {
            return;
        }
        const last = this.selectedIndex();
        this.items.update(v => {
            if (last >= 0) {
                v[last] = data;
            } else {
                v.push(data);
            }
            return [...v];
        });
        if (last < 0) {
            this.selectedIndex.set(this.items().length - 1);
        }
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
        this.items.set(items);
    }
    

}
