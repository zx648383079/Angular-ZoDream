import { Component, HostListener, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DialogService } from '../dialog';
import { IPageQueries } from '../theme/models/page';
import { applyHistory, getQueries } from '../theme/query';
import { ThemeService } from '../theme/services';
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
    ) {
        this.themeService.setTitle('短视频');
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
            this.queries = getQueries(params, this.queries);
            this.tapPage();
        });
    }

    public tapPlay(item: IVideo) {
        if (!item.video_path) {
            this.toastrService.warning('文件不存在');
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
            applyHistory(this.queries = queries);
        }, () => {
            this.isLoading = false;
        });
    }

    public tapSearch(form: any) {
        this.queries = getQueries(form, this.queries);
        this.tapRefresh();
    }

}
