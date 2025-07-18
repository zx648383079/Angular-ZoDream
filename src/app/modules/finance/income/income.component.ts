import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DialogService } from '../../../components/dialog';
import { DialogBoxComponent } from '../../../components/dialog';
import { UploadButtonEvent } from '../../../components/form';
import { PanelAnimation } from '../../../theme/constants/panel-animation';
import { IPageQueries } from '../../../theme/models/page';
import { SearchService } from '../../../theme/services';
import { DownloadService } from '../../../theme/services';
import { emptyValidate } from '../../../theme/validators';
import { FinanceService } from '../finance.service';
import { IAccount, IBudget, IConsumptionChannel, IFinancialProject, ILog } from '../model';
import { mapFormat } from '../../../theme/utils';

@Component({
    standalone: false,
    selector: 'app-finance-income',
    templateUrl: './income.component.html',
    styleUrls: ['./income.component.scss'],
    animations: [
        PanelAnimation,
    ]
})
export class IncomeComponent implements OnInit {

    public items: ILog[] = [];
    public hasMore = true;
    public isLoading = false;
    public total = 0;
    public queries: IPageQueries = {
        keywords: '',
        type: 0,
        account: 0,
        project: 0,
        channel: 0,
        budget: 0,
        start_at: '',
        end_at: '',
        page: 1,
        per_page: 20,
    };

    public typeItems = ['全部', '支出', '收入', '借出', '借入'];
    public accountItems: IAccount[] = [];
    public channelItems: IConsumptionChannel[] = [];
    public projectItems: IFinancialProject[] = [];
    public budgetItems: IBudget[] = [];
    public panelOpen = false;

    public previewData: ILog = {} as any;
    public editData = {
        keywords: '',
        account_id: 0,
        channel_id: 0,
        project_id: 0,
        budget_id: 0,
        count: 0,
    };

    constructor(
        private service: FinanceService,
        private toastrService: DialogService,
        private downloadService: DownloadService,
        private route: ActivatedRoute,
        private searchService: SearchService,
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
        this.route.queryParams.subscribe(params => {
            this.queries = this.searchService.getQueries(params, this.queries);
            this.tapPage();
        });
    }

    public tapBack() {
        history.back();
    }

    public formatType(val: number) {
        return mapFormat(val, ['支', '收', '借', '还']);
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

    /**
     * goPage
     */
    public goPage(page: number) {
        if (this.isLoading) {
            return;
        }
        this.isLoading = true;
        const queries = {...this.queries, page};
        this.service.logList(queries).subscribe({
            next: res => {
                this.items = res.data;
                this.hasMore = res.paging.more;
                this.total = res.paging.total;
                this.isLoading = false;
                this.searchService.applyHistory(this.queries = queries);
            },
            error: () => {
                this.isLoading = false;
            }
        });
    }

    public tapSearch(form: any) {
        this.queries = this.searchService.getQueries(form, this.queries);
        this.panelOpen = false;
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
            this.toastrService.success($localize `Delete Successfully`);
            this.items = this.items.filter(it => {
                return it.id !== item.id;
            });
        });
    }

    public tapExport() {
        this.downloadService.export('finance/log/export', {}, '流水记录.xlsx');
    }

    public tapImport(event: UploadButtonEvent) {
        const form = new FormData();
        form.append('file', event.files[0]);
        event.enter();
        this.service.logImport(form).subscribe({
            next: _ => {
                event.reset();
                this.tapRefresh();
                this.toastrService.success('导入成功');
            },
            error: err => {
                event.reset();
                this.toastrService.error(err);
            }
        });
    }

    public tapBatch(modal: DialogBoxComponent) {
        this.editData.keywords = '';
        modal.open(() => {
            this.service.logBatchEdit(this.editData).subscribe({
                next: res => {
                    this.toastrService.success(res.message);
                },
                error: err => {
                    this.toastrService.error(err);
                }
            });
        }, () => {
            return !emptyValidate(this.editData.keywords);
        });
    }

    public tapPreview(modal: DialogBoxComponent, item: ILog) {
        this.previewData = item;
        modal.open();
    }

    public onEditKeywords() {
        if (emptyValidate(this.editData.keywords)) {
            this.editData.count = 0;
            return;
        }
        this.service.logCount({
            keywords: this.editData.keywords
        }).subscribe(res => {
            this.editData.count = res.data;
        });
    }

    public formatAccount(id: number) {
        return this.formatNameFrom(id, this.accountItems);
    }

    public formatChannel(id: number) {
        return this.formatNameFrom(id, this.channelItems);
    }

    public formatProject(id: number) {
        return this.formatNameFrom(id, this.projectItems);
    }

    public formatBudget(id: number) {
        return this.formatNameFrom(id, this.budgetItems);
    }

    private formatNameFrom(id: number, items: any[]) {
        if (id < 1) {
            return '-';
        }
        for (const item of items) {
            if (item.id === id) {
                return item.name;
            }
        }
        return '[x]';
    }

}
