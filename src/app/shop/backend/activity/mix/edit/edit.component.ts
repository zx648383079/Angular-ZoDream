import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { IActivity, IMixConfigure } from '../../../../../theme/models/shop';
import { ActivityService } from '../../activity.service';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditMixComponent implements OnInit {

    public form = this.fb.group({
        name: ['', Validators.required],
        thumb: [''],
        description: [''],
        scope: [[], Validators.required],
        scope_type: [0],
        start_at: [''],
        end_at: [],
        configure: this.fb.group({
            price: 0
        }),
        items: this.fb.array([]),
    });

    public data: IActivity<IMixConfigure>;

    constructor(
        private service: ActivityService,
        private fb: FormBuilder,
        private route: ActivatedRoute,
        private toastrService: ToastrService,
    ) { }

    get goodsItems() {
        return this.form.get('items') as FormArray;
    }

    ngOnInit() {
        this.route.params.subscribe(params => {
            if (!params.id) {
                return;
            }
            this.service.mix(params.id).subscribe(res => {
                this.data = res;
                this.form.patchValue({
                    name: res.name,
                    thumb: res.thumb,
                    description: res.description,
                    scope_type: res.scope_type,
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
        this.service.mixSave(data).subscribe(_ => {
            this.toastrService.success('保存成功');
            this.tapBack();
        });
    }

    public tapRemoveItem(i: number) {
        this.goodsItems.removeAt(i);
    }

    public tapAddItem() {
        this.goodsItems.push(this.fb.group({
            goods_id: 0,
            amount: 0,
            price: 0,
        }));
    }

}
