import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { DialogService } from '../../../../../dialog';
import { IActivity, IBargainConfigure } from '../../../../../theme/models/shop';
import { ActivityService } from '../../activity.service';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditBargainComponent implements OnInit {

    public form = this.fb.group({
        name: ['', Validators.required],
        thumb: [''],
        description: [''],
        scope: [0, Validators.required],
        start_at: [''],
        end_at: [],
        configure: this.fb.group({
            min: 0,
            max: 0,
            times: 0,
            amount: 0,
            shipping_fee: 0,
        }),
    });

    public data: IActivity<IBargainConfigure>;

    constructor(
        private service: ActivityService,
        private fb: FormBuilder,
        private route: ActivatedRoute,
        private toastrService: DialogService,
    ) { }

    ngOnInit() {
        this.route.params.subscribe(params => {
            if (!params.id) {
                return;
            }
            this.service.bargain(params.id).subscribe(res => {
                this.data = res;
                this.form.patchValue({
                    name: res.name,
                    thumb: res.thumb,
                    description: res.description,
                    scope: res.scope,
                    start_at: res.start_at,
                    end_at: res.end_at,
                    configure: this.fb.group(res.configure),
                });
            });
        });
    }

    public tapBack() {
        history.back();
    }

    public tapSubmit() {
        if (this.form.invalid) {
            this.toastrService.warning('表单填写不完整');
            return;
        }
        const data: IActivity<any> = Object.assign({}, this.form.value);
        if (this.data && this.data.id > 0) {
            data.id = this.data.id;
        }
        this.service.bargainSave(data).subscribe(_ => {
            this.toastrService.success('保存成功');
            this.tapBack();
        });
    }

}
