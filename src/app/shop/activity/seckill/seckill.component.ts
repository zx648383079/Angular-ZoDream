import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IPageQueries } from '../../../theme/models/page';
import { IActivityTime, ISeckillGoods } from '../../../theme/models/shop';
import { applyHistory, getQueries } from '../../../theme/query';
import { ThemeService } from '../../../theme/services';
import { ActivityService } from '../activity.service';

@Component({
  selector: 'app-seckill',
  templateUrl: './seckill.component.html',
  styleUrls: ['./seckill.component.scss']
})
export class SeckillComponent implements OnInit {

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
            }
        });
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

}
