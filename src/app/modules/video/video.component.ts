import { Component, HostListener, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DialogService } from '../../components/dialog';
import { SuggestChangeEvent } from '../../components/form';
import { IPageQueries } from '../../theme/models/page';
import { SearchService } from '../../theme/services';
import { ThemeService } from '../../theme/services';
import { IVideo } from './model';
import { VideoService } from './video.service';

@Component({
  selector: 'app-video',
  templateUrl: './video.component.html',
  styleUrls: ['./video.component.scss']
})
export class VideoComponent implements OnInit {

    public items: IVideo[] = [];
    public hasMore = true;
    public isLoading = false;
    public total = 0;
    public isFixed = false;
    public queries: IPageQueries = {
        keywords: '',
        per_page: 20,
        page: 1,
    };

    constructor(
        private service: VideoService,
        private toastrService: DialogService,
        private router: Router,
        private route: ActivatedRoute,
        private themeService: ThemeService,
        private searchService: SearchService,
    ) {
        this.themeService.setTitle($localize `Short video`);
    }

    @HostListener('scroll', [
        '$event.target.scrollTop',
    ])
    public onDivScroll(
        scrollY: number,
    ): void {
        this.isFixed = scrollY > window.innerHeight / 2;
    }

    ngOnInit() {
        this.route.queryParams.subscribe(params => {
            this.queries = this.searchService.getQueries(params, this.queries);
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
        this.goPage(this.queries.page);
    }

    public tapMore() {
        this.goPage(this.queries.page + 1);
    }

    /**
     * goPage
     */
    public goPage(page: number) {
        if (this.isLoading) {
            return;
        }
        this.isLoading = true;
        const queries = {...this.queries, page};
        this.service.videoList(queries).subscribe(res => {
            this.isLoading = false;
            this.items = res.data;
            this.hasMore = res.paging.more;
            this.total = res.paging.total;
            this.searchService.applyHistory(this.queries = queries);
        }, () => {
            this.isLoading = false;
        });
    }

    public tapSearch(keywords: string) {
        this.queries.keywords = keywords;
        this.tapRefresh();
    }

}
