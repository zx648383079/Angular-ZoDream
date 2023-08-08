import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DialogService } from '../../../../components/dialog';
import { IPageQueries } from '../../../../theme/models/page';
import { SearchService } from '../../../../theme/services';
import { CateringService } from '../../catering.service';
import { ICateringStaff, ICateringStaffRole } from '../../model';
import { InviteDialogComponent } from './dialog/invite-dialog.component';
import { RoleDialogComponent } from './role/role-dialog.component';

@Component({
  selector: 'app-staff',
  templateUrl: './staff.component.html',
  styleUrls: ['./staff.component.scss']
})
export class StaffComponent implements OnInit {

    @ViewChild(RoleDialogComponent)
    private roleModal: RoleDialogComponent;
    @ViewChild(InviteDialogComponent)
    private inviteModal: InviteDialogComponent;

    public items: ICateringStaff[] = [];
    public hasMore = true;
    public isLoading = false;
    public total = 0;
    public queries: IPageQueries = {
        keywords: '',
        page: 1,
        per_page: 20
    };
    public categoryItems: ICateringStaffRole[] = [];

    constructor(
        private service: CateringService,
        private toastrService: DialogService,
        private route: ActivatedRoute,
        private searchService: SearchService,
    ) { }

    ngOnInit() {
        this.service.merchantStaffRole().subscribe(res => {
            this.categoryItems = res.data;
        });
        this.route.queryParams.subscribe(params => {
            this.queries = this.searchService.getQueries(params, this.queries);
            this.tapPage();
        });
    }

    public tapEditCategory(item?: ICateringStaffRole) {
        const data = item ? {...item} : {
            name: '',
            description: '',
            action: '',
        };
        this.roleModal.open(data as any, value => {
            this.service.merchantStaffRoleSave(value).subscribe(res => {
                if (item) {
                    this.categoryItems = this.categoryItems.map(i => {
                        return i.id == res.id ? res : i;
                    });
                } else {
                    this.categoryItems.push(res);
                }
            });
        });
    }

    public tapRemoveCategory(item: ICateringStaffRole) {
        this.service.merchantStaffRoleRemove(item.id).subscribe(_ => {
            this.categoryItems = this.categoryItems.filter(i => i.id !== item.id);
        });
    }

    public tapAdd() {
        this.inviteModal.open();
    }

    public tapSearch(form: any) {
        this.queries = this.searchService.getQueries(form, this.queries);
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
        this.service.merchantStaffList(queries).subscribe({
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

}
