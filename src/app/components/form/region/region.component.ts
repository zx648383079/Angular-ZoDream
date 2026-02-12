import { Component, HostListener, input, model, effect, signal, computed, untracked } from '@angular/core';
import { hasElementByClass } from '../../../theme/utils/doc';
import { FormValueControl } from '@angular/forms/signals';
import { IDataSource, select } from '../sources/IDataSource';
import { IControlOption } from '../event';

@Component({
    standalone: false,
    selector: 'app-region',
    styleUrls: ['./region.component.scss'],
    templateUrl: 'region.component.html',
})
export class RegionComponent<T = any> implements FormValueControl<T[]|T> {
    public readonly canYes = input(false);
    public readonly placeholder = input($localize `Please select...`);
    public readonly source = input.required<IDataSource>();
    public readonly disabled = input(false);
    public readonly value = model<T[] | T>();

    public readonly routeItems = signal<IControlOption[]>([]);
    public readonly items = signal<IControlOption[]>([]);
    public readonly activeColumn = signal(0);
    public readonly panelVisible = signal(false);

    private booted = false;

    constructor() {
        effect(() => {
            const src = this.source();
            const val = this.value();
            untracked(() => {
                this.booted = true;
                src.initialize(val).subscribe(res => {
                    this.initialize(res);
                });
            });
        });
    }

    public readonly pathLabel = computed(() => {
        const items = this.routeItems().filter(i => i.value);
        if (items.length < 1) {
            return this.placeholder();
        }
        return items.map(i => i.label).join('/');
    });

    @HostListener('document:click', ['$event']) 
    public hideCalendar(event: any) {
        if (!event.target.closest('.select-input-container') && !hasElementByClass(event.path, 'select-input-container')) {
            this.panelVisible.set(false);
        }
    }

    public open() {
        if (this.disabled()) {
            return;
        }
        this.panelVisible.set(true);
        if (!this.booted) {
            this.booted = true;
            this.source().initialize(this.value()).subscribe(res => {
                this.initialize(res);
            });
        }
    }

    public tapColumn(column: number) {
        this.source().select(this.routeItems(), column).subscribe(res => {
            this.items.set(res);
        });
        this.activeColumn.set(column);
    }

    public close(isOk = false) {
        this.panelVisible.set(false);
        if (isOk) {
            this.output();
        }
    }

    public tapCheckedItem(item: IControlOption) {
        const column = this.activeColumn();
        select(this.items(), item.value);
        const nextColumn = column + 1;
        this.routeItems.update(v => {
            v[column] = item;
            v.splice(nextColumn);
            v.push({
                label: this.placeholder()
            });
            return [...v];
        });
        const routes = this.routeItems().slice(0, nextColumn);
        this.source().select(routes, nextColumn).subscribe(res => {
            if (res.length === 0) {
                this.routeItems.set(routes);
                this.close(true);
                return;
            }
            this.items.set(res);
            this.activeColumn.set(nextColumn);
        });
    }

    private output() {
        const selectedItems = this.routeItems();
        if (selectedItems.length < 1) {
            return;
        }
        const value = this.value();
        const last = selectedItems[selectedItems.length - 1];
        if (typeof value === 'undefined' || typeof value === 'boolean' || value === null) {
            this.value.set(last.value);
        } else if (typeof value !== 'object') {
            this.value.set(this.source().format(last));
        } else if (value instanceof Array) {
            this.value.set(selectedItems.map(i => i.value));
        } else {
            this.value.set(last.value);
        }
    }

    private initialize(data: IControlOption[][]) {
        this.routeItems.update(v => {
            if (v.length === 0) {
                v.push({
                    label: this.placeholder()
                });
            }
            return v;
        });
        this.items.set(data[this.activeColumn()]);
    }
}
