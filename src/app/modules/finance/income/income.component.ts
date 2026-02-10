import { form, required } from '@angular/forms/signals';
import { Location } from '@angular/common';
import { Component, OnInit, computed, effect, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DialogEvent, DialogService } from '../../../components/dialog';
import { ButtonEvent, UploadButtonEvent } from '../../../components/form';
import { SearchService, ThemeService } from '../../../theme/services';
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
    private readonly themeService = inject(ThemeService);
    private readonly location = inject(Location);

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
        page: 1,
        per_page: 20,
    }));

    public readonly typeItems = ['全部', '支出', '收入', '借出', '借入'];
    public readonly accountItems = signal<IAccount[]>([]);
    public readonly channelItems = signal<IConsumptionChannel[]>([]);
    public readonly projectItems = signal<IFinancialProject[]>([]);
    public readonly budgetItems = signal<IBudget[]>([]);
    public readonly panelVisible = signal(false);
    public readonly menuVisible = signal(false);

    public readonly previewModel = signal<ILog>(null);
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

    public readonly groupItems = signal<ILogGroup[]>([]);

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
        this.location.back();
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
                this.searchService.applyHistory(queries, !isTablet);
                this.hasMore.set(res.paging.more);
                this.total.set(res.paging.total);
                this.groupItems.set(this.formatGroup());
                this.isLoading.set(false);
                this.queries().value.set(queries);
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

    public tapExport(event?: ButtonEvent) {
        event?.enter();
        this.downloadService.export('finance/log/export', {}, '流水记录.xlsx').subscribe({
            next: _ => {
                event?.reset();
            },
            error: err => {
                event?.reset();
                this.toastrService.error(err);
            }
        });
    }

    public tapImport(event: UploadButtonEvent) {
        const form = new FormData();
        form.append('file', event.files[0]);
        event.enter();
        this.service.logImport(form).subscribe({
            next: res => {
                event.reset();
                this.tapRefresh();
                this.toastrService.success(res.message ?? '导入成功');
            },
            error: err => {
                event.reset();
                this.toastrService.error(err);
            }
        });
    }

    public tapBatch(modal: DialogEvent) {
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
