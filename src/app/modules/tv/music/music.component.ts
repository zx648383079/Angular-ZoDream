import { Component, OnInit, inject, viewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SuggestChangeEvent } from '../../../components/form';
import { MusicPlayerComponent } from '../../../components/media-player';
import { IPageQueries } from '../../../theme/models/page';
import { SearchService } from '../../../theme/services';
import { formatHour } from '../../../theme/utils';
import { IMusic } from '../model';
import { TvService } from '../tv.service';

@Component({
    standalone: false,
    selector: 'app-music',
    templateUrl: './music.component.html',
    styleUrls: ['./music.component.scss']
})
export class MusicComponent implements OnInit {
    private readonly service = inject(TvService);
    private readonly route = inject(ActivatedRoute);
    private readonly router = inject(Router);
    private searchService = inject(SearchService);


    public readonly player = viewChild(MusicPlayerComponent);

    public items: IMusic[] = [];
    public hasMore = true;
    public isLoading = false;
    public total = 0;
    public queries: IPageQueries = {
        page: 1,
        per_page: 20,
        keywords: ''
    };

    ngOnInit() {
        this.route.queryParams.subscribe(params => {
            this.queries = this.searchService.getQueries(params, this.queries);
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

    public tapPlay(item: IMusic) {
        this.player().play({
            name: item.name,
            cover: item.cover,
            artist: item.artist,
            source: item.files.filter(i => i.file_type < 5).sort((a, b) => a.file_type - b.file_type)[0].url,
            lyrics: item.files.filter(i => i.file_type === 11)[0].url
        });
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
                this.searchService.applyHistory(this.queries = queries);
                this.isLoading = false;
            },
            error: () => {
                this.isLoading = false;
            }
        });
    }

}
