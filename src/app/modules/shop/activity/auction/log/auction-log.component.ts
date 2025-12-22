import { form } from '@angular/forms/signals';
import { Component, effect, inject, input, signal } from '@angular/core';
import { IPageQueries } from '../../../../../theme/models/page';
import { ActivityService } from '../../activity.service';

@Component({
    standalone: false,
    selector: 'app-auction-log',
    templateUrl: './auction-log.component.html',
    styleUrls: ['./auction-log.component.scss']
})
export class AuctionLogComponent {
    service = inject(ActivityService);


    public readonly activity = input(0);
    public readonly init = input(false);
    public readonly items = signal<any[]>([]);
    public subtotal: any;
    private hasMore = true;
    public readonly isLoading = signal(false);
    public readonly total = signal(0);
    public readonly queries = form(signal<IPageQueries>({
        keywords: '',
        page: 1,
        per_page: 20,
    }));
    private booted = 0;

    constructor() {
        effect(() => {
            if (this.init() && this.activity() > 0 && this.booted !== this.activity()) {
                this.boot();
            }
        });
    }

    private boot() {
        this.booted = this.activity();
        if (this.activity() < 1) {
            return;
        }
        this.tapRefresh();
    }

    public tapRefresh() {
        this.goPage(1);
    }

    public tapMore() {
        if (!this.hasMore) {
            return;
        }
        this.goPage(this.queries.page().value() + 1);
    }

    public tapPage() {
        this.goPage(this.queries.page().value());
    }

    public goPage(page: number) {
        if (this.isLoading()) {
            return;
        }
        this.isLoading.set(true);
        const queries = {...this.queries().value(), page};
        this.service.auctionLogList({...queries, activity: this.activity()}).subscribe({
            next: res => {
                this.hasMore = res.paging.more;
                this.isLoading.set(false);
                this.total.set(res.paging.total);
                this.items.set(res.data);
                this.queries().value.set(queries);
            },
            error: () => {
                this.isLoading.set(false);
            }
        });
    }

}
