import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DialogService } from '../../../components/dialog';
import { IPlatform } from '../../../theme/models/open';
import { IPageQueries } from '../../../theme/models/page';
import { mapFormat } from '../../../theme/utils';
import { OpenService } from '../open.service';
import { SearchService } from '../../../theme/services';

@Component({
    standalone: false,
  selector: 'app-platform',
  templateUrl: './platform.component.html',
  styleUrls: ['./platform.component.scss']
})
export class PlatformComponent implements OnInit {
    private readonly service = inject(OpenService);
    private readonly route = inject(ActivatedRoute);
    private readonly toastrService = inject(DialogService);
    private searchService = inject(SearchService);


    public items: IPlatform[] = [];
    public hasMore = true;
    public isLoading = false;
    public total = 0;
    public queries: IPageQueries = {
        page: 1,
        per_page: 20,
        keywords: ''
    };
    public reviewable = false;

    ngOnInit() {
        this.route.queryParams.subscribe(params => {
            this.reviewable = window.location.href.indexOf('review') > 0;
            this.queries = this.searchService.getQueries(params, this.queries);
            this.tapPage();
        });
    }

    public formatStatus(val: number) {
        return mapFormat(val, [
            {name: '正常', value: 1},
            {name: '审核中', value: 9},
        ]);
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
        const cb = this.reviewable ? this.service.reviewList : this.service.platformList;
        cb.call(this.service, queries).subscribe(res => {
            this.isLoading = false;
            this.items = res.data;
            this.hasMore = res.paging.more;
            this.total = res.paging.total;
            this.searchService.applyHistory(this.queries = queries);
        });
    }

    public tapSearch(form: any) {
        this.queries = this.searchService.getQueries(form, this.queries);
        this.tapRefresh();
    }

    public tapRemove(item: any) {
        this.toastrService.confirm('确定删除“' + item.name + '”应用？', () => {
            const cb = this.reviewable ? this.service.reviewRemove : this.service.platformRemove;
            cb.call(this.service, item.id).subscribe(res => {
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
