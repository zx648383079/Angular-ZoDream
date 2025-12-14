import { form } from '@angular/forms/signals';
import { Component, OnInit, inject, viewChildren, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CountdownComponent } from '../../../../components/desktop';
import { IPageQueries } from '../../../../theme/models/page';
import { IActivity, IFreeTrialConfigure } from '../../model';
import { SearchService } from '../../../../theme/services';
import { ThemeService } from '../../../../theme/services';
import { ActivityService } from '../activity.service';

@Component({
    standalone: false,
  selector: 'app-free-trial',
  templateUrl: './free-trial.component.html',
  styleUrls: ['./free-trial.component.scss']
})
export class FreeTrialComponent implements OnInit {
    private readonly themeService = inject(ThemeService);
    private readonly route = inject(ActivatedRoute);
    private readonly service = inject(ActivityService);
    private readonly searchService = inject(SearchService);


    public readonly countItems = viewChildren(CountdownComponent);
    public items: IActivity<IFreeTrialConfigure>[] = [];
    public hasMore = true;
    public isLoading = false;
    public total = 0;
    public readonly queries = form(signal<IPageQueries>({
        page: 1,
        per_page: 20,
        keywords: '',
    }));
    private timerHandle: any;

    constructor() {
        this.themeService.titleChanged.next('预售中心');
    }

    ngOnInit() {
        this.route.queryParams.subscribe(params => {
            this.searchService.getQueries(params, this.queries);
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
        this.goPage(this.queries.page().value() + 1);
    }

    public tapPage() {
        this.goPage(this.queries.page().value());
    }

    public goPage(page: number) {
        if (this.isLoading) {
            return;
        }
        this.isLoading = true;
        const queries = {...this.queries().value(), page};
        this.service.freeTrialList(queries).subscribe({
            next: res => {
                this.hasMore = res.paging.more;
                this.isLoading = false;
                this.items = res.data;
                this.searchService.applyHistory(queries);
                this.queries().value.set(queries);
            },
            error: () => {
                this.isLoading = false;
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
