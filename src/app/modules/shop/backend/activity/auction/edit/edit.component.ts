import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DialogService } from '../../../../../../components/dialog';
import { IActivity, IAuctionConfigure } from '../../../../model';
import { ActivityService } from '../../activity.service';
import { form, required } from '@angular/forms/signals';

@Component({
    standalone: false,
    selector: 'app-shop-auction-edit',
    templateUrl: './edit.component.html',
    styleUrls: ['./edit.component.scss']
})
export class EditAuctionComponent implements OnInit {
    private readonly service = inject(ActivityService);
    private readonly route = inject(ActivatedRoute);
    private readonly toastrService = inject(DialogService);


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

    ngOnInit() {
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
        history.back();
    }

    public tapSubmit() {
        if (this.dataForm().invalid()) {
            this.toastrService.warning($localize `Incomplete filling of the form`);
            return;
        }
        const data: IActivity<IAuctionConfigure> = this.dataForm().value() as any;
        this.service.auctionSave(data).subscribe({
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
