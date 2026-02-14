import { form } from '@angular/forms/signals';
import { Component, inject, viewChildren, signal, DestroyRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CountdownComponent } from '../../../../components/desktop';
import { IPageQueries } from '../../../../theme/models/page';
import { IActivity, IPreSaleConfigure } from '../../model';
import { SearchService } from '../../../../theme/services';
import { ThemeService } from '../../../../theme/services';
import { ActivityService } from '../activity.service';
import { interval, Subscription } from 'rxjs';

@Component({
    standalone: false,
    selector: 'app-presale',
    templateUrl: './presale.component.html',
    styleUrls: ['./presale.component.scss']
})
export class PresaleComponent {
    private readonly themeService = inject(ThemeService);
    private readonly route = inject(ActivatedRoute);
    private readonly service = inject(ActivityService);
    private readonly searchService = inject(SearchService);
    private readonly destroyRef = inject(DestroyRef);


    public readonly countItems = viewChildren(CountdownComponent);
    public readonly items = signal<IActivity<IPreSaleConfigure>[]>([]);
    private hasMore = true;
    public readonly isLoading = signal(false);
    public readonly total = signal(0);
    public readonly queries = form(signal<IPageQueries>({
        page: 1,
        per_page: 20,
        keywords: '',
    }));
    private $timer: Subscription;

    constructor() {
        this.themeService.titleChanged.next('预售中心');
        this.route.queryParams.subscribe(params => {
            this.queries().value.update(v => this.searchService.getQueries(params, v));
            this.tapPage();
            this.startTimer();
        });
        this.destroyRef.onDestroy(() => this.stopTimer());
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
        this.service.presaleList(queries).subscribe({
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
        this.$timer = interval(300).subscribe(() => {
            if (this.countItems().length < 1) {
                return;
            }
            this.countItems().forEach(item => {
                item.refresh();
            });
        });
    }

    private stopTimer() {
        if (this.$timer) {
            this.$timer.unsubscribe();
            this.$timer = null;
        }
    }
}
