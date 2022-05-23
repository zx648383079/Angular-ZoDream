import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CountdownComponent } from '../../../../theme/components';
import { IPageQueries } from '../../../../theme/models/page';
import { IActivity, IFreeTrialConfigure } from '../../model';
import { applyHistory, getQueries } from '../../../../theme/query';
import { ThemeService } from '../../../../theme/services';
import { ActivityService } from '../activity.service';

@Component({
  selector: 'app-free-trial',
  templateUrl: './free-trial.component.html',
  styleUrls: ['./free-trial.component.scss']
})
export class FreeTrialComponent implements OnInit {

    @ViewChildren(CountdownComponent)
    public countItems: QueryList<CountdownComponent>;
    public items: IActivity<IFreeTrialConfigure>[] = [];
    public hasMore = true;
    public isLoading = false;
    public total = 0;
    public queries: IPageQueries = {
        page: 1,
        per_page: 20,
        keywords: '',
    };
    private timerHandle: any;
    
    constructor(
        private themeService: ThemeService,
        private route: ActivatedRoute,
        private service: ActivityService,
    ) {
        this.themeService.setTitle('预售中心');
    }

    ngOnInit() {
        this.route.queryParams.subscribe(params => {
            this.queries = getQueries(params, this.queries);
            this.tapPage();
            this.startTimer();
        });
    }

    ngOnDestroy() {
        this.stopTimer();
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
        this.service.freeTrialList(queries).subscribe({
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
