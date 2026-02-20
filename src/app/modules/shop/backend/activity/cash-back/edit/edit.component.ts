import { Component, computed, inject, signal } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { DialogService } from '../../../../../../components/dialog';
import { IActivity, ICashBackConfigure } from '../../../../model';
import { ActivityService } from '../../activity.service';
import { ActivityRuleItems } from '../../model';
import { form, required } from '@angular/forms/signals';
import { parseNumber } from '../../../../../../theme/utils';
import { ArraySource, ButtonEvent } from '../../../../../../components/form';
import { HttpClient } from '@angular/common/http';

@Component({
    standalone: false,
    selector: 'app-shop-cash-back-edit',
    templateUrl: './edit.component.html',
    styleUrls: ['./edit.component.scss']
})
export class EditCashBackComponent {
    private readonly service = inject(ActivityService);
    private readonly route = inject(ActivatedRoute);
    private readonly toastrService = inject(DialogService);
    private readonly location = inject(Location);

    public readonly dataModel = signal({
        id: 0,
        name: '',
        thumb: '',
        description: '',
        scope: [],
        scope_type: '0',
        start_at: '',
        end_at: '',
        configure: {
            money: 0,
            star: 0,
            order_amount: 0
        }
    });
    public readonly dataForm = form(this.dataModel, schemaPath => {
        required(schemaPath.name);
    });

    public data: IActivity<ICashBackConfigure>;
    public ruleItems = ActivityRuleItems;

    public readonly scopeType = computed(() => {
        return parseNumber(this.dataForm.scope_type().value());
    });

    public readonly scopeSource = computed(() => {
        switch (this.scopeType()) {
            case 2:
                return this.service.brandSource();
            case 1:
                return this.service.categorySource();
            case 3:
                return this.service.goodsSource();
            default:
                return ArraySource.empty;
        }
    });

    constructor() {
        this.route.params.subscribe(params => {
            if (!params.id) {
                return;
            }
            this.service.cashBack(params.id).subscribe(res => {
                this.data = res;
                this.dataModel.set({
                    id: res.id,
                    name: res.name,
                    thumb: res.thumb,
                    description: res.description,
                    scope: typeof res.scope === 'object' ? res.scope : res.scope.split(',') as any,
                    scope_type: res.scope_type as any,
                    start_at: res.start_at as string,
                    end_at: res.end_at as any,
                    configure: {
                        money: res.configure.money,
                        star: res.configure.star,
                        order_amount: res.configure.order_amount
                    }
                });
            });
        });
    }

    public tapBack() {
        this.location.back();
    }

    public tapSubmit2(e: SubmitEvent) {
        e.preventDefault();
        this.tapSubmit();
    }

    public tapSubmit(e?: ButtonEvent) {
        if (this.dataForm().invalid()) {
            this.toastrService.warning($localize `Incomplete filling of the form`);
            return;
        }
        const data: IActivity<any> = this.dataForm().value() as any;

        if (data.scope_type < 1) {
            data.scope =  '';
        } else if (typeof data.scope === 'object') {
            data.scope = (data.scope as number[]).join(',');
        }
        e?.enter();
        this.service.cashBackSave(data).subscribe({
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

}
