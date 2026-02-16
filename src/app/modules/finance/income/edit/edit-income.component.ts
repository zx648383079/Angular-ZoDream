import { Component, DestroyRef, computed, inject, signal } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { DialogService, SearchDialogEvent } from '../../../../components/dialog';
import { emptyValidate } from '../../../../theme/validators';
import { FinanceService } from '../../finance.service';
import { IAccount, IBudget, IConsumptionChannel, IFinancialProject, ILog, LogTypeItems } from '../../model';
import { form, min, required, validate } from '@angular/forms/signals';
import { ArraySource, ButtonEvent } from '../../../../components/form';
import { ThemeService } from '../../../../theme/services';
import { mapFormat } from '../../../../theme/utils';

@Component({
    standalone: false,
    selector: 'app-finance-edit-income',
    templateUrl: './edit-income.component.html',
    styleUrls: ['./edit-income.component.scss']
})
export class EditIncomeComponent {
    private readonly service = inject(FinanceService);
    private readonly route = inject(ActivatedRoute);
    private readonly toastrService = inject(DialogService);
    private readonly themeService = inject(ThemeService);
    private readonly destroyRef = inject(DestroyRef);
    private readonly location = inject(Location);

    public readonly dataModel = signal({
        id: 0,
        type: 0,
        money: 0,
        parent_id: 0,
        frozen_money: 0,
        account_id: '',
        channel_id: '',
        project_id: '',
        budget_id: '',
        remark: '',
        happened_at: '',
        trading_object: '',
        day: '',
        breakfast: {
            time: '09:00',
            money: 0,
            remark: '早餐'
        },
        lunch: {
            time: '12:00',
            money: 0,
            remark: '午餐'
        },
        dinner: {
            time: '18:00',
            money: 0,
            remark: '晚餐'
        },
    });
    public readonly dataForm = form(this.dataModel, schemaPath => {
        required(schemaPath.account_id, {message: $localize `The account is required`});
        min(schemaPath.money, 0, {message: $localize `The money must be an integer.`});
        min(schemaPath.frozen_money, 0, {message: $localize `The frozen money must be an integer.`});
        required(schemaPath.happened_at, {
            message: $localize `The happened time is required.`,
            when: () => this.mode() === 0
        });
        validate(schemaPath.money, ({value, valueOf}) => {
            if (this.mode() > 0) {
                return null;
            }
            if (value() <= 0 && valueOf(schemaPath.frozen_money) <= 0) {
                return {
                    kind: 'money',
                    message: $localize `The money must be more than 0`,
                };
            }
            return null;
        });
    });
    public readonly parent = signal<ILog>(null);
    public readonly typeItems = ArraySource.fromOrder(...LogTypeItems);
    public readonly accountItems = signal<IAccount[]>([]);
    public readonly channelItems = signal<IConsumptionChannel[]>([]);
    public readonly projectItems = signal<IFinancialProject[]>([]);
    public readonly budgetItems = signal<IBudget[]>([]);
    public readonly action = signal('create');
    public readonly mode = signal(0);
    public readonly modeToggle = computed(() => {
        return this.action() === 'create';
    });
    public readonly title = computed(() => {
        switch(this.action()) {
            case 'repay':
                return mapFormat(this.dataForm.type().value(), ['偿还账款', '收回账款'], '<类型错误>') ;
            case 'bad':
                return '计提坏账';
            case 'edit':
                return '编辑流水';
            default:
                return '新增流水';
        }
    });
    

    constructor() {
        this.themeService.tabletIf(this.destroyRef);
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
        this.route.params.subscribe(params => {
            this.action.set(params.action || 'create');
            if (!params.id) {
                return;
            }
            this.service.log(params.id).subscribe(res => {
                if (params.action === 'repay') {
                    this.parent.set(res);
                } else {
                    this.parent.set(res.parent && params.action !== 'clone' ? res.parent : null);
                }
                this.dataModel.update(v => {
                    if (params.action === 'repay') {
                        return {...v, 
                            parent_id: res.id, type: res.type > 2 ? 0 : 1, 
                            money: res.money, 
                            remark: `还钱: ${res.remark}`, 
                            trading_object: res.trading_object};
                    }
                    if (params.action !== 'clone') {
                        v.id = res.id;
                        v.happened_at = res.happened_at;
                        v.parent_id = res.parent_id;
                    }
                    v.account_id = res.account_id as any;
                    v.type = res.type;
                    if (params.action === 'bad') {
                        v.type = 0;
                    }
                    v.money = res.money;
                    v.frozen_money = res.frozen_money;
                    v.channel_id = res.channel_id as any;
                    v.project_id = res.project_id as any;
                    v.budget_id = res.budget_id as any;
                    v.remark = res.remark;
                    v.trading_object = res.trading_object;
                    return {...v};
                });
            });
        });
    }

    public tapBack() {
        this.location.back();
    }

    public toggleMode(mode: number) {
        this.mode.set(mode);
    }

    public tapSubmit(e?: ButtonEvent, isContinue = false) {
        if (this.dataForm().invalid()) {
            return;
        }
        if (this.mode() < 1) {
            this.saveLog(e, isContinue);
            return;
        }
        if (emptyValidate(this.dataForm.day().value())) {
            this.toastrService.warning($localize `Incomplete filling of the form`);
            return;
        }
        e?.enter();
        this.service.logDaySave(this.dataForm().value()).subscribe({
            next: _ => {
                e?.reset();
                this.toastrService.success($localize `Save Successfully`);
                this.tapBack();
            },
            error: err => {
                e?.reset();
                this.toastrService.error(err);
            }
        });
    }

    private saveLog(e?: ButtonEvent, isContinue = false) {
        if (emptyValidate(this.dataForm.happened_at().value())) {
            this.toastrService.warning($localize `Incomplete filling of the form`);
            return;
        }
        this.service.logSave(this.dataForm().value()).subscribe({
            next: _ => {
                this.toastrService.success($localize `Save Successfully`);
                if (!isContinue) {
                    this.tapBack();
                    return;
                }
                this.tapResest();
            },
            error: err => {
                e?.reset();
                this.toastrService.error(err);
            }
        });
    }

    public tapResest() {
        this.action.set('create');
        this.dataForm().value.update(v => {
            v.id = 0;
            v.parent_id = 0;
            v.money = 0;
            v.frozen_money = 0;
            return {...v};
        });
    }

    public tapParent(model: SearchDialogEvent) {
        model.open(this.parent(), (data: ILog) => {
            this.parent.set(data);
            this.dataForm.parent_id().value.set(data.id);
        }, items => {
            const exclude = this.dataForm.id().value();
            if (!exclude) {
                return true;
            }
            return items.filter(i => i.id == exclude || i.parent_id == exclude).length === 0;
        });
    }

}
