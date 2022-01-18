import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DialogBoxComponent, DialogService } from '../../../dialog';
import { IPageQueries } from '../../../theme/models/page';
import { IUser } from '../../../theme/models/user';
import { applyHistory, getQueries } from '../../../theme/query';
import { ICategoryUser } from '../../model';
import { OnlineBackendService } from '../online.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {

    public items: ICategoryUser[] = [];
    public hasMore = true;
    public isLoading = false;
    public total = 0;
    public queries: IPageQueries = {
        page: 1,
        per_page: 20,
        keywords: '',
        category: 0,
    };
    public users: IUser[] = [];

    constructor(
        private service: OnlineBackendService,
        private toastrService: DialogService,
        private route: ActivatedRoute,
    ) { }

    ngOnInit() {
        this.route.params.subscribe(params => {
            if (params.category) {
                this.queries.category = parseInt(params.category, 10);
            }
        });
        this.route.queryParams.subscribe(params => {
            this.queries = getQueries(params, this.queries);
            this.tapPage();
        });
    }

    public open(modal: DialogBoxComponent) {
        this.users = [];
        modal.open(() => {
            this.service.userAdd({
                category: this.queries.category,
                user: this.users.map(i => i.id)
            }).subscribe(_ => {
                this.toastrService.success('添加客服成功');
                this.tapPage();
            });
        }, () => this.users.length > 0);
    }

    public tapSearch(form: any) {
        this.queries = getQueries(form, this.queries);
        this.tapRefresh();
    }

    public tapRefresh() {
        this.goPage(1);
    }

    public tapPage() {
        this.goPage(this.queries.page);
    }

    public tapMore() {
        this.goPage(this.queries.page + 1);
    }

    public goPage(page: number) {
        if (this.isLoading) {
            return;
        }
        this.isLoading = true;
        const queries = {...this.queries, page};
        this.service.userList(queries).subscribe({
            next: res => {
                this.items = res.data;
                this.hasMore = res.paging.more;
                this.total = res.paging.total;
                applyHistory(this.queries = queries);
            },
            complete: () => {
                this.isLoading = false;
            }
        });
    }

    public tapRemove(item: ICategoryUser) {
        this.toastrService.confirm('确定删除“' + item.user.name + '”客服人员？', () => {
            this.service.userRemove({
                user: item.user_id,
                category: item.cat_id,
            }).subscribe(res => {
                if (!res.data) {
                    return;
                }
                this.toastrService.success('删除成功');
                this.tapPage();
            });
        });
    }

}
