import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { DialogService } from '../../../../../../components/dialog';
import { IActivity, IGroupBuyConfigure } from '../../../../model';
import { ActivityService } from '../../activity.service';

@Component({
    standalone: false,
  selector: 'app-shop-group-buy-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditGroupBuyComponent implements OnInit {

    public form = this.fb.group({
        name: ['', Validators.required],
        thumb: [''],
        description: [''],
        scope: [[], Validators.required],
        scope_type: [0],
        start_at: [''],
        end_at: [],
        configure: this.fb.group({
            deposit: 0,
            amount: 0,
            send_point: 0,
            min_users: 2,
            max_users: 0,
        }),
        step: this.fb.array([]),
    });

    public data: IActivity<IGroupBuyConfigure>;

    constructor(
        private service: ActivityService,
        private fb: FormBuilder,
        private route: ActivatedRoute,
        private toastrService: DialogService,
    ) { }

    get stepItems() {
        return this.form.get('step') as FormArray<FormGroup>;
    }

    ngOnInit() {
        this.route.params.subscribe(params => {
            if (!params.id) {
                return;
            }
            this.service.groupBuy(params.id).subscribe(res => {
                this.data = res;
                this.form.patchValue({
                    name: res.name,
                    thumb: res.thumb,
                    description: res.description,
                    scope: res.scope as any,
                    scope_type: res.scope_type,
                    start_at: res.start_at as string,
                    end_at: res.end_at,
                    step: this.fb.array(
                        res.configure.step.map(i => {
                            return this.fb.group(i);
                        })
                    ) as any
                });
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
        this.service.groupBuySave(data).subscribe(_ => {
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
