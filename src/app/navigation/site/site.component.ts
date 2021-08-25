import { Component, OnInit } from '@angular/core';
import { cloneObject } from '../../theme/utils';
import { ISiteCategory } from '../model';
import { NavigationService } from '../navigation.service';

@Component({
  selector: 'app-site',
  templateUrl: './site.component.html',
  styleUrls: ['./site.component.scss']
})
export class SiteComponent implements OnInit {

    public categories: ISiteCategory[] = [];
    public selectedItems: ISiteCategory[] = [];

    constructor(
        private service: NavigationService,
    ) { }

    ngOnInit() {
        this.service.categoryAll().subscribe(res => {
            this.categories = res.data;
        });
    }

    public tapCategory(item: ISiteCategory) {
        if (item.children && item.children.length > 0) {
            this.selectedItems = cloneObject(item.children);
            return;
        }
        this.selectedItems = [cloneObject(item)];
    }

    public loadItem(item: ISiteCategory) {
        setTimeout(() => {
            item.lazy_booted = true;
        }, 100);
    }

}
