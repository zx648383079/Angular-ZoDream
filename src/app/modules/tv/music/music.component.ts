import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SuggestChangeEvent } from '../../../components/form';
import { MusicPlayerComponent } from '../../../components/media-player';
import { PlayerEvent } from '../../../components/media-player/fixed/model';
import { IPageQueries } from '../../../theme/models/page';
import { applyHistory, getQueries } from '../../../theme/query';
import { formatHour } from '../../../theme/utils';
import { IMusic } from '../model';
import { TvService } from '../tv.service';

@Component({
    selector: 'app-music',
    templateUrl: './music.component.html',
    styleUrls: ['./music.component.scss']
})
export class MusicComponent implements OnInit {

    @ViewChild(MusicPlayerComponent)
    public player: PlayerEvent;

    public items: IMusic[] = [];
    public hasMore = true;
    public isLoading = false;
    public total = 0;
    public queries: IPageQueries = {
        page: 1,
        per_page: 20,
        keywords: ''
    };

    constructor(
        private service: TvService,
        private route: ActivatedRoute,
        private router: Router,
    ) { }

    ngOnInit() {
        this.route.queryParams.subscribe(params => {
            this.queries = getQueries(params, this.queries);
            if (!this.queries.keywords) {
                this.tapRefresh();
                return;
            }
            this.tapPage();
        });
        
    }

    public formatTime(v: number) {
        return formatHour(v, undefined, true);
    }

    public tapRefresh() {
        this.service.musicList({}).subscribe(res => {
            this.items = res.data;
        });
    }

    public tapPage() {
        this.goPage(this.queries.page);
    }

    public onSuggestChange(e: SuggestChangeEvent) {
        this.service.musicSuggest({keywords: e.text}).subscribe(res => {
            e.suggest(res.data);
        });
    }

    public tapSearch(value: IMusic|string) {
        if (typeof value === 'object') {
            return;
        }
        this.queries.keywords = value;
        this.goPage(1);
    }

    public goPage(page: number) {
        if (this.isLoading) {
            return;
        }
        this.isLoading = true;
        const queries = {...this.queries, page};
        this.service.musicList(queries).subscribe({
            next: res => {
                this.items = res.data;
                this.hasMore = res.paging.more;
                this.total = res.paging.total;
                applyHistory(this.queries = queries);
                this.isLoading = false;
            },
            error: () => {
                this.isLoading = false;
            }
        });
    }

}
