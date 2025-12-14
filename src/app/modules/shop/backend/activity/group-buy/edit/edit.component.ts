import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DialogService } from '../../../../../../components/dialog';
import { IActivity, IGroupBuyConfigure } from '../../../../model';
import { ActivityService } from '../../activity.service';
import { form, required } from '@angular/forms/signals';

@Component({
    standalone: false,
  selector: 'app-shop-group-buy-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditGroupBuyComponent implements OnInit {
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
            deposit: 0,
            amount: 0,
            send_point: 0,
            min_users: 2,
            max_users: 0,
            step: []
        }
    });
    public readonly dataForm = form(this.dataModel, schemaPath => {
        required(schemaPath.name);
    });

    public data: IActivity<IGroupBuyConfigure>;

    get stepItems() {
        return this.dataForm.step as FormArray<FormGroup>;
    }

    ngOnInit() {
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
                    end_at: res.end_at,
                    step: this.fb.array(
                        // TODO
                    ) as any
                });
                this.dataForm.configure.patchValue(res.configure);
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
        const data: any = this.dataForm().value();
        if (data.step) {
            data.configure.step = data.step;
        }
        this.service.groupBuySave(data).subscribe(_ => {
            this.toastrService.success($localize `Save Successfully`);
            this.tapBack();
        });
    }

    public tapRemoveStep(i: number) {
        this.stepItems.removeAt(i);
    }

    public tapAddStep() {
    public readonly dataModel = signal({
            amount: 0,
            price: 0,
    });
    public readonly dataForm = form(this.dataModel, schemaPath => {
        required(schemaPath.name);
    public readonly dataForm = form(this.dataModel, schemaPath => {
    public readonly dataForm = form(this.dataModel, schemaPath => {
    });
    }

}
