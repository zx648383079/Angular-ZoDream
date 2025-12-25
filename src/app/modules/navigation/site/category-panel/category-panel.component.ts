import { Component, computed, input, output, signal } from '@angular/core';
import { ISiteCategory } from '../../model';

@Component({
    standalone: false,
    selector: 'app-navigation-category-panel',
    templateUrl: './category-panel.component.html',
    styleUrls: ['./category-panel.component.scss']
})
export class CategoryPanelComponent {

    public readonly items = input<ISiteCategory[]>([]);
    public readonly changed = output<ISiteCategory>();

    // public readonly current = signal<ISiteCategory>(null);
    // public readonly kidItems = signal<ISiteCategory[]>([]);
    public readonly crumbs = signal<number[]>([]);

    public readonly current = computed(() => {
        if (this.crumbs().length < 1 || this.items().length < 1) {
            return undefined;
        }
        let item: ISiteCategory = undefined;
        for (const i of this.crumbs()) {
            if (!item) {
                item = this.items()[i];
                continue;
            }
            if (item.children && item.children.length > 0) {
                item = item.children[i];
                continue;
            }
            break;
        }
        return item;
    });

    public readonly kidItems = computed(() => {
        if (this.crumbs().length < 1) {
            return this.items();
        }
        const item = this.current();
        if (!item) {
            return this.items();
        }
        return item.children || [];
    });

    public tapBack() {
        if (this.crumbs().length < 1) {
            return;
        }
        this.crumbs.update(v => {
            v.pop();
            return v;
        });
    }

    public tapItem(i: number) {
        const item = this.kidItems()[i];
        if (!item.children || item.children.length < 1) {
            this.changed.emit(item);
            return;
        }
        this.crumbs.update(v => {
            return [...v, i];
        });
    }
}
