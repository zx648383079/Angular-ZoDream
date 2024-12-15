import { Component, OnInit } from '@angular/core';
import { IMicro } from '../model';
import { IPageQueries } from '../../../theme/models/page';
import { MicroService } from './micro.service';
import { DialogService } from '../../../components/dialog';
import { ActivatedRoute } from '@angular/router';
import { SearchService } from '../../../theme/services';

@Component({
    standalone: false,
  selector: 'app-micro-member',
  templateUrl: './micro-member.component.html',
  styleUrls: ['./micro-member.component.scss']
})
export class MicroMemberComponent implements OnInit {

    public items: IMicro[] = [];
    public queries: IPageQueries = {
        keywords: '',
        page: 1,
        per_page: 20,
    };
    public hasMore = true;
    public isLoading = false;
    public total = 0;

    constructor(
        private service: MicroService,
        private toastrService: DialogService,
        private route: ActivatedRoute,
        private searchService: SearchService,
    ) {
    }

    ngOnInit() {
        this.route.queryParams.subscribe(res => {
            this.queries = this.searchService.getQueries(res, this.queries);
            this.tapPage();
        });
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
        this.service.microList(queries).subscribe({
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

    public tapRemove(item: IMicro) {
        this.toastrService.confirm($localize `Are you sure to delete the content?`, () => {
            this.service.microRemove(item.id).subscribe(res => {
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
