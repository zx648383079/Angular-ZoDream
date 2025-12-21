import { form } from '@angular/forms/signals';
import { Component, OnInit, inject, viewChild, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SuggestChangeEvent } from '../../../components/form';
import { MusicPlayerComponent } from '../../../components/media-player';
import { IPageQueries } from '../../../theme/models/page';
import { SearchService } from '../../../theme/services';
import { formatHour, parseNumber } from '../../../theme/utils';
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
    private readonly searchService = inject(SearchService);


    public readonly player = viewChild(MusicPlayerComponent);

    public readonly items = signal<IMusic[]>([]);
    private hasMore = true;
    public readonly isLoading = signal(false);
    public readonly total = signal(0);
    public readonly queries = form(signal<IPageQueries>({
        page: 1,
        per_page: 20,
        keywords: ''
    }));

    ngOnInit() {
        this.route.queryParams.subscribe(params => {
            this.queries().value.update(v => this.searchService.getQueries(params, v));
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
            source: item.files.filter(i => parseNumber(i.file_type) < 5).sort((a, b) => parseNumber(a.file_type) - parseNumber(b.file_type))[0].url,
            lyrics: item.files.filter(i => i.file_type === '11')[0].url
        });
    }

    public tapRefresh() {
        this.service.musicList({}).subscribe(res => {
            this.items.set(res.data);
        });
    }

    public tapPage() {
        this.goPage(this.queries.page().value());
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
        this.queries.keywords().value.set(value);
        this.goPage(1);
    }

    public goPage(page: number) {
        if (this.isLoading) {
            return;
        }
        this.isLoading.set(true);
        const queries = {...this.queries().value(), page};
        this.service.musicList(queries).subscribe({
            next: res => {
                this.items.set(res.data);
                this.hasMore = res.paging.more;
                this.total.set(res.paging.total);
                this.searchService.applyHistory(queries);
                this.queries().value.set(queries);
                this.isLoading.set(false);
            },
            error: () => {
                this.isLoading.set(false);
            }
        });
    }

}
