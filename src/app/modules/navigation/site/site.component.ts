import { Component, OnChanges, OnInit, SimpleChanges, inject, input } from '@angular/core';
import { cloneObject } from '../../../theme/utils';
import { ISiteCategory } from '../model';
import { NavigationService } from '../navigation.service';

@Component({
    standalone: false,
  selector: 'app-navigation-site',
  templateUrl: './site.component.html',
  styleUrls: ['./site.component.scss']
})
export class SiteComponent implements OnChanges {
    private service = inject(NavigationService);


    public readonly visible = input(false);
    public categories: ISiteCategory[] = [];
    public selectedItems: ISiteCategory[] = [];
    private booted = false;

    ngOnChanges(changes: SimpleChanges): void {
        if (changes.visible && changes.visible.currentValue) {
            this.boot();
        }
    }

    public tapCategory(item: ISiteCategory) {
        if (item.children && item.children.length > 0) {
            this.selectedItems = cloneObject(item.children).map(this.formatItem);
            return;
        }
        this.selectedItems = [cloneObject(item)].map(this.formatItem);
    }

    public loadItem(item: ISiteCategory) {
        if (item.lazy_booted) {
            return;
        }
        setTimeout(() => {
            item.lazy_booted = true;
        }, 100);
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
            this.categories = res.site_category;
            this.selectedItems = res.site_recommend.map(this.formatItem);
        });
    }

}
