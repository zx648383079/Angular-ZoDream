import { Component, OnDestroy, OnInit, QueryList, ViewChildren } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CountdownComponent } from '../../../../theme/components';
import { IPageQueries } from '../../../../theme/models/page';
import { IActivityTime, ISeckillGoods } from '../../model';
import { applyHistory, getQueries } from '../../../../theme/query';
import { ThemeService } from '../../../../theme/services';
import { mapFormat } from '../../../../theme/utils';
import { ActivityService } from '../activity.service';

@Component({
  selector: 'app-seckill',
  templateUrl: './seckill.component.html',
  styleUrls: ['./seckill.component.scss']
})
export class SeckillComponent implements OnInit, OnDestroy {

    @ViewChildren(CountdownComponent)
    public countItems: QueryList<CountdownComponent>;
    public timeItems: IActivityTime[] = [];
    public items: ISeckillGoods[] = [];
    public hasMore = true;
    public isLoading = false;
    public tabIndex = 0;
    public total = 0;
    public queries: IPageQueries = {
        page: 1,
        per_page: 20,
        keywords: '',
    };
    private timerHandle: any;

    constructor(
        private service: ActivityService,
        private themeService: ThemeService,
        private route: ActivatedRoute,
    ) {
        this.themeService.setTitle('秒杀');
    }

    ngOnInit() {
        this.route.queryParams.subscribe(params => {
            this.queries = getQueries(params, this.queries);
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
        this.service.seckillList(queries).subscribe({
            next: res => {
                this.hasMore = res.paging.more;
                this.isLoading = false;
                this.items = res.data;
                applyHistory(this.queries = queries);
            }, 
            error: () => {
                this.isLoading = false;
            }
        });
    }

    private startTimer() {
        this.stopTimer();
        this.timerHandle = window.setInterval(() => {
            if (this.countItems.length < 1) {
                return;
            }
            this.countItems.forEach(item => {
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
