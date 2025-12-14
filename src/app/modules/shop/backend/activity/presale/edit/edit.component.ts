import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DialogService } from '../../../../../../components/dialog';
import { IActivity, IPreSaleConfigure } from '../../../../model';
import { ActivityService } from '../../activity.service';
import { form, required } from '@angular/forms/signals';

@Component({
    standalone: false,
    selector: 'app-shop-presale-edit',
    templateUrl: './edit.component.html',
    styleUrls: ['./edit.component.scss']
})
export class EditPresaleComponent implements OnInit {
    private readonly service = inject(ActivityService);
    private readonly route = inject(ActivatedRoute);
    private readonly toastrService = inject(DialogService);


    public readonly dataModel = signal({
        id: 0,
        name: '',
        thumb: '',
        description: '',
        scope: 0,
        scope_type: 0,
        start_at: '',
        end_at: '',
        configure: {
            final_start_at: '',
            final_end_at: '',
            ship_at: '',
            price_type: 0,
            price: 0,
            deposit: 0,
            deposit_scale: 1,
            deposit_scale_other: 0,
            step: [],
        }
    });
    public readonly dataForm = form(this.dataModel, schemaPath => {
        required(schemaPath.name);
        required(schemaPath.scope);
    });

    public data: IActivity<IPreSaleConfigure>;

    get stepItems() {
        return this.dataForm.step as FormArray;
    }

    get priceType() {
        return this.dataForm.configure.get('price_type').value;
    }

    get depositScale() {
        return this.dataForm.configure.get('deposit_scale').value;
    }

    ngOnInit() {
        this.route.params.subscribe(params => {
            if (!params.id) {
                return;
            }
            this.service.presale(params.id).subscribe(res => {
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
                });
                if (res.configure.step) {
                    // TODO
                }
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
        this.service.presaleSave(data).subscribe(_ => {
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
        required(schemaPath.scope);
    public readonly dataForm = form(this.dataModel, schemaPath => {
    public readonly dataForm = form(this.dataModel, schemaPath => {
    });
    }

}
