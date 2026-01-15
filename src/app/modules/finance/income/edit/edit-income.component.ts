import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DialogService } from '../../../../components/dialog';
import { emptyValidate } from '../../../../theme/validators';
import { FinanceService } from '../../finance.service';
import { IAccount, IBudget, IConsumptionChannel, IFinancialProject } from '../../model';
import { form, required } from '@angular/forms/signals';
import { ButtonEvent } from '../../../../components/form';

@Component({
    standalone: false,
    selector: 'app-finance-edit-income',
    templateUrl: './edit-income.component.html',
    styleUrls: ['./edit-income.component.scss']
})
export class EditIncomeComponent implements OnInit {
    private readonly service = inject(FinanceService);
    private readonly route = inject(ActivatedRoute);
    private readonly toastrService = inject(DialogService);


    public readonly dataModel = signal({
        id: 0,
        type: 0,
        money: 0,
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
        required(schemaPath.account_id);
    });
    public typeItems = ['支出', '收入', '借出', '借入'];
    public readonly accountItems = signal<IAccount[]>([]);
    public readonly channelItems = signal<IConsumptionChannel[]>([]);
    public readonly projectItems = signal<IFinancialProject[]>([]);
    public readonly budgetItems = signal<IBudget[]>([]);
    public readonly mode = signal(0);

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
    }

    ngOnInit() {
        this.route.params.subscribe(params => {
            if (!params.id) {
                return;
            }
            this.service.log(params.id).subscribe(res => {
                this.dataModel.update(v => {
                    if (params.action !== 'clone') {
                        v.id = res.id;
                        v.happened_at = res.happened_at;
                    }
                    v.account_id = res.account_id as any;
                    v.type = res.type;
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
        history.back();
    }

    public toggleMode(mode: number) {
        this.mode.set(mode);
    }

    public tapSubmit(e?: ButtonEvent) {
        if (this.dataForm().invalid()) {
            return;
        }
        if (this.mode() < 1) {
            this.saveLog();
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

    private saveLog() {
        if (emptyValidate(this.dataForm.happened_at().value())) {
            this.toastrService.warning($localize `Incomplete filling of the form`);
            return;
        }
        this.service.logSave(this.dataForm().value()).subscribe(_ => {
            this.toastrService.success($localize `Save Successfully`);
            this.tapBack();
        });
    }

}
