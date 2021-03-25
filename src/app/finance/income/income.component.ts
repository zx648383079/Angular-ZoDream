import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { DialogBoxComponent } from '../../theme/components';
import { DownloadService } from '../../theme/services';
import { emptyValidate } from '../../theme/validators';
import { FinanceService } from '../finance.service';
import { IAccount, IBudget, IConsumptionChannel, IFinancialProject, ILog } from '../model';

@Component({
  selector: 'app-income',
  templateUrl: './income.component.html',
  styleUrls: ['./income.component.scss']
})
export class IncomeComponent implements OnInit {

    public items: ILog[] = [];
    public hasMore = true;
    public page = 1;
    public perPage = 20;
    public isLoading = false;
    public total = 0;
    public keywords = '';
    public type = 0;
    public account = 0;
    public typeItems = ['全部', '支出', '收入', '借出', '借入'];
    public accountItems: IAccount[] = [];
    public channelItems: IConsumptionChannel[] = [];
    public projectItems: IFinancialProject[] = [];
    public budgetItems: IBudget[] = [];
    public editData = {
        keywords: '',
        account_id: 0,
        channel_id: 0,
        project_id: 0,
        budget_id: 0,
    };

    constructor(
        private service: FinanceService,
        private toastrService: ToastrService,
        private downloadService: DownloadService,
    ) {
        this.service.batch({
            account: {},
            channel: {},
            project: {},
            budget: {}
        }).subscribe(res => {
            this.accountItems = res.account;
            this.channelItems = res.channel;
            this.projectItems = res.project;
            this.budgetItems = res.budget;
        });
    }

    ngOnInit() {
        this.tapRefresh();
    }

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
        this.service.logList({
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
        this.keywords = form.keywords || '';
        this.type = form.type || 0;
        this.account = form.account || 0;
        this.tapRefresh();
    }

    public tapRemove(item: ILog) {
        if (!confirm('确定删除“' + item.id + '”流水记录？')) {
            return;
        }
        this.service.logRemove(item.id).subscribe(res => {
            if (!res.data) {
                return;
            }
            this.toastrService.success('删除成功');
            this.items = this.items.filter(it => {
                return it.id !== item.id;
            });
        });
    }

    public tapExport() {
        this.downloadService.export('finance/log/export', {}, '流水记录.xlsx');
    }

    public tapImport(modal: DialogBoxComponent) {
        modal.open();
    }

    public uploadFile(event: any) {
        const files = event.target.files as FileList;
        const form = new FormData();
        form.append('file', files[0]);
        this.service.logImport(form).subscribe(_ => {
            this.tapRefresh();
        });
    }

    public tapBatch(modal: DialogBoxComponent) {
        this.editData.keywords = '';
        modal.open(() => {
            this.service.logBatchEdit(this.editData).subscribe(res => {
                this.toastrService.success(res.message);
            });
        }, () => {
            return !emptyValidate(this.editData.keywords);
        });
    }

}
