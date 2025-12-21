import { form } from '@angular/forms/signals';
import { Component, OnInit, inject, signal } from '@angular/core';
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
    private readonly service = inject(BlogService);
    private readonly toastrService = inject(DialogService);
    private readonly route = inject(ActivatedRoute);
    private readonly searchService = inject(SearchService);


    public categories: ICategory[] = [];
    public statusItems: IItem[] = [];

    public readonly items = signal<IBlog[]>([]);
    public readonly queries = form(signal({
        keywords: '',
        term: '0',
        status: '0',
        page: 1,
        per_page: 20,
    }));
    private hasMore = true;
    public readonly isLoading = signal(false);
    public readonly total = signal(0);
    public readonly isReview = signal(false);

    constructor() {
        this.service.editOption().subscribe(res => {
            this.categories = res.categories;
            this.statusItems = res.publish_status;
        });
    }

    ngOnInit() {
        this.route.queryParams.subscribe(res => {
            this.searchService.getQueries(res, this.queries);
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

    public toggleReview() {
        this.isReview.update(v => !v);
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

    public goPage(page: number) {
        if (this.isLoading) {
            return;
        }
        this.isLoading.set(true);
        const queries = {...this.queries().value(), page};
        this.service.getPage(queries).subscribe({
            next: res => {
                this.hasMore = res.paging.more;
                this.isLoading.set(false);
                this.items.set(res.data);
                this.total.set(res.paging.total);
                this.searchService.applyHistory(queries);
                this.queries().value.set(queries);
            },
            error: () => {
                this.isLoading.set(false);
            }
        });
    }

    public tapSearch() {

        this.tapRefresh();
    }

    public tapPage() {
        this.goPage(this.queries.page().value());
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
                this.items.update(v => {
                    return v.filter(it => {
                        return it.id !== item.id;
                    });
                });
            });
        });
    }

}
