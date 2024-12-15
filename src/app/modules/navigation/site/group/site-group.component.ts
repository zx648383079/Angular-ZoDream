import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { ISite } from '../../model';
import { NavigationService } from '../../navigation.service';

@Component({
    standalone: false,
  selector: 'app-navigation-site-group',
  templateUrl: './site-group.component.html',
  styleUrls: ['./site-group.component.scss']
})
export class SiteGroupComponent implements OnChanges {

    @Input() public header = $localize `Recommend`;
    @Input() public category = 0;
    @Input() public init = false;

    @Input() public items: ISite[] = [];
    private booted = 0;

    constructor(
        private service: NavigationService,
    ) { }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes.items && this.items.length > 0) {
            this.booted = this.category;
        }
        if (changes.init && changes.init.currentValue && this.category > 0 && this.booted !== this.category) {
            this.boot();
        }
    }

    public formatLink(item: ISite): string {
        return `${item.schema}://${item.domain}`;
    }

    private boot() {
        this.booted = this.category;
        if (this.category < 1) {
            return;
        }
        this.service.siteList({
            category: this.category
        }).subscribe(res => {
            this.items = res.data;
        })
    }
}
