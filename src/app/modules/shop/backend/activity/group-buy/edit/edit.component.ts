import { Component, inject, signal } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { DialogService } from '../../../../../../components/dialog';
import { IActivity, IGroupBuyConfigure, IGroupBuyStep } from '../../../../model';
import { ActivityService } from '../../activity.service';
import { form, required } from '@angular/forms/signals';
import { ButtonEvent } from '../../../../../../components/form';

@Component({
    standalone: false,
    selector: 'app-shop-group-buy-edit',
    templateUrl: './edit.component.html',
    styleUrls: ['./edit.component.scss']
})
export class EditGroupBuyComponent {
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
        scope_type: 0,
        start_at: '',
        end_at: '',
        configure: {
            deposit: 0,
            amount: 0,
            send_point: 0,
            min_users: 2,
            max_users: 0,
            step: <IGroupBuyStep[]>[]
        },
    });
    public readonly dataForm = form(this.dataModel, schemaPath => {
        required(schemaPath.name);
    });
    public readonly goodsSource = this.service.goodsSource();

    public data: IActivity<IGroupBuyConfigure>;

    constructor() {
        this.route.params.subscribe(params => {
            if (!params.id) {
                return;
            }
            this.service.groupBuy(params.id).subscribe(res => {
                this.data = res;
                this.dataModel.set({
                    id: res.id,
                    name: res.name,
                    thumb: res.thumb,
                    description: res.description,
                    scope: res.scope as any,
                    scope_type: res.scope_type,
                    start_at: res.start_at as string,
                    end_at: res.end_at as any,
                    configure: {
                        deposit: res.configure.deposit,
                        amount: res.configure.amount,
                        send_point: res.configure.send_point,
                        min_users: res.configure.min_users,
                        max_users: res.configure.max_users,
                        step: res.configure.step ?? [],
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
        const data: any = this.dataForm().value();
        if (data.step) {
            data.configure.step = data.step;
        }
        e?.enter();
        this.service.groupBuySave(data).subscribe({
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

    public tapRemoveStep(i: number) {
        this.dataForm.configure.step().value.update(v => {
            v.splice(i, 1);
            return [...v];
        });
    }

    public tapAddStep() {
        this.dataForm.configure.step().value.update(v => {
            v.push({
                amount: 0,
                price: 0
            });
            return [...v];
        });
    }

}
