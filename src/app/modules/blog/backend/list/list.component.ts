import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DialogService } from '../../../../components/dialog';
import { IBlog, ICategory } from '../../model';
import { IPageQueries } from '../../../../theme/models/page';
import { SearchService } from '../../../../theme/services';
import { BlogService } from '../blog.service';
import { IItem } from '../../../../theme/models/seo';
import { SwiperEvent } from '../../../../components/swiper';
import { mapFormat } from '../../../../theme/utils';

@Component({
    standalone: false,
    selector: 'app-list',
    templateUrl: './list.component.html',
    styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {
    private service = inject(BlogService);
    private toastrService = inject(DialogService);
    private route = inject(ActivatedRoute);
    private searchService = inject(SearchService);


    public categories: ICategory[] = [];
    public statusItems: IItem[] = [];

    public items: IBlog[] = [];
    public queries: IPageQueries = {
        keywords: '',
        term: 0,
        status: 0,
        page: 1,
        per_page: 20,
    };
    public hasMore = true;
    public isLoading = false;
    public total = 0;
    public isReview = false;

    constructor() {
        this.service.editOption().subscribe(res => {
            this.categories = res.categories;
            this.statusItems = res.publish_status;
        });
    }

    ngOnInit() {
        this.route.queryParams.subscribe(res => {
            this.queries = this.searchService.getQueries(res, this.queries);
            this.tapPage();
        });
    }

    public formatStatus(val: number) {
        return mapFormat(val, [
            {name: '待审核', value: 0},
            {name: '通过', value: 1},
            {name: '拒绝', value: 9}
        ]);
    }

    public tapRefresh() {
        this.goPage(1);
    }

    public tapMore() {
        if (!this.hasMore) {
            return;
        }
        this.goPage(this.queries.page + 1);
    }

    public goPage(page: number) {
        if (this.isLoading) {
            return;
        }
        this.isLoading = true;
        const queries = {...this.queries, page};
        this.service.getPage(queries).subscribe({
            next: res => {
                this.hasMore = res.paging.more;
                this.isLoading = false;
                this.items = res.data;
                this.total = res.paging.total;
                this.searchService.applyHistory(this.queries = queries);
            },
            error: () => {
                this.isLoading = false;
            }
        });
    }

    public tapSearch(form: any) {
        this.queries = this.searchService.getQueries(form, this.queries);
        this.tapRefresh();
    }

    public tapPage() {
        this.goPage(this.queries.page);
    }

    public tapReview(ctl: SwiperEvent, item: IBlog, status: number) {
        this.service.blogChange({
            id: item.id,
            status
        }).subscribe(_ => {
            item.status = status;
            ctl.next();
        });
    }

    public tapRemove(item: IBlog) {
        this.toastrService.confirm('确定要删除《' + item.title + '》?', () => {
            this.service.blogRemove(item.id).subscribe(res => {
                if (!res.data) {
                    return;
                }
                this.toastrService.success($localize `Delete Successfully`);
                this.items = this.items.filter(it => {
                    return it.id !== item.id;
                });
            });
        });
    }

}
