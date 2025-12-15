import { form } from '@angular/forms/signals';
import { Component, OnDestroy, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { DialogEvent, DialogService } from '../../../../components/dialog';
import { ButtonGroupEvent, IButton } from '../../../../components/form';
import { AppState } from '../../../../theme/interfaces';
import { IPageQueries } from '../../../../theme/models/page';
import { IUser } from '../../../../theme/models/user';
import { selectAuthRole } from '../../../../theme/reducers/auth.selectors';
import { mapFormat } from '../../../../theme/utils';
import { AuthService } from '../auth.service';
import { SearchService } from '../../../../theme/services';
import { Subscription } from 'rxjs';
import { AccountStatusItems } from '../../../../theme/models/auth';

@Component({
    standalone: false,
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit, OnDestroy {
    private readonly service = inject(AuthService);
    private readonly route = inject(ActivatedRoute);
    private readonly router = inject(Router);
    private readonly toastrService = inject(DialogService);
    private readonly store = inject<Store<AppState>>(Store);
    private readonly searchService = inject(SearchService);


    public items: IUser[] = [];
    public hasMore = true;
    public isLoading = false;
    public total = 0;
    public readonly queries = form(signal<IPageQueries>({
        page: 1,
        keywords: '',
        per_page: 20,
        sort: 'id',
        order: 'desc',
    }));

    public editable = false;
    public readonly editForm = form(signal<any>({}));
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
    private subItems = new Subscription();

    constructor() {
        this.subItems.add(this.store.select(selectAuthRole).subscribe(roles => {
            this.editable = roles.indexOf('user_manage') >= 0;
        }));
    }

    ngOnInit() {
        this.route.queryParams.subscribe(params => {
            this.queries().value.update(v => this.searchService.getQueries(params, v));
            this.tapPage();
        });
    }

    ngOnDestroy(): void {
        this.subItems.unsubscribe();
    }

    public formatStatus(val: number) {
        return mapFormat(val, AccountStatusItems);
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
            this.router.navigate([item.id], {relativeTo: this.route});
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
        this.goPage(this.queries.page().value());
    }

    public tapMore() {
        this.goPage(this.queries.page().value() + 1);
    }

    /**
     * goPage
     */
    public goPage(page: number) {
        if (this.isLoading) {
            return;
        }
        this.isLoading = true;
        const queries = {...this.queries().value(), page};
        this.service.userList(queries).subscribe({
            next: res => {
                this.items = res.data;
                this.hasMore = res.paging.more;
                this.total = res.paging.total;
                this.searchService.applyHistory(queries);
                this.queries().value.set(queries);
                this.isLoading = false;
            },
            error: () => {
                this.isLoading = false;
            }
        });
    }

    public tapSearch() {

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
            this.toastrService.success($localize `Delete Successfully`);
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
                id_card: this.editForm.id_card
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
