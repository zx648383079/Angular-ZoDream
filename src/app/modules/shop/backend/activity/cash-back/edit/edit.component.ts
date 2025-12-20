import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DialogService } from '../../../../../../components/dialog';
import { IActivity, ICashBackConfigure } from '../../../../model';
import { ActivityService } from '../../activity.service';
import { ActivityRuleItems } from '../../model';
import { form, required } from '@angular/forms/signals';
import { parseNumber } from '../../../../../../theme/utils';

@Component({
    standalone: false,
    selector: 'app-shop-cash-back-edit',
    templateUrl: './edit.component.html',
    styleUrls: ['./edit.component.scss']
})
export class EditCashBackComponent implements OnInit {
    private readonly service = inject(ActivityService);
    private readonly route = inject(ActivatedRoute);
    private readonly toastrService = inject(DialogService);


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

    public readonly selectUrl = computed(() => {
        switch (this.scopeType()) {
            case 2:
                return 'shop/admin/brand/search';
            case 1:
                return 'shop/admin/category/search';
            case 3:
                return 'shop/admin/goods/search';
            default:
                return null;
        }
    });

    ngOnInit() {
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
        history.back();
    }

    public tapSubmit() {
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
        this.service.cashBackSave(data).subscribe({
            next: _ => {
                this.toastrService.success($localize `Save Successfully`);
                this.tapBack();
            },
            error: err => {
                this.toastrService.error(err);
            }
        });
    }

}
