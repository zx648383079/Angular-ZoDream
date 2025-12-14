import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DialogService } from '../../../../components/dialog';
import { emptyValidate } from '../../../../theme/validators';
import { FinanceService } from '../../finance.service';
import { IAccount, IBudget, IConsumptionChannel, IFinancialProject, ILog } from '../../model';
import { form, required } from '@angular/forms/signals';
import { parseNumber } from '../../../../theme/utils';

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
    public accountItems: IAccount[] = [];
    public channelItems: IConsumptionChannel[] = [];
    public projectItems: IFinancialProject[] = [];
    public budgetItems: IBudget[] = [];
    public mode = signal(0);

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
        this.route.params.subscribe(params => {
            if (!params.id) {
                return;
            }
            this.service.log(params.id).subscribe(res => {
                this.dataModel.update(v => {
                    v.id = res.id;
                    v.account_id = res.account_id as any;
                    v.type = res.type;
                    v.money = res.money;
                    v.frozen_money = res.frozen_money;
                    v.channel_id = res.channel_id as any;
                    v.project_id = res.project_id as any;
                    v.budget_id = res.budget_id as any;
                    v.remark = res.remark;
                    v.happened_at = res.happened_at;
                    v.trading_object = res.trading_object;
                    return v;
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

    public tapSubmit() {
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
        this.service.logDaySave(this.dataForm().value()).subscribe(_ => {
            this.toastrService.success($localize `Save Successfully`);
            this.tapBack();
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
