import { Component, OnInit, inject } from '@angular/core';
import { FormArray, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { DialogService } from '../../../../../../components/dialog';
import { IActivity, IPreSaleConfigure } from '../../../../model';
import { ActivityService } from '../../activity.service';

@Component({
    standalone: false,
  selector: 'app-shop-presale-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditPresaleComponent implements OnInit {
    private service = inject(ActivityService);
    private fb = inject(FormBuilder);
    private route = inject(ActivatedRoute);
    private toastrService = inject(DialogService);


    public form = this.fb.group({
        name: ['', Validators.required],
        thumb: [''],
        description: [''],
        scope: [0, Validators.required],
        scope_type: [0],
        start_at: [''],
        end_at: [''],
        configure: this.fb.group({
            final_start_at: '',
            final_end_at: '',
            ship_at: '',
            price_type: 0,
            price: 0,
            deposit: 0,
            deposit_scale: 1,
            deposit_scale_other: 0,
        }),
        step: this.fb.array([]),
    });

    public data: IActivity<IPreSaleConfigure>;

    get stepItems() {
        return this.form.get('step') as FormArray;
    }

    get priceType() {
        return this.form.get('configure').get('price_type').value;
    }

    get depositScale() {
        return this.form.get('configure').get('deposit_scale').value;
    }

    ngOnInit() {
        this.route.params.subscribe(params => {
            if (!params.id) {
                return;
            }
            this.service.presale(params.id).subscribe(res => {
                this.data = res;
                this.form.patchValue({
                    name: res.name,
                    thumb: res.thumb,
                    description: res.description,
                    scope: res.scope as any,
                    scope_type: res.scope_type,
                    start_at: res.start_at as string,
                    end_at: res.end_at as string,
                });
                if (res.configure.step) {
                    res.configure.step.forEach(i => {
                        this.stepItems.push(this.fb.group(i))
                    });
                }
                this.form.get('configure').patchValue(res.configure);
            });
        });
    }

    public tapBack() {
        history.back();
    }

    public tapSubmit() {
        if (this.form.invalid) {
            this.toastrService.warning($localize `Incomplete filling of the form`);
            return;
        }
        const data: any = Object.assign({}, this.form.value);
        if (this.data && this.data.id > 0) {
            data.id = this.data.id;
        }
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
        this.stepItems.push(this.fb.group({
            amount: 0,
            price: 0,
        }));
    }

}
