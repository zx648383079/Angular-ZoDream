import { form } from '@angular/forms/signals';
import { Component, OnDestroy, OnInit, inject, viewChildren, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IPageQueries } from '../../../../theme/models/page';
import { IActivityTime, ISeckillGoods } from '../../model';
import { SearchService } from '../../../../theme/services';
import { ThemeService } from '../../../../theme/services';
import { mapFormat } from '../../../../theme/utils';
import { ActivityService } from '../activity.service';
import { CountdownComponent } from '../../../../components/desktop';

@Component({
    standalone: false,
    selector: 'app-seckill',
    templateUrl: './seckill.component.html',
    styleUrls: ['./seckill.component.scss']
})
export class SeckillComponent implements OnInit, OnDestroy {
    private readonly service = inject(ActivityService);
    private readonly themeService = inject(ThemeService);
    private readonly route = inject(ActivatedRoute);
    private readonly searchService = inject(SearchService);


    public readonly countItems = viewChildren(CountdownComponent);
    public timeItems: IActivityTime[] = [];
    public readonly items = signal<ISeckillGoods[]>([]);
    private hasMore = true;
    public readonly isLoading = signal(false);
    public tabIndex = 0;
    public readonly total = signal(0);
    public readonly queries = form(signal<IPageQueries>({
        page: 1,
        per_page: 20,
        keywords: '',
    }));
    private timerHandle: any;

    constructor() {
        this.themeService.titleChanged.next('秒杀');
    }

    ngOnInit() {
        this.route.queryParams.subscribe(params => {
            this.queries().value.update(v => this.searchService.getQueries(params, v));
        });
        this.service.seckillTime().subscribe(res => {
            this.timeItems = res.data;
            if (this.timeItems.length > 0) {
                this.tapTab(0);
                this.startTimer();
            }
        });
    }

    ngOnDestroy() {
        this.stopTimer();
    }

    public onTimeEnd(item: IActivityTime) {
        item.status --;
    }

    public formatStatus(value: number) {
        return mapFormat(value, ['已结束', '进行中', '即将开始']);
    }

    public tapTab(i: number) {
        this.tabIndex = i;
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
        if (this.isLoading) {
            return;
        }
        this.isLoading.set(true);
        const queries = {...this.queries().value(), page};
        this.service.seckillList(queries).subscribe({
            next: res => {
                this.hasMore = res.paging.more;
                this.isLoading.set(false);
                this.items.set(res.data);
                this.searchService.applyHistory(queries);
                this.queries().value.set(queries);
            },
            error: () => {
                this.isLoading.set(false);
            }
        });
    }

    private startTimer() {
        this.stopTimer();
        this.timerHandle = window.setInterval(() => {
            if (this.countItems().length < 1) {
                return;
            }
            this.countItems().forEach(item => {
                item.refresh();
            });
        }, 300);
    }

    private stopTimer() {
        if (this.timerHandle > 0) {
            clearInterval(this.timerHandle);
            this.timerHandle = 0;
        }
    }

}
