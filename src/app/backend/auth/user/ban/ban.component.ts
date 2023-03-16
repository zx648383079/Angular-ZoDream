import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { DialogService } from '../../../../components/dialog';
import { AppState } from '../../../../theme/interfaces';
import { IBanAccount } from '../../../../theme/models/auth';
import { IPageQueries } from '../../../../theme/models/page';
import { getUserRole } from '../../../../theme/reducers/auth.selectors';
import { AuthService } from '../../auth.service';
import { SearchService } from '../../../../theme/services';

@Component({
  selector: 'app-ban',
  templateUrl: './ban.component.html',
  styleUrls: ['./ban.component.scss']
})
export class BanComponent implements OnInit {
    public items: IBanAccount[] = [];
    public hasMore = true;
    public isLoading = false;
    public total = 0;
    public queries: IPageQueries = {
        page: 1,
        keywords: '',
        per_page: 20,
    };
    public editable = false;


    constructor(
        private service: AuthService,
        private route: ActivatedRoute,
        private toastrService: DialogService,
        private store: Store<AppState>,
        private searchService: SearchService,
    ) {
        this.store.select(getUserRole).subscribe(roles => {
            this.editable = roles.indexOf('user_manage') >= 0;
        });
    }

    ngOnInit() {
        this.route.queryParams.subscribe(params => {
            this.queries = this.searchService.getQueries(params, this.queries);
            this.tapPage();
        });
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
        this.service.banList(queries).subscribe({
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

    public tapSearch(form: any) {
        this.queries = this.searchService.getQueries(form, this.queries);
        this.tapRefresh();
    }

    public tapRemove(item: IBanAccount) {
        if (!this.editable) {
            return;
        }
        this.toastrService.confirm('确定移除“' + item.item_key + '”？', () => {
            this.service.banRemove(item.id).subscribe(res => {
                if (!res.data) {
                    return;
                }
                this.toastrService.success('删除成功');
                this.items = this.items.filter(it => {
                    return it.id !== item.id;
                });
            });
        });
    }

}
