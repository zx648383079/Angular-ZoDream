import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IActivity, IWholesaleConfigure } from '../../../../model';
import { ActivatedRoute } from '@angular/router';
import { DialogService } from '../../../../../../components/dialog';
import { ActivityService } from '../../activity.service';
import { ButtonEvent } from '../../../../../../components/form';

@Component({
    selector: 'app-wholesale-edit',
    templateUrl: './wholesale-edit.component.html',
    styleUrls: ['./wholesale-edit.component.scss']
})
export class WholesaleEditComponent implements OnInit {

    public form = this.fb.group({
        name: ['', Validators.required],
        thumb: [''],
        description: [''],
        scope: [[], Validators.required],
        scope_type: [0],
        start_at: [''],
        end_at: [],
        step: this.fb.array([]),
    });

    public data: IActivity<IWholesaleConfigure>;

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
            this.service.wholesale(params.id).subscribe(res => {
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
                        res.configure.items.map(i => {
                            return this.fb.group(i);
                        })
                    ) as any
                });
            });
        });
    }

    public tapBack() {
        history.back();
    }

    public tapSubmit(e?: ButtonEvent) {
        if (this.form.invalid) {
            this.toastrService.warning($localize `Incomplete filling of the form`);
            return;
        }
        const data: any = Object.assign({}, this.form.value);
        if (this.data && this.data.id > 0) {
            data.id = this.data.id;
        }
        if (data.step) {
            data.configure.items = data.items;
        }
        e?.enter();
        this.service.wholesaleSave(data).subscribe({
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
        this.stepItems.removeAt(i);
    }

    public tapAddStep() {
        this.stepItems.push(this.fb.group({
            amount: 0,
            price: 0,
        }));
    }

}
