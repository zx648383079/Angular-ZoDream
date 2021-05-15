import { Component, OnInit } from '@angular/core';
import { DialogBoxComponent } from '../../../dialog';
import { IAdminLog } from '../../../theme/models/auth';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-admin-log',
  templateUrl: './admin-log.component.html',
  styleUrls: ['./admin-log.component.scss']
})
export class AdminLogComponent implements OnInit {

    public items: IAdminLog[] = [];

    public hasMore = true;

    public page = 1;

    public perPage = 20;

    public isLoading = false;

    public total = 0;

    public keywords = '';

    public editData: IAdminLog = {} as any;

    constructor(
        private service: AuthService,
    ) {
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
        this.service.adminLogList({
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

    public tapView(modal: DialogBoxComponent, item: IAdminLog) {
        this.editData = item;
        modal.open();
    }
}
