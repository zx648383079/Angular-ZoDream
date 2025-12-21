import { form, required } from '@angular/forms/signals';
import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DialogService } from '../../../components/dialog';
import { DialogBoxComponent } from '../../../components/dialog';
import { UploadButtonEvent } from '../../../components/form';
import { IPageQueries } from '../../../theme/models/page';
import { SearchService } from '../../../theme/services';
import { DownloadService } from '../../../theme/services';
import { emptyValidate } from '../../../theme/validators';
import { FinanceService } from '../finance.service';
import { IAccount, IBudget, IConsumptionChannel, IFinancialProject, ILog, ILogGroup } from '../model';
import { formatDate, mapFormat } from '../../../theme/utils';

@Component({
    standalone: false,
    selector: 'app-finance-income',
    templateUrl: './income.component.html',
    styleUrls: ['./income.component.scss'],
})
export class IncomeComponent implements OnInit {
    private readonly service = inject(FinanceService);
    private readonly toastrService = inject(DialogService);
    private readonly downloadService = inject(DownloadService);
    private readonly route = inject(ActivatedRoute);
    private readonly searchService = inject(SearchService);


    public readonly items = signal<ILog[]>([]);
    private hasMore = true;
    public readonly isLoading = signal(false);
    public readonly total = signal(0);
    public readonly queries = form(signal({
        keywords: '',
        type: '0',
        account: '0',
        project: '0',
        channel: '0',
        budget: '0',
        start_at: '',
        end_at: '',
        page: 1,
        per_page: 20,
    }));

    public typeItems = ['全部', '支出', '收入', '借出', '借入'];
    public accountItems: IAccount[] = [];
    public channelItems: IConsumptionChannel[] = [];
    public projectItems: IFinancialProject[] = [];
    public budgetItems: IBudget[] = [];
    public panelOpen = false;

    public previewData: ILog = {} as any;
    public readonly editForm = form(signal({
        keywords: '',
        account_id: '',
        channel_id: '',
        project_id: '',
        budget_id: '',
        count: 0,
    }), schemaPath => {
        required(schemaPath.keywords);
    });

    public groupItems: ILogGroup[] = [];

    constructor() {
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
            this.queries().value.update(v => this.searchService.getQueries(params, v));
            this.tapPage();
        });
    }



    public formatGroup(): ILogGroup[] {
        const items: ILogGroup[] = [];
        let last: ILogGroup = null;
        for (const item of this.items()) {
            const current = formatDate(item.happened_at, 'yyyy-mm-dd');
            if (current !== last?.name)
            {
                items.push(last = {
                    name: current,
                    expenditure: 0,
                    income: 0,
                    items: []
                });
            }
            if (item.type % 2 === 1) {
                last.income += item.money;
            } else {
                last.expenditure += item.money;
            }
            last.items.push(item);
        }
        return items;
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
        this.isLoading.set(true);
        const queries = {...this.queries().value(), page};
        this.service.logList(queries).subscribe({
            next: res => {
                this.items.set(res.data);
                this.groupItems = this.formatGroup();
                this.hasMore = res.paging.more;
                this.total.set(res.paging.total);
                this.isLoading.set(false);
                this.searchService.applyHistory(queries);
                this.queries().value.set(queries);
            },
            error: () => {
                this.isLoading.set(false);
            }
        });
    }

    public tapSearch() {
        this.panelOpen = false;
        this.tapRefresh();
    }

    public tapRemove(item: ILog) {
        this.toastrService.confirm('确定删除“' + item.id + '”流水记录？', () => {
            this.service.logRemove(item.id).subscribe(res => {
                if (!res.data) {
                    return;
                }
                this.toastrService.success($localize `Delete Successfully`);
                this.items.update(v => {
                    return v.filter(it => {
                        return it.id !== item.id;
                    });
                });
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
        this.editForm.keywords().value.set('');
        modal.open(() => {
            this.service.logBatchEdit(this.editForm().value()).subscribe({
                next: res => {
                    this.toastrService.success(res.message);
                },
                error: err => {
                    this.toastrService.error(err);
                }
            });
        }, () => this.editForm().valid());
    }

    public tapPreview(modal: DialogBoxComponent, item: ILog) {
        this.previewData = item;
        modal.open();
    }

    public onEditKeywords() {
        const keywords = this.editForm.keywords().value();
        if (emptyValidate(keywords)) {
            this.editForm.count().value.set(0);
            return;
        }
        this.service.logCount({
            keywords
        }).subscribe(res => {
            this.editForm.count().value.set(res.data);
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
