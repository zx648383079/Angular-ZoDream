import { form } from '@angular/forms/signals';
import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DialogEvent, DialogService } from '../../../../components/dialog';
import { IPageQueries } from '../../../../theme/models/page';
import { IUser } from '../../../../theme/models/user';
import { SearchService } from '../../../../theme/services';
import { ICategoryUser } from '../../model';
import { OnlineBackendService } from '../online.service';

@Component({
    standalone: false,
    selector: 'app-user',
    templateUrl: './user.component.html',
    styleUrls: ['./user.component.scss']
})
export class UserComponent {
    private readonly service = inject(OnlineBackendService);
    private readonly toastrService = inject(DialogService);
    private readonly route = inject(ActivatedRoute);
    private readonly searchService = inject(SearchService);


    public readonly items = signal<ICategoryUser[]>([]);
    private hasMore = true;
    public readonly isLoading = signal(false);
    public readonly total = signal(0);
    public readonly queries = form(signal<IPageQueries>({
        page: 1,
        per_page: 20,
        keywords: '',
        category: 0,
    }));

    public readonly dataForm = form(signal({
        users: <IUser[]>[]
    }));

    constructor() {
        this.route.params.subscribe(params => {
            if (params.category) {
                this.queries.category().value.set(parseInt(params.category, 10));
            }
        });
        this.route.queryParams.subscribe(params => {
            this.queries().value.update(v => this.searchService.getQueries(params, v));
            this.tapPage();
        });
    }

    public open(modal: DialogEvent) {
        this.dataForm.users().value.set([]);
        modal.open(() => {
            this.service.userAdd({
                category: this.queries.category,
                user: this.dataForm.users().value().map(i => i.id)
            }).subscribe(_ => {
                this.toastrService.success('添加客服成功');
                this.tapPage();
            });
        }, () => this.dataForm.users().value().length > 0);
    }

    public tapSearch(e: Event) {
        e.preventDefault();
        this.tapRefresh();
    }

    public tapRefresh() {
        this.goPage(1);
    }

    public tapPage() {
        this.goPage(this.queries.page().value());
    }

    public tapMore() {
        this.goPage(this.queries.page().value() + 1);
    }

    public goPage(page: number) {
        if (this.isLoading()) {
            return;
        }
        this.isLoading.set(true);
        const queries = {...this.queries().value(), page};
        this.service.userList(queries).subscribe({
            next: res => {
                this.items.set(res.data);
                this.hasMore = res.paging.more;
                this.total.set(res.paging.total);
                this.queries().value.set(queries);
            this.searchService.applyHistory(queries, ['category']);
                this.isLoading.set(false);
            },
            error: () => {
                this.isLoading.set(false);
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
                this.toastrService.success($localize `Delete Successfully`);
                this.tapPage();
            });
        });
    }

}
