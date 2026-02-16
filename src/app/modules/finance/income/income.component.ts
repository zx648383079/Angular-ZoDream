import { form, required } from '@angular/forms/signals';
import { Location } from '@angular/common';
import { Component, computed, effect, inject, signal, viewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DialogEvent, DialogService } from '../../../components/dialog';
import { FileUploadService, SearchService, ThemeService } from '../../../theme/services';
import { emptyValidate } from '../../../theme/validators';
import { FinanceService } from '../finance.service';
import { IAccount, IBudget, IConsumptionChannel, IFinancialProject, ILog, ILogGroup, LogTypeItems } from '../model';
import { formatDate } from '../../../theme/utils';
import { ProgressDialogComponent, UploadDialogComponent } from '../../../components/desktop';
import { IDataOne } from '../../../theme/models/page';
import { ArraySource } from '../../../components/form';

@Component({
    standalone: false,
    selector: 'app-finance-income',
    templateUrl: './income.component.html',
    styleUrls: ['./income.component.scss'],
})
export class IncomeComponent {
    private readonly service = inject(FinanceService);
    private readonly toastrService = inject(DialogService);
    private readonly uploadService = inject(FileUploadService);
    private readonly route = inject(ActivatedRoute);
    private readonly searchService = inject(SearchService);
    private readonly themeService = inject(ThemeService);
    private readonly location = inject(Location);


    private readonly uploadModal = viewChild(UploadDialogComponent);
    private readonly downloadModal = viewChild(ProgressDialogComponent);

    public readonly items = signal<ILog[]>([]);
    public readonly hasMore = signal(true);
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
        goto: '',
        page: 1,
        per_page: 20,
    }));

    public readonly typeItems = ['全部', ...LogTypeItems];
    public readonly accountItems = signal<IAccount[]>([]);
    public readonly channelItems = signal<IConsumptionChannel[]>([]);
    public readonly projectItems = signal<IFinancialProject[]>([]);
    public readonly budgetItems = signal<IBudget[]>([]);
    public readonly panelVisible = signal(false);
    public readonly menuVisible = signal(false);

    public readonly previewModel = signal<ILog>(null);
    public readonly editForm = form(signal({
        keywords: '',
        operator: 0,
        account_id: '',
        channel_id: '',
        project_id: '',
        budget_id: '',
        trading_object: '',
        count: 0,
    }), schemaPath => {
        required(schemaPath.keywords);
    });

    public readonly groupItems = signal<ILogGroup[]>([]);
    public readonly operateItems = ArraySource.fromOrder('编辑数据', '按月合并');

    public readonly queryPlaceholder = computed(() => {
        const value = this.queries.keywords().value();
        return value ? value : $localize `Input keywords to search logs`;
    });

    constructor() {
        this.service.batch({
            account: {},
            channel: {},
            project: {},
            budget: {}
        }).subscribe(res => {
            this.accountItems.set(res.account);
            this.channelItems.set(res.channel);
            this.projectItems.set(res.project);
            this.budgetItems.set(res.budget);
        });
        effect(() => {
            this.editForm.keywords().value();
            this.onEditKeywords();
        });
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
        this.location.back();
    }

    public tapGoto(time?: string) {
        this.queries().value.update(v => {
            if (time) {
                return {
                    keywords: '',
                    start_at: '',
                    end_at: '',
                    type: '0',
                    account: '0',
                    project: '0',
                    channel: '0',
                    budget: '0',
                    page: 1,
                    per_page: 20,
                    goto: time,
                };
            } else {
                v.goto = v.start_at;
                v.start_at = '';
                return v;
            }
        });
        
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

    /**
     * goPage
     */
    public goPage(page: number) {
        if (this.isLoading()) {
            return;
        }
        this.isLoading.set(true);
        const queries = {...this.queries().value(), page};
        this.service.logList(queries).subscribe({
            next: res => {
                const isTablet = this.themeService.tabletChanged.value;
                this.items.update(v => {
                    if (isTablet) {
                        return [...v, ...res.data]
                    }
                    return res.data;
                });
                this.hasMore.set(res.paging.more);
                this.total.set(res.paging.total);
                this.groupItems.set(this.formatGroup());
                this.isLoading.set(false);
                if (queries.goto) {
                    queries.page = res.paging.offset;
                    queries.per_page = res.paging.limit;
                    queries.goto = '';
                }
                this.queries().value.set(queries);
                this.searchService.applyHistory(queries, !isTablet);
            },
            error: () => {
                this.isLoading.set(false);
            }
        });
    }

    public tapSearch(e: Event) {
        e.preventDefault();
        this.panelVisible.set(false);
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
        this.menuVisible.set(false);
        const modal = this.downloadModal();
        this.uploadService.export('finance/log/export', {}, 
            '流水记录.xlsx', undefined, modal.open()).subscribe({
            next: _ => {
                modal.close();
            },
            error: err => {
                modal.close();
                this.toastrService.error(err);
            }
        });
    }

    public tapImport() {
        this.menuVisible.set(false);
        const modal = this.uploadModal();
        const ln$ = this.uploadModal().open(form => {
            this.uploadService.upload<IDataOne<boolean>>('finance/log/import', form, ln$).subscribe({
                next: res => {
                    modal.close();
                    this.tapRefresh();
                    this.toastrService.success(res.message ?? '导入成功');
                },
                error: err => {
                    modal.close();
                    this.toastrService.error(err);
                }
            });
        });
    }

    public tapBatch(modal: DialogEvent) {
        this.menuVisible.set(false);
        this.editForm.keywords().value.set('');
        modal.open(() => {
            this.service.logBatchEdit(this.editForm().value()).subscribe({
                next: res => {
                    this.toastrService.success(res.message);
                    this.tapRefresh();
                },
                error: err => {
                    this.toastrService.error(err);
                }
            });
        }, () => this.editForm().valid());
    }

    public tapPreview(modal: DialogEvent, item: ILog) {
        this.previewModel.set(item);
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
        return this.formatNameFrom(id, this.accountItems());
    }

    public formatChannel(id: number) {
        return this.formatNameFrom(id, this.channelItems());
    }

    public formatProject(id: number) {
        return this.formatNameFrom(id, this.projectItems());
    }

    public formatBudget(id: number) {
        return this.formatNameFrom(id, this.budgetItems());
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
