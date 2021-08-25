import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { ISite } from '../../model';
import { NavigationService } from '../../navigation.service';

@Component({
  selector: 'app-site-group',
  templateUrl: './site-group.component.html',
  styleUrls: ['./site-group.component.scss']
})
export class SiteGroupComponent implements OnChanges {

    @Input() public header = '推荐';
    @Input() public category = 0;
    @Input() public init = false;

    public items: ISite[] = [];
    private booted = 0;

    constructor(
        private service: NavigationService,
    ) { }

    ngOnChanges(changes: SimpleChanges): void {
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
