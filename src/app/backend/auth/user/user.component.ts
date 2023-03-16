import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { DialogEvent, DialogService } from '../../../components/dialog';
import { ButtonGroupEvent, IButton } from '../../../components/form';
import { AppState } from '../../../theme/interfaces';
import { IPageQueries } from '../../../theme/models/page';
import { IUser } from '../../../theme/models/user';
import { getUserRole } from '../../../theme/reducers/auth.selectors';
import { mapFormat } from '../../../theme/utils';
import { AuthService } from '../auth.service';
import { SearchService } from '../../../theme/services';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {

    public items: IUser[] = [];
    public hasMore = true;
    public isLoading = false;
    public total = 0;
    public queries: IPageQueries = {
        page: 1,
        keywords: '',
        per_page: 20,
        sort: 'id',
        order: 'desc',
    };

    public editable = false;
    public editData: any = {};
    public buttonItems: IButton[] = [
        {
            name: '明细',
            icon: 'icon-calendar',
            color: 'btn-info',
        },
        {
            name: '编辑',
            icon: 'icon-edit',
            color: 'btn-light',
        },
        {
            name: '拉黑',
            icon: 'icon-lock',
            color: 'btn-success',
        },
        {
            name: '权益卡',
            icon: 'icon-shield',
            color: 'btn-info',
        },
        {
            name: '删除',
            icon: 'icon-trash',
            color: 'btn-danger',
        },
    ];

    constructor(
        private service: AuthService,
        private route: ActivatedRoute,
        private router: Router,
        private toastrService: DialogService,
        private store: Store<AppState>,
        private searchService: SearchService
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

    public formatStatus(val: number) {
        if (val >= 10) {
            return '正常';
        }
        return mapFormat(val, [
            {name: '已删除', value: 0},
            {name: '已冻结', value: 2},
        ]);
    }

    public formatButtons(item: IUser) {
        return this.buttonItems.map((i, j) => {
            if (j !== 2) {
                return i;
            }
            return {...i, name: item.status === 2 ? '取消拉黑' : '拉黑'}
        });
    }

    public onActionTap(event: ButtonGroupEvent, item: IUser) {
        if (event.index < 1) {
            this.router.navigate(['account/log'], {queryParams: {user: item.id}, relativeTo: this.route});
            return;
        }
        if (event.index === 1) {
            this.router.navigate(['edit', item.id], {relativeTo: this.route});
            return;
        }
        if (event.index === 3) {
            this.router.navigate(['card', item.id], {relativeTo: this.route});
            return;
        }
        if (event.index > 3) {
            this.tapRemove(item);
            return;
        }
        const request = item.status != 2 ? this.service.ban(item.id) : this.service.banRemoveUser(item.id);
        event.enter();
        request.subscribe({
            next: _ => {
                event.reset();
                if (item.status != 2) {
                    this.toastrService.success('用户已拉黑');
                    item.status = 2;
                } else {
                    this.toastrService.success('用户已回复正常');
                    item.status = 10;
                }
            },
            error: err => {
                event.reset();
                this.toastrService.error(err);
            }
        })
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
        this.service.userList(queries).subscribe({
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
        this.queries.sort = 'id';
        this.tapRefresh();
    }

    public tapSort(key: string) {
        if (this.queries.sort === key) {
            this.queries.order = this.queries.order == 'desc' ? 'asc' : 'desc';
        } else {
            this.queries.sort = key;
            this.queries.order = 'desc';
        }
        this.tapRefresh();
    }

    public tapRemove(item: IUser) {
        if (!this.editable) {
            return;
        }
        if (!confirm('确定删除“' + item.name + '”用户？')) {
            return;
        }
        this.service.userRemove(item.id).subscribe(res => {
            if (!res.data) {
                return;
            }
            this.toastrService.success('删除成功');
            this.items = this.items.filter(it => {
                return it.id !== item.id;
            });
        });
    }

    public onVerify(item: IUser, modal: DialogEvent) {
        if (!item.is_verified) {
            this.service.userVerify({
                id: item.id,
            }).subscribe({
                next: _ => {},
            });
            return;
        }
        modal.open(() => {
            this.service.userVerify({
                id: item.id,
                id_card: this.editData.id_card
            }).subscribe({
                next: _ => {

                },
                error: err => {
                    this.toastrService.error(err);
                    item.is_verified = false;
                }
            });
        }, `为用户“${item.name}”添加实名信息`);
    }

}
