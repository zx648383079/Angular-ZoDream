import { Component, OnInit, inject } from '@angular/core';
import { DialogService } from '../../../../components/dialog';
import { IRole } from '../../../../theme/models/auth';
import { RoleService } from './role.service';

@Component({
    standalone: false,
  selector: 'app-role',
  templateUrl: './role.component.html',
  styleUrls: ['./role.component.scss']
})
export class RoleComponent implements OnInit {
    private readonly service = inject(RoleService);
    private readonly toastrService = inject(DialogService);


    public items: IRole[] = [];

    public hasMore = true;

    public page = 1;

    public perPage = 20;

    public isLoading = false;

    public total = 0;

    public keywords = '';

    constructor() {
        this.tapRefresh();
    }

    ngOnInit() {}

    /**
     * tapRefresh
     */
    public tapRefresh() {
        this.goPage(1);
    }

    public tapPage() {
        this.goPage(this.page);
    }

    public tapMore() {
        this.goPage(this.page + 1);
    }

    /**
     * goPage
     */
    public goPage(page: number) {
        if (this.isLoading) {
            return;
        }
        this.isLoading = true;
        this.service.roleList({
            keywords: this.keywords,
            page,
            per_page: this.perPage
        }).subscribe(res => {
            this.isLoading = false;
            this.items = res.data;
            this.hasMore = res.paging.more;
            this.total = res.paging.total;
        });
    }

    public tapSearch(form: any) {
        this.keywords = form.keywords;
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
