import { Component, inject, signal } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { DialogService } from '../../../../../../components/dialog';
import { IActivity, IAuctionConfigure } from '../../../../model';
import { ActivityService } from '../../activity.service';
import { form, required } from '@angular/forms/signals';
import { ButtonEvent } from '../../../../../../components/form';

@Component({
    standalone: false,
    selector: 'app-shop-auction-edit',
    templateUrl: './edit.component.html',
    styleUrls: ['./edit.component.scss']
})
export class EditAuctionComponent {
    private readonly service = inject(ActivityService);
    private readonly route = inject(ActivatedRoute);
    private readonly toastrService = inject(DialogService);
    private readonly location = inject(Location);

    public readonly dataModel = signal({
        id: 0,
        name: '',
        thumb: '',
        description: '',
        scope: 0,
        start_at: '',
        end_at: '',
        configure: {
            mode: '0',
            begin_price: 0,
            fixed_price: 0,
            step_price: 0,
            deposit: 0,
        }
    });
    public readonly dataForm = form(this.dataModel, schemaPath => {
        required(schemaPath.name);
        required(schemaPath.scope);
    });

    public data: IActivity<IAuctionConfigure>;

    constructor() {
        this.route.params.subscribe(params => {
            if (!params.id) {
                return;
            }
            this.service.auction(params.id).subscribe(res => {
                this.data = res;
                this.dataModel.set({
                    id: res.id,
                    name: res.name,
                    thumb: res.thumb,
                    description: res.description,
                    scope: res.scope as any,
                    start_at: res.start_at as string,
                    end_at: res.end_at as any,
                    configure: {
                        mode: res.configure.mode.toString(),
                        begin_price: res.configure.begin_price,
                        fixed_price: res.configure.fixed_price,
                        step_price: res.configure.step_price,
                        deposit: res.configure.deposit,
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
        const data: IActivity<IAuctionConfigure> = this.dataForm().value() as any;
        e?.enter();
        this.service.auctionSave(data).subscribe({
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
