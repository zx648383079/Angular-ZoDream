import { Component, OnInit, SimpleChanges, inject, input } from '@angular/core';
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
    public items: any[] = [];
    public subtotal: any;
    public hasMore = true;
    public isLoading = false;
    public total = 0;
    public queries: IPageQueries = {
        keywords: '',
        page: 1,
        per_page: 20,
    };
    private booted = 0;

    ngOnChanges(changes: SimpleChanges): void {
        if (changes.init && changes.init.currentValue && this.log() > 0 && this.booted !== this.log()) {
            this.boot();
        }
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
        this.goPage(this.queries.page + 1);
    }

    public tapPage() {
        this.goPage(this.queries.page);
    }

    public goPage(page: number) {
        if (this.isLoading) {
            return;
        }
        this.isLoading = true;
        const queries = {...this.queries, page};
        this.service.bargainLogList({...queries, activity: this.activity(), log: this.log()}).subscribe({
            next: res => {
                this.hasMore = res.paging.more;
                this.isLoading = false;
                this.total = res.paging.total;
                this.items = res.data;
                this.queries = queries;
            }, 
            error: () => {
                this.isLoading = false;
            }
        });
    }

}
