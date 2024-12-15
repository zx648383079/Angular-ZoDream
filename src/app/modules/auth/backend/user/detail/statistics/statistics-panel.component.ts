import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { AuthService } from '../../../auth.service';
import { openLink } from '../../../../../../theme/utils/deeplink';
import { Router } from '@angular/router';
import { IStatisticsItem } from '../../../../../../theme/models/seo';

@Component({
    standalone: false,
    selector: 'app-log-statistics-panel',
    templateUrl: './statistics-panel.component.html',
    styleUrls: ['./statistics-panel.component.scss']
})
export class StatisticsPanelComponent implements OnChanges {

    @Input() public itemId = 0;
    @Input() public init = false;
    public items: IStatisticsItem[] = [];
    public isLoading = false;
    private booted = 0;

    constructor(
        private service: AuthService,
        private router: Router,
    ) { }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes.init && changes.init.currentValue && this.itemId > 0 && this.booted !== this.itemId) {
            this.boot();
        }
    }

    public tapItem(item: any) {
        if (!item.url) {
            return;
        }
        openLink(this.router, item.url);
    }

    private boot() {
        this.booted = this.itemId;
        if (this.itemId < 1) {
            return;
        }
        this.tapRefresh();
    }

    public tapRefresh() {
        this.service.userAccount({
            id: this.itemId,
            extra: 'count'
        }).subscribe({
            next: res => {
                this.items = res.data;
                this.isLoading = false;
            },
            error: () => {
                this.isLoading = false;
            }
        });
    }

}
