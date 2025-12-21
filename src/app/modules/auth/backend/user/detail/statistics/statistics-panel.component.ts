import { Component, effect, inject, input, signal } from '@angular/core';
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
export class StatisticsPanelComponent {
    private readonly service = inject(AuthService);
    private readonly router = inject(Router);


    public readonly itemId = input(0);
    public readonly init = input(false);
    public readonly items = signal<IStatisticsItem[]>([]);
    public readonly isLoading = signal(false);
    private booted = 0;


    constructor() {
        effect(() => {
            if (this.init() && this.itemId() > 0 && this.booted !== this.itemId()) {
                this.boot();
            }
        });
    }

    public tapItem(item: any) {
        if (!item.url) {
            return;
        }
        openLink(this.router, item.url);
    }

    private boot() {
        this.booted = this.itemId();
        if (this.itemId() < 1) {
            return;
        }
        this.tapRefresh();
    }

    public tapRefresh() {
        this.service.userAccount({
            id: this.itemId(),
            extra: 'count'
        }).subscribe({
            next: res => {
                this.items.set(res.data);
                this.isLoading.set(false);
            },
            error: () => {
                this.isLoading.set(false);
            }
        });
    }

}
