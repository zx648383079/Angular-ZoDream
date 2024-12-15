import { Component, OnInit } from '@angular/core';
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

    public items: IBotAccount[] = [];
    public hasMore = true;
    public isLoading = false;
    public total = 0;
    public selected = 0;
    public queries: IPageQueries = {
        keywords: '',
        page: 1,
        per_page: 20
    };

    constructor(
        private service: BotService,
        private route: ActivatedRoute,
        private themeService: ThemeService,
        private searchService: SearchService,
    ) {
        this.themeService.setTitle($localize `Bot`);
    }

    ngOnInit() {
        this.route.queryParams.subscribe(params => {
            this.queries = this.searchService.getQueries(params, this.queries);
            this.tapPage();
        });
    }

    public tapRefresh() {
        this.goPage(1);
    }

    public tapPage() {
        this.goPage(this.queries.page);
    }

    public tapMore() {
        this.goPage(this.queries.page + 1);
    }

    public goPage(page: number) {
        if (this.isLoading) {
            return;
        }
        this.isLoading = true;
        const queries = {...this.queries, page};
        this.service.getList(queries).subscribe({
            next: res => {
                this.isLoading = false;
                this.items = res.data;
                this.hasMore = res.paging.more;
                this.total = res.paging.total;
                this.searchService.applyHistory(this.queries = queries);
            },
            error: _ => {
                this.isLoading = false;
            }
        });
    }

    public tapSearch(form: any) {
        this.queries = this.searchService.getQueries(form, this.queries);
        this.tapRefresh();
    }

}
