import { Component, OnInit } from '@angular/core';
import { DialogBoxComponent } from '../../../../theme/components';
import { IApplyLog } from '../../../../theme/models/auth';
import { AuthService } from '../../auth.service';

@Component({
  selector: 'app-apply-log',
  templateUrl: './apply-log.component.html',
  styleUrls: ['./apply-log.component.scss']
})
export class ApplyLogComponent implements OnInit {

    public items: IApplyLog[] = [];

    public hasMore = true;

    public page = 1;

    public perPage = 20;

    public isLoading = false;

    public total = 0;

    public keywords = '';

    public editData: IApplyLog = {} as any;

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
        this.service.applyLogList({
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

    public tapView(modal: DialogBoxComponent, item: IApplyLog) {
        this.editData = item;
        this.service.userAccount(item.user_id).subscribe(res => {
            this.editData.user = res;
        });
        modal.openCustom(value => {
            this.service.applySave({
                id: this.editData.id,
                status: value
            }).subscribe(res => {
                item.status = res.status;
            });
        });
    }

}
