import { Component, OnDestroy, OnInit, QueryList, ViewChildren } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CountdownComponent } from '../../../../components/desktop';
import { IPageQueries } from '../../../../theme/models/page';
import { IActivity, IAuctionConfigure } from '../../model';
import { SearchService } from '../../../../theme/services';
import { ThemeService } from '../../../../theme/services';
import { ActivityService } from '../activity.service';

@Component({
    standalone: false,
  selector: 'app-auction',
  templateUrl: './auction.component.html',
  styleUrls: ['./auction.component.scss']
})
export class AuctionComponent implements OnInit, OnDestroy {

    @ViewChildren(CountdownComponent)
    public countItems: QueryList<CountdownComponent>;
    public items: IActivity<IAuctionConfigure>[] = [];
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
        private searchService: SearchService,
    ) {
        this.themeService.setTitle('拍卖中心');
    }

    ngOnInit() {
        this.route.queryParams.subscribe(params => {
            this.queries = this.searchService.getQueries(params, this.queries);
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
        this.service.auctionList(queries).subscribe({
            next: res => {
                this.hasMore = res.paging.more;
                this.isLoading = false;
                this.items = res.data;
                this.searchService.applyHistory(this.queries = queries);
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
