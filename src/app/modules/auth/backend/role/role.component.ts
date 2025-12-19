import { Component, inject, signal } from '@angular/core';
import { DialogService } from '../../../../components/dialog';
import { IRole } from '../../../../theme/models/auth';
import { RoleService } from './role.service';
import { form } from '@angular/forms/signals';

@Component({
    standalone: false,
    selector: 'app-role',
    templateUrl: './role.component.html',
    styleUrls: ['./role.component.scss']
})
export class RoleComponent {
    private readonly service = inject(RoleService);
    private readonly toastrService = inject(DialogService);

    public readonly queries = form(signal({
        keywords: '',
        page: 1,
        per_page: 20
    }));

    public items: IRole[] = [];
    public hasMore = true;
    public isLoading = false;
    public total = 0;

    constructor() {
        this.tapRefresh();
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
        this.service.roleList(queries).subscribe({
            next: res => {
                this.isLoading = false;
                this.items = res.data;
                this.hasMore = res.paging.more;
                this.total = res.paging.total;
                this.queries().value.set(queries);
            },
            error: _ => {
                this.isLoading = false;
            }
        });
    }

    public tapSearch() {
        this.tapRefresh();
    }

    public tapRemove(item: IRole) {
        this.toastrService.confirm({
            title: '确定删除“' + item.display_name + '”角色？',
            onConfirm: () => {
                this.service.permissionRemove(item.id).subscribe(res => {
                    if (!res.data) {
                        return;
                    }
                    this.toastrService.success($localize `Delete Successfully`);
                    this.items = this.items.filter(it => {
                        return it.id !== item.id;
                    });
                });
            }
        });
    }

}
