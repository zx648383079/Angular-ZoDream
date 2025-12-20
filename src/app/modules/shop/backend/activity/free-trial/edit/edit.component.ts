import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DialogService } from '../../../../../../components/dialog';
import { IActivity, IFreeTrialConfigure } from '../../../../model';
import { ActivityService } from '../../activity.service';
import { form, required } from '@angular/forms/signals';

@Component({
    standalone: false,
    selector: 'app-shop-free-trial-edit',
    templateUrl: './edit.component.html',
    styleUrls: ['./edit.component.scss']
})
export class EditFreeTrialComponent implements OnInit {
    private readonly service = inject(ActivityService);
    private readonly route = inject(ActivatedRoute);
    private readonly toastrService = inject(DialogService);


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
            amount: 0
        }
    });
    public readonly dataForm = form(this.dataModel, schemaPath => {
        required(schemaPath.name);
    });

    public data: IActivity<IFreeTrialConfigure>;

    ngOnInit() {
        this.route.params.subscribe(params => {
            if (!params.id) {
                return;
            }
            this.service.freeTrial(params.id).subscribe(res => {
                this.data = res;
                this.dataModel.set({
                    id: res.id,
                    name: res.name,
                    thumb: res.thumb,
                    description: res.description,
                    scope: res.scope as any,
                    scope_type: res.scope_type,
                    start_at: res.start_at as string,
                    end_at: res.end_at as string,
                    configure: {
                        amount: res.configure.amount
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
        this.service.freeTrialSave(data).subscribe(_ => {
            this.toastrService.success($localize `Save Successfully`);
            this.tapBack();
        });
    }

}
