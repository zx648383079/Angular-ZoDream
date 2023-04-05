import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DialogService } from '../../../../components/dialog';
import { emptyValidate } from '../../../../theme/validators';
import { FinanceService } from '../../finance.service';
import { IAccount, IBudget, IConsumptionChannel, IFinancialProject, ILog } from '../../model';

@Component({
  selector: 'app-edit-income',
  templateUrl: './edit-income.component.html',
  styleUrls: ['./edit-income.component.scss']
})
export class EditIncomeComponent implements OnInit {

    public data: ILog = {
        id: 0,
        type: 0,
        money: 0,
        frozen_money: 0,
        account_id: 0,
        channel_id: 0,
        project_id: 0,
        budget_id: 0,
        remark: '',
        happened_at: '',
        trading_object: '',
    } as any;
    public typeItems = ['支出', '收入', '借出', '借入'];
    public accountItems: IAccount[] = [];
    public channelItems: IConsumptionChannel[] = [];
    public projectItems: IFinancialProject[] = [];
    public budgetItems: IBudget[] = [];
    public mode = 0;
    public dayData = {
        day: '',
        account_id: 0,
        channel_id: 0,
        budget_id: 0,
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
    };

    constructor(
        private service: FinanceService,
        private route: ActivatedRoute,
        private toastrService: DialogService,
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
        this.route.params.subscribe(params => {
            if (!params.id) {
                return;
            }
            this.service.log(params.id).subscribe(res => {
                this.data = res;
            });
        });
    }

    public tapBack() {
        history.back();
    }

    public toggleMode(mode: number) {
        this.mode = mode;
    }

    public tapSubmit() {
        if (this.mode < 1) {
            this.saveLog();
            return;
        }
        if (emptyValidate(this.dayData.day) || this.dayData.account_id < 1) {
            this.toastrService.warning($localize `Incomplete filling of the form`);
            return;
        }
        this.service.logDaySave(this.dayData).subscribe(_ => {
            this.toastrService.success($localize `Save Successfully`);
            this.tapBack();
        });
    }

    private saveLog() {
        if (emptyValidate(this.data.happened_at) || this.data.account_id < 1) {
            this.toastrService.warning($localize `Incomplete filling of the form`);
            return;
        }
        this.service.logSave(this.data).subscribe(_ => {
            this.toastrService.success($localize `Save Successfully`);
            this.tapBack();
        });
    }

}
