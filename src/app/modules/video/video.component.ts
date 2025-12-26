import { form } from '@angular/forms/signals';
import { Component, HostListener, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DialogService } from '../../components/dialog';
import { IPageQueries } from '../../theme/models/page';
import { SearchService } from '../../theme/services';
import { ThemeService } from '../../theme/services';
import { IVideo } from './model';
import { VideoService } from './video.service';

@Component({
    standalone: false,
    selector: 'app-video',
    templateUrl: './video.component.html',
    styleUrls: ['./video.component.scss']
})
export class VideoComponent implements OnInit {
    private readonly service = inject(VideoService);
    private readonly toastrService = inject(DialogService);
    private readonly router = inject(Router);
    private readonly route = inject(ActivatedRoute);
    private readonly themeService = inject(ThemeService);
    private readonly searchService = inject(SearchService);


    public readonly items = signal<IVideo[]>([]);
    public readonly hasMore = signal(true);
    public readonly isLoading = signal(false);
    public readonly total = signal(0);
    public readonly isFixed = signal(false);
    public readonly queries = form(signal<IPageQueries>({
        keywords: '',
        per_page: 20,
        page: 1,
    }));

    constructor() {
        this.themeService.titleChanged.next($localize `Short video`);
    }

    @HostListener('scroll', [
        '$event',
    ])
    public onDivScroll(
        event: Event
    ): void {
        const target = event.target as HTMLElement;
        this.isFixed.set(target.scrollTop > window.innerHeight / 2);
    }

    ngOnInit() {
        this.route.queryParams.subscribe(params => {
            this.queries().value.update(v => this.searchService.getQueries(params, v));
            this.tapPage();
        });
    }

    public tapPlay(item: IVideo) {
        if (!item.video_path) {
            this.toastrService.warning($localize `video is not exsit`);
            return;
        }
        this.router.navigate(['video', item.id], {relativeTo: this.route});
    }


    /**
     * tapRefresh
     */
    public tapRefresh() {
        this.goPage(1);
    }

    public tapPage() {
        this.goPage(this.queries.page().value());
    }

    public tapMore() {
        this.goPage(this.queries.page().value() + 1);
    }

    /**
     * goPage
     */
    public goPage(page: number) {
        if (this.isLoading()) {
            return;
        }
        this.isLoading.set(true);
        const queries = {...this.queries().value(), page};
        this.service.videoList(queries).subscribe({
            next: res => {
                this.isLoading.set(false);
                this.items.set(res.data);
                this.hasMore.set(res.paging.more);
                this.total.set(res.paging.total);
                this.searchService.applyHistory(queries);
                this.queries().value.set(queries);
            },
            error: () => {
                this.isLoading.set(false);
            }
        });
    }

    public tapSearch(keywords: string) {
        this.queries.keywords().value.set(keywords);
        this.tapRefresh();
    }

}
