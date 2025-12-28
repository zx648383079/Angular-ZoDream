import { Component, effect, inject, input, signal } from '@angular/core';
import { cloneObject } from '../../../theme/utils';
import { ISiteCategory } from '../model';
import { NavigationService } from '../navigation.service';

@Component({
    standalone: false,
    selector: 'app-navigation-site',
    templateUrl: './site.component.html',
    styleUrls: ['./site.component.scss']
})
export class SiteComponent {
    private readonly service = inject(NavigationService);

    public readonly visible = input(false);
    public readonly categories = signal<ISiteCategory[]>([]);
    public readonly selectedItems = signal<ISiteCategory[]>([]);
    private booted = false;

    constructor() {
        effect(() => {
            if (this.visible()) {
                this.boot();
            }
        });
    }

    public tapCategory(item: ISiteCategory) {
        const next = item.children && item.children.length > 0 
            ? item.children.map(this.formatItem)
            : [this.formatItem(item)];
        this.loadItem(next[0]);
        this.selectedItems.set(next);
    }

    public loadItem(item: ISiteCategory) {
        if (item.lazy_booted) {
            return;
        }
        item.lazy_booted = true;
        this.service.siteList({
            category: item.id
        }).subscribe({
            next: res => {
                item.items = res.data;
                this.selectedItems.update(v => {
                    return [...v];
                });
            },
            error: _ => {
                item.lazy_booted = false;
            }
        });
    }

    private formatItem(i: ISiteCategory) {
        if (!i.items) {
            i.items = [];
            i.lazy_booted = false;
        } else {
            i.lazy_booted = true;
        }
        return i;
    }

    private boot() {
        if (this.booted) {
            return;
        }
        this.booted = true;
        this.service.batch({
            site_category: {},
            site_recommend: {},
        }).subscribe(res => {
            this.categories.set(res.site_category);
            this.selectedItems.set(res.site_recommend.map(this.formatItem));
        });
    }

}
