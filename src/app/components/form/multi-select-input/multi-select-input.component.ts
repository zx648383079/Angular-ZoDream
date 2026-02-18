import { Component, effect, HostListener, input, model, signal, untracked } from '@angular/core';
import { FormValueControl } from '@angular/forms/signals';
import { IDataSource, selectedIndex, selectIndex } from '../sources/IDataSource';
import { IControlOption } from '../event';
import { checkRange } from '../../../theme/utils';
import { hasElementByClass } from '../../../theme/utils/doc';

interface ISelectColumn {
    label?: string;
    keywords?: string;
    focus?: boolean;
    isLoading?: boolean;
    searchable?: boolean;
    selected: number;
    items: IControlOption[];
}

@Component({
    standalone: false,
    selector: 'app-multi-select-input',
    templateUrl: './multi-select-input.component.html',
    styleUrls: ['./multi-select-input.component.scss'],
})
export class MultiSelectInputComponent<T = any> implements FormValueControl<T> {

    public readonly placeholder = input($localize `Please select...`);
    public readonly source = input.required<IDataSource>();
    public readonly items = signal<ISelectColumn[]>([
        {items: [], searchable: true, keywords: '', selected: 0}
    ]);

    public readonly disabled = input<boolean>(false);
    public readonly value = model<T>();

    constructor() {
        effect(() => {
            const src = this.source();
            const val = this.value();
            untracked(() => {
                src.initialize(val).subscribe(res => {
                    this.initialize(res);
                });
            });
        });
    }

    @HostListener('document:click', ['$event']) 
    public hideCalendar(event: any) {
        if (!event.target.closest('.select-input-container') && !hasElementByClass(event.path, 'select-input-container')) {
            this.items.update(v => {
                for (const item of v) {
                    item.focus = false;
                }
                return v;
            });
        }
    }

    public onKeydown(e: KeyboardEvent, item: ISelectColumn) {
        if (e.code !== 'Enter') {
            return;
        }

    }

    public toggleFocus(index: number) {
        this.items.update(v => {
            for (let i = 0; i < v.length; i++) {
                v[i].focus = i === index;
            }
            return [...v];
        });
    }

    public tapItem(index: number, i: number) {
        const items = this.items();
        items[index].focus = false;
        this.select(items, index, i);
    }

    private initialize(data: IControlOption[][]) {
        this.items.set(data.map(group => {
            const selected = Math.max(0, selectedIndex(group));
            return <ISelectColumn>{
                selected,
                label: group[selected].name,
                searchable: true, 
                keywords: '', 
                items: group,
            };
        }));
    }

    private select(items: ISelectColumn[], index: number, i: number) {
        index = checkRange(index, 0, items.length - 1);
        const group = items[index];
        group.selected = checkRange(i, 0, group.items.length - 1);
        const item = group.items[group.selected];
        group.label = item.name;
        selectIndex(group.items, group.selected);
        const src = this.source();
        const next = src.influence(index);
        if (next < 0) {
            this.items.set([...items]);
            return;
        }
        src.select(items.map(i => i.items[i.selected]), next).subscribe(res => {
            items[next].items = res;
            this.select(items, next, 0);
        });
    }
}
