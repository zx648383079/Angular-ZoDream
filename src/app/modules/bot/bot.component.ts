import { form } from '@angular/forms/signals';
import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IPageQueries } from '../../theme/models/page';
import { SearchService } from '../../theme/services';
import { ThemeService } from '../../theme/services';
import { BotService } from './bot.service';
import { IBotAccount } from './model';

@Component({
    standalone: false,
  selector: 'app-bot',
  templateUrl: './bot.component.html',
  styleUrls: ['./bot.component.scss']
})
export class BotComponent implements OnInit {
    private readonly service = inject(BotService);
    private readonly route = inject(ActivatedRoute);
    private readonly themeService = inject(ThemeService);
    private readonly searchService = inject(SearchService);


    public items: IBotAccount[] = [];
    public hasMore = true;
    public isLoading = false;
    public total = 0;
    public selected = 0;
    public readonly queries = form(signal<IPageQueries>({
        keywords: '',
        page: 1,
        per_page: 20
    }));

    constructor() {
        this.themeService.titleChanged.next($localize `Bot`);
    }

    ngOnInit() {
        this.route.queryParams.subscribe(params => {
            this.queries().value.update(v => this.searchService.getQueries(params, v));
            this.tapPage();
        });
    }

    public tapRefresh() {
        this.goPage(1);
    }

    public tapPage() {
        this.goPage(this.queries.page().value());
    }

    public tapMore() {
        this.goPage(this.queries.page().value() + 1);
    }

    public goPage(page: number) {
        if (this.isLoading) {
            return;
        }
        this.isLoading = true;
        const queries = {...this.queries().value(), page};
        this.service.getList(queries).subscribe({
            next: res => {
                this.isLoading = false;
                this.items = res.data;
                this.hasMore = res.paging.more;
                this.total = res.paging.total;
                this.searchService.applyHistory(queries);
                this.queries().value.set(queries);
            },
            error: _ => {
                this.isLoading = false;
            }
        });
    }

    public tapSearch() {

        this.tapRefresh();
    }

}
