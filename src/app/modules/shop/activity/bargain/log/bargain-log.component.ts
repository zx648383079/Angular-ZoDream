import { form } from '@angular/forms/signals';
import { Component, effect, inject, input, signal } from '@angular/core';
import { IPageQueries } from '../../../../../theme/models/page';
import { ActivityService } from '../../activity.service';

@Component({
    standalone: false,
    selector: 'app-bargain-log',
    templateUrl: './bargain-log.component.html',
    styleUrls: ['./bargain-log.component.scss']
})
export class BargainLogComponent {
    service = inject(ActivityService);


    public readonly activity = input(0);
    public readonly log = input(0);
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
            if (this.init() && this.log() > 0 && this.booted !== this.log()) {
                this.boot();
            }
        });
    }

    private boot() {
        this.booted = this.log();
        if (this.log() < 1) {
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
        this.service.bargainLogList({...queries, activity: this.activity(), log: this.log()}).subscribe({
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
