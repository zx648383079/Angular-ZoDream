import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ISiteCategory } from '../../model';

@Component({
  selector: 'app-category-panel',
  templateUrl: './category-panel.component.html',
  styleUrls: ['./category-panel.component.scss']
})
export class CategoryPanelComponent {

    @Input() public items: ISiteCategory[] = [];
    @Output() public changed = new EventEmitter<ISiteCategory>();

    // public current: ISiteCategory|undefined = undefined;
    // public kidItems: ISiteCategory[] = [];
    public crumbs: number[] = [];

    constructor() { }

    public get current(): ISiteCategory|undefined {
        if (this.crumbs.length < 1 || this.items.length < 1) {
            return undefined;
        }
        let item: ISiteCategory = undefined;
        for (const i of this.crumbs) {
            if (!item) {
                item = this.items[i];
                continue;
            }
            if (item.children && item.children.length > 0) {
                item = item.children[i];
                continue;
            }
            break;
        }
        return item;
    }

    public get kidItems(): ISiteCategory[] {
        if (this.crumbs.length < 1) {
            return this.items;
        }
        const item = this.current;
        if (!item) {
            return this.items;
        }
        return item.children || [];
    }

    public tapBack() {
        if (this.crumbs.length < 1) {
            return;
        }
        this.crumbs.pop();
    }

    public tapItem(i: number) {
        const item = this.kidItems[i];
        if (!item.children || item.children.length < 1) {
            this.changed.emit(item);
            return;
        }
        this.crumbs.push(i);
    }
}
